export default async function TestProxy() {
  try {
    // Kita panggil Proxy
    const res = await fetch('https://ait-webapp.vercel.app/api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // GANTI QUERY INI
      body: JSON.stringify({
        query: `
          query GetSettings {
            generalSettings {
              description
              title
            }
          }
        `
      }),
    });

    const text = await res.text();
    const contentType = res.headers.get('content-type') || 'unknown';
    
    // DEBUG: Cetak log ke console browser
    console.log("Raw Text Length:", text.length);
    console.log("First 100 chars:", text.substring(0, 100));

    return (
      <div style={{ padding: '20px', color: 'white', fontFamily: 'monospace' }}>
        <h1 style={{ color: '#10b981', marginBottom: '20px' }}>
          Hasil Lewat PROXY (Cek General Settings)
        </h1>
        
        <div style={{ marginTop: '20px', border: '1px solid #10b981', padding: '15px' }}>
          <p><strong>Status Code:</strong> {res.status}</p>
          <p><strong>Content-Type:</strong> {contentType}</p>
          <p><strong>Panjang Karakter Response:</strong> {text.length}</p>
        </div>

        <div style={{ background: '#064e3b', padding: '15px', marginTop: '15px', border: '1px solid #10b981' }}>
          <strong style={{ color: '#6ee7b7', display: 'block', marginBottom: '10px' }}>
            Raw Response (via Proxy):
          </strong>
          {text.length === 0 ? (
            <p style={{color: 'red'}}>KOSONG! (Response kosong dari WordPress)</p>
          ) : (
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-all', 
              color: '#d1fae5', 
              fontSize: '12px' 
            }}>
              {text.substring(0, 500)}
            </pre>
          )}
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div style={{ padding: '20px', color: 'white' }}>
        <h1 style={{ color: '#ef4444' }}>Terjadi Error</h1>
        <p>{error.message}</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }
}