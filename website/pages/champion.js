import Layout from '../components/Layout';
import Head from 'next/head';
import { useState, useEffect } from 'react';

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

  return (
    <Layout>
      <Head><title>Champion Prediction - World Cup AI Predictor</title></Head>
      <div style={{maxWidth:'900px',margin:'0 auto',padding:'60px 20px'}}>
        <h1 style={{fontSize:'36px',marginBottom:'20px',textAlign:'center'}}>🏆 World Cup Champion Prediction</h1>
        <p style={{color:'#999',textAlign:'center',marginBottom:'40px'}}>AI-powered predictions for the World Cup winner</p>
        
        {loading ? (
          <div style={{textAlign:'center',padding:'100px'}}>
            <svg style={{animation:'spin 1s linear infinite',width:'40px',height:'40px',margin:'0 auto'}} viewBox="0 0 24 24" fill="none">
              <circle style={{borderColor:'#667eea',borderTopColor:'transparent'}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            </svg>
            <p style={{color:'#999',marginTop:'20px'}}>Analyzing data...</p>
          </div>
        ) : (
          <div style={{background:'#1a1a2e',borderRadius:'12px',padding:'40px'}}>
            <div style={{display:'grid',gap:'15px'}}>
              {predictions.map((team, index) => (
                <div key={team.team_id} style={{display:'flex',alignItems:'center',gap:'20px',padding:'15px',background:'#16213e',borderRadius:'8px'}}>
                  <div style={{width:'40px',height:'40px',display:'flex',alignItems:'center',justifyContent:'center',background:'#667eea',borderRadius:'50%',fontWeight:'bold',color:'white'}}>
                    {index + 1}
                  </div>
                  <div style={{fontSize:'32px'}}>{team.flag}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'18px',fontWeight:'bold',color:'#fff'}}>{team.name}</div>
                    <div style={{color:'#999',fontSize:'14px'}}>Group {team.group} | Elo: {team.elo}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'28px',fontWeight:'bold',color:'#43e97b'}}>{team.probability}%</div>
                    <div style={{color:'#999',fontSize:'12px'}}>Chance</div>
                  </div>
                  <div style={{width:'200px',height:'20px',background:'#333',borderRadius:'10px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${team.probability * 2}%`,background:'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',borderRadius:'10px'}}/>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{marginTop:'30px',padding:'20px',background:'#16213e',borderRadius:'8px'}}>
              <h4 style={{color:'#fff',marginBottom:'10px'}}>📊 Prediction Methodology</h4>
              <ul style={{color:'#999',fontSize:'14px',lineHeight:'1.6'}}>
                <li>• Based on Elo ratings from recent international matches</li>
                <li>• Confederation strength weighting (UEFA/CONMEBOL teams get bonus)</li>
                <li>• Pot ranking considerations from World Cup draw</li>
                <li>• Historical performance patterns in World Cup tournaments</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}