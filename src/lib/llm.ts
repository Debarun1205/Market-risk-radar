import { Company, byTicker } from "./companies";
import { buildCorrelationMatrix, correlationStats } from "./correlation";
import { companies as allCompanies } from "./companies";
import { getScenario, Scenario } from "./scenarios";

export interface AnalysisResult {
  mode: "demo" | "live" | "live-fallback";
  text: string;
  note?: string;
}

function buildPrompt(scenario: Scenario, selectedTickers: string[]): string {
  const matrix = buildCorrelationMatrix(allCompanies);
  const stats = correlationStats(allCompanies, matrix);
  const selected = selectedTickers
    .map((t) => byTicker[t])
    .filter(Boolean) as Company[];

  const selectedDesc = selected
    .map((c) => `${c.t} (${c.name}, ${c.country}, sector: ${c.sector})`)
    .join("; ");

  return [
    `You are a quantitative analyst writing a short (3-4 sentence) note for a market risk dashboard.`,
    `Focus: ${scenario.label}.`,
    `Dataset: 14 global companies. Average pairwise correlation across the basket is ${stats.avg.toFixed(2)}.`,
    `Most correlated pair: ${stats.maxPair.join("/")} at ${stats.maxValue.toFixed(2)}.`,
    `Best diversifying pair: ${stats.minPair.join("/")} at ${stats.minValue.toFixed(2)}.`,
    selected.length ? `Currently selected companies: ${selectedDesc}.` : "",
    `Write in the tone of a concise analyst note. No preamble, no markdown, just the note.`,
  ]
    .filter(Boolean)
    .join(" ");
}

async function callGroq(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 220,
      temperature: 0.6,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq responded ${res.status}: ${errText}`);
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Groq response missing content");
  return text.trim();
}

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini responded ${res.status}: ${errText}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini response missing content");
  return text.trim();
}

/**
 * Always resolves — never throws. Demo mode short-circuits before any
 * network call. Live mode tries Groq, then Gemini, then falls back to the
 * same demo text with a note explaining why, so the UI never has to
 * render a raw error state.
 */
export async function getAnalysis(
  scenarioId: string,
  selectedTickers: string[],
  mode: "demo" | "live"
): Promise<AnalysisResult> {
  const scenario = getScenario(scenarioId);

  if (mode === "demo") {
    return { mode: "demo", text: scenario.text };
  }

  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const prompt = buildPrompt(scenario, selectedTickers);

  if (groqKey) {
    try {
      const text = await callGroq(prompt, groqKey);
      return { mode: "live", text };
    } catch (err) {
      console.error("Groq call failed:", err);
    }
  }

  if (geminiKey) {
    try {
      const text = await callGemini(prompt, geminiKey);
      return { mode: "live", text };
    } catch (err) {
      console.error("Gemini call failed:", err);
    }
  }

  return {
    mode: "live-fallback",
    text: scenario.text,
    note: groqKey || geminiKey
      ? "Live call failed — showing cached analysis instead."
      : "No API key configured — showing cached analysis instead.",
  };
}
