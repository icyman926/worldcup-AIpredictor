import Head from 'next/head';
import Layout from '../components/Layout';

const sections = [
  {
    title: 'Current product',
    body: 'World Cup AI Predictor is a football analytics workspace for match probabilities, group-stage exploration, champion ranking, and odds interpretation.',
  },
  {
    title: 'What is live today',
    body: 'The current model uses Elo ratings, Poisson score probabilities, venue context, and optional odds inputs. Advanced real-time context requires connected APIs and backend services.',
  },
  {
    title: 'Commercial direction',
    body: 'The recommended business model is an open core with paid layers for live odds, API-backed data refresh, saved reports, analyst workflows, and business dashboards.',
  },
];

export default function About() {
  return (
    <Layout>
      <Head><title>About - World Cup AI Predictor</title></Head>
      <div className="min-h-screen bg-slate-950 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">About</p>
            <h1 className="mt-3 text-4xl font-bold text-white">A transparent football analytics platform.</h1>
            <p className="mt-4 max-w-3xl leading-7 text-slate-400">
              The goal is to provide explainable football probabilities while keeping compliance clear: research only, 18+ access, and no betting guarantees.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {sections.map((section) => (
              <div key={section.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
                <p className="mt-3 leading-7 text-slate-400">{section.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-bold text-white">Model transparency</h2>
            <p className="mt-3 leading-7 text-slate-400">
              Political context, capital influence, injuries, locker-room sentiment, referee tendencies, and tactical knowledge should only affect probabilities when evidence-backed data sources are connected. Until then, they are shown as planned framework modules rather than live claims.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
