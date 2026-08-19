import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/llm";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const scenarioId: string = body.scenarioId ?? "sector-concentration";
    const selectedTickers: string[] = Array.isArray(body.selectedTickers)
      ? body.selectedTickers
      : [];
    const mode: "demo" | "live" = body.mode === "live" ? "live" : "demo";

    const result = await getAnalysis(scenarioId, selectedTickers, mode);
    return NextResponse.json(result);
  } catch {
    // Even a malformed request should degrade gracefully, not 500 the UI.
    return NextResponse.json(
      {
        mode: "live-fallback",
        text: "Analysis is temporarily unavailable — please try again.",
        note: "Request could not be processed.",
      },
      { status: 200 }
    );
  }
}
