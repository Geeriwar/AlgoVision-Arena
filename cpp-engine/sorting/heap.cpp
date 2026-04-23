#include "heap.h"
#include <vector>
#include <utility>


using namespace std;

void heapify(vector<int>& arr, int n, int i,
    vector<pair<vector<int>, pair<int,int>>>& steps) {

    int largest = i;
    int l = 2*i + 1;
    int r = 2*i + 2;

    if(l < n && arr[l] > arr[largest]) largest = l;
    if(r < n && arr[r] > arr[largest]) largest = r;

    if(largest != i) {
        swap(arr[i], arr[largest]);
        steps.push_back({arr, {i, largest}});
        heapify(arr, n, largest, steps);
    }
}

vector<pair<vector<int>, pair<int,int>>> heapSort(vector<int> arr) {
    vector<pair<vector<int>, pair<int,int>>> steps;
    steps.push_back({arr, {-1,-1}});

    int n = arr.size();

    for(int i = n/2 - 1; i >= 0; i--)
        heapify(arr, n, i, steps);

    for(int i = n-1; i > 0; i--) {
        swap(arr[0], arr[i]);
        steps.push_back({arr, {0, i}});
        heapify(arr, i, 0, steps);
    }

    return steps;
}