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
      --bg0:    #020408;
      --bg1:    #080d16;
      --bg2:    #0d1526;
      --glass:  rgba(255,255,255,0.04);
      --glass2: rgba(255,255,255,0.07);
      --border: rgba(255,255,255,0.08);
      --text:   #e2e8f0;
      --muted:  #64748b;
    }

    body { background: var(--bg0); color: var(--text); font-family: 'Syne', sans-serif; }

    @keyframes fadeUp   { from { opacity:0; transform: translateY(32px); } to { opacity:1; transform: translateY(0); } }
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
  `}</style>
);

/* ─────────────────────────────────────────────
   ALGO TYPE ENUM — single source of truth
   Replaces the conflicting regex booleans
───────────────────────────────────────────── */
const ALGO_TYPE = {
  SORT:  "sort",
  GRAPH: "graph",
  DP:    "dp",
  NONE:  "none",
};

function detectType(problem = "") {
  const t = problem.toLowerCase();
  if (/sort/.test(t))                                        return ALGO_TYPE.SORT;
  if (/path|graph|dijkstra|bellman|bfs|dfs|mst|spanning/.test(t)) return ALGO_TYPE.GRAPH;
  if (/knapsack|subset|lcs|lis/.test(t))                    return ALGO_TYPE.DP;
  return ALGO_TYPE.NONE;
}

function needsSourceDest(problem = "") {
  return /shortest|dijkstra|bellman|bfs|dfs/.test(problem.toLowerCase());
}

/* ─────────────────────────────────────────────
   LOADING SCREEN
───────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "radial-gradient(ellipse at 50% 40%, #0d1a2e 0%, #020408 70%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 28,
    }}>
      <div style={{ perspective: 600 }}>
        <div style={{
          width: 72, height: 72,
          background: "linear-gradient(135deg, rgba(0,245,160,0.9), rgba(0,217,245,0.9), rgba(157,78,221,0.9))",
          borderRadius: 18, animation: "spin3d 1.8s linear infinite",
          boxShadow: "0 0 60px rgba(0,245,160,0.4)",
        }} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: "50%", background: "var(--green)",
            animation: `dotBlink 1.4s ease-in-out ${i * 0.16}s infinite`,
          }} />
        ))}
      </div>
      <p style={{ color: "var(--muted)", fontSize: 14, fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em" }}>
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
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
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

  const edges = dataInput.split(",").map(x => x.trim()).filter(Boolean).map(e => {
    const p = e.split("-").map(Number);
    return { u: p[0], v: p[1], w: p[2] ?? 1 };
  }).filter(e => !isNaN(e.u) && !isNaN(e.v));

  if (edges.length === 0) return null;

  const nodes = [...new Set(edges.flatMap(e => [e.u, e.v]))];
  const cx = 170, cy = 120, radius = 92;
  const pos = {};
  nodes.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / nodes.length;
    pos[n] = {
      x: cx + radius * Math.cos(angle - Math.PI / 2),
      y: cy + radius * Math.sin(angle - Math.PI / 2),
    };
  });

  const current = steps[Math.min(stepIndex, steps.length - 1)] || [];
  const algoLower = algo.toLowerCase();

  function edgeActive(e) {
    if (/bfs|dfs/.test(algoLower)) return current.includes(e.u) && current.includes(e.v);
    if (/prim/.test(algoLower))    return current[0] === e.v || current[0] === e.u;
    if (/kruskal/.test(algoLower)) return current[0] === e.u && current[1] === e.v;
    return false;
  }
  function nodeActive(n) {
    if (/dijkstra|bellman/.test(algoLower)) return true;
    return current.includes(n);
  }

  return (
    <svg width="340" height="240" style={{ overflow: "visible" }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {edges.map((e, i) => {
        const active = edgeActive(e);
        const x1 = pos[e.u]?.x, y1 = pos[e.u]?.y, x2 = pos[e.v]?.x, y2 = pos[e.v]?.y;
        if (x1 == null || x2 == null) return null;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={active ? "rgba(0,245,160,0.7)" : "rgba(255,255,255,0.08)"}
              strokeWidth={active ? 2.5 : 1}
              filter={active ? "url(#glow)" : "none"}
              style={{ transition: "stroke 0.4s, stroke-width 0.4s" }} />
            <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 5}
              fill={active ? "var(--green)" : "rgba(255,255,255,0.3)"}
              fontSize="11" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">
              {e.w}
            </text>
          </g>
        );
      })}
      {nodes.map(n => {
        const active = nodeActive(n);
        const p = pos[n];
        if (!p) return null;
        return (
          <g key={n} style={{ transition: "all 0.4s" }}>
            {active && <circle cx={p.x} cy={p.y} r="22" fill="rgba(0,245,160,0.08)" filter="url(#glow)" />}
            <circle cx={p.x} cy={p.y} r="15"
              fill={active ? "rgba(0,245,160,0.2)" : "rgba(13,21,38,0.9)"}
              stroke={active ? "var(--green)" : "rgba(255,255,255,0.12)"}
              strokeWidth={active ? 1.5 : 1}
              filter={active ? "url(#glow)" : "none"}
              style={{ transition: "all 0.4s cubic-bezier(.34,1.56,.64,1)" }} />
            <text x={p.x} y={p.y} textAnchor="middle" dy=".35em"
              fill={active ? "var(--green)" : "var(--text)"}
              fontSize="11" fontWeight="700" fontFamily="'JetBrains Mono',monospace">
              {n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   SORT BARS VIEW
───────────────────────────────────────────── */
function BarsView({ steps, stepIndex }) {
  if (!steps || steps.length === 0) return null;
  const current = steps[Math.min(stepIndex, steps.length - 1)];
  const arr = current?.array || current || [];
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const max = Math.max(...arr, 1);
  const compareSet = new Set(
    Array.isArray(current?.compare) ? current.compare : []
  );

  return (
    <div style={{ display:"flex", gap: arr.length > 30 ? 2 : 5, alignItems:"flex-end", height:180, padding:"0 8px", width:"100%" }}>
      {arr.map((v, i) => {
        const pct = (v / max) * 160;
        const isComparing = compareSet.has(i);
        return (
          <div key={i} style={{
            flex: 1, minWidth: 4,
            height: `${pct}px`,
            borderRadius: "4px 4px 0 0",
            background: isComparing
              ? "linear-gradient(180deg, var(--pink), var(--purple))"
              : `linear-gradient(180deg, hsl(${160 + (i / arr.length) * 60},100%,60%), hsl(${180 + (i / arr.length) * 60},100%,45%))`,
            boxShadow: isComparing ? "0 0 12px rgba(247,37,133,0.6)" : "none",
            transition: "height 0.25s cubic-bezier(.34,1.56,.64,1), background 0.2s",
          }} />
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   DP MATRIX VIEW
───────────────────────────────────────────── */
function MatrixView({ steps, stepIndex }) {
  if (!steps || steps.length === 0) return null;
  const mat = steps[Math.min(stepIndex, steps.length - 1)];
  if (!Array.isArray(mat)) return null;

  const cellBase = {
    width: 30, height: 30, border: "1px solid rgba(255,255,255,0.08)",
    display: "flex", justifyContent: "center", alignItems: "center",
    fontSize: 10, fontFamily: "'JetBrains Mono',monospace",
    transition: "all 0.3s",
  };

  // 1-D array (LIS, LCS final row)
  if (!Array.isArray(mat[0])) {
    return (
      <div style={{ display:"flex", gap:3, flexWrap:"wrap", justifyContent:"center", padding:"8px" }}>
        {mat.map((v, i) => (
          <div key={i} style={{ ...cellBase, borderRadius: 6,
            background: v > 0 ? "rgba(0,245,160,0.12)" : "rgba(0,0,0,0.3)",
            borderColor: v > 0 ? "rgba(0,245,160,0.3)" : "rgba(255,255,255,0.08)",
            color: v > 0 ? "var(--green)" : "var(--muted)",
          }}>{v}</div>
        ))}
      </div>
    );
  }

  // 2-D matrix
  return (
    <div style={{ overflow:"auto", maxHeight:200, padding:"4px" }}>
      {mat.map((row, i) => (
        <div key={i} style={{ display:"flex" }}>
          {row.map((c, j) => (
            <div key={j} style={{ ...cellBase,
              background: c > 0 ? "rgba(0,217,245,0.1)" : "rgba(0,0,0,0.3)",
              color: c > 0 ? "var(--cyan)" : "var(--muted)",
            }}>{c}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPLEXITY CHART
───────────────────────────────────────────── */
function ComplexityChart({ results }) {
  if (!results || results.length < 2) return null;
  const max = Math.max(...results.map(r => r.operations), 1);
  const colors = [
    "linear-gradient(90deg,var(--green),var(--cyan))",
    "linear-gradient(90deg,var(--cyan),var(--purple))",
    "linear-gradient(90deg,var(--purple),var(--pink))",
    "linear-gradient(90deg,var(--pink),var(--green))",
    "linear-gradient(90deg,var(--green),var(--purple))",
    "linear-gradient(90deg,var(--cyan),var(--pink))",
  ];

  return (
    <div style={{ padding:"20px 24px 16px", borderRadius:16, background:"var(--glass)", border:"1px solid var(--border)", backdropFilter:"blur(20px)" }}>
      <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:"var(--muted)", textTransform:"uppercase", marginBottom:16 }}>
        Operations Comparison
      </p>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {results.map((r, i) => {
          const pct = (r.operations / max) * 100;
          const isWinner = i === results.indexOf(results.reduce((a, b) => a.operations <= b.operations ? a : b));
          return (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ width:82, fontSize:12, fontFamily:"'JetBrains Mono',monospace", color: isWinner ? "var(--green)" : "var(--muted)", flexShrink:0 }}>
                {r.algo}
              </span>
              <div style={{ flex:1, height:8, borderRadius:4, background:"rgba(255,255,255,0.05)", overflow:"hidden" }}>
                <div style={{
                  height:"100%", width:`${pct}%`, borderRadius:4,
                  background: colors[i % colors.length],
                  transition:"width 1s cubic-bezier(.34,1.56,.64,1)",
                  boxShadow: isWinner ? "0 0 8px rgba(0,245,160,0.5)" : "none",
                }} />
              </div>
              <span style={{ width:52, fontSize:11, fontFamily:"'JetBrains Mono',monospace", color:"var(--text)", textAlign:"right" }}>
                {r.operations.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RESULT TEXT
───────────────────────────────────────────── */
function getResultText(r, algoType, destination) {
  const finalStep = r.steps?.[r.steps.length - 1];
  if (!finalStep) return "No result";

  if (algoType === ALGO_TYPE.SORT) {
    const arr = finalStep?.array || finalStep || [];
    return Array.isArray(arr) ? `[${arr.join(", ")}]` : "Sorted";
  }

  if (algoType === ALGO_TYPE.GRAPH) {
    const a = r.algo.toLowerCase();
    if (/dijkstra|bellman/.test(a)) {
      if (!Array.isArray(finalStep)) return "Completed";
      const dest = destination !== "" ? Number(destination) : null;
      const cost = dest !== null && finalStep[dest] !== undefined ? finalStep[dest] : "N/A";
      return `dist: [${finalStep.join(", ")}]  →  cost to ${dest ?? "?"}: ${cost}`;
    }
    if (/bfs|dfs/.test(a)) return `path: ${Array.isArray(finalStep) ? finalStep.join(" → ") : ""}`;
    if (/prim/.test(a)) {
      const total = r.steps.reduce((s, x) => s + (Array.isArray(x) && x[1] != null ? x[1] : 0), 0);
      return `MST Cost: ${total}`;
    }
    if (/kruskal/.test(a)) return `MST Cost: ${finalStep?.[3] ?? 0}`;
    return "Graph Completed";
  }

  if (algoType === ALGO_TYPE.DP) {
    const a = r.algo.toLowerCase();
    const last = Array.isArray(finalStep) ? finalStep[finalStep.length - 1] : finalStep;
    if (/lis/.test(a)) return `LIS Length = ${Array.isArray(finalStep) ? Math.max(...finalStep) : "?"}`;
    if (/lcs/.test(a)) return `LCS Length = ${last}`;
    if (/subset/.test(a)) return last ? "Subset Exists ✓" : "No Valid Subset ✗";
    if (/knapsack/.test(a)) return `Best Profit = ${last}`;
    return "DP Computed";
  }

  return "Completed";
}

/* ─────────────────────────────────────────────
   INPUT HINTS
───────────────────────────────────────────── */
const HINTS = {
  [ALGO_TYPE.SORT]:  "e.g.  5, 2, 9, 1, 8",
  [ALGO_TYPE.GRAPH]: "e.g.  0-1-4, 0-2-1, 2-1-2, 1-3-1   (u-v-weight)",
  [ALGO_TYPE.DP]:    "e.g.  abcde|ace  or  1,2,3|7  or  weights|values|capacity",
  [ALGO_TYPE.NONE]:  "Enter your data…",
};

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const [showLoading, setShowLoading] = useState(true);
  const [results, setResults]         = useState([]);
  const [best, setBest]               = useState(null);
  const [problem, setProblem]         = useState("");
  const [dataInput, setDataInput]     = useState("");
  const [graphType, setGraphType]     = useState("undirected");
  const [source, setSource]           = useState("0");
  const [destination, setDest]        = useState("");
  const [stepIndex, setStepIndex]     = useState(0);
  const [speed, setSpeed]             = useState(400);
  const [loading, setLoading]         = useState(false);
  const [playing, setPlaying]         = useState(false);
  const [error, setError]             = useState("");
  const [skipped, setSkipped]         = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setShowLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  // Derive type from problem — single enum, no conflicting booleans
  const algoType = detectType(problem);
  const isSort   = algoType === ALGO_TYPE.SORT;
  const isGraph  = algoType === ALGO_TYPE.GRAPH;
  const isDP     = algoType === ALGO_TYPE.DP;
  const needsSD  = needsSourceDest(problem);

  const maxSteps = results.length > 0
    ? Math.max(...results.map(r => r.steps?.length || 0))
    : 0;

  // Auto-play stepper
  useEffect(() => {
    if (results.length === 0 || !playing) return;
    if (stepIndex >= maxSteps - 1) {
      setPlaying(false);
      return;
    }
    const t = setInterval(() => {
      setStepIndex(prev => {
        if (prev >= maxSteps - 1) { setPlaying(false); return prev; }
        return prev + 1;
      });
    }, speed);
    return () => clearInterval(t);
  }, [results, speed, playing, maxSteps, stepIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if (results.length === 0) return;
      // Ignore when focus is in an input
      if (["INPUT","TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (e.code === "Space") { e.preventDefault(); setPlaying(p => !p); }
      if (e.code === "ArrowRight") setStepIndex(s => Math.min(maxSteps - 1, s + 1));
      if (e.code === "ArrowLeft")  setStepIndex(s => Math.max(0, s - 1));
      if (e.code === "KeyR")       { setStepIndex(0); setPlaying(false); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [results, maxSteps]);

  const handleRun = useCallback(async () => {
    if (!problem.trim()) { setError("Please describe the problem type first."); return; }
    if (!dataInput.trim()) { setError("Please enter input data."); return; }
    setError("");
    setSkipped([]);

    try {
      setLoading(true);
      const res = await fetch("https://algovision-backend.onrender.com/run", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem,
          data:        dataInput,
          graphType,
          source:      source !== "" ? Number(source) : 0,
          destination: destination !== "" ? Number(destination) : -1,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || `Server error ${res.status}`);
        setResults([]); setBest(null);
        return;
      }

      const result = await res.json();

      if (!result.success) {
        setError(result.error || "Unknown error from server");
        setResults([]); setBest(null);
        return;
      }

      setResults(result.results || []);
      setBest(result.best || null);
      setSkipped(result.skipped || []);
      setStepIndex(0);
      setPlaying(true);
    } catch (err) {
      setError("Could not connect to live backend. Please wait a moment and try again.");
      setResults([]); setBest(null);
    } finally {
      setLoading(false);
    }
  }, [problem, dataInput, graphType, source, destination]);

  return (
    <>
      <GlobalStyles />
      {showLoading && <LoadingScreen />}
      <AmbientBg />

      <div style={{ position:"relative", zIndex:1, minHeight:"100vh", padding:"32px 24px 60px" }}>

        {/* ── HEADER ── */}
        <header style={{ textAlign:"center", marginBottom:48, animation:"fadeUp 0.8s ease both" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:16,
            padding:"6px 18px", borderRadius:99,
            background:"rgba(0,245,160,0.08)", border:"1px solid rgba(0,245,160,0.2)" }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"var(--green)", animation:"pulse 2s infinite" }} />
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", color:"var(--green)", textTransform:"uppercase" }}>
              Algorithm Visualizer
            </span>
          </div>
          <h1 style={{
            fontSize:"clamp(38px,7vw,80px)", fontWeight:800, lineHeight:1.05, letterSpacing:"-0.02em",
            background:"linear-gradient(135deg, var(--green) 0%, var(--cyan) 40%, var(--purple) 70%, var(--pink) 100%)",
            backgroundSize:"300% 300%", animation:"titleGrad 5s ease infinite",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>
            AlgoVision<br />Arena
          </h1>
          <p style={{ marginTop:12, color:"var(--muted)", fontSize:15, letterSpacing:"0.02em" }}>
            Compare algorithms in real-time · Step through execution · Find the winner
          </p>
          <p style={{ marginTop:6, color:"var(--muted)", fontSize:12, opacity:0.6 }}>
            Tip: Space = play/pause · ← → = step · R = reset
          </p>
        </header>

        {/* ── CONTROL PANEL ── */}
        <div style={{
          maxWidth:900, margin:"0 auto 40px",
          padding:32, borderRadius:24,
          background:"rgba(8,13,22,0.7)", backdropFilter:"blur(30px)", WebkitBackdropFilter:"blur(30px)",
          border:"1px solid var(--border)",
          boxShadow:"0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          animation:"fadeUp 0.8s 0.15s ease both",
        }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:"var(--muted)", textTransform:"uppercase" }}>
                Problem Type
              </label>
              <textarea className={`glass-input${error && !problem.trim() ? " error" : ""}`} rows={3}
                placeholder="e.g. 'sort', 'shortest path dijkstra', 'bfs traversal', 'knapsack'…"
                value={problem} onChange={e => { setProblem(e.target.value); setError(""); }}
                style={{ resize:"none", minHeight:90 }} />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:"var(--muted)", textTransform:"uppercase" }}>
                Input Data
              </label>
              <textarea className={`glass-input${error && !dataInput.trim() ? " error" : ""}`} rows={3}
                placeholder={HINTS[algoType]}
                value={dataInput} onChange={e => { setDataInput(e.target.value); setError(""); }}
                style={{ resize:"none", minHeight:90 }} />
            </div>
          </div>

          {/* Input hint */}
          {algoType !== ALGO_TYPE.NONE && (
            <div style={{ marginBottom:16, padding:"10px 14px", borderRadius:10,
              background:"rgba(0,245,160,0.05)", border:"1px solid rgba(0,245,160,0.12)",
              display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:13, color:"rgba(0,245,160,0.5)" }}>💡</span>
              <span style={{ fontSize:12, color:"rgba(0,245,160,0.7)", fontFamily:"'JetBrains Mono',monospace" }}>
                {HINTS[algoType]}
              </span>
            </div>
          )}

          {/* Graph controls */}
          {isGraph && (
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>
              <div style={{ display:"flex", gap:10 }}>
                <button className={`toggle-btn ${graphType === "undirected" ? "active" : ""}`}
                  onClick={() => setGraphType("undirected")}>↔ Undirected</button>
                <button className={`toggle-btn ${graphType === "directed" ? "active" : ""}`}
                  onClick={() => setGraphType("directed")}>→ Directed</button>
              </div>
              {needsSD && (
                <div style={{ display:"flex", gap:10 }}>
                  <input className="glass-input" placeholder="Source node (default 0)"
                    value={source} onChange={e => setSource(e.target.value)} style={{ flex:1 }} />
                  <input className="glass-input" placeholder="Destination node (optional)"
                    value={destination} onChange={e => setDest(e.target.value)} style={{ flex:1 }} />
                </div>
              )}
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="error-banner" style={{ marginBottom:16 }}>
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <div style={{ display:"flex", gap:16, alignItems:"flex-end" }}>
            <button className="run-btn" onClick={handleRun} disabled={loading} style={{ flex:1 }}>
              <span>{loading ? "Running…" : "▶  Run Algorithm"}</span>
            </button>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", color:"var(--muted)", textTransform:"uppercase" }}>
                  Animation Speed
                </span>
                <span style={{ fontSize:11, fontFamily:"'JetBrains Mono',monospace", color:"var(--green)" }}>{speed}ms</span>
              </div>
              <input type="range" className="speed-slider" min={80} max={1200} step={20}
                value={speed} onChange={e => setSpeed(Number(e.target.value))} />
            </div>
          </div>
        </div>

        {/* ── SKIPPED NOTICE ── */}
        {skipped.length > 0 && (
          <div style={{ maxWidth:900, margin:"0 auto 20px" }}>
            {skipped.map((s, i) => (
              <div key={i} className="skipped-banner" style={{ marginBottom:8 }}>
                ⚡ Skipped: {s}
              </div>
            ))}
          </div>
        )}

        {/* ── PLAYBACK CONTROLS ── */}
        {results.length > 0 && (
          <div style={{ maxWidth:900, margin:"0 auto 24px",
            display:"flex", alignItems:"center", justifyContent:"center", gap:10,
            flexWrap:"wrap", animation:"fadeUp 0.5s ease both" }}>
            <button className="step-btn" disabled={stepIndex === 0}
              onClick={() => { setStepIndex(0); setPlaying(false); }}>⏮</button>
            <button className="step-btn" disabled={stepIndex === 0}
              onClick={() => setStepIndex(s => Math.max(0, s - 1))}>‹ Prev</button>
            <button className="step-btn"
              onClick={() => setPlaying(p => !p)}
              style={{ minWidth:90,
                background: playing ? "rgba(0,245,160,0.12)" : "var(--glass)",
                borderColor: playing ? "rgba(0,245,160,0.3)" : "var(--border)",
                color: playing ? "var(--green)" : "var(--text)" }}>
              {playing ? "⏸ Pause" : "▶ Play"}
            </button>
            <button className="step-btn" disabled={stepIndex >= maxSteps - 1}
              onClick={() => setStepIndex(s => Math.min(maxSteps - 1, s + 1))}>Next ›</button>
            <button className="step-btn" disabled={stepIndex >= maxSteps - 1}
              onClick={() => setStepIndex(maxSteps - 1)}>⏭</button>
            <span style={{ fontSize:11, fontFamily:"'JetBrains Mono',monospace", color:"var(--muted)" }}>
              Step {stepIndex + 1} / {maxSteps}
            </span>
          </div>
        )}

        {/* ── PROGRESS BAR ── */}
        {results.length > 0 && maxSteps > 0 && (
          <div style={{ maxWidth:900, margin:"0 auto 28px" }}>
            <div style={{ height:3, borderRadius:2, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
              <div style={{
                height:"100%", borderRadius:2,
                width:`${((stepIndex + 1) / maxSteps) * 100}%`,
                background:"linear-gradient(90deg, var(--green), var(--cyan))",
                transition:"width 0.3s ease",
                boxShadow:"0 0 8px rgba(0,245,160,0.6)",
              }} />
            </div>
          </div>
        )}

        {/* ── COMPLEXITY CHART ── */}
        {results.length > 1 && (
          <div style={{ maxWidth:900, margin:"0 auto 28px", animation:"scaleIn 0.6s 0.1s ease both" }}>
            <ComplexityChart results={results} />
          </div>
        )}

        {/* ── ALGO CARDS ── */}
        <div style={{
          maxWidth:1400, margin:"0 auto",
          display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:24,
        }}>
          {results.length === 0 ? (
            <div style={{
              gridColumn:"1/-1", padding:"80px 40px", textAlign:"center",
              borderRadius:24, background:"var(--glass)", border:"1px solid var(--border)",
              backdropFilter:"blur(20px)",
            }}>
              <div style={{ fontSize:48, marginBottom:20, opacity:0.4 }}>◈</div>
              <p style={{ fontSize:20, fontWeight:700, color:"var(--muted)" }}>Ready to Analyze</p>
              <p style={{ fontSize:14, color:"var(--muted)", opacity:0.6, marginTop:8 }}>
                Describe a problem and enter data above, then hit Run
              </p>
            </div>
          ) : (
            results.map((r, i) => {
              const isWinner = best?.algo === r.algo;
              return (
                <div key={i} className={`algo-card${isWinner ? " winner-card" : ""}`}
                  style={{ animationDelay:`${i * 0.08}s` }}>

                  {/* Card header */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                    <div>
                      {isWinner && (
                        <span style={{
                          display:"inline-block", marginBottom:6,
                          padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:700,
                          background:"rgba(0,245,160,0.12)", border:"1px solid rgba(0,245,160,0.3)", color:"var(--green)",
                          letterSpacing:"0.06em", textTransform:"uppercase",
                        }}>
                          🏆 Best
                        </span>
                      )}
                      <h3 style={{ fontSize:22, fontWeight:800,
                        background: isWinner
                          ? "linear-gradient(135deg,var(--green),var(--cyan))"
                          : "linear-gradient(135deg,var(--text),var(--muted))",
                        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                        {r.algo}
                      </h3>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:"var(--muted)", textTransform:"uppercase", marginBottom:2 }}>
                        {r.metricLabel}
                      </div>
                      <div style={{ fontSize:24, fontWeight:800, fontFamily:"'JetBrains Mono',monospace",
                        color: isWinner ? "var(--green)" : "var(--text)" }}>
                        {r.operations.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Complexity badges */}
                  {r.complexity && (
                    <div style={{ display:"flex", gap:6, marginBottom:14 }}>
                      <span className="complexity-badge time">⏱ {r.complexity.time}</span>
                      <span className="complexity-badge space">◼ {r.complexity.space}</span>
                    </div>
                  )}

                  {/* Visualization box */}
                  <div style={{
                    height:240, display:"flex", alignItems:"center", justifyContent:"center",
                    borderRadius:14, background:"rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.05)",
                    overflow:"hidden", position:"relative",
                  }}>
                    <div style={{ position:"absolute", inset:0,
                      background:"radial-gradient(ellipse at 50% 100%, rgba(0,245,160,0.04) 0%, transparent 70%)" }} />
                    {isGraph && <GraphView steps={r.steps} algo={r.algo} dataInput={dataInput} stepIndex={stepIndex} />}
                    {isSort  && <BarsView steps={r.steps} stepIndex={stepIndex} />}
                    {isDP    && <MatrixView steps={r.steps} stepIndex={stepIndex} />}
                  </div>

                  {/* Result */}
                  <div style={{
                    marginTop:14, padding:"12px 14px", borderRadius:10,
                    background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.05)",
                    fontFamily:"'JetBrains Mono',monospace", fontSize:12,
                    color: isWinner ? "rgba(0,245,160,0.85)" : "var(--muted)",
                    wordBreak:"break-all",
                  }}>
                    {getResultText(r, algoType, destination)}
                  </div>

                  {/* Per-card progress bar */}
                  <div style={{ marginTop:10, height:2, borderRadius:1, background:"rgba(255,255,255,0.05)", overflow:"hidden" }}>
                    <div style={{
                      height:"100%", borderRadius:1,
                      width:`${r.steps?.length ? ((Math.min(stepIndex, r.steps.length - 1) + 1) / r.steps.length) * 100 : 0}%`,
                      background: isWinner
                        ? "linear-gradient(90deg,var(--green),var(--cyan))"
                        : "linear-gradient(90deg,var(--cyan),var(--purple))",
                      transition:"width 0.3s ease",
                    }} />
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                    <span style={{ fontSize:10, color:"var(--muted)", fontFamily:"'JetBrains Mono',monospace" }}>
                      step {Math.min(stepIndex, (r.steps?.length || 1) - 1) + 1} / {r.steps?.length || 0}
                    </span>
                    {isWinner && (
                      <span style={{ fontSize:10, fontWeight:700, color:"var(--green)", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                        winner ←
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── FOOTER ── */}
        <footer style={{ textAlign:"center", marginTop:64, color:"var(--muted)", fontSize:12, opacity:0.5 }}>
          AlgoVision Arena · React + C++ engine
        </footer>
      </div>
    </>
  );
}