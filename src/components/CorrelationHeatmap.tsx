"use client";

import { useMemo, useState } from "react";
import { companies, byTicker } from "@/lib/companies";
import { buildCorrelationMatrix, correlationStats } from "@/lib/correlation";

interface Props {
  highlighted: string | null;
  onHoverCell: (ticker: string | null) => void;
}

function colorForValue(v: number): string {
  const cool = [58, 109, 168];
  const neutral = [23, 32, 46];
  const warm = [232, 163, 61];
  let c1: number[], c2: number[], t: number;
  if (v <= 0) {
    c1 = cool;
    c2 = neutral;
    t = v + 1;
  } else {
    c1 = neutral;
    c2 = warm;
    t = v;
  }
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
  return `rgb(${r},${g},${b})`;
}

function textColorForValue(v: number): string {
  return Math.abs(v) > 0.55 ? "rgba(11,14,20,0.8)" : "rgba(255,255,255,0.55)";
}

export default function CorrelationHeatmap({ highlighted, onHoverCell }: Props) {
  const matrix = useMemo(() => buildCorrelationMatrix(companies), []);
  const stats = useMemo(() => correlationStats(companies, matrix), [matrix]);
  const [hoverPair, setHoverPair] = useState<{ row: string; col: string } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const activeSet = new Set<string>();
  if (highlighted) activeSet.add(highlighted);
  if (hoverPair) {
    activeSet.add(hoverPair.row);
    activeSet.add(hoverPair.col);
  }

  return (
    <div>
      <div className="overflow-x-auto mt-2">
        <div className="inline-block">
          <div className="flex pl-12 mb-1">
            {companies.map((c) => (
              <span
                key={c.t}
                className={`font-mono text-[10px] w-[30px] text-center transition-colors ${
                  activeSet.has(c.t) ? "text-text font-semibold" : "text-text-dim"
                }`}
              >
                {c.t}
              </span>
            ))}
          </div>
          {companies.map((rowC, ri) => (
            <div className="flex items-center" key={rowC.t}>
              <span
                className={`font-mono text-[10px] w-12 text-right pr-[7px] shrink-0 transition-colors ${
                  activeSet.has(rowC.t) ? "text-text font-semibold" : "text-text-dim"
                }`}
              >
                {rowC.t}
              </span>
              {companies.map((colC, ci) => {
                const v = matrix[ri][ci];
                const isDiag = ri === ci;
                return (
                  <div
                    key={colC.t}
                    className={`w-[26px] h-[26px] m-0.5 rounded-[2px] flex items-center justify-center font-mono text-[8px] font-semibold opacity-0 animate-[cell-in_.3s_ease_forwards] hover:outline hover:outline-2 hover:outline-text hover:-outline-offset-2 ${
                      isDiag ? "border border-white/25" : ""
                    }`}
                    style={{
                      background: colorForValue(v),
                      color: textColorForValue(v),
                      animationDelay: `${(ri * companies.length + ci) * 0.008}s`,
                    }}
                    onMouseMove={(e) => {
                      setHoverPair({ row: rowC.t, col: colC.t });
                      setTooltipPos({ x: e.clientX, y: e.clientY });
                      onHoverCell(null);
                    }}
                    onMouseLeave={() => {
                      setHoverPair(null);
                      setTooltipPos(null);
                    }}
                  >
                    {v.toFixed(2)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3.5 font-mono text-[10.5px] text-text-dim">
        <span>−1.0</span>
        <div className="flex-1 h-2 rounded-[2px] bg-[linear-gradient(90deg,#3A6DA8,#17202E_48%,#17202E_52%,#7A4A22,#E8A33D)]" />
        <span>+1.0</span>
      </div>

      <div className="flex gap-[18px] mt-3.5 flex-wrap">
        <div className="font-mono">
          <div className="text-[17px] font-semibold">{stats.avg.toFixed(2)}</div>
          <div className="text-[10px] text-text-dim uppercase tracking-wide mt-0.5">Avg correlation</div>
        </div>
        <div className="font-mono">
          <div className="text-[17px] font-semibold text-amber">{stats.maxPair.join("/")}</div>
          <div className="text-[10px] text-text-dim uppercase tracking-wide mt-0.5">Most correlated</div>
        </div>
        <div className="font-mono">
          <div className="text-[17px] font-semibold text-cyan">{stats.minPair.join("/")}</div>
          <div className="text-[10px] text-text-dim uppercase tracking-wide mt-0.5">Best diversifier</div>
        </div>
      </div>

      {hoverPair && tooltipPos && (
        <div
          className="fixed pointer-events-none bg-[#050608] border border-border text-text font-mono text-[11.5px] px-2.5 py-2 rounded-[3px] z-50 max-w-[230px] leading-relaxed"
          style={{ left: tooltipPos.x + 14, top: tooltipPos.y + 14 }}
        >
          {hoverPair.row === hoverPair.col ? (
            <>
              <b className="text-amber">{hoverPair.row}</b> · {byTicker[hoverPair.row].name} ·{" "}
              {byTicker[hoverPair.row].country}
            </>
          ) : (
            <>
              <b className="text-amber">{hoverPair.row}</b> ({byTicker[hoverPair.row].country}) vs{" "}
              <b className="text-amber">{hoverPair.col}</b> ({byTicker[hoverPair.col].country})
              <br />
              corr: {matrix[companies.findIndex((c) => c.t === hoverPair.row)][
                companies.findIndex((c) => c.t === hoverPair.col)
              ].toFixed(2)}
            </>
          )}
        </div>
      )}
    </div>
  );
}
