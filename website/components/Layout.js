import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { clearAuthSession, getAuthState } from '../lib/auth-client';
import ChineseLocalizer from './ChineseLocalizer';

const publicPaths = ['/', '/login', '/register', '/admin-login'];

const publicNavItems = [
  { href: '/', label: 'Home' },
];

const privateNavItems = [
  { href: '/', label: 'Home' },
  { href: '/predict', label: 'Match Predictor' },
  { href: '/groupstage', label: 'Group Stage' },
  { href: '/champion', label: 'Champion' },
  { href: '/howto', label: 'Tutorial' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/settings', label: 'Settings' },
];

export default function Layout({ children }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const isPublicPage = publicPaths.includes(router.pathname || '/');

  useEffect(() => {
    const state = getAuthState();
    setIsLoggedIn(state.authed);
    setUser(state.user);
    setAuthChecked(true);
  }, [router.pathname]);

  const navItems = useMemo(() => {
    if (isPublicPage) return publicNavItems;
    return isLoggedIn ? privateNavItems : publicNavItems;
  }, [isLoggedIn, isPublicPage]);

  const handleLogout = () => {
    clearAuthSession();
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
  };

  const showPrivateControls = authChecked && isLoggedIn && !isPublicPage;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <ChineseLocalizer />
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 text-lg font-bold tracking-tight text-white">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-emerald-500 text-slate-950">WC</span>
            <span>World Cup AI Predictor</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-sm md:gap-5">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-slate-300 transition-colors hover:text-white">
                {item.label}
              </Link>
            ))}

            {showPrivateControls ? (
              <>
                <span className="hidden items-center gap-2 text-slate-200 sm:flex">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-sm font-bold text-slate-950">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                  <span>{user?.username || 'User'}</span>
                </span>
                <button onClick={handleLogout} className="text-slate-300 transition-colors hover:text-red-300">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-slate-300 transition-colors hover:text-white">Login</Link>
                <Link href="/register" className="rounded-md bg-white px-3 py-2 font-semibold text-slate-950 transition hover:bg-emerald-200">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/10 bg-slate-950 px-4 py-6 text-center text-sm text-slate-500">
        <p>Copyright 2026 World Cup AI Predictor. Football analytics and probability research only. Not betting advice. 18+ only.</p>
      </footer>
    </div>
  );
}
