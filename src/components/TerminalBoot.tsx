'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { UAParser } from 'ua-parser-js';

interface TerminalBootProps {
  onComplete: () => void;
}

interface UserData {
  ip: string;
  city: string;
  regionName: string;
  country: string;
  isp: string;
  device: string;
  os: string;
  browser: string;
  screen: string;
  battery: string;
  time: string;
  referrer: string;
  visitCount: number;
  colorScheme: string;
  connection: string;
  gpu: string;
}

export function TerminalBoot({ onComplete }: TerminalBootProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch IP and geolocation
        const ipResponse = await fetch('https://ip-api.com/json/');
        const ipData = await ipResponse.json();

        // Parse user agent
        const parser = new UAParser();
        const ua = parser.getResult();

        // Get screen resolution
        const screen = `${window.screen.width}×${window.screen.height}`;

        // Get battery (Chrome only)
        let battery = 'N/A';
        try {
          if ('getBattery' in navigator) {
            const batteryManager = await (navigator as any).getBattery();
            const percent = Math.round(batteryManager.level * 100);
            const charging = batteryManager.charging ? 'charging' : 'discharging';
            battery = `${percent}% (${charging})`;
          }
        } catch (e) {
          battery = 'N/A';
        }

        // Get time
        const now = new Date();
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
          hour12: false
        });
        const time = timeFormatter.format(now);

        // Get referrer
        const referrer = document.referrer 
          ? `ORIGIN: ${new URL(document.referrer).hostname}`
          : 'DIRECT ACCESS — no trail';

        // Visit counter
        const visitCount = parseInt(localStorage.getItem('visitCount') || '0', 10) + 1;
        localStorage.setItem('visitCount', visitCount.toString());

        // Color scheme
        const colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light';

        // Connection type
        const connection = (navigator as any).connection?.effectiveType || 'unknown';

        // GPU detection
        let gpu = 'unknown';
        try {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          if (gl) {
            const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
              gpu = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
          }
        } catch (e) {
          gpu = 'N/A';
        }

        setUserData({
          ip: ipData.query || 'unknown',
          city: ipData.city || 'unknown',
          regionName: ipData.regionName || 'unknown',
          country: ipData.country || 'unknown',
          isp: ipData.isp || 'unknown',
          device: `${ua.device.vendor || ''} ${ua.device.model || 'Desktop'}`.trim() || 'Desktop',
          os: `${ua.os.name || 'unknown'} ${ua.os.version || ''}`.trim(),
          browser: `${ua.browser.name || 'unknown'} ${ua.browser.version || ''}`.trim(),
          screen,
          battery,
          time,
          referrer,
          visitCount,
          colorScheme,
          connection,
          gpu
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Set fallback data
        setUserData({
          ip: 'unknown',
          city: 'unknown',
          regionName: 'unknown',
          country: 'unknown',
          isp: 'unknown',
          device: 'Desktop',
          os: 'unknown',
          browser: 'unknown',
          screen: `${window.screen.width}×${window.screen.height}`,
          battery: 'N/A',
          time: new Date().toLocaleTimeString(),
          referrer: 'DIRECT ACCESS',
          visitCount: 1,
          colorScheme: 'dark',
          connection: 'unknown',
          gpu: 'N/A'
        });
      }
    };

    fetchUserData();
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
        hour12: false
      });
      setCurrentTime(timeFormatter.format(now));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Typewriter animation
  useEffect(() => {
    if (!userData || !containerRef.current) return;

    const lines = [
      { text: 'GALLUPPI.AI v1.0 INITIALIZING...', delay: 0 },
      { text: '[OK] SYSTEMS ONLINE', delay: 0.3 },
      { text: '[OK] SCANNING NETWORK...', delay: 0.5 },
      { text: '', delay: 0.2 },
      { text: '> CONNECTION DETECTED', delay: 0.3 },
      { text: `> IP: ${userData.ip}`, delay: 0.2 },
      { text: `> LOCATION: ${userData.city}, ${userData.regionName}, ${userData.country}`, delay: 0.2 },
      { text: `> DEVICE: ${userData.device} / ${userData.os} / ${userData.browser}`, delay: 0.2 },
      { text: `> SCREEN: ${userData.screen}`, delay: 0.2 },
      { text: `> NETWORK: ${userData.isp}`, delay: 0.2 },
      { text: `> BATTERY: ${userData.battery}`, delay: 0.2 },
      { text: `> LOCAL TIME: ${currentTime || userData.time}`, delay: 0.2, id: 'time' },
      { text: `> CONNECTION: ${userData.connection}`, delay: 0.2 },
      { text: `> GPU: ${userData.gpu}`, delay: 0.2 },
      { text: `> COLOR SCHEME: ${userData.colorScheme}`, delay: 0.2 },
      { text: `> ${userData.referrer}`, delay: 0.2 },
      { text: `> VISIT #${userData.visitCount}`, delay: 0.2 },
      { text: '', delay: 0.2 },
      { text: '> ██████████████████ IDENTIFIED', delay: 0.3 },
      { text: '', delay: 0.2 },
      { text: '> Welcome. You have my attention.', delay: 0.5 }
    ];

    const container = containerRef.current;
    container.innerHTML = '';

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 1000);
      }
    });

    let cumulativeDelay = 0;

    lines.forEach((line, index) => {
      const lineEl = document.createElement('div');
      lineEl.className = 'terminal-line font-mono text-[#00ff88] whitespace-pre';
      if (line.id === 'time') {
        lineEl.id = 'time-line';
      }
      
      if (line.text === '') {
        lineEl.innerHTML = '&nbsp;';
        container.appendChild(lineEl);
        cumulativeDelay += line.delay;
      } else {
        container.appendChild(lineEl);
        
        const chars = line.text.split('');
        const charDelay = 0.03;
        
        tl.to({}, {
          duration: line.delay,
          onComplete: () => {
            chars.forEach((char, charIndex) => {
              setTimeout(() => {
                lineEl.textContent += char;
              }, charIndex * charDelay * 1000);
            });
          }
        }, cumulativeDelay);
        
        cumulativeDelay += line.delay + (chars.length * charDelay);
      }
    });

    // Update time line every second
    const timeInterval = setInterval(() => {
      const timeLine = document.getElementById('time-line');
      if (timeLine && currentTime) {
        timeLine.textContent = `> LOCAL TIME: ${currentTime}`;
      }
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [userData, onComplete, currentTime]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-8 overflow-auto">
      <div 
        ref={containerRef}
        className="w-full max-w-4xl text-sm md:text-base lg:text-lg leading-relaxed"
      />
    </div>
  );
}
