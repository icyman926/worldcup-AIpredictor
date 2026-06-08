import { useEffect, useState } from 'react';
import Flag from '../components/Flag';
import Layout from '../components/Layout';

export default function Champion() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/predict/champion')
      .then((res) => res.json())
      .then((data) => setPredictions(data))
      .catch(() => setError('Could not load champion forecast.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Champion forecast</p>
            <h1 className="mt-3 text-4xl font-bold text-white">Tournament win probabilities</h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              A hybrid long-range ranking based on current strength rating, group path difficulty, recent momentum, confederation context, and light seeding adjustment.
            </p>
          </div>

          {loading && <div className="rounded-lg border border-white/10 bg-white/[0.04] p-10 text-center text-slate-300">Calculating probabilities...</div>}
          {error && <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4 text-red-200">{error}</div>}

          {!loading && !error && (
            <div className="space-y-3">
              {predictions.map((team, index) => (
                <div key={team.team_id} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 text-center text-2xl font-black text-slate-500">{index + 1}</div>
                      <Flag team={team} className="h-12 w-16" />
                      <div>
                        <div className="text-xl font-bold text-white">{team.name}</div>
                        <div className="text-sm text-slate-400">Group {team.group} · Elo {team.elo} · Pot {team.pot}</div>
                      </div>
                    </div>
                    <div className="md:text-right">
                      <div className="text-3xl font-black text-white">{team.probability}%</div>
                      <div className="text-sm text-slate-400">champion probability</div>
                    </div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-emerald-400" style={{ width: team.probability + '%' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">Method note</h2>
            <p className="mt-3 leading-7 text-slate-400">
              This page is an exploratory football analytics forecast, not betting advice. It is useful for comparing relative strength, but it should be updated as squads, injuries, form, odds markets, and verified news change.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
