#include "knapsack.h"
#include <vector>
#include <algorithm>

using namespace std;

//////////////////////////////////////////////////////////////
// 0/1 Knapsack
// n   = number of items
// W   = capacity
// wt  = weights
// val = values
//
// returns steps:
// each step = one DP row snapshot
//////////////////////////////////////////////////////////////

vector<vector<int>> knapsack(
    int n,
    int W,
    vector<int>& wt,
    vector<int>& val
) {
    //////////////////////////////////////////////////
    // DP table
    //////////////////////////////////////////////////
    vector<vector<int>> dp(
        n + 1,
        vector<int>(W + 1, 0)
    );

    //////////////////////////////////////////////////
    // Visualization steps
    //////////////////////////////////////////////////
    vector<vector<int>> steps;

    //////////////////////////////////////////////////
    // Build table
    //////////////////////////////////////////////////
    for (int i = 1; i <= n; i++) {

        for (int w = 0; w <= W; w++) {

            if (wt[i - 1] <= w) {

                dp[i][w] = max(
                    val[i - 1] +
                    dp[i - 1][w - wt[i - 1]],

                    dp[i - 1][w]
                );

            } else {

                dp[i][w] = dp[i - 1][w];
            }
        }

        //////////////////////////////////////////////////
        // Save current row
        //////////////////////////////////////////////////
        steps.push_back(dp[i]);
    }

    //////////////////////////////////////////////////
    // Safety fallback
    //////////////////////////////////////////////////
    if (steps.empty()) {
        steps.push_back(
            vector<int>(W + 1, 0)
        );
    }

    return steps;
}