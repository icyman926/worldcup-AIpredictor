import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Settings() {
  const [geminiKey, setGeminiKey] = useState('');
  const [chatgptKey, setChatgptKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('apiKeys');
    if (saved) {
      const keys = JSON.parse(saved);
      setGeminiKey(keys.gemini || '');
      setChatgptKey(keys.chatgpt || '');
      setDeepseekKey(keys.deepseek || '');
    }
  }, []);

  const saveKeys = () => {
    const keys = {
      gemini: geminiKey,
      chatgpt: chatgptKey,
      deepseek: deepseekKey
    };
    localStorage.setItem('apiKeys', JSON.stringify(keys));
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">⚙️ AI API Settings</h1>
            <p className="text-gray-400">Configure your API keys for enhanced AI predictions</p>
          </div>

          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 mb-8 border border-blue-700">
            <h3 className="text-lg font-bold text-blue-400 mb-3">💡 Current Prediction Status</h3>
            <p className="text-gray-300">
              <strong>Local Models Active:</strong> The prediction system currently uses local AI models (Elo, Poisson, Odds Analysis) 
              which work without external API keys. For enhanced accuracy and advanced analysis features, configure your AI API keys below.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">🌌</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Google Gemini</h3>
                  <p className="text-gray-400 text-sm">Advanced match analysis and real-time data processing</p>
                </div>
              </div>
              <div className="flex gap-4">
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="Enter Gemini API Key..."
                  className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
                <span className="text-gray-500 text-sm self-center w-32 text-right">AIzaSy...</span>
              </div>
              <div className="mt-3 text-xs text-gray-500">Get API key from: https://ai.google.dev/</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">💬</div>
                <div>
                  <h3 className="text-xl font-bold text-white">OpenAI ChatGPT</h3>
                  <p className="text-gray-400 text-sm">Enhanced match prediction and probability analysis</p>
                </div>
              </div>
              <div className="flex gap-4">
                <input
                  type="password"
                  value={chatgptKey}
                  onChange={(e) => setChatgptKey(e.target.value)}
                  placeholder="Enter ChatGPT API Key..."
                  className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
                <span className="text-gray-500 text-sm self-center w-32 text-right">sk-proj-...</span>
              </div>
              <div className="mt-3 text-xs text-gray-500">Get API key from: https://platform.openai.com/</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">🔍</div>
                <div>
                  <h3 className="text-xl font-bold text-white">DeepSeek</h3>
                  <p className="text-gray-400 text-sm">Specialized odds analysis and market prediction</p>
                </div>
              </div>
              <div className="flex gap-4">
                <input
                  type="password"
                  value={deepseekKey}
                  onChange={(e) => setDeepseekKey(e.target.value)}
                  placeholder="Enter DeepSeek API Key..."
                  className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
                <span className="text-gray-500 text-sm self-center w-32 text-right">sk-...</span>
              </div>
              <div className="mt-3 text-xs text-gray-500">Get API key from: https://platform.deepseek.com/</div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={saveKeys}
                className="px-12 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-green-500 hover:to-blue-500 transition-all shadow-lg hover:shadow-green-500/25"
              >
                {saveStatus ? '✅ ' + saveStatus : '💾 Save API Keys'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-white font-medium">Local Models</div>
                <div className="text-green-400 text-sm">✓ Active</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">🤖</div>
                <div className="text-white font-medium">AI Enhancements</div>
                <div className="text-yellow-400 text-sm">Optional</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">🔒</div>
                <div className="text-white font-medium">Data Security</div>
                <div className="text-blue-400 text-sm">Local Storage</div>
              </div>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-6 mt-6">
              <h4 className="text-yellow-400 font-bold mb-2">⚠️ Important Note</h4>
              <p className="text-yellow-200 text-sm">
                Your API keys are stored locally in your browser's localStorage and are never transmitted to our servers. 
                Local prediction models work without API keys, but adding keys will enable enhanced AI features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
