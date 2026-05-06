import React, { useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --green:  #00f5a0;
      --cyan:   #00d9f5;
      --purple: #9d4edd;
      --pink:   #f72585;
      --amber:  #fbbf24;
      --bg0:    #020408;
      --bg1:    #080d16;
      --bg2:    #0d1526;
      --bg3:    #111d35;
      --glass:  rgba(255,255,255,0.04);
      --glass2: rgba(255,255,255,0.07);
      --glass3: rgba(255,255,255,0.10);
      --border: rgba(255,255,255,0.08);
      --border2: rgba(255,255,255,0.13);
      --text:   #e2e8f0;
      --muted:  #64748b;
      --muted2: #94a3b8;
    }

    body { background: var(--bg0); color: var(--text); font-family: 'Syne', sans-serif; overflow-x: hidden; }

    @keyframes fadeUp   { from { opacity:0; transform: translateY(32px); } to { opacity:1; transform: translateY(0); } }
    @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
    @keyframes scaleIn  { from { opacity:0; transform: scale(0.88) translateY(16px); } to { opacity:1; transform: scale(1) translateY(0); } }
    @keyframes pulse    { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
    @keyframes spin3d   { from { transform: rotateY(0deg) rotateX(12deg); } to { transform: rotateY(360deg) rotateX(12deg); } }
    @keyframes dotBlink { 0%,80%,100% { transform:scale(0); } 40% { transform:scale(1); } }
    @keyframes winnerGlow {
      0%,100% { box-shadow: 0 0 20px rgba(0,245,160,0.3), 0 0 60px rgba(0,245,160,0.1); }
      50%      { box-shadow: 0 0 40px rgba(0,245,160,0.6), 0 0 100px rgba(0,245,160,0.2); }
    }
    @keyframes titleGrad {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes orb1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(60px,40px) scale(1.1); } }
    @keyframes orb2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px,60px) scale(0.9); } }
    @keyframes orb3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-50px) scale(1.08); } }
    @keyframes slideRight { from { transform: translateX(-20px); opacity:0; } to { transform: translateX(0); opacity:1; } }
    @keyframes countUp { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes progressFill { from { width: 0%; } to { width: var(--target-width); } }
    @keyframes quizCorrect { 0%,100% { box-shadow: 0 0 0 2px rgba(0,245,160,0); } 50% { box-shadow: 0 0 0 4px rgba(0,245,160,0.5); } }
    @keyframes quizWrong { 0%,100% { box-shadow: 0 0 0 2px rgba(247,37,133,0); } 50% { box-shadow: 0 0 0 4px rgba(247,37,133,0.5); } }

    .run-btn {
      position: relative; overflow: hidden; cursor: pointer; border: none;
      padding: 16px 36px; border-radius: 14px; font-family: 'Syne',sans-serif;
      font-size: 16px; font-weight: 700; letter-spacing: 0.04em; color: #000;
      background: linear-gradient(135deg, var(--green), var(--cyan));
      transition: transform 0.18s, box-shadow 0.18s;
    }
    .run-btn::before {
      content:''; position:absolute; inset:0;
      background: linear-gradient(135deg, var(--cyan), var(--green));
      opacity: 0; transition: opacity 0.25s;
    }
    .run-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 40px rgba(0,245,160,0.45); }
    .run-btn:hover::before { opacity: 1; }
    .run-btn:active { transform: translateY(0) scale(0.98); }
    .run-btn span { position: relative; z-index: 1; }
    .run-btn:disabled { pointer-events: none; opacity: 0.6; }

    .toggle-btn {
      flex: 1; padding: 10px 18px; border-radius: 10px;
      font-family: 'Syne',sans-serif; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 0.2s; border: 1px solid var(--border);
      background: var(--glass); color: var(--muted);
    }
    .toggle-btn:hover { background: var(--glass2); color: var(--text); }
    .toggle-btn.active {
      background: linear-gradient(135deg, rgba(0,245,160,0.15), rgba(0,217,245,0.1));
      border-color: rgba(0,245,160,0.4); color: var(--green);
    }

    .glass-input {
      width: 100%; padding: 14px 16px; border-radius: 12px;
      background: rgba(0,0,0,0.35); border: 1px solid var(--border);
      color: var(--text); font-family: 'JetBrains Mono',monospace; font-size: 13px;
      transition: border-color 0.2s, box-shadow 0.2s; outline: none; resize: vertical;
    }
    .glass-input::placeholder { color: var(--muted); }
    .glass-input:focus {
      border-color: rgba(0,245,160,0.4);
      box-shadow: 0 0 0 3px rgba(0,245,160,0.08);
    }
    .glass-input.error {
      border-color: rgba(247,37,133,0.5);
      box-shadow: 0 0 0 3px rgba(247,37,133,0.08);
    }

    .algo-card {
      padding: 22px; border-radius: 20px;
      background: var(--glass); border: 1px solid var(--border);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), border-color 0.3s, box-shadow 0.3s;
      animation: scaleIn 0.5s cubic-bezier(.34,1.56,.64,1) both;
    }
    .algo-card:hover {
      transform: translateY(-6px) scale(1.01);
      border-color: rgba(0,245,160,0.18);
      box-shadow: 0 24px 60px rgba(0,0,0,0.5);
    }
    .algo-card.winner-card { animation: winnerGlow 2.5s ease-in-out infinite; border-color: rgba(0,245,160,0.35); }

    .speed-slider {
      width: 100%; height: 4px; border-radius: 2px; outline: none; border: none;
      appearance: none; -webkit-appearance: none;
      background: linear-gradient(90deg, var(--green), var(--cyan));
      cursor: pointer;
    }
    .speed-slider::-webkit-slider-thumb {
      appearance: none; width: 18px; height: 18px; border-radius: 50%;
      background: linear-gradient(135deg, var(--green), var(--cyan));
      box-shadow: 0 0 10px rgba(0,245,160,0.5); cursor: pointer;
      transition: transform 0.15s;
    }
    .speed-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }

    .step-btn {
      padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border);
      background: var(--glass); color: var(--text); font-family: 'Syne',sans-serif;
      font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .step-btn:hover { background: var(--glass2); border-color: rgba(0,245,160,0.3); color: var(--green); }
    .step-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    .complexity-badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 9px; border-radius: 6px; font-size: 11px;
      font-family: 'JetBrains Mono',monospace; font-weight: 500;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      color: var(--muted);
    }
    .complexity-badge.time { color: var(--cyan); border-color: rgba(0,217,245,0.25); background: rgba(0,217,245,0.07); }
    .complexity-badge.space { color: var(--purple); border-color: rgba(157,78,221,0.25); background: rgba(157,78,221,0.07); }

    .error-banner {
      padding: 12px 16px; border-radius: 10px;
      background: rgba(247,37,133,0.08); border: 1px solid rgba(247,37,133,0.25);
      color: rgba(247,37,133,0.9); font-size: 13px; font-family: 'JetBrains Mono',monospace;
      display: flex; align-items: flex-start; gap: 10px;
    }
    .skipped-banner {
      padding: 10px 14px; border-radius: 10px;
      background: rgba(157,78,221,0.08); border: 1px solid rgba(157,78,221,0.2);
      color: rgba(157,78,221,0.9); font-size: 12px; font-family: 'JetBrains Mono',monospace;
    }

    /* ── NAV ── */
    .nav-tab {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 20px; border-radius: 12px; cursor: pointer;
      border: 1px solid transparent; font-family: 'Syne',sans-serif;
      font-size: 13px; font-weight: 600; transition: all 0.2s; background: transparent;
      color: var(--muted); white-space: nowrap;
    }
    .nav-tab:hover { color: var(--text); background: var(--glass); border-color: var(--border); }
    .nav-tab.active {
      color: var(--green); background: rgba(0,245,160,0.08);
      border-color: rgba(0,245,160,0.25);
    }
    .nav-dot { width:6px; height:6px; border-radius:50%; background: var(--green); animation: pulse 2s infinite; }

    /* ── QUIZ ── */
    .quiz-option {
      padding: 14px 18px; border-radius: 12px; cursor: pointer;
      border: 1px solid var(--border); background: var(--glass);
      font-family: 'Syne',sans-serif; font-size: 14px; color: var(--text);
      transition: all 0.2s; text-align: left; width: 100%;
    }
    .quiz-option:hover:not(:disabled) { border-color: rgba(0,245,160,0.3); background: var(--glass2); }
    .quiz-option.correct { border-color: rgba(0,245,160,0.6); background: rgba(0,245,160,0.1); color: var(--green); animation: quizCorrect 0.5s; }
    .quiz-option.wrong   { border-color: rgba(247,37,133,0.6); background: rgba(247,37,133,0.08); color: rgba(247,37,133,0.9); animation: quizWrong 0.5s; }
    .quiz-option:disabled { cursor: default; }

    /* ── CHEATSHEET ── */
    .cheat-card {
      padding: 20px; border-radius: 16px; border: 1px solid var(--border);
      background: var(--glass); backdrop-filter: blur(12px);
      transition: border-color 0.2s, transform 0.2s;
    }
    .cheat-card:hover { border-color: rgba(0,217,245,0.25); transform: translateY(-3px); }

    /* ── PLAYGROUND ── */
    .preset-chip {
      padding: 7px 14px; border-radius: 8px; cursor: pointer;
      border: 1px solid var(--border); background: var(--glass);
      font-size: 12px; font-family: 'Syne',sans-serif; font-weight: 600;
      color: var(--muted2); transition: all 0.2s; white-space: nowrap;
    }
    .preset-chip:hover { border-color: rgba(0,245,160,0.3); color: var(--green); background: rgba(0,245,160,0.06); }

    /* ── HISTORY ── */
    .hist-row {
      display: flex; align-items: center; gap: 12px; padding: 14px 18px;
      border-radius: 12px; border: 1px solid var(--border); background: var(--glass);
      cursor: pointer; transition: all 0.2s; font-size: 13px;
    }
    .hist-row:hover { border-color: rgba(0,245,160,0.25); background: var(--glass2); }

    /* ── SCROLLBAR ── */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

    .section-badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 14px; border-radius: 99px; font-size: 11px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
    }
    .highlight-row { transition: background 0.3s; }
    .highlight-row:hover { background: var(--glass); border-radius: 8px; }

    /* Code block */
    .code-block {
      background: rgba(0,0,0,0.5); border: 1px solid var(--border);
      border-radius: 12px; padding: 16px; font-family: 'JetBrains Mono',monospace;
      font-size: 12px; color: var(--cyan); overflow-x: auto; line-height: 1.7;
    }
    .code-block .kw  { color: var(--purple); }
    .code-block .fn  { color: var(--green); }
    .code-block .cm  { color: var(--muted); }
    .code-block .str { color: var(--amber); }
    .code-block .num { color: var(--pink); }
  `}</style>
);

/* ─────────────────────────────────────────────
   ALGO TYPE ENUM
───────────────────────────────────────────── */
const ALGO_TYPE = { SORT:"sort", GRAPH:"graph", DP:"dp", NONE:"none" };
function detectType(problem="") {
  const t = problem.toLowerCase();
  if (/sort/.test(t)) return ALGO_TYPE.SORT;
  if (/path|graph|dijkstra|bellman|bfs|dfs|mst|spanning/.test(t)) return ALGO_TYPE.GRAPH;
  if (/knapsack|subset|lcs|lis/.test(t)) return ALGO_TYPE.DP;
  return ALGO_TYPE.NONE;
}
function needsSourceDest(p="") { return /shortest|dijkstra|bellman|bfs|dfs/.test(p.toLowerCase()); }

/* ─────────────────────────────────────────────
   KNOWLEDGE BASE for learning features
───────────────────────────────────────────── */
const ALGO_KNOWLEDGE = {
  Bubble: {
    category: "Sorting", color: "#00d9f5",
    description: "Repeatedly steps through the list, compares adjacent elements and swaps them if out of order. The largest unsorted element 'bubbles' to the top each pass.",
    howItWorks: ["Compare adjacent pairs", "Swap if left > right", "Repeat until no swaps needed", "Each pass places one more element in its final position"],
    whenToUse: "Small datasets, nearly sorted data, teaching purposes. Avoid for large n due to O(n²).",
    pseudocode: `for i in 0..n-1:\n  for j in 0..n-i-2:\n    if arr[j] > arr[j+1]:\n      swap(arr[j], arr[j+1])`,
    complexity: { time: "O(n²)", space: "O(1)", best: "O(n)", worst: "O(n²)" },
    facts: ["Stable sort — equal elements stay in order", "In-place — uses O(1) extra space", "Adaptive — O(n) on nearly sorted data"],
  },
  Selection: {
    category: "Sorting", color: "#9d4edd",
    description: "Divides input into sorted and unsorted regions. Repeatedly selects the minimum from the unsorted region and moves it to the end of the sorted region.",
    howItWorks: ["Find minimum in unsorted portion", "Swap it with first unsorted element", "Expand sorted region by 1", "Repeat until sorted"],
    whenToUse: "When writes are expensive (minimizes swaps). Small arrays. Not suitable for large data.",
    pseudocode: `for i in 0..n-1:\n  min_idx = i\n  for j in i+1..n:\n    if arr[j] < arr[min_idx]:\n      min_idx = j\n  swap(arr[i], arr[min_idx])`,
    complexity: { time: "O(n²)", space: "O(1)", best: "O(n²)", worst: "O(n²)" },
    facts: ["Not stable — swapping can change relative order", "Minimum number of swaps: O(n)", "Simple implementation"],
  },
  Insertion: {
    category: "Sorting", color: "#f72585",
    description: "Builds sorted array one element at a time by inserting each new element into its correct position within the already-sorted portion.",
    howItWorks: ["Take next unsorted element", "Find its correct position in sorted portion", "Shift elements right to make room", "Insert element at correct position"],
    whenToUse: "Small arrays, online sorting (elements arrive one at a time), nearly sorted data.",
    pseudocode: `for i in 1..n:\n  key = arr[i]\n  j = i - 1\n  while j >= 0 and arr[j] > key:\n    arr[j+1] = arr[j]\n    j -= 1\n  arr[j+1] = key`,
    complexity: { time: "O(n²)", space: "O(1)", best: "O(n)", worst: "O(n²)" },
    facts: ["Stable sort", "Adaptive — O(nk) for k-sorted arrays", "Efficient for small n"],
  },
  Quick: {
    category: "Sorting", color: "#00f5a0",
    description: "Divide-and-conquer algorithm that selects a 'pivot' element and partitions the array around it — smaller elements go left, larger go right. Recursively sorts partitions.",
    howItWorks: ["Choose pivot (last, first, or random)", "Partition: place pivot at correct index", "All elements left < pivot, all right > pivot", "Recursively quicksort left and right subarrays"],
    whenToUse: "General purpose sorting. Best average case. Preferred when average O(n log n) suffices and in-place is needed.",
    pseudocode: `quicksort(arr, lo, hi):\n  if lo < hi:\n    p = partition(arr, lo, hi)\n    quicksort(arr, lo, p-1)\n    quicksort(arr, p+1, hi)`,
    complexity: { time: "O(n log n)", space: "O(log n)", best: "O(n log n)", worst: "O(n²)" },
    facts: ["Not stable in typical implementation", "Cache-friendly (in-place)", "Worst case O(n²) with bad pivot selection"],
  },
  Merge: {
    category: "Sorting", color: "#fbbf24",
    description: "Divide-and-conquer algorithm that splits array in half, recursively sorts each half, then merges the two sorted halves into a single sorted array.",
    howItWorks: ["Divide array into two halves", "Recursively sort each half", "Merge two sorted halves", "Compare and copy elements in order"],
    whenToUse: "When stability is required, linked lists, external sorting (large data on disk), guaranteed O(n log n).",
    pseudocode: `mergesort(arr):\n  if len(arr) <= 1: return arr\n  mid = len(arr) // 2\n  L = mergesort(arr[:mid])\n  R = mergesort(arr[mid:])\n  return merge(L, R)`,
    complexity: { time: "O(n log n)", space: "O(n)", best: "O(n log n)", worst: "O(n log n)" },
    facts: ["Stable sort", "Guaranteed O(n log n) always", "O(n) extra space required"],
  },
  Heap: {
    category: "Sorting", color: "#9d4edd",
    description: "Uses a max-heap data structure. First builds a max-heap from the array, then repeatedly extracts the maximum element, placing it at the end.",
    howItWorks: ["Build max-heap from array (heapify)", "Extract max (root) and place at end", "Reduce heap size by 1", "Heapify root, repeat"],
    whenToUse: "When guaranteed O(n log n) and in-place O(1) space is needed. Used in priority queues.",
    pseudocode: `heapsort(arr):\n  build_max_heap(arr)\n  for i = n-1 down to 1:\n    swap(arr[0], arr[i])\n    heapify(arr, 0, i)`,
    complexity: { time: "O(n log n)", space: "O(1)", best: "O(n log n)", worst: "O(n log n)" },
    facts: ["Not stable", "In-place O(1) extra space", "Poor cache performance vs quicksort"],
  },
  BFS: {
    category: "Graph", color: "#00d9f5",
    description: "Explores graph level by level using a queue. Visits all neighbors of a node before moving deeper.",
    howItWorks: ["Start from source, mark visited", "Enqueue source", "Dequeue node, visit all unvisited neighbors", "Enqueue each unvisited neighbor, mark visited"],
    whenToUse: "Shortest path in unweighted graphs, level-order traversal, finding all nodes within k hops.",
    pseudocode: `bfs(graph, source):\n  queue = [source]\n  visited = {source}\n  while queue:\n    node = queue.pop(0)\n    for neighbor in graph[node]:\n      if neighbor not in visited:\n        visited.add(neighbor)\n        queue.append(neighbor)`,
    complexity: { time: "O(V+E)", space: "O(V)", best: "O(V+E)", worst: "O(V+E)" },
    facts: ["Guarantees shortest path in unweighted graphs", "Uses a queue (FIFO)", "Visits nodes in non-decreasing distance order"],
  },
  DFS: {
    category: "Graph", color: "#f72585",
    description: "Explores as deep as possible along each branch before backtracking. Uses a stack (or recursion).",
    howItWorks: ["Start from source, mark visited", "Recursively visit each unvisited neighbor", "Backtrack when no unvisited neighbors", "Continue until all reachable nodes visited"],
    whenToUse: "Cycle detection, topological sort, finding connected components, maze solving.",
    pseudocode: `dfs(graph, node, visited):\n  visited.add(node)\n  for neighbor in graph[node]:\n    if neighbor not in visited:\n      dfs(graph, neighbor, visited)`,
    complexity: { time: "O(V+E)", space: "O(V)", best: "O(V+E)", worst: "O(V+E)" },
    facts: ["Does NOT guarantee shortest path", "Uses a stack (LIFO) or recursion", "Good for exploring all paths"],
  },
  Dijkstra: {
    category: "Graph", color: "#00f5a0",
    description: "Greedy algorithm that finds shortest paths from source to all nodes. Uses a priority queue to always process the nearest unvisited node.",
    howItWorks: ["Initialize all distances to ∞, source to 0", "Use min-priority queue on distances", "Extract min node, relax its edges", "Update distances if shorter path found"],
    whenToUse: "Shortest path with non-negative weights. GPS navigation, network routing.",
    pseudocode: `dijkstra(graph, src):\n  dist[src] = 0\n  pq = [(0, src)]\n  while pq:\n    d, u = heappop(pq)\n    for v, w in graph[u]:\n      if dist[u]+w < dist[v]:\n        dist[v] = dist[u]+w\n        heappush(pq, (dist[v], v))`,
    complexity: { time: "O(E log V)", space: "O(V)", best: "O(E log V)", worst: "O(E log V)" },
    facts: ["Fails with negative edge weights", "Greedy approach with priority queue", "Produces shortest path tree"],
  },
  Bellman: {
    category: "Graph", color: "#fbbf24",
    description: "Dynamic programming approach to shortest paths. Relaxes ALL edges V-1 times, handling negative edge weights.",
    howItWorks: ["Initialize all distances to ∞, source to 0", "Repeat V-1 times: relax all edges", "If dist[u] + w < dist[v], update dist[v]", "Run one more pass to detect negative cycles"],
    whenToUse: "Graphs with negative edge weights, detecting negative cycles.",
    pseudocode: `bellman_ford(graph, src):\n  dist = {v: INF for v in V}; dist[src]=0\n  for _ in range(V-1):\n    for u,v,w in edges:\n      if dist[u]+w < dist[v]:\n        dist[v] = dist[u]+w`,
    complexity: { time: "O(V·E)", space: "O(V)", best: "O(V·E)", worst: "O(V·E)" },
    facts: ["Handles negative edge weights", "Slower than Dijkstra", "Detects negative weight cycles"],
  },
  Prim: {
    category: "Graph", color: "#9d4edd",
    description: "Greedy MST algorithm that grows the spanning tree one edge at a time, always adding the minimum weight edge connecting the tree to a new vertex.",
    howItWorks: ["Start with arbitrary vertex", "Track min-cost edge to each non-tree vertex", "Add cheapest edge to tree", "Update costs for newly reachable vertices"],
    whenToUse: "Dense graphs, when MST is needed and graph is given as adjacency matrix.",
    pseudocode: `prim(graph):\n  in_mst = {start}\n  while len(in_mst) < V:\n    min_edge = min_cost_crossing_edge()\n    add edge and vertex to MST`,
    complexity: { time: "O(E log V)", space: "O(V)", best: "O(E log V)", worst: "O(E log V)" },
    facts: ["Always produces MST", "Best for dense graphs", "Similar to Dijkstra structure"],
  },
  Kruskal: {
    category: "Graph", color: "#00d9f5",
    description: "Greedy MST algorithm that sorts all edges by weight and greedily adds edges that don't create a cycle, using Union-Find to detect cycles.",
    howItWorks: ["Sort all edges by weight", "Initialize Union-Find structure", "For each edge in sorted order:", "Add edge if it connects two different components (no cycle)"],
    whenToUse: "Sparse graphs, when edges are already sorted.",
    pseudocode: `kruskal(edges):\n  sort edges by weight\n  uf = UnionFind(V)\n  for u,v,w in edges:\n    if uf.find(u) != uf.find(v):\n      uf.union(u,v)\n      add edge to MST`,
    complexity: { time: "O(E log E)", space: "O(V)", best: "O(E log E)", worst: "O(E log E)" },
    facts: ["Uses Union-Find data structure", "Best for sparse graphs", "Processes edges globally, not vertex-by-vertex"],
  },
  Knapsack: {
    category: "DP", color: "#00f5a0",
    description: "Given items with weights and values, find max value subset fitting within weight capacity. Classic DP problem.",
    howItWorks: ["Build dp[i][w] = max value using first i items with capacity w", "For each item: either skip it or include it", "dp[i][w] = max(dp[i-1][w], val[i]+dp[i-1][w-wt[i]])", "Answer is dp[n][W]"],
    whenToUse: "Resource allocation, budget optimization, cargo loading.",
    pseudocode: `for i in 1..n:\n  for w in 0..W:\n    dp[i][w] = dp[i-1][w]  // skip\n    if wt[i] <= w:\n      dp[i][w] = max(dp[i][w],\n        val[i] + dp[i-1][w-wt[i]])`,
    complexity: { time: "O(n·W)", space: "O(n·W)", best: "O(n·W)", worst: "O(n·W)" },
    facts: ["Pseudo-polynomial time", "Can be optimized to O(W) space", "Foundation of many optimization problems"],
  },
  LCS: {
    category: "DP", color: "#00d9f5",
    description: "Finds the longest sequence present in both strings (not necessarily contiguous). Classic string DP.",
    howItWorks: ["Build dp[i][j] = LCS length of s1[:i] and s2[:j]", "If s1[i]==s2[j]: dp[i][j] = dp[i-1][j-1] + 1", "Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])", "Backtrack to find actual sequence"],
    whenToUse: "Diff tools, bioinformatics (DNA comparison), version control.",
    pseudocode: `for i in 1..m:\n  for j in 1..n:\n    if s1[i]==s2[j]:\n      dp[i][j] = dp[i-1][j-1]+1\n    else:\n      dp[i][j] = max(dp[i-1][j], dp[i][j-1])`,
    complexity: { time: "O(m·n)", space: "O(m·n)", best: "O(m·n)", worst: "O(m·n)" },
    facts: ["Different from Longest Common Substring", "Not contiguous — elements can have gaps", "Used in Git diff and DNA sequencing"],
  },
  LIS: {
    category: "DP", color: "#f72585",
    description: "Finds the longest strictly increasing subsequence in an array.",
    howItWorks: ["dp[i] = LIS ending at index i", "For each i, check all j < i", "If arr[j] < arr[i]: dp[i] = max(dp[i], dp[j]+1)", "Answer = max(dp)"],
    whenToUse: "Patience sorting, scheduling problems, longest increasing chain of events.",
    pseudocode: `dp = [1] * n\nfor i in 1..n:\n  for j in 0..i:\n    if arr[j] < arr[i]:\n      dp[i] = max(dp[i], dp[j]+1)\nreturn max(dp)`,
    complexity: { time: "O(n²)", space: "O(n)", best: "O(n²)", worst: "O(n²)" },
    facts: ["Can be optimized to O(n log n) with patience sorting", "Subsequence need not be contiguous", "Classic DP warm-up problem"],
  },
  Subset: {
    category: "DP", color: "#fbbf24",
    description: "Determines if any subset of the array sums exactly to the target value.",
    howItWorks: ["dp[i][s] = can we form sum s using first i elements?", "For each element: either include or exclude", "dp[i][s] = dp[i-1][s] OR dp[i-1][s-arr[i]]", "Answer is dp[n][target]"],
    whenToUse: "Partition problems, change-making, resource allocation.",
    pseudocode: `dp[0][0] = true\nfor i in 1..n:\n  for s in 0..target:\n    dp[i][s] = dp[i-1][s]\n    if s >= arr[i]:\n      dp[i][s] |= dp[i-1][s-arr[i]]`,
    complexity: { time: "O(n·target)", space: "O(n·target)", best: "O(n·target)", worst: "O(n·target)" },
    facts: ["Special case of 0/1 Knapsack", "NP-complete in general (here pseudo-polynomial)", "Foundation of partition problem"],
  },
};

/* ─────────────────────────────────────────────
   QUIZ QUESTIONS
───────────────────────────────────────────── */
const QUIZ_BANK = [
  { q: "Which sorting algorithm has guaranteed O(n log n) in ALL cases?", opts: ["Quick Sort","Bubble Sort","Merge Sort","Selection Sort"], ans: 2, exp: "Merge Sort always runs in O(n log n) regardless of input. Quick Sort degrades to O(n²) on bad pivot choices." },
  { q: "BFS uses which data structure?", opts: ["Stack","Queue","Priority Queue","Heap"], ans: 1, exp: "BFS uses a Queue (FIFO) to explore nodes level by level." },
  { q: "Which algorithm CANNOT handle negative edge weights?", opts: ["Bellman-Ford","Dijkstra","Floyd-Warshall","All can handle negatives"], ans: 1, exp: "Dijkstra assumes non-negative weights. With negatives, it may produce incorrect results." },
  { q: "What is the space complexity of Merge Sort?", opts: ["O(1)","O(log n)","O(n)","O(n²)"], ans: 2, exp: "Merge Sort requires O(n) extra space for the temporary merged array." },
  { q: "Which graph algorithm finds a Minimum Spanning Tree?", opts: ["Dijkstra","BFS","Kruskal","Bellman-Ford"], ans: 2, exp: "Kruskal's algorithm finds the MST by greedily adding minimum-weight edges that don't create cycles." },
  { q: "LCS stands for:", opts: ["Longest Common Subsequence","Longest Consecutive Sequence","Last Common Substring","Lowest Cost Search"], ans: 0, exp: "LCS = Longest Common Subsequence — the longest sequence common to both strings, not necessarily contiguous." },
  { q: "Quick Sort's worst case occurs when:", opts: ["Array is random","Array is sorted or reverse-sorted","Array has duplicates","Array has even length"], ans: 1, exp: "When array is already sorted and we always pick first/last as pivot, Quick Sort degrades to O(n²)." },
  { q: "DFS is most suitable for:", opts: ["Shortest path in unweighted graph","Cycle detection","Finding minimum spanning tree","Finding closest node"], ans: 1, exp: "DFS is excellent for cycle detection and topological sorting due to its recursive depth-first nature." },
  { q: "Heap Sort is:", opts: ["Stable and in-place","Unstable and in-place","Stable and uses O(n) space","Unstable and uses O(n) space"], ans: 1, exp: "Heap Sort is in-place (O(1) space) but NOT stable — equal elements may change relative order." },
  { q: "The 0/1 Knapsack problem has time complexity:", opts: ["O(n²)","O(n log n)","O(n·W)","O(2ⁿ)"], ans: 2, exp: "With DP, Knapsack runs in O(n·W) — pseudo-polynomial, depending on weight capacity W." },
];

/* ─────────────────────────────────────────────
   PRESETS for Playground
───────────────────────────────────────────── */
const PRESETS = [
  { label: "Sort 8 nums", problem: "sort", data: "64, 25, 12, 22, 11, 90, 45, 3" },
  { label: "Nearly sorted", problem: "sort", data: "1, 2, 4, 3, 5, 6, 8, 7" },
  { label: "BFS traversal", problem: "bfs traversal", data: "0-1-1,0-2-1,1-3-1,2-3-1,3-4-1" },
  { label: "Dijkstra SSSP", problem: "shortest path dijkstra", data: "0-1-4,0-2-1,2-1-2,1-3-1,2-3-5" },
  { label: "MST Kruskal", problem: "minimum spanning tree mst", data: "0-1-4,0-2-3,1-2-1,1-3-2,2-3-4" },
  { label: "Knapsack DP", problem: "knapsack", data: "1,3,4,5|1,4,5,7|7" },
  { label: "LCS strings", problem: "lcs", data: "ABCBDAB|BDCAB" },
  { label: "Bellman-Ford", problem: "bellman shortest path", data: "0-1-4,0-2-1,2-1-2,1-3-1" },
];

/* ─────────────────────────────────────────────
   LOADING SCREEN
───────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000,
      background:"radial-gradient(ellipse at 50% 40%, #0d1a2e 0%, #020408 70%)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:28 }}>
      <div style={{ perspective:600 }}>
        <div style={{ width:72, height:72,
          background:"linear-gradient(135deg, rgba(0,245,160,0.9), rgba(0,217,245,0.9), rgba(157,78,221,0.9))",
          borderRadius:18, animation:"spin3d 1.8s linear infinite",
          boxShadow:"0 0 60px rgba(0,245,160,0.4)" }} />
      </div>
      <div style={{ display:"flex", gap:8 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:"var(--green)",
            animation:`dotBlink 1.4s ease-in-out ${i*0.16}s infinite` }} />
        ))}
      </div>
      <p style={{ color:"var(--muted)", fontSize:14, fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.1em" }}>
        Initializing AlgoVision…
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AMBIENT BACKGROUND
───────────────────────────────────────────── */
function AmbientBg() {
  return (
    <div style={{ position:"fixed", inset:0, overflow:"hidden", zIndex:0, pointerEvents:"none" }}>
      <div style={{ position:"absolute", width:700, height:700, borderRadius:"50%", top:"-20%", left:"-15%",
        background:"radial-gradient(circle, rgba(0,245,160,0.07) 0%, transparent 70%)", animation:"orb1 18s ease-in-out infinite" }} />
      <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", top:"30%", right:"-10%",
        background:"radial-gradient(circle, rgba(0,217,245,0.06) 0%, transparent 70%)", animation:"orb2 22s ease-in-out infinite" }} />
      <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", bottom:"-10%", left:"30%",
        background:"radial-gradient(circle, rgba(157,78,221,0.06) 0%, transparent 70%)", animation:"orb3 26s ease-in-out infinite" }} />
      <div style={{ position:"absolute", inset:0,
        backgroundImage:"radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)",
        backgroundSize:"48px 48px" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   GRAPH VIEW
───────────────────────────────────────────── */
function GraphView({ steps, algo, dataInput, stepIndex }) {
  if (!steps || steps.length === 0) return null;
  const edges = dataInput.split(",").map(x=>x.trim()).filter(Boolean).map(e=>{
    const p = e.split("-").map(Number); return {u:p[0],v:p[1],w:p[2]??1};
  }).filter(e=>!isNaN(e.u)&&!isNaN(e.v));
  if (edges.length===0) return null;
  const nodes = [...new Set(edges.flatMap(e=>[e.u,e.v]))];
  const cx=170,cy=120,radius=92;
  const pos={};
  nodes.forEach((n,i)=>{
    const angle=(2*Math.PI*i)/nodes.length;
    pos[n]={x:cx+radius*Math.cos(angle-Math.PI/2),y:cy+radius*Math.sin(angle-Math.PI/2)};
  });
  const current=steps[Math.min(stepIndex,steps.length-1)]||[];
  const algoLower=algo.toLowerCase();
  function edgeActive(e){
    if(/bfs|dfs/.test(algoLower)) return current.includes(e.u)&&current.includes(e.v);
    if(/prim/.test(algoLower)) return current[0]===e.v||current[0]===e.u;
    if(/kruskal/.test(algoLower)) return current[0]===e.u&&current[1]===e.v;
    return false;
  }
  function nodeActive(n){ if(/dijkstra|bellman/.test(algoLower)) return true; return current.includes(n); }
  return (
    <svg width="340" height="240" style={{overflow:"visible"}}>
      <defs><filter id="glow2"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      {edges.map((e,i)=>{
        const active=edgeActive(e);
        const x1=pos[e.u]?.x,y1=pos[e.u]?.y,x2=pos[e.v]?.x,y2=pos[e.v]?.y;
        if(x1==null||x2==null) return null;
        return (<g key={i}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={active?"rgba(0,245,160,0.7)":"rgba(255,255,255,0.08)"} strokeWidth={active?2.5:1} filter={active?"url(#glow2)":"none"} style={{transition:"stroke 0.4s,stroke-width 0.4s"}}/><text x={(x1+x2)/2} y={(y1+y2)/2-5} fill={active?"var(--green)":"rgba(255,255,255,0.3)"} fontSize="11" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">{e.w}</text></g>);
      })}
      {nodes.map(n=>{
        const active=nodeActive(n); const p=pos[n];
        if(!p) return null;
        return (<g key={n} style={{transition:"all 0.4s"}}>{active&&<circle cx={p.x} cy={p.y} r="22" fill="rgba(0,245,160,0.08)" filter="url(#glow2)"/>}<circle cx={p.x} cy={p.y} r="15" fill={active?"rgba(0,245,160,0.2)":"rgba(13,21,38,0.9)"} stroke={active?"var(--green)":"rgba(255,255,255,0.12)"} strokeWidth={active?1.5:1} filter={active?"url(#glow2)":"none"} style={{transition:"all 0.4s cubic-bezier(.34,1.56,.64,1)"}}/><text x={p.x} y={p.y} textAnchor="middle" dy=".35em" fill={active?"var(--green)":"var(--text)"} fontSize="11" fontWeight="700" fontFamily="'JetBrains Mono',monospace">{n}</text></g>);
      })}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   SORT BARS VIEW
───────────────────────────────────────────── */
function BarsView({ steps, stepIndex }) {
  if (!steps||steps.length===0) return null;
  const current=steps[Math.min(stepIndex,steps.length-1)];
  const arr=current?.array||current||[];
  if(!Array.isArray(arr)||arr.length===0) return null;
  const max=Math.max(...arr,1);
  const compareSet=new Set(Array.isArray(current?.compare)?current.compare:[]);
  return (
    <div style={{display:"flex",gap:arr.length>30?2:5,alignItems:"flex-end",height:180,padding:"0 8px",width:"100%"}}>
      {arr.map((v,i)=>{
        const pct=(v/max)*160; const isComparing=compareSet.has(i);
        return (<div key={i} style={{flex:1,minWidth:4,height:`${pct}px`,borderRadius:"4px 4px 0 0",
          background:isComparing?"linear-gradient(180deg, var(--pink), var(--purple))":
          `linear-gradient(180deg, hsl(${160+(i/arr.length)*60},100%,60%), hsl(${180+(i/arr.length)*60},100%,45%))`,
          boxShadow:isComparing?"0 0 12px rgba(247,37,133,0.6)":"none",
          transition:"height 0.25s cubic-bezier(.34,1.56,.64,1), background 0.2s"}}/>);
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   DP MATRIX VIEW
───────────────────────────────────────────── */
function MatrixView({ steps, stepIndex }) {
  if (!steps||steps.length===0) return null;
  const mat=steps[Math.min(stepIndex,steps.length-1)];
  if(!Array.isArray(mat)) return null;
  const cellBase={width:30,height:30,border:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"center",alignItems:"center",fontSize:10,fontFamily:"'JetBrains Mono',monospace",transition:"all 0.3s"};
  if(!Array.isArray(mat[0])) {
    return (<div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"center",padding:"8px"}}>
      {mat.map((v,i)=>(<div key={i} style={{...cellBase,borderRadius:6,background:v>0?"rgba(0,245,160,0.12)":"rgba(0,0,0,0.3)",borderColor:v>0?"rgba(0,245,160,0.3)":"rgba(255,255,255,0.08)",color:v>0?"var(--green)":"var(--muted)"}}>{v}</div>))}
    </div>);
  }
  return (<div style={{overflow:"auto",maxHeight:200,padding:"4px"}}>
    {mat.map((row,i)=>(<div key={i} style={{display:"flex"}}>{row.map((c,j)=>(<div key={j} style={{...cellBase,background:c>0?"rgba(0,217,245,0.1)":"rgba(0,0,0,0.3)",color:c>0?"var(--cyan)":"var(--muted)"}}>{c}</div>))}</div>))}
  </div>);
}

/* ─────────────────────────────────────────────
   COMPLEXITY CHART
───────────────────────────────────────────── */
function ComplexityChart({ results }) {
  if (!results||results.length<2) return null;
  const max=Math.max(...results.map(r=>r.operations),1);
  const colors=["linear-gradient(90deg,var(--green),var(--cyan))","linear-gradient(90deg,var(--cyan),var(--purple))","linear-gradient(90deg,var(--purple),var(--pink))","linear-gradient(90deg,var(--pink),var(--green))","linear-gradient(90deg,var(--green),var(--purple))","linear-gradient(90deg,var(--cyan),var(--pink))"];
  return (
    <div style={{padding:"20px 24px 16px",borderRadius:16,background:"var(--glass)",border:"1px solid var(--border)",backdropFilter:"blur(20px)"}}>
      <p style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:"var(--muted)",textTransform:"uppercase",marginBottom:16}}>Operations Comparison</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {results.map((r,i)=>{
          const pct=(r.operations/max)*100;
          const isWinner=i===results.indexOf(results.reduce((a,b)=>a.operations<=b.operations?a:b));
          return (<div key={i} style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{width:82,fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:isWinner?"var(--green)":"var(--muted)",flexShrink:0}}>{r.algo}</span>
            <div style={{flex:1,height:8,borderRadius:4,background:"rgba(255,255,255,0.05)",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,borderRadius:4,background:colors[i%colors.length],transition:"width 1s cubic-bezier(.34,1.56,.64,1)",boxShadow:isWinner?"0 0 8px rgba(0,245,160,0.5)":"none"}}/>
            </div>
            <span style={{width:52,fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:"var(--text)",textAlign:"right"}}>{r.operations.toLocaleString()}</span>
          </div>);
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RESULT TEXT
───────────────────────────────────────────── */
function getResultText(r, algoType, destination) {
  const finalStep=r.steps?.[r.steps.length-1];
  if(!finalStep) return "No result";
  if(algoType===ALGO_TYPE.SORT){const arr=finalStep?.array||finalStep||[];return Array.isArray(arr)?`[${arr.join(", ")}]`:"Sorted";}
  if(algoType===ALGO_TYPE.GRAPH){
    const a=r.algo.toLowerCase();
    if(/dijkstra|bellman/.test(a)){if(!Array.isArray(finalStep)) return "Completed";const dest=destination!==""?Number(destination):null;const cost=dest!==null&&finalStep[dest]!==undefined?finalStep[dest]:"N/A";return `dist: [${finalStep.join(", ")}]  →  cost to ${dest??"?"}: ${cost}`;}
    if(/bfs|dfs/.test(a)) return `path: ${Array.isArray(finalStep)?finalStep.join(" → "):""}`;
    if(/prim/.test(a)){const total=r.steps.reduce((s,x)=>s+(Array.isArray(x)&&x[1]!=null?x[1]:0),0);return `MST Cost: ${total}`;}
    if(/kruskal/.test(a)) return `MST Cost: ${finalStep?.[3]??0}`;
    return "Graph Completed";
  }
  if(algoType===ALGO_TYPE.DP){
    const a=r.algo.toLowerCase();
    const last=Array.isArray(finalStep)?finalStep[finalStep.length-1]:finalStep;
    if(/lis/.test(a)) return `LIS Length = ${Array.isArray(finalStep)?Math.max(...finalStep):"?"}`;
    if(/lcs/.test(a)) return `LCS Length = ${last}`;
    if(/subset/.test(a)) return last?"Subset Exists ✓":"No Valid Subset ✗";
    if(/knapsack/.test(a)) return `Best Profit = ${last}`;
    return "DP Computed";
  }
  return "Completed";
}

const HINTS = {
  [ALGO_TYPE.SORT]:  "e.g.  5, 2, 9, 1, 8",
  [ALGO_TYPE.GRAPH]: "e.g.  0-1-4, 0-2-1, 2-1-2, 1-3-1   (u-v-weight)",
  [ALGO_TYPE.DP]:    "e.g.  abcde|ace  or  1,2,3|7  or  weights|values|capacity",
  [ALGO_TYPE.NONE]:  "Enter your data…",
};

/* ─────────────────────────────────────────────
   ── FEATURE 1: LEARN MODE (Cheatsheet) ──
───────────────────────────────────────────── */
function LearnMode() {
  const [selected, setSelected] = useState(null);
  const [filterCat, setFilterCat] = useState("All");
  const cats = ["All","Sorting","Graph","DP"];
  const algos = Object.entries(ALGO_KNOWLEDGE);
  const filtered = filterCat==="All" ? algos : algos.filter(([,v])=>v.category===filterCat);

  return (
    <div style={{animation:"fadeUp 0.5s ease both"}}>
      {/* Category filter */}
      <div style={{display:"flex",gap:8,marginBottom:28,flexWrap:"wrap"}}>
        {cats.map(c=>(
          <button key={c} className={`toggle-btn ${filterCat===c?"active":""}`}
            style={{flex:"none",padding:"8px 20px"}} onClick={()=>setSelected(null)||setFilterCat(c)}>{c}</button>
        ))}
      </div>

      {!selected ? (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
          {filtered.map(([name,info])=>(
            <div key={name} className="cheat-card" style={{cursor:"pointer"}} onClick={()=>setSelected(name)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",color:"var(--muted)",textTransform:"uppercase"}}>{info.category}</span>
                  <h3 style={{fontSize:18,fontWeight:800,marginTop:2,color:"var(--text)"}}>{name} Sort</h3>
                </div>
                <div style={{width:36,height:36,borderRadius:10,background:`${info.color}20`,border:`1px solid ${info.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>
                  {info.category==="Sorting"?"⚡":info.category==="Graph"?"🔗":"🧩"}
                </div>
              </div>
              <p style={{fontSize:12,color:"var(--muted2)",lineHeight:1.6,marginBottom:12}}>{info.description.slice(0,90)}…</p>
              <div style={{display:"flex",gap:6}}>
                <span className="complexity-badge time">⏱ {info.complexity.time}</span>
                <span className="complexity-badge space">◼ {info.complexity.space}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AlgoDetail name={selected} info={ALGO_KNOWLEDGE[selected]} onBack={()=>setSelected(null)} />
      )}
    </div>
  );
}

function AlgoDetail({ name, info, onBack }) {
  return (
    <div style={{animation:"slideRight 0.4s ease both"}}>
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",borderRadius:10,border:"1px solid var(--border)",background:"var(--glass)",color:"var(--muted2)",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:24,transition:"all 0.2s"}}
        onMouseEnter={e=>e.currentTarget.style.color="var(--text)"} onMouseLeave={e=>e.currentTarget.style.color="var(--muted2)"}>
        ← Back to Algorithms
      </button>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        {/* Left col */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{padding:24,borderRadius:20,background:"var(--glass)",border:`1px solid ${info.color}30`}}>
            <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",color:info.color,textTransform:"uppercase"}}>{info.category}</span>
            <h2 style={{fontSize:28,fontWeight:800,marginTop:4,marginBottom:12}}>{name}</h2>
            <p style={{fontSize:14,color:"var(--muted2)",lineHeight:1.7}}>{info.description}</p>
          </div>

          <div style={{padding:20,borderRadius:16,background:"var(--glass)",border:"1px solid var(--border)"}}>
            <p style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:"var(--muted)",textTransform:"uppercase",marginBottom:14}}>How it works</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {info.howItWorks.map((s,i)=>(
                <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <span style={{width:22,height:22,borderRadius:"50%",background:`${info.color}20`,border:`1px solid ${info.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:info.color,flexShrink:0}}>{i+1}</span>
                  <span style={{fontSize:13,color:"var(--muted2)",lineHeight:1.5}}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{padding:20,borderRadius:16,background:"var(--glass)",border:"1px solid var(--border)"}}>
            <p style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:"var(--muted)",textTransform:"uppercase",marginBottom:12}}>When to use</p>
            <p style={{fontSize:13,color:"var(--muted2)",lineHeight:1.6}}>{info.whenToUse}</p>
          </div>
        </div>

        {/* Right col */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{padding:20,borderRadius:16,background:"var(--glass)",border:"1px solid var(--border)"}}>
            <p style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:"var(--muted)",textTransform:"uppercase",marginBottom:14}}>Complexity</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[["Best","best","var(--green)"],["Worst","worst","var(--pink)"],["Space","space","var(--purple)"],["Avg","time","var(--cyan)"]].map(([label,key,color])=>(
                <div key={key} style={{padding:"12px 14px",borderRadius:12,background:"rgba(0,0,0,0.3)",border:`1px solid ${color}25`}}>
                  <p style={{fontSize:10,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{label}</p>
                  <p style={{fontSize:16,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color}}>{info.complexity[key]}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{padding:20,borderRadius:16,background:"var(--glass)",border:"1px solid var(--border)"}}>
            <p style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:"var(--muted)",textTransform:"uppercase",marginBottom:12}}>Pseudocode</p>
            <pre className="code-block" style={{fontSize:11,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{info.pseudocode}</pre>
          </div>

          <div style={{padding:20,borderRadius:16,background:"var(--glass)",border:"1px solid var(--border)"}}>
            <p style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:"var(--muted)",textTransform:"uppercase",marginBottom:12}}>Key Facts</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {info.facts.map((f,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{color:"var(--green)",fontSize:14,flexShrink:0,marginTop:1}}>✓</span>
                  <span style={{fontSize:13,color:"var(--muted2)",lineHeight:1.5}}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ── FEATURE 2: QUIZ MODE ──
───────────────────────────────────────────── */
function QuizMode() {
  const [qIdx, setQIdx]         = useState(0);
  const [answered, setAnswered] = useState(null); // index chosen
  const [score, setScore]       = useState(0);
  const [done, setDone]         = useState(false);
  const [history, setHistory]   = useState([]); // [{correct}]

  const q = QUIZ_BANK[qIdx];
  const total = QUIZ_BANK.length;

  function choose(i) {
    if (answered !== null) return;
    const correct = i === q.ans;
    setAnswered(i);
    setHistory(h => [...h, {correct, qIdx}]);
    if (correct) setScore(s => s + 1);
  }

  function next() {
    if (qIdx + 1 >= total) { setDone(true); return; }
    setQIdx(q => q + 1);
    setAnswered(null);
  }

  function restart() {
    setQIdx(0); setAnswered(null); setScore(0); setDone(false); setHistory([]);
  }

  const pct = Math.round((score / total) * 100);

  if (done) return (
    <div style={{animation:"scaleIn 0.5s ease both",maxWidth:600,margin:"0 auto",textAlign:"center"}}>
      <div style={{padding:48,borderRadius:24,background:"var(--glass)",border:"1px solid var(--border)"}}>
        <div style={{fontSize:56,marginBottom:16}}>{pct>=80?"🏆":pct>=60?"🎯":"📚"}</div>
        <h2 style={{fontSize:32,fontWeight:800,marginBottom:8}}>
          {pct>=80?"Excellent!":pct>=60?"Good job!":"Keep learning!"}
        </h2>
        <p style={{color:"var(--muted2)",marginBottom:24}}>You scored {score}/{total} ({pct}%)</p>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:32}}>
          {history.map((h,i)=>(
            <div key={i} style={{width:28,height:28,borderRadius:8,background:h.correct?"rgba(0,245,160,0.2)":"rgba(247,37,133,0.2)",border:`1px solid ${h.correct?"rgba(0,245,160,0.5)":"rgba(247,37,133,0.5)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>
              {h.correct?"✓":"✗"}
            </div>
          ))}
        </div>
        <button className="run-btn" onClick={restart}><span>Try Again</span></button>
      </div>
    </div>
  );

  return (
    <div style={{animation:"fadeUp 0.5s ease both",maxWidth:680,margin:"0 auto"}}>
      {/* Progress */}
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:"var(--muted)"}}>Question {qIdx+1} / {total}</span>
        <span style={{fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:"var(--green)"}}>Score: {score}</span>
      </div>
      <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,0.06)",marginBottom:28,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${((qIdx)/total)*100}%`,borderRadius:2,background:"linear-gradient(90deg,var(--green),var(--cyan))",transition:"width 0.4s ease"}}/>
      </div>

      {/* Question card */}
      <div style={{padding:32,borderRadius:20,background:"var(--glass)",border:"1px solid var(--border)",marginBottom:16}}>
        <p style={{fontSize:18,fontWeight:700,lineHeight:1.5,marginBottom:28}}>{q.q}</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {q.opts.map((opt,i)=>{
            let cls="quiz-option";
            if (answered!==null) {
              if (i===q.ans) cls+=" correct";
              else if (i===answered&&answered!==q.ans) cls+=" wrong";
            }
            return (<button key={i} className={cls} onClick={()=>choose(i)} disabled={answered!==null}>
              <span style={{marginRight:10,opacity:0.5,fontFamily:"'JetBrains Mono',monospace"}}>{String.fromCharCode(65+i)}.</span> {opt}
            </button>);
          })}
        </div>
      </div>

      {/* Explanation */}
      {answered !== null && (
        <div style={{padding:18,borderRadius:14,marginBottom:20,animation:"scaleIn 0.3s ease both",
          background:answered===q.ans?"rgba(0,245,160,0.08)":"rgba(247,37,133,0.06)",
          border:`1px solid ${answered===q.ans?"rgba(0,245,160,0.25)":"rgba(247,37,133,0.2)"}`}}>
          <p style={{fontSize:13,color:"var(--muted2)",lineHeight:1.6}}>
            <span style={{fontWeight:700,color:answered===q.ans?"var(--green)":"rgba(247,37,133,0.9)"}}>
              {answered===q.ans?"✓ Correct! ":"✗ Incorrect. "}</span>
            {q.exp}
          </p>
        </div>
      )}

      {answered !== null && (
        <button className="run-btn" onClick={next} style={{width:"100%"}}>
          <span>{qIdx+1<total?"Next Question →":"See Results"}</span>
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ── FEATURE 3: COMPARISON TABLE ──
───────────────────────────────────────────── */
function CompareMode() {
  const [category, setCategory] = useState("Sorting");
  const cats = ["Sorting","Graph","DP"];

  const algoMap = {
    Sorting: ["Bubble","Selection","Insertion","Quick","Merge","Heap"],
    Graph:   ["BFS","DFS","Dijkstra","Bellman","Prim","Kruskal"],
    DP:      ["Knapsack","LCS","LIS","Subset"],
  };

  const algoList = algoMap[category];

  const traitMap = {
    Sorting: ["Best","Average","Worst","Space","Stable","In-place"],
    Graph:   ["Time","Space","Negative Wt.","Weighted","Finds MST","Guarantees Shortest"],
    DP:      ["Time","Space","Input Type","Approach","Classic Use Case"],
  };

  const traitValues = {
    Bubble:    ["O(n)","O(n²)","O(n²)","O(1)","✓","✓"],
    Selection: ["O(n²)","O(n²)","O(n²)","O(1)","✗","✓"],
    Insertion: ["O(n)","O(n²)","O(n²)","O(1)","✓","✓"],
    Quick:     ["O(n log n)","O(n log n)","O(n²)","O(log n)","✗","✓"],
    Merge:     ["O(n log n)","O(n log n)","O(n log n)","O(n)","✓","✗"],
    Heap:      ["O(n log n)","O(n log n)","O(n log n)","O(1)","✗","✓"],
    BFS:       ["O(V+E)","O(V)","✗","✗","✗","✓ (unweighted)"],
    DFS:       ["O(V+E)","O(V)","✗","✗","✗","✗"],
    Dijkstra:  ["O(E log V)","O(V)","✗","✓","✗","✓"],
    Bellman:   ["O(V·E)","O(V)","✓","✓","✗","✓"],
    Prim:      ["O(E log V)","O(V)","✗","✓","✓","N/A"],
    Kruskal:   ["O(E log E)","O(V)","✗","✓","✓","N/A"],
    Knapsack:  ["O(n·W)","O(n·W)","Weights+Values","Bottom-up DP","Resource allocation"],
    LCS:       ["O(m·n)","O(m·n)","Two strings","Bottom-up DP","Diff tools / DNA"],
    LIS:       ["O(n²)","O(n)","Array","Bottom-up DP","Scheduling"],
    Subset:    ["O(n·T)","O(n·T)","Array+Target","Bottom-up DP","Partition problems"],
  };

  const traits = traitMap[category];

  const BEST_CELLS = {
    Sorting: { 0:["Bubble","Insertion"], 1:["Quick","Merge","Heap"], 2:["Merge","Heap","Quick"], 3:["Bubble","Selection","Heap","Insertion"] },
    Graph: {},
    DP: {},
  };

  function isBest(algo, colIdx) {
    return (BEST_CELLS[category]?.[colIdx]||[]).includes(algo);
  }

  return (
    <div style={{animation:"fadeUp 0.5s ease both"}}>
      <div style={{display:"flex",gap:8,marginBottom:28}}>
        {cats.map(c=>(
          <button key={c} className={`toggle-btn ${category===c?"active":""}`}
            style={{flex:"none",padding:"8px 20px"}} onClick={()=>setCategory(c)}>{c}</button>
        ))}
      </div>

      <div style={{borderRadius:20,border:"1px solid var(--border)",background:"rgba(8,13,22,0.8)",backdropFilter:"blur(20px)",overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,fontFamily:"'JetBrains Mono',monospace"}}>
          <thead>
            <tr style={{borderBottom:"1px solid var(--border)"}}>
              <th style={{padding:"14px 20px",textAlign:"left",fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:"var(--muted)",textTransform:"uppercase",minWidth:120}}>Algorithm</th>
              {traits.map(t=>(
                <th key={t} style={{padding:"14px 16px",textAlign:"center",fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:"var(--muted)",textTransform:"uppercase",minWidth:110}}>{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {algoList.map((algo,rowI)=>{
              const info=ALGO_KNOWLEDGE[algo];
              return (
                <tr key={algo} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",transition:"background 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"14px 20px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:info?.color||"var(--muted)",flexShrink:0}}/>
                      <span style={{fontWeight:700,color:"var(--text)",fontFamily:"'Syne',sans-serif"}}>{algo}</span>
                    </div>
                  </td>
                  {(traitValues[algo]||[]).map((v,ci)=>(
                    <td key={ci} style={{padding:"12px 16px",textAlign:"center"}}>
                      <span style={{
                        display:"inline-block",padding:"4px 10px",borderRadius:6,fontSize:11,
                        background:v==="✓"?"rgba(0,245,160,0.12)":v==="✗"?"rgba(247,37,133,0.08)":isBest(algo,ci)?"rgba(0,245,160,0.1)":"rgba(255,255,255,0.04)",
                        border:`1px solid ${v==="✓"?"rgba(0,245,160,0.3)":v==="✗"?"rgba(247,37,133,0.2)":isBest(algo,ci)?"rgba(0,245,160,0.25)":"rgba(255,255,255,0.08)"}`,
                        color:v==="✓"?"var(--green)":v==="✗"?"rgba(247,37,133,0.7)":isBest(algo,ci)?"var(--cyan)":"var(--muted2)"
                      }}>{v}</span>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{marginTop:16,fontSize:12,color:"var(--muted)",textAlign:"center"}}>
        Highlighted cells indicate best performance in that category
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ── FEATURE 4: RUN HISTORY ──
───────────────────────────────────────────── */
function HistoryMode({ history, onLoad }) {
  if (history.length === 0) return (
    <div style={{textAlign:"center",padding:"80px 40px",borderRadius:20,background:"var(--glass)",border:"1px solid var(--border)"}}>
      <div style={{fontSize:40,marginBottom:16,opacity:0.3}}>📋</div>
      <p style={{color:"var(--muted)",fontSize:16,fontWeight:600}}>No runs yet</p>
      <p style={{color:"var(--muted)",fontSize:13,marginTop:8,opacity:0.6}}>Run an algorithm to see it here</p>
    </div>
  );

  return (
    <div style={{animation:"fadeUp 0.5s ease both"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <p style={{fontSize:14,color:"var(--muted2)"}}>{history.length} run{history.length!==1?"s":""} recorded</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {[...history].reverse().map((run,i)=>(
          <div key={i} className="hist-row" onClick={()=>onLoad(run)}>
            <div style={{width:40,height:40,borderRadius:12,background:"rgba(0,245,160,0.08)",border:"1px solid rgba(0,245,160,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
              {run.type==="sort"?"⚡":run.type==="graph"?"🔗":"🧩"}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <span style={{fontWeight:700,color:"var(--text)"}}>{run.problem}</span>
                <span style={{fontSize:11,padding:"2px 8px",borderRadius:5,background:"rgba(0,217,245,0.1)",border:"1px solid rgba(0,217,245,0.2)",color:"var(--cyan)"}}>{run.type}</span>
                {run.best && <span style={{fontSize:11,padding:"2px 8px",borderRadius:5,background:"rgba(0,245,160,0.1)",border:"1px solid rgba(0,245,160,0.2)",color:"var(--green)"}}>🏆 {run.best}</span>}
              </div>
              <p style={{fontSize:12,color:"var(--muted)",marginTop:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{run.data}</p>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <p style={{fontSize:11,color:"var(--muted)",fontFamily:"'JetBrains Mono',monospace"}}>{run.timestamp}</p>
              <p style={{fontSize:11,color:"var(--muted2)",marginTop:2}}>{run.results?.length||0} algos</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ── FEATURE 5: PLAYGROUND (PRESETS + INLINE RUN) ──
   This wraps the full run UI with preset chips
───────────────────────────────────────────── */
function PlaygroundPanel({ onPresetLoad }) {
  return (
    <div style={{animation:"fadeUp 0.5s ease both"}}>
      <div style={{padding:24,borderRadius:20,background:"var(--glass)",border:"1px solid var(--border)",marginBottom:24}}>
        <p style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:"var(--muted)",textTransform:"uppercase",marginBottom:16}}>Quick Presets — click to load</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {PRESETS.map((p,i)=>(
            <button key={i} className="preset-chip" onClick={()=>onPresetLoad(p)}>{p.label}</button>
          ))}
        </div>
      </div>
      <div style={{padding:24,borderRadius:20,background:"var(--glass)",border:"1px solid rgba(0,245,160,0.1)"}}>
        <p style={{fontSize:14,color:"var(--muted2)",lineHeight:1.7}}>
          💡 <strong style={{color:"var(--text)"}}>Tip:</strong> Load a preset, then head to the <strong style={{color:"var(--green)"}}>Visualizer</strong> tab to step through the algorithm in action. Use <kbd style={{background:"rgba(255,255,255,0.1)",border:"1px solid var(--border)",padding:"2px 6px",borderRadius:4,fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}>Space</kbd> to play/pause and <kbd style={{background:"rgba(255,255,255,0.1)",border:"1px solid var(--border)",padding:"2px 6px",borderRadius:4,fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}>← →</kbd> to step.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const [showLoading, setShowLoading]   = useState(true);
  const [activeTab, setActiveTab]       = useState("visualizer");
  const [results, setResults]           = useState([]);
  const [best, setBest]                 = useState(null);
  const [problem, setProblem]           = useState("");
  const [dataInput, setDataInput]       = useState("");
  const [graphType, setGraphType]       = useState("undirected");
  const [source, setSource]             = useState("0");
  const [destination, setDest]          = useState("");
  const [stepIndex, setStepIndex]       = useState(0);
  const [speed, setSpeed]               = useState(400);
  const [loading, setLoading]           = useState(false);
  const [playing, setPlaying]           = useState(false);
  const [error, setError]               = useState("");
  const [skipped, setSkipped]           = useState([]);
  const [runHistory, setRunHistory]     = useState([]);

  useEffect(() => {
    const t = setTimeout(()=>setShowLoading(false), 2200);
    return ()=>clearTimeout(t);
  }, []);

  const algoType = detectType(problem);
  const isSort   = algoType === ALGO_TYPE.SORT;
  const isGraph  = algoType === ALGO_TYPE.GRAPH;
  const isDP     = algoType === ALGO_TYPE.DP;
  const needsSD  = needsSourceDest(problem);
  const maxSteps = results.length > 0 ? Math.max(...results.map(r=>r.steps?.length||0)) : 0;

  useEffect(() => {
    if (results.length===0||!playing) return;
    if (stepIndex>=maxSteps-1) { setPlaying(false); return; }
    const t = setInterval(()=>{
      setStepIndex(prev=>{ if(prev>=maxSteps-1){setPlaying(false);return prev;} return prev+1; });
    }, speed);
    return ()=>clearInterval(t);
  }, [results, speed, playing, maxSteps, stepIndex]);

  useEffect(() => {
    function onKey(e) {
      if (results.length===0) return;
      if (["INPUT","TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (e.code==="Space") { e.preventDefault(); setPlaying(p=>!p); }
      if (e.code==="ArrowRight") setStepIndex(s=>Math.min(maxSteps-1,s+1));
      if (e.code==="ArrowLeft")  setStepIndex(s=>Math.max(0,s-1));
      if (e.code==="KeyR")       { setStepIndex(0); setPlaying(false); }
    }
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  }, [results, maxSteps]);

  const handleRun = useCallback(async () => {
    if (!problem.trim()) { setError("Please describe the problem type first."); return; }
    if (!dataInput.trim()) { setError("Please enter input data."); return; }
    setError(""); setSkipped([]);
    try {
      setLoading(true);
      const res = await fetch("https://algovision-backend.onrender.com/run", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ problem, data:dataInput, graphType, source:source!==""?Number(source):0, destination:destination!==""?Number(destination):-1 }),
      });
      if (!res.ok) { const body=await res.json().catch(()=>({})); setError(body.error||`Server error ${res.status}`); setResults([]); setBest(null); return; }
      const result = await res.json();
      if (!result.success) { setError(result.error||"Unknown error from server"); setResults([]); setBest(null); return; }
      setResults(result.results||[]);
      setBest(result.best||null);
      setSkipped(result.skipped||[]);
      setStepIndex(0);
      setPlaying(true);
      // Save to history
      const now = new Date();
      setRunHistory(h=>[...h, {
        problem, data: dataInput, type: result.type, best: result.best?.algo,
        results: result.results, graphType, source, destination,
        timestamp: now.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}),
        // store everything needed to restore
        _restore: { problem, dataInput, graphType, source, destination },
      }]);
    } catch(err) {
      setError("Could not connect to live backend. Please wait a moment and try again.");
      setResults([]); setBest(null);
    } finally { setLoading(false); }
  }, [problem, dataInput, graphType, source, destination]);

  function loadFromHistory(run) {
    const r = run._restore;
    setProblem(r.problem); setDataInput(r.dataInput);
    setGraphType(r.graphType); setSource(r.source); setDest(r.destination);
    setResults(run.results||[]); setBest({algo:run.best});
    setStepIndex(0); setPlaying(false); setError("");
    setActiveTab("visualizer");
  }

  function loadPreset(preset) {
    setProblem(preset.problem); setDataInput(preset.data);
    setError(""); setResults([]); setBest(null);
    setActiveTab("visualizer");
  }

  const TABS = [
    { id:"visualizer", label:"▶ Visualizer", dot:true },
    { id:"learn",      label:"📖 Learn" },
    { id:"quiz",       label:"🎯 Quiz" },
    { id:"compare",    label:"⚡ Compare" },
    { id:"playground", label:"🧪 Playground" },
    { id:"history",    label:"📋 History", count: runHistory.length },
  ];

  return (
    <>
      <GlobalStyles />
      {showLoading && <LoadingScreen />}
      <AmbientBg />

      <div style={{position:"relative",zIndex:1,minHeight:"100vh",paddingBottom:60}}>

        {/* ── TOP HEADER ── */}
        <header style={{padding:"28px 32px 0",animation:"fadeUp 0.8s ease both"}}>
          <div style={{maxWidth:1400,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:42,height:42,borderRadius:12,background:"linear-gradient(135deg,rgba(0,245,160,0.9),rgba(0,217,245,0.7))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 0 20px rgba(0,245,160,0.3)"}}>Σ</div>
              <div>
                <h1 style={{fontSize:"clamp(20px,3vw,26px)",fontWeight:800,letterSpacing:"-0.02em",
                  background:"linear-gradient(135deg,var(--green),var(--cyan))",
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",lineHeight:1.1}}>
                  AlgoVision Arena
                </h1>
                <p style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Algorithm Learning Platform</p>
              </div>
            </div>
            {/* Stats pills */}
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {[
                {label:"Algorithms",val:"16"},
                {label:"Runs",val:runHistory.length},
                {label:"Categories",val:"3"},
              ].map(s=>(
                <div key={s.label} style={{padding:"8px 16px",borderRadius:10,background:"var(--glass)",border:"1px solid var(--border)",textAlign:"center"}}>
                  <p style={{fontSize:16,fontWeight:800,color:"var(--text)",fontFamily:"'JetBrains Mono',monospace",animation:"countUp 0.5s ease"}}>{s.val}</p>
                  <p style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.08em"}}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ── NAV TABS ── */}
        <nav style={{padding:"20px 32px 0",animation:"fadeUp 0.8s 0.1s ease both"}}>
          <div style={{maxWidth:1400,margin:"0 auto"}}>
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
              {TABS.map(tab=>(
                <button key={tab.id} className={`nav-tab ${activeTab===tab.id?"active":""}`}
                  onClick={()=>setActiveTab(tab.id)}>
                  {tab.label}
                  {tab.count>0&&<span style={{padding:"2px 7px",borderRadius:6,background:"rgba(0,245,160,0.15)",fontSize:10,fontWeight:700,color:"var(--green)"}}>{tab.count}</span>}
                </button>
              ))}
            </div>
            <div style={{height:1,background:"var(--border)",marginTop:12}}/>
          </div>
        </nav>

        {/* ── MAIN CONTENT ── */}
        <main style={{padding:"32px",maxWidth:1400,margin:"0 auto"}}>

          {/* ════════════════ VISUALIZER TAB ════════════════ */}
          {activeTab==="visualizer" && (
            <>
              {/* Control Panel */}
              <div style={{maxWidth:900,margin:"0 auto 40px",padding:32,borderRadius:24,
                background:"rgba(8,13,22,0.7)",backdropFilter:"blur(30px)",WebkitBackdropFilter:"blur(30px)",
                border:"1px solid var(--border)",boxShadow:"0 40px 80px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.05)",
                animation:"fadeUp 0.8s 0.15s ease both"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <label style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:"var(--muted)",textTransform:"uppercase"}}>Problem Type</label>
                    <textarea className={`glass-input${error&&!problem.trim()?" error":""}`} rows={3}
                      placeholder="e.g. 'sort', 'shortest path dijkstra', 'bfs traversal', 'knapsack'…"
                      value={problem} onChange={e=>{setProblem(e.target.value);setError("");}}
                      style={{resize:"none",minHeight:90}}/>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <label style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:"var(--muted)",textTransform:"uppercase"}}>Input Data</label>
                    <textarea className={`glass-input${error&&!dataInput.trim()?" error":""}`} rows={3}
                      placeholder={HINTS[algoType]}
                      value={dataInput} onChange={e=>{setDataInput(e.target.value);setError("");}}
                      style={{resize:"none",minHeight:90}}/>
                  </div>
                </div>

                {algoType!==ALGO_TYPE.NONE&&(
                  <div style={{marginBottom:16,padding:"10px 14px",borderRadius:10,background:"rgba(0,245,160,0.05)",border:"1px solid rgba(0,245,160,0.12)",display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:13,color:"rgba(0,245,160,0.5)"}}>💡</span>
                    <span style={{fontSize:12,color:"rgba(0,245,160,0.7)",fontFamily:"'JetBrains Mono',monospace"}}>{HINTS[algoType]}</span>
                  </div>
                )}

                {isGraph&&(
                  <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
                    <div style={{display:"flex",gap:10}}>
                      <button className={`toggle-btn ${graphType==="undirected"?"active":""}`} onClick={()=>setGraphType("undirected")}>↔ Undirected</button>
                      <button className={`toggle-btn ${graphType==="directed"?"active":""}`} onClick={()=>setGraphType("directed")}>→ Directed</button>
                    </div>
                    {needsSD&&(
                      <div style={{display:"flex",gap:10}}>
                        <input className="glass-input" placeholder="Source node (default 0)" value={source} onChange={e=>setSource(e.target.value)} style={{flex:1}}/>
                        <input className="glass-input" placeholder="Destination node (optional)" value={destination} onChange={e=>setDest(e.target.value)} style={{flex:1}}/>
                      </div>
                    )}
                  </div>
                )}

                {error&&(<div className="error-banner" style={{marginBottom:16}}><span>⚠</span><span>{error}</span></div>)}

                <div style={{display:"flex",gap:16,alignItems:"flex-end"}}>
                  <button className="run-btn" onClick={handleRun} disabled={loading} style={{flex:1}}>
                    <span>{loading?"Running…":"▶  Run Algorithm"}</span>
                  </button>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <span style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",color:"var(--muted)",textTransform:"uppercase"}}>Animation Speed</span>
                      <span style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:"var(--green)"}}>{speed}ms</span>
                    </div>
                    <input type="range" className="speed-slider" min={80} max={1200} step={20} value={speed} onChange={e=>setSpeed(Number(e.target.value))}/>
                  </div>
                </div>
              </div>

              {skipped.length>0&&(
                <div style={{maxWidth:900,margin:"0 auto 20px"}}>
                  {skipped.map((s,i)=>(<div key={i} className="skipped-banner" style={{marginBottom:8}}>⚡ Skipped: {s}</div>))}
                </div>
              )}

              {results.length>0&&(
                <div style={{maxWidth:900,margin:"0 auto 24px",display:"flex",alignItems:"center",justifyContent:"center",gap:10,flexWrap:"wrap",animation:"fadeUp 0.5s ease both"}}>
                  <button className="step-btn" disabled={stepIndex===0} onClick={()=>{setStepIndex(0);setPlaying(false);}}>⏮</button>
                  <button className="step-btn" disabled={stepIndex===0} onClick={()=>setStepIndex(s=>Math.max(0,s-1))}>‹ Prev</button>
                  <button className="step-btn" onClick={()=>setPlaying(p=>!p)} style={{minWidth:90,background:playing?"rgba(0,245,160,0.12)":"var(--glass)",borderColor:playing?"rgba(0,245,160,0.3)":"var(--border)",color:playing?"var(--green)":"var(--text)"}}>
                    {playing?"⏸ Pause":"▶ Play"}
                  </button>
                  <button className="step-btn" disabled={stepIndex>=maxSteps-1} onClick={()=>setStepIndex(s=>Math.min(maxSteps-1,s+1))}>Next ›</button>
                  <button className="step-btn" disabled={stepIndex>=maxSteps-1} onClick={()=>setStepIndex(maxSteps-1)}>⏭</button>
                  <span style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:"var(--muted)"}}>Step {stepIndex+1} / {maxSteps}</span>
                </div>
              )}

              {results.length>0&&maxSteps>0&&(
                <div style={{maxWidth:900,margin:"0 auto 28px"}}>
                  <div style={{height:3,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:2,width:`${((stepIndex+1)/maxSteps)*100}%`,background:"linear-gradient(90deg,var(--green),var(--cyan))",transition:"width 0.3s ease",boxShadow:"0 0 8px rgba(0,245,160,0.6)"}}/>
                  </div>
                </div>
              )}

              {results.length>1&&(
                <div style={{maxWidth:900,margin:"0 auto 28px",animation:"scaleIn 0.6s 0.1s ease both"}}>
                  <ComplexityChart results={results}/>
                </div>
              )}

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:24}}>
                {results.length===0?(
                  <div style={{gridColumn:"1/-1",padding:"80px 40px",textAlign:"center",borderRadius:24,background:"var(--glass)",border:"1px solid var(--border)",backdropFilter:"blur(20px)"}}>
                    <div style={{fontSize:48,marginBottom:20,opacity:0.4}}>◈</div>
                    <p style={{fontSize:20,fontWeight:700,color:"var(--muted)"}}>Ready to Analyze</p>
                    <p style={{fontSize:14,color:"var(--muted)",opacity:0.6,marginTop:8}}>Describe a problem and enter data above, then hit Run</p>
                    <p style={{fontSize:13,color:"var(--muted)",opacity:0.4,marginTop:8}}>Or try a preset from the <button onClick={()=>setActiveTab("playground")} style={{background:"none",border:"none",color:"var(--cyan)",cursor:"pointer",fontSize:13,fontFamily:"'Syne',sans-serif",textDecoration:"underline"}}>Playground</button> tab</p>
                  </div>
                ):(
                  results.map((r,i)=>{
                    const isWinner=best?.algo===r.algo;
                    return (
                      <div key={i} className={`algo-card${isWinner?" winner-card":""}`} style={{animationDelay:`${i*0.08}s`}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                          <div>
                            {isWinner&&(<span style={{display:"inline-block",marginBottom:6,padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:700,background:"rgba(0,245,160,0.12)",border:"1px solid rgba(0,245,160,0.3)",color:"var(--green)",letterSpacing:"0.06em",textTransform:"uppercase"}}>🏆 Best</span>)}
                            <h3 style={{fontSize:22,fontWeight:800,background:isWinner?"linear-gradient(135deg,var(--green),var(--cyan))":"linear-gradient(135deg,var(--text),var(--muted))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{r.algo}</h3>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:"var(--muted)",textTransform:"uppercase",marginBottom:2}}>{r.metricLabel}</div>
                            <div style={{fontSize:24,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:isWinner?"var(--green)":"var(--text)"}}>{r.operations.toLocaleString()}</div>
                          </div>
                        </div>
                        {r.complexity&&(
                          <div style={{display:"flex",gap:6,marginBottom:14}}>
                            <span className="complexity-badge time">⏱ {r.complexity.time}</span>
                            <span className="complexity-badge space">◼ {r.complexity.space}</span>
                            {/* Learn more link */}
                            <button onClick={()=>{setActiveTab("learn");}} style={{marginLeft:"auto",fontSize:11,color:"var(--cyan)",background:"none",border:"none",cursor:"pointer",fontFamily:"'Syne',sans-serif",textDecoration:"underline",opacity:0.7}}>Learn more →</button>
                          </div>
                        )}
                        <div style={{height:240,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:14,background:"rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.05)",overflow:"hidden",position:"relative"}}>
                          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 100%,rgba(0,245,160,0.04) 0%,transparent 70%)"}}/>
                          {isGraph&&<GraphView steps={r.steps} algo={r.algo} dataInput={dataInput} stepIndex={stepIndex}/>}
                          {isSort&&<BarsView steps={r.steps} stepIndex={stepIndex}/>}
                          {isDP&&<MatrixView steps={r.steps} stepIndex={stepIndex}/>}
                        </div>
                        <div style={{marginTop:14,padding:"12px 14px",borderRadius:10,background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.05)",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:isWinner?"rgba(0,245,160,0.85)":"var(--muted)",wordBreak:"break-all"}}>
                          {getResultText(r,algoType,destination)}
                        </div>
                        <div style={{marginTop:10,height:2,borderRadius:1,background:"rgba(255,255,255,0.05)",overflow:"hidden"}}>
                          <div style={{height:"100%",borderRadius:1,width:`${r.steps?.length?((Math.min(stepIndex,r.steps.length-1)+1)/r.steps.length)*100:0}%`,background:isWinner?"linear-gradient(90deg,var(--green),var(--cyan))":"linear-gradient(90deg,var(--cyan),var(--purple))",transition:"width 0.3s ease"}}/>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                          <span style={{fontSize:10,color:"var(--muted)",fontFamily:"'JetBrains Mono',monospace"}}>step {Math.min(stepIndex,(r.steps?.length||1)-1)+1} / {r.steps?.length||0}</span>
                          {isWinner&&<span style={{fontSize:10,fontWeight:700,color:"var(--green)",letterSpacing:"0.08em",textTransform:"uppercase"}}>winner ←</span>}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <footer style={{textAlign:"center",marginTop:64,color:"var(--muted)",fontSize:12,opacity:0.5}}>
                AlgoVision Arena · React + C++ engine · Space = play/pause · ← → = step · R = reset
              </footer>
            </>
          )}

          {/* ════════════════ LEARN TAB ════════════════ */}
          {activeTab==="learn" && (
            <div>
              <div style={{marginBottom:32}}>
                <span className="section-badge" style={{background:"rgba(0,217,245,0.1)",border:"1px solid rgba(0,217,245,0.25)",color:"var(--cyan)"}}>📖 Learning Hub</span>
                <h2 style={{fontSize:28,fontWeight:800,marginTop:12,marginBottom:8}}>Algorithm Reference</h2>
                <p style={{color:"var(--muted2)",fontSize:14}}>Deep-dive into how each algorithm works, its complexity, and when to use it.</p>
              </div>
              <LearnMode/>
            </div>
          )}

          {/* ════════════════ QUIZ TAB ════════════════ */}
          {activeTab==="quiz" && (
            <div>
              <div style={{marginBottom:32}}>
                <span className="section-badge" style={{background:"rgba(0,245,160,0.1)",border:"1px solid rgba(0,245,160,0.25)",color:"var(--green)"}}>🎯 Test Yourself</span>
                <h2 style={{fontSize:28,fontWeight:800,marginTop:12,marginBottom:8}}>Algorithm Quiz</h2>
                <p style={{color:"var(--muted2)",fontSize:14}}>{QUIZ_BANK.length} questions covering complexity, use cases, and algorithm properties.</p>
              </div>
              <QuizMode/>
            </div>
          )}

          {/* ════════════════ COMPARE TAB ════════════════ */}
          {activeTab==="compare" && (
            <div>
              <div style={{marginBottom:32}}>
                <span className="section-badge" style={{background:"rgba(157,78,221,0.1)",border:"1px solid rgba(157,78,221,0.25)",color:"var(--purple)"}}>⚡ Side by Side</span>
                <h2 style={{fontSize:28,fontWeight:800,marginTop:12,marginBottom:8}}>Algorithm Comparison</h2>
                <p style={{color:"var(--muted2)",fontSize:14}}>Compare algorithms across complexity, stability, and suitability in a single view.</p>
              </div>
              <CompareMode/>
            </div>
          )}

          {/* ════════════════ PLAYGROUND TAB ════════════════ */}
          {activeTab==="playground" && (
            <div>
              <div style={{marginBottom:32}}>
                <span className="section-badge" style={{background:"rgba(251,191,36,0.1)",border:"1px solid rgba(251,191,36,0.25)",color:"var(--amber)"}}>🧪 Experiment</span>
                <h2 style={{fontSize:28,fontWeight:800,marginTop:12,marginBottom:8}}>Playground</h2>
                <p style={{color:"var(--muted2)",fontSize:14}}>Load preset examples with one click, then visualize them in the Visualizer tab.</p>
              </div>
              <PlaygroundPanel onPresetLoad={loadPreset}/>
            </div>
          )}

          {/* ════════════════ HISTORY TAB ════════════════ */}
          {activeTab==="history" && (
            <div>
              <div style={{marginBottom:32}}>
                <span className="section-badge" style={{background:"rgba(0,245,160,0.08)",border:"1px solid rgba(0,245,160,0.2)",color:"var(--green)"}}>📋 Session Log</span>
                <h2 style={{fontSize:28,fontWeight:800,marginTop:12,marginBottom:8}}>Run History</h2>
                <p style={{color:"var(--muted2)",fontSize:14}}>All algorithms you've run this session. Click any row to reload it.</p>
              </div>
              <HistoryMode history={runHistory} onLoad={loadFromHistory}/>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
