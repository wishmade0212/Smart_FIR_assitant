#ifndef GRAPH_HPP
#define GRAPH_HPP

#include <unordered_map>
#include <unordered_set>
#include <vector>

class Graph {
private:
    std::unordered_map<int, std::unordered_set<int>> adj;

public:
    void addVertex(int id) {
        if (adj.find(id) == adj.end()) {
            adj[id] = std::unordered_set<int>();
        }
    }

    void addEdge(int a, int b) {
        addVertex(a);
        addVertex(b);
        adj[a].insert(b);
        adj[b].insert(a);
    }

    std::vector<int> neighbors(int id) {
        if (adj.find(id) == adj.end()) {
            return std::vector<int>();
        }
        return std::vector<int>(adj[id].begin(), adj[id].end());
    }
};

#endif // GRAPH_HPP
