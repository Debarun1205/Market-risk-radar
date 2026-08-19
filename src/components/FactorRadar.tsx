"use client";

import { useMemo } from "react";
import { companies, byTicker, sectorColor } from "@/lib/companies";
import { buildRadarMap, radarFactors } from "@/lib/radar";

interface Props {
  selected: string[];
  onRemove: (ticker: string) => void;
}

const CX = 170;
const CY = 155;
const R = 105;

export default function FactorRadar({ selected, onRemove }: Props) {
  const radarMap = useMemo(() => buildRadarMap(companies), []);

  const angle = (i: number) => (Math.PI * 2 * i) / radarFactors.length - Math.PI / 2;
  const pointFor = (i: number, val: number) => {
    const r = (val / 100) * R;
    return [CX + r * Math.cos(angle(i)), CY + r * Math.sin(angle(i))] as const;
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-1.5 min-h-[30px]">
        {selected.length === 0 ? (
          <span className="font-mono text-[11.5px] text-text-faint">
            Click a pin on the map above to add a company.
          </span>
        ) : (
          selected.map((t) => (
            <button
              key={t}
              onClick={() => onRemove(t)}
              className="flex items-center gap-1.5 font-mono text-[11px] border border-border px-2.5 py-1 rounded-[2px] cursor-pointer text-text bg-white/[0.02] hover:border-text-faint transition-colors"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: sectorColor[byTicker[t].sector] }}
              />
              {t}
              <span className="text-text-faint ml-0.5">×</span>
            </button>
          ))
        )}
      </div>

      <div className="flex justify-center">
        <svg viewBox="0 0 340 320" width="100%" style={{ maxWidth: 360 }}>
          {[0.25, 0.5, 0.75, 1].map((f) => {
            const pts = radarFactors.map((_, i) => pointFor(i, 100 * f).join(",")).join(" ");
            return (
              <polygon key={f} points={pts} fill="none" stroke="var(--border)" strokeWidth={1} />
            );
          })}

          {radarFactors.map((label, i) => {
            const [x, y] = pointFor(i, 100);
            const lx = CX + (R + 20) * Math.cos(angle(i));
            const ly = CY + (R + 16) * Math.sin(angle(i));
            const cos = Math.cos(angle(i));
            const anchor = Math.abs(cos) < 0.3 ? "middle" : cos > 0 ? "start" : "end";
            return (
              <g key={label}>
                <line x1={CX} y1={CY} x2={x} y2={y} stroke="var(--border-soft)" strokeWidth={1} />
                <text
                  x={lx}
                  y={ly}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--text-dim)"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {selected.map((t) => {
            const company = byTicker[t];
            const vals = radarMap[t];
            const color = sectorColor[company.sector];
            const pts = vals.map((v, i) => pointFor(i, v).join(",")).join(" ");
            return (
              <g key={t}>
                <polygon
                  points={pts}
                  style={{ stroke: color, fill: color, fillOpacity: 0.14, strokeWidth: 1.6 }}
                />
                {vals.map((v, i) => {
                  const [x, y] = pointFor(i, v);
                  return (
                    <circle key={i} cx={x} cy={y} r={3} fill={color}>
                      <title>
                        {t} {radarFactors[i]}: {v}
                      </title>
                    </circle>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
