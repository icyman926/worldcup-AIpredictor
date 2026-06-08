import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { calculateAge, setAuthSession } from '../lib/auth-client';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    confirm18: false,
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleRegister = (event) => {
    event.preventDefault();
    setMessage({ type: '', text: '' });

    if (calculateAge(form.dateOfBirth) < 18 || !form.confirm18) {
      setMessage({ type: 'error', text: 'You must be 18 or older to create an account.' });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (form.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    const user = {
      username: form.username,
      email: form.email,
      password: form.password,
      dateOfBirth: form.dateOfBirth,
      ageVerified: true,
      plan: 'Free',
      createdAt: new Date().toISOString(),
    };

    setAuthSession(user);
    setMessage({ type: 'success', text: 'Account created. Opening your analytics workspace...' });
    setTimeout(() => router.push('/predict'), 350);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 px-4 py-10">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">18+ access</p>
            <h1 className="mt-3 text-4xl font-bold text-white">Create free account</h1>
            <p className="mt-3 text-slate-400">Basic early-stage age gate. Production server auth comes later before paid plans.</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
            {message.text && (
              <div className={`mb-5 rounded-md border p-3 ${message.type === 'error' ? 'border-red-500/30 bg-red-500/10 text-red-200' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'}`}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleRegister} className="space-y-5">
              <Field label="Username" value={form.username} onChange={(value) => update('username', value)} />
              <Field label="Email" type="email" value={form.email} onChange={(value) => update('email', value)} />
              <Field label="Date of birth" type="date" value={form.dateOfBirth} onChange={(value) => update('dateOfBirth', value)} />
              <Field label="Password" type="password" value={form.password} onChange={(value) => update('password', value)} />
              <Field label="Confirm password" type="password" value={form.confirmPassword} onChange={(value) => update('confirmPassword', value)} />

              <label className="flex gap-3 rounded-md border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
                <input
                  required
                  type="checkbox"
                  checked={form.confirm18}
                  onChange={(event) => update('confirm18', event.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span>I confirm that I am 18 or older and understand this platform provides football analytics and probability research only, not betting advice.</span>
              </label>

              <button className="w-full rounded-md bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-200">
                Create free account
              </button>
            </form>
            <p className="mt-5 text-center text-sm text-slate-400">
              Already registered? <a href="/login" className="font-bold text-emerald-300">Login here</a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Field({ label, type = 'text', value, onChange }) {
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
