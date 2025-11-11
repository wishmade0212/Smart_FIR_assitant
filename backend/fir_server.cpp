/**
 * FIR Management System - C++ Backend Server
 * Handles FIR creation, storage, search, and retrieval
 * 
 * Compile: g++ -std=c++17 fir_server.cpp -o fir_server -lcurl -lpthread
 * Run: ./fir_server
 */

#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <unordered_map>
#include <memory>
#include <fstream>
#include <sstream>
#include <algorithm>
#include <chrono>
#include <ctime>
#include <iomanip>
#include <regex>
#include "httplib.h" // Simple HTTP library for C++
#include "json.hpp"  // JSON library for C++

using json = nlohmann::json;
using namespace std;
using namespace httplib;

// ========================================
// Data Structures (From OOP Concepts)
// ========================================

/**
 * FIR Record - Core data structure
 */
struct FIRRecord {
    string id;
    string district;
    string policeStation;
    string complainantName;
    string complainantFatherName;
    string complainantAddress;
    string complainantPhone;
    string complainantEmail;
    string dateOfIncident;
    string timeOfIncident;
    string placeOfIncident;
    string incidentDescription;
    string suspectName;
    string suspectAge;
    string suspectAddress;
    string suspectDescription;
    string propertyDescription;
    vector<string> ipcSections;
    string timestamp;
    string status; // "pending", "under_investigation", "closed"
    
    // Convert to JSON
    json toJSON() const {
        json j;
        j["id"] = id;
        j["district"] = district;
        j["policeStation"] = policeStation;
        j["complainantName"] = complainantName;
        j["complainantFatherName"] = complainantFatherName;
        j["complainantAddress"] = complainantAddress;
        j["complainantPhone"] = complainantPhone;
        j["complainantEmail"] = complainantEmail;
        j["dateOfIncident"] = dateOfIncident;
        j["timeOfIncident"] = timeOfIncident;
        j["placeOfIncident"] = placeOfIncident;
        j["incidentDescription"] = incidentDescription;
        j["suspectName"] = suspectName;
        j["suspectAge"] = suspectAge;
        j["suspectAddress"] = suspectAddress;
        j["suspectDescription"] = suspectDescription;
        j["propertyDescription"] = propertyDescription;
        j["ipcSections"] = ipcSections;
        j["timestamp"] = timestamp;
        j["status"] = status;
        return j;
    }
    
    // Create from JSON
    static FIRRecord fromJSON(const json& j) {
        FIRRecord fir;
        fir.id = j.value("id", "");
        fir.district = j.value("district", "");
        fir.policeStation = j.value("policeStation", "");
        fir.complainantName = j.value("complainantName", "");
        fir.complainantFatherName = j.value("complainantFatherName", "");
        fir.complainantAddress = j.value("complainantAddress", "");
        fir.complainantPhone = j.value("complainantPhone", "");
        fir.complainantEmail = j.value("complainantEmail", "");
        fir.dateOfIncident = j.value("dateOfIncident", "");
        fir.timeOfIncident = j.value("timeOfIncident", "");
        fir.placeOfIncident = j.value("placeOfIncident", "");
        fir.incidentDescription = j.value("incidentDescription", "");
        fir.suspectName = j.value("suspectName", "");
        fir.suspectAge = j.value("suspectAge", "");
        fir.suspectAddress = j.value("suspectAddress", "");
        fir.suspectDescription = j.value("suspectDescription", "");
        fir.propertyDescription = j.value("propertyDescription", "");
        if (j.contains("ipcSections") && j["ipcSections"].is_array()) {
            fir.ipcSections = j["ipcSections"].get<vector<string>>();
        }
        fir.timestamp = j.value("timestamp", "");
        fir.status = j.value("status", "pending");
        return fir;
    }
};

/**
 * AVL Tree Node for Fast FIR Search
 * Time Complexity: O(log n) for search, insert, delete
 */
struct AVLNode {
    FIRRecord data;
    int height;
    shared_ptr<AVLNode> left;
    shared_ptr<AVLNode> right;
    
    AVLNode(const FIRRecord& fir) : data(fir), height(1), left(nullptr), right(nullptr) {}
};

/**
 * AVL Tree Implementation
 */
class AVLTree {
private:
    shared_ptr<AVLNode> root;
    
    int getHeight(shared_ptr<AVLNode> node) {
        return node ? node->height : 0;
    }
    
    int getBalance(shared_ptr<AVLNode> node) {
        return node ? getHeight(node->left) - getHeight(node->right) : 0;
    }
    
    void updateHeight(shared_ptr<AVLNode> node) {
        if (node) {
            node->height = 1 + max(getHeight(node->left), getHeight(node->right));
        }
    }
    
    shared_ptr<AVLNode> rotateRight(shared_ptr<AVLNode> y) {
        auto x = y->left;
        auto T2 = x->right;
        x->right = y;
        y->left = T2;
        updateHeight(y);
        updateHeight(x);
        return x;
    }
    
    shared_ptr<AVLNode> rotateLeft(shared_ptr<AVLNode> x) {
        auto y = x->right;
        auto T2 = y->left;
        y->left = x;
        x->right = T2;
        updateHeight(x);
        updateHeight(y);
        return y;
    }
    
    shared_ptr<AVLNode> insert(shared_ptr<AVLNode> node, const FIRRecord& fir) {
        if (!node) return make_shared<AVLNode>(fir);
        
        if (fir.id < node->data.id)
            node->left = insert(node->left, fir);
        else if (fir.id > node->data.id)
            node->right = insert(node->right, fir);
        else
            return node; // Duplicate ID
        
        updateHeight(node);
        int balance = getBalance(node);
        
        // Left Left
        if (balance > 1 && fir.id < node->left->data.id)
            return rotateRight(node);
        
        // Right Right
        if (balance < -1 && fir.id > node->right->data.id)
            return rotateLeft(node);
        
        // Left Right
        if (balance > 1 && fir.id > node->left->data.id) {
            node->left = rotateLeft(node->left);
            return rotateRight(node);
        }
        
        // Right Left
        if (balance < -1 && fir.id < node->right->data.id) {
            node->right = rotateRight(node->right);
            return rotateLeft(node);
        }
        
        return node;
    }
    
    shared_ptr<AVLNode> search(shared_ptr<AVLNode> node, const string& id) {
        if (!node || node->data.id == id)
            return node;
        
        if (id < node->data.id)
            return search(node->left, id);
        
        return search(node->right, id);
    }
    
    void inorder(shared_ptr<AVLNode> node, vector<FIRRecord>& result) {
        if (!node) return;
        inorder(node->left, result);
        result.push_back(node->data);
        inorder(node->right, result);
    }
    
public:
    AVLTree() : root(nullptr) {}
    
    void insert(const FIRRecord& fir) {
        root = insert(root, fir);
    }
    
    FIRRecord* search(const string& id) {
        auto node = search(root, id);
        return node ? &node->data : nullptr;
    }
    
    vector<FIRRecord> getAllRecords() {
        vector<FIRRecord> result;
        inorder(root, result);
        return result;
    }
};

/**
 * Trie Node for Autocomplete
 */
struct TrieNode {
    unordered_map<char, shared_ptr<TrieNode>> children;
    bool isEndOfWord;
    vector<string> suggestions;
    
    TrieNode() : isEndOfWord(false) {}
};

/**
 * Trie Implementation for Autocomplete
 * Time Complexity: O(m) where m is length of word
 */
class Trie {
private:
    shared_ptr<TrieNode> root;
    
    void collectSuggestions(shared_ptr<TrieNode> node, string prefix, vector<string>& results) {
        if (!node) return;
        
        if (node->isEndOfWord) {
            results.push_back(prefix);
        }
        
        for (auto& [ch, child] : node->children) {
            collectSuggestions(child, prefix + ch, results);
        }
    }
    
public:
    Trie() : root(make_shared<TrieNode>()) {}
    
    void insert(const string& word) {
        auto node = root;
        for (char ch : word) {
            if (node->children.find(ch) == node->children.end()) {
                node->children[ch] = make_shared<TrieNode>();
            }
            node = node->children[ch];
        }
        node->isEndOfWord = true;
    }
    
    vector<string> autocomplete(const string& prefix) {
        auto node = root;
        for (char ch : prefix) {
            if (node->children.find(ch) == node->children.end()) {
                return {}; // No suggestions
            }
            node = node->children[ch];
        }
        
        vector<string> results;
        collectSuggestions(node, prefix, results);
        return results;
    }
};

/**
 * FIR Management System
 */
class FIRSystem {
private:
    AVLTree firTree;
    Trie nameAutocomplete;
    unordered_map<string, FIRRecord> firMap; // For O(1) lookup
    int firCounter;
    
    string generateFIRId() {
        return "FIR-" + to_string(++firCounter);
    }
    
    string getCurrentTimestamp() {
        auto now = chrono::system_clock::now();
        auto time = chrono::system_clock::to_time_t(now);
        stringstream ss;
        ss << put_time(localtime(&time), "%Y-%m-%d %H:%M:%S");
        return ss.str();
    }
    
    bool validatePhone(const string& phone) {
        regex phoneRegex(R"(^\d{10}$)");
        return regex_match(phone, phoneRegex);
    }
    
    bool validateEmail(const string& email) {
        regex emailRegex(R"(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)");
        return regex_match(email, emailRegex);
    }
    
public:
    FIRSystem() : firCounter(0) {
        loadFromFile();
    }
    
    ~FIRSystem() {
        saveToFile();
    }
    
    // Create new FIR
    json createFIR(const json& data) {
        try {
            FIRRecord fir;
            fir.id = generateFIRId();
            fir.district = data.value("district", "");
            fir.policeStation = data.value("policeStation", "");
            fir.complainantName = data.value("complainantName", "");
            fir.complainantFatherName = data.value("complainantFatherName", "");
            fir.complainantAddress = data.value("complainantAddress", "");
            fir.complainantPhone = data.value("complainantPhone", "");
            fir.complainantEmail = data.value("complainantEmail", "");
            fir.dateOfIncident = data.value("dateOfIncident", "");
            fir.timeOfIncident = data.value("timeOfIncident", "");
            fir.placeOfIncident = data.value("placeOfIncident", "");
            fir.incidentDescription = data.value("incidentDescription", "");
            fir.suspectName = data.value("suspectName", "");
            fir.suspectAge = data.value("suspectAge", "");
            fir.suspectAddress = data.value("suspectAddress", "");
            fir.suspectDescription = data.value("suspectDescription", "");
            fir.propertyDescription = data.value("propertyDescription", "");
            
            if (data.contains("ipcSections") && data["ipcSections"].is_array()) {
                fir.ipcSections = data["ipcSections"].get<vector<string>>();
            }
            
            fir.timestamp = getCurrentTimestamp();
            fir.status = "pending";
            
            // Validate
            if (!validatePhone(fir.complainantPhone)) {
                return {{"success", false}, {"error", "Invalid phone number. Must be 10 digits."}};
            }
            
            if (!validateEmail(fir.complainantEmail)) {
                return {{"success", false}, {"error", "Invalid email address."}};
            }
            
            // Store in data structures
            firTree.insert(fir);
            firMap[fir.id] = fir;
            nameAutocomplete.insert(fir.complainantName);
            
            return {
                {"success", true},
                {"firId", fir.id},
                {"data", fir.toJSON()}
            };
            
        } catch (const exception& e) {
            return {{"success", false}, {"error", e.what()}};
        }
    }
    
    // Get FIR by ID - O(1) using hash map
    json getFIR(const string& id) {
        string upperId = id;
        transform(upperId.begin(), upperId.end(), upperId.begin(), ::toupper);
        
        auto it = firMap.find(upperId);
        if (it != firMap.end()) {
            return {
                {"success", true},
                {"data", it->second.toJSON()}
            };
        }
        
        // Try case-insensitive search
        for (auto& [key, value] : firMap) {
            string upperKey = key;
            transform(upperKey.begin(), upperKey.end(), upperKey.begin(), ::toupper);
            if (upperKey == upperId) {
                return {
                    {"success", true},
                    {"data", value.toJSON()}
                };
            }
        }
        
        return {{"success", false}, {"error", "FIR not found"}};
    }
    
    // Get all FIRs
    json getAllFIRs() {
        vector<FIRRecord> allFIRs = firTree.getAllRecords();
        json result = json::array();
        
        for (const auto& fir : allFIRs) {
            result.push_back(fir.toJSON());
        }
        
        return {
            {"success", true},
            {"data", result},
            {"count", allFIRs.size()}
        };
    }
    
    // Search FIRs by keyword
    json searchFIRs(const string& keyword) {
        vector<FIRRecord> allFIRs = firTree.getAllRecords();
        json results = json::array();
        
        string lowerKeyword = keyword;
        transform(lowerKeyword.begin(), lowerKeyword.end(), lowerKeyword.begin(), ::tolower);
        
        for (const auto& fir : allFIRs) {
            string searchText = fir.id + " " + fir.complainantName + " " + 
                               fir.incidentDescription + " " + fir.suspectName;
            transform(searchText.begin(), searchText.end(), searchText.begin(), ::tolower);
            
            if (searchText.find(lowerKeyword) != string::npos) {
                results.push_back(fir.toJSON());
            }
        }
        
        return {
            {"success", true},
            {"data", results},
            {"count", results.size()}
        };
    }
    
    // Autocomplete for names
    json getAutocomplete(const string& prefix) {
        vector<string> suggestions = nameAutocomplete.autocomplete(prefix);
        return {
            {"success", true},
            {"suggestions", suggestions}
        };
    }
    
    // Update FIR status
    json updateStatus(const string& id, const string& status) {
        auto it = firMap.find(id);
        if (it != firMap.end()) {
            it->second.status = status;
            return {{"success", true}, {"message", "Status updated"}};
        }
        return {{"success", false}, {"error", "FIR not found"}};
    }
    
    // Save to file
    void saveToFile() {
        try {
            ofstream file("fir_data.json");
            json allData = json::array();
            
            for (const auto& [id, fir] : firMap) {
                allData.push_back(fir.toJSON());
            }
            
            file << allData.dump(4);
            file.close();
            cout << "✅ Data saved to fir_data.json" << endl;
        } catch (const exception& e) {
            cerr << "❌ Error saving data: " << e.what() << endl;
        }
    }
    
    // Load from file
    void loadFromFile() {
        try {
            ifstream file("fir_data.json");
            if (!file.is_open()) {
                cout << "ℹ️  No existing data file found. Starting fresh." << endl;
                return;
            }
            
            json allData;
            file >> allData;
            file.close();
            
            if (allData.is_array()) {
                for (const auto& item : allData) {
                    FIRRecord fir = FIRRecord::fromJSON(item);
                    firTree.insert(fir);
                    firMap[fir.id] = fir;
                    nameAutocomplete.insert(fir.complainantName);
                    
                    // Update counter
                    if (fir.id.substr(0, 4) == "FIR-") {
                        int num = stoi(fir.id.substr(4));
                        firCounter = max(firCounter, num);
                    }
                }
                cout << "✅ Loaded " << allData.size() << " FIR records" << endl;
            }
        } catch (const exception& e) {
            cerr << "❌ Error loading data: " << e.what() << endl;
        }
    }
};

// ========================================
// HTTP Server
// ========================================

int main() {
    cout << "🚀 Starting FIR Management Server..." << endl;
    cout << "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" << endl;
    
    FIRSystem firSystem;
    Server server;
    
    // Enable CORS
    server.set_default_headers({
        {"Access-Control-Allow-Origin", "*"},
        {"Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"},
        {"Access-Control-Allow-Headers", "Content-Type"}
    });
    
    // Handle OPTIONS requests (CORS preflight)
    server.Options(".*", [](const Request& req, Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.status = 200;
    });
    
    // Health check
    server.Get("/", [](const Request& req, Response& res) {
        json response = {
            {"status", "running"},
            {"service", "FIR Management System"},
            {"version", "1.0.0"},
            {"timestamp", chrono::system_clock::to_time_t(chrono::system_clock::now())}
        };
        res.set_content(response.dump(), "application/json");
    });
    
    // Create FIR
    server.Post("/api/fir/create", [&firSystem](const Request& req, Response& res) {
        try {
            json requestData = json::parse(req.body);
            json response = firSystem.createFIR(requestData);
            res.set_content(response.dump(), "application/json");
        } catch (const exception& e) {
            json error = {{"success", false}, {"error", e.what()}};
            res.set_content(error.dump(), "application/json");
        }
    });
    
    // Get FIR by ID
    server.Get("/api/fir/:id", [&firSystem](const Request& req, Response& res) {
        string id = req.path_params.at("id");
        json response = firSystem.getFIR(id);
        res.set_content(response.dump(), "application/json");
    });
    
    // Get all FIRs
    server.Get("/api/fir/all", [&firSystem](const Request& req, Response& res) {
        json response = firSystem.getAllFIRs();
        res.set_content(response.dump(), "application/json");
    });
    
    // Search FIRs
    server.Get("/api/fir/search/:keyword", [&firSystem](const Request& req, Response& res) {
        string keyword = req.path_params.at("keyword");
        json response = firSystem.searchFIRs(keyword);
        res.set_content(response.dump(), "application/json");
    });
    
    // Autocomplete
    server.Get("/api/autocomplete/:prefix", [&firSystem](const Request& req, Response& res) {
        string prefix = req.path_params.at("prefix");
        json response = firSystem.getAutocomplete(prefix);
        res.set_content(response.dump(), "application/json");
    });
    
    // Update status
    server.Put("/api/fir/:id/status", [&firSystem](const Request& req, Response& res) {
        try {
            string id = req.path_params.at("id");
            json requestData = json::parse(req.body);
            string status = requestData.value("status", "pending");
            json response = firSystem.updateStatus(id, status);
            res.set_content(response.dump(), "application/json");
        } catch (const exception& e) {
            json error = {{"success", false}, {"error", e.what()}};
            res.set_content(error.dump(), "application/json");
        }
    });
    
    cout << "✅ Server initialized" << endl;
    cout << "🌐 Listening on http://localhost:8080" << endl;
    cout << "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" << endl;
    cout << "\n📋 Available Endpoints:" << endl;
    cout << "  POST   /api/fir/create          - Create new FIR" << endl;
    cout << "  GET    /api/fir/:id             - Get FIR by ID" << endl;
    cout << "  GET    /api/fir/all             - Get all FIRs" << endl;
    cout << "  GET    /api/fir/search/:keyword - Search FIRs" << endl;
    cout << "  GET    /api/autocomplete/:prefix - Name autocomplete" << endl;
    cout << "  PUT    /api/fir/:id/status      - Update FIR status" << endl;
    cout << "\n💡 Press Ctrl+C to stop the server\n" << endl;
    
    server.listen("0.0.0.0", 8080);
    
    return 0;
}
