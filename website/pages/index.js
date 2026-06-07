import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const features = [
  {
    title: 'Match probabilities',
    body: 'Compare two national teams and get home win, draw, and away win probabilities from an ensemble model.',
  },
  {
    title: 'Group schedule',
    body: 'Browse all twelve groups, fixture dates, kickoff times, and stadiums from one clean screen.',
  },
  {
    title: 'Model breakdown',
    body: 'See how Elo ratings, Poisson goal modelling, and optional odds inputs shape the final forecast.',
  },
];

const modelCards = [
  ['Elo rating', 'Team strength baseline'],
  ['Poisson goals', 'Likely scorelines'],
  ['Odds analysis', 'Market signal when supplied'],
  ['Venue factor', 'Host-country context'],
];

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>World Cup AI Predictor</title>
        <meta
          name="description"
          content="World Cup 2026 match, group-stage, and champion probability forecasts powered by ensemble football models."
        />
      </Head>

      <section className="bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_34%),linear-gradient(135deg,#020617_0%,#111827_52%,#172554_100%)] px-4 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div>
            <div className="mb-5 inline-flex rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-200">
              World Cup 2026 forecasting workspace
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal text-white md:text-6xl">
              Turn fixtures into clear football probabilities.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Pick teams, review group fixtures, and inspect transparent model outputs before the World Cup begins.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/predict" className="rounded-md bg-emerald-400 px-6 py-3 text-center font-bold text-slate-950 transition hover:bg-emerald-300">
                Start Prediction
              </Link>
              <Link href="/groupstage" className="rounded-md border border-white/20 px-6 py-3 text-center font-bold text-white transition hover:bg-white/10">
                View Group Stage
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-slate-400">Featured simulation</p>
                <h2 className="text-2xl font-bold text-white">Brazil vs France</h2>
              </div>
              <span className="rounded-md bg-emerald-400/15 px-3 py-2 text-sm font-bold text-emerald-200">Neutral</span>
            </div>
            <div className="space-y-4">
              {[
                ['Brazil win', '37%', 'bg-emerald-400'],
                ['Draw', '27%', 'bg-amber-300'],
                ['France win', '36%', 'bg-sky-400'],
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
              <h2 className="text-3xl font-bold text-white">What you can do</h2>
              <p className="mt-2 text-slate-400">A focused set of tools for exploring the tournament.</p>
            </div>
            <Link href="/champion" className="text-sm font-bold text-emerald-300 hover:text-emerald-200">
              Open champion forecast
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
