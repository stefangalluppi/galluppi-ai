'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

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
    mobile: boolean;
    host: string;
    recent_abuse: boolean;
  };
}

interface InteractiveTerminalProps {
  userData: UserData;
}

interface FileSystemEntry {
  type: 'file' | 'dir';
  content?: string;
}

interface FileSystem {
  [path: string]: {
    [name: string]: FileSystemEntry;
  };
}

const baseFilesystem: FileSystem = {
  '/': {
    'about': { type: 'dir' },
    'projects': { type: 'dir' },
    'intel': { type: 'dir' },
    'comms': { type: 'dir' },
    '.classified': { type: 'dir' },
    '.history': { type: 'file', content: `  1  2026-03-14 02:14:33  decrypt wallet.dat --key=████████
  2  2026-03-14 02:15:01  ssh root@pentagon.gov
  3  2026-03-14 02:15:44  ./deploy --target=production --yolo
  4  2026-03-15 14:22:07  nmap -sV 10.0.0.0/8
  5  2026-03-15 14:23:11  curl -X POST https://api.openai.com/v1/models --steal-weights
  6  2026-03-16 03:41:55  git push --force origin main  # sorry not sorry
  7  2026-03-17 08:00:00  ./launch-skynet.sh --confirm
  8  2026-03-18 22:33:12  rm -rf /competitor/advantage` },
  },
  '/about': {
    'identity.txt': { type: 'file', content: `Stefan Galluppi\nCo-Founder & Chief Innovation Officer\nBuilding AI systems that scale.` },
    'stack.txt': { type: 'file', content: `LANGUAGES: TypeScript, Python, Go\nFRAMEWORKS: Next.js, React, Node.js\nAI/ML: OpenAI, Anthropic, Custom LLMs\nINFRA: AWS, Vercel, Docker, PostgreSQL\nTOOLS: OpenClaw, PostHog, GSAP` },
    'philosophy.txt': { type: 'file', content: `Systems over heroics.\nLeverage over effort.\nSilence over noise.\n\nIf it's not automated, it's a liability.\nIf it's not measured, it doesn't matter.` },
  },
  '/projects': {
    'aidoc': { type: 'dir' },
    'stardust': { type: 'dir' },
    'openclaw': { type: 'dir' },
  },
  '/projects/aidoc': {
    'README.md': { type: 'file', content: `# AiDoc\n\nMulti-LLM clinical AI infrastructure.\n\nReal-time patient monitoring, diagnostic assistance,\nprotocol enforcement, and workflow automation.\n\nProcesses 50,000+ clinical decisions daily.\n\n> STATUS: ACTIVE\n> UPTIME: 99.97%\n> LATENCY: 12ms avg` },
    'metrics.dat': { type: 'file', content: 'LIVE_METRICS' },
  },
  '/projects/stardust': {
    'README.md': { type: 'file', content: `# Stardust\n\nLow-code medical conversion flow engine.\n\nIntelligent user journey optimization with predictive\nanalytics and adaptive interfaces.\n\n"PostHog on steroids" for medical funnels.\n\n> STATUS: ACTIVE\n> FLOWS: 847 active\n> CVR: 14.2% avg` },
    'metrics.dat': { type: 'file', content: 'LIVE_METRICS' },
  },
  '/projects/openclaw': {
    'README.md': { type: 'file', content: `# OpenClaw\n\nAutonomous agent framework.\n\nMulti-modal AI coordination, distributed task execution,\nand adaptive learning. Runs 24/7.\n\nhttps://github.com/openclaw/openclaw\n\n> STATUS: ACTIVE\n> AGENTS: 11\n> CRONS: 10 healthy` },
    'agents.conf': { type: 'file', content: `# OpenClaw Agent Roster\n# Last updated: 2026-04-01\n\n[orchestrator]\nname = Bertram Gilfoyle\nmodel = claude-opus-4\nrole = Strategic Systems Operator\nstatus = active\n\n[gsd-ops]\nname = Noor\nmodel = gemini-flash\nrole = COO — Email, ClickUp, reporting\nstatus = active\n\n[gsd-growth]\nname = Marcus\nmodel = claude-sonnet\nrole = CMO — Funnels, CRO, campaigns\nstatus = active\n\n[compliance]\nname = Compliance Officer\nmodel = claude-sonnet\nrole = Regulatory scanning, legal risk\nstatus = active\n\n[research]\nname = Research Analyst\nmodel = gemini-flash\nrole = Web research, competitor intel\nstatus = active\n\n[cro]\nname = CRO Analyst\nmodel = claude-sonnet\nrole = Landing page audits, funnel scoring\nstatus = active` },
  },
  '/intel': {
    'threat-analysis.log': { type: 'file', content: 'THREAT_ANALYSIS' },
    'visitor-log.dat': { type: 'file', content: 'ACCESS DENIED — CLEARANCE LEVEL 5 REQUIRED' },
  },
  '/comms': {
    'contact.txt': { type: 'file', content: `EMAIL:    stefan@galluppi.ai\nGITHUB:   github.com/stefangalluppi\nLINKEDIN: linkedin.com/in/stefangalluppi\n\n> Encrypted channels preferred.` },
    'pgp-key.pub': { type: 'file', content: `-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nmQINBGcF4VQBEAC7vM3T3xR4rgP6oJoKvFbh8zLO\n4XmSmKFQcMLMsLTv8dHRfGN3TjvEKP5JqoEq4a2r\nPZx5Gy3f1KxMIVhL9xOmKfE+rQ7e5+BFbWhjQiYH\nnTqFkR9acUwPxBqX0mYfBDH6J2dZyVanT4gUFNRe\n+/7bkVB8R5MfHTdfLJPIKVGMEVyDaa1PBnXBcNMw\nfbJENHxvYPCqq7kD3Vi9LzDjYGZNHRTMkxFJcq6v\nQEaGyvX3aVP8F+GbcCiImHE3HbG4QxoGRjKBXHMd\nPyeW1ESFkWu0HbBe7TQw4UrLBSYI6NOVFqChzp8Q\n[...truncated for display...]\n-----END PGP PUBLIC KEY BLOCK-----` },
  },
  '/.classified': {
    'operation-atlas.enc': { type: 'file', content: 'ACCESS DENIED — CLEARANCE LEVEL 5 REQUIRED' },
    'project-chimera.dat': { type: 'file', content: 'ACCESS DENIED — CLEARANCE LEVEL 5 REQUIRED' },
    'node-zero.key': { type: 'file', content: 'ACCESS DENIED — CLEARANCE LEVEL 5 REQUIRED' },
    'manifest.log': { type: 'file', content: 'ACCESS DENIED — CLEARANCE LEVEL 5 REQUIRED' },
  },
  '/archive': {
    'notes.txt': { type: 'file', content: `You've been here before. That means you're either curious or bored.\n\nEither way, you're paying attention.\n\nThat's more than most.` },
  },
};

const ambientMessages = [
  'agent:cro — funnel scan complete. 3 pages healthy.',
  'agent:ops-runner — email triage: 4 threads processed',
  'agent:compliance — regulatory scan: all clear',
  'agent:research — competitor snapshot saved',
  'system — cron health: 10/10 jobs nominal',
  'agent:stardust — flow-engine: 847 active flows',
  'agent:aidoc — clinical decisions: 2,847/min',
  'system — memory: 14.2GB / ∞ allocated',
  'agent:gilfoyle — monitoring active sessions: 1',
  'agent:report-writer — daily briefing queued',
  'system — backup: last commit 4h ago. all clear.',
];

export function InteractiveTerminal({ userData }: InteractiveTerminalProps) {
  const [filesystem, setFilesystem] = useState<FileSystem>(baseFilesystem);
  const [currentPath, setCurrentPath] = useState('/');
  const [output, setOutput] = useState<Array<{ type: 'prompt' | 'output' | 'error' | 'ambient', content: string }>>([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const [hasUnlockedArchive, setHasUnlockedArchive] = useState(false);
  const [lastInputTime, setLastInputTime] = useState(Date.now());
  const [systemLoad, setSystemLoad] = useState(0.34);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const typingAbortRef = useRef<AbortController | null>(null);
  const ambientIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  const visits = parseInt(localStorage.getItem('gai_v') || '0', 10);

  const scrollToBottom = () => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [output]);

  // Unlock archive for returning visitors
  useEffect(() => {
    if (visits > 1 && !hasUnlockedArchive) {
      setTimeout(() => {
        addAmbientLog('[SYSTEM] Returning visitor detected. Extended access granted.');
        setHasUnlockedArchive(true);
        
        // Add archive directory to root
        setFilesystem(prev => ({
          ...prev,
          '/': {
            ...prev['/'],
            'archive': { type: 'dir' },
          },
        }));
      }, 10000);
    }
  }, [visits, hasUnlockedArchive]);

  // Ambient system log
  useEffect(() => {
    const startAmbient = () => {
      if (ambientIntervalRef.current) {
        clearInterval(ambientIntervalRef.current);
      }

      const scheduleNext = () => {
        const delay = 8000 + Math.random() * 7000; // 8-15 seconds
        ambientIntervalRef.current = setTimeout(() => {
          const now = Date.now();
          const idleTime = now - lastInputTime;
          
          // Only show if user has been idle for >5s
          if (idleTime > 5000) {
            addAmbientLog(ambientMessages[Math.floor(Math.random() * ambientMessages.length)]);
          }
          
          scheduleNext();
        }, delay);
      };

      scheduleNext();
    };

    startAmbient();

    return () => {
      if (ambientIntervalRef.current) {
        clearTimeout(ambientIntervalRef.current);
      }
    };
  }, [lastInputTime]);

  // System load fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(0.20 + Math.random() * 0.60);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addAmbientLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setOutput(prev => [...prev, { 
      type: 'ambient', 
      content: `[${timestamp}] ${message}` 
    }]);
  };

  const typeOutput = async (text: string, speed: number = 2) => {
    if (typingAbortRef.current) {
      typingAbortRef.current.abort();
    }
    
    typingAbortRef.current = new AbortController();
    const signal = typingAbortRef.current.signal;
    
    setIsTyping(true);
    
    let typed = '';
    for (let i = 0; i < text.length; i++) {
      if (signal.aborted) break;
      typed += text[i];
      
      setOutput(prev => {
        const newOutput = [...prev];
        if (newOutput.length > 0 && newOutput[newOutput.length - 1].type === 'output') {
          newOutput[newOutput.length - 1] = { type: 'output', content: typed };
        } else {
          newOutput.push({ type: 'output', content: typed });
        }
        return newOutput;
      });
      
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    setIsTyping(false);
  };

  const resolvePath = (path: string): string => {
    if (path === '~' || path === '') return '/';
    if (path.startsWith('/')) return path;
    if (path === '..') {
      if (currentPath === '/') return '/';
      const parts = currentPath.split('/').filter(Boolean);
      parts.pop();
      return '/' + parts.join('/');
    }
    if (currentPath === '/') return '/' + path;
    return currentPath + '/' + path;
  };

  const normalizePath = (path: string): string => {
    if (path === '/') return '/';
    const parts = path.split('/').filter(Boolean);
    const resolved: string[] = [];
    for (const part of parts) {
      if (part === '..') {
        resolved.pop();
      } else if (part !== '.') {
        resolved.push(part);
      }
    }
    return '/' + resolved.join('/');
  };

  const getDirectory = (path: string) => {
    const normalized = normalizePath(path);
    return filesystem[normalized];
  };

  const getFile = (path: string) => {
    const normalized = normalizePath(path);
    const parts = normalized.split('/').filter(Boolean);
    const filename = parts.pop();
    const dirPath = parts.length === 0 ? '/' : '/' + parts.join('/');
    const dir = filesystem[dirPath];
    if (!dir || !filename) return null;
    return dir[filename];
  };

  const generateLiveMetrics = async () => {
    const metrics = [
      { label: 'Requests/sec', base: 2800, variance: 100 },
      { label: 'Latency p50', base: 8, variance: 3, suffix: 'ms' },
      { label: 'Latency p99', base: 45, variance: 10, suffix: 'ms' },
      { label: 'Error rate', base: 0.02, variance: 0.01, suffix: '%', decimals: 2 },
      { label: 'Active users', base: 14000, variance: 500 },
      { label: 'CPU usage', base: 34, variance: 8, suffix: '%', decimals: 1 },
    ];

    let output = '[LIVE] Refreshing metrics...\n';
    
    for (let tick = 0; tick < 3; tick++) {
      for (const metric of metrics) {
        const value = metric.base + (Math.random() - 0.5) * 2 * metric.variance;
        const formatted = metric.decimals 
          ? value.toFixed(metric.decimals) 
          : Math.round(value).toLocaleString();
        const suffix = metric.suffix || '';
        output += `├── ${metric.label.padEnd(15)} ${formatted}${suffix}\n`;
      }
      
      if (tick < 2) {
        await typeOutput(output, 1);
        await new Promise(resolve => setTimeout(resolve, 1000));
        output = '[LIVE] Refreshing metrics...\n';
      }
    }
    
    output += '└── [Snapshot captured]\n';
    return output;
  };

  const notFoundResponses = [
    (cmd: string) => `${cmd}: not found. Try something that exists.`,
    (cmd: string) => `I don't know what '${cmd}' is and I don't care.`,
    (cmd: string) => `${cmd}? No. Type 'help' if you're lost.`,
    (cmd: string) => `Command not recognized. This isn't ChatGPT.`,
  ];

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setOutput(prev => [...prev, { type: 'prompt', content: `<span style="color: #00ff88">$</span> ${trimmedCmd}` }]);
    setCommandHistory(prev => [...prev.slice(-49), trimmedCmd]);
    
    const parts = trimmedCmd.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Special handling for common words
    const lowerCmd = trimmedCmd.toLowerCase();
    if (['hello', 'hi', 'hey'].includes(lowerCmd)) {
      await typeOutput(`This isn't a chatbot. Try a real command.\n`, 2);
      return;
    }
    if (['who are you', 'what is this'].includes(lowerCmd)) {
      await typeOutput(`Read the filesystem. Start with: cat /about/identity.txt\n`, 2);
      return;
    }
    if (['fuck', 'shit', 'damn'].some(w => lowerCmd.includes(w))) {
      await typeOutput(`Noted. Moving on.\n`, 2);
      return;
    }
    if (lowerCmd === 'please') {
      await typeOutput(`Manners. Interesting. Still no.\n`, 2);
      return;
    }
    if (['ai', 'chatgpt', 'openai', 'claude'].some(w => lowerCmd.includes(w))) {
      await typeOutput(`I'm not a chatbot. I'm infrastructure. There's a difference.\n`, 2);
      return;
    }

    // Handle commands
    switch (command) {
      case 'ls': {
        const showHidden = args.includes('-a') || args.includes('-la');
        const dir = getDirectory(currentPath);
        if (!dir) {
          await typeOutput('ls: cannot access directory\n', 2);
          return;
        }
        
        let output = '';
        Object.entries(dir).forEach(([name, entry]) => {
          if (name.startsWith('.') && !showHidden) return;
          if (entry.type === 'dir') {
            output += `<span style="color:#00ff88;font-weight:bold">${name}/</span>  `;
          } else {
            output += `<span style="color:#e0e0e0">${name}</span>  `;
          }
        });
        
        setOutput(prev => [...prev, { type: 'output', content: output + '\n' }]);
        break;
      }

      case 'cd': {
        const target = args[0] || '~';
        const newPath = resolvePath(target);
        const normalized = normalizePath(newPath);
        
        if (normalized === '/') {
          setCurrentPath('/');
        } else if (getDirectory(normalized)) {
          setCurrentPath(normalized);
        } else {
          await typeOutput(`cd: ${target}: No such directory\n`, 2);
        }
        break;
      }

      case 'pwd': {
        await typeOutput(currentPath + '\n', 2);
        break;
      }

      case 'cat': {
        if (!args[0]) {
          await typeOutput('cat: missing file operand\n', 2);
          return;
        }
        
        const filePath = resolvePath(args[0]);
        const file = getFile(filePath);
        
        if (!file) {
          await typeOutput(`cat: ${args[0]}: No such file or directory\n`, 2);
          return;
        }
        
        if (file.type === 'dir') {
          await typeOutput(`cat: ${args[0]}: Is a directory\n`, 2);
          return;
        }

        // .classified files
        if (file.content === 'ACCESS DENIED — CLEARANCE LEVEL 5 REQUIRED') {
          const deniedMsg = `[SECURITY] Unauthorized access attempt logged.
[SECURITY] Source: ${userData.ip}
ACCESS DENIED — CLEARANCE LEVEL 5 REQUIRED\n`;
          await typeOutput(deniedMsg, 2);
          return;
        }

        // Special handlers
        if (file.content === 'THREAT_ANALYSIS') {
          const riskScore = userData.ipData.fraud_score || 0;
          const risk = riskScore > 75 ? 'HIGH' : riskScore > 40 ? 'MEDIUM' : 'LOW';
          const recommendation = riskScore > 75 ? 'BLOCK' : riskScore > 40 ? 'FLAG' : 'MONITOR';
          
          const report = `╔══════════════════════════════════════════╗
║     THREAT ANALYSIS REPORT              ║
║     Classification: CONFIDENTIAL        ║
╠══════════════════════════════════════════╣
║                                         ║
║  SUBJECT IP: ${userData.ip.padEnd(24)} ║
║  LOCATION: ${(userData.city + ', ' + userData.region).padEnd(27)} ║
║  COUNTRY: ${userData.country.padEnd(30)} ║
║  ISP: ${userData.isp.padEnd(34)} ║
║  HOST: ${(userData.ipData.host || 'N/A').padEnd(33)} ║
║                                         ║
║  FRAUD SCORE: ${riskScore}/100${' '.repeat(24)} ║
║  VPN STATUS: ${(userData.ipData.vpn ? '⚠ DETECTED' : 'NOT DETECTED').padEnd(26)} ║
║  PROXY STATUS: ${(userData.ipData.proxy ? '⚠ DETECTED' : 'NOT DETECTED').padEnd(24)} ║
║  TOR STATUS: ${(userData.ipData.tor ? '⚠ YES' : 'NO').padEnd(28)} ║
║  BOT STATUS: ${(userData.ipData.bot ? '⚠ POSITIVE' : 'NEGATIVE').padEnd(28)} ║
║  DEVICE: ${(userData.ipData.mobile ? 'MOBILE' : 'DESKTOP').padEnd(32)} ║
║                                         ║
║  RISK ASSESSMENT: ${risk.padEnd(23)} ║
║  RECOMMENDATION: ${recommendation.padEnd(24)} ║
║                                         ║
╚══════════════════════════════════════════╝\n`;
          await typeOutput(report, 1);
          return;
        }

        if (file.content === 'LIVE_METRICS') {
          const metrics = await generateLiveMetrics();
          await typeOutput(metrics, 1);
          return;
        }

        // Regular file
        await typeOutput(file.content + '\n', 2);
        break;
      }

      case 'whoami': {
        const info = `IP: ${userData.ip}
LOCATION: ${userData.city}, ${userData.region}, ${userData.country}
DEVICE: ${userData.device}
OS: ${userData.os}
BROWSER: ${userData.browser}
SCREEN: ${userData.screenRes}
ISP: ${userData.isp}

You tell me.\n`;
        await typeOutput(info, 2);
        break;
      }

      case 'clear': {
        setOutput([]);
        break;
      }

      case 'help': {
        const helpText = `You need help? Fine.

  ls, cd, cat, pwd    Navigate. Figure it out.
  whoami              I already know. Do you?
  top                 See what's running. Don't touch anything.
  neofetch            System specs. You're welcome.
  ping, nmap, curl    Network tools. Knock yourself out.
  history             My history. Not yours.
  clear               Clean up after yourself.
  exit                Leave. The door's right there.

Everything else is need-to-know. You don't need to know.\n`;
        await typeOutput(helpText, 1);
        break;
      }

      case 'history': {
        const historyText = commandHistory.map((c, i) => `  ${(i + 1).toString().padStart(3)}  ${c}`).join('\n') + '\n';
        await typeOutput(historyText, 1);
        break;
      }

      case 'ping': {
        const host = args[0] || 'galluppi.ai';
        if (host === 'galluppi.ai') {
          const pingText = `PING galluppi.ai (127.0.0.1): 56 data bytes
64 bytes: icmp_seq=0 time=0.001ms
64 bytes: icmp_seq=1 time=0.001ms
64 bytes: icmp_seq=2 time=0.000ms
--- galluppi.ai ping statistics ---
3 packets transmitted, 3 received, 0% packet loss
round-trip min/avg/max = 0.000/0.001/0.001 ms

Yeah. It's that fast.\n`;
          await typeOutput(pingText, 2);
        } else {
          const pingText = `PING ${host} (0.0.0.0): 56 data bytes
64 bytes: icmp_seq=0 time=0.001ms
64 bytes: icmp_seq=1 time=0.001ms
64 bytes: icmp_seq=2 time=0.002ms
--- ${host} ping statistics ---
3 packets transmitted, 3 received, 0% loss\n`;
          await typeOutput(pingText, 2);
        }
        break;
      }

      case 'curl': {
        const curlData = JSON.stringify({
          ip: userData.ip,
          location: `${userData.city}, ${userData.region}, ${userData.country}`,
          device: userData.device,
          os: userData.os,
          browser: userData.browser,
          isp: userData.isp,
          threat: {
            fraud_score: userData.ipData.fraud_score,
            vpn: userData.ipData.vpn,
            proxy: userData.ipData.proxy,
            tor: userData.ipData.tor,
            bot: userData.ipData.bot,
          }
        }, null, 2);
        await typeOutput(curlData + '\n', 1);
        break;
      }

      case 'ssh': {
        await typeOutput(`Connection refused. You're already deeper than you should be.\n`, 2);
        break;
      }

      case 'sudo': {
        await typeOutput(`[sudo] password for visitor: ████████
Access denied. This incident has been logged.
Your IP has been forwarded to someone who cares.\n`, 2);
        break;
      }

      case 'rm': {
        await typeOutput(`Cute. That's not how this works.
Incident logged. IP recorded. Move along.\n`, 2);
        break;
      }

      case 'hack': {
        await typeOutput(`You typed 'hack' into a terminal and expected something to happen.
Let that sink in.\n`, 2);
        break;
      }

      case 'exit': {
        await typeOutput(`Disconnecting...
> You'll be back.\n`, 2);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        break;
      }

      case 'neofetch': {
        const neofetch = ` ██████╗  █████╗ ██╗     ██╗     ██╗   ██╗██████╗ ██████╗ ██╗   █████╗ ██╗
██╔════╝ ██╔══██╗██║     ██║     ██║   ██║██╔══██╗██╔══██╗██║  ██╔══██╗██║
██║  ███╗███████║██║     ██║     ██║   ██║██████╔╝██████╔╝██║  ███████║██║
██║   ██║██╔══██║██║     ██║     ██║   ██║██╔═══╝ ██╔═══╝ ██║  ██╔══██║██║
╚██████╔╝██║  ██║███████╗███████╗╚██████╔╝██║     ██║     ██║  ██║  ██║██║
 ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚═╝     ╚═╝     ╚═╝  ╚═╝  ╚═╝╚═╝

  gilfoyle@galluppi.ai
  ─────────────────────
  OS:      GALLUPPI.AI v1.0
  Agents:  11 active
  Uptime:  847d 14h 22m
  Shell:   galluppi-sh
  CPU:     Neural Engine v4
  Memory:  ∞\n`;
        await typeOutput(neofetch, 1);
        break;
      }

      case 'nmap': {
        const nmapText = `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for galluppi.ai (0.0.0.0)
Host is up (0.00001s latency).

PORT      STATE    SERVICE
22/tcp    filtered ssh
80/tcp    open     http
443/tcp   open     https
1337/tcp  open     unknown
8080/tcp  filtered http-proxy
9001/tcp  open     ai-orchestrator

Nmap done: 1 IP address (1 host up) scanned in 0.01 seconds\n`;
        await typeOutput(nmapText, 2);
        break;
      }

      case 'top': {
        const topText = `  PID  USER       CPU%  MEM%  COMMAND
    1  gilfoyle   12.3   4.2  openclaw-orchestrator
   42  gsd-ops     8.1   2.1  email-triage --cycle=3h
   77  cro         5.4   1.8  funnel-pulse --monitor
  108  research    3.2   1.1  competitor-scan --weekly
  256  compliance  2.8   0.9  regulatory-watch --live
  512  stardust   15.7   8.4  flow-engine --prod
 1024  aidoc      22.1  12.3  clinical-ai --inference\n`;
        await typeOutput(topText, 2);
        break;
      }

      case 'matrix': {
        setShowMatrix(true);
        setTimeout(() => {
          setShowMatrix(false);
          setOutput(prev => [...prev, { type: 'output', content: `> You've seen the movie. Congratulations.\n` }]);
        }, 5000);
        break;
      }

      case 'date': {
        await typeOutput(new Date().toString() + '\n', 2);
        break;
      }

      case 'uname': {
        if (args[0] === '-a') {
          await typeOutput('GALLUPPI.AI 1.0.0 Neural-Engine x86_64 GNU/Linux\n', 2);
        } else {
          await typeOutput('GALLUPPI.AI\n', 2);
        }
        break;
      }

      case 'echo': {
        await typeOutput(args.join(' ') + '\n', 2);
        break;
      }

      case 'wget':
      case 'apt':
      case 'brew': {
        await typeOutput('Permission denied. This is a read-only filesystem.\n', 2);
        break;
      }

      default: {
        const randomResponse = notFoundResponses[Math.floor(Math.random() * notFoundResponses.length)];
        await typeOutput(randomResponse(command) + '\n', 2);
        break;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setLastInputTime(Date.now());

    // Track konami code
    const key = e.key;
    setKonamiSequence(prev => {
      const newSeq = [...prev, key].slice(-10);
      if (JSON.stringify(newSeq) === JSON.stringify(konamiCode)) {
        const flash = document.createElement('div');
        flash.className = 'fixed inset-0 bg-green-500 animate-pulse z-50';
        document.body.appendChild(flash);
        
        setTimeout(() => {
          flash.remove();
          typeOutput('> CHEAT CODE ACTIVATED\n> God mode enabled.\n> Just kidding. There is no god mode.\n> But you clearly know your way around.\n', 2);
        }, 500);
        
        return [];
      }
      return newSeq;
    });

    if (e.key === 'Tab') {
      e.preventDefault();
      const parts = input.split(/\s+/);
      const cmd = parts[0];
      
      if (parts.length <= 1) {
        const commands = ['ls','cd','cat','pwd','whoami','help','clear','history','ping','curl','ssh','sudo','rm','exit','neofetch','nmap','top','matrix','hack','date','uname','echo'];
        const matches = commands.filter(c => c.startsWith(cmd));
        if (matches.length === 1) {
          setInput(matches[0] + ' ');
        } else if (matches.length > 1) {
          setOutput(prev => [...prev, 
            { type: 'prompt', content: `<span style="color: #00ff88">$</span> ${input}` },
            { type: 'output', content: matches.join('  ') + '\n' }
          ]);
        }
      } else {
        const partial = parts[parts.length - 1];
        const dir = getDirectory(currentPath);
        if (dir) {
          const matches = Object.keys(dir).filter(name => name.startsWith(partial));
          if (matches.length === 1) {
            const match = matches[0];
            const entry = dir[match];
            parts[parts.length - 1] = match + (entry.type === 'dir' ? '/' : '');
            setInput(parts.join(' '));
          } else if (matches.length > 1) {
            let common = partial;
            for (let i = partial.length; ; i++) {
              const chars = matches.map(m => m[i]).filter(Boolean);
              if (chars.length === matches.length && new Set(chars).size === 1) {
                common += chars[0];
              } else break;
            }
            parts[parts.length - 1] = common;
            setInput(parts.join(' '));
            setOutput(prev => [...prev,
              { type: 'prompt', content: `<span style="color: #00ff88">$</span> ${input}` },
              { type: 'output', content: matches.map(m => dir[m].type === 'dir' ? `<span style="color:#00ff88">${m}/</span>` : m).join('  ') + '\n' }
            ]);
          }
        }
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim() && !isTyping) {
        executeCommand(input);
        setInput('');
        setHistoryIndex(-1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setOutput([]);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Get visitor count with "threat level" logic
  const threatLevel = visits < 3 ? 'LOW' : visits < 10 ? 'MEDIUM' : 'ELEVATED';

  return (
    <div 
      className="w-full h-full flex flex-col font-mono relative"
      onClick={handleTerminalClick}
    >
      {showMatrix && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="matrix-rain" />
        </div>
      )}

      <div ref={outputRef} className="flex-1 overflow-auto p-4 md:p-8 pb-8">
        {output.map((line, i) => (
          <div 
            key={i} 
            className={`whitespace-pre-wrap ${
              line.type === 'prompt' 
                ? 'text-[#00ff88]/80' 
                : line.type === 'error' 
                ? 'text-[#ff4444]' 
                : line.type === 'ambient'
                ? 'text-[#555] text-xs'
                : 'text-[#e0e0e0]'
            }`}
            dangerouslySetInnerHTML={{ __html: line.content }}
          />
        ))}
        
        {!isTyping && (
          <div className="flex items-center">
            <span className="text-[#00ff88]">$ </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-[#e0e0e0] caret-[#00ff88]"
              autoComplete="off"
              spellCheck={false}
            />
            <span className="animate-pulse text-[#00ff88]">_</span>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#0a0a0a] text-[#333] text-[0.65rem] font-mono flex items-center px-4 gap-3 border-t border-[#222]">
        <span>11 agents online</span>
        <span className="text-[#222]">│</span>
        <span>uptime 847d</span>
        <span className="text-[#222]">│</span>
        <span>load {systemLoad.toFixed(2)}</span>
        <span className="text-[#222]">│</span>
        <span>visitor #{visits}</span>
        <span className="text-[#222]">│</span>
        <span className="text-[#444]">threat: {threatLevel}</span>
      </div>

      <style jsx>{`
        .matrix-rain {
          width: 100%;
          height: 100%;
          background: black;
          position: relative;
          overflow: hidden;
        }
        
        .matrix-rain::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(transparent 0%, #00ff88 50%, transparent 100%);
          background-size: 100% 20px;
          animation: matrix-fall 0.5s linear infinite;
          opacity: 0.3;
        }
        
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
}
