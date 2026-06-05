import Link from 'next/link';
export default function Layout({ children }) {
  return (
    <div>
      <nav style={{background:'#111',padding:'16px',display:'flex',gap:'20px'}}>
        <Link href="/" style={{color:'#fff',textDecoration:'none'}}>Home</Link>
        <Link href="/predict" style={{color:'#fff',textDecoration:'none'}}>Predict</Link>
        <Link href="/about" style={{color:'#fff',textDecoration:'none'}}>About</Link>
        <Link href="/howto" style={{color:'#fff',textDecoration:'none'}}>Tutorial</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}