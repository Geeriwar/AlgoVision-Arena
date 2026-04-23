// dfs.cpp
#include "dfs.h"

using namespace std;

//////////////////////////////////////////////////////////////
// DFS Helper
//////////////////////////////////////////////////////////////
void dfsUtil(
    int node,
    vector<vector<int>>& adj,
    vector<int>& visited,
    vector<int>& current,
    vector<vector<int>>& steps
) {
    visited[node] = 1;

    current.push_back(node);

    //////////////////////////////////////////////////
    // Save traversal progress
    //////////////////////////////////////////////////
    steps.push_back(current);

    //////////////////////////////////////////////////
    // Explore neighbors
    //////////////////////////////////////////////////
    for (int nei : adj[node]) {
        if (!visited[nei]) {
            dfsUtil(
                nei,
                adj,
                visited,
                current,
                steps
            );
        }
    }
}

//////////////////////////////////////////////////////////////
// DFS Traversal
// n   = number of nodes
// adj = adjacency list
// src = starting node
//////////////////////////////////////////////////////////////
vector<vector<int>> dfs(
    int n,
    vector<vector<int>>& adj,
    int src
) {
    vector<vector<int>> steps;
    vector<int> visited(n, 0);
    vector<int> current;

    //////////////////////////////////////////////////
    // Start DFS from source
    //////////////////////////////////////////////////
    dfsUtil(
        src,
        adj,
        visited,
        current,
        steps
    );

    //////////////////////////////////////////////////
    // Safety fallback
    //////////////////////////////////////////////////
    if (steps.empty()) {
        steps.push_back(current);
    }

    return steps;
}