"use client";

import { useMemo, useState } from "react";
import { byTicker, Company } from "@/lib/companies";
import { correlation } from "@/lib/correlation";

interface Props {
  selected: string[];
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

export default function DetailedHeatmap({ selected }: Props) {
  const list: Company[] = useMemo(() => selected.map((t) => byTicker[t]).filter(Boolean), [selected]);
  const [hoverPair, setHoverPair] = useState<{ row: string; col: string } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  if (list.length < 2) {
    return (
      <p className="font-mono text-[11.5px] text-text-faint py-6 text-center">
        Select at least two companies above to see their pairwise correlation here.
      </p>
    );
  }

  return (
    <div>
      <div className="inline-block">
        <div className="flex pl-12 mb-1">
          {list.map((c) => (
            <span key={c.t} className="font-mono text-[10px] w-11 text-center text-text-dim">
              {c.t}
            </span>
          ))}
        </div>
        {list.map((rowC) => (
          <div className="flex items-center" key={rowC.t}>
            <span className="font-mono text-[10px] w-12 text-right pr-[7px] shrink-0 text-text-dim">
              {rowC.t}
            </span>
            {list.map((colC) => {
              const v = rowC.t === colC.t ? 1 : correlation(rowC, colC);
              const isDiag = rowC.t === colC.t;
              return (
                <div
                  key={colC.t}
                  className={`w-11 h-11 m-0.5 rounded-[3px] flex items-center justify-center font-mono text-[10px] font-semibold hover:outline hover:outline-2 hover:outline-text hover:-outline-offset-2 ${
                    isDiag ? "border border-white/25" : ""
                  }`}
                  style={{ background: colorForValue(v), color: textColorForValue(v) }}
                  onMouseMove={(e) => {
                    setHoverPair({ row: rowC.t, col: colC.t });
                    setTooltipPos({ x: e.clientX, y: e.clientY });
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
              corr: {correlation(byTicker[hoverPair.row], byTicker[hoverPair.col]).toFixed(2)}
            </>
          )}
        </div>
      )}
    </div>
  );
}
