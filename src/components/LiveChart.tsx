"use client";

import { useEffect, useRef, useState } from "react";
import { LineChart, Line, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { byTicker } from "@/lib/companies";
import { createPriceEngine, seedInitialSeries, PriceEngine } from "@/lib/livePrice";

interface Props {
  ticker: string;
}

const WINDOW = 40;
const TICK_MS = 1500;

export default function LiveChart({ ticker }: Props) {
  const [series, setSeries] = useState<{ i: number; price: number }[]>([]);
  const engineRef = useRef<Record<string, PriceEngine>>({});
  const counterRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!engineRef.current[ticker]) {
      engineRef.current[ticker] = createPriceEngine(ticker);
      counterRef.current[ticker] = 0;
      const seed = seedInitialSeries(ticker, WINDOW);
      setSeries(seed.map((price, i) => ({ i, price })));
      counterRef.current[ticker] = WINDOW;
    } else {
      // Ticker seen before this session — rebuild its visible window from
      // a fresh seed so switching back and forth doesn't require storing
      // full history per ticker; the engine itself keeps the "current" price.
      const seed = seedInitialSeries(ticker, WINDOW);
      setSeries(seed.map((price, i) => ({ i, price })));
    }

    const interval = setInterval(() => {
      const engine = engineRef.current[ticker];
      const next = engine.next();
      counterRef.current[ticker] = (counterRef.current[ticker] ?? WINDOW) + 1;
      setSeries((prev) => {
        const nextSeries = [...prev.slice(1), { i: counterRef.current[ticker], price: next }];
        return nextSeries;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [ticker]);

  const company = byTicker[ticker];
  const last = series[series.length - 1]?.price;
  const first = series[0]?.price;
  const delta = last != null && first != null ? last - first : 0;
  const pct = first ? (delta / first) * 100 : 0;
  const up = delta >= 0;

  if (!company) return null;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
        <div className="flex items-center gap-2.5">
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose" />
          </span>
          <span className="font-mono text-[11px] tracking-wider uppercase text-text-dim">
            Live · {company.t} · {company.name}
          </span>
        </div>
        <div className="font-mono text-[13px]">
          <span className="text-text font-semibold">${last?.toFixed(2)}</span>{" "}
          <span className={up ? "text-green" : "text-rose"}>
            {up ? "▲" : "▼"} {Math.abs(pct).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
            <YAxis domain={["auto", "auto"]} hide />
            <Tooltip
              contentStyle={{
                background: "#050608",
                border: "1px solid #232838",
                borderRadius: 3,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
              }}
              labelFormatter={() => ""}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={up ? "#59C97A" : "#E0665A"}
              strokeWidth={1.6}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="font-mono text-[10px] text-text-faint mt-2">
        Simulated data, updates every 1.5s for demo purposes — not a real market feed.
      </p>
    </div>
  );
}
