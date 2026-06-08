import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/Layout';

const steps = [
  ['Register and verify 18+', 'Create an account before using prediction tools. Public access is intentionally limited to the Home page.'],
  ['Configure data sources', 'Add optional keys for Gemini, ChatGPT, DeepSeek, Odds API, API-Football, and Football-Data in Settings.'],
  ['Select teams and odds', 'Choose a match, review the team profiles, and enter decimal odds if you have bookmaker or API data.'],
  ['Read the model output', 'Compare final probabilities with Elo, Poisson, and odds breakdowns. Treat all results as probabilistic research.'],
  ['Upgrade the backend later', 'Move users, API keys, jobs, and reports to a VPS database and server API before charging real customers.'],
];

export default function HowTo() {
  return (
    <Layout>
      <Head><title>Tutorial - World Cup AI Predictor</title></Head>
      <div className="min-h-screen bg-slate-950 px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Tutorial</p>
            <h1 className="mt-3 text-4xl font-bold text-white">How to use the platform</h1>
            <p className="mt-4 max-w-3xl leading-7 text-slate-400">
              A practical workflow for a compliant analytics product, from free demo to API-backed paid tiers.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map(([title, body], index) => (
              <div key={title} className="flex gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <div className="grid h-10 w-10 flex-none place-items-center rounded-md bg-emerald-400 font-black text-slate-950">{index + 1}</div>
                <div>
                  <h2 className="text-xl font-bold text-white">{title}</h2>
                  <p className="mt-2 leading-7 text-slate-400">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/predict" className="rounded-md bg-white px-5 py-3 text-center font-bold text-slate-950 transition hover:bg-emerald-200">
              Open predictor
            </Link>
            <Link href="/pricing" className="rounded-md border border-white/15 px-5 py-3 text-center font-bold text-white transition hover:bg-white/10">
              View pricing strategy
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
