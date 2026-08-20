import { byTicker, MAX_SELECTION } from "./companies";
import { correlation } from "./correlation";
import { buildRadarMap, radarFactors } from "./radar";

export function buildContextSummary(selectedTickers: string[]): string {
  const list = selectedTickers.map((t) => byTicker[t]).filter(Boolean);

  if (list.length === 0) {
    return "The user hasn't selected any companies to compare yet. The dashboard has 200 companies across 40+ countries and 10 sectors available.";
  }

  let out = `Currently selected (${list.length}/${MAX_SELECTION}): ${list
    .map((c) => `${c.t} (${c.name}, sector: ${c.sector}, country: ${c.country})`)
    .join("; ")}.`;

  if (list.length >= 2) {
    const pairs: string[] = [];
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        pairs.push(`${list[i].t}-${list[j].t}: ${correlation(list[i], list[j]).toFixed(2)}`);
      }
    }
    out += ` Pairwise correlations (−1 to 1): ${pairs.join(", ")}.`;
  }

  const radarMap = buildRadarMap(list);
  out += ` Radar scores [${radarFactors.join("/")}], each 0-100: ${list
    .map((c) => `${c.t}: ${radarMap[c.t].join("/")}`)
    .join("; ")}.`;

  return out;
}
