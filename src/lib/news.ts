import { byTicker } from "./companies";

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  tickers: string[];
  sentiment: "positive" | "negative" | "neutral";
  imageUrl?: string;
  description?: string;
}

export interface NewsResult {
  mode: "demo" | "live" | "live-fallback";
  articles: NewsArticle[];
  note?: string;
}

/**
 * Generic, clearly-labeled placeholder items — deliberately templated rather
 * than specific fabricated claims, so nothing here could be mistaken for a
 * real headline. Every card built from this also carries a "Demo" tag in
 * the UI itself, not just here.
 */
export function demoArticles(tickers: string[]): NewsArticle[] {
  const pool = tickers.length ? tickers : ["AAPL", "JPM", "TSLA", "NVO"];
  const templates: Array<(name: string) => { title: string; description: string; sentiment: NewsArticle["sentiment"] }> = [
    (n) => ({
      title: `Analysts weigh in ahead of ${n}'s next earnings report`,
      description: `A look at what the market is expecting from ${n} heading into its next quarterly update, and which numbers investors are watching most closely.`,
      sentiment: "neutral",
    }),
    (n) => ({
      title: `${n} shares move on broader sector trends`,
      description: `Sector-wide movement has been shaping how ${n} trades this week, more than any single company-specific announcement.`,
      sentiment: "neutral",
    }),
    (n) => ({
      title: `What recent guidance means for ${n} investors`,
      description: `Recent commentary from company leadership has shifted how analysts are framing ${n}'s outlook for the coming quarters.`,
      sentiment: "positive",
    }),
    (n) => ({
      title: `${n} faces questions on margins amid sector headwinds`,
      description: `Rising costs across the industry have put pressure on margins, and ${n} is no exception according to recent coverage.`,
      sentiment: "negative",
    }),
    (n) => ({
      title: `A quick primer on ${n}'s current market position`,
      description: `A brief overview of where ${n} stands relative to peers right now, for anyone getting up to speed.`,
      sentiment: "neutral",
    }),
  ];

  return pool.slice(0, 6).map((t, i) => {
    const company = byTicker[t];
    const name = company?.name ?? t;
    const template = templates[i % templates.length](name);
    return {
      title: template.title,
      description: template.description,
      url: "#",
      source: "Sample source",
      publishedAt: new Date(Date.now() - i * 3 * 60 * 60 * 1000).toISOString(),
      tickers: [t],
      sentiment: template.sentiment,
    };
  });
}

function sentimentFromScore(score: number | null | undefined): NewsArticle["sentiment"] {
  if (score == null) return "neutral";
  if (score > 0.15) return "positive";
  if (score < -0.15) return "negative";
  return "neutral";
}

async function fetchMarketaux(tickers: string[], apiKey: string): Promise<NewsArticle[]> {
  const symbols = tickers.slice(0, 6).join(",");
  const url = `https://api.marketaux.com/v1/news/all?symbols=${encodeURIComponent(
    symbols
  )}&filter_entities=true&language=en&limit=8&api_token=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Marketaux responded ${res.status}: ${errText}`);
  }
  const data = await res.json();
  const items = Array.isArray(data?.data) ? data.data : [];
  if (items.length === 0) throw new Error("Marketaux returned no articles");

  return items.map((item: any) => {
    const matchedTickers: string[] = Array.isArray(item.entities)
      ? item.entities.map((e: any) => e.symbol).filter((s: string) => tickers.includes(s))
      : [];
    const avgSentiment =
      Array.isArray(item.entities) && item.entities.length
        ? item.entities.reduce((sum: number, e: any) => sum + (e.sentiment_score ?? 0), 0) /
          item.entities.length
        : null;

    return {
      title: item.title as string,
      description: (item.description || item.snippet) as string | undefined,
      url: item.url as string,
      source: (item.source as string) ?? "Unknown source",
      publishedAt: (item.published_at as string) ?? new Date().toISOString(),
      tickers: matchedTickers.length ? matchedTickers : tickers.slice(0, 1),
      sentiment: sentimentFromScore(avgSentiment),
      imageUrl: item.image_url as string | undefined,
    };
  });
}

/**
 * Always resolves, never throws — same contract as getAnalysis() in llm.ts.
 * Demo mode never touches the network. Live mode tries Marketaux, then
 * falls back to demo content with an explanatory note.
 */
export async function getNews(tickers: string[], mode: "demo" | "live"): Promise<NewsResult> {
  if (mode === "demo") {
    return { mode: "demo", articles: demoArticles(tickers) };
  }

  const apiKey = process.env.NEWS_API_KEY;
  if (apiKey) {
    try {
      const articles = await fetchMarketaux(tickers, apiKey);
      return { mode: "live", articles };
    } catch (err) {
      console.error("Marketaux call failed:", err);
    }
  }

  return {
    mode: "live-fallback",
    articles: demoArticles(tickers),
    note: apiKey
      ? "Live call failed — showing sample headlines instead."
      : "No API key configured — showing sample headlines instead.",
  };
}
