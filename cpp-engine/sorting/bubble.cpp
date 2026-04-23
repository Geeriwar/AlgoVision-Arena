#include "bubble.h"
#include <vector>
#include <utility>


using namespace std;

vector<pair<vector<int>, pair<int,int>>> bubbleSort(vector<int> arr) {

    vector<pair<vector<int>, pair<int,int>>> steps;

    steps.push_back({arr, {-1,-1}});

    int n = arr.size();

    for(int i = 0; i < n; i++) {
        for(int j = 0; j < n - i - 1; j++) {
            if(arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
                steps.push_back({arr, {j, j+1}});
            }
        }
    }

    return steps;
}