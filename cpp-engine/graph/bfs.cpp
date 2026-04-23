#include "bfs.h"
#include <queue>

using namespace std;

//////////////////////////////////////////////////////////////
// BFS Traversal
// n   = number of nodes
// adj = adjacency list
// src = starting node
// returns steps = traversal progress
//////////////////////////////////////////////////////////////

vector<vector<int>> bfs(
    int n,
    vector<vector<int>>& adj,
    int src
) {
    vector<vector<int>> steps;
    vector<int> visited(n, 0);

    queue<int> q;

    //////////////////////////////////////////////////
    // Start source
    //////////////////////////////////////////////////
    q.push(src);
    visited[src] = 1;

    vector<int> current;

    //////////////////////////////////////////////////
    // BFS Loop
    //////////////////////////////////////////////////
    while (!q.empty()) {

        int node = q.front();
        q.pop();

        current.push_back(node);

        //////////////////////////////////////////////////
        // Save traversal progress
        //////////////////////////////////////////////////
        steps.push_back(current);

        //////////////////////////////////////////////////
        // Visit neighbors
        //////////////////////////////////////////////////
        for (int nei : adj[node]) {

            if (!visited[nei]) {
                visited[nei] = 1;
                q.push(nei);
            }
        }
    }

    //////////////////////////////////////////////////
    // Safety fallback
    //////////////////////////////////////////////////
    if (steps.empty()) {
        steps.push_back(current);
    }

    return steps;
}