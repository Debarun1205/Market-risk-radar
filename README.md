# Market Risk Radar

**[Live demo →](https://market-risk-radar.vercel.app)**

A quant dashboard combining a global company map, a correlation heatmap, a factor radar, live-updating news and price data, and a context-aware AI assistant — built to run entirely on free-tier infrastructure, with a graceful fallback anywhere it touches a paid API.

> 200 real companies across 40+ countries · zoomable world map · AI analyst & chatbot · live market news · $0/month to run

<!--
  Add real screenshots or a short GIF here before sharing this repo widely —
  a picture of the map + heatmap + chat in action does more for a first
  impression than any amount of text below it. A quick way to capture one:
  open the live demo, use your OS screenshot tool, and drop the images in
  a /docs folder, then reference them here like:
  ![Map view](./docs/screenshot-map.png)
-->

## What this is

This started as a portfolio project to demonstrate end-to-end product thinking — not just "can I call an LLM API," but the harder, more realistic version: building something that stays fully functional, honest, and free to run even when a dependency (a model gets deprecated, a free quota runs out, a CDN is unreachable) fails. Every external integration in this project — the AI analyst, the news feed, the chatbot, even the world map's topology data — has an explicit, visible fallback rather than an error boundary.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for layout/utility styling, custom CSS variables for the terminal color/type system
- **D3 + topojson-client** for the zoomable world map
- **Recharts** for the live price chart
- **Groq / Gemini free tiers** for the AI analyst and chat assistant
- **Marketaux free tier** for live market news
- **Vitest** for the unit test suite

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). By default `.env.local` is empty, so the AI analyst runs in **Demo Mode** — pre-written analysis, zero network calls, zero cost. The news panel and chat assistant default to **Live Mode**, but gracefully fall back to demo-equivalent content automatically if no key is configured — nothing breaks either way.

## Enabling live features (optional, still free)

| Feature | Provider | Env var | Free tier |
|---|---|---|---|
| AI Analyst & Chat | [Groq Console](https://console.groq.com/keys) | `GROQ_API_KEY` | Fast inference, generous limits, no card |
| AI Analyst & Chat (fallback) | [Google AI Studio](https://aistudio.google.com/apikey) | `GEMINI_API_KEY` | No card required |
| Market News | [Marketaux](https://www.marketaux.com/register) | `NEWS_API_KEY` | 100 requests/day, no card |

Add whichever keys you want to `.env.local`, restart the dev server, and the corresponding features switch from fallback content to live calls automatically. All three keys are read **only** inside API routes (`src/app/api/*/route.ts`) — never sent to the browser.

## Running the test suite

```bash
npm test
```

25 tests covering the deterministic logic layer — correlation math, sector aggregation, radar scoring, and the chat tool schema. These are cheap, fast, and catch real bugs: the correlation-symmetry test in `correlation.test.ts` exists because an earlier version of this code seeded its randomness from the concatenated ticker order (`"AAPL-JPM"` vs `"JPM-AAPL"`), which hashed differently and silently produced two different numbers for the same pair. The fix was one line; the test exists so it can't quietly happen again.

## Protecting the free-tier quota

Every API route (`/api/analyze`, `/api/news`, `/api/chat`) is rate-limited per IP (`src/lib/rateLimit.ts`) — a simple in-memory counter, intentionally zero-setup and zero-cost. It's a **best-effort** limiter: Vercel serverless functions don't share memory across every possible instance, so it won't enforce a perfectly hard global cap under heavy concurrent traffic. What it does reliably catch is the common case — a bot or an impatient click-through hammering one endpoint in quick succession — which is exactly the scenario that would otherwise burn through a free daily quota in minutes. If this project ever sees real production traffic, swap it for [Upstash Redis](https://upstash.com) (also free-tier) using the same `checkRateLimit()` signature.

When a limit is hit, the route doesn't error — it returns the same demo/fallback content as everywhere else in the app, with a note explaining why, consistent with the rest of the fallback philosophy here.

## How the fallback architecture works

This is the part worth understanding before extending anything:

- `src/lib/llm.ts`, `src/lib/news.ts`, and `src/lib/chat.ts` each export a function that **always resolves — never throws**. Demo mode returns pre-written content with no network call. Live mode tries Groq/Marketaux, falls back to Gemini where applicable, and ultimately falls back to the same pre-written content with an explanatory `note` if every live attempt fails.
- Every API route wraps its call in its own try/catch, so even a malformed request degrades to fallback content with a `200` response — the UI never renders a raw error state.
- The UI surfaces which mode actually produced the content (`demo`, `live`, or `live-fallback`) so the fallback is visible and honest rather than silently pretending to be live.
- The world map follows the same pattern for a different kind of dependency: if the world-atlas topology fails to fetch from its CDN, it falls back to a coordinate-grid projection instead of a blank panel.
- The chat assistant's rule-based demo responder (`demoReply()` in `chat.ts`) means the feature is never a dead end even with zero API keys configured — it can still explain every term on the dashboard from the same content as the glossary panel.

If you extend this project, keep this shape: every external dependency should have a defined, visible fallback rather than an error boundary.

## Project structure

```
src/
├── app/
│   ├── layout.tsx / page.tsx      Root layout and the assembled dashboard
│   ├── globals.css                Tailwind layers + design tokens + tour/animation CSS
│   └── api/
│       ├── analyze/route.ts       AI analyst (rate-limited)
│       ├── news/route.ts          Market news (rate-limited)
│       └── chat/route.ts          Chat assistant (rate-limited)
├── components/
│   ├── WorldMap.tsx                D3 map: zoom/pan, ~200 pins, sector colors
│   ├── SectorHeatmap.tsx           Default fixed-size (10×10) correlation view
│   ├── DetailedHeatmap.tsx         Drill-down heatmap for the selected companies
│   ├── FactorRadar.tsx             Radar chart, selection-order colored
│   ├── CompanySearch.tsx / PresetChips.tsx   On-ramps for finding companies
│   ├── LiveChart.tsx               Simulated live price (Recharts)
│   ├── NewsPanel.tsx               Featured story + grid, gradient placeholders
│   ├── AIAnalyst.tsx / ChatWidget.tsx   The two LLM-backed surfaces
│   ├── OnboardingTour.tsx          First-visit guided walkthrough
│   ├── GlossaryPanel.tsx / GlossaryTooltip.tsx   Plain-language term reference
│   └── DiversificationBadge.tsx    Animated gauge translating correlation to plain language
└── lib/
    ├── companies.ts                Dataset: 200 companies, 40+ countries, 10 sectors
    ├── correlation.ts / radar.ts   Deterministic seeded math (unit tested)
    ├── llm.ts / news.ts / chat.ts  The three fallback-safe integrations
    ├── chatTools.ts / chatContext.ts   Function-calling schema + live context injection
    ├── rateLimit.ts                Per-IP request limiting
    └── presets.ts / flags.ts       Preset bundles, country flag lookup
```

## Swapping in real data

Everything under `src/lib` is written to be replaced without touching the components:

- `companies.ts` — replace the hardcoded array with a fetch from a free source at build time.
- `correlation.ts` — replace `correlation()` with a real calculation from historical returns (e.g. via `yfinance`), keeping the same `number[][]` output shape.
- `radar.ts` — replace `radarValues()` with real fundamentals, normalized to 0–100.

Because components only consume these functions' return shapes, none of the UI needs to change.

## Deploying

Deploys cleanly to **Vercel**: push to GitHub, import the repo, optionally add the three API keys as environment variables, deploy. No other configuration needed.

## Known limitations

- Correlation and factor data are **synthetic**, seeded deterministically for stability — not real market data.
- The world map depends on fetching topology from a CDN at runtime; the fallback view exists specifically for restricted-network deployments.
- The rate limiter is best-effort (see above), not a hard guarantee under concurrent load.
- No persistence layer — selection state resets on reload (a natural next addition: encoding it in the URL for shareable links).

---

## About the Author

**Debarun Banerjee** — B.Tech student, Computer Science & Engineering (AI & ML), Narula Institute of Technology, Kolkata.

I build AI-driven, real-world tools end to end — from data pipeline to deployed product — with a particular interest in systems that stay honest and usable even when a dependency fails, which is the design principle this project is built around. My work spans four research publications (spectral neural network pruning, algorithmic fairness auditing, MCMC variance reduction, and conformal prediction under covariate shift), a deployed credit-risk and fraud-detection platform powered by the Claude API, and a safety-tech platform for solo travelers. I've completed job simulations with BCG X, Goldman Sachs, JPMorgan Chase, and Lloyds Banking Group, and hold certifications from Anthropic, IBM SkillsBuild, and Cisco.

- **Portfolio:** [debarun.base44.app](https://debarun.base44.app)
- **LinkedIn:** [linkedin.com/in/debarun-banerjee-b8524a37b](https://www.linkedin.com/in/debarun-banerjee-b8524a37b)

## License

[MIT](./LICENSE) — free to use, modify, and learn from.
