"use client";

import { useEffect, useRef, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { byTicker, MAX_SELECTION } from "@/lib/companies";
import { presets } from "@/lib/presets";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  actions?: string[];
}

interface ToolCall {
  name: string;
  args: Record<string, unknown>;
}

interface Props {
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  setGlossaryOpen: Dispatch<SetStateAction<boolean>>;
}

const GREETING: ChatMsg = {
  role: "assistant",
  content:
    "Hi! I can explain anything on this dashboard, or actually change what's being compared for you — try \"compare big tech companies\" or \"what does this radar shape mean?\"",
};

export default function ChatWidget({ selected, setSelected, setGlossaryOpen }: Props) {
  const [open, setOpen] = useState(false);
  const [uiMode, setUiMode] = useState<"beginner" | "expert">("beginner");
  const [chatMode, setChatMode] = useState<"demo" | "live">("live");
  const [messages, setMessages] = useState<ChatMsg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function executeToolCall(tc: ToolCall): string | null {
    if (tc.name === "update_comparison") {
      const action = tc.args.action as string;
      const tickers = (Array.isArray(tc.args.tickers) ? (tc.args.tickers as string[]) : []).filter(
        (t) => byTicker[t]
      );
      if (tickers.length === 0) return null;
      setSelected((prev) => {
        if (action === "replace") return tickers.slice(0, MAX_SELECTION);
        if (action === "remove") return prev.filter((t) => !tickers.includes(t));
        const next = [...prev];
        tickers.forEach((t) => {
          if (!next.includes(t) && next.length < MAX_SELECTION) next.push(t);
        });
        return next;
      });
      const verb = action === "remove" ? "Removed" : action === "replace" ? "Set comparison to" : "Added";
      return `${verb} ${tickers.join(", ")}`;
    }
    if (tc.name === "apply_preset") {
      const name = String(tc.args.name ?? "");
      const preset = presets.find((p) => p.name.toLowerCase() === name.toLowerCase());
      if (!preset) return null;
      setSelected(preset.tickers.slice(0, MAX_SELECTION));
      return `Loaded "${preset.name}" (${preset.tickers.join(", ")})`;
    }
    if (tc.name === "open_glossary") {
      setGlossaryOpen(true);
      return "Opened the glossary panel";
    }
    return null;
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const nextHistory = [...messages, { role: "user" as const, content: text }];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uiMode,
          chatMode,
          selectedTickers: selected,
          history: nextHistory.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const toolCalls: ToolCall[] = Array.isArray(data.toolCalls) ? data.toolCalls : [];
      const actionDescriptions = toolCalls
        .map((tc) => executeToolCall(tc))
        .filter((d): d is string => Boolean(d));

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content || (actionDescriptions.length ? "" : "I'm not sure how to help with that."),
          actions: actionDescriptions.length ? actionDescriptions : undefined,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong reaching the server — try again?" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat assistant"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-amber text-bg shadow-2xl flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        <span className="font-mono text-[22px] leading-none">{open ? "×" : "💬"}</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[min(380px,90vw)] h-[min(560px,70vh)] bg-panel border border-border rounded-[6px] shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border-soft flex items-center justify-between gap-2 flex-wrap">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-amber">Assistant</p>
              <p className="font-mono text-[13px] font-semibold">Ask about the dashboard</p>
            </div>
            <div className="flex gap-1.5">
              <div className="flex border border-border rounded-[2px] overflow-hidden font-mono text-[9.5px]">
                {(["beginner", "expert"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setUiMode(m)}
                    className={`px-2 py-1 uppercase tracking-wide transition-colors ${
                      uiMode === m ? "bg-cyan text-bg font-semibold" : "text-text-dim hover:text-text"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div className="flex border border-border rounded-[2px] overflow-hidden font-mono text-[9.5px]">
                {(["demo", "live"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setChatMode(m)}
                    className={`px-2 py-1 uppercase tracking-wide transition-colors ${
                      chatMode === m ? "bg-amber text-bg font-semibold" : "text-text-dim hover:text-text"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                {m.content && (
                  <div
                    className={`max-w-[85%] text-[13px] leading-relaxed rounded-[6px] px-3 py-2 ${
                      m.role === "user"
                        ? "bg-cyan/15 text-text border border-cyan/30"
                        : "bg-panel-alt text-text border border-border"
                    }`}
                  >
                    {m.content}
                  </div>
                )}
                {m.actions?.map((a, ai) => (
                  <div
                    key={ai}
                    className="mt-1 font-mono text-[10.5px] text-green flex items-center gap-1.5 border border-green/30 bg-green/10 rounded-[3px] px-2 py-1"
                  >
                    <span>✓</span> {a}
                  </div>
                ))}
              </div>
            ))}
            {loading && (
              <div className="flex items-start">
                <div className="bg-panel-alt border border-border rounded-[6px] px-3 py-2.5 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-text-faint animate-pulse"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border-soft p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask a question…"
              className="flex-1 bg-panel-alt border border-border rounded-[3px] px-3 py-2 text-[13px] text-text placeholder:text-text-faint outline-none focus:border-cyan transition-colors"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="font-mono text-[11px] px-3 py-2 bg-amber text-bg font-semibold rounded-[3px] hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
