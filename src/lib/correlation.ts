import { Company, regionOf } from "./companies";

/**
 * Deterministic hash + PRNG so the "random" correlation noise is stable
 * across server render, client render, and every reload — swap this file
 * out for a real returns-based calculation once you wire up real price data.
 */
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

export function correlation(a: Company, b: Company): number {
  if (a.t === b.t) return 1;
  let base = 0.05;
  if (a.sector === b.sector) base = 0.55;
  else if (regionOf(a.country) === regionOf(b.country)) base = 0.22;

  const rng = mulberry32(hashStr(`${a.t}-${b.t}`));
  const noise = (rng() - 0.5) * 0.3; // ±0.15
  const v = Math.max(-0.3, Math.min(0.95, base + noise));
  return Math.round(v * 100) / 100;
}

export function buildCorrelationMatrix(companies: Company[]): number[][] {
  return companies.map((a) => companies.map((b) => correlation(a, b)));
}

export interface CorrelationStats {
  avg: number;
  maxPair: [string, string];
  maxValue: number;
  minPair: [string, string];
  minValue: number;
}

export function correlationStats(companies: Company[], matrix: number[][]): CorrelationStats {
  let sum = 0,
    count = 0,
    max = -2,
    min = 2;
  let maxPair: [string, string] = ["", ""];
  let minPair: [string, string] = ["", ""];

  for (let i = 0; i < companies.length; i++) {
    for (let j = i + 1; j < companies.length; j++) {
      const v = matrix[i][j];
      sum += v;
      count++;
      if (v > max) {
        max = v;
        maxPair = [companies[i].t, companies[j].t];
      }
      if (v < min) {
        min = v;
        minPair = [companies[i].t, companies[j].t];
      }
    }
  }

  return { avg: sum / count, maxPair, maxValue: max, minPair, minValue: min };
}
