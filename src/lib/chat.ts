import { CHAT_TOOLS, tickerDirectory } from "./chatTools";
import { buildContextSummary } from "./chatContext";

export interface ChatToolCall {
  name: string;
  args: Record<string, unknown>;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResult {
  mode: "demo" | "live" | "live-fallback";
  content: string;
  toolCalls: ChatToolCall[];
  note?: string;
}

function systemPrompt(uiMode: "beginner" | "expert", selectedTickers: string[]): string {
  const tone =
    uiMode === "beginner"
      ? "You are a friendly, patient guide inside a financial dashboard called Market Risk Radar, helping someone new to investing understand what they're looking at. Use plain language, short sentences, and concrete comparisons. Avoid jargon unless you explain it immediately. Keep replies under ~120 words unless asked for more."
      : "You are a concise research co-pilot inside a financial dashboard called Market Risk Radar, for an experienced user. Be direct and specific, reference the real numbers given below, and proactively suggest actions using your tools rather than just describing what's possible. Keep prose tight.";

  return [
    tone,
    "This dashboard uses synthetic, illustrative financial data for demonstration — never claim any number is real market data, and never give personalized investment advice; keep everything educational.",
    "You can take real actions on the dashboard using the tools provided: update_comparison (add/remove/replace which companies are being compared, max 6), apply_preset (load a named preset bundle), and open_glossary. Use them when it genuinely helps rather than just telling the user to click something themselves.",
    `Full company directory (ticker=name): ${tickerDirectory()}`,
    buildContextSummary(selectedTickers),
    "If asked something outside investing/this dashboard, answer briefly and steer back.",
  ].join("\n\n");
}

function toGroqMessages(uiMode: "beginner" | "expert", selectedTickers: string[], history: ChatMessage[]) {
  return [
    { role: "system", content: systemPrompt(uiMode, selectedTickers) },
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ];
}

async function callGroq(
  uiMode: "beginner" | "expert",
  selectedTickers: string[],
  history: ChatMessage[],
  apiKey: string
): Promise<{ content: string; toolCalls: ChatToolCall[] }> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages: toGroqMessages(uiMode, selectedTickers, history),
      tools: CHAT_TOOLS,
      tool_choice: "auto",
      max_completion_tokens: 700,
      temperature: 0.5,
      reasoning_effort: "low",
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq responded ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const message = data?.choices?.[0]?.message;
  if (!message) throw new Error("Groq response missing message");

  const toolCalls: ChatToolCall[] = Array.isArray(message.tool_calls)
    ? message.tool_calls.map((tc: any) => ({
        name: tc.function?.name,
        args: safeParseJSON(tc.function?.arguments),
      }))
    : [];

  const content = typeof message.content === "string" ? message.content : "";
  if (!content && toolCalls.length === 0) throw new Error("Groq returned neither content nor tool calls");

  return { content, toolCalls };
}

async function callGemini(
  uiMode: "beginner" | "expert",
  selectedTickers: string[],
  history: ChatMessage[],
  apiKey: string
): Promise<{ content: string; toolCalls: ChatToolCall[] }> {
  const contents = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt(uiMode, selectedTickers) }] },
        contents,
        tools: [
          {
            functionDeclarations: CHAT_TOOLS.map((t) => ({
              name: t.function.name,
              description: t.function.description,
              parameters: t.function.parameters,
            })),
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini responded ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const textParts = parts.filter((p: any) => typeof p.text === "string").map((p: any) => p.text);
  const toolCalls: ChatToolCall[] = parts
    .filter((p: any) => p.functionCall)
    .map((p: any) => ({ name: p.functionCall.name, args: p.functionCall.args ?? {} }));

  const content = textParts.join(" ").trim();
  if (!content && toolCalls.length === 0) throw new Error("Gemini returned neither content nor tool calls");

  return { content, toolCalls };
}

function safeParseJSON(s: string | undefined): Record<string, unknown> {
  if (!s) return {};
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}

/** Keeps the chatbot from being a dead end when no free key is configured — matches on
 *  keywords and reuses the same plain-language explanations as the glossary panel. */
function demoReply(userMessage: string): string {
  const q = userMessage.toLowerCase();
  const hits: Array<[string[], string]> = [
    [["correlat"], "Correlation measures how much two things move together — +1 means perfect lockstep, 0 means no relationship, negative means they tend to move opposite ways."],
    [["diversif"], "Diversification means spreading investments across things that don't all move together, so a downturn in one doesn't drag everything else down."],
    [["radar", "factor"], "The radar chart scores each company 0-100 on six traits: Profitability, Growth, Liquidity, Leverage, Valuation, and Momentum."],
    [["sector"], "A sector is the industry a company belongs to — Tech, Financials, Energy, and so on. Companies in the same sector tend to move together."],
    [["market cap"], "Market cap is roughly a company's total value: share price × number of shares. It's what sizes the pins on the map."],
    [["news"], "The News panel shows headlines tagged to your selected companies, with a colored dot showing whether the tone reads positive, negative, or neutral."],
    [["live", "price"], "The Live Price chart is simulated for demonstration — it updates every 1.5 seconds but isn't a real market feed."],
  ];
  for (const [keywords, answer] of hits) {
    if (keywords.some((k) => q.includes(k))) return answer;
  }
  return "I can explain any term on this dashboard — try asking about correlation, diversification, sectors, radar factors, or market cap. To unlock open-ended questions and let me actually adjust your comparison for you, add a free GROQ_API_KEY or GEMINI_API_KEY (see the README) — no cost involved.";
}

export async function getChatReply(
  uiMode: "beginner" | "expert",
  chatMode: "demo" | "live",
  selectedTickers: string[],
  history: ChatMessage[]
): Promise<ChatResult> {
  const lastUserMessage = [...history].reverse().find((m) => m.role === "user")?.content ?? "";

  if (chatMode === "demo") {
    return { mode: "demo", content: demoReply(lastUserMessage), toolCalls: [] };
  }

  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (groqKey) {
    try {
      const { content, toolCalls } = await callGroq(uiMode, selectedTickers, history, groqKey);
      return { mode: "live", content, toolCalls };
    } catch (err) {
      console.error("Chat: Groq call failed:", err);
    }
  }

  if (geminiKey) {
    try {
      const { content, toolCalls } = await callGemini(uiMode, selectedTickers, history, geminiKey);
      return { mode: "live", content, toolCalls };
    } catch (err) {
      console.error("Chat: Gemini call failed:", err);
    }
  }

  return {
    mode: "live-fallback",
    content: demoReply(lastUserMessage),
    toolCalls: [],
    note: groqKey || geminiKey
      ? "Live call failed — answering from built-in explanations instead."
      : "No API key configured — answering from built-in explanations instead.",
  };
}
