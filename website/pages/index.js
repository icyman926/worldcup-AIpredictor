import Layout from '../components/Layout';
import Head from 'next/head';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>World Cup AI Predictor</title>
      </Head>
      
      <div className="text-center py-20 px-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-8xl mb-6">🏆</div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            World Cup AI Predictor
          </h1>
          <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
            Advanced AI-powered football match prediction system. Multiple predictive models for accurate match forecasting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/predict" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg hover:shadow-purple-500/25">
              Start Prediction
            </a>
            <a href="/howto" className="bg-transparent text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-purple-500 hover:bg-purple-500/10 transition-all">
              Learn How
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl text-center text-white mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 rounded-xl p-6 text-center hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl text-white mb-3">Real-time Analysis</h3>
            <p className="text-gray-400">Get up-to-date predictions based on the latest team form, player statistics, and historical data.</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 text-center hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">🔮</div>
            <h3 className="text-xl text-white mb-3">Multiple AI Models</h3>
            <p className="text-gray-400">Combined predictions from Elo rating system, Poisson distribution, and odds analysis for maximum accuracy.</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 text-center hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl text-white mb-3">Detailed Statistics</h3>
            <p className="text-gray-400">View comprehensive match statistics including expected goals, win probabilities, and confidence scores.</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 text-center hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-xl text-white mb-3">Global Coverage</h3>
            <p className="text-gray-400">Supports all 48 World Cup 2026 participating nations with comprehensive historical data.</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 text-center hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">⚽</div>
            <h3 className="text-xl text-white mb-3">Match Simulation</h3>
            <p className="text-gray-400">Simulate thousands of matches to generate accurate probability distributions.</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 text-center hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">📈</div>
            <h3 className="text-xl text-white mb-3">Performance Tracking</h3>
            <p className="text-gray-400">Track prediction accuracy over time and see how our models perform against real match outcomes.</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl text-white mb-10">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">1</div>
              <h4 className="text-white mb-2">Select Teams</h4>
              <p className="text-gray-400 text-sm">Choose two teams for comparison</p>
            </div>
            <div>
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">2</div>
              <h4 className="text-white mb-2">AI Analysis</h4>
              <p className="text-gray-400 text-sm">Multiple models analyze the data</p>
            </div>
            <div>
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">3</div>
              <h4 className="text-white mb-2">Generate Results</h4>
              <p className="text-gray-400 text-sm">Combine predictions for accuracy</p>
            </div>
            <div>
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">4</div>
              <h4 className="text-white mb-2">View Predictions</h4>
              <p className="text-gray-400 text-sm">Get detailed match forecasts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-10 text-center">
          <h2 className="text-3xl text-white mb-4">Ready to Make Your First Prediction?</h2>
          <p className="text-white/80 mb-8 text-lg">
            Join thousands of football enthusiasts who trust our AI predictions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/predict" className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all">
              Match Predictor
            </a>
            <a href="/champion" className="bg-black/30 text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white hover:bg-white/10 transition-all">
              🏆 Champion Prediction
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
