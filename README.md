# World Cup AI Predictor

A Next.js web app for exploring World Cup 2026 match forecasts, group fixtures, and champion probabilities.

## Project Layout

- `website/` - Vercel-deployed Next.js frontend and API routes.
- `backend/` - Optional FastAPI backend prototype.
- `DEPLOYMENT_GUIDE.md` - Detailed deployment notes.
- `QUICK_COMMANDS.md` - Common local and deployment commands.

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
