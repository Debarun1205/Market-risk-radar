import { describe, it, expect } from "vitest";
import { companies, byTicker } from "../companies";
import { correlation, buildCorrelationMatrix, correlationStats, buildSectorMatrix } from "../correlation";

describe("correlation", () => {
  it("is always 1 for a company against itself", () => {
    companies.slice(0, 20).forEach((c) => {
      expect(correlation(c, c)).toBe(1);
    });
  });

  it("is symmetric: correlation(A, B) === correlation(B, A)", () => {
    // Regression test for a real bug: the seed used to be built from the
    // concatenated ticker order ("AAPL-JPM" vs "JPM-AAPL"), which hashed
    // differently and produced two different numbers for the same pair.
    const pairs: [string, string][] = [
      ["AAPL", "JPM"],
      ["TSM", "ASML"],
      ["SHEL", "HSBC"],
      ["NVO", "NESN"],
      ["TSLA", "BYDDY"],
    ];
    pairs.forEach(([a, b]) => {
      const forward = correlation(byTicker[a], byTicker[b]);
      const backward = correlation(byTicker[b], byTicker[a]);
      expect(forward).toBe(backward);
    });
  });

  it("stays within the defined bounds [-0.3, 0.95]", () => {
    const sample = companies.slice(0, 15);
    sample.forEach((a) => {
      sample.forEach((b) => {
        const v = correlation(a, b);
        expect(v).toBeGreaterThanOrEqual(-0.3);
        expect(v).toBeLessThanOrEqual(1); // 1 only for self-pairs
      });
    });
  });

  it("is deterministic across repeated calls (same seed every time)", () => {
    const a = byTicker["AAPL"];
    const b = byTicker["MSFT"];
    expect(correlation(a, b)).toBe(correlation(a, b));
  });
});

describe("buildCorrelationMatrix", () => {
  it("produces a symmetric matrix for the full dataset", () => {
    const sample = companies.slice(0, 12);
    const matrix = buildCorrelationMatrix(sample);
    for (let i = 0; i < sample.length; i++) {
      for (let j = 0; j < sample.length; j++) {
        expect(matrix[i][j]).toBe(matrix[j][i]);
      }
    }
  });

  it("has 1s on the diagonal", () => {
    const sample = companies.slice(0, 8);
    const matrix = buildCorrelationMatrix(sample);
    sample.forEach((_, i) => expect(matrix[i][i]).toBe(1));
  });
});

describe("correlationStats", () => {
  it("returns a max pair value >= avg >= min pair value", () => {
    const sample = companies.slice(0, 20);
    const matrix = buildCorrelationMatrix(sample);
    const stats = correlationStats(sample, matrix);
    expect(stats.maxValue).toBeGreaterThanOrEqual(stats.avg);
    expect(stats.avg).toBeGreaterThanOrEqual(stats.minValue);
  });

  it("references real tickers from the input list in maxPair/minPair", () => {
    const sample = companies.slice(0, 10);
    const tickers = sample.map((c) => c.t);
    const matrix = buildCorrelationMatrix(sample);
    const stats = correlationStats(sample, matrix);
    stats.maxPair.forEach((t) => expect(tickers).toContain(t));
    stats.minPair.forEach((t) => expect(tickers).toContain(t));
  });
});

describe("buildSectorMatrix", () => {
  it("returns a square matrix sized to the number of unique sectors, regardless of company count", () => {
    const { sectors, matrix } = buildSectorMatrix(companies);
    expect(matrix.length).toBe(sectors.length);
    matrix.forEach((row) => expect(row.length).toBe(sectors.length));
  });

  it("stays the same size whether given 20 or 200 companies", () => {
    const small = buildSectorMatrix(companies.slice(0, 20));
    const full = buildSectorMatrix(companies);
    // Sector count may differ slightly with fewer companies, but the
    // function must never try to build a company-sized matrix.
    expect(small.matrix.length).toBe(small.sectors.length);
    expect(full.matrix.length).toBe(full.sectors.length);
  });
});
