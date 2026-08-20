import { NextRequest, NextResponse } from "next/server";
import { getChatReply, ChatMessage } from "@/lib/chat";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const uiMode: "beginner" | "expert" = body.uiMode === "expert" ? "expert" : "beginner";
    const chatMode: "demo" | "live" = body.chatMode === "live" ? "live" : "demo";
    const selectedTickers: string[] = Array.isArray(body.selectedTickers) ? body.selectedTickers : [];
    const history: ChatMessage[] = Array.isArray(body.history) ? body.history : [];

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
