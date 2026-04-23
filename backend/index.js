const express = require("express");
const cors    = require("cors");
const { execFile } = require("child_process"); // FIX: execFile, not exec — prevents shell injection
const path    = require("path");

const app = express();

app.use(cors());
app.use(express.json());

//////////////////////////////////////////////////////
// CONSTANTS
//////////////////////////////////////////////////////
const ALGO_TYPES = {
  sort: ["Bubble", "Selection", "Insertion", "Quick", "Merge", "Heap"],
  graph: ["BFS", "DFS", "Dijkstra", "Bellman", "Prim", "Kruskal"],
  dp: ["Knapsack", "Subset", "LCS", "LIS"],
};

// Big-O labels for each algorithm
const COMPLEXITY = {
  Bubble:    { time: "O(n²)",        space: "O(1)" },
  Selection: { time: "O(n²)",        space: "O(1)" },
  Insertion: { time: "O(n²)",        space: "O(1)" },
  Quick:     { time: "O(n log n)",   space: "O(log n)" },
  Merge:     { time: "O(n log n)",   space: "O(n)" },
  Heap:      { time: "O(n log n)",   space: "O(1)" },
  BFS:       { time: "O(V + E)",     space: "O(V)" },
  DFS:       { time: "O(V + E)",     space: "O(V)" },
  Dijkstra:  { time: "O(E log V)",   space: "O(V)" },
  Bellman:   { time: "O(V · E)",     space: "O(V)" },
  Prim:      { time: "O(E log V)",   space: "O(V)" },
  Kruskal:   { time: "O(E log E)",   space: "O(V)" },
  Knapsack:  { time: "O(n · W)",     space: "O(n · W)" },
  Subset:    { time: "O(n · target)", space: "O(n · target)" },
  LCS:       { time: "O(m · n)",     space: "O(m · n)" },
  LIS:       { time: "O(n²)",        space: "O(n)" },
};

//////////////////////////////////////////////////////
// DETECT ALGORITHMS from problem description
// Returns { algos: string[], type: 'sort'|'graph'|'dp'|'unknown' }
//////////////////////////////////////////////////////
function detectAlgorithms(problem = "") {
  const t = problem.toLowerCase();

  // Sorting
  if (t.includes("sort")) {
    return {
      type: "sort",
      algos: ["Bubble", "Selection", "Insertion", "Quick", "Merge", "Heap"],
    };
  }

  // Graph — shortest path
  if (
    t.includes("shortest") ||
    t.includes("dijkstra") ||
    t.includes("bellman")
  ) {
    return { type: "graph", algos: ["Dijkstra", "Bellman"] };
  }

  // Graph — MST
  if (t.includes("mst") || t.includes("minimum spanning")) {
    return { type: "graph", algos: ["Prim", "Kruskal"] };
  }

  // Graph — traversal
  if (
    t.includes("traversal") ||
    t.includes("bfs") ||
    t.includes("dfs")
  ) {
    return { type: "graph", algos: ["BFS", "DFS"] };
  }

  // DP
  if (t.includes("knapsack")) return { type: "dp", algos: ["Knapsack"] };
  if (t.includes("subset"))   return { type: "dp", algos: ["Subset"] };
  if (t.includes("lcs"))      return { type: "dp", algos: ["LCS"] };
  if (t.includes("lis"))      return { type: "dp", algos: ["LIS"] };

  // Default fallback
  return { type: "sort", algos: ["Quick"] };
}

//////////////////////////////////////////////////////
// CHECK FOR NEGATIVE EDGE WEIGHTS
//////////////////////////////////////////////////////
function hasNegativeEdge(data = "") {
  for (const e of data.split(",")) {
    const parts = e.trim().split("-");
    if (parts.length === 3) {
      const w = Number(parts[2]);
      if (!isNaN(w) && w < 0) return true;
    }
  }
  return false;
}

//////////////////////////////////////////////////////
// VALIDATE INPUT FORMAT per type
// Returns { valid: bool, reason: string }
//////////////////////////////////////////////////////
function validateInput(type, data) {
  if (!data || data.trim() === "") {
    return { valid: false, reason: "Input data is empty" };
  }

  if (type === "sort") {
    const parts = data.split(",");
    for (const p of parts) {
      if (isNaN(Number(p.trim()))) {
        return { valid: false, reason: `"${p.trim()}" is not a valid number` };
      }
    }
    if (parts.length > 200) {
      return { valid: false, reason: "Too many elements (max 200)" };
    }
  }

  if (type === "graph") {
    const edges = data.split(",");
    for (const e of edges) {
      const parts = e.trim().split("-");
      if (parts.length < 2) {
        return { valid: false, reason: `Malformed edge: "${e.trim()}"` };
      }
    }
  }

  return { valid: true, reason: "" };
}

//////////////////////////////////////////////////////
// OPERATIONS COUNT — used to rank algorithms
//////////////////////////////////////////////////////
function getOperations(algo, output, dataString) {
  // For graph algorithms: count traversal steps
  if (ALGO_TYPES.graph.includes(algo)) {
    return output.steps?.length || 0;
  }

  // For DP: use theoretical cell count
  if (algo === "Subset") {
    const parts = dataString.split("|");
    const arr    = parts[0]?.split(",").filter(Boolean) || [];
    const target = Number(parts[1] || 0);
    return arr.length * Math.max(target, 1);
  }

  if (algo === "Knapsack") {
    const parts    = dataString.split("|");
    const weights  = parts[0]?.split(",").filter(Boolean) || [];
    const capacity = Number(parts[2] || 0);
    return weights.length * Math.max(capacity, 1);
  }

  if (algo === "LCS") {
    const parts = dataString.split("|");
    const s1    = (parts[0] || "").trim();
    const s2    = (parts[1] || "").trim();
    return s1.length * s2.length;
  }

  if (algo === "LIS") {
    const arr = dataString.split(",").filter(Boolean);
    return arr.length * arr.length;
  }

  // Sorting: use actual step count
  return output.steps?.length || 0;
}

//////////////////////////////////////////////////////
// METRIC LABEL per category
//////////////////////////////////////////////////////
function getMetricLabel(algo) {
  if (ALGO_TYPES.sort.includes(algo))  return "Operations";
  if (ALGO_TYPES.graph.includes(algo)) return "Traversals";
  if (ALGO_TYPES.dp.includes(algo))    return "States";
  return "Operations";
}

//////////////////////////////////////////////////////
// RUN A SINGLE ALGO via execFile (safe — no shell)
// Returns parsed JSON output from C++ engine
//////////////////////////////////////////////////////
function runAlgo(exePath, algo, dataString, graphType, source, destination) {
  return new Promise((resolve, reject) => {
    const args = [
      algo,
      dataString,
      String(graphType),
      String(source),
      String(destination),
    ];

    // Timeout: kill process if it runs longer than 10s
    const timeout = 10_000;

    execFile(exePath, args, { timeout }, (error, stdout, stderr) => {
      if (error) {
        // Timeout or crash
        return reject(
          error.killed
            ? `${algo} timed out`
            : `${algo} engine error: ${error.message}`
        );
      }

      if (stderr && stderr.trim()) {
        console.warn(`[${algo}] stderr:`, stderr.trim());
      }

      let parsed;
      try {
        parsed = JSON.parse(stdout);
      } catch {
        return reject(`${algo} returned invalid JSON: ${stdout.slice(0, 80)}`);
      }

      // C++ engine can return { error, steps:[] }
      if (parsed.error) {
        return reject(`${algo}: ${parsed.error}`);
      }

      resolve(parsed);
    });
  });
}

//////////////////////////////////////////////////////
// POST /run
//////////////////////////////////////////////////////
app.post("/run", async (req, res) => {
  console.log("[/run]", req.body);

  try {
    const {
      problem    = "",
      data       = "",
      graphType  = "undirected",
      source     = 0,
      destination = -1,
    } = req.body;

    // 1. Detect what type & which algos to run
    const { type, algos } = detectAlgorithms(problem);

    // 2. Normalize data string
    const dataString = Array.isArray(data)
      ? data.join(",")
      : String(data || "");

    // 3. Validate input format before shelling out
    const validation = validateInput(type, dataString);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.reason,
        results: [],
        best: null,
        skipped: [],
      });
    }

    const exePath = path.join(__dirname, "..", "cpp-engine", "main");

    const negative = hasNegativeEdge(dataString);

    const results = [];
    const skipped = [];

    // 4. Run each algorithm
    for (const algo of algos) {
      // Skip Dijkstra for graphs with negative edge weights
      if (algo === "Dijkstra" && negative) {
        skipped.push("Dijkstra (skipped: graph has negative edge weights — use Bellman-Ford)");
        continue;
      }

      try {
        const output = await runAlgo(
          exePath,
          algo,
          dataString,
          graphType,
          source,
          destination
        );

        results.push({
          algo,
          steps:       output.steps || [],
          result:      output.result || null,
          operations:  getOperations(algo, output, dataString),
          metricLabel: getMetricLabel(algo),
          complexity:  COMPLEXITY[algo] || { time: "N/A", space: "N/A" },
        });
      } catch (err) {
        console.error(`[${algo}] failed:`, err);
        skipped.push(String(err));
      }
    }

    // 5. Find best (fewest ops among successful runs)
    const best = results.length > 0
      ? results.reduce((a, b) => (a.operations <= b.operations ? a : b))
      : null;

    res.json({
      success: true,
      type,
      results,
      best,
      skipped,
    });

  } catch (err) {
    console.error("[/run] unhandled error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      results: [],
      best: null,
      skipped: [],
    });
  }
});

//////////////////////////////////////////////////////
// GET / — health check
//////////////////////////////////////////////////////
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "AlgoVision backend running" });
});

//////////////////////////////////////////////////////
// START
//////////////////////////////////////////////////////
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`AlgoVision backend running on port ${PORT}`);
});