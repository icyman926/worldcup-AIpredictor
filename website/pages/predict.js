import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Predict() {
  const [teams, setTeams] = useState([]);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [venue, setVenue] = useState('neutral');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/teams')
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error('Failed to fetch teams:', err));
  }, []);

  const handlePredict = async () => {
    if (!homeTeam || !awayTeam) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/predict/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          home_team: homeTeam,
          away_team: awayTeam
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const homeTeamData = teams.find(t => t.name === homeTeam);
  const awayTeamData = teams.find(t => t.name === awayTeam);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">⚽ 比赛预测</h1>
            <p className="text-gray-400">选择两支球队，AI将预测比赛结果</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="space-y-4">
                <label className="block text-gray-300 font-medium">主场球队</label>
                <select
                  value={homeTeam}
                  onChange={(e) => setHomeTeam(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                >
                  <option value="">选择球队...</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.name}>
                      {team.flag} {team.name} ({team.group}组)
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-center">
                <span className="text-4xl font-bold text-white">VS</span>
              </div>

              <div className="space-y-4">
                <label className="block text-gray-300 font-medium">客场球队</label>
                <select
                  value={awayTeam}
                  onChange={(e) => setAwayTeam(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                >
                  <option value="">选择球队...</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.name}>
                      {team.flag} {team.name} ({team.group}组)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setVenue('home')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    venue === 'home' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  🏠 主场优势
                </button>
                <button
                  onClick={() => setVenue('neutral')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    venue === 'neutral' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  ⚖️ 中立场地
                </button>
                <button
                  onClick={() => setVenue('away')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    venue === 'away' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  🚗 客场挑战
                </button>
              </div>

              <button
                onClick={handlePredict}
                disabled={loading || !homeTeam || !awayTeam || homeTeam === awayTeam}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-purple-500/25"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> 预测中...
                  </span>
                ) : (
                  '🎯 开始预测'
                )}
              </button>
            </div>

            {homeTeam === awayTeam && homeTeam && (
              <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-center">
                <span className="text-red-400">⚠️ 请选择两支不同的球队进行预测</span>
              </div>
            )}
          </div>

          {result && (
            <div className="space-y-8">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">预测结果</h2>
                
                <div className="flex justify-center items-center gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-6xl mb-2">{homeTeamData?.flag || '🏆'}</div>
                    <div className="text-xl font-bold text-white">{homeTeam}</div>
                    <div className="text-gray-400 text-sm">Elo: {homeTeamData?.elo || 'N/A'}</div>
                  </div>
                  <div className="text-3xl font-bold text-gray-500">VS</div>
                  <div className="text-center">
                    <div className="text-6xl mb-2">{awayTeamData?.flag || '🏆'}</div>
                    <div className="text-xl font-bold text-white">{awayTeam}</div>
                    <div className="text-gray-400 text-sm">Elo: {awayTeamData?.elo || 'N/A'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-green-900/30 rounded-xl p-6 text-center border border-green-800">
                    <div className="text-green-400 text-sm mb-2">🏠 主胜</div>
                    <div className="text-4xl font-bold text-white">{result.probabilities.home}%</div>
                    <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-1000"
                        style={{ width: `${result.probabilities.home}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-yellow-900/30 rounded-xl p-6 text-center border border-yellow-800">
                    <div className="text-yellow-400 text-sm mb-2">⚖️ 平局</div>
                    <div className="text-4xl font-bold text-white">{result.probabilities.draw}%</div>
                    <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-1000"
                        style={{ width: `${result.probabilities.draw}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-red-900/30 rounded-xl p-6 text-center border border-red-800">
                    <div className="text-red-400 text-sm mb-2">🚗 客胜</div>
                    <div className="text-4xl font-bold text-white">{result.probabilities.away}%</div>
                    <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-1000"
                        style={{ width: `${result.probabilities.away}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mb-8">
                  <div className="bg-gray-700/50 rounded-lg px-6 py-3">
                    <span className="text-gray-400 text-sm">预期进球</span>
                    <div className="text-xl font-bold text-white">
                      {result.expected_goals.home} : {result.expected_goals.away}
                    </div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg px-6 py-3">
                    <span className="text-gray-400 text-sm">置信度</span>
                    <div className="text-xl font-bold text-purple-400">{result.confidence}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">📊 最可能比分</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {result.most_likely_scores.map((item, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">{item.score}</div>
                      <div className="text-sm text-gray-400">概率: {item.probability}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-blue-400 mb-4">📈 Elo模型</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">主胜</span>
                      <span className="text-white font-medium">{result.model_breakdown.elo.home}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">平局</span>
                      <span className="text-white font-medium">{result.model_breakdown.elo.draw}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">客胜</span>
                      <span className="text-white font-medium">{result.model_breakdown.elo.away}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-green-400 mb-4">⚽ 泊松模型</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">主胜</span>
                      <span className="text-white font-medium">{result.model_breakdown.poisson.home}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">平局</span>
                      <span className="text-white font-medium">{result.model_breakdown.poisson.draw}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">客胜</span>
                      <span className="text-white font-medium">{result.model_breakdown.poisson.away}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-yellow-400 mb-4">💰 赔率分析</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">主胜</span>
                      <span className="text-white font-medium">{result.model_breakdown.odds.home}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">平局</span>
                      <span className="text-white font-medium">{result.model_breakdown.odds.draw}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">客胜</span>
                      <span className="text-white font-medium">{result.model_breakdown.odds.away}%</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="text-sm text-gray-400">解读: {result.model_breakdown.odds.interpretation}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
