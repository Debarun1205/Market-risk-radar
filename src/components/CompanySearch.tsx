"use client";

import { useMemo, useState } from "react";
import { companies, Company } from "@/lib/companies";

interface Props {
  selected: string[];
  onAdd: (ticker: string) => void;
  maxReached: boolean;
}

export default function CompanySearch({ selected, onAdd, maxReached }: Props) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo<Company[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return companies
      .filter(
        (c) =>
          !selected.includes(c.t) &&
          (c.t.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q) ||
            c.country.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [query, selected]);

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder={
          maxReached
            ? `Max ${6} selected — remove one to add another`
            : "Search any of the 190+ companies by name, ticker, or country…"
        }
        disabled={maxReached}
        className="w-full bg-panel-alt border border-border rounded-[3px] px-3.5 py-2.5 font-sans text-[13px] text-text placeholder:text-text-faint outline-none focus:border-cyan transition-colors disabled:opacity-50"
      />
      {focused && results.length > 0 && (
        <div className="absolute z-40 mt-1 w-full bg-[#0D1119] border border-border rounded-[3px] overflow-hidden shadow-lg max-h-64 overflow-y-auto">
          {results.map((c) => (
            <button
              key={c.t}
              onMouseDown={() => {
                onAdd(c.t);
                setQuery("");
              }}
              className="w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3 hover:bg-white/[0.04] transition-colors border-b border-border-soft last:border-b-0"
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-[12px] font-semibold text-text w-14 flex-shrink-0">
                  {c.t}
                </span>
                <span className="text-[12px] text-text-dim truncate">{c.name}</span>
              </span>
              <span className="font-mono text-[10.5px] text-text-faint flex-shrink-0">
                {c.country}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
