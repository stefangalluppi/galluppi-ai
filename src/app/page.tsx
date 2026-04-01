'use client';

import { useEffect, useState, useRef } from 'react';
import { TerminalBoot } from '@/components/TerminalBoot';
import { ScrollSections } from '@/components/ScrollSections';
import { ParticleBackground } from '@/components/ParticleBackground';
import { CursorTrail } from '@/components/CursorTrail';
import { CommandPalette } from '@/components/CommandPalette';

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);
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

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-[#e0e0e0] overflow-x-hidden">
      {/* Background Effects */}
      <ParticleBackground />
      <CursorTrail />
      
      {/* Noise Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-noise" />
      
      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 scanline" />

      {/* Terminal Boot Sequence */}
      {!bootComplete && (
        <TerminalBoot onComplete={() => setBootComplete(true)} />
      )}

      {/* Main Content - Hidden during boot */}
      <div className={`transition-opacity duration-1000 ${bootComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <ScrollSections />
      </div>

      {/* Command Palette */}
      {showCommandPalette && (
        <CommandPalette onClose={() => setShowCommandPalette(false)} />
      )}
    </main>
  );
}
