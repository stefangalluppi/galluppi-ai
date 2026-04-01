'use client';

import { useEffect, useRef, useCallback } from 'react';
import { UAParser } from 'ua-parser-js';

interface TerminalBootProps {
  onComplete: (userData: {
    ip: string;
    city: string;
    region: string;
    country: string;
    isp: string;
    device: string;
    os: string;
    browser: string;
    screenRes: string;
    ipData: IpData;
  }) => void;
}

interface IpData {
  ip: string; city: string; region: string; country: string; isp: string; org: string;
  fraud_score: number | null; vpn: boolean; proxy: boolean; tor: boolean;
  bot: boolean; crawler: boolean; mobile: boolean; timezone: string;
  recent_abuse: boolean; host: string;
}

async function collectUserData() {
  let ipData: IpData = {
    ip: 'unknown', city: 'unknown', region: 'unknown', country: 'unknown',
    isp: 'unknown', org: '', fraud_score: null, vpn: false, proxy: false,
    tor: false, bot: false, crawler: false, mobile: false, timezone: '',
    recent_abuse: false, host: '',
  };
  try {
    const r = await fetch('/api/identify', { signal: AbortSignal.timeout(6000) });
    const d = await r.json();
    ipData = { ...ipData, ...d };
  } catch { /* proceed with defaults */ }

  const ip = ipData.ip;
  const city = ipData.city;
  const region = ipData.region;
  const country = ipData.country;
  const isp = ipData.isp;

  const parser = new UAParser();
  const ua = parser.getResult();
  const screenRes = `${window.screen.width}×${window.screen.height}`;

  let battery = '';
  try {
    if ('getBattery' in navigator) {
      const bm = await (navigator as any).getBattery();
      battery = `${Math.round(bm.level * 100)}% (${bm.charging ? 'charging' : 'discharging'})`;
    }
  } catch { /* skip */ }

  const fmt = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZoneName: 'short', hour12: false,
  });

  const referrer = document.referrer
    ? `ORIGIN: ${new URL(document.referrer).hostname}`
    : 'DIRECT ACCESS — no trail';

  const visits = parseInt(localStorage.getItem('gai_v') || '0', 10) + 1;
  localStorage.setItem('gai_v', visits.toString());

  const scheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'DARK' : 'LIGHT';
  const conn = (navigator as any).connection?.effectiveType?.toUpperCase() || '';

  let gpu = '';
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (gl) {
      const ext = (gl as any).getExtension('WEBGL_debug_renderer_info');
      if (ext) gpu = (gl as any).getParameter(ext.UNMASKED_RENDERER_WEBGL);
    }
  } catch { /* skip */ }

  const device = `${ua.device.vendor || ''} ${ua.device.model || 'Desktop'}`.trim() || 'Desktop';
  const os = `${ua.os.name || 'Unknown'} ${ua.os.version || ''}`.trim();
  const browser = `${ua.browser.name || 'Unknown'} ${ua.browser.version || ''}`.trim();

  return { ip, city, region, country, isp, device, os, browser, screenRes, battery, fmt, referrer, visits, scheme, conn, gpu, ipData };
}

export function TerminalBoot({ onComplete }: TerminalBootProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  const run = useCallback(async () => {
    if (hasRun.current || !containerRef.current) return;
    hasRun.current = true;

    const d = await collectUserData();
    const container = containerRef.current;
    container.innerHTML = '';

    const isReturning = d.visits > 1;
    const scanningMsg = isReturning ? '[OK] SCANNING NETWORK... KNOWN SIGNATURE DETECTED' : '[OK] SCANNING NETWORK...';
    const connectionMsg = isReturning ? '> RECONNECTION DETECTED' : '> CONNECTION DETECTED';
    
    let welcomeMsg = '> Welcome. You have my attention.';
    if (d.visits === 2) {
      welcomeMsg = '> Welcome back. I remember you.';
    } else if (d.visits >= 3 && d.visits <= 5) {
      welcomeMsg = `> You again. Visit #${d.visits}. This is becoming a habit.`;
    } else if (d.visits > 5) {
      welcomeMsg = `> Visit #${d.visits}. At this point, just bookmark it.`;
    }

    const lines: string[] = [
      'GALLUPPI.AI v1.0 INITIALIZING...',
      '[OK] SYSTEMS ONLINE',
      scanningMsg,
      '',
      connectionMsg,
      `> IP: ${d.ip}`,
      `> LOCATION: ${d.city}, ${d.region}, ${d.country}`,
      `> DEVICE: ${d.device} / ${d.os} / ${d.browser}`,
      `> SCREEN: ${d.screenRes}`,
      `> NETWORK: ${d.isp}`,
    ];

    if (d.battery) lines.push(`> BATTERY: ${d.battery}`);
    lines.push(`> LOCAL TIME: ${d.fmt.format(new Date())}`);
    if (d.conn) lines.push(`> CONNECTION: ${d.conn}`);
    if (d.gpu) lines.push(`> GPU: ${d.gpu}`);
    lines.push(`> THEME: ${d.scheme}`);
    lines.push(`> ${d.referrer}`);
    lines.push(`> VISIT #${d.visits}`);

    lines.push('');
    lines.push('[OK] RUNNING THREAT ANALYSIS...');
    if (d.ipData.fraud_score !== null) lines.push(`> FRAUD SCORE: ${d.ipData.fraud_score}/100`);
    lines.push(`> VPN: ${d.ipData.vpn ? '⚠ DETECTED' : 'NOT DETECTED'}`);
    lines.push(`> PROXY: ${d.ipData.proxy ? '⚠ DETECTED' : 'NOT DETECTED'}`);
    lines.push(`> TOR: ${d.ipData.tor ? '⚠ DETECTED' : 'NO'}`);
    if (d.ipData.bot) lines.push('> BOT: ⚠ DETECTED');
    if (d.ipData.recent_abuse) lines.push('> RECENT ABUSE: ⚠ FLAGGED');
    if (d.ipData.host) lines.push(`> HOST: ${d.ipData.host}`);
    lines.push(`> DEVICE TYPE: ${d.ipData.mobile ? 'MOBILE' : 'DESKTOP'}`);

    lines.push('');
    lines.push('> ██████████████████ IDENTIFIED');
    lines.push('');
    lines.push(welcomeMsg);

    const lineEls: HTMLDivElement[] = [];
    lines.forEach((line) => {
      const el = document.createElement('div');
      el.className = 'whitespace-pre text-sm md:text-base leading-relaxed';
      el.style.color = '#e0e0e0';
      el.style.visibility = 'hidden';
      el.style.minHeight = '1.5em';
      container.appendChild(el);
      lineEls.push(el);
    });

    const CHAR_MS = 15;
    const LINE_PAUSE = 80;
    const SCAN_PAUSE = 400;

    let lineIdx = 0;

    function typeLine() {
      if (lineIdx >= lines.length) {
        setTimeout(() => {
          onComplete({
            ip: d.ip, city: d.city, region: d.region, country: d.country,
            isp: d.isp, device: d.device, os: d.os, browser: d.browser,
            screenRes: d.screenRes, ipData: d.ipData,
          });
        }, 800);
        return;
      }

      const text = lines[lineIdx];
      const el = lineEls[lineIdx];
      el.style.visibility = 'visible';

      if (!text) {
        el.innerHTML = '&nbsp;';
        lineIdx++;
        setTimeout(typeLine, LINE_PAUSE);
        return;
      }

      let charIdx = 0;
      el.innerHTML = '';

      function typeChar() {
        if (charIdx < text.length) {
          const currentText = text.substring(0, charIdx + 1);
          
          // Color [OK] in green, IDENTIFIED line in green
          if (text.includes('[OK]')) {
            el.innerHTML = currentText.replace(/\[OK\]/g, '<span style="color:#00ff88">[OK]</span>');
          } else if (text.includes('IDENTIFIED')) {
            el.innerHTML = `<span style="color:#00ff88">${currentText}</span>`;
          } else {
            el.textContent = currentText;
          }
          
          charIdx++;
          setTimeout(typeChar, CHAR_MS);
        } else {
          lineIdx++;
          const pause = text.includes('SCANNING') || text.includes('THREAT') ? SCAN_PAUSE : LINE_PAUSE;
          setTimeout(typeLine, pause);
        }
      }
      typeChar();
    }

    typeLine();

    const timeLineIdx = lines.findIndex(l => l.startsWith('> LOCAL TIME:'));
    if (timeLineIdx >= 0) {
      const iv = setInterval(() => {
        const el = lineEls[timeLineIdx];
        if (el && el.style.visibility === 'visible') {
          el.textContent = `> LOCAL TIME: ${d.fmt.format(new Date())}`;
        }
      }, 1000);
      setTimeout(() => clearInterval(iv), 30000);
    }
  }, [onComplete]);

  useEffect(() => { run(); }, [run]);

  return (
    <div className="w-full h-full flex items-start justify-start p-4 md:p-8 overflow-auto">
      <div ref={containerRef} className="w-full max-w-4xl" />
    </div>
  );
}
