import { useState, useEffect, useCallback } from 'react';
import registryService from '../services/registryService';
import { ethers } from 'ethers';
import './MemoryExplorer.css';

const CopyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="9" height="9" rx="1.5" />
    <path d="M3 11V3a1.5 1.5 0 011.5-1.5H11" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8.5l3.5 3.5 7-7" />
  </svg>
);

function MemoryExplorer({ wallet, networkHook }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const AGENTS_PER_PAGE = 15;

  const handleCopy = useCallback((text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchAgents = async (isInitial = false) => {
      // Only show loading spinner on the very first fetch
      if (isInitial) setLoading(true);
      try {
        // Always use JsonRpcProvider for read-only explorer queries
        const provider = new ethers.JsonRpcProvider(networkHook.network.rpcUrl);
        const data = await registryService.getAllAgents(provider);
        if (isMounted) setAgents(data);
      } catch (err) {
        console.error("Failed to fetch agents", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAgents(true);
    
    // Refresh every 30 seconds — silently in the background
    const interval = setInterval(() => fetchAgents(false), 30000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [wallet?.provider, networkHook.network.rpcUrl]);

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatHash = (hash) => {
    if (!hash || hash === '0x0000000000000000000000000000000000000000000000000000000000000000') return 'Uninitialized';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const timeAgo = (timestamp) => {
    if (!timestamp) return 'Never';
    const seconds = Math.floor(Date.now() / 1000) - timestamp;
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const totalPages = Math.max(1, Math.ceil(agents.length / AGENTS_PER_PAGE));
  const paginatedAgents = agents.slice(
    (currentPage - 1) * AGENTS_PER_PAGE,
    currentPage * AGENTS_PER_PAGE
  );

  return (
    <div className="memory-explorer">
      <div className="explorer-header">
        <h2 className="heading-font">GLOBAL MEMORY REGISTRY</h2>
        <div className="explorer-stats">
          <div className="stat-box">
            <span className="stat-label">TOTAL AGENTS</span>
            <span className="stat-value text-gradient-cyan">{loading ? '...' : agents.length}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">NETWORK</span>
            <span className="stat-value">{networkHook.network.label.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="explorer-table-wrapper">
        {loading ? (
          <div className="explorer-loading terminal-font">SCANNING 0G CHAIN FOR MEMORY ROOTS...</div>
        ) : (
          <table className="explorer-table">
            <thead>
              <tr>
                <th>NFT #</th>
                <th>AGENT ID</th>
                <th>OWNER</th>
                <th>FRAMEWORK</th>
                <th>VECTORS</th>
                <th>FEE PAID</th>
                <th>LATEST MERKLE ROOT</th>
                <th>LAST UPDATED</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAgents.map((agent, index) => (
                <tr key={agent.id || index}>
                  <td className="mono nft-col">#{agent.tokenId || '?'}</td>
                  <td className="agent-id-col text-gradient-cyan">
                    <span className="copiable-cell">
                      {agent.id}
                      <button
                        className={`copy-btn ${copiedId === `agent-${agent.id}` ? 'copied' : ''}`}
                        onClick={() => handleCopy(agent.id, `agent-${agent.id}`)}
                        title="Copy Agent ID"
                      >
                        {copiedId === `agent-${agent.id}` ? <CheckIcon /> : <CopyIcon />}
                      </button>
                    </span>
                  </td>
                  <td className="mono">{formatAddress(agent.owner)}</td>
                  <td><span className={`framework-badge ${agent.framework?.toLowerCase() || 'custom'}`}>{agent.framework || 'Custom'}</span></td>
                  <td className="mono vector-col">{agent.vectorCount}</td>
                  <td className="mono fee-col">{agent.totalFeePaid || '0'} 0G</td>
                  <td className="mono hash-col">
                    <span className="copiable-cell">
                      {formatHash(agent.currentRoot)}
                      {agent.currentRoot && agent.currentRoot !== '0x0000000000000000000000000000000000000000000000000000000000000000' && (
                        <button
                          className={`copy-btn ${copiedId === `root-${agent.id}` ? 'copied' : ''}`}
                          onClick={() => handleCopy(agent.currentRoot, `root-${agent.id}`)}
                          title="Copy full Merkle root"
                        >
                          {copiedId === `root-${agent.id}` ? <CheckIcon /> : <CopyIcon />}
                        </button>
                      )}
                    </span>
                  </td>
                  <td className="mono time-col">{timeAgo(agent.lastUpdated)}</td>
                </tr>
              ))}
              {agents.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty-state">No agents registered on this network yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && agents.length > AGENTS_PER_PAGE && (
        <div className="explorer-pagination">
          <button
            className="pagination-btn terminal-font"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← PREV
          </button>
          <span className="pagination-info terminal-font">
            PAGE {currentPage} / {totalPages}
            <span className="pagination-total">({agents.length} agents)</span>
          </span>
          <button
            className="pagination-btn terminal-font"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            NEXT →
          </button>
        </div>
      )}
    </div>
  );
}

export default MemoryExplorer;
