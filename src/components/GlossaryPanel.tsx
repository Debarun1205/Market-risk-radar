"use client";

import { useEffect } from "react";

interface Term {
  term: string;
  definition: string;
}

const terms: Term[] = [
  {
    term: "Correlation",
    definition:
      "A number from −1 to +1 showing how much two things move together. +1 means they move in perfect lockstep, 0 means no relationship, and negative means one tends to rise when the other falls.",
  },
  {
    term: "Diversification",
    definition:
      "Spreading investments across things that don't all move together, so a downturn in one doesn't drag everything else down with it.",
  },
  {
    term: "Sector",
    definition:
      "The industry a company belongs to — Tech, Financials, Energy, Healthcare, and so on. Companies in the same sector tend to be affected by similar events.",
  },
  {
    term: "Region",
    definition:
      "A broad geography (North America, Europe, Asia, etc.) used to group companies by where they're based, separate from sector.",
  },
  {
    term: "Market cap",
    definition:
      "The total value of a company, roughly: share price × number of shares. Used here to size the pins on the map — bigger pin, bigger company.",
  },
  {
    term: "Radar factors",
    definition:
      "Six simplified traits scored 0–100: Profitability, Growth, Liquidity (how easily bills get paid), Leverage (debt load, inverted so higher is better), Valuation (cheap vs. expensive), and Momentum (recent price trend).",
  },
  {
    term: "Live price",
    definition:
      "A simulated, continuously-updating number for demonstration — it is not a real market feed. Real prices would require a paid data subscription.",
  },
  {
    term: "News sentiment",
    definition:
      "Whether a headline reads as generally positive, negative, or neutral for a company, shown as a small colored dot next to each article.",
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function GlossaryPanel({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[min(380px,90vw)] bg-panel border-l border-border z-50 overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-1">
          <p className="font-mono text-[11px] uppercase tracking-wider text-amber">Learn</p>
          <button
            onClick={onClose}
            aria-label="Close glossary"
            className="w-7 h-7 flex items-center justify-center text-text-dim hover:text-text font-mono text-[16px] transition-colors"
          >
            ×
          </button>
        </div>
        <p className="font-mono text-[16px] font-semibold mb-4">Every term on this site, plainly</p>
        <div className="flex flex-col gap-4">
          {terms.map((t) => (
            <div key={t.term} className="border-b border-border-soft pb-4 last:border-b-0">
              <p className="font-mono text-[13px] font-semibold text-cyan mb-1">{t.term}</p>
              <p className="text-[12.5px] text-text-dim leading-relaxed">{t.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
