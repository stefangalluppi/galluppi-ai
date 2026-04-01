'use client';

import { useEffect, useState } from 'react';
import { TerminalBoot } from '@/components/TerminalBoot';
import { InteractiveTerminal } from '@/components/InteractiveTerminal';
import { ParticleBackground } from '@/components/ParticleBackground';
import { CursorTrail } from '@/components/CursorTrail';
import { CommandPalette } from '@/components/CommandPalette';

interface UserData {
  ip: string;
  city: string;
  region: string;
  country: string;
  isp: string;
  device: string;
  os: string;
  browser: string;
  screenRes: string;
  ipData: {
    fraud_score: number | null;
    vpn: boolean;
    proxy: boolean;
    tor: boolean;
    bot: boolean;
    crawler: boolean;
    mobile: boolean;
    timezone: string;
    recent_abuse: boolean;
    host: string;
  };
}

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBootComplete = (data: UserData) => {
    setUserData(data);
    setBootComplete(true);
  };

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-[#e0e0e0] overflow-x-hidden">
      {/* Background Effects - only show during boot */}
      {!bootComplete && (
        <>
          <ParticleBackground />
          <CursorTrail />
        </>
      )}
      
      {/* Noise Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-noise" />
      
      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 scanline" />

      {/* Terminal Boot Sequence */}
      {!bootComplete && (
        <TerminalBoot onComplete={handleBootComplete} />
      )}

      {/* Interactive Terminal - shown after boot */}
      {bootComplete && userData && (
        <div className="transition-opacity duration-1000 opacity-100">
          <InteractiveTerminal userData={userData} />
        </div>
      )}

      {/* Command Palette */}
      {showCommandPalette && (
        <CommandPalette onClose={() => setShowCommandPalette(false)} />
      )}
    </main>
  );
}
