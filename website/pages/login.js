import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (event) => {
    event.preventDefault();
    setError('');

    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      setError('No local account found. Register first on this browser.');
      return;
    }

    const user = JSON.parse(savedUser);
    if (user.email === email && user.password === password) {
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/');
      return;
    }

    setError('Invalid email or password.');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 px-4 py-10">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white">Welcome back</h1>
            <p className="mt-3 text-slate-400">Sign in to your local prediction workspace.</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
            {error && <div className="mb-5 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-red-200">{error}</div>}
            <form onSubmit={handleLogin} className="space-y-5">
              <Field label="Email" type="email" value={email} onChange={setEmail} />
              <Field label="Password" type="password" value={password} onChange={setPassword} />
              <button className="w-full rounded-md bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-200">
                Sign in
              </button>
            </form>
            <p className="mt-5 text-center text-sm text-slate-400">
              No account yet? <a href="/register" className="font-bold text-emerald-300">Register here</a>
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
