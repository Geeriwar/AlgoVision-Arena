#include "quick.h"
#include <vector>
#include <utility>


using namespace std;

void helper(vector<int>& arr, int low, int high,
    vector<pair<vector<int>, pair<int,int>>>& steps) {

    if(low >= high) return;

    int pivot = arr[high];
    int i = low;

    for(int j = low; j < high; j++) {
        if(arr[j] < pivot) {
            swap(arr[i], arr[j]);
            steps.push_back({arr, {i, j}});
            i++;
        }
    }

    swap(arr[i], arr[high]);
    steps.push_back({arr, {i, high}});

    helper(arr, low, i - 1, steps);
    helper(arr, i + 1, high, steps);
}

vector<pair<vector<int>, pair<int,int>>> quickSort(vector<int> arr) {

    vector<pair<vector<int>, pair<int,int>>> steps;

    steps.push_back({arr, {-1,-1}});

    helper(arr, 0, arr.size() - 1, steps);

    return steps;
}