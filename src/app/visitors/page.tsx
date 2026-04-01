'use client';

import { useEffect, useState, useCallback } from 'react';

interface Visitor {
  ip: string;
  city: string;
  region: string;
  country: string;
  isp: string;
  fraud_score: number | null;
  vpn: boolean;
  proxy: boolean;
  tor: boolean;
  bot: boolean;
  mobile: boolean;
  ua: string;
  ts: number;
  path: string;
  host: string;
}

function ThreatBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-[#333]">—</span>;
  const color = score < 30 ? '#00ff88' : score < 70 ? '#ffaa00' : '#ff3333';
  return <span style={{ color, fontWeight: 600 }}>{score}</span>;
}

function FlagBadge({ active, label }: { active: boolean; label: string }) {
  if (!active) return null;
  return (
    <span className="inline-block px-1.5 py-0.5 text-[0.6rem] font-bold rounded mr-1"
      style={{
        background: label === 'TOR' ? '#ff333322' : label === 'VPN' ? '#ffaa0022' : '#ff333322',
        color: label === 'TOR' ? '#ff3333' : label === 'VPN' ? '#ffaa00' : '#ff3333',
        border: `1px solid ${label === 'TOR' ? '#ff333344' : label === 'VPN' ? '#ffaa0044' : '#ff333344'}`,
      }}
    >
      {label}
    </span>
  );
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export default function VisitorsPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<number>(0);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchVisitors = useCallback(async (auth: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/visitors?auth=${encodeURIComponent(auth)}`);
      if (res.status === 401) {
        setAuthed(false);
        setError('Access denied.');
        return;
      }
      const data = await res.json();
      setVisitors(data.visitors || []);
      setLastRefresh(Date.now());
    } catch {
      setError('Connection failed.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch(`/api/visitors?auth=${encodeURIComponent(password)}`);
    if (res.ok) {
      setAuthed(true);
      const data = await res.json();
      setVisitors(data.visitors || []);
      setLastRefresh(Date.now());
      sessionStorage.setItem('vauth', password);
    } else {
      setError('Wrong password. Gilfoyle is watching.');
    }
  };

  // Check session storage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('vauth');
    if (saved) {
      setPassword(saved);
      setAuthed(true);
      fetchVisitors(saved);
    }
  }, [fetchVisitors]);

  // Auto-refresh every 15s
  useEffect(() => {
    if (!authed || !autoRefresh) return;
    const interval = setInterval(() => {
      const auth = sessionStorage.getItem('vauth') || password;
      fetchVisitors(auth);
    }, 15000);
    return () => clearInterval(interval);
  }, [authed, autoRefresh, password, fetchVisitors]);

  // Auth gate
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-mono">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="border border-[#1a1a1a] bg-[#0d0d0d] p-8 rounded">
            <div className="text-[#00ff88] text-sm mb-1">GALLUPPI.AI</div>
            <div className="text-[#333] text-xs mb-6">VISITOR INTELLIGENCE — RESTRICTED ACCESS</div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#00ff88] text-sm">$</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="authenticate ••••••••"
                className="flex-1 bg-transparent border-none outline-none text-[#00ff88] text-sm placeholder-[#333]"
                autoFocus
              />
            </div>

            {error && <div className="text-[#ff3333] text-xs mb-4">{error}</div>}
            
            <button type="submit" className="w-full py-2 bg-[#00ff8811] border border-[#00ff8833] text-[#00ff88] text-xs rounded hover:bg-[#00ff8822] transition-colors">
              ACCESS
            </button>
          </div>
        </form>
      </div>
    );
  }

  const uniqueIps = new Set(visitors.map(v => v.ip)).size;
  const vpnCount = visitors.filter(v => v.vpn).length;
  const torCount = visitors.filter(v => v.tor).length;
  const botCount = visitors.filter(v => v.bot).length;
  const avgThreat = visitors.filter(v => v.fraud_score !== null).length > 0
    ? Math.round(visitors.filter(v => v.fraud_score !== null).reduce((a, v) => a + (v.fraud_score || 0), 0) / visitors.filter(v => v.fraud_score !== null).length)
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#888] font-mono text-xs">
      {/* Header */}
      <div className="border-b border-[#1a1a1a] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[#00ff88] text-sm font-bold">GALLUPPI.AI</span>
            <span className="text-[#333] mx-3">│</span>
            <span className="text-[#555]">VISITOR INTELLIGENCE CENTER</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-2 py-1 rounded text-[0.65rem] border ${autoRefresh ? 'border-[#00ff8844] text-[#00ff88] bg-[#00ff8811]' : 'border-[#333] text-[#555]'}`}
            >
              {autoRefresh ? '● LIVE' : '○ PAUSED'}
            </button>
            <span className="text-[#333]">
              {lastRefresh ? `updated ${timeAgo(lastRefresh)}` : ''}
            </span>
            {loading && <span className="text-[#00ff88] animate-pulse">⟳</span>}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="border-b border-[#1a1a1a] px-6 py-3 flex gap-8">
        <Stat label="TOTAL HITS" value={String(visitors.length)} color="#00ff88" />
        <Stat label="UNIQUE IPs" value={String(uniqueIps)} color="#00ff88" />
        <Stat label="AVG THREAT" value={String(avgThreat)} color={avgThreat < 30 ? '#00ff88' : avgThreat < 70 ? '#ffaa00' : '#ff3333'} />
        <Stat label="VPN" value={String(vpnCount)} color={vpnCount > 0 ? '#ffaa00' : '#333'} />
        <Stat label="TOR" value={String(torCount)} color={torCount > 0 ? '#ff3333' : '#333'} />
        <Stat label="BOT" value={String(botCount)} color={botCount > 0 ? '#ff3333' : '#333'} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a] text-[#555] text-[0.6rem] uppercase tracking-wider">
              <th className="text-left px-6 py-3 font-medium">Time</th>
              <th className="text-left px-4 py-3 font-medium">IP</th>
              <th className="text-left px-4 py-3 font-medium">Location</th>
              <th className="text-left px-4 py-3 font-medium">ISP / Host</th>
              <th className="text-left px-4 py-3 font-medium">Threat</th>
              <th className="text-left px-4 py-3 font-medium">Flags</th>
              <th className="text-left px-4 py-3 font-medium">Path</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v, i) => {
              const isNew = Date.now() - v.ts < 60000;
              return (
                <tr
                  key={`${v.ts}-${i}`}
                  className={`border-b border-[#111] hover:bg-[#0f0f0f] transition-colors ${isNew ? 'animate-flash' : ''}`}
                >
                  <td className="px-6 py-2.5 text-[#555] whitespace-nowrap">
                    {new Date(v.ts).toLocaleTimeString('en-US', { hour12: false })}
                    <span className="text-[#333] ml-2">{timeAgo(v.ts)}</span>
                  </td>
                  <td className="px-4 py-2.5 text-[#00ff88] whitespace-nowrap font-medium">{v.ip}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="text-[#aaa]">{v.city}</span>
                    <span className="text-[#333]">, </span>
                    <span className="text-[#666]">{v.country}</span>
                  </td>
                  <td className="px-4 py-2.5 text-[#666] whitespace-nowrap max-w-[200px] truncate">
                    {v.isp}
                    {v.host && v.host !== v.ip && (
                      <span className="text-[#333] ml-1">({v.host})</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <ThreatBadge score={v.fraud_score} />
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <FlagBadge active={v.vpn} label="VPN" />
                    <FlagBadge active={v.tor} label="TOR" />
                    <FlagBadge active={v.bot} label="BOT" />
                    <FlagBadge active={v.mobile} label="MOB" />
                  </td>
                  <td className="px-4 py-2.5 text-[#444] whitespace-nowrap">{v.path}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {visitors.length === 0 && (
          <div className="text-center py-20 text-[#333]">
            No visitors recorded yet. They&apos;ll show up.
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes flash {
          0% { background-color: #00ff8815; }
          100% { background-color: transparent; }
        }
        .animate-flash {
          animation: flash 2s ease-out;
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className="text-[0.6rem] text-[#555] uppercase tracking-wider mb-0.5">{label}</div>
      <div className="text-lg font-bold" style={{ color }}>{value}</div>
    </div>
  );
}
