"use client";

import { useEffect, useState } from "react";

interface Props {
  avg: number; // -1 to 1, but practically 0 to ~0.6 for this dataset
}

function readAvg(avg: number): { label: string; color: string; text: string } {
  if (avg < 0.2) {
    return {
      label: "Well diversified",
      color: "var(--green)",
      text: "These holdings mostly move independently of each other — a downturn in one is unlikely to drag the others down with it.",
    };
  }
  if (avg < 0.4) {
    return {
      label: "Moderately diversified",
      color: "var(--amber)",
      text: "Some groups move together more than others. There's real diversification here, but it's uneven across sectors.",
    };
  }
  return {
    label: "Concentrated risk",
    color: "var(--rose)",
    text: "Many of these holdings tend to rise and fall together. A downturn in one sector is likely to affect several others at once.",
  };
}

// Semi-circle gauge, needle sweeps from 0 to the clamped 0..1 reading of avg.
function Gauge({ value, color }: { value: number; color: string }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(Math.max(0, Math.min(1, value))));
    return () => cancelAnimationFrame(id);
  }, [value]);

  const angle = -90 + animated * 180; // -90deg (left) to +90deg (right)
  const cx = 40;
  const cy = 40;
  const r = 32;
  const arcPath = (frac: number) => {
    const a = -90 + frac * 180;
    const rad = (a * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const [ex, ey] = arcPath(1);
  const [sx, sy] = arcPath(0);

  return (
    <svg width="80" height="46" viewBox="0 0 80 46" className="flex-shrink-0">
      <path
        d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`}
        fill="none"
        stroke="var(--border)"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path
        d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={`${animated * (Math.PI * r)} ${Math.PI * r}`}
        style={{ transition: "stroke-dasharray 900ms cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
      <line
        x1={cx}
        y1={cy}
        x2={cx + (r - 8) * Math.cos((angle * Math.PI) / 180)}
        y2={cy + (r - 8) * Math.sin((angle * Math.PI) / 180)}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        style={{ transition: "all 900ms cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
      <circle cx={cx} cy={cy} r={3} fill={color} />
    </svg>
  );
}

export default function DiversificationBadge({ avg }: Props) {
  const read = readAvg(avg);
  return (
    <div
      className="flex items-center gap-3.5 border rounded-[3px] px-3.5 py-2.5"
      style={{ borderColor: read.color, background: `${read.color}0F` }}
    >
      <Gauge value={avg} color={read.color} />
      <div>
        <div className="font-mono text-[12px] font-semibold" style={{ color: read.color }}>
          {read.label}
        </div>
        <div className="text-[12px] text-text-dim leading-snug mt-0.5 max-w-md">{read.text}</div>
      </div>
    </div>
  );
}
