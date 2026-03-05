import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Ambil data dari WordPress
    const res = await fetch('https://ait.plai.ac.id/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Tambahkan header user-agent standar agar kelihatan seperti browser biasa di mata Cloudflare
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      },
      body: JSON.stringify(body),
    });

    // 2. Ambil response mentah
    const data = await res.text();

    // 3. Kembalikan ke frontend (Vercel)
    return new Response(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}