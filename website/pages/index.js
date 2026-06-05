import Layout from '../components/Layout';
import Head from 'next/head';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>World Cup AI Predictor</title>
      </Head>
      
      <div style={{textAlign:'center',padding:'120px 20px 80px',background:'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0a0a1a 100%)'}}>
        <div style={{maxWidth:'800px',margin:'0 auto'}}>
          <div style={{fontSize:'64px',marginBottom:'20px'}}>🏆</div>
          <h1 style={{fontSize:'56px',fontWeight:'bold',color:'#fff',marginBottom:'20px',background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            World Cup AI Predictor
          </h1>
          <p style={{color:'#999',fontSize:'20px',marginBottom:'40px',lineHeight:'1.6'}}>
            Advanced AI-powered football match prediction system<br/>
            Multiple predictive models for accurate match forecasting
          </p>
          <div style={{display:'flex',gap:'20px',justifyContent:'center',flexWrap:'wrap'}}>
            <a href="/predict" style={{background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',color:'#fff',padding:'16px 32px',borderRadius:'8px',textDecoration:'none',fontSize:'18px',fontWeight:'bold',transition:'transform 0.2s, box-shadow 0.2s',boxShadow:'0 4px 15px rgba(102, 126, 234, 0.4)'}}>
              Start Prediction
            </a>
            <a href="/howto" style={{background:'transparent',color:'#fff',padding:'16px 32px',borderRadius:'8px',textDecoration:'none',fontSize:'18px',fontWeight:'bold',border:'2px solid #667eea',transition:'background 0.2s'}}>
              Learn How
            </a>
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'80px 20px'}}>
        <h2 style={{fontSize:'32px',textAlign:'center',marginBottom:'50px',color:'#fff'}}>Features</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'30px'}}>
          <div style={{background:'#1a1a2e',borderRadius:'12px',padding:'30px',textAlign:'center',transition:'transform 0.2s'}}>
            <div style={{fontSize:'48px',marginBottom:'20px'}}>⚡</div>
            <h3 style={{fontSize:'20px',marginBottom:'15px',color:'#fff'}}>Real-time Analysis</h3>
            <p style={{color:'#999',lineHeight:'1.6'}}>Get up-to-date predictions based on the latest team form, player statistics, and historical data.</p>
          </div>
          
          <div style={{background:'#1a1a2e',borderRadius:'12px',padding:'30px',textAlign:'center',transition:'transform 0.2s'}}>
            <div style={{fontSize:'48px',marginBottom:'20px'}}>🔮</div>
            <h3 style={{fontSize:'20px',marginBottom:'15px',color:'#fff'}}>Multiple AI Models</h3>
            <p style={{color:'#999',lineHeight:'1.6'}}>Combined predictions from Elo rating system, Poisson distribution, and odds analysis for maximum accuracy.</p>
          </div>
          
          <div style={{background:'#1a1a2e',borderRadius:'12px',padding:'30px',textAlign:'center',transition:'transform 0.2s'}}>
            <div style={{fontSize:'48px',marginBottom:'20px'}}>📊</div>
            <h3 style={{fontSize:'20px',marginBottom:'15px',color:'#fff'}}>Detailed Statistics</h3>
            <p style={{color:'#999',lineHeight:'1.6'}}>View comprehensive match statistics including expected goals, win probabilities, and confidence scores.</p>
          </div>
          
          <div style={{background:'#1a1a2e',borderRadius:'12px',padding:'30px',textAlign:'center',transition:'transform 0.2s'}}>
            <div style={{fontSize:'48px',marginBottom:'20px'}}>🌍</div>
            <h3 style={{fontSize:'20px',marginBottom:'15px',color:'#fff'}}>Global Coverage</h3>
            <p style={{color:'#999',lineHeight:'1.6'}}>Supports all World Cup participating nations with comprehensive historical data.</p>
          </div>
          
          <div style={{background:'#1a1a2e',borderRadius:'12px',padding:'30px',textAlign:'center',transition:'transform 0.2s'}}>
            <div style={{fontSize:'48px',marginBottom:'20px'}}>⚽</div>
            <h3 style={{fontSize:'20px',marginBottom:'15px',color:'#fff'}}>Match Simulation</h3>
            <p style={{color:'#999',lineHeight:'1.6'}}>Simulate thousands of matches to generate accurate probability distributions.</p>
          </div>
          
          <div style={{background:'#1a1a2e',borderRadius:'12px',padding:'30px',textAlign:'center',transition:'transform 0.2s'}}>
            <div style={{fontSize:'48px',marginBottom:'20px'}}>📈</div>
            <h3 style={{fontSize:'20px',marginBottom:'15px',color:'#fff'}}>Performance Tracking</h3>
            <p style={{color:'#999',lineHeight:'1.6'}}>Track prediction accuracy over time and see how our models perform against real match outcomes.</p>
          </div>
        </div>
      </div>

      <div style={{background:'#1a1a2e',padding:'80px 20px'}}>
        <div style={{maxWidth:'800px',margin:'0 auto',textAlign:'center'}}>
          <h2 style={{fontSize:'32px',marginBottom:'20px',color:'#fff'}}>How It Works</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'30px'}}>
            <div>
              <div style={{width:'80px',height:'80px',margin:'0 auto 20px',background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px',fontWeight:'bold',color:'white'}}>1</div>
              <h4 style={{color:'#fff',marginBottom:'10px'}}>Select Teams</h4>
              <p style={{color:'#999',fontSize:'14px'}}>Choose two teams for comparison</p>
            </div>
            <div>
              <div style={{width:'80px',height:'80px',margin:'0 auto 20px',background:'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px',fontWeight:'bold',color:'white'}}>2</div>
              <h4 style={{color:'#fff',marginBottom:'10px'}}>AI Analysis</h4>
              <p style={{color:'#999',fontSize:'14px'}}>Multiple models analyze the data</p>
            </div>
            <div>
              <div style={{width:'80px',height:'80px',margin:'0 auto 20px',background:'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px',fontWeight:'bold',color:'white'}}>3</div>
              <h4 style={{color:'#fff',marginBottom:'10px'}}>Generate Results</h4>
              <p style={{color:'#999',fontSize:'14px'}}>Combine predictions for accuracy</p>
            </div>
            <div>
              <div style={{width:'80px',height:'80px',margin:'0 auto 20px',background:'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px',fontWeight:'bold',color:'white'}}>4</div>
              <h4 style={{color:'#fff',marginBottom:'10px'}}>View Predictions</h4>
              <p style={{color:'#999',fontSize:'14px'}}>Get detailed match forecasts</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'80px 20px'}}>
        <div style={{background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',borderRadius:'12px',padding:'60px',textAlign:'center'}}>
          <h2 style={{fontSize:'32px',marginBottom:'20px',color:'#fff'}}>Ready to Make Your First Prediction?</h2>
          <p style={{color:'rgba(255,255,255,0.9)',marginBottom:'40px',fontSize:'18px'}}>
            Join thousands of football enthusiasts who trust our AI predictions
          </p>
          <div style={{display:'flex',gap:'20px',justifyContent:'center',flexWrap:'wrap'}}>
            <a href="/predict" style={{background:'#fff',color:'#667eea',padding:'16px 40px',borderRadius:'8px',textDecoration:'none',fontSize:'18px',fontWeight:'bold',transition:'transform 0.2s'}}>
              Match Predictor
            </a>
            <a href="/champion" style={{background:'rgba(0,0,0,0.3)',color:'#fff',padding:'16px 40px',borderRadius:'8px',textDecoration:'none',fontSize:'18px',fontWeight:'bold',border:'2px solid #fff',transition:'transform 0.2s'}}>
              🏆 Champion Prediction
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}