import { NextRequest, NextResponse } from 'next/server';

const IPQS_KEY = process.env.IPQS_API_KEY || '';

export async function GET(req: NextRequest) {
  // Get visitor IP from headers
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

    // Only return what we need — never expose the API key or request_id
    return NextResponse.json({
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
    });
  } catch {
    return NextResponse.json({ ip, error: 'lookup failed' }, { status: 502 });
  }
}
