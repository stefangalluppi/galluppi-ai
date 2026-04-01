'use client';

import { useEffect, useState } from 'react';

interface CommandPaletteProps {
  onClose: () => void;
}

const commands = [
  { id: 'identity', label: 'Navigate to Identity', section: 'identity' },
  { id: 'systems', label: 'Navigate to Systems', section: 'systems' },
  { id: 'contact', label: 'Navigate to Contact', section: 'contact' },
];

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected(prev => (prev + 1) % commands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected(prev => (prev - 1 + commands.length) % commands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const command = commands[selected];
        const element = document.getElementById(command.section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-[100] flex items-start justify-center pt-32 px-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#111111] border border-[#00ff88] w-full max-w-2xl p-6 shadow-[0_0_50px_rgba(0,255,136,0.3)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="font-mono text-[#00ff88] mb-4 text-sm">
          $ command-palette --mode=navigation
        </div>
        
        <div className="space-y-2">
          {commands.map((command, index) => (
            <div
              key={command.id}
              className={`p-3 font-mono cursor-pointer transition-colors ${
                index === selected
                  ? 'bg-[#00ff88]/20 text-[#00ff88] border-l-2 border-[#00ff88]'
                  : 'text-[#666666] hover:text-[#e0e0e0]'
              }`}
              onClick={() => {
                const element = document.getElementById(command.section);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
                onClose();
              }}
              onMouseEnter={() => setSelected(index)}
            >
              {command.label}
            </div>
          ))}
        </div>

        <div className="mt-6 font-mono text-xs text-[#666666]">
          <div>↑↓ navigate • Enter select • Esc close</div>
        </div>
      </div>
    </div>
  );
}
