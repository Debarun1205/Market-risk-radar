import { NextRequest, NextResponse } from "next/server";
import { getChatReply, ChatMessage } from "@/lib/chat";
import { checkRateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const rl = checkRateLimit(clientKeyFromRequest(req, "chat"), 8, 60_000);
    const body = await req.json();
    const uiMode: "beginner" | "expert" = body.uiMode === "expert" ? "expert" : "beginner";
    const selectedTickers: string[] = Array.isArray(body.selectedTickers) ? body.selectedTickers : [];
    const history: ChatMessage[] = Array.isArray(body.history) ? body.history : [];

    if (!rl.allowed) {
      const fallback = await getChatReply(uiMode, "demo", selectedTickers, history);
      return NextResponse.json({
        ...fallback,
        mode: "live-fallback",
        note: `You're sending messages quickly — try again in ${rl.resetInSeconds}s.`,
      });
    }

    const chatMode: "demo" | "live" = body.chatMode === "live" ? "live" : "demo";
    const result = await getChatReply(uiMode, chatMode, selectedTickers, history);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        mode: "live-fallback",
        content: "Something went wrong on my end — mind trying that again?",
        toolCalls: [],
        note: "Request could not be processed.",
      },
      { status: 200 }
    );
  }
}
