import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { GROUP_STAGES, WORLD_CUP_2026_TEAMS, getTeamById } from '../lib/predictor';

export default function GroupStage() {
  const [selectedGroup, setSelectedGroup] = useState('A');
  const [predictingMatch, setPredictingMatch] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  const currentGroupMatches = GROUP_STAGES.find(g => g.group === selectedGroup)?.matches || [];

  const handlePredictMatch = async (match) => {
    setPredictingMatch(match.id);
    try {
      const response = await fetch('/api/predict/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          home_team: getTeamById(match.team1)?.name,
          away_team: getTeamById(match.team2)?.name
        })
      });
      const data = await response.json();
      setPredictionResult({ match, result: data });
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setPredictingMatch(null);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">📅 小组赛赛程</h1>
            <p className="text-gray-400">选择小组查看比赛日程和场地信息</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {groups.map(group => (
              <button
                key={group}
                onClick={() => {
                  setSelectedGroup(group);
                  setPredictionResult(null);
                }}
                className={`px-6 py-3 rounded-lg font-bold text-lg transition-all ${
                  selectedGroup === group
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {group}组
              </button>
            ))}
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedGroup}组赛程</h2>
              <div className="flex gap-4">
                {WORLD_CUP_2026_TEAMS.filter(t => t.group === selectedGroup).map(team => (
                  <div key={team.id} className="flex items-center gap-2 bg-gray-700/50 px-3 py-2 rounded-lg">
                    <span className="text-2xl">{team.flag}</span>
                    <span className="text-white text-sm">{team.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {currentGroupMatches.map((match) => {
                const team1 = getTeamById(match.team1);
                const team2 = getTeamById(match.team2);
                
                return (
                  <div 
                    key={match.id}
                    className="bg-gray-700/30 rounded-xl p-6 border border-gray-600 hover:border-purple-500 transition-all"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="text-center md:text-left">
                        <div className="text-gray-400 text-sm mb-1">{formatDate(match.date)}</div>
                        <div className="text-white font-bold">{match.time}</div>
                      </div>

                      <div className="flex items-center justify-center gap-4">
                        <div className="text-center">
                          <div className="text-4xl mb-1">{team1?.flag}</div>
                          <div className="text-white text-sm">{team1?.name}</div>
                        </div>
                        <span className="text-2xl font-bold text-gray-500">VS</span>
                        <div className="text-center">
                          <div className="text-4xl mb-1">{team2?.flag}</div>
                          <div className="text-white text-sm">{team2?.name}</div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-gray-400 text-sm mb-1">🏟️ 场地</div>
                        <div className="text-white text-sm">{match.stadium}</div>
                      </div>

                      <div className="text-center">
                        <button
                          onClick={() => handlePredictMatch(match)}
                          disabled={predictingMatch === match.id}
                          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {predictingMatch === match.id ? (
                            <span className="flex items-center gap-2">
                              <span className="animate-spin">⏳</span> 预测中
                            </span>
                          ) : (
                            '🎯 预测'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {predictionResult && (
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">🔮 {predictionResult.match.id} 预测结果</h3>
              
              <div className="flex justify-center items-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-5xl mb-2">{getTeamById(predictionResult.match.team1)?.flag}</div>
                  <div className="text-xl font-bold text-white">{getTeamById(predictionResult.match.team1)?.name}</div>
                </div>
                <span className="text-3xl font-bold text-gray-500">VS</span>
                <div className="text-center">
                  <div className="text-5xl mb-2">{getTeamById(predictionResult.match.team2)?.flag}</div>
                  <div className="text-xl font-bold text-white">{getTeamById(predictionResult.match.team2)?.name}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-900/30 rounded-xl p-4 text-center border border-green-800">
                  <div className="text-green-400 text-sm">主胜</div>
                  <div className="text-3xl font-bold text-white">{predictionResult.result.probabilities.home}%</div>
                </div>
                <div className="bg-yellow-900/30 rounded-xl p-4 text-center border border-yellow-800">
                  <div className="text-yellow-400 text-sm">平局</div>
                  <div className="text-3xl font-bold text-white">{predictionResult.result.probabilities.draw}%</div>
                </div>
                <div className="bg-red-900/30 rounded-xl p-4 text-center border border-red-800">
                  <div className="text-red-400 text-sm">客胜</div>
                  <div className="text-3xl font-bold text-white">{predictionResult.result.probabilities.away}%</div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <div className="bg-gray-700/50 rounded-lg px-4 py-2">
                  <span className="text-gray-400 text-sm">预期进球</span>
                  <div className="text-lg font-bold text-white">
                    {predictionResult.result.expected_goals.home} : {predictionResult.result.expected_goals.away}
                  </div>
                </div>
                <div className="bg-gray-700/50 rounded-lg px-4 py-2">
                  <span className="text-gray-400 text-sm">置信度</span>
                  <div className="text-lg font-bold text-purple-400">{predictionResult.result.confidence}%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
