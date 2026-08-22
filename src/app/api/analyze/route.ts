import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/llm";
import { checkRateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const rl = checkRateLimit(clientKeyFromRequest(req, "analyze"), 12, 60_000);
    const body = await req.json();
    const scenarioId: string = body.scenarioId ?? "sector-concentration";
    const selectedTickers: string[] = Array.isArray(body.selectedTickers)
      ? body.selectedTickers
      : [];

    if (!rl.allowed) {
      const fallback = await getAnalysis(scenarioId, selectedTickers, "demo");
      return NextResponse.json({
        ...fallback,
        mode: "live-fallback",
        note: `You're sending requests quickly — try again in ${rl.resetInSeconds}s.`,
      });
    }

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
