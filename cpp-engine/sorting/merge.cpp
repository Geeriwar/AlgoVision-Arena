#include <vector>
#include <utility>
#include "merge.h"

using namespace std;

void merge(vector<int>& arr, int l, int m, int r,
           vector<pair<vector<int>, pair<int,int>>>& steps) {

    vector<int> temp;
    int i = l, j = m+1;

    while(i <= m && j <= r) {
        if(arr[i] <= arr[j]) temp.push_back(arr[i++]);
        else temp.push_back(arr[j++]);
    }

    while(i <= m) temp.push_back(arr[i++]);
    while(j <= r) temp.push_back(arr[j++]);

    for(int k = 0; k < temp.size(); k++) {
        arr[l + k] = temp[k];
    }

    steps.push_back({arr, {l, r}});
}

void mergeHelper(vector<int>& arr, int l, int r,
    vector<pair<vector<int>, pair<int,int>>>& steps) {

    if(l >= r) return;

    int m = (l + r) / 2;

    mergeHelper(arr, l, m, steps);
    mergeHelper(arr, m+1, r, steps);
    merge(arr, l, m, r, steps);
}

vector<pair<vector<int>, pair<int,int>>> mergeSort(vector<int> arr) {
    vector<pair<vector<int>, pair<int,int>>> steps;

    steps.push_back({arr, {-1,-1}});
    mergeHelper(arr, 0, arr.size()-1, steps);

    return steps;
}