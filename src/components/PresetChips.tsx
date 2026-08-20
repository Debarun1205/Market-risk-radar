"use client";

import { presets } from "@/lib/presets";

interface Props {
  onSelect: (tickers: string[]) => void;
}

export default function PresetChips({ onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((p) => (
        <button
          key={p.name}
          onClick={() => onSelect(p.tickers)}
          title={p.description}
          className="font-mono text-[11px] border border-border rounded-[2px] px-2.5 py-1.5 text-text-dim hover:text-text hover:border-cyan transition-colors"
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}
