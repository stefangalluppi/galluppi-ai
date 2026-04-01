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

    // Build lines with new color scheme
    const lines: Array<{ text: string; color: string }> = [
      { text: 'GALLUPPI.AI v1.0 INITIALIZING...', color: '#c8c8d0' },
      { text: '[OK] SYSTEMS ONLINE', color: '#6366f1' },
      { text: '[OK] SCANNING NETWORK...', color: '#6366f1' },
      { text: '', color: '#c8c8d0' },
      { text: '> CONNECTION DETECTED', color: '#c8c8d0' },
      { text: `> IP: ${d.ip}`, color: '#e0e0e0' },
      { text: `> LOCATION: ${d.city}, ${d.region}, ${d.country}`, color: '#e0e0e0' },
      { text: `> DEVICE: ${d.device} / ${d.os} / ${d.browser}`, color: '#e0e0e0' },
      { text: `> SCREEN: ${d.screenRes}`, color: '#e0e0e0' },
      { text: `> NETWORK: ${d.isp}`, color: '#e0e0e0' },
    ];

    if (d.battery) lines.push({ text: `> BATTERY: ${d.battery}`, color: '#e0e0e0' });
    lines.push({ text: `> LOCAL TIME: ${d.fmt.format(new Date())}`, color: '#e0e0e0' });
    if (d.conn) lines.push({ text: `> CONNECTION: ${d.conn}`, color: '#e0e0e0' });
    if (d.gpu) lines.push({ text: `> GPU: ${d.gpu}`, color: '#e0e0e0' });
    lines.push({ text: `> THEME: ${d.scheme}`, color: '#e0e0e0' });
    lines.push({ text: `> ${d.referrer}`, color: '#e0e0e0' });
    lines.push({ text: `> VISIT #${d.visits}`, color: '#e0e0e0' });

    // IPQS threat intelligence
    lines.push({ text: '', color: '#c8c8d0' });
    lines.push({ text: '[OK] RUNNING THREAT ANALYSIS...', color: '#6366f1' });
    if (d.ipData.fraud_score !== null) lines.push({ text: `> FRAUD SCORE: ${d.ipData.fraud_score}/100`, color: '#c8c8d0' });
    lines.push({ text: `> VPN: ${d.ipData.vpn ? '⚠ DETECTED' : 'NOT DETECTED'}`, color: d.ipData.vpn ? '#ef4444' : '#c8c8d0' });
    lines.push({ text: `> PROXY: ${d.ipData.proxy ? '⚠ DETECTED' : 'NOT DETECTED'}`, color: d.ipData.proxy ? '#ef4444' : '#c8c8d0' });
    lines.push({ text: `> TOR: ${d.ipData.tor ? '⚠ DETECTED' : 'NO'}`, color: d.ipData.tor ? '#ef4444' : '#c8c8d0' });
    if (d.ipData.bot) lines.push({ text: '> BOT: ⚠ DETECTED', color: '#ef4444' });
    if (d.ipData.recent_abuse) lines.push({ text: '> RECENT ABUSE: ⚠ FLAGGED', color: '#ef4444' });
    if (d.ipData.host) lines.push({ text: `> HOST: ${d.ipData.host}`, color: '#c8c8d0' });
    lines.push({ text: `> DEVICE TYPE: ${d.ipData.mobile ? 'MOBILE' : 'DESKTOP'}`, color: '#c8c8d0' });

    lines.push({ text: '', color: '#c8c8d0' });
    lines.push({ text: '> ██████████████████ IDENTIFIED', color: '#00ff88' }); // Only green moment
    lines.push({ text: '', color: '#c8c8d0' });
    lines.push({ text: '> Welcome. You have my attention.', color: '#e0e0e0' });

    // Create DOM elements upfront — all hidden
    const lineEls: HTMLDivElement[] = [];
    lines.forEach(({ text, color }) => {
      const el = document.createElement('div');
      el.className = 'font-mono whitespace-pre text-sm md:text-base lg:text-lg leading-relaxed terminal-text';
      el.style.color = color;
      el.style.visibility = 'hidden';
      el.style.minHeight = '1.6em';
      container.appendChild(el);
      lineEls.push(el);
    });

    // Typewriter: type each line character by character, then move to next
    const CHAR_MS = 15;      // ms per character
    const LINE_PAUSE = 100;  // pause between lines
    const SCAN_PAUSE = 500;  // pause after "SCANNING NETWORK..."

    let lineIdx = 0;

    function typeLine() {
      if (lineIdx >= lines.length) {
        // Done — pause then transition
        setTimeout(() => {
          onComplete({
            ip: d.ip,
            city: d.city,
            region: d.region,
            country: d.country,
            isp: d.isp,
            device: d.device,
            os: d.os,
            browser: d.browser,
            screenRes: d.screenRes,
            ipData: d.ipData,
          });
        }, 800);
        return;
      }

      const { text } = lines[lineIdx];
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
    const timeLineIdx = lines.findIndex(l => l.text.startsWith('> LOCAL TIME:'));
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
    <div className="w-full h-full flex items-start justify-start p-4 md:p-8 overflow-auto">
      <div ref={containerRef} className="w-full max-w-4xl" />
    </div>
  );
}
