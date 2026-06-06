import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <nav className="bg-gray-800 px-4 py-4 border-b border-gray-700 flex items-center justify-between flex-wrap">
        <Link href="/" className="text-white font-bold text-xl flex items-center gap-2">
          🏆 World Cup AI Predictor
        </Link>
        <div className="flex gap-6 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
          <Link href="/predict" className="text-gray-400 hover:text-white transition-colors">Match Predictor</Link>
          <Link href="/groupstage" className="text-gray-400 hover:text-white transition-colors">Group Stage</Link>
          <Link href="/champion" className="text-gray-400 hover:text-white transition-colors">Champion</Link>
          <Link href="/settings" className="text-gray-400 hover:text-white transition-colors">⚙️ Settings</Link>
          <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
          <Link href="/howto" className="text-gray-400 hover:text-white transition-colors">Tutorial</Link>
          
          {isLoggedIn ? (
            <>
              <span className="text-gray-300 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
                <span>{user?.username}</span>
              </span>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
              <Link href="/register" className="text-purple-400 hover:text-purple-300 transition-colors">Register</Link>
            </>
          )}
        </div>
      </nav>
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-800 px-4 py-6 text-center text-gray-500 border-t border-gray-700">
        <p>© 2026 World Cup AI Predictor | Powered by Multiple AI Models</p>
      </footer>
    </div>
  );
}
