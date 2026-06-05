import Layout from '../components/Layout';
import Head from 'next/head';

export default function HowTo() {
  return (
    <Layout>
      <Head><title>Tutorial - World Cup AI Predictor</title></Head>
      <div style={{maxWidth:'1000px',margin:'0 auto',padding:'60px 20px'}}>
        <h1 style={{fontSize:'36px',marginBottom:'20px',textAlign:'center'}}>How to Use</h1>
        <p style={{color:'#999',textAlign:'center',marginBottom:'40px'}}>Learn how to make accurate match predictions step by step</p>
        
        <div style={{background:'#1a1a2e',borderRadius:'12px',padding:'40px'}}>
          <div style={{display:'grid',gap:'40px'}}>
            <div style={{display:'flex',gap:'30px'}}>
              <div style={{background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',width:'60px',height:'60px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',flexShrink:'0',fontWeight:'bold',color:'white'}}>1</div>
              <div>
                <h3 style={{fontSize:'20px',marginBottom:'10px',color:'#fff'}}>Navigate to Prediction Page</h3>
                <p style={{color:'#999',lineHeight:'1.6'}}>Click on the "Predict" menu item in the navigation bar to access the prediction interface. This is where you'll find all the tools needed to make match predictions.</p>
              </div>
            </div>
            
            <div style={{display:'flex',gap:'30px'}}>
              <div style={{background:'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',width:'60px',height:'60px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',flexShrink:'0',fontWeight:'bold',color:'white'}}>2</div>
              <div>
                <h3 style={{fontSize:'20px',marginBottom:'10px',color:'#fff'}}>Select Teams</h3>
                <p style={{color:'#999',lineHeight:'1.6'}}>Use the dropdown menus to select two teams for comparison. You can search for teams by name or browse through the available options. The system supports all World Cup participating nations.</p>
              </div>
            </div>
            
            <div style={{display:'flex',gap:'30px'}}>
              <div style={{background:'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',width:'60px',height:'60px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',flexShrink:'0',fontWeight:'bold',color:'white'}}>3</div>
              <div>
                <h3 style={{fontSize:'20px',marginBottom:'10px',color:'#fff'}}>Configure Match Settings</h3>
                <p style={{color:'#999',lineHeight:'1.6'}}>Optional: Adjust match parameters such as venue (home/away/neutral), tournament type, and other factors that may influence the prediction. These settings help refine the AI analysis.</p>
              </div>
            </div>
            
            <div style={{display:'flex',gap:'30px'}}>
              <div style={{background:'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',width:'60px',height:'60px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',flexShrink:'0',fontWeight:'bold',color:'white'}}>4</div>
              <div>
                <h3 style={{fontSize:'20px',marginBottom:'10px',color:'#fff'}}>Generate Prediction</h3>
                <p style={{color:'#999',lineHeight:'1.6'}}>Click the "Predict" button to start the AI analysis. The system will run multiple prediction models and combine their results to give you the most accurate forecast.</p>
              </div>
            </div>
            
            <div style={{display:'flex',gap:'30px'}}>
              <div style={{background:'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',width:'60px',height:'60px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',flexShrink:'0',fontWeight:'bold',color:'white'}}>5</div>
              <div>
                <h3 style={{fontSize:'20px',marginBottom:'10px',color:'#fff'}}>View Results</h3>
                <p style={{color:'#999',lineHeight:'1.6'}}>Review the detailed prediction results including win probabilities for each team, expected goals, and confidence levels. The results also include insights from each prediction model used.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{marginTop:'40px',background:'#1a1a2e',borderRadius:'12px',padding:'30px'}}>
          <h3 style={{fontSize:'20px',marginBottom:'20px',color:'#667eea'}}>💡 Tips for Better Predictions</h3>
          <ul style={{color:'#999',lineHeight:'1.8',listStyle:'none',padding:'0'}}>
            <li style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
              <span>⚽</span>
              <span>Consider recent form - Teams with good recent performance tend to have better predictions</span>
            </li>
            <li style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
              <span>🏟️</span>
              <span>Home advantage matters - Teams playing at home often have higher win probabilities</span>
            </li>
            <li style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
              <span>📊</span>
              <span>Check historical data - Previous encounters between teams can indicate trends</span>
            </li>
            <li style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
              <span>🎯</span>
              <span>Interpret probabilities carefully - Even a 60% win chance means the underdog can still win</span>
            </li>
          </ul>
        </div>

        <div style={{marginTop:'40px',textAlign:'center'}}>
          <a href="/predict" style={{background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',color:'#fff',padding:'14px 32px',borderRadius:'8px',textDecoration:'none',display:'inline-block',fontWeight:'bold',transition:'transform 0.2s'}}>
            Try Predictions Now →
          </a>
        </div>
      </div>
    </Layout>
  );
}