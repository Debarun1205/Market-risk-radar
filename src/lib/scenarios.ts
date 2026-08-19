export interface Scenario {
  id: string;
  tag: string;
  label: string;
  /** Pre-written text, shown in Demo Mode and as the Live Mode fallback. */
  text: string;
}

export const scenarios: Scenario[] = [
  {
    id: "sector-concentration",
    tag: "Correlation",
    label: "Sector concentration read",
    text: "Tech names cluster tightly: AAPL, MSFT and NVDA move together at well above 0.5 correlation despite being headquartered across different U.S. cities, and TSM and ASML extend that cluster globally through the shared semiconductor supply chain. SHEL and HSBC, both UK-based but different sectors, show weaker linkage — a reminder that shared geography matters less than shared sector for this basket.",
  },
  {
    id: "cross-border",
    tag: "Geography",
    label: "Cross-border diversification",
    text: "Grouping by region shows North American holdings correlate more with each other than with Asia or Europe. NVO (Denmark) and NESN (Switzerland) sit furthest from the U.S. tech cluster on the map and in the matrix alike — genuine geographic spread is doing real diversification work here, not just sector spread.",
  },
  {
    id: "radar-compare",
    tag: "Radar",
    label: "Compare selected companies",
    text: "Among the companies currently selected, the radar shows a useful spread: a high-growth, high-momentum profile against a more balanced, valuation-led one. Pairing a richly-priced growth name with a cheaper, steadier one is a classic way to smooth portfolio variance without sacrificing upside.",
  },
  {
    id: "concentration-vs-count",
    tag: "Risk",
    label: "Concentration vs. count",
    text: "Fourteen names sounds diversified, but average pairwise correlation across the full matrix is still moderate — because more than half the basket sits in just two sectors (Tech and Auto) and two regions (North America and Asia). Real diversification here comes disproportionately from the handful of European and Healthcare names.",
  },
];

export function getScenario(id: string): Scenario {
  return scenarios.find((s) => s.id === id) ?? scenarios[0];
}
