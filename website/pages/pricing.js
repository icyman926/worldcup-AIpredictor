import Link from 'next/link';
import Layout from '../components/Layout';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    audience: 'Fans and early testers',
    features: [
      'Basic match probabilities',
      'Elo and Poisson model output',
      'Group fixtures and champion ranking',
      'Limited manual odds analysis',
    ],
    cta: 'Start free',
    href: '/register',
  },
  {
    name: 'Pro',
    price: '$9.90/mo',
    audience: 'Power users and content creators',
    features: [
      'Advanced odds interpretation',
      'European odds and Asian handicap notes',
      'Saved prediction history',
      'Shareable analysis reports',
    ],
    cta: 'Join waitlist',
    href: '/register',
  },
  {
    name: 'Analyst',
    price: '$29/mo',
    audience: 'Analysts, communities, and operators',
    features: [
      'API-assisted data refresh',
      'Injury, lineup, H2H, and news modules',
      'Batch match analysis',
      'Exportable reports',
    ],
    cta: 'Request access',
    href: '/register',
  },
  {
    name: 'Business',
    price: 'Custom',
    audience: 'E-commerce, media, and branded campaigns',
    features: [
      'Custom dashboards',
      'White-label report pages',
      'Private backend deployment',
      'Commercial support',
    ],
    cta: 'Contact admin',
    href: '/admin-login',
  },
];

export default function Pricing() {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Pricing strategy</p>
            <h1 className="mt-3 text-4xl font-bold text-white">Start open, charge for deeper intelligence.</h1>
            <p className="mt-4 leading-7 text-slate-400">
              The public product can stay useful for free users while advanced odds, API-backed data, automation, reports, and business workflows become paid tiers.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            {tiers.map((tier) => (
              <div key={tier.name} className="flex flex-col rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">{tier.audience}</div>
                <h2 className="mt-3 text-2xl font-bold text-white">{tier.name}</h2>
                <div className="mt-2 text-3xl font-black text-emerald-300">{tier.price}</div>
                <ul className="mt-5 flex-1 space-y-3 text-sm leading-6 text-slate-400">
                  {tier.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                <Link href={tier.href} className="mt-6 rounded-md bg-white px-4 py-3 text-center font-bold text-slate-950 transition hover:bg-emerald-200">
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-amber-300/20 bg-amber-300/10 p-5">
            <h2 className="text-xl font-bold text-white">Compliance positioning</h2>
            <p className="mt-3 leading-7 text-amber-50/80">
              This product should sell football analytics, not betting instructions. Keep 18+ gating, avoid profit guarantees, never imply inside information, and present all outputs as probabilistic research.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
