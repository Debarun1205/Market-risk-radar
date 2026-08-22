import { NextRequest, NextResponse } from "next/server";
import { getNews, demoArticles } from "@/lib/news";
import { checkRateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const rl = checkRateLimit(clientKeyFromRequest(req, "news"), 12, 60_000);
    const body = await req.json();
    const tickers: string[] = Array.isArray(body.tickers) ? body.tickers : [];

    if (!rl.allowed) {
      return NextResponse.json({
        mode: "live-fallback",
        articles: demoArticles(tickers),
        note: `You're sending requests quickly — try again in ${rl.resetInSeconds}s.`,
      });
    }

    const mode: "demo" | "live" = body.mode === "live" ? "live" : "demo";
    const result = await getNews(tickers, mode);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        mode: "live-fallback",
        articles: [],
        note: "News is temporarily unavailable — please try again.",
      },
      { status: 200 }
    );
  }
}
