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
  sportmonks: '',
  qwen: '',
  qwenModel: 'qwen3.7-plus',



};







const providers = [



  {



    key: 'gemini',



    name: 'Google Gemini',



    prefix: 'AIza...',



    role: 'Live qualitative context: injuries, squad depth, team dynamics, political/commercial uncertainty, and report notes.',



  },



  {



    key: 'chatgpt',



    name: 'OpenAI ChatGPT',



    prefix: 'sk-proj-...',



    role: 'Structured reasoning, scenario explanation, model audit notes, and report generation.',



  },



  {



    key: 'deepseek',



    name: 'DeepSeek',



    prefix: 'sk-...',



    role: 'DeepSeek V4 Pro reasoning for odds movement notes, market interpretation, and secondary context checks.',



  },



  {



    key: 'oddsApi',



    name: 'The Odds API',



    prefix: 'odds...',



    role: 'Bookmaker decimal odds, implied probability, overround, and market direction checks.',



  },



  {



    key: 'apiFootball',



    name: 'API-Football',



    prefix: 'rapidapi...',



    role: 'Fixtures, squads, injuries, H2H, standings, and match-event data.',



  },



  {



    key: 'footballData',



    name: 'Football-Data.org',



    prefix: 'fd...',



    role: 'Historical match data for backtesting and baseline team form.',



  },
  {
    key: 'qwen',
    name: 'Alibaba Qwen / Tongyi',
    prefix: 'sk-...',
    role: 'China-hosted context model for injuries, squad depth, tactical notes, team dynamics, commercial/political uncertainty, and report-ready evidence summaries.',
    modelKey: 'qwenModel',
    modelOptions: ['qwen3.7-plus', 'qwen3.7-max', 'qwen3-max-2026-01-23', 'qwen-plus', 'qwen-max', 'qwen-turbo', 'custom'],
  },
  {
    key: 'sportmonks',
    name: 'Sportmonks',
    prefix: 'sm...',
    role: 'Sportmonks Football API v3: national-team mapping, fixtures, H2H history, scores, lineups, sidelined players, rankings, and richer match evidence when your plan allows it.',
  },



];







export default function Settings() {



  const [weights, setWeights] = useState(weightDefaults);



  const [apiKeys, setApiKeys] = useState(apiDefaults);



  const [saveStatus, setSaveStatus] = useState('');



  const [testStatus, setTestStatus] = useState({});
  const [migrationText, setMigrationText] = useState('');
  const [migrationStatus, setMigrationStatus] = useState('');







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







  const testProvider = async (provider) => {



    const key = apiKeys[provider];



    if (!key) {



      setTestStatus((current) => ({ ...current, [provider]: { ok: false, text: 'Missing key' } }));



      return;



    }







    setTestStatus((current) => ({ ...current, [provider]: { ok: null, text: 'Testing...' } }));



    try {



      const response = await fetch('/api/integrations/test', {


        method: 'POST',


        headers: { 'Content-Type': 'application/json' },


        body: JSON.stringify({ provider, apiKey: key, qwenModel: apiKeys.qwenModel }),


      });


      const data = await readApiJson(response, 'Integration test API');



      setTestStatus((current) => ({



        ...current,



        [provider]: {



          ok: Boolean(data.ok),



          text: data.ok ? data.detail : data.error,



        },



      }));



    } catch (error) {



      setTestStatus((current) => ({ ...current, [provider]: { ok: false, text: error.message } }));



    }



  };







  const exportApiConfig = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      apiKeys,
      weights,
    };
    setMigrationText(JSON.stringify(payload, null, 2));
    setMigrationStatus('API configuration exported. Copy this JSON into the China server settings page, then import.');
  };

  const importApiConfig = () => {
    try {
      const payload = JSON.parse(migrationText || '{}');
      const nextKeys = payload.apiKeys || payload.keys || payload;
      const nextWeights = payload.weights || null;
      setApiKeys({ ...apiDefaults, ...nextKeys });
      localStorage.setItem('apiKeys', JSON.stringify({ ...apiDefaults, ...nextKeys }));
      if (nextWeights) {
        setWeights({ ...weightDefaults, ...nextWeights });
        localStorage.setItem('modelSettings', JSON.stringify({ ...weightDefaults, ...nextWeights }));
      }
      setMigrationStatus('Imported successfully. Keys are now stored for this browser and domain.');
    } catch (error) {
      setMigrationStatus('Import failed: ' + error.message);
    }
  };

  const clearApiConfig = () => {
    setApiKeys(apiDefaults);
    localStorage.removeItem('apiKeys');
    setMigrationStatus('API keys cleared on this browser.');
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



              Connect LLM and football data providers for the full framework. This is football analytics and probability research only, not betting advice.



            </p>



          </div>







          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 md:p-6">



            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">



              <div>



                <h2 className="text-2xl font-bold text-white">API access</h2>



                <p className="mt-2 text-sm text-slate-400">



                  Early MVP keys are stored in this browser. Production should move platform-owned keys to server environment variables.



                </p>



              </div>



              <span className="rounded-md bg-slate-900 px-3 py-2 text-sm font-bold text-emerald-300">



                {configuredCount} / {providers.length} configured



              </span>



            </div>







            <div className="grid gap-4 lg:grid-cols-2">



              {providers.map((provider) => (



                <ProviderCard



                  key={provider.key}



                  provider={provider}



                  value={apiKeys[provider.key]}



                  status={testStatus[provider.key]}



                  onChange={(value) => updateApiKey(provider.key, value)}



                  onTest={() => testProvider(provider.key)}
                  modelValue={provider.modelKey ? apiKeys[provider.modelKey] : ''}
                  onModelChange={(value) => provider.modelKey && updateApiKey(provider.modelKey, value)}



                />



              ))}



            </div>



          </section>          <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white">API configuration migration</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Browser-stored API keys are separated by domain. Use this panel to move keys from localhost or Vercel to the China server without committing secrets to GitHub.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
              <textarea
                value={migrationText}
                onChange={(event) => setMigrationText(event.target.value)}
                rows={7}
                placeholder="Paste exported API configuration JSON here"
                className="w-full rounded-md border border-white/10 bg-slate-950 px-4 py-3 font-mono text-sm text-slate-100 outline-none transition focus:border-emerald-400"
              />
              <div className="flex flex-col gap-3">
                <button type="button" onClick={exportApiConfig} className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 font-bold text-emerald-100 transition hover:bg-emerald-400/20">
                  Export current keys
                </button>
                <button type="button" onClick={importApiConfig} className="rounded-md bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-200">
                  Import pasted keys
                </button>
                <button type="button" onClick={clearApiConfig} className="rounded-md border border-red-400/30 px-5 py-3 font-bold text-red-200 transition hover:bg-red-400/10">
                  Clear browser keys
                </button>
              </div>
            </div>
            {migrationStatus && <div className="mt-4 rounded-md border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm text-cyan-100">{migrationStatus}</div>}
          </section>

          







          <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-5 md:p-6">



            <h2 className="text-2xl font-bold text-white">Model weights</h2>



            <p className="mt-2 text-sm text-slate-400">



              Odds remains the strongest market signal. Poisson, Elo, and qualitative context keep the model explainable when live data is incomplete.



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



              <div className="mt-1 text-sm text-slate-400">



                Test buttons call real provider endpoints. Qwen/Tongyi and DeepSeek are the China-server core path; Gemini and OpenAI remain international enhancements when reachable.



              </div>



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







async function readApiJson(response, label) {

  const raw = await response.text();

  try {

    return JSON.parse(raw);

  } catch {

    const preview = raw.replace(/\s+/g, ' ').slice(0, 160);

    throw new Error(label + ' returned non-JSON (HTTP ' + response.status + (response.redirected ? ', redirected' : '') + '). Preview: ' + preview);

  }

}



function ProviderCard({ provider, value, status, onChange, onTest, modelValue, onModelChange }) {



  return (



    <div className="rounded-lg border border-white/10 bg-slate-900 p-4">



      <div className="mb-3 flex items-start justify-between gap-4">



        <div>



          <h3 className="font-bold text-white">{provider.name}</h3>



          <p className="mt-1 text-sm leading-6 text-slate-400">{provider.role}</p>



        </div>



        <span className={value ? 'rounded-md bg-emerald-400 px-2 py-1 text-xs font-bold text-slate-950' : 'rounded-md bg-slate-800 px-2 py-1 text-xs font-bold text-slate-400'}>



          {value ? 'Ready' : 'Optional'}



        </span>



      </div>







      {provider.modelOptions && (
        <div className="mb-3 grid gap-2 sm:grid-cols-[180px_1fr] sm:items-center">
          <label className="text-sm font-semibold text-slate-300">Model</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={provider.modelOptions.includes(modelValue) ? modelValue : 'custom'}
              onChange={(event) => onModelChange(event.target.value === 'custom' ? '' : event.target.value)}
              className="rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400"
            >
              {provider.modelOptions.map((item) => (
                <option key={item} value={item}>{item === 'custom' ? 'Custom model ID' : item}</option>
              ))}
            </select>
            <input
              value={modelValue || ''}
              onChange={(event) => onModelChange(event.target.value)}
              placeholder="qwen3.7-plus or your Bailian model ID"
              className="flex-1 rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">



        <input



          type="password"



          value={value || ''}



          onChange={(event) => onChange(event.target.value)}



          placeholder={'Paste ' + provider.name + ' key'}



          className="min-w-0 flex-1 rounded-md border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"



        />



        <button



          type="button"



          onClick={onTest}



          className="rounded-md border border-white/15 px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/10"



        >



          Test



        </button>



        <span className="text-xs text-slate-500 sm:w-24 sm:text-right">{provider.prefix}</span>



      </div>







      {status && (



        <div className={statusClass(status)}>



          {status.text}



        </div>



      )}



    </div>



  );



}







function statusClass(status) {



  const base = 'mt-3 rounded-md border p-3 text-xs ';



  if (status.ok === true) return base + 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100';



  if (status.ok === null) return base + 'border-sky-400/30 bg-sky-400/10 text-sky-100';



  return base + 'border-red-400/30 bg-red-400/10 text-red-100';



}







function describeWeight(key) {



  const copy = {



    odds: 'Bookmaker implied probability, overround removal, odds drift, and capital-flow signal.',



    poisson: 'Expected-goals and scoreline distribution model.',



    elo: 'Long-run team strength from rating differences.',



    qualitative: 'Injuries, locker-room state, coach style, referee tendency, H2H, and broader context from connected LLMs/APIs.',



  };



  return copy[key] || '';



}



