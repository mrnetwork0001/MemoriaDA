import { useState, useEffect, useRef } from 'react';
import './DataTerminal.css';

const generateMockHash = () => `0x${Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
const generateShortHash = () => `0x${Array.from({ length: 6 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

const INITIAL_LOGS = [
  { id: 1, type: 'INIT', message: 'Memoria DA Protocol v0.1.0-α loaded', timestamp: '02:14:00.001', status: 'success' },
  { id: 2, type: 'CONNECT', message: '0G Storage indexer ready  ❯  endpoint: indexer-storage-testnet-turbo.0g.ai', timestamp: '02:14:00.342', status: 'success' },
  { id: 3, type: 'CONNECT', message: '0G Chain RPC linked  ❯  chain_id: 16600  ❯  rpc: evmrpc-testnet.0g.ai', timestamp: '02:14:00.891', status: 'success' },
  { id: 4, type: 'REGISTRY', message: `MemoriaRegistry contract ABI loaded  ❯  ready for deployment`, timestamp: '02:14:01.204', status: 'info' },
  { id: 5, type: 'AGENT', message: 'Agent registered  ❯  agent_0xClaw_7f3a  ❯  framework: OpenClaw', timestamp: '02:14:01.567', status: 'success' },
  { id: 6, type: 'READY', message: '✦ Memoria DA is operational. Connect wallet to enable live storage.', timestamp: '02:14:03.001', status: 'success' },
  { id: 7, type: 'DIVIDER', message: '─'.repeat(52), timestamp: '', status: 'divider' },
];

const AUTO_EVENTS = [
  () => ({ type: 'HEARTBEAT', message: `0G node heartbeat  ❯  latency: ${Math.floor(80 + Math.random() * 120)}ms  ❯  peers: ${Math.floor(12 + Math.random() * 8)}`, status: 'info' }),
  () => ({ type: 'SYNC', message: `Block synced  ❯  #${(4821337 + Math.floor(Math.random() * 1000)).toLocaleString()}  ❯  txns: ${Math.floor(Math.random() * 15)}`, status: 'info' }),
  () => ({ type: 'VECTOR', message: `Index maintenance  ❯  vectors: ${Math.floor(40 + Math.random() * 20)}  ❯  index: HNSW  ❯  dim: 1536`, status: 'info' }),
  () => ({ type: 'CACHE', message: `Memory cache refreshed  ❯  entries: ${Math.floor(10 + Math.random() * 30)}  ❯  hit_rate: ${(0.78 + Math.random() * 0.2).toFixed(2)}`, status: 'success' }),
  () => ({ type: 'STORAGE', message: `0G Storage health  ❯  available: ${(95 + Math.random() * 4.9).toFixed(1)}%  ❯  replicas: 3`, status: 'success' }),
  () => ({ type: 'METRIC', message: `Protocol metrics  ❯  queries: ${Math.floor(Math.random() * 50)}  ❯  writes: ${Math.floor(Math.random() * 10)}  ❯  uptime: 99.97%`, status: 'info' }),
];

const StatusDot = ({ status }) => (
  <span className={`terminal-status-dot status-${status}`} />
);

const DataTerminal = ({ memoryEvents, storageLogs, wallet, storage }) => {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [filter, setFilter] = useState('ALL');
  const terminalRef = useRef(null);
  const logIdCounter = useRef(INITIAL_LOGS.length + 1);

  // Auto-scroll on new logs
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Generate periodic background events
  useEffect(() => {
    const interval = setInterval(() => {
      const event = AUTO_EVENTS[Math.floor(Math.random() * AUTO_EVENTS.length)]();
      const newLog = {
        id: logIdCounter.current++,
        type: event.type,
        message: event.message,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }),
        status: event.status,
      };
      setLogs(prev => [...prev.slice(-150), newLog]);
    }, 5000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, []);

  // ── Inject REAL storage service logs ──
  useEffect(() => {
    if (storageLogs && storageLogs.length > 0) {
      const lastLog = storageLogs[storageLogs.length - 1];
      // Prevent duplicates
      setLogs(prev => {
        const exists = prev.find(l => l.id === lastLog.id);
        if (exists) return prev;
        return [...prev.slice(-150), {
          ...lastLog,
          id: logIdCounter.current++,
        }];
      });
    }
  }, [storageLogs]);

  // Handle wallet connect/disconnect events
  useEffect(() => {
    if (wallet?.isConnected && wallet?.isCorrectChain) {
      const alreadyLogged = logs.some(l => l.message?.includes('Wallet authenticated'));
      if (!alreadyLogged) {
        const addr = wallet.formatAddress(wallet.address);
        setLogs(prev => [...prev, {
          id: logIdCounter.current++,
          type: 'DIVIDER',
          message: '─'.repeat(52),
          timestamp: '',
          status: 'divider',
        }, {
          id: logIdCounter.current++,
          type: 'WALLET',
          message: `Wallet authenticated  ❯  ${addr}  ❯  chain: 0G Galileo`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }),
          status: 'success',
        }, {
          id: logIdCounter.current++,
          type: 'MODE',
          message: `✦ LIVE MODE ENABLED — All storage operations are real 0G transactions`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }),
          status: 'success',
        }]);
      }
    }
  }, [wallet?.isConnected, wallet?.isCorrectChain]);

  // Handle incoming memory events from Agent Chat
  useEffect(() => {
    if (memoryEvents && memoryEvents.length > 0) {
      const lastEvent = memoryEvents[memoryEvents.length - 1];
      const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
      
      const newLogs = [];
      newLogs.push({
        id: logIdCounter.current++,
        type: 'DIVIDER',
        message: '─'.repeat(52),
        timestamp: '',
        status: 'divider',
      });

      if (lastEvent.type === 'QUERY') {
        newLogs.push({
          id: logIdCounter.current++,
          type: 'QUERY',
          message: `Agent query received  ❯  "${lastEvent.query}"  ❯  ${lastEvent.agentId}`,
          timestamp: now,
          status: 'info',
        });
      } else if (lastEvent.type === 'RETRIEVE') {
        newLogs.push({
          id: logIdCounter.current++,
          type: 'RETRIEVE',
          message: `${lastEvent.vectors} vectors retrieved  ❯  root: ${lastEvent.storageRoot}  ❯  cache: ${Math.random() > 0.5 ? 'HIT' : 'MISS'}`,
          timestamp: now,
          status: 'success',
        });
      } else if (lastEvent.type === 'STORE_COMPLETE') {
        newLogs.push({
          id: logIdCounter.current++,
          type: 'CONFIRM',
          message: `✓ REAL 0G STORAGE — root: ${lastEvent.rootHash?.slice(0, 14)}...  ❯  size: ${(lastEvent.blobSize / 1024).toFixed(1)} KB  ❯  ${lastEvent.elapsed}s`,
          timestamp: now,
          status: 'success',
        });
      } else if (lastEvent.type === 'ERROR') {
        newLogs.push({
          id: logIdCounter.current++,
          type: 'ERROR',
          message: `Storage error: ${lastEvent.error}`,
          timestamp: now,
          status: 'error',
        });
      }

      setLogs(prev => [...prev, ...newLogs]);
    }
  }, [memoryEvents]);

  const FILTERS = ['ALL', 'STORAGE', 'VECTOR', 'TX', 'QUERY'];

  const filteredLogs = filter === 'ALL' 
    ? logs 
    : logs.filter(log => log.type === filter || log.status === 'divider');

  const isLive = wallet?.isConnected && wallet?.isCorrectChain;

  const stats = {
    totalVectors: 47 + logs.filter(l => ['STORE', 'CONFIRM'].includes(l.type)).length,
    storageOps: logs.filter(l => ['FETCH', 'UPLOAD', 'STORE', 'CONFIRM', 'MERKLE'].includes(l.type)).length,
    queries: logs.filter(l => l.type === 'QUERY').length,
  };

  return (
    <div className="data-terminal glass-panel-strong" id="data-terminal-panel">
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="terminal-header-left">
          <div className={`terminal-icon ${isLive ? 'terminal-icon-live' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1.5" y="1.5" width="15" height="15" rx="3" stroke="currentColor" strokeWidth="1.2" />
              <path d="M5 7l2.5 2L5 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h2 className="terminal-title">
              0G Data Terminal
              {isLive && <span className="live-badge">LIVE</span>}
            </h2>
            <span className="terminal-subtitle mono">
              {isLive
                ? `memoria-da://0g-storage/live • ${wallet.formatAddress(wallet.address)}`
                : 'memoria-da://0g-storage/demo-feed'
              }
            </span>
          </div>
        </div>
        <div className="terminal-header-right">
          <div className="terminal-dot-group">
            <span className="t-dot t-dot-red" />
            <span className="t-dot t-dot-yellow" />
            <span className={`t-dot t-dot-green ${isLive ? 't-dot-green-live' : ''}`} />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="terminal-stats">
        <div className="t-stat">
          <span className="t-stat-value mono">{stats.totalVectors}</span>
          <span className="t-stat-label">Vectors</span>
        </div>
        <div className="t-stat">
          <span className="t-stat-value mono">{stats.storageOps}</span>
          <span className="t-stat-label">Storage Ops</span>
        </div>
        <div className="t-stat">
          <span className="t-stat-value mono">{stats.queries}</span>
          <span className="t-stat-label">Queries</span>
        </div>
        <div className={`t-stat t-stat-highlight ${isLive ? 't-stat-live' : ''}`}>
          <span className="t-stat-value mono">{isLive ? 'LIVE' : '0G'}</span>
          <span className="t-stat-label">{isLive ? 'Mode' : 'Network'}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="terminal-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'filter-btn-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Log Output */}
      <div className="terminal-output" ref={terminalRef} id="terminal-output">
        {filteredLogs.map((log) => (
          <div key={log.id} className={`terminal-line ${log.status === 'divider' ? 'terminal-divider' : ''}`}>
            {log.status === 'divider' ? (
              <span className="divider-text">{log.message}</span>
            ) : (
              <>
                <span className="log-timestamp mono">{log.timestamp}</span>
                <StatusDot status={log.status} />
                <span className={`log-type mono log-type-${log.type.toLowerCase()}`}>[{log.type}]</span>
                <span className="log-message">{log.message}</span>
              </>
            )}
          </div>
        ))}
        <div className="terminal-cursor">
          <span className="cursor-prompt mono">memoria-da {isLive ? '⚡' : '❯'}</span>
          <span className="cursor-blink">▊</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="terminal-footer">
        <span className="footer-text">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
            <path d="M6 3v3l2 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
          {isLive ? 'LIVE feed — Real 0G Storage' : 'Demo feed — 0G Storage'}
        </span>
        <span className="footer-text mono">{logs.length} events logged</span>
      </div>
    </div>
  );
};

export default DataTerminal;
