# Commercialization Notes

## Recommended strategy

Use an open-core model:

- Open source: frontend, basic Elo/Poisson model, sample fixtures, demo deployment.
- Keep private: live odds ingestion, API keys, premium weighting logic, data refresh jobs, user database, reports, subscription logic.

## Suggested tiers

- Free: basic match probabilities, fixtures, champion ranking.
- Pro: odds analysis, European odds and Asian handicap notes, saved history, shareable reports.
- Analyst: API-backed data refresh, injury and lineup modules, batch analysis, exports.
- Business: custom dashboard, white-label reports, private deployment, support.

## Compliance positioning

Sell football analytics, not betting instructions.

- Keep 18+ gating.
- Do not promise accuracy or profit.
- Do not claim inside information.
- Use wording such as probability, scenario, research, and analytics.
- Keep "not betting advice" visible.

## Infrastructure before charging

Before real paid users, move from localStorage to:

- Backend API on VPS/Railway/Fly.io.
- PostgreSQL users and subscriptions.
- Server-side auth and password hashing.
- Stripe, Lemon Squeezy, or Paddle payments.
- Environment variables for all API keys.
- Audit logs for admin access.
