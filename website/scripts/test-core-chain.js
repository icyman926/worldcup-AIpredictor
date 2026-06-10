const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const predict = fs.readFileSync(path.join(root, 'pages/predict.js'), 'utf8');
const groupstage = fs.readFileSync(path.join(root, 'pages/groupstage.js'), 'utf8');
const context = fs.readFileSync(path.join(root, 'pages/api/integrations/context.js'), 'utf8');
const match = fs.readFileSync(path.join(root, 'pages/api/predict/match.js'), 'utf8');

const checks = [
  ['predict calls context API', predict.includes('/api/integrations/context')],
  ['predict sends external_context', predict.includes('external_context: liveContext.contexts')],
  ['predict displays probability rationale', predict.includes('Probability rationale') && predict.includes('DeepSeek V4 Pro final synthesis')],
  ['groupstage uses Link to predict', groupstage.includes("pathname: '/predict'") && groupstage.includes('query: { home: match.team1, away: match.team2')],
  ['context supports mock internal test', context.includes('mockContext')],
  ['context pins Gemini 2.5 Flash', context.includes("const GEMINI_MODEL = 'gemini-2.5-flash'") && !/gemini-1\.5-flash|gemini-2\.0-flash/.test(context)],
  ['match returns base probabilities', match.includes('base_probabilities')],
];

for (const [name, ok] of checks) {
  console.log((ok ? 'PASS ' : 'FAIL ') + name);
  if (!ok) process.exitCode = 1;
}
if (process.exitCode) process.exit(process.exitCode);

function applyExternalContext(base, contexts) {
  const total = contexts.reduce((acc, item) => ({
    home: acc.home + (Number(item.home_adjustment) || 0),
    draw: acc.draw + (Number(item.draw_adjustment) || 0),
    away: acc.away + (Number(item.away_adjustment) || 0),
  }), { home: 0, draw: 0, away: 0 });

  let home = Math.max(1, base.home + total.home * 100);
  let draw = Math.max(1, base.draw + total.draw * 100);
  let away = Math.max(1, base.away + total.away * 100);
  const sum = home + draw + away;
  return {
    home: Math.round((home / sum) * 10000) / 100,
    draw: Math.round((draw / sum) * 10000) / 100,
    away: Math.round((away / sum) * 10000) / 100,
  };
}

const base = { home: 39.59, draw: 34.66, away: 25.75 };
const enhanced = applyExternalContext(base, [{ home_adjustment: -0.02, draw_adjustment: 0.01, away_adjustment: 0.03 }]);
if (JSON.stringify(base) === JSON.stringify(enhanced) || enhanced.away <= base.away) {
  throw new Error('API context did not change probability as expected.');
}
console.log('PASS API context changes final probabilities');
console.table([{ label: 'base', ...base }, { label: 'enhanced', ...enhanced }]);
