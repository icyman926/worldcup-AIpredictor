import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const weightDefaults = {
  odds: 40,
  poisson: 25,
  elo: 20,
  qualitative: 15,
};

const apiDefaults = {
  gemini: '',
  chatgpt: '',
  deepseek: '',
  oddsApi: '',
  apiFootball: '',
  footballData: '',
};

const providers = [
  {
    key: 'gemini',
    name: 'Google Gemini',
    prefix: 'AIza...',
    role: 'Real-time news, injuries, locker-room sentiment, political and commercial context.',
  },
  {
    key: 'chatgpt',
    name: 'OpenAI ChatGPT',
    prefix: 'sk-proj-...',
    role: 'Structured reasoning, model explanation, scenario analysis, and report generation.',
  },
  {
    key: 'deepseek',
    name: 'DeepSeek',
    prefix: 'sk-...',
    role: 'Low-cost reasoning for odds movement notes and market interpretation.',
  },
  {
    key: 'oddsApi',
    name: 'The Odds API',
    prefix: 'odds...',
    role: 'Bookmaker decimal odds, implied probability, overround, and market direction.',
  },
  {
    key: 'apiFootball',
    name: 'API-Football',
    prefix: 'rapidapi...',
    role: 'Fixtures, squads, injuries, H2H, standings, and match events.',
  },
  {
    key: 'footballData',
    name: 'Football-Data.org',
    prefix: 'fd...',
    role: 'Historical match data for backtesting and baseline team form.',
  },
];

export default function Settings() {
  const [weights, setWeights] = useState(weightDefaults);
  const [apiKeys, setApiKeys] = useState(apiDefaults);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const savedWeights = localStorage.getItem('modelSettings');
    const savedKeys = localStorage.getItem('apiKeys');

    if (savedWeights) {
      try {
        setWeights({ ...weightDefaults, ...JSON.parse(savedWeights) });
      } catch {
        localStorage.removeItem('modelSettings');
      }
    }

    if (savedKeys) {
      try {
        setApiKeys({ ...apiDefaults, ...JSON.parse(savedKeys) });
      } catch {
        localStorage.removeItem('apiKeys');
      }
    }
  }, []);

  const updateWeight = (key, value) => {
    setWeights((current) => ({ ...current, [key]: Number(value) }));
  };

  const updateApiKey = (key, value) => {
    setApiKeys((current) => ({ ...current, [key]: value }));
  };

  const save = () => {
    localStorage.setItem('modelSettings', JSON.stringify(weights));
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
    setSaveStatus('Saved locally');
    setTimeout(() => setSaveStatus(''), 1800);
  };

  const configuredCount = Object.values(apiKeys).filter(Boolean).length;

  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">API & model settings</p>
            <h1 className="mt-3 text-4xl font-bold text-white">Data source control center</h1>
            <p className="mt-3 max-w-3xl text-slate-400">
              Connect LLM and football data providers for the full framework: odds analysis, big-data fixtures, team dynamics, injuries, H2H history, and market interpretation.
            </p>
          </div>

          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">API access</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Keys are stored in this browser only. A production backend should move them to Railway or Vercel environment variables before live API calls.
                </p>
              </div>
              <span className="rounded-md bg-slate-900 px-3 py-2 text-sm font-bold text-emerald-300">
                {configuredCount} / {providers.length} configured
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {providers.map((provider) => (
                <div key={provider.key} className="rounded-lg border border-white/10 bg-slate-900 p-4">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white">{provider.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{provider.role}</p>
                    </div>
                    <span className={`rounded-md px-2 py-1 text-xs font-bold ${apiKeys[provider.key] ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      {apiKeys[provider.key] ? 'Ready' : 'Optional'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      type="password"
                      value={apiKeys[provider.key]}
                      onChange={(event) => updateApiKey(provider.key, event.target.value)}
                      placeholder={`Paste ${provider.name} key`}
                      className="min-w-0 flex-1 rounded-md border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                    />
                    <span className="text-xs text-slate-500 sm:w-24 sm:text-right">{provider.prefix}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <h2 className="text-2xl font-bold text-white">Model weights</h2>
            <p className="mt-2 text-sm text-slate-400">
              Odds stays highest because bookmaker prices encode professional analysis and capital flow. Poisson and Elo provide model discipline when live APIs are missing.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {Object.entries(weights).map(([key, value]) => (
                <div key={key} className="rounded-lg border border-white/10 bg-slate-900 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <label className="text-lg font-bold capitalize text-white" htmlFor={key}>{key}</label>
                    <span className="rounded-md bg-slate-950 px-3 py-1 text-sm font-bold text-emerald-300">{value}%</span>
                  </div>
                  <input
                    id={key}
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={value}
                    onChange={(event) => updateWeight(key, event.target.value)}
                    className="w-full accent-emerald-400"
                  />
                  <p className="mt-3 text-sm leading-6 text-slate-400">{describeWeight(key)}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-6 flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-bold text-white">Total configured model weight: {Object.values(weights).reduce((sum, value) => sum + value, 0)}%</div>
              <div className="mt-1 text-sm text-slate-400">Current API keys are for interface readiness; live external calls can be added through backend routes next.</div>
            </div>
            <button onClick={save} className="rounded-md bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-200">
              {saveStatus || 'Save API keys and weights'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function describeWeight(key) {
  const copy = {
    odds: 'Bookmaker implied probability, overround removal, odds drift, and capital-flow signal.',
    poisson: 'Expected-goals and scoreline distribution model.',
    elo: 'Long-run team strength from rating differences.',
    qualitative: 'Injuries, locker-room state, coach style, referee tendency, H2H, and broader context.',
  };
  return copy[key] || '';
}
