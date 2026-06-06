import { useState } from 'react';
import Layout from '../components/Layout';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const user = {
      username,
      email,
      password,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('user', JSON.stringify(user));
    setSuccess('Registration successful! You can now login.');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-4xl font-bold text-white mb-4">Create Account</h1>
            <p className="text-gray-400">Join the World Cup prediction community</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 text-center">
                <span className="text-red-400">⚠️ {error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-6 text-center">
                <span className="text-green-400">✅ {success}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-gray-300 font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username..."
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email..."
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password..."
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg hover:shadow-purple-500/25"
              >
                🚀 Create Account
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-gray-400">Already have an account? </span>
              <a href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                Login here
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
