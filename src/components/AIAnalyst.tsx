"use client";

import { useEffect, useState } from "react";
import { scenarios } from "@/lib/scenarios";

interface Props {
  selected: string[];
}

type Mode = "demo" | "live";
type ResultState =
  | { status: "loading" }
  | { status: "done"; mode: "demo" | "live" | "live-fallback"; text: string; note?: string };

export default function AIAnalyst({ selected }: Props) {
  const [mode, setMode] = useState<Mode>("demo");
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [result, setResult] = useState<ResultState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setResult({ status: "loading" });

    const minDelay = new Promise((r) => setTimeout(r, mode === "demo" ? 450 : 700));

    Promise.all([
      fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId, selectedTickers: selected, mode }),
      }).then((r) => r.json()),
      minDelay,
    ])
      .then(([data]) => {
        if (cancelled) return;
        setResult({ status: "done", mode: data.mode, text: data.text, note: data.note });
      })
      .catch(() => {
        if (cancelled) return;
        const fallback = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];
        setResult({
          status: "done",
          mode: "live-fallback",
          text: fallback.text,
          note: "Request failed — showing cached analysis instead.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [mode, scenarioId, selected]);

  return (
    <div>
      <div className="flex justify-between items-center gap-3 flex-wrap mb-4">
        <div>
          <p className="font-mono text-[11px] tracking-wider uppercase text-text-dim flex items-center gap-2">
            <span className="text-amber">06</span> AI Analyst
          </p>
          <p className="font-mono text-[15px] font-semibold mt-0.5">
            Narrative insight, generated from the data above
          </p>
        </div>
        <div className="flex border border-border rounded-[2px] overflow-hidden font-mono text-[11px]">
          {(["demo", "live"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 uppercase tracking-wide transition-colors ${
                mode === m ? "bg-amber text-bg font-semibold" : "text-text-dim hover:text-text"
              }`}
            >
              {m} mode
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-5 flex-wrap">
        <div className="flex flex-col gap-1.5 min-w-[210px]">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => setScenarioId(s.id)}
              className={`text-left bg-panel-alt border font-sans text-[12.5px] px-3 py-2.5 rounded-[3px] transition-colors ${
                scenarioId === s.id
                  ? "border-amber text-text bg-amber/[0.06]"
                  : "border-border text-text-dim hover:text-text hover:border-text-faint"
              }`}
            >
              <span className="block font-mono text-[9.5px] text-amber uppercase tracking-wider mb-1">
                {s.tag}
              </span>
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-[280px] bg-panel-alt border border-border rounded-[3px] px-4.5 py-4 min-h-[150px]">
          {result.status === "loading" ? (
            <>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-4 h-4 rounded-full bg-[conic-gradient(var(--amber),var(--rose),var(--cyan),var(--amber))]" />
                <span className="font-mono text-[11px] text-text-dim tracking-wide">
                  GENERATING · {mode.toUpperCase()} MODE
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {["92%", "78%", "85%", "40%"].map((w) => (
                  <div
                    key={w}
                    className="h-[11px] rounded-[2px] bg-[linear-gradient(90deg,var(--border)_25%,var(--border-soft)_50%,var(--border)_75%)] bg-[length:200%_100%] animate-[shimmer_1.1s_linear_infinite]"
                    style={{ width: w }}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-4 h-4 rounded-full bg-[conic-gradient(var(--amber),var(--rose),var(--cyan),var(--amber))]" />
                <span className="font-mono text-[11px] text-text-dim tracking-wide">
                  {result.mode === "demo" && "DEMO MODE · PRE-GENERATED"}
                  {result.mode === "live" && "LIVE MODE"}
                  {result.mode === "live-fallback" && "LIVE MODE — FALLBACK"}
                </span>
              </div>
              <div className="text-[13.5px] leading-relaxed text-text">{result.text}</div>
              <div className="font-mono text-[10.5px] text-text-faint mt-3 flex items-center gap-1.5">
                <span className="w-[5px] h-[5px] rounded-full bg-cyan" />
                {result.mode === "demo" && "Runs free — no API calls in this mode"}
                {result.note}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
