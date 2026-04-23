#include "subset.h"
#include <vector>

using namespace std;

//////////////////////////////////////////////////////////////
// Subset Sum
// arr    = input numbers
// target = desired sum
//
// returns steps:
// each step = one DP row snapshot
// 1 = possible
// 0 = not possible
//////////////////////////////////////////////////////////////

vector<vector<int>> subsetSum(
    vector<int>& arr,
    int target
) {
    int n = arr.size();

    //////////////////////////////////////////////////
    // DP table
    //////////////////////////////////////////////////
    vector<vector<int>> dp(
        n + 1,
        vector<int>(target + 1, 0)
    );

    //////////////////////////////////////////////////
    // Visualization steps
    //////////////////////////////////////////////////
    vector<vector<int>> steps;

    //////////////////////////////////////////////////
    // Sum 0 always possible
    //////////////////////////////////////////////////
    for (int i = 0; i <= n; i++) {
        dp[i][0] = 1;
    }

    //////////////////////////////////////////////////
    // Fill DP
    //////////////////////////////////////////////////
    for (int i = 1; i <= n; i++) {

        for (int t = 1; t <= target; t++) {

            if (arr[i - 1] <= t) {

                dp[i][t] =
                    dp[i - 1][t] ||
                    dp[i - 1][t - arr[i - 1]];

            } else {

                dp[i][t] = dp[i - 1][t];
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
            vector<int>(target + 1, 0)
        );
    }

    return steps;
}