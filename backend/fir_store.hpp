#ifndef FIR_STORE_HPP
#define FIR_STORE_HPP

#include <unordered_map>
#include <vector>
#include <algorithm>
#include "fir_record.hpp"
#include "trie.hpp"
#include "avl_tree.hpp"
#include "graph.hpp"

class FIRStore {
private:
    std::unordered_map<int, FIRRecord*> byId;
    Trie complainantTrie;
    Trie suspectTrie;
    AVLTree idIndex;
    Graph graph;

    std::string toLower(const std::string& str) {
        std::string result = str;
        std::transform(result.begin(), result.end(), result.begin(), ::tolower);
        return result;
    }

public:
    void add(FIRRecord* record) {
        int id = record->id;
        byId[id] = record;
        
        complainantTrie.insert(record->complainant, id);
        suspectTrie.insert(record->suspect, id);
        idIndex.insert(id, record);
        graph.addVertex(id);
        
        for (int relId : record->relatedIds) {
            graph.addEdge(id, relId);
        }
    }

    FIRRecord* getById(int id) {
        auto it = byId.find(id);
        return it != byId.end() ? it->second : nullptr;
    }

    std::vector<FIRRecord*> searchComplainant(const std::string& name) {
        std::vector<int> ids = complainantTrie.startsWith(name);
        std::vector<FIRRecord*> results;
        for (int id : ids) {
            FIRRecord* record = getById(id);
            if (record) results.push_back(record);
        }
        return results;
    }

    std::vector<FIRRecord*> searchSuspect(const std::string& name) {
        std::vector<int> ids = suspectTrie.startsWith(name);
        std::vector<FIRRecord*> results;
        for (int id : ids) {
            FIRRecord* record = getById(id);
            if (record) results.push_back(record);
        }
        return results;
    }

    std::vector<FIRRecord*> listByStatus(const std::string& status) {
        std::string lowerStatus = toLower(status);
        std::vector<FIRRecord*> results;
        for (const auto& pair : byId) {
            if (toLower(pair.second->status) == lowerStatus) {
                results.push_back(pair.second);
            }
        }
        return results;
    }

    std::vector<FIRRecord*> all() {
        std::vector<FIRRecord*> results;
        for (const auto& pair : byId) {
            results.push_back(pair.second);
        }
        return results;
    }

    std::vector<FIRRecord*> related(int id) {
        std::vector<int> neighborIds = graph.neighbors(id);
        std::vector<FIRRecord*> results;
        for (int nid : neighborIds) {
            FIRRecord* record = getById(nid);
            if (record) results.push_back(record);
        }
        return results;
    }
};

#endif // FIR_STORE_HPP
