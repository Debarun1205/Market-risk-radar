import { companies } from "./companies";
import { presets } from "./presets";

export interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export const CHAT_TOOLS: ToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "update_comparison",
      description:
        "Add, remove, or replace which companies are shown in the comparison (correlation grid, radar, news, and live chart). Maximum 6 companies total. Only use tickers from the provided company list — never invent one.",
      parameters: {
        type: "object",
        properties: {
          action: { type: "string", enum: ["add", "remove", "replace"] },
          tickers: {
            type: "array",
            items: { type: "string" },
            description: "Ticker symbols, e.g. [\"AAPL\", \"TSLA\"]",
          },
        },
        required: ["action", "tickers"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "apply_preset",
      description: "Load one of the predefined comparison presets by exact name.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", enum: presets.map((p) => p.name) },
        },
        required: ["name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "open_glossary",
      description:
        "Open the glossary/learn panel so the user can browse term definitions themselves. Prefer this over re-explaining everything yourself if they ask where to learn more.",
      parameters: { type: "object", properties: {} },
    },
  },
];

/** Compact "TICKER=Name" directory so the model can resolve company names to real tickers. */
export function tickerDirectory(): string {
  return companies.map((c) => `${c.t}=${c.name}`).join(", ");
}
