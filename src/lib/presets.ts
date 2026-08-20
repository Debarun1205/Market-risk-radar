export interface Preset {
  name: string;
  description: string;
  tickers: string[];
}

export const presets: Preset[] = [
  {
    name: "Big Tech",
    description: "The largest US technology companies",
    tickers: ["AAPL", "MSFT", "NVDA", "GOOGL"],
  },
  {
    name: "Oil & Gas Giants",
    description: "Major global energy producers",
    tickers: ["XOM", "SHEL", "TTE", "ARAMCO"],
  },
  {
    name: "Emerging Markets Tech",
    description: "Leading tech companies outside the US and Europe",
    tickers: ["TSM", "BABA", "SSNLF", "MELI"],
  },
  {
    name: "Global Banks",
    description: "Major banks across different regions",
    tickers: ["JPM", "HSBC", "MUFG", "ITUB"],
  },
  {
    name: "EV & Auto",
    description: "Electric vehicle makers and traditional automakers",
    tickers: ["TSLA", "BYDDY", "TM", "VOW3"],
  },
  {
    name: "Healthcare Leaders",
    description: "Pharma and healthcare companies worldwide",
    tickers: ["LLY", "NVO", "ROG", "UNH"],
  },
];
