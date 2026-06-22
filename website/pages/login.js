import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { createOwnerUser, findRegisteredUser, getAuthState, isOwnerCredentials, setAuthSession } from '../lib/auth-client';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function createDirectLoginUser(email, password) {
  const safeEmail = normalizeEmail(email);
  const username = safeEmail.split('@')[0] || 'Member';
  return {
    username,
    email: safeEmail,
    password,
    dateOfBirth: '',
    ageVerified: true,
    plan: 'Free',
    role: 'member',
    directLogin: true,
    createdAt: new Date().toISOString(),
  };
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [confirm18, setConfirm18] = useState(false);
  const [isLocalHost, setIsLocalHost] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLocalHost(['localhost', '127.0.0.1'].includes(window.location.hostname));
    const state = getAuthState();
    if (state.authed) {
      router.replace(router.query.next || '/predict');
    }
  }, [router]);

  const goNext = () => {
    router.push(router.query.next || '/settings');
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setError('');

    if (isOwnerCredentials(email, password)) {
      setAuthSession(createOwnerUser());
      goNext();
      return;
    }

    const user = findRegisteredUser(email) || getAuthState().user;

    if (!user) {
      if (!confirm18) {
        setError('Please confirm that you are 18 or older before opening the analytics workspace.');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      setAuthSession(createDirectLoginUser(email, password));
      goNext();
      return;
    }

    if (user.email === email.trim().toLowerCase() && user.password === password && user.ageVerified) {
      setAuthSession(user);
      goNext();
      return;
    }

    if (confirm18 && password.length >= 6) {
      setAuthSession(createDirectLoginUser(email, password));
      goNext();
      return;
    }

    setError('Invalid email, password, or 18+ access status.');
  };

  const handleOwnerAccess = () => {
    const owner = createOwnerUser();
    setAuthSession(owner);
    goNext();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 px-4 py-10">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Member workspace</p>
            <h1 className="mt-3 text-4xl font-bold text-white">Welcome back</h1>
            <p className="mt-3 text-slate-400">Sign in directly with email and password. First-time users can open a basic 18+ analytics session from this page; owner access is available on every deployment.</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
            {error && <div className="mb-5 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-red-200">{error}</div>}
            <form onSubmit={handleLogin} className="space-y-5">
              <Field label="Email" type="email" value={email} onChange={setEmail} />
              <Field label="Password" type="password" value={password} onChange={setPassword} />              <label className="flex gap-3 rounded-md border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
                <input
                  type="checkbox"
                  checked={confirm18}
                  onChange={(event) => setConfirm18(event.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span>I confirm that I am 18 or older and understand this platform provides football analytics and probability research only, not betting advice.</span>
              </label>


              <button className="w-full rounded-md bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-200">
                Sign in
              </button>
            </form>

            {isLocalHost && (
              <button
                type="button"
                onClick={handleOwnerAccess}
                className="mt-3 w-full rounded-md border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 font-bold text-emerald-100 transition hover:bg-emerald-400/20"
              >
                Local owner access
              </button>
            )}

            <p className="mt-5 text-center text-sm text-slate-400">
              Prefer a full profile? <a href="/register" className="font-bold text-emerald-300">Register here</a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Field({ label, type, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
      />
    </label>
  );
}
