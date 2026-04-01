'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { UAParser } from 'ua-parser-js';

interface TerminalBootProps {
  onComplete: () => void;
}

async function collectUserData() {
  // IP + geo — use ipapi.co (free, HTTPS)
  let ip = 'unknown', city = 'unknown', region = 'unknown', country = 'unknown', isp = 'unknown';
  try {
    const r = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
    const d = await r.json();
    ip = d.ip || ip;
    city = d.city || city;
    region = d.region || region;
    country = d.country_name || country;
    isp = d.org || isp;
  } catch {
    // fallback — try ipinfo.io
    try {
      const r2 = await fetch('https://ipinfo.io/json', { signal: AbortSignal.timeout(4000) });
      const d2 = await r2.json();
      ip = d2.ip || ip;
      city = d2.city || city;
      region = d2.region || region;
      country = d2.country || country;
      isp = d2.org || isp;
    } catch { /* proceed with unknowns */ }
  }

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

  return { ip, city, region, country, isp, device, os, browser, screenRes, battery, fmt, referrer, visits, scheme, conn, gpu };
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

    // Build lines
    const lines: string[] = [
      'GALLUPPI.AI v1.0 INITIALIZING...',
      '[OK] SYSTEMS ONLINE',
      '[OK] SCANNING NETWORK...',
      '',
      '> CONNECTION DETECTED',
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
    lines.push('> ██████████████████ IDENTIFIED');
    lines.push('');
    lines.push('> Welcome. You have my attention.');

    // Create DOM elements upfront — all hidden
    const lineEls: HTMLDivElement[] = [];
    lines.forEach((text) => {
      const el = document.createElement('div');
      el.className = 'font-mono text-[#00ff88] whitespace-pre text-sm md:text-base lg:text-lg leading-relaxed';
      el.style.visibility = 'hidden';
      el.style.minHeight = '1.6em';
      container.appendChild(el);
      lineEls.push(el);
    });

    // Typewriter: type each line character by character, then move to next
    const CHAR_MS = 18;      // ms per character
    const LINE_PAUSE = 120;  // pause between lines
    const SCAN_PAUSE = 600;  // pause after "SCANNING NETWORK..."

    let lineIdx = 0;

    function typeLine() {
      if (lineIdx >= lines.length) {
        // Done — pause then transition
        setTimeout(onComplete, 1200);
        return;
      }

      const text = lines[lineIdx];
      const el = lineEls[lineIdx];
      el.style.visibility = 'visible';

      if (!text) {
        // Empty line — just show spacer and move on
        el.innerHTML = '&nbsp;';
        lineIdx++;
        setTimeout(typeLine, LINE_PAUSE);
        return;
      }

      let charIdx = 0;
      el.textContent = '';

      function typeChar() {
        if (charIdx < text.length) {
          el.textContent += text[charIdx];
          charIdx++;
          setTimeout(typeChar, CHAR_MS);
        } else {
          // Line done
          lineIdx++;
          // Extra pause after specific lines
          const pause = text.includes('SCANNING') ? SCAN_PAUSE : LINE_PAUSE;
          setTimeout(typeLine, pause);
        }
      }

      typeChar();
    }

    typeLine();

    // Live clock update on the time line
    const timeLineIdx = lines.findIndex(l => l.startsWith('> LOCAL TIME:'));
    if (timeLineIdx >= 0) {
      const iv = setInterval(() => {
        const el = lineEls[timeLineIdx];
        if (el && el.style.visibility === 'visible') {
          el.textContent = `> LOCAL TIME: ${d.fmt.format(new Date())}`;
        }
      }, 1000);
      // Clean up after boot completes
      setTimeout(() => clearInterval(iv), 30000);
    }
  }, [onComplete]);

  useEffect(() => { run(); }, [run]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex items-start justify-center p-8 pt-[15vh] overflow-auto">
      <div ref={containerRef} className="w-full max-w-4xl" />
    </div>
  );
}
