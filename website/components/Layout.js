import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',background:'#0a0a1a'}}>
      <nav style={{background:'#111',padding:'16px',display:'flex',gap:'20px',borderBottom:'1px solid #333',flexWrap:'wrap'}}>
        <Link href="/" style={{color:'#fff',textDecoration:'none',fontWeight:'bold',fontSize:'18px'}}>🏆 World Cup AI Predictor</Link>
        <div style={{marginLeft:'auto',display:'flex',gap:'20px',flexWrap:'wrap'}}>
          <Link href="/" style={{color:'#ccc',textDecoration:'none',transition:'color 0.2s'}}>Home</Link>
          <Link href="/predict" style={{color:'#ccc',textDecoration:'none',transition:'color 0.2s'}}>Match Predictor</Link>
          <Link href="/champion" style={{color:'#ccc',textDecoration:'none',transition:'color 0.2s'}}>Champion</Link>
          <Link href="/about" style={{color:'#ccc',textDecoration:'none',transition:'color 0.2s'}}>About</Link>
          <Link href="/howto" style={{color:'#ccc',textDecoration:'none',transition:'color 0.2s'}}>Tutorial</Link>
        </div>
      </nav>
      <main style={{flex:1}}>{children}</main>
      <footer style={{background:'#111',padding:'20px',textAlign:'center',color:'#666',borderTop:'1px solid #333'}}>
        <p>© 2026 World Cup AI Predictor | Powered by Multiple AI Models</p>
      </footer>
    </div>
  );
}