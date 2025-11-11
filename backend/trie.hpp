#ifndef TRIE_HPP
#define TRIE_HPP

#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>
#include <algorithm>

class TrieNode {
public:
    std::unordered_map<char, TrieNode*> children;
    std::unordered_set<int> ids;
    bool isEnd;

    TrieNode() : isEnd(false) {}
    
    ~TrieNode() {
        for (auto& pair : children) {
            delete pair.second;
        }
    }
};

class Trie {
private:
    TrieNode* root;

    std::string toLower(const std::string& str) {
        std::string result = str;
        std::transform(result.begin(), result.end(), result.begin(), ::tolower);
        return result;
    }

public:
    Trie() {
        root = new TrieNode();
    }

    ~Trie() {
        delete root;
    }

    void insert(const std::string& key, int id) {
        std::string lowerKey = toLower(key);
        TrieNode* node = root;
        
        for (char ch : lowerKey) {
            if (node->children.find(ch) == node->children.end()) {
                node->children[ch] = new TrieNode();
            }
            node = node->children[ch];
            node->ids.insert(id);
        }
        node->isEnd = true;
    }

    std::vector<int> searchExact(const std::string& key) {
        std::string lowerKey = toLower(key);
        TrieNode* node = root;
        
        for (char ch : lowerKey) {
            if (node->children.find(ch) == node->children.end()) {
                return std::vector<int>();
            }
            node = node->children[ch];
        }
        
        return std::vector<int>(node->ids.begin(), node->ids.end());
    }

    std::vector<int> startsWith(const std::string& prefix) {
        std::string lowerPrefix = toLower(prefix);
        TrieNode* node = root;
        
        for (char ch : lowerPrefix) {
            if (node->children.find(ch) == node->children.end()) {
                return std::vector<int>();
            }
            node = node->children[ch];
        }
        
        return std::vector<int>(node->ids.begin(), node->ids.end());
    }
};

#endif // TRIE_HPP
