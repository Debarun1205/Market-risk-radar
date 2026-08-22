"use client";

import { useEffect, useState } from "react";
import { byTicker, sectorColor } from "@/lib/companies";
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

/** Stylized stand-in for a photo — used whenever an article has no real image,
 *  which is always true in Demo mode. Never dresses up a fabricated headline
 *  as a real photograph. */
function ArtCard({ article, className }: { article: NewsArticle; className: string }) {
  const company = byTicker[article.tickers[0]];
  const color = company ? sectorColor[company.sector] : "#4FD1C5";

  if (article.imageUrl) {
    return (
      <img
        src={article.imageUrl}
        alt=""
        className={`${className} object-cover`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center relative overflow-hidden`}
      style={{ background: `linear-gradient(135deg, ${color}40 0%, #10141C 75%)` }}
    >
      <span
        className="font-mono font-bold select-none"
        style={{ color: `${color}55`, fontSize: "clamp(28px, 15%, 64px)" }}
      >
        {article.tickers[0]}
      </span>
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 30% 20%, ${color}25, transparent 60%)` }}
      />
    </div>
  );
}

function MetaRow({ article, mode }: { article: NewsArticle; mode: "demo" | "live" | "live-fallback" }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {mode !== "live" && (
        <span className="font-mono text-[9px] uppercase tracking-wider text-amber border border-amber/40 rounded-[2px] px-1.5 py-0.5">
          Demo
        </span>
      )}
      {article.tickers.map((t: string) => (
        <span key={t} className="font-mono text-[10px] text-text-dim">
          {flagFor(byTicker[t]?.country ?? "")} {t}
        </span>
      ))}
    </div>
  );
}

export default function NewsPanel({ tickers }: Props) {
  const [mode, setMode] = useState<Mode>("live");
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-64 rounded-[4px] bg-[linear-gradient(90deg,var(--border)_25%,var(--border-soft)_50%,var(--border)_75%)] bg-[length:200%_100%] animate-[shimmer_1.1s_linear_infinite]" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-[3px] bg-[linear-gradient(90deg,var(--border)_25%,var(--border-soft)_50%,var(--border)_75%)] bg-[length:200%_100%] animate-[shimmer_1.1s_linear_infinite]" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {result.mode !== "demo" && result.note && (
            <div className="font-mono text-[10.5px] text-text-faint mb-3 flex items-center gap-1.5">
              <span className="w-[5px] h-[5px] rounded-full bg-cyan" />
              {result.note}
            </div>
          )}

          {result.articles.length === 0 ? (
            <p className="font-mono text-[11.5px] text-text-faint py-4">No headlines available right now.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Featured story */}
              {(() => {
                const a = result.articles[0];
                return (
                  <a
                    href={a.url}
                    target={a.url === "#" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (a.url === "#") e.preventDefault();
                    }}
                    className="lg:col-span-2 group block bg-panel-alt border border-border rounded-[4px] overflow-hidden hover:border-text-faint transition-colors"
                  >
                    <div className="overflow-hidden">
                      <ArtCard
                        article={a}
                        className="w-full h-56 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-2">
                        <MetaRow article={a} mode={result.mode} />
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="mt-2">{sentimentDot(a.sentiment)}</span>
                        <h3 className="text-[18px] leading-snug text-text font-semibold">{a.title}</h3>
                      </div>
                      {a.description && (
                        <p className="text-[13px] text-text-dim leading-relaxed mt-2">{a.description}</p>
                      )}
                      <div className="font-mono text-[10.5px] text-text-faint mt-3">
                        {a.source} · {timeAgo(a.publishedAt)}
                      </div>
                    </div>
                  </a>
                );
              })()}

              {/* Secondary stories */}
              <div className="flex flex-col gap-3">
                {result.articles.slice(1, 6).map((a, i) => (
                  <a
                    key={i}
                    href={a.url}
                    target={a.url === "#" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (a.url === "#") e.preventDefault();
                    }}
                    className="group flex items-start gap-3 bg-panel-alt border border-border rounded-[3px] p-2.5 hover:border-text-faint transition-colors"
                  >
                    <div className="overflow-hidden rounded-[2px] flex-shrink-0">
                      <ArtCard
                        article={a}
                        className="w-16 h-16 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="mb-1">
                        <MetaRow article={a} mode={result.mode} />
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="mt-1.5">{sentimentDot(a.sentiment)}</span>
                        <p className="text-[12.5px] text-text leading-snug line-clamp-2">{a.title}</p>
                      </div>
                      <div className="font-mono text-[10px] text-text-faint mt-1">
                        {a.source} · {timeAgo(a.publishedAt)}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
