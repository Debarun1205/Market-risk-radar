"use client";

import { useState } from "react";

interface Props {
  text: string;
}

export default function GlossaryTooltip({ text }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-label="What does this mean?"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="w-4 h-4 rounded-full border border-text-faint text-text-faint text-[10px] leading-none flex items-center justify-center font-mono hover:border-cyan hover:text-cyan transition-colors"
      >
        ?
      </button>
      {open && (
        <span className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)] z-50 w-56 bg-[#050608] border border-border text-text font-sans text-[12px] leading-relaxed px-3 py-2.5 rounded-[4px] shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}
