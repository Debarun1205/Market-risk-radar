"use client";

import { useMemo, useState } from "react";
import { companies, sectorColor } from "@/lib/companies";
import { buildSectorMatrix } from "@/lib/correlation";
import GlossaryTooltip from "./GlossaryTooltip";
import DiversificationBadge from "./DiversificationBadge";

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

export default function SectorHeatmap() {
  const { sectors, matrix } = useMemo(() => buildSectorMatrix(companies), []);
  const [hover, setHover] = useState<{ row: string; col: string; v: number } | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const avg = useMemo(() => {
    let sum = 0,
      count = 0;
    for (let i = 0; i < sectors.length; i++) {
      for (let j = i + 1; j < sectors.length; j++) {
        sum += matrix[i][j];
        count++;
      }
    }
    return count ? sum / count : 0;
  }, [sectors, matrix]);

  return (
    <div>
      <p className="text-[12.5px] text-text-dim leading-relaxed mb-3 flex items-start gap-1.5">
        Each square shows how similarly two industries tend to move — the average, taken across
        all {companies.length} companies grouped by sector.
        <GlossaryTooltip text="Correlation measures how much two things move together. +1 means they move in perfect lockstep. 0 means no relationship. Negative means one tends to go up when the other goes down." />
      </p>

      <div className="overflow-x-auto">
        <div className="inline-block">
          <div className="flex pl-[92px] mb-1">
            {sectors.map((s) => (
              <span
                key={s}
                className="font-mono text-[10px] text-text-dim w-11 text-center"
                title={s}
              >
                {s.slice(0, 4)}
              </span>
            ))}
          </div>
          {sectors.map((rowS, ri) => (
            <div className="flex items-center" key={rowS}>
              <span className="font-mono text-[10.5px] text-text-dim w-[92px] text-right pr-2 shrink-0 flex items-center justify-end gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sectorColor[rowS] }} />
                {rowS}
              </span>
              {sectors.map((colS, ci) => {
                const v = matrix[ri][ci];
                const isDiag = ri === ci;
                return (
                  <div
                    key={colS}
                    className={`w-11 h-11 m-0.5 rounded-[3px] flex items-center justify-center font-mono text-[10px] font-semibold cursor-default hover:outline hover:outline-2 hover:outline-text hover:-outline-offset-2 ${
                      isDiag ? "border border-white/25" : ""
                    }`}
                    style={{ background: colorForValue(v), color: textColorForValue(v) }}
                    onMouseMove={(e) => {
                      setHover({ row: rowS, col: colS, v });
                      setPos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => {
                      setHover(null);
                      setPos(null);
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

      <div className="flex items-center gap-2 mt-4 font-mono text-[10.5px] text-text-dim">
        <span>−1.0 (opposite)</span>
        <div className="flex-1 h-2 rounded-[2px] bg-[linear-gradient(90deg,#3A6DA8,#17202E_48%,#17202E_52%,#7A4A22,#E8A33D)]" />
        <span>+1.0 (lockstep)</span>
      </div>

      <div className="mt-4">
        <DiversificationBadge avg={avg} />
      </div>

      {hover && pos && (
        <div
          className="fixed pointer-events-none bg-[#050608] border border-border text-text font-mono text-[11.5px] px-2.5 py-2 rounded-[3px] z-50 max-w-[240px] leading-relaxed"
          style={{ left: pos.x + 14, top: pos.y + 14 }}
        >
          {hover.row === hover.col ? (
            <>
              <b className="text-amber">{hover.row}</b> sector, internal average
            </>
          ) : (
            <>
              <b className="text-amber">{hover.row}</b> vs <b className="text-amber">{hover.col}</b>
              <br />
              average correlation: {hover.v.toFixed(2)}
            </>
          )}
        </div>
      )}
    </div>
  );
}
