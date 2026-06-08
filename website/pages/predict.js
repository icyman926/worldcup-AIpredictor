import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Flag from '../components/Flag';
import Layout from '../components/Layout';
import { GROUP_STAGES } from '../lib/predictor';

const venueOptions = [
  { id: 'home', label: 'Home advantage' },
  { id: 'neutral', label: 'Neutral venue' },
  { id: 'away', label: 'Away context' },
];

const emptyOdds = { home: '', draw: '', away: '' };
const apiProviderLabels = ['gemini', 'chatgpt', 'deepseek', 'oddsApi', 'apiFootball', 'footballData'];

export default function Predict() {
  const [teams, setTeams] = useState([]);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [venue, setVenue] = useState('neutral');
  const [odds, setOdds] = useState(emptyOdds);
  const [apiKeys, setApiKeys] = useState({});
  const [matchInfo, setMatchInfo] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/teams')
      .then((res) => res.json())
      .then(setTeams)
      .catch(() => setError('Could not load team data.'));

    try {
      setApiKeys(JSON.parse(localStorage.getItem('apiKeys') || '{}'));
    } catch {
      setApiKeys({});
    }
  }, []);

  const selected = useMemo(() => ({
    home: teams.find((team) => team.name === homeTeam),
    away: teams.find((team) => team.name === awayTeam),
  }), [awayTeam, homeTeam, teams]);

  const oddsReady = Number(odds.home) > 1 && Number(odds.draw) > 1 && Number(odds.away) > 1;
  const manualOddsAnalysis = oddsReady ? analyzeOdds(Number(odds.home), Number(odds.draw), Number(odds.away)) : null;

  useEffect(() => {
    setResult(null);
    if (!selected.home || !selected.away || selected.home.id === selected.away.id) {
      setMatchInfo(null);
      return;
    }

    const found = GROUP_STAGES
      .flatMap((group) => group.matches)
      .find((match) => (
        (match.team1 === selected.home.id && match.team2 === selected.away.id) ||
        (match.team1 === selected.away.id && match.team2 === selected.home.id)
      ));

    if (!found) {
      setMatchInfo(null);
      setVenue('neutral');
      return;
    }

    setMatchInfo(found);
    const hostId = inferHostTeam(found.stadium);
    if (hostId && selected.home.id === hostId) setVenue('home');
    else if (hostId && selected.away.id === hostId) setVenue('away');
    else setVenue('neutral');
  }, [selected.home, selected.away]);

  const fillEstimatedOdds = () => {
    if (!selected.home || !selected.away) {
      setOdds({ home: '2.35', draw: '3.20', away: '2.95' });
      return;
    }

    const diff = (selected.home.elo || 1800) - (selected.away.elo || 1800);
    const homeProb = clamp(0.36 + diff / 1600, 0.22, 0.58);
    const drawProb = clamp(0.27 - Math.abs(diff) / 5000, 0.20, 0.30);
    const awayProb = Math.max(0.12, 1 - homeProb - drawProb);
    const margin = 1.06;

    setOdds({
      home: (1 / (homeProb * margin)).toFixed(2),
      draw: (1 / (drawProb * margin)).toFixed(2),
      away: (1 / (awayProb * margin)).toFixed(2),
    });
  };

  const handlePredict = async () => {
    if (!homeTeam || !awayTeam || homeTeam === awayTeam) return;

    setLoading(true);
    setError('');
    try {
      const payload = {
        home_team: homeTeam,
        away_team: awayTeam,
        venue,
      };

      if (oddsReady) {
        payload.home_odds = Number(odds.home);
        payload.draw_odds = Number(odds.draw);
        payload.away_odds = Number(odds.away);
      }

      const response = await fetch('/api/predict/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || 'Prediction failed');
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Match predictor</p>
            <h1 className="mt-3 text-4xl font-bold text-white">Compare two national teams</h1>
            <p className="mt-3 max-w-3xl text-slate-400">
              Select two countries, review their flag, group, confederation, and rating, add bookmaker odds when available, then generate transparent probabilities.
            </p>
          </div>

          <ApiStatus apiKeys={apiKeys} />

          <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-5 md:p-8">
            <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-end">
              <TeamSelect label="Team A" value={homeTeam} onChange={setHomeTeam} teams={teams} />
              <div className="pb-3 text-center text-2xl font-black text-slate-500">VS</div>
              <TeamSelect label="Team B" value={awayTeam} onChange={setAwayTeam} teams={teams} />
            </div>

            {(selected.home || selected.away) && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <TeamCard title="Team A profile" team={selected.home} />
                <TeamCard title="Team B profile" team={selected.away} />
              </div>
            )}

            {matchInfo && (
              <div className="mt-6 grid gap-4 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm md:grid-cols-3">
                <Info label="Date" value={formatDate(matchInfo.date)} />
                <Info label="Kickoff" value={matchInfo.time} />
                <Info label="Stadium" value={matchInfo.stadium} />
              </div>
            )}

            <div className="mt-6 rounded-lg border border-white/10 bg-slate-900 p-5">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Odds input and market signal</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Enter decimal odds from bookmakers or an odds API. The model converts them into implied probabilities, removes bookmaker margin, and treats the market as the highest-weight signal.
                  </p>
                </div>
                <button onClick={fillEstimatedOdds} className="rounded-md border border-white/15 px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/10">
                  Fill sample odds
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <OddsInput label={homeTeam || 'Team A'} value={odds.home} onChange={(value) => setOdds((current) => ({ ...current, home: value }))} />
                <OddsInput label="Draw" value={odds.draw} onChange={(value) => setOdds((current) => ({ ...current, draw: value }))} />
                <OddsInput label={awayTeam || 'Team B'} value={odds.away} onChange={(value) => setOdds((current) => ({ ...current, away: value }))} />
              </div>

              {manualOddsAnalysis ? (
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <Info label="Bookmaker margin" value={manualOddsAnalysis.margin + '%'} />
                  <Info label="No-vig Team A" value={manualOddsAnalysis.normalized.home + '%'} />
                  <Info label="No-vig draw" value={manualOddsAnalysis.normalized.draw + '%'} />
                  <Info label="No-vig Team B" value={manualOddsAnalysis.normalized.away + '%'} />
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">No odds supplied yet. Prediction still works, but the market signal is treated as neutral.</p>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                {venueOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setVenue(option.id)}
                    className={`rounded-md px-4 py-2 text-sm font-semibold transition ${venue === option.id ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handlePredict}
                disabled={loading || !homeTeam || !awayTeam || homeTeam === awayTeam}
                className="rounded-md bg-white px-6 py-3 font-bold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Predicting...' : 'Generate prediction'}
              </button>
            </div>

            {homeTeam === awayTeam && homeTeam && (
              <div className="mt-5 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-center text-red-200">
                Select two different teams.
              </div>
            )}
            {error && (
              <div className="mt-5 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-center text-red-200">
                {error}
              </div>
            )}
          </div>

          {result && (
            <div className="mt-8 space-y-6">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Prediction result</h2>
                    <p className="mt-1 text-slate-400">{homeTeam} vs {awayTeam}</p>
                  </div>
                  <div className="rounded-md bg-slate-900 px-4 py-3 text-sm text-slate-300">
                    Confidence <span className="font-bold text-emerald-300">{result.confidence}%</span>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <ProbabilityCard label={homeTeam + ' win'} value={result.probabilities.home} tone="emerald" />
                  <ProbabilityCard label="Draw" value={result.probabilities.draw} tone="amber" />
                  <ProbabilityCard label={awayTeam + ' win'} value={result.probabilities.away} tone="sky" />
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
                  <h3 className="text-xl font-bold text-white">Most likely scores</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {result.most_likely_scores.map((item) => (
                      <div key={item.score} className="rounded-md bg-slate-900 p-4 text-center">
                        <div className="text-2xl font-bold text-white">{item.score}</div>
                        <div className="mt-1 text-sm text-slate-400">{item.probability}%</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Info label="Expected goals" value={result.expected_goals.home + ' : ' + result.expected_goals.away} />
                    <Info label="Match strength" value={result.match_strength} />
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
                  <h3 className="text-xl font-bold text-white">Model breakdown</h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <ModelPanel title="Elo" data={result.model_breakdown.elo} />
                    <ModelPanel title="Poisson" data={result.model_breakdown.poisson} />
                    <ModelPanel title="Odds" data={result.model_breakdown.odds} />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
                <h3 className="text-xl font-bold text-white">Odds interpretation and data basis</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <Info label="Odds source" value={oddsReady ? 'Manual/API decimal odds' : 'Neutral placeholder'} />
                  <Info label="Market margin" value={result.model_breakdown.odds.margin == null ? 'N/A' : result.model_breakdown.odds.margin + '%'} />
                  <Info label="Market read" value={result.model_breakdown.odds.interpretation} />
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <Explanation title="1. Implied probability" text="Decimal odds are converted with 1 / odds. Lower odds mean the market is pricing that outcome as more likely." />
                  <Explanation title="2. Overround removal" text="Bookmakers include margin, so raw implied probabilities usually add to more than 100%. The model normalizes them into no-vig probabilities." />
                  <Explanation title="3. Ensemble fusion" text="Odds are combined with Poisson scorelines, Elo strength, and qualitative context such as injuries, team state, coach style, referee tendency, and H2H history." />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function ApiStatus({ apiKeys }) {
  return (
    <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Data & API status</h2>
          <p className="mt-2 text-sm leading-6 text-emerald-50/80">
            Accuracy improves when odds, fixture, injury, H2H, and news APIs are connected. Configure keys before relying on live market analysis.
          </p>
        </div>
        <Link href="/settings" className="rounded-md bg-white px-4 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-emerald-200">
          Configure API keys
        </Link>
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-6">
        {apiProviderLabels.map((key) => (
          <div key={key} className="rounded-md bg-slate-950/50 px-3 py-2 text-xs">
            <div className="font-bold uppercase tracking-wide text-slate-400">{formatProvider(key)}</div>
            <div className={apiKeys[key] ? 'mt-1 font-bold text-emerald-300' : 'mt-1 font-bold text-amber-200'}>
              {apiKeys[key] ? 'Connected' : 'Not set'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamSelect({ label, value, onChange, teams }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
      >
        <option value="">Select team...</option>
        {teams.map((team) => (
          <option key={team.id} value={team.name}>{team.id} {team.name} - Group {team.group}</option>
        ))}
      </select>
    </label>
  );
}

function TeamCard({ title, team }) {
  if (!team) {
    return (
      <div className="rounded-lg border border-white/10 bg-slate-900 p-5">
        <div className="text-sm font-semibold text-slate-500">{title}</div>
        <div className="mt-4 text-slate-400">Select a country to show flag, group, confederation, and rating.</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-slate-900 p-5">
      <div className="text-sm font-semibold text-slate-500">{title}</div>
      <div className="mt-4 flex items-center gap-4">
        <Flag team={team} className="h-16 w-24" />
        <div>
          <div className="text-xl font-bold text-white">{team.name}</div>
          <div className="text-sm text-slate-400">{team.id}</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <Info label="Group" value={team.group} />
        <Info label="Confederation" value={team.confederation} />
        <Info label="Elo" value={team.elo} />
      </div>
    </div>
  );
}

function OddsInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">{label} odds</span>
      <input
        type="number"
        min="1.01"
        step="0.01"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="2.50"
        className="w-full rounded-md border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
      />
    </label>
  );
}

function ProbabilityCard({ label, value, tone }) {
  const color = {
    emerald: 'bg-emerald-400 text-emerald-200',
    amber: 'bg-amber-300 text-amber-200',
    sky: 'bg-sky-400 text-sky-200',
  }[tone];

  return (
    <div className="rounded-lg border border-white/10 bg-slate-900 p-5">
      <div className={`mb-3 text-sm font-semibold ${color.split(' ')[1]}`}>{label}</div>
      <div className="text-4xl font-black text-white">{value}%</div>
      <div className="mt-4 h-2 rounded-full bg-white/10">
        <div className={`h-2 rounded-full ${color.split(' ')[0]}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ModelPanel({ title, data }) {
  return (
    <div className="rounded-md bg-slate-900 p-4">
      <h4 className="font-bold text-white">{title}</h4>
      <div className="mt-3 space-y-2 text-sm">
        <InfoRow label="Home" value={data.home + '%'} />
        <InfoRow label="Draw" value={data.draw + '%'} />
        <InfoRow label="Away" value={data.away + '%'} />
      </div>
      {data.margin != null && <p className="mt-3 text-xs text-slate-500">Margin: {data.margin}%</p>}
      {data.interpretation && <p className="mt-1 text-xs text-slate-500">{data.interpretation}</p>}
    </div>
  );
}

function Explanation({ title, text }) {
  return (
    <div className="rounded-md bg-slate-900 p-4">
      <div className="font-bold text-white">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 font-semibold text-white">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

function analyzeOdds(home, draw, away) {
  const raw = {
    home: 1 / home,
    draw: 1 / draw,
    away: 1 / away,
  };
  const total = raw.home + raw.draw + raw.away;
  return {
    margin: round((total - 1) * 100),
    normalized: {
      home: round((raw.home / total) * 100),
      draw: round((raw.draw / total) * 100),
      away: round((raw.away / total) * 100),
    },
  };
}

function inferHostTeam(stadium) {
  if (/Mexico|Guadalajara|Monterrey|Azteca|Akron|BBVA/.test(stadium)) return 'MEX';
  if (/Toronto|Vancouver|BMO|BC Place/.test(stadium)) return 'CAN';
  if (/Los Angeles|Seattle|Atlanta|Houston|Dallas|Kansas City|Miami|Philadelphia|Boston|New York|Santa Clara|Arlington|Foxborough|East Rutherford/.test(stadium)) return 'USA';
  return null;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

function formatProvider(key) {
  return {
    gemini: 'Gemini',
    chatgpt: 'ChatGPT',
    deepseek: 'DeepSeek',
    oddsApi: 'Odds API',
    apiFootball: 'API-Football',
    footballData: 'Football-Data',
  }[key];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value) {
  return Math.round(value * 100) / 100;
}
