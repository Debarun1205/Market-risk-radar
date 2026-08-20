import { NextRequest, NextResponse } from "next/server";
import { getNews } from "@/lib/news";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tickers: string[] = Array.isArray(body.tickers) ? body.tickers : [];
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
