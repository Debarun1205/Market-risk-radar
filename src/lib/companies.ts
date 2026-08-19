export type Sector =
  | "Tech"
  | "Financials"
  | "Auto"
  | "Energy"
  | "Healthcare"
  | "Consumer";

export type Region = "NA" | "Europe" | "Asia";

export interface Company {
  t: string; // ticker
  name: string;
  country: string;
  sector: Sector;
  lat: number;
  lon: number;
  cap: number; // market cap, $B — synthetic, for pin sizing only
}

export const companies: Company[] = [
  { t: "AAPL", name: "Apple", country: "USA", sector: "Tech", lat: 37.323, lon: -122.032, cap: 3200 },
  { t: "MSFT", name: "Microsoft", country: "USA", sector: "Tech", lat: 47.674, lon: -122.121, cap: 3100 },
  { t: "NVDA", name: "Nvidia", country: "USA", sector: "Tech", lat: 37.387, lon: -121.965, cap: 2900 },
  { t: "TSM", name: "TSMC", country: "Taiwan", sector: "Tech", lat: 24.807, lon: 120.968, cap: 900 },
  { t: "ASML", name: "ASML", country: "Netherlands", sector: "Tech", lat: 51.418, lon: 5.401, cap: 380 },
  { t: "SAP", name: "SAP", country: "Germany", sector: "Tech", lat: 49.293, lon: 8.642, cap: 260 },
  { t: "BABA", name: "Alibaba", country: "China", sector: "Tech", lat: 30.274, lon: 120.155, cap: 210 },
  { t: "JPM", name: "JPMorgan Chase", country: "USA", sector: "Financials", lat: 40.712, lon: -74.006, cap: 620 },
  { t: "HSBC", name: "HSBC", country: "UK", sector: "Financials", lat: 51.507, lon: -0.128, cap: 170 },
  { t: "TSLA", name: "Tesla", country: "USA", sector: "Auto", lat: 30.267, lon: -97.743, cap: 780 },
  { t: "TM", name: "Toyota", country: "Japan", sector: "Auto", lat: 35.082, lon: 137.156, cap: 260 },
  { t: "SHEL", name: "Shell", country: "UK", sector: "Energy", lat: 51.507, lon: -0.09, cap: 210 },
  { t: "NVO", name: "Novo Nordisk", country: "Denmark", sector: "Healthcare", lat: 55.731, lon: 12.451, cap: 350 },
  { t: "NESN", name: "Nestle", country: "Switzerland", sector: "Consumer", lat: 46.462, lon: 6.842, cap: 280 },
];

export const byTicker: Record<string, Company> = Object.fromEntries(
  companies.map((c) => [c.t, c])
);

export const sectorColor: Record<Sector, string> = {
  Tech: "#E8A33D",
  Financials: "#4FD1C5",
  Auto: "#5B8DEF",
  Energy: "#E0665A",
  Healthcare: "#9B8FE0",
  Consumer: "#59C97A",
};

export function regionOf(country: string): Region {
  if (country === "USA") return "NA";
  if (["Taiwan", "China", "Japan"].includes(country)) return "Asia";
  return "Europe";
}

export const DEFAULT_SELECTION = ["AAPL", "JPM", "TSLA", "NVO"];
export const MAX_SELECTION = 4;
