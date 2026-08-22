import { describe, it, expect } from "vitest";
import { companies, byTicker } from "../companies";
import { radarValues, buildRadarMap, radarFactors } from "../radar";

describe("radarValues", () => {
  it("returns exactly one score per radar factor", () => {
    const vals = radarValues(byTicker["AAPL"]);
    expect(vals.length).toBe(radarFactors.length);
  });

  it("stays within the clamped bounds [15, 95]", () => {
    companies.slice(0, 30).forEach((c) => {
      radarValues(c).forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(15);
        expect(v).toBeLessThanOrEqual(95);
      });
    });
  });

  it("is deterministic — same company returns the same scores every time", () => {
    const a = byTicker["TSLA"];
    expect(radarValues(a)).toEqual(radarValues(a));
  });

  it("gives different companies different profiles (not all identical)", () => {
    const a = radarValues(byTicker["AAPL"]);
    const b = radarValues(byTicker["XOM"]);
    expect(a).not.toEqual(b);
  });
});

describe("buildRadarMap", () => {
  it("includes an entry for every company passed in", () => {
    const sample = companies.slice(0, 10);
    const map = buildRadarMap(sample);
    sample.forEach((c) => expect(map[c.t]).toBeDefined());
  });
});
