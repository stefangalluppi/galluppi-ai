'use client';

import { useEffect, useState } from 'react';
import { TerminalBoot } from '@/components/TerminalBoot';
import { InteractiveTerminal } from '@/components/InteractiveTerminal';
import { ASCIIArt } from '@/components/ASCIIArt';

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
  const [artComplete, setArtComplete] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleBootComplete = (data: UserData) => {
    setUserData(data);
    setBootComplete(true);
  };

  const handleArtComplete = () => {
    setArtComplete(true);
  };

  return (
    <main className="min-h-screen bg-[#0d0d1a] flex items-center justify-center p-0 md:p-8">
      {/* Noise Grain Overlay */}
      <div className="noise-overlay" />

      {/* Terminal Window Frame */}
      <div className="terminal-window w-full md:w-[90vw] h-screen md:h-[85vh]">
        {/* Title Bar */}
        <div className="title-bar">
          <div className="traffic-lights">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <span className="title">galluppi.ai — terminal</span>
        </div>

        {/* Terminal Body */}
        <div className="terminal-body">
          {/* Boot Sequence */}
          {!bootComplete && (
            <TerminalBoot onComplete={handleBootComplete} />
          )}

          {/* ASCII Art Hero */}
          {bootComplete && !artComplete && (
            <ASCIIArt onComplete={handleArtComplete} />
          )}

          {/* Interactive Terminal */}
          {artComplete && userData && (
            <div className="fade-in">
              <InteractiveTerminal userData={userData} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
