# World Cup AI Predictor

A Next.js football analytics and probability research platform for World Cup 2026. The product is positioned as a reporting SaaS prototype: analytics only, not betting advice, and 18+ only.

## Public Positioning

- Football analytics / probability research / reporting SaaS.
- Model outputs are for research, education, and reporting.
- Not betting advice, gambling advice, financial advice, or guaranteed outcomes.
- 18+ only.
- Early phase has no paid checkout. Build audience and trust first, then connect payments when premium demand is proven.

## Access Model

- Logged-out visitors can see only `Home`, `Login`, and `Register`.
- Middleware redirects private routes such as `/predict`, `/groupstage`, `/champion`, `/settings`, `/pricing`, `/about`, and `/howto` to `/login`.
- Registration uses a basic 18+ gate: date of birth plus explicit confirmation.
- After successful registration/login, a browser cookie unlocks the full analytics workspace.
- Current auth is still an MVP. Before real paid plans or VPS launch, replace it with a backend user database, hashed passwords, server sessions/JWT, server-side age records, and real admin metrics.

## API Integration Status

- Settings includes API key fields and real `Test` buttons for Gemini, OpenAI, DeepSeek, The Odds API, API-Football, and Football-Data.org.
- Gemini can now be passed into match predictions as live qualitative context.
- If no provider test succeeds, predictions fall back to local Elo, Poisson, venue, and manual odds only.
- Browser-stored keys are acceptable for early private testing only. Production should move keys to server environment variables and never expose platform-owned keys to users.

## Project Layout

- `website/` - Vercel-deployed Next.js frontend and API routes.
- `backend/` - Optional FastAPI backend prototype.
- `DEPLOYMENT_GUIDE.md` - Detailed deployment notes.
- `QUICK_COMMANDS.md` - Common local and deployment commands.
- `COMMERCIALIZATION.md` - Product and monetization roadmap.

## Local Development

```powershell
cd D:\worldcup-predictor\website
npm ci
npm.cmd run dev
```

Open http://localhost:3000.

## Production Build

```powershell
cd D:\worldcup-predictor\website
npm.cmd run clean
npm.cmd run build
```

## Vercel

Set the Vercel project Root Directory to `website`.
Use Node.js 20.x, `npm ci` as the install command, and `npm run build` as the build command.

Do not commit `.env.local`, `.vercel`, `.next`, or `node_modules`.
