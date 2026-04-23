// dsu.h
#pragma once
#include <vector>
#include <algorithm>

using namespace std;

//////////////////////////////////////////////////////////////
// Disjoint Set Union (Union Find)
//////////////////////////////////////////////////////////////
class DSU {
public:
    vector<int> parent;
    vector<int> rankv;

    //////////////////////////////////////////////////
    // Constructor
    //////////////////////////////////////////////////
    DSU(int n) {
        parent.resize(n);
        rankv.assign(n, 0);

        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    //////////////////////////////////////////////////
    // Find with Path Compression
    //////////////////////////////////////////////////
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }

        return parent[x];
    }

    //////////////////////////////////////////////////
    // Union by Rank
    //////////////////////////////////////////////////
    void unite(int a, int b) {
        a = find(a);
        b = find(b);

        if (a == b) return;

        if (rankv[a] < rankv[b]) {
            swap(a, b);
        }

        parent[b] = a;

        if (rankv[a] == rankv[b]) {
            rankv[a]++;
        }
    }
};