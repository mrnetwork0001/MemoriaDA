import { useState, useEffect } from 'react';
import registryService from '../services/registryService';
import { ethers } from 'ethers';
import './MemoryExplorer.css';

function MemoryExplorer({ wallet, networkHook }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

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
              {agents.map((agent, index) => (
                <tr key={agent.id || index}>
                  <td className="mono nft-col">#{agent.tokenId || '?'}</td>
                  <td className="agent-id-col text-gradient-cyan">{agent.id}</td>
                  <td className="mono">{formatAddress(agent.owner)}</td>
                  <td><span className={`framework-badge ${agent.framework?.toLowerCase() || 'custom'}`}>{agent.framework || 'Custom'}</span></td>
                  <td className="mono vector-col">{agent.vectorCount}</td>
                  <td className="mono fee-col">{agent.totalFeePaid || '0'} 0G</td>
                  <td className="mono hash-col">{formatHash(agent.currentRoot)}</td>
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
    </div>
  );
}

export default MemoryExplorer;
