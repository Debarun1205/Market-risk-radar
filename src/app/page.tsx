"use client";

import { useEffect, useState } from "react";
import TickerTape from "@/components/TickerTape";
import WorldMap from "@/components/WorldMap";
import SectorHeatmap from "@/components/SectorHeatmap";
import DetailedHeatmap from "@/components/DetailedHeatmap";
import FactorRadar from "@/components/FactorRadar";
import CompanySearch from "@/components/CompanySearch";
import PresetChips from "@/components/PresetChips";
import LiveChart from "@/components/LiveChart";
import NewsPanel from "@/components/NewsPanel";
import AIAnalyst from "@/components/AIAnalyst";
import GlossaryTooltip from "@/components/GlossaryTooltip";
import GlossaryPanel from "@/components/GlossaryPanel";
import OnboardingTour from "@/components/OnboardingTour";
import { sectorColor, companies, DEFAULT_SELECTION, MAX_SELECTION } from "@/lib/companies";

const TOUR_SEEN_KEY = "mrr_tour_seen";

export default function Page() {
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTION);
  const [hovered, setHovered] = useState<string | null>(null);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    const seen = window.localStorage.getItem(TOUR_SEEN_KEY);
    if (!seen) {
      const id = setTimeout(() => setTourActive(true), 600);
      return () => clearTimeout(id);
    }
  }, []);

  function toggle(ticker: string) {
    setSelected((prev) => {
      if (prev.includes(ticker)) return prev.filter((t) => t !== ticker);
      if (prev.length >= MAX_SELECTION) return prev;
      return [...prev, ticker];
    });
  }

  function endTour() {
    setTourActive(false);
    setTourStep(0);
    window.localStorage.setItem(TOUR_SEEN_KEY, "1");
  }

  function startTour() {
    setTourStep(0);
    setTourActive(true);
  }

  const spotlight = hovered ?? selected[0] ?? "AAPL";

  const sectionAnim = (i: number) => ({
    animation: "fade-up 500ms ease both",
    animationDelay: `${i * 60}ms`,
  });

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
            {companies.length}+ companies across the world, a simplified diversification view, live
            news, and a live-updating chart — built so it makes sense whether or not you know
            finance.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={startTour}
            className="font-mono text-[11px] tracking-wide uppercase border border-border rounded-[2px] px-2.5 py-1.5 text-text-dim hover:text-text hover:border-cyan transition-colors"
          >
            ? Take the tour
          </button>
          <button
            onClick={() => setGlossaryOpen(true)}
            className="font-mono text-[11px] tracking-wide uppercase border border-border rounded-[2px] px-2.5 py-1.5 text-text-dim hover:text-text hover:border-cyan transition-colors"
          >
            Learn
          </button>
        </div>
      </header>

      <main className="max-w-[1180px] mx-auto px-6">
        {/* HOW TO READ THIS */}
        <section className="bg-panel-alt border border-border-soft rounded-[3px] p-4 mt-2" style={sectionAnim(0)}>
          <p className="font-mono text-[10.5px] tracking-wider uppercase text-cyan mb-2">
            New here? Start with this — or click &quot;Take the tour&quot; above
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12.5px] text-text-dim leading-relaxed">
            <div>
              <span className="text-text font-semibold">1. The map</span> shows where companies
              are based. Zoom into crowded areas to see individual pins.
            </div>
            <div>
              <span className="text-text font-semibold">2. The colored grid</span> shows which
              industries rise and fall together.
            </div>
            <div>
              <span className="text-text font-semibold">3. Search or use a preset</span> to
              compare companies directly, see their news, and their live price.
            </div>
          </div>
        </section>

        {/* MAP PANEL */}
        <section
          data-tour="map"
          className="bg-panel border border-border rounded-[3px] p-5 mt-5"
          style={sectionAnim(1)}
        >
          <p className="font-mono text-[11px] tracking-wider uppercase text-text-dim flex items-center gap-2">
            <span className="text-amber">01</span> Global Footprint
          </p>
          <p className="font-mono text-[15px] font-semibold mt-0.5">
            Headquarters worldwide, sized by market cap
          </p>
          <p className="text-text-dim text-[12.5px] leading-relaxed mt-1 max-w-[460px]">
            Zoom in on any region to see individual companies. Click a pin to add it to your
            comparison (up to {MAX_SELECTION}) — the heatmap, radar, news, and live chart all
            update automatically.
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
        <section
          data-tour="heatmap"
          className="bg-panel border border-border rounded-[3px] p-5 mt-5"
          style={sectionAnim(2)}
        >
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
        <section
          data-tour="search"
          className="bg-panel border border-border rounded-[3px] p-5 mt-5"
          style={sectionAnim(3)}
        >
          <p className="font-mono text-[11px] tracking-wider uppercase text-text-dim flex items-center gap-2">
            <span className="text-amber">03</span> Compare Companies
          </p>
          <p className="font-mono text-[15px] font-semibold mt-0.5">
            Search any company, or start from a preset
          </p>
          <p className="text-text-dim text-[12.5px] leading-relaxed mt-1 max-w-[540px]">
            Add up to {MAX_SELECTION} companies — by searching, clicking a preset below, or
            clicking pins on the map above.
          </p>

          <div className="mt-3">
            <CompanySearch selected={selected} onAdd={toggle} maxReached={selected.length >= MAX_SELECTION} />
          </div>

          <div className="mt-3">
            <PresetChips onSelect={(tickers) => setSelected(tickers.slice(0, MAX_SELECTION))} />
          </div>

          <div data-tour="radar" className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
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

        {/* NEWS PANEL */}
        <section
          data-tour="news"
          className="bg-panel border border-border rounded-[3px] p-5 mt-5"
          style={sectionAnim(4)}
        >
          <p className="font-mono text-[11px] tracking-wider uppercase text-text-dim flex items-center gap-2">
            <span className="text-amber">04</span> Market News
          </p>
          <p className="font-mono text-[15px] font-semibold mt-0.5">
            Headlines that might move these companies
          </p>
          <div className="mt-3">
            <NewsPanel tickers={selected} />
          </div>
        </section>

        {/* LIVE CHART */}
        <section
          data-tour="live"
          className="bg-panel border border-border rounded-[3px] p-5 mt-5"
          style={sectionAnim(5)}
        >
          <p className="font-mono text-[11px] tracking-wider uppercase text-text-dim flex items-center gap-2">
            <span className="text-amber">05</span> Live Price
          </p>
          <p className="font-mono text-[15px] font-semibold mt-0.5">
            Hover a pin or pick a company to spotlight it here
          </p>
          <div className="mt-3">
            <LiveChart ticker={spotlight} />
          </div>
        </section>

        {/* AI ANALYST PANEL */}
        <section
          data-tour="ai"
          className="bg-panel border border-border rounded-[3px] p-5 mt-5"
          style={sectionAnim(6)}
        >
          <AIAnalyst selected={selected} />
        </section>

        <footer className="max-w-[1180px] mx-auto mt-9 pt-4 border-t border-border-soft font-mono text-[10.5px] text-text-faint flex justify-between flex-wrap gap-2">
          <span>Data: real companies, synthetic financials — generated for prototype purposes</span>
          <span>Free-tier LLM & news ready · fallback-safe by design</span>
        </footer>
      </main>

      <GlossaryPanel open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
      <OnboardingTour
        active={tourActive}
        step={tourStep}
        onNext={() => (tourStep >= 6 ? endTour() : setTourStep((s) => s + 1))}
        onPrev={() => setTourStep((s) => Math.max(0, s - 1))}
        onSkip={endTour}
      />
    </div>
  );
}
