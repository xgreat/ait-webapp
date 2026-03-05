export default async function TestConnection() {
  try {
    const res = await fetch('https://ait.plai.ac.id/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query Test { __typename }`
      }),
    });

    const text = await res.text();
    
    return (
      <div style={{padding: '20px', color: 'white', fontFamily: 'monospace'}}>
        <h1 style={{color: '#0ea5e9'}}>Tes Koneksi Server-to-Server (Vercel - WordPress)</h1>
        
        <div style={{marginTop: '20px', border: '1px solid #334155', padding: '15px'}}>
          <p><strong>Status Code:</strong> {res.status}</p>
          <p><strong>Content-Type:</strong> {res.headers.get('content-type')}</p>
        </div>

        <div style={{background: '#0f172a', padding: '15px', marginTop: '15px', border: '1px solid #334155'}}>
          <strong style={{color: '#ef4444'}}>Raw Response (200 Karakter Pertama):</strong>
          <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: '#cbd5e1', fontSize: '12px'}}>
            {text.substring(0, 500)}
          </pre>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div style={{padding: '20px', color: 'white'}}>
        <h1 style={{color: '#ef4444'}}>Terjadi Error Fetch</h1>
        <p>{error.message}</p>
      </div>
    );
  }
}