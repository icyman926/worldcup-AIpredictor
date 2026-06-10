# Public Launch Guide

This guide explains how to present, deploy, and promote **World Cup AI Predictor** as a global football analytics product.

Live site: https://website-tau-eosin-18.vercel.app

## Public Product Name

**World Cup AI Predictor**

Recommended short description:

> AI-assisted football analytics and probability research for World Cup 2026.

Recommended positioning:

> A reporting SaaS prototype that combines baseline football models, odds signals, public research context, and AI synthesis into readable World Cup probability reports.

Required compliance language:

> Analytics only. Not betting advice. 18+ only.

## Public Launch Checklist

- Confirm the Vercel production URL is working.
- Confirm logged-out visitors only see the public entry flow.
- Confirm registration includes 18+ confirmation.
- Confirm the prediction page clearly says analytics only, not betting advice.
- Confirm API keys are not committed to GitHub.
- Confirm `.env.local`, `.vercel`, `.next`, and `node_modules` are ignored.
- Confirm README has the public site URL and product positioning.
- Add GitHub topics for discovery.
- Pin the repository on the GitHub profile.

## Deployment Flow

1. Build locally:

```powershell
cd D:\worldcup-predictor\website
npm.cmd run build
```

2. Commit and push:

```powershell
cd D:\worldcup-predictor
git status --short
git add .
git commit -m "Prepare public launch"
git push
```

3. Deploy to Vercel:

```powershell
cd D:\worldcup-predictor\website
vercel --prod
```

4. Share the production URL:

```text
https://website-tau-eosin-18.vercel.app
```

Do not share localhost URLs or Vercel dashboard URLs.

## GitHub Topics To Add

Recommended discovery topics:

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

## How To Make The Repository More Shareable

- Keep the README headline clear and benefit-driven.
- Put the live demo link near the top.
- Show a clean screenshot or GIF of the prediction result.
- Use short sections, not long internal notes.
- Explain what makes the model transparent.
- Mention limitations honestly.
- Use the phrase "analytics only, not betting advice" consistently.
- Add a roadmap so visitors can imagine future progress.
- Open a few GitHub issues labeled `good first issue`, `data-provider`, and `enhancement`.
- Create a short launch post for X, Reddit, LinkedIn, and football analytics communities.
- Ask early users to star the repository if they find it useful.

## Launch Post Template

```text
I built World Cup AI Predictor, an AI-assisted football analytics platform for World Cup 2026.

It combines Elo, Poisson, odds signals, football data, public research context, and AI synthesis into readable match probability reports.

Analytics only. Not betting advice. 18+ only.

Live demo:
https://website-tau-eosin-18.vercel.app

GitHub:
https://github.com/icyman926/worldcup-AIpredictor
```

## Product Advantages To Highlight

- Transparent probability research, not black-box predictions.
- AI-generated reasoning summary with evidence cards underneath.
- Match-level probability, scoreline, odds signal, and context explanation.
- World Cup 2026 focused interface.
- English-first global product.
- Built with Next.js and Vercel for fast public access.

## Future Monetization Direction

Do not rush paid checkout before trust exists.

Suggested path:

1. Keep the public demo free.
2. Grow GitHub stars and product feedback.
3. Add saved reports and exportable analysis.
4. Add premium API-backed analysis tiers.
5. Add payment only when users clearly ask for deeper reports.

