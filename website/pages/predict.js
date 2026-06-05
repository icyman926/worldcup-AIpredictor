import Layout from '../components/Layout';
import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Predict() {
  const [teams, setTeams] = useState([]);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [venue, setVenue] = useState('neutral');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/teams')
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error('Failed to fetch teams:', err));
  }, []);

  const handlePredict = () => {
    if (!homeTeam || !awayTeam || homeTeam === awayTeam) {
      setError('Please select two different teams');
      return;
    }
    setError('');
    setLoading(true);
    
    fetch('/api/predict/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        home_team: homeTeam,
        away_team: awayTeam,
        home_odds: 2.5,
        draw_odds: 3.2,
        away_odds: 2.8,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setResult(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to get prediction');
        setLoading(false);
      });
  };

  const getTeamFlag = (teamName) => {
    const team = teams.find(t => t.name === teamName);
    return team ? team.flag : '';
  };

  return (
    <Layout>
      <Head><title>Predict - World Cup AI Predictor</title></Head>
      <div style={{maxWidth:'800px',margin:'0 auto',padding:'60px 20px'}}>
        <h1 style={{fontSize:'36px',marginBottom:'20px',textAlign:'center'}}>AI Match Predictor</h1>
        <p style={{color:'#999',textAlign:'center',marginBottom:'40px'}}>Select two teams and get AI-powered predictions</p>
        
        {error && (
          <div style={{background:'#ff6b6b',color:'#fff',padding:'15px',borderRadius:'8px',marginBottom:'20px',textAlign:'center'}}>
            {error}
          </div>
        )}
        
        <div style={{background:'#1a1a2e',borderRadius:'12px',padding:'40px'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:'20px',alignItems:'center',marginBottom:'30px'}}>
            <div>
              <label style={{display:'block',color:'#999',marginBottom:'8px',fontSize:'14px'}}>Home Team</label>
              <select 
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                style={{width:'100%',padding:'12px 16px',background:'#16213e',border:'1px solid #333',borderRadius:'8px',color:'#fff',fontSize:'16px',cursor:'pointer'}}
              >
                <option value="">Select team...</option>
                {teams.map(team => (
                  <option key={team.id} value={team.name}>{team.flag} {team.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{textAlign:'center',fontSize:'24px',fontWeight:'bold',color:'#667eea'}}>VS</div>
            
            <div>
              <label style={{display:'block',color:'#999',marginBottom:'8px',fontSize:'14px'}}>Away Team</label>
              <select 
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                style={{width:'100%',padding:'12px 16px',background:'#16213e',border:'1px solid #333',borderRadius:'8px',color:'#fff',fontSize:'16px',cursor:'pointer'}}
              >
                <option value="">Select team...</option>
                {teams.map(team => (
                  <option key={team.id} value={team.name}>{team.flag} {team.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{marginBottom:'30px'}}>
            <label style={{display:'block',color:'#999',marginBottom:'8px',fontSize:'14px'}}>Venue</label>
            <div style={{display:'flex',gap:'10px'}}>
              {[{value:'home',label:'Home Advantage'}, {value:'neutral',label:'Neutral'}, {value:'away',label:'Away Disadvantage'}].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setVenue(opt.value)}
                  style={{flex:1,padding:'10px 16px',background:venue === opt.value ? '#667eea' : '#16213e',border:'1px solid #333',borderRadius:'8px',color:'#fff',cursor:'pointer',transition:'background 0.2s'}}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            style={{width:'100%',padding:'16px',background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',border:'none',borderRadius:'8px',color:'#fff',fontSize:'18px',fontWeight:'bold',cursor:'pointer',transition:'transform 0.2s',opacity:loading ? 0.7 : 1}}
          >
            {loading ? (
              <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}>
                <svg style={{animation:'spin 1s linear infinite',width:'20px',height:'20px'}} viewBox="0 0 24 24" fill="none">
                  <circle style={{borderColor:'#fff',borderTopColor:'transparent'}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                </svg>
                Analyzing...
              </span>
            ) : (
              '⚡ Generate Prediction'
            )}
          </button>
        </div>

        {result && (
          <div style={{marginTop:'40px',background:'#1a1a2e',borderRadius:'12px',padding:'40px'}}>
            <h3 style={{fontSize:'24px',marginBottom:'30px',textAlign:'center',color:'#fff'}}>Prediction Results</h3>
            
            <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:'20px',alignItems:'center',marginBottom:'30px'}}>
              <div style={{textAlign:'center',padding:'20px',background:'#16213e',borderRadius:'8px'}}>
                <div style={{fontSize:'28px',fontWeight:'bold',color:'#fff',marginBottom:'10px'}}>
                  {getTeamFlag(result.home_team)} {result.home_team}
                </div>
                <div style={{fontSize:'48px',fontWeight:'bold',color:'#43e97b'}}>{result.probabilities.home}%</div>
                <div style={{color:'#999',fontSize:'14px'}}>Win Chance</div>
              </div>
              
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:'28px',fontWeight:'bold',color:'#fff',marginBottom:'10px'}}>Draw</div>
                <div style={{fontSize:'48px',fontWeight:'bold',color:'#ffd93d'}}>{result.probabilities.draw}%</div>
                <div style={{color:'#999',fontSize:'14px'}}>Draw Chance</div>
              </div>
              
              <div style={{textAlign:'center',padding:'20px',background:'#16213e',borderRadius:'8px'}}>
                <div style={{fontSize:'28px',fontWeight:'bold',color:'#fff',marginBottom:'10px'}}>
                  {getTeamFlag(result.away_team)} {result.away_team}
                </div>
                <div style={{fontSize:'48px',fontWeight:'bold',color:'#ff6b6b'}}>{result.probabilities.away}%</div>
                <div style={{color:'#999',fontSize:'14px'}}>Win Chance</div>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'30px'}}>
              <div style={{background:'#16213e',padding:'20px',borderRadius:'8px',textAlign:'center'}}>
                <div style={{color:'#999',fontSize:'14px',marginBottom:'5px'}}>Expected Goals</div>
                <div style={{fontSize:'32px',fontWeight:'bold',color:'#00d4ff'}}>{result.expected_goals.home}</div>
              </div>
              <div style={{background:'#16213e',padding:'20px',borderRadius:'8px',textAlign:'center'}}>
                <div style={{color:'#999',fontSize:'14px',marginBottom:'5px'}}>Expected Goals</div>
                <div style={{fontSize:'32px',fontWeight:'bold',color:'#ff6b6b'}}>{result.expected_goals.away}</div>
              </div>
            </div>

            <div style={{background:'#16213e',padding:'20px',borderRadius:'8px',marginBottom:'30px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'15px'}}>
                <span style={{color:'#999'}}>Overall Confidence</span>
                <span style={{fontSize:'24px',fontWeight:'bold',color:'#667eea'}}>{result.confidence}%</span>
              </div>
              <div style={{height:'8px',background:'#333',borderRadius:'4px',overflow:'hidden'}}>
                <div style={{height:'100%',width:`${result.confidence}%`,background:'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',borderRadius:'4px'}}/>
              </div>
            </div>

            <div style={{marginBottom:'30px'}}>
              <h4 style={{fontSize:'18px',marginBottom:'15px',color:'#fff'}}>Most Likely Scores</h4>
              <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                {result.most_likely_scores.map((item, idx) => (
                  <div key={idx} style={{background:'#16213e',padding:'10px 20px',borderRadius:'8px',display:'flex',alignItems:'center',gap:'10px'}}>
                    <span style={{fontSize:'18px',fontWeight:'bold',color:'#fff'}}>{item.score}</span>
                    <span style={{color:'#999',fontSize:'14px'}}>{item.probability}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{fontSize:'18px',marginBottom:'15px',color:'#fff'}}>Model Breakdown</h4>
              <div style={{display:'grid',gap:'15px'}}>
                {Object.entries(result.model_breakdown).map(([modelName, modelData]) => (
                  <div key={modelName} style={{background:'#16213e',padding:'15px',borderRadius:'8px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}>
                      <span style={{fontWeight:'bold',color:'#fff'}}>{modelName.charAt(0).toUpperCase() + modelName.slice(1)}</span>
                      {modelData.interpretation && (
                        <span style={{color:'#667eea',fontSize:'14px'}}>{modelData.interpretation}</span>
                      )}
                    </div>
                    <div style={{display:'flex',height:'20px',gap:'2px',borderRadius:'4px',overflow:'hidden'}}>
                      <div style={{flex:modelData.home,background:'#43e97b',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',color:'#000',fontWeight:'bold'}}>{modelData.home}%</div>
                      <div style={{flex:modelData.draw,background:'#ffd93d',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',color:'#000',fontWeight:'bold'}}>{modelData.draw}%</div>
                      <div style={{flex:modelData.away,background:'#ff6b6b',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',color:'#000',fontWeight:'bold'}}>{modelData.away}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}