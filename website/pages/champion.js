import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Champion() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/predict/champion')
      .then(res => res.json())
      .then(data => {
        setPredictions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch predictions:', err);
        setLoading(false);
      });
  }, []);

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  const getPotColor = (pot) => {
    if (pot === 1) return 'bg-yellow-900/30 border-yellow-800';
    if (pot === 2) return 'bg-gray-700/30 border-gray-600';
    if (pot === 3) return 'bg-orange-900/30 border-orange-800';
    return 'bg-gray-800/30 border-gray-700';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">🏆 冠军预测</h1>
            <p className="text-gray-400">基于AI分析的2026年世界杯夺冠概率排名</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 animate-spin">⚽</div>
              <p className="text-gray-400">正在计算夺冠概率...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {predictions.map((team, index) => (
                <div 
                  key={team.team_id}
                  className={`bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border transition-all hover:scale-[1.02] ${getPotColor(team.pot)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-gray-400 w-12 text-center">
                        {getMedalEmoji(index)}
                      </div>
                      <div className="text-5xl">{team.flag}</div>
                      <div>
                        <div className="text-xl font-bold text-white">{team.name}</div>
                        <div className="text-sm text-gray-400">
                          {team.group}组 · Elo: {team.elo} · 种子队: {team.pot}档
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">{team.probability}%</div>
                      <div className="text-sm text-gray-400">夺冠概率</div>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"
                      style={{ width: `${team.probability}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 bg-gray-800/50 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">📊 预测说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-400 text-sm">
              <div>
                <p><strong>数据来源：</strong>基于各队Elo评级、历史战绩、分组形势等因素综合分析</p>
              </div>
              <div>
                <p><strong>权重分配：</strong>赔率分析40%、泊松模型25%、Elo评级20%、定性因素15%</p>
              </div>
              <div>
                <p><strong>种子队优势：</strong>1档种子队获得15%加成，4档种子队获得5%减益</p>
              </div>
              <div>
                <p><strong>赛区加成：</strong>欧洲(UEFA)和南美(CONMEBOL)球队获得10%加成</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
