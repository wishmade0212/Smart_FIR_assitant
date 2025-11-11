#include <iostream>
#include <fstream>
#include <sstream>
#include <ctime>
#include "httplib.h"
#include "fir_store.hpp"
#include "ipc_store.hpp"
#include <json/json.h>

// Global stores
FIRStore firStore;
IPCStore ipcStore;

// User authentication
struct User {
    std::string password;
    std::string role;
    std::string name;
};

std::unordered_map<std::string, User> users = {
    {"admin", {"police123", "admin", "Police Admin"}},
    {"user", {"user123", "user", "Public User"}}
};

// Helper function to convert vector of FIRRecords to JSON array
Json::Value recordsToJson(const std::vector<FIRRecord*>& records) {
    Json::Value arr(Json::arrayValue);
    for (const auto* record : records) {
        arr.append(record->toJson());
    }
    return arr;
}

// Helper function to convert vector of IPCSections to JSON array
Json::Value sectionsToJson(const std::vector<IPCSection>& sections) {
    Json::Value arr(Json::arrayValue);
    for (const auto& section : sections) {
        arr.append(section.toJson());
    }
    return arr;
}

int main() {
    httplib::Server svr;

    // Enable CORS
    svr.set_base_dir("../");
    
    // POST /api/login
    svr.Post("/api/login", [](const httplib::Request& req, httplib::Response& res) {
        Json::Value reqJson;
        Json::Reader reader;
        reader.parse(req.body, reqJson);

        std::string username = reqJson["username"].asString();
        std::string password = reqJson["password"].asString();

        Json::Value response;
        if (users.find(username) != users.end() && users[username].password == password) {
            response["success"] = true;
            response["role"] = users[username].role;
            response["name"] = users[username].name;
        } else {
            response["success"] = false;
            response["message"] = "Invalid credentials";
        }

        Json::StreamWriterBuilder builder;
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_content(Json::writeString(builder, response), "application/json");
    });

    // POST /api/fir/create
    svr.Post("/api/fir/create", [](const httplib::Request& req, httplib::Response& res) {
        Json::Value reqJson;
        Json::Reader reader;
        reader.parse(req.body, reqJson);

        FIRRecord* record = new FIRRecord();
        record->id = reqJson.get("id", static_cast<int>(std::time(nullptr))).asInt();
        record->complainant = reqJson["complainant"].asString();
        record->suspect = reqJson["suspect"].asString();
        record->location = reqJson["location"].asString();
        record->description = reqJson["description"].asString();
        record->date = reqJson.get("date", "").asString();
        record->status = reqJson.get("status", "open").asString();

        for (const auto& tag : reqJson["tags"]) {
            record->tags.push_back(tag.asString());
        }

        for (const auto& relId : reqJson["relatedIds"]) {
            record->relatedIds.push_back(relId.asInt());
        }

        firStore.add(record);

        Json::Value response;
        response["success"] = true;
        response["record"] = record->toJson();

        Json::StreamWriterBuilder builder;
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_content(Json::writeString(builder, response), "application/json");
    });

    // GET /api/fir/:id
    svr.Get(R"(/api/fir/(\d+))", [](const httplib::Request& req, httplib::Response& res) {
        int id = std::stoi(req.matches[1]);
        FIRRecord* record = firStore.getById(id);

        Json::Value response;
        if (record) {
            response["success"] = true;
            response["record"] = record->toJson();
        } else {
            response["success"] = false;
            response["message"] = "Record not found";
        }

        Json::StreamWriterBuilder builder;
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_content(Json::writeString(builder, response), "application/json");
    });

    // GET /api/fir/search/complainant/:name
    svr.Get(R"(/api/fir/search/complainant/(.+))", [](const httplib::Request& req, httplib::Response& res) {
        std::string name = req.matches[1];
        auto records = firStore.searchComplainant(name);

        Json::Value response;
        response["success"] = true;
        response["records"] = recordsToJson(records);

        Json::StreamWriterBuilder builder;
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_content(Json::writeString(builder, response), "application/json");
    });

    // GET /api/fir/search/suspect/:name
    svr.Get(R"(/api/fir/search/suspect/(.+))", [](const httplib::Request& req, httplib::Response& res) {
        std::string name = req.matches[1];
        auto records = firStore.searchSuspect(name);

        Json::Value response;
        response["success"] = true;
        response["records"] = recordsToJson(records);

        Json::StreamWriterBuilder builder;
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_content(Json::writeString(builder, response), "application/json");
    });

    // GET /api/fir/status/:status
    svr.Get(R"(/api/fir/status/(open|closed))", [](const httplib::Request& req, httplib::Response& res) {
        std::string status = req.matches[1];
        auto records = firStore.listByStatus(status);

        Json::Value response;
        response["success"] = true;
        response["records"] = recordsToJson(records);

        Json::StreamWriterBuilder builder;
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_content(Json::writeString(builder, response), "application/json");
    });

    // GET /api/fir/stats
    svr.Get("/api/fir/stats", [](const httplib::Request& req, httplib::Response& res) {
        auto all = firStore.all();
        int total = all.size();
        int open = 0;
        for (const auto* record : all) {
            if (record->status == "open") open++;
        }

        Json::Value response;
        response["success"] = true;
        response["total"] = total;
        response["open"] = open;
        response["closed"] = total - open;

        Json::StreamWriterBuilder builder;
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_content(Json::writeString(builder, response), "application/json");
    });

    // GET /api/ipc/search/:keyword
    svr.Get(R"(/api/ipc/search/(.+))", [](const httplib::Request& req, httplib::Response& res) {
        std::string keyword = req.matches[1];
        auto sections = ipcStore.searchByKeyword(keyword);

        Json::Value response;
        response["success"] = true;
        response["sections"] = sectionsToJson(sections);

        Json::StreamWriterBuilder builder;
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_content(Json::writeString(builder, response), "application/json");
    });

    // GET /api/ipc/all
    svr.Get("/api/ipc/all", [](const httplib::Request& req, httplib::Response& res) {
        auto sections = ipcStore.getAll();

        Json::Value response;
        response["success"] = true;
        response["sections"] = sectionsToJson(sections);

        Json::StreamWriterBuilder builder;
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_content(Json::writeString(builder, response), "application/json");
    });

    // Load sample data
    svr.Post("/api/fir/load-sample", [](const httplib::Request& req, httplib::Response& res) {
        // Sample FIR records
        FIRRecord* r1 = new FIRRecord{1, "Alice Johnson", "Bob Lee", "2025-11-01", "Downtown", "Theft at shop", "open", {"theft"}, {2}};
        FIRRecord* r2 = new FIRRecord{2, "Carlos Mendez", "Unknown", "2025-10-15", "Uptown", "Vandalism", "closed", {"vandalism"}, {1}};
        FIRRecord* r3 = new FIRRecord{3, "John Doe", "Bob Lee", "2025-09-20", "Downtown", "Assault", "open", {"assault"}, {}};
        FIRRecord* r4 = new FIRRecord{4, "Jane Smith", "Samuel K", "2025-08-11", "West End", "Lost property", "open", {"lost"}, {}};

        firStore.add(r1);
        firStore.add(r2);
        firStore.add(r3);
        firStore.add(r4);

        Json::Value response;
        response["success"] = true;
        response["message"] = "Sample data loaded";

        Json::StreamWriterBuilder builder;
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_content(Json::writeString(builder, response), "application/json");
    });

    std::cout << "FIR Backend Server starting on http://localhost:8080" << std::endl;
    svr.listen("0.0.0.0", 8080);

    return 0;
}
