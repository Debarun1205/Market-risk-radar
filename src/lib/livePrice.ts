import { Company } from "./companies";

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A plausible, stable starting price per ticker — synthetic, not a real quote. */
export function basePrice(t: string): number {
  const rng = mulberry32(hashStr("price-" + t));
  return Math.round((20 + rng() * 480) * 100) / 100;
}

export interface PriceEngine {
  next(): number;
}

/**
 * A small stateful random walk. Each ticker gets its own engine instance so
 * switching the spotlight company and switching back resumes from where
 * that ticker's walk left off, rather than resetting.
 */
export function createPriceEngine(ticker: string): PriceEngine {
  let price = basePrice(ticker);
  const rng = mulberry32(hashStr("walk-" + ticker) ^ Date.now());
  return {
    next() {
      const pctMove = (rng() - 0.5) * 0.012; // ~±0.6% per tick
      price = Math.max(1, price * (1 + pctMove));
      return Math.round(price * 100) / 100;
    },
  };
}

export function seedInitialSeries(ticker: string, points: number): number[] {
  const rng = mulberry32(hashStr("seed-" + ticker));
  let price = basePrice(ticker);
  const series: number[] = [];
  for (let i = 0; i < points; i++) {
    const pctMove = (rng() - 0.5) * 0.012;
    price = Math.max(1, price * (1 + pctMove));
    series.push(Math.round(price * 100) / 100);
  }
  return series;
}

export function tapeSample(companies: Company[], count: number): Company[] {
  return companies.slice(0, count);
}
