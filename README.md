# World Cup AI Predictor

**World Cup AI Predictor** is a global football analytics, probability research, and reporting SaaS prototype for the 2026 FIFA World Cup.

Live site: https://website-tau-eosin-18.vercel.app

Analytics only. Not betting advice. 18+ only.

## What It Does

World Cup AI Predictor turns match data, team-strength models, market signals, and live AI research context into readable probability reports.

The platform is designed for:

- Football fans who want transparent match probability research.
- Analysts who need fast match previews and source-backed reasoning.
- Content creators who need report-ready World Cup storylines.
- Developers exploring AI-assisted sports analytics products.

## Product Advantages

- **Transparent probability model**: combines Elo-style strength, Poisson goal modeling, venue context, odds signals, and live provider context.
- **Live AI research layer**: uses connected AI providers to summarize injuries, squad news, tactical matchup, venue pressure, commercial context, and data uncertainty.
- **DeepSeek V4 Pro final synthesis**: successful provider contexts are fused into a readable final probability rationale.
- **Source-backed evidence cards**: detailed source notes stay visible below the summary, while the final synthesis stays clean and readable.
- **World Cup 2026 focus**: group fixtures, match predictor, champion forecast, national flags, and tournament-ready UI.
- **Global English UI**: built as a public-facing international product.
- **Compliance-first positioning**: analytics only, not betting advice, not guaranteed outcomes, and 18+ only.

## Public Access Model

- Logged-out visitors can see the public Home, Login, and Register screens.
- Full analytics pages require account access.
- Registration includes a basic 18+ confirmation gate.
- The current authentication layer is an MVP suitable for early launch and validation.
- Before paid subscriptions or serious production traffic, move auth and API keys to a hardened backend with hashed passwords, server sessions, and database-backed user records.

## API and Model Stack

The product is designed to support:

- OpenAI API for structured football research context.
- Google Gemini for qualitative match context when available.
- DeepSeek V4 Pro for final reasoning synthesis.
- The Odds API for market-implied probability signals.
- Football-Data.org for fixture confirmation.
- Sportmonks / future sports-data providers for deeper national-team, player, injury, and lineup coverage.
- GDELT or other news providers for public commercial and political context signals.

If a live provider is unavailable, the system keeps that factor neutral instead of inventing certainty.

## Core Pages

- `/` - public product home.
- `/login` - member login.
- `/register` - member registration and 18+ gate.
- `/predict` - match probability research workspace.
- `/groupstage` - World Cup group fixtures and quick prediction entry.
- `/champion` - tournament win probability forecast.
- `/settings` - API access and provider testing.
- `/pricing` - future SaaS pricing strategy.

## Deployment

The production app is deployed from the `website/` folder to Vercel.

Recommended Vercel settings:

- Framework: Next.js
- Root Directory: `website`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output: Next.js default
- Node.js: 20.x or newer

Production deploy:

```powershell
cd D:\worldcup-predictor\website
vercel --prod
```

GitHub release flow:

```powershell
cd D:\worldcup-predictor
git add .
git commit -m "Prepare public launch"
git push
cd D:\worldcup-predictor\website
vercel --prod
```

## Local Development

```powershell
cd D:\worldcup-predictor\website
npm ci
npm.cmd run dev
```

For local AI API calls behind a proxy:

```powershell
cd D:\worldcup-predictor\website
powershell -ExecutionPolicy Bypass -File scripts\dev-with-proxy.ps1 -ProxyPort 7890 -Port 3003
```

Open:

```text
http://localhost:3003
```

Remember: localhost works only on your own machine. Public users should use the Vercel production URL.

## Suggested GitHub Topics

Add these topics in the GitHub repository settings to improve discovery:

```text
world-cup
world-cup-2026
football-analytics
soccer-analytics
sports-analytics
ai
artificial-intelligence
nextjs
vercel
openai
gemini
deepseek
elo-rating
poisson-model
probability
data-visualization
sports-data
saas
reporting
football-data
```

## Roadmap

- Add server-side account database and admin dashboard.
- Move platform-owned API keys to server environment variables.
- Add saved prediction history and shareable report pages.
- Add stronger football-data provider coverage for squads, injuries, lineups, and H2H records.
- Add premium tiers only after the free product earns public trust.

## Disclaimer

World Cup AI Predictor is a football analytics and probability research project. It is not betting advice, gambling advice, financial advice, or a guarantee of match outcomes. Use it for research, reporting, and entertainment only. 18+ only.
