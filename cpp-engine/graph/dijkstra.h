#pragma once
#include <vector>
using namespace std;

vector<vector<int>> dijkstra(
    int n,
    vector<vector<pair<int,int>>>& adj,
    int src,
    int dest
);