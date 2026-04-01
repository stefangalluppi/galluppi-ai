'use client';

import { useState } from 'react';
import { TerminalBoot } from '@/components/TerminalBoot';
import { InteractiveTerminal } from '@/components/InteractiveTerminal';

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

  const handleBootComplete = (data: UserData) => {
    setUserData(data);
    setBootComplete(true);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-0 md:p-6">
      <div className="terminal-window w-full md:w-[92vw] h-screen md:h-[85vh]">
        <div className="title-bar">
          <span className="title">galluppi.ai</span>
        </div>
        <div className="terminal-body">
          {!bootComplete && (
            <TerminalBoot onComplete={handleBootComplete} />
          )}
          {bootComplete && userData && (
            <InteractiveTerminal userData={userData} />
          )}
        </div>
      </div>
    </main>
  );
}
