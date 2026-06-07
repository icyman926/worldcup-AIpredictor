import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { GROUP_STAGES } from '../lib/predictor';

const venueOptions = [
  { id: 'home', label: 'Home advantage' },
  { id: 'neutral', label: 'Neutral venue' },
  { id: 'away', label: 'Away context' },
];

export default function Predict() {
  const [teams, setTeams] = useState([]);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [venue, setVenue] = useState('neutral');
  const [matchInfo, setMatchInfo] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/teams')
      .then((res) => res.json())
      .then(setTeams)
      .catch(() => setError('Could not load team data.'));
  }, []);

  const selected = useMemo(() => {
    return {
      home: teams.find((team) => team.name === homeTeam),
      away: teams.find((team) => team.name === awayTeam),
    };
  }, [awayTeam, homeTeam, teams]);

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

  const handlePredict = async () => {
    if (!homeTeam || !awayTeam || homeTeam === awayTeam) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/predict/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ home_team: homeTeam, away_team: awayTeam, venue }),
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
            <h1 className="mt-3 text-4xl font-bold text-white">Compare two teams</h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Select a fixture or any two teams to generate probabilities, expected goals, and model-level explanations.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 md:p-8">
            <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-end">
              <TeamSelect label="Team A" value={homeTeam} onChange={setHomeTeam} teams={teams} />
              <div className="pb-3 text-center text-2xl font-black text-slate-500">VS</div>
              <TeamSelect label="Team B" value={awayTeam} onChange={setAwayTeam} teams={teams} />
            </div>

            {matchInfo && (
              <div className="mt-6 grid gap-4 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm md:grid-cols-3">
                <Info label="Date" value={formatDate(matchInfo.date)} />
                <Info label="Kickoff" value={matchInfo.time} />
                <Info label="Stadium" value={matchInfo.stadium} />
              </div>
            )}

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
            </div>
          )}
        </div>
      </div>
    </Layout>
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
          <option key={team.id} value={team.name}>{team.flag} {team.name} - Group {team.group}</option>
        ))}
      </select>
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
      {data.interpretation && <p className="mt-3 text-xs text-slate-500">{data.interpretation}</p>}
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
