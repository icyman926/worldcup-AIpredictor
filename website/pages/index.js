import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const features = [
  {
    title: 'Transparent probabilities',
    body: 'Compare national teams and inspect win, draw, scoreline, and confidence outputs without black-box claims.',
  },
  {
    title: 'Odds-first analytics',
    body: 'Use bookmaker odds as the key market signal, then normalize implied probabilities and show the margin.',
  },
  {
    title: 'API-ready framework',
    body: 'Prepare Gemini, ChatGPT, DeepSeek, Odds API, API-Football, and Football-Data integrations for deeper tiers.',
  },
];

const modelCards = [
  ['Free core', 'Elo + Poisson + fixtures'],
  ['Pro layer', 'Odds and handicap analysis'],
  ['Analyst layer', 'API-backed data refresh'],
  ['Business layer', 'Reports and white-label workflows'],
];

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>World Cup AI Predictor</title>
        <meta
          name="description"
          content="World Cup 2026 football analytics platform with match, odds, group-stage, and champion probability tools."
        />
      </Head>

      <section className="bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_34%),linear-gradient(135deg,#020617_0%,#111827_52%,#172554_100%)] px-4 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div>
            <div className="mb-5 inline-flex rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-200">
              Football analytics for World Cup 2026
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal text-white md:text-6xl">
              Build trust with clear football probabilities.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Explore fixtures, odds signals, model outputs, and report-ready analysis. Free users get the core model; advanced data belongs in paid tiers.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="rounded-md bg-emerald-400 px-6 py-3 text-center font-bold text-slate-950 transition hover:bg-emerald-300">
                Create free account
              </Link>
              <Link href="/pricing" className="rounded-md border border-white/20 px-6 py-3 text-center font-bold text-white transition hover:bg-white/10">
                View pricing plan
              </Link>
            </div>
            <p className="mt-5 text-sm text-slate-500">18+ only. Analytics and research, not betting advice.</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-slate-400">Commercial product map</p>
                <h2 className="text-2xl font-bold text-white">Open core, paid intelligence</h2>
              </div>
              <span className="rounded-md bg-emerald-400/15 px-3 py-2 text-sm font-bold text-emerald-200">SaaS-ready</span>
            </div>
            <div className="space-y-4">
              {[
                ['Free public value', '65%', 'bg-emerald-400'],
                ['Pro analytics upside', '25%', 'bg-amber-300'],
                ['Business customization', '10%', 'bg-sky-400'],
              ].map(([label, value, color]) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-300">{label}</span>
                    <span className="font-bold text-white">{value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className={`h-2 rounded-full ${color}`} style={{ width: value }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {modelCards.map(([title, body]) => (
                <div key={title} className="rounded-md border border-white/10 bg-slate-950/40 p-4">
                  <div className="font-semibold text-white">{title}</div>
                  <div className="mt-1 text-sm text-slate-400">{body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold text-white">What the platform should become</h2>
              <p className="mt-2 text-slate-400">A focused product path from public demo to paid analytics.</p>
            </div>
            <Link href="/settings" className="text-sm font-bold text-emerald-300 hover:text-emerald-200">
              Configure data sources
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-400">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
