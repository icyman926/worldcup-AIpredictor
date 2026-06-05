import Layout from '../components/Layout';
import Head from 'next/head';
export default function Home() {
  return (
    <Layout>
      <Head><title>World Cup AI Predictor</title></Head>
      <div style={{textAlign:'center',padding:'100px 20px'}}>
        <h1 style={{fontSize:'48px',fontWeight:'bold'}}>World Cup AI Predictor</h1>
        <p style={{color:'#999'}}>AI-powered match prediction</p>
        <a href="/predict" style={{background:'#667eea',color:'#fff',padding:'12px 24px',borderRadius:'8px',textDecoration:'none'}}>Start Prediction</a>
      </div>
    </Layout>
  );
}