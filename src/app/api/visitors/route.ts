import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const AUTH_PASSWORD = process.env.VISITORS_PASSWORD || 'gilfoyle';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('x-auth') || req.nextUrl.searchParams.get('auth');
  if (auth !== AUTH_PASSWORD) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const raw = await kv.lrange('visitors', 0, 499);
    const visitors = raw.map((entry: string | object) => {
      if (typeof entry === 'string') {
        try { return JSON.parse(entry); } catch { return entry; }
      }
      return entry;
    });
    return NextResponse.json({ visitors, count: visitors.length });
  } catch (err) {
    return NextResponse.json({ error: 'kv read failed', detail: String(err) }, { status: 500 });
  }
}
