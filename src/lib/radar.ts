import { Company, Sector } from "./companies";

export const radarFactors = [
  "Profitability",
  "Growth",
  "Liquidity",
  "Leverage",
  "Valuation",
  "Momentum",
] as const;

const sectorBaseline: Record<Sector, number[]> = {
  Tech: [78, 72, 58, 55, 42, 75],
  Financials: [65, 45, 68, 58, 72, 52],
  Auto: [55, 80, 50, 48, 38, 70],
  Energy: [72, 35, 62, 60, 85, 55],
  Healthcare: [70, 50, 60, 62, 68, 48],
  Consumer: [68, 40, 65, 66, 60, 45],
  Industrials: [60, 42, 55, 52, 58, 50],
  Telecom: [58, 30, 60, 45, 70, 35],
  Retail: [55, 55, 50, 58, 55, 60],
  Materials: [62, 38, 55, 50, 66, 42],
};

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

export function radarValues(c: Company): number[] {
  const base = sectorBaseline[c.sector];
  const rng = mulberry32(hashStr(`r-${c.t}`));
  return base.map((v) => Math.max(15, Math.min(95, v + Math.round((rng() - 0.5) * 16))));
}

export function buildRadarMap(companies: Company[]): Record<string, number[]> {
  return Object.fromEntries(companies.map((c) => [c.t, radarValues(c)]));
}
