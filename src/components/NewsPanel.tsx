"use client";

import { useEffect, useState } from "react";
import { byTicker } from "@/lib/companies";
import { flagFor } from "@/lib/flags";
import { NewsArticle } from "@/lib/news";

interface Props {
  tickers: string[];
}

type Mode = "demo" | "live";
type ResultState =
  | { status: "loading" }
  | { status: "done"; mode: "demo" | "live" | "live-fallback"; articles: NewsArticle[]; note?: string };

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.max(0, Math.round(diffMs / (1000 * 60 * 60)));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function sentimentDot(s: NewsArticle["sentiment"]) {
  const color = s === "positive" ? "bg-green" : s === "negative" ? "bg-rose" : "bg-text-faint";
  const label = s === "positive" ? "Positive tone" : s === "negative" ? "Negative tone" : "Neutral tone";
  return <span className={`w-1.5 h-1.5 rounded-full ${color} flex-shrink-0`} title={label} />;
}

export default function NewsPanel({ tickers }: Props) {
  const [mode, setMode] = useState<Mode>("demo");
  const [result, setResult] = useState<ResultState>({ status: "loading" });

  const effectiveTickers = tickers.length ? tickers : ["AAPL", "JPM", "TSLA", "NVO"];

  useEffect(() => {
    let cancelled = false;
    setResult({ status: "loading" });

    const minDelay = new Promise((r) => setTimeout(r, mode === "demo" ? 400 : 700));

    Promise.all([
      fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickers: effectiveTickers, mode }),
      }).then((r) => r.json()),
      minDelay,
    ])
      .then(([data]) => {
        if (cancelled) return;
        setResult({ status: "done", mode: data.mode, articles: data.articles, note: data.note });
      })
      .catch(() => {
        if (cancelled) return;
        setResult({ status: "done", mode: "live-fallback", articles: [], note: "Request failed." });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, JSON.stringify(effectiveTickers)]);

  return (
    <div>
      <div className="flex justify-between items-center gap-3 flex-wrap mb-4">
        <p className="text-text-dim text-[12.5px] leading-relaxed max-w-[460px]">
          Headlines tagged to whichever companies you've selected above{" "}
          {tickers.length === 0 && "(showing a default set until you pick some)"}.
        </p>
        <div className="flex border border-border rounded-[2px] overflow-hidden font-mono text-[11px]">
          {(["demo", "live"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 uppercase tracking-wide transition-colors ${
                mode === m ? "bg-amber text-bg font-semibold" : "text-text-dim hover:text-text"
              }`}
            >
              {m} mode
            </button>
          ))}
        </div>
      </div>

      {result.status === "loading" ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-[3px] bg-[linear-gradient(90deg,var(--border)_25%,var(--border-soft)_50%,var(--border)_75%)] bg-[length:200%_100%] animate-[shimmer_1.1s_linear_infinite]" />
          ))}
        </div>
      ) : (
        <>
          {result.mode !== "demo" && result.note && (
            <div className="font-mono text-[10.5px] text-text-faint mb-3 flex items-center gap-1.5">
              <span className="w-[5px] h-[5px] rounded-full bg-cyan" />
              {result.note}
            </div>
          )}
          <div className="flex flex-col gap-2">
            {result.articles.length === 0 ? (
              <p className="font-mono text-[11.5px] text-text-faint py-4">No headlines available right now.</p>
            ) : (
              result.articles.map((a, i) => {
                const company = byTicker[a.tickers[0]];
                return (
                  <a
                    key={i}
                    href={a.url}
                    target={a.url === "#" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className={`flex items-start gap-3 bg-panel-alt border border-border rounded-[3px] px-3.5 py-3 transition-colors ${
                      a.url === "#" ? "cursor-default" : "hover:border-text-faint"
                    }`}
                    onClick={(e) => {
                      if (a.url === "#") e.preventDefault();
                    }}
                  >
                    <span className="mt-1.5">{sentimentDot(a.sentiment)}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        {result.mode !== "live" && (
                          <span className="font-mono text-[9px] uppercase tracking-wider text-amber border border-amber/40 rounded-[2px] px-1.5 py-0.5">
                            Demo
                          </span>
                        )}
                        {a.tickers.map((t) => (
                          <span key={t} className="font-mono text-[10px] text-text-dim">
                            {company && flagFor(byTicker[t]?.country ?? "")} {t}
                          </span>
                        ))}
                      </div>
                      <div className="text-[13px] text-text leading-snug">{a.title}</div>
                      <div className="font-mono text-[10.5px] text-text-faint mt-1">
                        {a.source} · {timeAgo(a.publishedAt)}
                      </div>
                    </div>
                  </a>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
