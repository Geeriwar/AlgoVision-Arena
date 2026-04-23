#include "bellman.h"
#include <climits>

using namespace std;

//////////////////////////////////////////////////////////////
// Bellman Ford
// n     = number of nodes
// edges = {u,v,w}
// src   = source node
// dest  = destination node (future use)
// returns steps = distance array after each pass
//////////////////////////////////////////////////////////////

vector<vector<int>> bellmanFord(
    int n,
    vector<vector<int>>& edges,
    int src,
    int dest
) {
    vector<int> dist(n, INT_MAX);
    vector<vector<int>> steps;

    //////////////////////////////////////////////////
    // Start source
    //////////////////////////////////////////////////
    dist[src] = 0;

    //////////////////////////////////////////////////
    // Relax edges n-1 times
    //////////////////////////////////////////////////
    for (int i = 0; i < n - 1; i++) {

        bool changed = false;

        for (auto &e : edges) {

            int u = e[0];
            int v = e[1];
            int w = e[2];

            if (
                dist[u] != INT_MAX &&
                dist[v] > dist[u] + w
            ) {
                dist[v] = dist[u] + w;
                changed = true;
            }
        }

        //////////////////////////////////////////////////
        // Save step (-1 for INF)
        //////////////////////////////////////////////////
        vector<int> current = dist;

        for (int j = 0; j < n; j++) {
            if (current[j] == INT_MAX)
                current[j] = -1;
        }

        steps.push_back(current);

        //////////////////////////////////////////////////
        // Optimization
        //////////////////////////////////////////////////
        if (!changed) break;
    }

    //////////////////////////////////////////////////
    // Safety fallback
    //////////////////////////////////////////////////
    if (steps.empty()) {
        vector<int> current = dist;

        for (int j = 0; j < n; j++) {
            if (current[j] == INT_MAX)
                current[j] = -1;
        }

        steps.push_back(current);
    }

    return steps;
}