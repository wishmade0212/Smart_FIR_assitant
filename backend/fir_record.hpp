#ifndef FIR_RECORD_HPP
#define FIR_RECORD_HPP

#include <string>
#include <vector>
#include <json/json.h>

struct FIRRecord {
    int id;
    std::string complainant;
    std::string suspect;
    std::string date;
    std::string location;
    std::string description;
    std::string status;
    std::vector<std::string> tags;
    std::vector<int> relatedIds;

    Json::Value toJson() const {
        Json::Value json;
        json["id"] = id;
        json["complainant"] = complainant;
        json["suspect"] = suspect;
        json["date"] = date;
        json["location"] = location;
        json["description"] = description;
        json["status"] = status;
        
        Json::Value tagsArray(Json::arrayValue);
        for (const auto& tag : tags) {
            tagsArray.append(tag);
        }
        json["tags"] = tagsArray;
        
        Json::Value relatedArray(Json::arrayValue);
        for (int relId : relatedIds) {
            relatedArray.append(relId);
        }
        json["relatedIds"] = relatedArray;
        
        return json;
    }

    static FIRRecord fromJson(const Json::Value& json) {
        FIRRecord record;
        record.id = json["id"].asInt();
        record.complainant = json["complainant"].asString();
        record.suspect = json["suspect"].asString();
        record.date = json["date"].asString();
        record.location = json["location"].asString();
        record.description = json["description"].asString();
        record.status = json.get("status", "open").asString();
        
        for (const auto& tag : json["tags"]) {
            record.tags.push_back(tag.asString());
        }
        
        for (const auto& relId : json["relatedIds"]) {
            record.relatedIds.push_back(relId.asInt());
        }
        
        return record;
    }
};

struct IPCSection {
    std::string section;
    std::string title;
    std::string description;
    std::vector<std::string> keywords;
    std::string punishment;

    Json::Value toJson() const {
        Json::Value json;
        json["section"] = section;
        json["title"] = title;
        json["description"] = description;
        json["punishment"] = punishment;
        
        Json::Value keywordsArray(Json::arrayValue);
        for (const auto& kw : keywords) {
            keywordsArray.append(kw);
        }
        json["keywords"] = keywordsArray;
        
        return json;
    }
};

#endif // FIR_RECORD_HPP
