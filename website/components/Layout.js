import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <nav style={{background:'#111',padding:'16px',display:'flex',gap:'20px',borderBottom:'1px solid #333'}}>
        <Link href="/" style={{color:'#fff',textDecoration:'none',fontWeight:'bold'}}>🏆 World Cup AI Predictor</Link>
        <div style={{marginLeft:'auto',display:'flex',gap:'20px'}}>
          <Link href="/" style={{color:'#ccc',textDecoration:'none'}}>Home</Link>
          <Link href="/predict" style={{color:'#ccc',textDecoration:'none'}}>Predict</Link>
          <Link href="/about" style={{color:'#ccc',textDecoration:'none'}}>About</Link>
          <Link href="/howto" style={{color:'#ccc',textDecoration:'none'}}>Tutorial</Link>
        </div>
      </nav>
      <main style={{flex:1}}>{children}</main>
      <footer style={{background:'#111',padding:'20px',textAlign:'center',color:'#666',borderTop:'1px solid #333'}}>
        <p>© 2024 World Cup AI Predictor</p>
      </footer>
    </div>
  );
}