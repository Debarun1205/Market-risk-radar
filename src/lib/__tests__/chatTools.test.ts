import { describe, it, expect } from "vitest";
import { CHAT_TOOLS, tickerDirectory } from "../chatTools";
import { presets } from "../presets";
import { byTicker } from "../companies";

describe("CHAT_TOOLS", () => {
  it("defines exactly the three expected tools", () => {
    const names = CHAT_TOOLS.map((t) => t.function.name).sort();
    expect(names).toEqual(["apply_preset", "open_glossary", "update_comparison"]);
  });

  it("restricts apply_preset's name enum to real preset names", () => {
    const tool = CHAT_TOOLS.find((t) => t.function.name === "apply_preset")!;
    const enumValues = (tool.function.parameters as any).properties.name.enum as string[];
    expect(enumValues.sort()).toEqual(presets.map((p) => p.name).sort());
  });
});

describe("tickerDirectory", () => {
  it("includes a known ticker mapped to its real name", () => {
    expect(tickerDirectory()).toContain("AAPL=Apple");
  });

  it("has one entry per company (no truncation)", () => {
    const entries = tickerDirectory().split(", ");
    expect(entries.length).toBe(Object.keys(byTicker).length);
  });
});
