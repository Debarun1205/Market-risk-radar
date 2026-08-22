import { describe, it, expect } from "vitest";
import { companies, sectorColor, REGION_BY_COUNTRY } from "../companies";

describe("companies dataset", () => {
  it("has no duplicate tickers", () => {
    const tickers = companies.map((c) => c.t);
    expect(new Set(tickers).size).toBe(tickers.length);
  });

  it("has at least 150 companies", () => {
    expect(companies.length).toBeGreaterThanOrEqual(150);
  });

  it("assigns every company a sector that has a defined color", () => {
    companies.forEach((c) => {
      expect(sectorColor[c.sector]).toBeDefined();
    });
  });

  it("assigns every company's country an explicit region (no silent fallback)", () => {
    const missing = companies
      .map((c) => c.country)
      .filter((country, i, arr) => arr.indexOf(country) === i)
      .filter((country) => !(country in REGION_BY_COUNTRY));
    expect(missing).toEqual([]);
  });

  it("keeps market cap positive for every company", () => {
    companies.forEach((c) => {
      expect(c.cap).toBeGreaterThan(0);
    });
  });

  it("keeps latitude/longitude within valid world bounds", () => {
    companies.forEach((c) => {
      expect(c.lat).toBeGreaterThanOrEqual(-90);
      expect(c.lat).toBeLessThanOrEqual(90);
      expect(c.lon).toBeGreaterThanOrEqual(-180);
      expect(c.lon).toBeLessThanOrEqual(180);
    });
  });
});
