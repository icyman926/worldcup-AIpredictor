import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const defaults = {
  odds: 40,
  poisson: 25,
  elo: 20,
  qualitative: 15,
};

export default function Settings() {
  const [settings, setSettings] = useState(defaults);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('modelSettings');
    if (saved) {
      try {
        setSettings({ ...defaults, ...JSON.parse(saved) });
      } catch {
        localStorage.removeItem('modelSettings');
      }
    }
  }, []);

  const update = (key, value) => {
    setSettings((current) => ({ ...current, [key]: Number(value) }));
  };

  const save = () => {
    localStorage.setItem('modelSettings', JSON.stringify(settings));
    setSaveStatus('Saved locally');
    setTimeout(() => setSaveStatus(''), 1800);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Settings</p>
            <h1 className="mt-3 text-4xl font-bold text-white">Model preferences</h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Tune the visible model weights used for analysis notes. Core server predictions still use the production defaults until backend persistence is added.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <label className="text-lg font-bold capitalize text-white" htmlFor={key}>{key}</label>
                  <span className="rounded-md bg-slate-900 px-3 py-1 text-sm font-bold text-emerald-300">{value}%</span>
                </div>
                <input
                  id={key}
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={value}
                  onChange={(event) => update(key, event.target.value)}
                  className="w-full accent-emerald-400"
                />
                <p className="mt-3 text-sm leading-6 text-slate-400">{describeWeight(key)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-bold text-white">Total configured weight: {Object.values(settings).reduce((sum, value) => sum + value, 0)}%</div>
              <div className="mt-1 text-sm text-slate-400">Keep the total near 100% for easier interpretation.</div>
            </div>
            <button onClick={save} className="rounded-md bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-200">
              {saveStatus || 'Save settings'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function describeWeight(key) {
  const copy = {
    odds: 'Market signal when odds are supplied through the API.',
    poisson: 'Expected-goals and scoreline distribution model.',
    elo: 'Long-run team strength from rating differences.',
    qualitative: 'Small stabilizer for non-statistical context.',
  };
  return copy[key] || '';
}
