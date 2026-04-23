#include "insertion.h"
#include <vector>
#include <utility>


using namespace std;

vector<pair<vector<int>, pair<int,int>>> insertionSort(vector<int> arr) {
    vector<pair<vector<int>, pair<int,int>>> steps;
    steps.push_back({arr, {-1,-1}});

    int n = arr.size();

    for(int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        while(j >= 0 && arr[j] > key) {
            arr[j+1] = arr[j];
            steps.push_back({arr, {j, j+1}});
            j--;
        }

        arr[j+1] = key;
        steps.push_back({arr, {j+1, i}});
    }

    return steps;
}