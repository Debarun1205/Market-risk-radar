"use client";

import { useState } from "react";
import TickerTape from "@/components/TickerTape";
import WorldMap from "@/components/WorldMap";
import SectorHeatmap from "@/components/SectorHeatmap";
import DetailedHeatmap from "@/components/DetailedHeatmap";
import FactorRadar from "@/components/FactorRadar";
import CompanySearch from "@/components/CompanySearch";
import LiveChart from "@/components/LiveChart";
import AIAnalyst from "@/components/AIAnalyst";
import GlossaryTooltip from "@/components/GlossaryTooltip";
import { sectorColor, companies, DEFAULT_SELECTION, MAX_SELECTION } from "@/lib/companies";

export default function Page() {
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTION);
  const [hovered, setHovered] = useState<string | null>(null);

  function toggle(ticker: string) {
    setSelected((prev) => {
      if (prev.includes(ticker)) return prev.filter((t) => t !== ticker);
      if (prev.length >= MAX_SELECTION) return prev; // full — ignore new adds until one is removed
      return [...prev, ticker];
    });
  }

  const spotlight = hovered ?? selected[0] ?? "AAPL";

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
            {companies.length}+ companies across the world, a simplified diversification view, and
            a live-updating chart — built so it makes sense whether or not you know finance.
          </p>
        </div>
        <div className="font-mono text-[11px] tracking-wide uppercase border border-border rounded-[2px] px-2.5 py-1.5 text-text-dim flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-green shadow-[0_0_0_3px_rgba(89,201,122,0.15)]" />
          Demo dataset · {companies.length} companies · 40+ countries
        </div>
      </header>

      <main className="max-w-[1180px] mx-auto px-6">
        {/* HOW TO READ THIS */}
        <section className="bg-panel-alt border border-border-soft rounded-[3px] p-4 mt-2">
          <p className="font-mono text-[10.5px] tracking-wider uppercase text-cyan mb-2">
            New here? Start with this
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12.5px] text-text-dim leading-relaxed">
            <div>
              <span className="text-text font-semibold">1. The map</span> shows where companies
              are based. Scroll or use the +/− buttons to zoom into crowded areas.
            </div>
            <div>
              <span className="text-text font-semibold">2. The colored grid</span> shows which
              industries rise and fall together — warm squares move in sync, cool squares don't.
            </div>
            <div>
              <span className="text-text font-semibold">3. Search a company</span> to compare it
              directly against others and see its simulated live price.
            </div>
          </div>
        </section>

        {/* MAP PANEL */}
        <section className="bg-panel border border-border rounded-[3px] p-5 mt-5">
          <p className="font-mono text-[11px] tracking-wider uppercase text-text-dim flex items-center gap-2">
            <span className="text-amber">01</span> Global Footprint
          </p>
          <p className="font-mono text-[15px] font-semibold mt-0.5">
            Headquarters worldwide, sized by market cap
          </p>
          <p className="text-text-dim text-[12.5px] leading-relaxed mt-1 max-w-[460px]">
            Zoom in on any region to see individual companies. Click a pin to add it to your
            comparison (up to {MAX_SELECTION}) — the heatmap and radar update automatically.
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
            {selected.length} of {MAX_SELECTION} selected for comparison
          </div>
        </section>

        {/* SECTOR HEATMAP — DEFAULT BIG-PICTURE VIEW */}
        <section className="bg-panel border border-border rounded-[3px] p-5 mt-5">
          <p className="font-mono text-[11px] tracking-wider uppercase text-text-dim flex items-center gap-2">
            <span className="text-amber">02</span> Correlation Overview
          </p>
          <p className="font-mono text-[15px] font-semibold mt-0.5">
            How industries move together, at a glance
          </p>
          <div className="mt-3">
            <SectorHeatmap />
          </div>
        </section>

        {/* SEARCH & COMPARE */}
        <section className="bg-panel border border-border rounded-[3px] p-5 mt-5">
          <p className="font-mono text-[11px] tracking-wider uppercase text-text-dim flex items-center gap-2">
            <span className="text-amber">03</span> Compare Companies
          </p>
          <p className="font-mono text-[15px] font-semibold mt-0.5">
            Search any company to compare it directly
          </p>
          <p className="text-text-dim text-[12.5px] leading-relaxed mt-1 max-w-[540px]">
            Add up to {MAX_SELECTION} companies — by searching here or clicking pins on the map
            above — to see exactly how they correlate and how their fundamentals compare.
          </p>

          <div className="mt-3">
            <CompanySearch selected={selected} onAdd={toggle} maxReached={selected.length >= MAX_SELECTION} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div>
              <p className="font-mono text-[12px] font-semibold mb-1 flex items-center gap-1.5">
                Detailed correlation
                <GlossaryTooltip text="Unlike the industry-level grid above, this shows the exact correlation between the specific companies you've selected." />
              </p>
              <DetailedHeatmap selected={selected} />
            </div>
            <div>
              <p className="font-mono text-[12px] font-semibold mb-1">Factor radar</p>
              <FactorRadar selected={selected} onRemove={toggle} />
            </div>
          </div>
        </section>

        {/* LIVE CHART */}
        <section className="bg-panel border border-border rounded-[3px] p-5 mt-5">
          <p className="font-mono text-[11px] tracking-wider uppercase text-text-dim flex items-center gap-2">
            <span className="text-amber">04</span> Live Price
          </p>
          <p className="font-mono text-[15px] font-semibold mt-0.5">
            Hover a pin or pick a company to spotlight it here
          </p>
          <div className="mt-3">
            <LiveChart ticker={spotlight} />
          </div>
        </section>

        {/* AI ANALYST PANEL */}
        <section className="bg-panel border border-border rounded-[3px] p-5 mt-5">
          <AIAnalyst selected={selected} />
        </section>

        <footer className="max-w-[1180px] mx-auto mt-9 pt-4 border-t border-border-soft font-mono text-[10.5px] text-text-faint flex justify-between flex-wrap gap-2">
          <span>Data: real companies, synthetic financials — generated for prototype purposes</span>
          <span>Free-tier LLM ready · fallback-safe by design</span>
        </footer>
      </main>
    </div>
  );
}
