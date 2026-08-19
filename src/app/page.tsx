"use client";

import { useState } from "react";
import TickerTape from "@/components/TickerTape";
import WorldMap from "@/components/WorldMap";
import CorrelationHeatmap from "@/components/CorrelationHeatmap";
import FactorRadar from "@/components/FactorRadar";
import AIAnalyst from "@/components/AIAnalyst";
import { sectorColor, DEFAULT_SELECTION, MAX_SELECTION } from "@/lib/companies";

export default function Page() {
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTION);
  const [hovered, setHovered] = useState<string | null>(null);

  function toggle(ticker: string) {
    setSelected((prev) => {
      if (prev.includes(ticker)) return prev.filter((t) => t !== ticker);
      const next = [...prev, ticker];
      return next.length > MAX_SELECTION ? next.slice(1) : next;
    });
  }

  return (
    <div className="pb-12">
      <TickerTape />

      <header className="max-w-[1180px] mx-auto px-6 pt-7 pb-5 flex justify-between items-end gap-6 flex-wrap">
        <div>
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-amber mb-2">
            Prototype // Not Investment Advice
          </p>
          <h1 className="font-mono font-semibold text-[28px] tracking-tight">
            Market Risk Radar <span className="text-text-dim font-normal">· global footprint</span>
          </h1>
          <p className="text-text-dim text-[13.5px] mt-1.5 max-w-[560px] leading-relaxed">
            Company headquarters plotted on a world map, linked to a correlation heatmap and a
            factor radar. Click a pin to compare it. Synthetic data for demonstration.
          </p>
        </div>
        <div className="font-mono text-[11px] tracking-wide uppercase border border-border rounded-[2px] px-2.5 py-1.5 text-text-dim flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-green shadow-[0_0_0_3px_rgba(89,201,122,0.15)]" />
          Demo dataset · 14 companies · 10 countries
        </div>
      </header>

      <main className="max-w-[1180px] mx-auto px-6">
        {/* MAP PANEL */}
        <section className="bg-panel border border-border rounded-[3px] p-5 mt-5">
          <p className="font-mono text-[11px] tracking-wider uppercase text-text-dim flex items-center gap-2">
            <span className="text-amber">01</span> Global Footprint
          </p>
          <p className="font-mono text-[15px] font-semibold mt-0.5">
            Headquarters by country, sized by market cap
          </p>
          <p className="text-text-dim text-[12.5px] leading-relaxed mt-1 max-w-[460px]">
            Hover a pin for details. Click up to four to compare them in the radar below — the
            heatmap highlights automatically.
          </p>

          <div className="mt-3">
            <WorldMap selected={selected} onToggle={toggle} onHover={setHovered} />
          </div>

          <div className="flex flex-wrap gap-3.5 mt-3.5">
            {Object.entries(sectorColor).map(([sector, color]) => (
              <span
                key={sector}
                className="flex items-center gap-1.5 font-mono text-[10.5px] text-text-dim"
              >
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                {sector}
              </span>
            ))}
          </div>

          <div className="font-mono text-[11px] text-text-faint mt-3 flex items-center gap-1.5">
            <span className="w-[5px] h-[5px] rounded-full bg-cyan" />
            {selected.length} of {MAX_SELECTION} selected for radar
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-5">
          {/* HEATMAP PANEL */}
          <section className="bg-panel border border-border rounded-[3px] p-5 mt-5">
            <p className="font-mono text-[11px] tracking-wider uppercase text-text-dim flex items-center gap-2">
              <span className="text-amber">02</span> Correlation Matrix
            </p>
            <p className="font-mono text-[15px] font-semibold mt-0.5">
              30-day return correlation, all 14 companies
            </p>
            <p className="text-text-dim text-[12.5px] leading-relaxed mt-1 max-w-[460px]">
              Warm cells move together; cool cells diversify each other. Selecting a company on
              the map highlights its row and column here.
            </p>
            <CorrelationHeatmap highlighted={hovered} onHoverCell={setHovered} />
          </section>

          {/* RADAR PANEL */}
          <section className="bg-panel border border-border rounded-[3px] p-5 mt-5">
            <p className="font-mono text-[11px] tracking-wider uppercase text-text-dim flex items-center gap-2">
              <span className="text-amber">03</span> Factor Radar
            </p>
            <p className="font-mono text-[15px] font-semibold mt-0.5">
              Fundamentals, normalized 0–100
            </p>
            <p className="text-text-dim text-[12.5px] leading-relaxed mt-1 max-w-[460px]">
              Profitability, growth, liquidity, leverage, valuation and momentum for up to four
              selected companies.
            </p>
            <div className="mt-3">
              <FactorRadar selected={selected} onRemove={toggle} />
            </div>
          </section>
        </div>

        {/* AI ANALYST PANEL */}
        <section className="bg-panel border border-border rounded-[3px] p-5 mt-5">
          <AIAnalyst selected={selected} />
        </section>

        <footer className="max-w-[1180px] mx-auto mt-9 pt-4 border-t border-border-soft font-mono text-[10.5px] text-text-faint flex justify-between flex-wrap gap-2">
          <span>Data: synthetic, generated for prototype purposes</span>
          <span>Free-tier LLM ready · fallback-safe by design</span>
        </footer>
      </main>
    </div>
  );
}
