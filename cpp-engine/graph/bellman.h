#pragma once
#include <vector>
using namespace std;

vector<vector<int>> bellmanFord(
    int n,
    vector<vector<int>>& edges,
    int src,
    int dest
);