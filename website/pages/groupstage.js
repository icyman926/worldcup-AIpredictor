import { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { GROUP_STAGES, WORLD_CUP_2026_TEAMS, getTeamById } from '../lib/predictor';

const groups = GROUP_STAGES.map((group) => group.group);

export default function GroupStage() {
  const [selectedGroup, setSelectedGroup] = useState('A');
  const [predictingMatch, setPredictingMatch] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState('');

  const groupTeams = useMemo(
    () => WORLD_CUP_2026_TEAMS.filter((team) => team.group === selectedGroup),
    [selectedGroup]
  );
  const currentGroupMatches = GROUP_STAGES.find((group) => group.group === selectedGroup)?.matches || [];

  const handlePredictMatch = async (match) => {
    setPredictingMatch(match.id);
    setError('');
    try {
      const response = await fetch('/api/predict/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          home_team: getTeamById(match.team1)?.name,
          away_team: getTeamById(match.team2)?.name,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || 'Prediction failed');
      setPredictionResult({ match, result: data });
    } catch (err) {
      setError(err.message || 'Prediction failed.');
    } finally {
      setPredictingMatch(null);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Group stage</p>
            <h1 className="mt-3 text-4xl font-bold text-white">Fixtures by group</h1>
            <p className="mt-3 text-slate-400">Jump between all twelve groups and run a quick model forecast for any fixture.</p>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => {
                  setSelectedGroup(group);
                  setPredictionResult(null);
                  setError('');
                }}
                className={`rounded-md px-4 py-2 font-bold transition ${selectedGroup === group ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Group {group}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <h2 className="text-2xl font-bold text-white">Group {selectedGroup}</h2>
              <div className="flex flex-wrap gap-2">
                {groupTeams.map((team) => (
                  <span key={team.id} className="rounded-md bg-slate-900 px-3 py-2 text-sm text-slate-200">
                    {team.flag} {team.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {currentGroupMatches.map((match) => {
                const team1 = getTeamById(match.team1);
                const team2 = getTeamById(match.team2);
                return (
                  <div key={match.id} className="grid gap-4 rounded-lg border border-white/10 bg-slate-900 p-4 md:grid-cols-[0.8fr_1.3fr_1.2fr_auto] md:items-center">
                    <div>
                      <div className="text-sm text-slate-400">{formatDate(match.date)}</div>
                      <div className="font-bold text-white">{match.time}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <TeamBadge team={team1} />
                      <span className="font-black text-slate-600">VS</span>
                      <TeamBadge team={team2} />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">Stadium</div>
                      <div className="text-sm font-semibold text-slate-200">{match.stadium}</div>
                    </div>
                    <button
                      onClick={() => handlePredictMatch(match)}
                      disabled={predictingMatch === match.id}
                      className="rounded-md bg-white px-4 py-2 font-bold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {predictingMatch === match.id ? 'Predicting...' : 'Predict'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {error && <div className="mt-5 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-red-200">{error}</div>}

          {predictionResult && (
            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-2xl font-bold text-white">{predictionResult.match.id} prediction</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <Result label="Team 1 win" value={predictionResult.result.probabilities.home} />
                <Result label="Draw" value={predictionResult.result.probabilities.draw} />
                <Result label="Team 2 win" value={predictionResult.result.probabilities.away} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function TeamBadge({ team }) {
  return (
    <div className="min-w-0">
      <div className="truncate font-bold text-white">{team?.flag} {team?.name}</div>
      <div className="text-xs text-slate-500">Elo {team?.elo}</div>
    </div>
  );
}

function Result({ label, value }) {
  return (
    <div className="rounded-md bg-slate-900 p-4">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-black text-white">{value}%</div>
      <div className="mt-3 h-2 rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-emerald-400" style={{ width: value + '%' }} />
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
}
