"use client";

import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const badges = [
  "4 Research Publications",
  "BCG X · Goldman Sachs · JPMorgan Chase Job Sims",
  "Anthropic · IBM SkillsBuild Certified",
];

export default function AboutPanel({ open, onClose }: Props) {
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
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-[min(440px,92vw)] bg-panel border border-border rounded-[6px] shadow-2xl p-6"
          style={{ animation: "fade-up 300ms ease both" }}
        >
          <div className="flex justify-between items-start mb-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-amber">
              About this project
            </p>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-7 h-7 flex items-center justify-center text-text-dim hover:text-text font-mono text-[16px] transition-colors -mt-1 -mr-1"
            >
              ×
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-[20px] font-bold text-bg"
              style={{ background: "linear-gradient(135deg, #E8A33D, #4FD1C5)" }}
            >
              DB
            </div>
            <div>
              <p className="font-mono text-[17px] font-semibold text-text">Debarun Banerjee</p>
              <p className="text-[12.5px] text-text-dim leading-snug mt-0.5">
                B.Tech CSE (AI &amp; ML) · Narula Institute of Technology, Kolkata
              </p>
            </div>
          </div>

          <p className="text-[13px] text-text-dim leading-relaxed mb-4">
            I build AI-driven, real-world tools end to end — from data pipeline to deployed
            product — with a particular interest in systems that stay honest and usable even when
            a dependency fails, which is the design principle this dashboard is built around. This
            is one of several projects spanning fintech risk modeling, safety tech, and applied
            research.
          </p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {badges.map((b) => (
              <span
                key={b}
                className="font-mono text-[10px] text-text-dim border border-border rounded-[2px] px-2 py-1"
              >
                {b}
              </span>
            ))}
          </div>

          <div className="flex gap-2.5">
            <a
              href="https://debarun.base44.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center font-mono text-[11.5px] font-semibold bg-amber text-bg rounded-[3px] py-2.5 hover:opacity-90 transition-opacity"
            >
              View Portfolio ↗
            </a>
            <a
              href="https://www.linkedin.com/in/debarun-banerjee-b8524a37b"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center font-mono text-[11.5px] font-semibold border border-border text-text rounded-[3px] py-2.5 hover:border-cyan transition-colors"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
