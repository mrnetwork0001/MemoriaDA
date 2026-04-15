import { useState, useEffect, useRef } from 'react';
import './DataTerminal.css';

const INITIAL_LOGS = [
  { id: 1, type: 'INIT', message: 'Memoria DA Protocol v0.1.0-α loaded', timestamp: '02:14:00.001', status: 'success' },
  { id: 2, type: 'CONNECT', message: '0G Storage indexer ready  ❯  endpoint: turbo.0g.ai', timestamp: '02:14:00.342', status: 'success' },
  { id: 3, type: 'CONNECT', message: '0G Chain RPC linked  ❯  chain_id: 16600', timestamp: '02:14:00.891', status: 'success' },
  { id: 4, type: 'READY', message: '✦ Neural Link Operational. Awaiting Commands.', timestamp: '02:14:03.001', status: 'success' },
];

const DataTerminal = ({ memoryEvents, storageLogs, wallet, storage }) => {
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const terminalRef = useRef(null);
  const logIdCounter = useRef(INITIAL_LOGS.length + 1);

  // Auto-scroll on new logs
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Sync real storage logs
  useEffect(() => {
    if (storageLogs && storageLogs.length > 0) {
      const lastLog = storageLogs[storageLogs.length - 1];
      setLogs(prev => {
        if (prev.find(l => l.id === lastLog.id)) return prev;
        return [...prev.slice(-100), { ...lastLog, id: logIdCounter.current++ }];
      });
    }
  }, [storageLogs]);

  // Handle memory events
  useEffect(() => {
    if (memoryEvents && memoryEvents.length > 0) {
      const last = memoryEvents[memoryEvents.length - 1];
      const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      setLogs(prev => [...prev.slice(-100), {
        id: logIdCounter.current++,
        type: 'REGISTRY',
        message: `MEMORY_COMMIT: ${last.rootHash?.slice(0, 12)}... [${last.blobSize}B]`,
        timestamp: now,
        status: 'success'
      }]);
    }
  }, [memoryEvents]);

  const isLive = wallet?.isConnected && wallet?.isCorrectChain;

  return (
    <div className="data-terminal cyber-chamfer" id="data-terminal-root">
      <div className="terminal-header">
        <div className="terminal-header-left">
          <div className="terminal-dots">
            <div className="dot dot-red"></div>
            <div className="dot dot-yellow"></div>
            <div className="dot dot-green"></div>
          </div>
          <div className="terminal-title heading-font">SYST_LOG_0G_DA</div>
        </div>
        <div className="terminal-status">
          <span className={isLive ? 'text-accent-primary blink' : 'text-muted'}>
            {isLive ? 'ONLINE_SECURE' : 'DEMO_READONLY'}
          </span>
        </div>
      </div>
      
      <div className="terminal-tabs">
        <button 
          className={`terminal-tab terminal-font ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          LOG_STREAM
        </button>
        <button 
          className={`terminal-tab terminal-font ${activeTab === 'memory' ? 'active' : ''}`}
          onClick={() => setActiveTab('memory')}
        >
          REGISTRY_SYNC
        </button>
      </div>

      <div className="terminal-content">
        {activeTab === 'logs' ? (
          <div className="log-entries" ref={terminalRef}>
            {logs.map((log) => (
              <div key={log.id} className={`log-entry status-${log.status} terminal-font`}>
                <span className="log-time">[{log.timestamp}]</span>
                <span className="log-type">{log.type}</span>
                <span className="log-msg">❯ {log.message}</span>
              </div>
            ))}
            <div className="terminal-cursor-line terminal-font">
              <span className="prefix">❯</span>
              <span className="blink">_</span>
            </div>
          </div>
        ) : (
          <div className="memory-grid">
            {memoryEvents.length === 0 && (
              <div className="empty-state terminal-font">NO_RECORDS_FOUND</div>
            )}
            {memoryEvents.map((mem) => (
              <div key={mem.rootHash} className="memory-card cyber-chamfer-sm">
                <div className="mem-header terminal-font">
                  <span className="mem-id">ROOT_HASH</span>
                  <span className="mem-time">{new Date(mem.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="mem-hash terminal-font">{mem.rootHash.slice(0, 24)}...</div>
                <div className="mem-details terminal-font">
                   <span>AGENT: {mem.agentId}</span>
                   <span>SIZE: {mem.blobSize}B</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="terminal-footer">
        <span className="terminal-font">ID: {wallet?.address ? wallet.formatAddress(wallet.address) : 'ANONYMOUS'}</span>
        <span className="terminal-font">{logs.length} EV_LOGGED</span>
      </div>
    </div>
  );
};

export default DataTerminal;
