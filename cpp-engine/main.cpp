#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <stdexcept>

// Sorting
#include "sorting/bubble.h"
#include "sorting/selection.h"
#include "sorting/insertion.h"
#include "sorting/quick.h"
#include "sorting/merge.h"
#include "sorting/heap.h"

// Graph
#include "graph/bfs.h"
#include "graph/dfs.h"
#include "graph/dijkstra.h"
#include "graph/bellman.h"
#include "graph/prim.h"
#include "graph/kruskal.h"

// DP
#include "dp/knapsack.h"
#include "dp/subset.h"
#include "dp/lcs.h"
#include "dp/lis.h"

using namespace std;

//////////////////////////////////////////////////////
// ERROR OUTPUT — always valid JSON
//////////////////////////////////////////////////////
void errorOut(const string& msg) {
    cout << "{ \"error\": \"" << msg << "\", \"steps\": [] }";
}

//////////////////////////////////////////////////////
// SAFE stoi — returns false on failure
//////////////////////////////////////////////////////
bool safeStoi(const string& s, int& out) {
    if (s.empty()) return false;
    try {
        size_t pos;
        out = stoi(s, &pos);
        // Reject if trailing non-numeric chars
        if (pos != s.size()) return false;
        return true;
    } catch (...) {
        return false;
    }
}

//////////////////////////////////////////////////////
// PARSE ARRAY — returns false if any token invalid
//////////////////////////////////////////////////////
bool parseArray(const string& input, vector<int>& arr) {
    arr.clear();
    if (input.empty()) return false;

    string temp;
    for (char c : input) {
        if (c == ',') {
            if (temp.empty()) return false; // trailing/double comma
            int v;
            if (!safeStoi(temp, v)) return false;
            arr.push_back(v);
            temp.clear();
        } else if (isdigit(c) || c == '-') {
            temp += c;
        } else if (c == ' ') {
            // skip whitespace
        } else {
            return false; // unexpected char
        }
    }
    if (!temp.empty()) {
        int v;
        if (!safeStoi(temp, v)) return false;
        arr.push_back(v);
    }
    return !arr.empty();
}

//////////////////////////////////////////////////////
// PARSE GRAPH EDGES
// Format: 0-1-4,1-2-3
// Returns false if any edge is malformed
//////////////////////////////////////////////////////
bool parseEdges(const string& input, vector<vector<int>>& edges) {
    edges.clear();
    if (input.empty()) return false;

    // Split by comma → individual edge strings
    vector<string> parts;
    string temp;
    for (char c : input) {
        if (c == ',') {
            if (!temp.empty()) parts.push_back(temp);
            temp.clear();
        } else {
            temp += c;
        }
    }
    if (!temp.empty()) parts.push_back(temp);

    if (parts.empty()) return false;

    for (const string& s : parts) {
        vector<int> edge;
        string num;
        for (char c : s) {
            if (c == '-' && !num.empty()) {
                int v;
                if (!safeStoi(num, v)) return false;
                if (v < 0) return false; // negative node index
                edge.push_back(v);
                num.clear();
            } else if (isdigit(c)) {
                num += c;
            } else if (c == ' ') {
                // skip
            } else {
                return false;
            }
        }
        if (!num.empty()) {
            int v;
            if (!safeStoi(num, v)) return false;
            edge.push_back(v);
        }
        if (edge.size() < 2) return false; // need at least u and v
        edges.push_back(edge);
    }
    return !edges.empty();
}

//////////////////////////////////////////////////////
// BUILD UNWEIGHTED ADJACENCY LIST
//////////////////////////////////////////////////////
vector<vector<int>> buildGraph(
    int n,
    const vector<vector<int>>& edges,
    bool directed
) {
    vector<vector<int>> adj(n);
    for (const auto& e : edges) {
        int u = e[0], v = e[1];
        if (u >= n || v >= n) continue; // safety
        adj[u].push_back(v);
        if (!directed) adj[v].push_back(u);
    }
    return adj;
}

//////////////////////////////////////////////////////
// PRINT STEPS JSON (graph / DP style)
//////////////////////////////////////////////////////
void printSteps(const vector<vector<int>>& steps) {
    cout << "{ \"steps\": [";
    for (int i = 0; i < (int)steps.size(); i++) {
        cout << "[";
        for (int j = 0; j < (int)steps[i].size(); j++) {
            cout << steps[i][j];
            if (j < (int)steps[i].size() - 1) cout << ",";
        }
        cout << "]";
        if (i < (int)steps.size() - 1) cout << ",";
    }
    cout << "] }";
}

//////////////////////////////////////////////////////
// SPLIT by delimiter — helper for DP input
//////////////////////////////////////////////////////
vector<string> splitBy(const string& input, char delim) {
    vector<string> parts;
    string temp;
    for (char c : input) {
        if (c == delim) {
            parts.push_back(temp);
            temp.clear();
        } else {
            temp += c;
        }
    }
    parts.push_back(temp);
    return parts;
}

//////////////////////////////////////////////////////
// MAIN
//////////////////////////////////////////////////////
int main(int argc, char* argv[]) {

    if (argc < 3) {
        errorOut("Usage: main <algo> <data> [graphType] [source] [destination]");
        return 1;
    }

    string algo  = argv[1];
    string input = argv[2];

    string graphType = "undirected";
    if (argc >= 4) graphType = argv[3];

    int source = 0;
    if (argc >= 5) {
        if (!safeStoi(argv[4], source) || source < 0) {
            errorOut("Invalid source node");
            return 1;
        }
    }

    int destination = -1;
    if (argc >= 6) {
        if (!safeStoi(argv[5], destination)) {
            errorOut("Invalid destination node");
            return 1;
        }
    }

    bool directed = (graphType == "directed");

    //////////////////////////////////////////////////////
    // SUPPORTED ALGO SETS
    //////////////////////////////////////////////////////
    const vector<string> sortAlgos    = {"Bubble","Selection","Insertion","Quick","Merge","Heap"};
    const vector<string> graphAlgos   = {"BFS","DFS","Dijkstra","Bellman","Prim","Kruskal"};
    const vector<string> dpAlgos      = {"Knapsack","Subset","LCS","LIS"};

    auto inSet = [](const string& s, const vector<string>& v) {
        return find(v.begin(), v.end(), s) != v.end();
    };

    bool isSort  = inSet(algo, sortAlgos);
    bool isGraph = inSet(algo, graphAlgos);
    bool isDP    = inSet(algo, dpAlgos);

    if (!isSort && !isGraph && !isDP) {
        errorOut("Unknown algorithm: " + algo);
        return 1;
    }

    //////////////////////////////////////////////////////
    // GRAPH SECTION
    //////////////////////////////////////////////////////
    if (isGraph) {
        vector<vector<int>> edges;
        if (!parseEdges(input, edges)) {
            errorOut("Malformed edge input. Expected format: u-v-w,u-v-w");
            return 1;
        }

        // Derive node count from max node index
        int n = 0;
        for (const auto& e : edges) {
            n = max(n, max(e[0], e[1]));
        }
        n++;

        if (n > 500) {
            errorOut("Graph too large (max 500 nodes)");
            return 1;
        }

        // BFS / DFS — unweighted
        if (algo == "BFS" || algo == "DFS") {
            if (source >= n) {
                errorOut("Source node out of range");
                return 1;
            }
            vector<vector<int>> adj = buildGraph(n, edges, directed);
            vector<vector<int>> steps;
            if (algo == "BFS")
                steps = bfs(n, adj, source);
            else
                steps = dfs(n, adj, source);
            printSteps(steps);
            return 0;
        }

        // Weighted graph — verify edges have weight field
        for (const auto& e : edges) {
            if ((int)e.size() < 3) {
                errorOut("Weighted algorithms need u-v-w edge format");
                return 1;
            }
        }

        vector<vector<pair<int,int>>> adj(n);
        for (const auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (u >= n || v >= n) continue;
            adj[u].push_back({v, w});
            if (!directed) adj[v].push_back({u, w});
        }

        vector<vector<int>> steps;

        if (algo == "Dijkstra") {
            if (source >= n) { errorOut("Source out of range"); return 1; }
            steps = dijkstra(n, adj, source, destination);
        } else if (algo == "Bellman") {
            if (source >= n) { errorOut("Source out of range"); return 1; }
            steps = bellmanFord(n, edges, source, destination);
        } else if (algo == "Prim") {
            steps = prim(n, adj);
        } else if (algo == "Kruskal") {
            steps = kruskal(n, edges);
        }

        printSteps(steps);
        return 0;
    }

    //////////////////////////////////////////////////////
    // DP SECTION
    //////////////////////////////////////////////////////
    if (isDP) {
        vector<vector<int>> steps;

        // KNAPSACK — format: wt1,wt2|val1,val2|W
        if (algo == "Knapsack") {
            vector<string> parts = splitBy(input, '|');
            if (parts.size() < 3) {
                errorOut("Knapsack format: weights|values|capacity");
                return 1;
            }
            vector<int> wt, val;
            int W;
            if (!parseArray(parts[0], wt) || !parseArray(parts[1], val)) {
                errorOut("Invalid weights or values array");
                return 1;
            }
            if (!safeStoi(parts[2], W) || W <= 0) {
                errorOut("Invalid capacity");
                return 1;
            }
            if (wt.size() != val.size()) {
                errorOut("Weights and values must have equal length");
                return 1;
            }
            if (wt.size() > 100 || W > 1000) {
                errorOut("Input too large for Knapsack (max 100 items, capacity 1000)");
                return 1;
            }
            steps = knapsack((int)wt.size(), W, wt, val);
        }

        // SUBSET — format: arr|target
        else if (algo == "Subset") {
            vector<string> parts = splitBy(input, '|');
            if (parts.size() < 2) {
                errorOut("Subset format: array|target");
                return 1;
            }
            vector<int> arr;
            int target;
            if (!parseArray(parts[0], arr)) {
                errorOut("Invalid array for Subset");
                return 1;
            }
            if (!safeStoi(parts[1], target)) {
                errorOut("Invalid target for Subset");
                return 1;
            }
            steps = subsetSum(arr, target);
        }

        // LCS — format: string1|string2
        else if (algo == "LCS") {
            vector<string> parts = splitBy(input, '|');
            if (parts.size() < 2 || parts[0].empty() || parts[1].empty()) {
                errorOut("LCS format: string1|string2");
                return 1;
            }
            string a = parts[0], b = parts[1];
            // trim spaces
            a.erase(remove(a.begin(), a.end(), ' '), a.end());
            b.erase(remove(b.begin(), b.end(), ' '), b.end());
            if (a.size() > 200 || b.size() > 200) {
                errorOut("Strings too long for LCS (max 200 chars each)");
                return 1;
            }
            steps = lcs(a, b);
        }

        // LIS — format: comma-separated array
        else if (algo == "LIS") {
            vector<int> arr;
            if (!parseArray(input, arr)) {
                errorOut("Invalid array for LIS");
                return 1;
            }
            steps = lis(arr);
        }

        printSteps(steps);
        return 0;
    }

    //////////////////////////////////////////////////////
    // SORTING SECTION
    //////////////////////////////////////////////////////
    vector<int> original;
    if (!parseArray(input, original)) {
        errorOut("Invalid array for sorting. Use comma-separated integers.");
        return 1;
    }

    if (original.size() > 200) {
        errorOut("Array too large for sorting visualization (max 200 elements)");
        return 1;
    }

    vector<pair<vector<int>, pair<int,int>>> steps;

    if      (algo == "Bubble")    steps = bubbleSort(original);
    else if (algo == "Selection") steps = selectionSort(original);
    else if (algo == "Insertion") steps = insertionSort(original);
    else if (algo == "Quick")     steps = quickSort(original);
    else if (algo == "Merge")     steps = mergeSort(original);
    else if (algo == "Heap")      steps = heapSort(original);

    // Output sort JSON
    cout << "{ \"steps\": [";
    for (int i = 0; i < (int)steps.size(); i++) {
        cout << "{ \"array\": [";
        const auto& arr = steps[i].first;
        for (int j = 0; j < (int)arr.size(); j++) {
            cout << arr[j];
            if (j < (int)arr.size() - 1) cout << ",";
        }
        cout << "], \"compare\": ["
             << steps[i].second.first << ","
             << steps[i].second.second
             << "] }";
        if (i < (int)steps.size() - 1) cout << ",";
    }
    cout << "] }";

    return 0;
}