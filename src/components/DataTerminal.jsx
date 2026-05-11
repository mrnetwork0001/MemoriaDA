import { useState, useEffect, useRef } from 'react';
import { getActiveNetwork } from '../config/network';
import memoryStore from '../services/memoryStore';
import { IconNeural, IconChain, IconBox, IconHourglass, IconOK, IconErr, IconSnapshot } from './TerminalIcons';
import './DataTerminal.css';

const buildInitialLogs = () => {
  const net = getActiveNetwork();
  return [
    { id: 1, type: 'INIT', message: 'Memoria DA Protocol v0.1.0-α loaded', timestamp: '02:14:00.001', status: 'success' },
    { id: 2, type: 'CONNECT', message: '0G Storage indexer ready  ❯  endpoint: turbo.0g.ai', timestamp: '02:14:00.342', status: 'success' },
    { id: 3, type: 'CONNECT', message: `0G Chain RPC linked  ❯  ${net.chainName}  ❯  chain_id: ${net.chainId}`, timestamp: '02:14:00.891', status: 'success' },
    { id: 4, type: 'READY', message: '✦ Neural Link Operational. Awaiting Commands.', timestamp: '02:14:03.001', status: 'success' },
  ];
};

const DataTerminal = ({ memoryEvents, storageLogs, wallet, storage }) => {
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState(() => buildInitialLogs());
  const [memoryIndex, setMemoryIndex] = useState(() => memoryStore.getAll());
  const [snapshotStatus, setSnapshotStatus] = useState(null); // null | 'saving' | 'saved' | 'error'
  const terminalRef = useRef(null);
  const logIdCounter = useRef(buildInitialLogs().length + 1);

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

  // Handle memory events — enhanced with new event types
  useEffect(() => {
    if (memoryEvents && memoryEvents.length > 0) {
      const last = memoryEvents[memoryEvents.length - 1];
      const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      let logEntry = null;

      switch (last.type) {
        case 'QUERY':
          logEntry = {
            type: 'QUERY',
            message: `User query  ❯  "${last.query}"`,
            status: 'info',
          };
          break;

        case 'MEMORY_SEARCH':
          logEntry = {
            type: 'RECALL',
            message: `Memory search  ❯  ${last.results} relevant memories  ❯  top_sim: ${last.topSimilarity}`,
            status: 'success',
          };
          break;

        case 'COMPUTE_INFERENCE':
          logEntry = {
            type: 'COMPUTE',
            message: `0G Compute inference  ❯  model: ${last.model}  ❯  chat_id: ${last.chatId?.slice(0, 16)}...  ❯  verified: ${last.verified}`,
            status: 'success',
          };
          break;

        case 'STORE_COMPLETE':
          logEntry = {
            type: 'STORE',
            message: `Memory stored  ❯  root: ${last.rootHash?.slice(0, 14)}...  ❯  ${last.blobSize}B  ❯  ${last.elapsed}s`,
            status: 'success',
          };
          break;

        case 'CHAIN_COMMIT':
          logEntry = {
            type: 'CHAIN',
            message: `Root anchored onchain  ❯  block: #${last.blockNumber}  ❯  root: ${last.rootHash?.slice(0, 14)}...`,
            status: 'success',
          };
          break;

        case 'ERROR':
          logEntry = {
            type: 'ERROR',
            message: `Pipeline error  ❯  ${last.error}`,
            status: 'error',
          };
          break;

        default:
          logEntry = {
            type: last.type || 'EVENT',
            message: `${last.type}: ${last.rootHash?.slice(0, 12) || 'unknown'}`,
            status: 'info',
          };
      }

      if (logEntry) {
        setLogs(prev => [...prev.slice(-100), {
          id: logIdCounter.current++,
          timestamp: now,
          ...logEntry,
        }]);
      }

      // Refresh memory index whenever events come in
      setMemoryIndex(memoryStore.getAll());
    }
  }, [memoryEvents]);

  const isLive = wallet?.isConnected && wallet?.isCorrectChain;
  const totalMemories = memoryStore.count;

  const handleSaveState = async () => {
    setSnapshotStatus('saving');
    try {
      const allMemories = memoryStore.getAll();
      const topics = allMemories
        .slice(0, 5)
        .map(m => m.content?.slice(0, 50))
        .filter(Boolean);

      const statePayload = {
        agentId: 'agent_0xClaw_7f3a',
        state: {
          totalMemories: allMemories.length,
          totalLogs: logs.length,
          sessionStarted: logs[0]?.timestamp || 'unknown',
          walletConnected: wallet?.isConnected || false,
          recentTopics: topics,
          onChainMemories: allMemories.filter(m => m.metadata?.onChain).length,
          capturedAt: new Date().toISOString(),
        },
      };

      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
      const res = await fetch(`${BACKEND_URL}/api/state/snapshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statePayload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLogs(prev => [...prev.slice(-100), {
        id: logIdCounter.current++,
        timestamp: now,
        type: 'STATE',
        message: `Agent state snapshot saved  ❯  root: ${data.rootHash?.slice(0, 14)}...  ❯  ${data.blockLabel}`,
        status: 'success',
      }]);

      setSnapshotStatus('saved');
      setTimeout(() => setSnapshotStatus(null), 3000);
    } catch (err) {
      console.error('[State] Snapshot error:', err);
      setSnapshotStatus('error');
      setTimeout(() => setSnapshotStatus(null), 3000);
    }
  };

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
          onClick={() => { setActiveTab('memory'); setMemoryIndex(memoryStore.getAll()); }}
        >
          MEMORY_INDEX
          {totalMemories > 0 && (
            <span className="tab-badge">{totalMemories}</span>
          )}
        </button>
        <button 
          className={`terminal-tab terminal-font ${activeTab === 'registry' ? 'active' : ''}`}
          onClick={() => setActiveTab('registry')}
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
                <span className={`log-type log-type-${log.type?.toLowerCase()}`}>{log.type}</span>
                <span className="log-msg">❯ {log.message}</span>
              </div>
            ))}
            <div className="terminal-cursor-line terminal-font">
              <span className="prefix">❯</span>
              <span className="blink">_</span>
            </div>
          </div>
        ) : activeTab === 'memory' ? (
          <div className="memory-index-list">
            {memoryIndex.length === 0 ? (
              <div className="empty-state terminal-font">
                <div className="empty-icon"><IconNeural size={28} className="icon-accent" /></div>
                <div>NO_MEMORIES_STORED</div>
                <div className="empty-hint">Chat with the agent to create memories</div>
              </div>
            ) : (
              memoryIndex.map((mem, idx) => {
                const isOnChain = mem.metadata?.onChain;
                const preview = mem.content?.slice(0, 100)?.replace(/\n/g, ' ') || '';
                const time = new Date(mem.timestamp).toLocaleTimeString('en-US', {
                  hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
                });
                const rootShort = mem.rootHash?.startsWith('local_')
                  ? `LOCAL_${mem.rootHash.slice(6, 14)}`
                  : `${mem.rootHash?.slice(0, 10)}...${mem.rootHash?.slice(-6)}`;

                return (
                  <div key={mem.id} className={`memory-entry ${isOnChain ? 'memory-onchain' : ''}`}>
                    <div className="memory-entry-header">
                      <span className="memory-entry-idx terminal-font">MEM_{String(memoryIndex.length - idx).padStart(3, '0')}</span>
                      <span className="memory-entry-time terminal-font">{time}</span>
                      {isOnChain && (
                        <span className="memory-chain-badge terminal-font">
                          <IconChain size={10} style={{marginRight:3}}/> BLK #{mem.metadata.blockNumber}
                        </span>
                      )}
                    </div>
                    <div className="memory-entry-root terminal-font">{rootShort}</div>
                    <div className="memory-entry-preview">{preview}...</div>
                    <div className="memory-entry-meta terminal-font">
                      <span>DIM: {mem.embedding?.length || '?'}</span>
                      <span>AGENT: {mem.agentId}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="memory-grid">
            {memoryEvents.length === 0 && (
              <div className="empty-state terminal-font">NO_REGISTRY_EVENTS</div>
            )}
            {memoryEvents
              .filter(m => m.type === 'STORE_COMPLETE' || m.type === 'CHAIN_COMMIT')
              .map((mem, idx) => (
              <div key={`${mem.rootHash}-${idx}`} className="memory-card cyber-chamfer-sm">
                <div className="mem-header terminal-font">
                  <span className="mem-id">{mem.type === 'CHAIN_COMMIT'
                    ? <><IconChain size={11} style={{marginRight:3}}/>ON_CHAIN</>
                    : <><IconBox size={11} style={{marginRight:3}}/>STORED</>}
                  </span>
                  <span className="mem-time">{new Date(mem.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="mem-hash terminal-font">
                  {mem.rootHash ? `${mem.rootHash.slice(0, 24)}...` : 'pending'}
                </div>
                <div className="mem-details terminal-font">
                   <span>AGENT: {mem.agentId}</span>
                   {mem.blobSize && <span>SIZE: {mem.blobSize}B</span>}
                   {mem.blockNumber && <span>BLOCK: #{mem.blockNumber}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="terminal-footer">
        <span className="terminal-font">ID: {wallet?.address ? wallet.formatAddress(wallet.address) : 'ANONYMOUS'}</span>
        <span className="terminal-font">{totalMemories} MEM | {logs.length} EV</span>
        <button
          className="save-state-btn terminal-font"
          onClick={handleSaveState}
          disabled={snapshotStatus === 'saving'}
        >
          {snapshotStatus === 'saving'
            ? <><IconHourglass size={11} style={{marginRight:3}}/>SAVING...</>
            : snapshotStatus === 'saved'
            ? <><IconOK size={11} style={{marginRight:3}}/>SAVED</>
            : snapshotStatus === 'error'
            ? <><IconErr size={11} style={{marginRight:3}}/>FAILED</>
            : <><IconSnapshot size={11} style={{marginRight:3}}/>SAVE STATE</>}
        </button>
      </div>
    </div>
  );
};

export default DataTerminal;
