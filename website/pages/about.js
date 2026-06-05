import Layout from '../components/Layout';
import Head from 'next/head';
export default function About() {
  return (
    <Layout>
      <Head><title>About</title></Head>
      <div style={{textAlign:'center',padding:'100px 20px'}}>
        <h1>About</h1>
        <p>Coming soon</p>
      </div>
    </Layout>
  );
}