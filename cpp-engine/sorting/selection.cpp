#include "selection.h"
#include <vector>
#include <utility>


using namespace std;

vector<pair<vector<int>, pair<int,int>>> selectionSort(vector<int> arr) {
    vector<pair<vector<int>, pair<int,int>>> steps;
    steps.push_back({arr, {-1,-1}});

    int n = arr.size();

    for(int i = 0; i < n; i++) {
        int minIdx = i;

        for(int j = i+1; j < n; j++) {
            if(arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }

        swap(arr[i], arr[minIdx]);
        steps.push_back({arr, {i, minIdx}});
    }

    return steps;
}