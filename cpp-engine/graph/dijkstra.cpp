#include "dijkstra.h"
#include <queue>
#include <climits>
#include <algorithm>

using namespace std;

//////////////////////////////////////////////////////////////
// Dijkstra Algorithm
// n     = number of nodes
// adj   = adjacency list {neighbor, weight}
// src   = source node
// dest  = destination node (reserved for future use)
// Returns:
// steps = distance array after each node processing
//////////////////////////////////////////////////////////////

vector<vector<int>> dijkstra(
    int n,
    vector<vector<pair<int,int>>>& adj,
    int src,
    int dest
) {
    //////////////////////////////////////////////////
    // Distance + Visited
    //////////////////////////////////////////////////
    vector<int> dist(n, INT_MAX);
    vector<int> visited(n, 0);

    //////////////////////////////////////////////////
    // Min Heap => {distance, node}
    //////////////////////////////////////////////////
    priority_queue<
        pair<int,int>,
        vector<pair<int,int>>,
        greater<pair<int,int>>
    > pq;

    //////////////////////////////////////////////////
    // Steps for visualization
    //////////////////////////////////////////////////
    vector<vector<int>> steps;

    //////////////////////////////////////////////////
    // Start from source
    //////////////////////////////////////////////////
    dist[src] = 0;
    pq.push({0, src});

    //////////////////////////////////////////////////
    // Main Loop
    //////////////////////////////////////////////////
    while (!pq.empty()) {

        pair<int,int> top = pq.top();
        pq.pop();

        int d    = top.first;
        int node = top.second;

        //////////////////////////////////////////////////
        // Ignore outdated or visited
        //////////////////////////////////////////////////
        if (visited[node]) continue;

        visited[node] = 1;

        //////////////////////////////////////////////////
        // Optional early stop if destination reached
        //////////////////////////////////////////////////
        if (node == dest && dest != -1) {

            vector<int> current = dist;

            for (int i = 0; i < n; i++) {
                if (current[i] == INT_MAX)
                    current[i] = -1;
            }

            steps.push_back(current);
            break;
        }

        //////////////////////////////////////////////////
        // Relax neighbors
        //////////////////////////////////////////////////
        for (auto &edge : adj[node]) {

            int nei = edge.first;
            int w   = edge.second;

            if (!visited[nei] &&
                dist[node] != INT_MAX &&
                dist[nei] > dist[node] + w) {

                dist[nei] = dist[node] + w;
                pq.push({dist[nei], nei});
            }
        }

        //////////////////////////////////////////////////
        // Save current distance state
        //////////////////////////////////////////////////
        vector<int> current = dist;

        for (int i = 0; i < n; i++) {
            if (current[i] == INT_MAX)
                current[i] = -1;
        }

        steps.push_back(current);
    }

    //////////////////////////////////////////////////
    // If no steps recorded
    //////////////////////////////////////////////////
    if (steps.empty()) {

        vector<int> current = dist;

        for (int i = 0; i < n; i++) {
            if (current[i] == INT_MAX)
                current[i] = -1;
        }

        steps.push_back(current);
    }

    return steps;
}