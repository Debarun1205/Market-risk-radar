"use client";

import { useEffect } from "react";

export interface TourStep {
  target: string; // matches a data-tour attribute
  title: string;
  text: string;
}

export const tourSteps: TourStep[] = [
  {
    target: "map",
    title: "Start with the map",
    text: "Every company here is plotted at its real headquarters. Scroll or use the +/− buttons to zoom into crowded areas like the US or Europe.",
  },
  {
    target: "heatmap",
    title: "The colored grid",
    text: "This shows which industries tend to rise and fall together. Warm squares move in sync — cool squares move independently, which is what real diversification looks like.",
  },
  {
    target: "search",
    title: "Search or click to compare",
    text: "Search any company by name, or click pins on the map. Add up to 6 to see exactly how they compare.",
  },
  {
    target: "radar",
    title: "The radar shape",
    text: "Six simple traits per company — profitability, growth, and so on — scored 0 to 100. A bigger shape generally means a stronger overall profile.",
  },
  {
    target: "news",
    title: "Market news",
    text: "Headlines tagged to whichever companies you've selected, so you can see what's actually being said about them.",
  },
  {
    target: "live",
    title: "Live price",
    text: "A simulated, continuously-updating price for whichever company you're focused on — clearly labeled as simulated, not a real feed.",
  },
  {
    target: "ai",
    title: "Ask the AI analyst",
    text: "Get a short written summary of what the data above actually means, in plain language.",
  },
];

interface Props {
  active: boolean;
  step: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

export default function OnboardingTour({ active, step, onNext, onPrev, onSkip }: Props) {
  const current = tourSteps[step];

  useEffect(() => {
    if (!active || !current) return;
    const el = document.querySelector(`[data-tour="${current.target}"]`);
    if (el) {
      el.classList.add("tour-highlight");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return () => {
      el?.classList.remove("tour-highlight");
    };
  }, [active, current]);

  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onSkip();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onNext, onPrev, onSkip]);

  if (!active || !current) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onSkip} />
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[min(420px,90vw)] bg-panel border border-amber rounded-[4px] p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-amber">
            Step {step + 1} of {tourSteps.length}
          </span>
          <button
            onClick={onSkip}
            className="font-mono text-[10.5px] text-text-faint hover:text-text transition-colors"
          >
            Skip tour
          </button>
        </div>
        <p className="font-mono text-[14px] font-semibold text-text mb-1.5">{current.title}</p>
        <p className="text-[13px] text-text-dim leading-relaxed mb-4">{current.text}</p>
        <div className="flex justify-between items-center">
          <button
            onClick={onPrev}
            disabled={step === 0}
            className="font-mono text-[11px] px-3 py-1.5 border border-border rounded-[3px] text-text-dim hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>
          <div className="flex gap-1">
            {tourSteps.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${i === step ? "bg-amber" : "bg-border"}`}
              />
            ))}
          </div>
          <button
            onClick={onNext}
            className="font-mono text-[11px] px-3 py-1.5 bg-amber text-bg font-semibold rounded-[3px] hover:opacity-90 transition-opacity"
          >
            {step === tourSteps.length - 1 ? "Done" : "Next →"}
          </button>
        </div>
      </div>
    </>
  );
}
