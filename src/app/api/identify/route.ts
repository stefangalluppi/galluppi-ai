import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const IPQS_KEY = process.env.IPQS_API_KEY || '';

export async function GET(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || '0.0.0.0';

  if (!IPQS_KEY) {
    return NextResponse.json({ error: 'not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://ipqualityscore.com/api/json/ip/${IPQS_KEY}/${ip}?strictness=0&allow_public_access_points=true`,
      { signal: AbortSignal.timeout(5000) }
    );
    const data = await res.json();

    const visitor = {
      ip,
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      country: data.country_code || 'Unknown',
      isp: data.ISP || 'Unknown',
      org: data.organization || '',
      fraud_score: data.fraud_score ?? null,
      vpn: data.vpn ?? false,
      proxy: data.proxy ?? false,
      tor: data.tor ?? false,
      bot: data.bot_status ?? false,
      crawler: data.is_crawler ?? false,
      mobile: data.mobile ?? false,
      timezone: data.timezone || '',
      lat: data.latitude ?? null,
      lng: data.longitude ?? null,
      recent_abuse: data.recent_abuse ?? false,
      host: data.host || '',
    };

    // Persist to KV
    try {
      const ua = req.headers.get('user-agent') || '';
      const record = {
        ...visitor,
        ua,
        ts: Date.now(),
        path: req.nextUrl.searchParams.get('path') || '/',
      };
      // Push to a list, capped at 500 entries
      await kv.lpush('visitors', JSON.stringify(record));
      await kv.ltrim('visitors', 0, 499);
    } catch {
      // KV write failure is non-blocking
    }

    return NextResponse.json(visitor);
  } catch {
    return NextResponse.json({ ip, error: 'lookup failed' }, { status: 502 });
  }
}
