<<<<<<< HEAD
# Market Risk Radar

A quant dashboard combining a global company map, a correlation heatmap, a
factor radar, and an AI analyst layer — built to run entirely free, with a
graceful fallback anywhere it touches a paid API.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for layout/utility styling, custom CSS variables for the
  terminal color/type system
- **D3 + topojson-client** for the world map
- **Groq / Gemini free tiers** for the optional live AI layer — the app never
  requires a paid key

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). By default `.env.local`
is empty, so the app runs entirely in **Demo Mode** — the AI Analyst panel
shows pre-written analysis instantly, with zero network calls and zero cost.

## Enabling Live Mode (optional, still free)

1. Get a free-tier key from **one** of:
   - [Groq Console](https://console.groq.com/keys) — fast inference, generous free tier
   - [Google AI Studio](https://aistudio.google.com/apikey) — Gemini free tier, no card required
2. Add it to `.env.local`:
   ```
   GROQ_API_KEY=your_key_here
   ```
3. Restart the dev server, flip the toggle in the AI Analyst panel to **Live
   mode**.

The server checks `GROQ_API_KEY` first, then `GEMINI_API_KEY`. The key is
only ever read server-side, inside `src/app/api/analyze/route.ts` — it's
never sent to the browser.

## How the fallback is wired

This is the part worth understanding before you extend it:

- `src/lib/llm.ts` exports `getAnalysis()`, which **always resolves** — it
  never throws. Demo mode returns pre-written text with no network call.
  Live mode tries Groq, then Gemini, then falls back to the same pre-written
  text with an explanatory `note`.
- The API route (`src/app/api/analyze/route.ts`) wraps that call in its own
  try/catch, so even a malformed request degrades to fallback text with a
  `200` response — the UI never has to render a raw error state.
- The `AIAnalyst` component surfaces which mode actually produced the text
  (`demo`, `live`, or `live-fallback`) so the fallback is visible and honest
  rather than silently pretending to be live.
- The world map (`src/components/WorldMap.tsx`) follows the same pattern for
  a different kind of dependency: if the world-atlas topology fails to fetch
  from the CDN, it falls back to a coordinate-grid projection instead of a
  blank panel.

If you later swap in real price/fundamentals data, keep this shape: every
external dependency should have a defined, visible fallback rather than an
error boundary.

## Project structure

```
src/
├── app/
│   ├── layout.tsx          Root layout, fonts, metadata
│   ├── page.tsx            Assembles all panels, owns selection state
│   ├── globals.css         Tailwind layers + design tokens
│   └── api/analyze/route.ts  Server-side AI call (the only place a key is read)
├── components/
│   ├── TickerTape.tsx
│   ├── WorldMap.tsx         D3 map, sector-colored pins, click-to-select
│   ├── CorrelationHeatmap.tsx
│   ├── FactorRadar.tsx
│   └── AIAnalyst.tsx        Demo/Live toggle, calls /api/analyze
└── lib/
    ├── companies.ts         Dataset: 14 companies, 10 countries
    ├── correlation.ts       Deterministic seeded correlation matrix
    ├── radar.ts              Deterministic seeded factor scores
    ├── scenarios.ts          Pre-written analyst narratives (demo + fallback)
    └── llm.ts                Groq/Gemini client with guaranteed fallback
```

## Swapping in real data

Everything under `src/lib` is written to be replaced without touching the
components:

- `companies.ts` — replace the hardcoded array with a fetch from a free
  source (e.g. Wikipedia's list of largest companies, or your own curated
  list) at build time.
- `correlation.ts` — replace `correlation()` with a real calculation from
  historical returns (e.g. via `yfinance` in a small Python data-prep script,
  or a free market-data API) that outputs the same `number[][]` shape.
- `radar.ts` — replace `radarValues()` with real fundamentals (P/E, ROE,
  debt/equity, etc.), normalized to 0–100.

Because the components only consume the exported functions' return shapes,
none of `WorldMap.tsx`, `CorrelationHeatmap.tsx`, or `FactorRadar.tsx` need
to change.

## Deploying

This deploys cleanly to **Vercel**:

1. Push this repo to GitHub.
2. Import it in Vercel.
3. (Optional) add `GROQ_API_KEY` or `GEMINI_API_KEY` as an environment
   variable in the Vercel project settings for Live Mode.
4. Deploy — no other configuration needed.

## Known limitations of this prototype

- Correlation and factor data are **synthetic**, generated with a seeded
  deterministic algorithm so they're stable across reloads — not real market
  data. See "Swapping in real data" above.
- The world map depends on fetching `world-atlas` topology from a CDN at
  runtime. It's a reliable, widely-used source, but if you deploy behind
  strict network rules, test this first — the fallback view is there for
  exactly this case.
- No persistence layer yet — selection state resets on page reload.
=======
# Market-risk-radar
>>>>>>> 73fe2b83600248c4d61c135b1a792b13d0e58f9d
