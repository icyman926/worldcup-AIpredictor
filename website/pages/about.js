import Layout from '../components/Layout';
import Head from 'next/head';

export default function About() {
  return (
    <Layout>
      <Head><title>About - World Cup AI Predictor</title></Head>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'60px 20px'}}>
        <h1 style={{fontSize:'36px',marginBottom:'20px',textAlign:'center'}}>About World Cup AI Predictor</h1>
        
        <section style={{background:'#1a1a2e',borderRadius:'12px',padding:'30px',marginBottom:'30px'}}>
          <h2 style={{fontSize:'24px',color:'#667eea',marginBottom:'15px'}}>🏆 Project Overview</h2>
          <p style={{color:'#ccc',lineHeight:'1.8',marginBottom:'15px'}}>
            World Cup AI Predictor is an advanced machine learning application that predicts football match outcomes using multiple predictive models. 
            Our goal is to provide accurate and insightful predictions for World Cup matches.
          </p>
          <p style={{color:'#ccc',lineHeight:'1.8'}}>
            Whether you're a football enthusiast, a sports analyst, or just curious about AI predictions, this tool offers comprehensive match forecasting powered by cutting-edge algorithms.
          </p>
        </section>

        <section style={{background:'#1a1a2e',borderRadius:'12px',padding:'30px',marginBottom:'30px'}}>
          <h2 style={{fontSize:'24px',color:'#667eea',marginBottom:'20px'}}>🔬 Technologies Used</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:'20px'}}>
            <div style={{background:'#16213e',padding:'20px',borderRadius:'8px'}}>
              <h3 style={{color:'#00d4ff',marginBottom:'10px'}}>Frontend</h3>
              <ul style={{color:'#999',lineHeight:'1.8',listStyle:'none',padding:'0'}}>
                <li>• Next.js (React Framework)</li>
                <li>• Modern CSS3</li>
                <li>• Responsive Design</li>
              </ul>
            </div>
            <div style={{background:'#16213e',padding:'20px',borderRadius:'8px'}}>
              <h3 style={{color:'#00ff88',marginBottom:'10px'}}>Backend</h3>
              <ul style={{color:'#999',lineHeight:'1.8',listStyle:'none',padding:'0'}}>
                <li>• FastAPI (Python)</li>
                <li>• RESTful API Design</li>
                <li>• JSON Data Format</li>
              </ul>
            </div>
            <div style={{background:'#16213e',padding:'20px',borderRadius:'8px'}}>
              <h3 style={{color:'#ff6b6b',marginBottom:'10px'}}>AI Models</h3>
              <ul style={{color:'#999',lineHeight:'1.8',listStyle:'none',padding:'0'}}>
                <li>• Elo Rating System</li>
                <li>• Poisson Distribution</li>
                <li>• Odds Analysis</li>
              </ul>
            </div>
          </div>
        </section>

        <section style={{background:'#1a1a2e',borderRadius:'12px',padding:'30px',marginBottom:'30px'}}>
          <h2 style={{fontSize:'24px',color:'#667eea',marginBottom:'15px'}}>🎯 Features</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'15px'}}>
            <div style={{background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',padding:'20px',borderRadius:'8px',textAlign:'center'}}>
              <span style={{fontSize:'32px'}}>⚡</span>
              <h4 style={{marginTop:'10px',marginBottom:'5px'}}>Real-time Analysis</h4>
              <p style={{fontSize:'14px',opacity:'0.9'}}>Up-to-date match predictions</p>
            </div>
            <div style={{background:'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',padding:'20px',borderRadius:'8px',textAlign:'center'}}>
              <span style={{fontSize:'32px'}}>📊</span>
              <h4 style={{marginTop:'10px',marginBottom:'5px'}}>Multiple Models</h4>
              <p style={{fontSize:'14px',opacity:'0.9'}}>Ensemble prediction approach</p>
            </div>
            <div style={{background:'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',padding:'20px',borderRadius:'8px',textAlign:'center'}}>
              <span style={{fontSize:'32px'}}>🔮</span>
              <h4 style={{marginTop:'10px',marginBottom:'5px'}}>Probability Scores</h4>
              <p style={{fontSize:'14px',opacity:'0.9'}}>Accurate win probability</p>
            </div>
            <div style={{background:'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',padding:'20px',borderRadius:'8px',textAlign:'center'}}>
              <span style={{fontSize:'32px'}}>🏅</span>
              <h4 style={{marginTop:'10px',marginBottom:'5px'}}>Historical Data</h4>
              <p style={{fontSize:'14px',opacity:'0.9'}}>Comprehensive stats</p>
            </div>
          </div>
        </section>

        <section style={{background:'#1a1a2e',borderRadius:'12px',padding:'30px'}}>
          <h2 style={{fontSize:'24px',color:'#667eea',marginBottom:'15px'}}>📈 How It Works</h2>
          <ol style={{color:'#ccc',lineHeight:'1.8'}}>
            <li style={{marginBottom:'10px'}}><strong>Data Collection:</strong> We gather historical match data, team statistics, player information, and recent form.</li>
            <li style={{marginBottom:'10px'}}><strong>Model Training:</strong> Our AI models analyze patterns and trends from thousands of past matches.</li>
            <li style={{marginBottom:'10px'}}><strong>Prediction Generation:</strong> Multiple algorithms generate predictions which are then combined.</li>
            <li style={{marginBottom:'10px'}}><strong>Result Display:</strong> The final predictions are presented with confidence scores and probabilities.</li>
          </ol>
        </section>
      </div>
    </Layout>
  );
}