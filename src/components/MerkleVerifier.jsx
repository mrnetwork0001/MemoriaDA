import { useState } from 'react';
import registryService from '../services/registryService';
import memoryStore from '../services/memoryStore';
import { ethers } from 'ethers';
import './MerkleVerifier.css';

function MerkleVerifier({ wallet, networkHook }) {
  const [agentId, setAgentId] = useState('');
  const [rootHash, setRootHash] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null); // { isValid, storedRoot, lastUpdated, agentData }
  const [error, setError] = useState(null);

  const autoFillLatest = () => {
    const all = memoryStore.getAll();
    const onChain = all.filter(m => m.rootHash && !m.rootHash.startsWith('local_'));
    if (onChain.length > 0) {
      setAgentId(onChain[0].agentId || 'agent_0xClaw_7f3a');
      setRootHash(onChain[0].rootHash);
    }
  };

  const handleVerify = async () => {
    if (!agentId.trim() || !rootHash.trim()) return;

    setVerifying(true);
    setResult(null);
    setError(null);

    try {
      // Use JsonRpcProvider for read-only verification queries
      const provider = new ethers.JsonRpcProvider(networkHook.network.rpcUrl);

      // Verify memory root on-chain
      const verification = await registryService.verifyMemoryRoot(
        agentId.trim(),
        rootHash.trim(),
        provider
      );

      // Get full agent data
      const agentData = await registryService.getAgentFull(agentId.trim(), provider);

      setResult({
        ...verification,
        agentData,
      });
    } catch (err) {
      setError(err.message.includes('Agent not found')
        ? 'Agent ID not found on-chain. Ensure the agent is registered.'
        : err.message
      );
    } finally {
      setVerifying(false);
    }
  };

  const formatHash = (hash) => {
    if (!hash) return 'N/A';
    const hex = typeof hash === 'string' ? hash : ethers.hexlify(hash);
    if (hex === '0x0000000000000000000000000000000000000000000000000000000000000000') return 'UNINITIALIZED';
    return `${hex.slice(0, 14)}...${hex.slice(-10)}`;
  };

  const formatTime = (ts) => {
    if (!ts) return 'Never';
    return new Date(ts * 1000).toLocaleString();
  };

  return (
    <div className="merkle-verifier">
      <div className="verifier-header">
        <h2 className="heading-font">CRYPTOGRAPHIC VERIFIER</h2>
        <p className="verifier-subtitle terminal-font">
          Verify that an agent's memory root has not been tampered with by checking
          the on-chain Merkle root stored in the MemoriaRegistry smart contract.
        </p>
      </div>

      <div className="verifier-form">
        <button
          className="autofill-btn terminal-font"
          onClick={autoFillLatest}
          type="button"
        >
          ⚡ AUTO-FILL LATEST MEMORY ROOT
        </button>

        <div className="form-group">
          <label className="form-label terminal-font">AGENT_ID</label>
          <input
            type="text"
            className="form-input terminal-font"
            placeholder="e.g. agent_0xClaw_7f3a"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label terminal-font">MERKLE_ROOT_HASH</label>
          <input
            type="text"
            className="form-input terminal-font"
            placeholder="0x..."
            value={rootHash}
            onChange={(e) => setRootHash(e.target.value)}
          />
        </div>

        <button
          className="verify-btn heading-font"
          onClick={handleVerify}
          disabled={verifying || !agentId.trim() || !rootHash.trim()}
        >
          {verifying ? (
            <>
              <span className="connect-spinner-small" />
              VERIFYING ON-CHAIN...
            </>
          ) : (
            '⛓ VERIFY ON-CHAIN'
          )}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="verify-result verify-error">
          <div className="result-icon">✗</div>
          <div className="result-title">VERIFICATION FAILED</div>
          <div className="result-detail">{error}</div>
        </div>
      )}

      {/* Success State */}
      {result && (
        <div className={`verify-result ${result.isValid ? 'verify-valid' : 'verify-invalid'}`}>
          <div className="result-icon">{result.isValid ? '✓' : '✗'}</div>
          <div className="result-title">
            {result.isValid ? 'MEMORY ROOT VERIFIED' : 'ROOT MISMATCH DETECTED'}
          </div>
          <div className="result-subtitle terminal-font">
            {result.isValid
              ? 'The provided Merkle root matches the on-chain record. This memory has not been tampered with.'
              : 'The provided root does NOT match the on-chain record. The memory may have been altered or the root is outdated.'}
          </div>

          <div className="verification-chain">
            <div className="chain-step">
              <div className="step-label terminal-font">AGENT ID</div>
              <div className="step-value mono">{agentId}</div>
            </div>
            <div className="chain-arrow">→</div>
            <div className="chain-step">
              <div className="step-label terminal-font">ON-CHAIN ROOT</div>
              <div className="step-value mono">{formatHash(result.storedRoot)}</div>
            </div>
            <div className="chain-arrow">→</div>
            <div className="chain-step">
              <div className={`step-label terminal-font ${result.isValid ? 'text-valid' : 'text-invalid'}`}>
                {result.isValid ? 'MATCH ✓' : 'MISMATCH ✗'}
              </div>
              <div className="step-value mono">{formatHash(rootHash)}</div>
            </div>
          </div>

          {result.agentData && (
            <div className="agent-details-grid">
              <div className="detail-item">
                <span className="detail-label terminal-font">NFT TOKEN</span>
                <span className="detail-value mono">#{result.agentData.tokenId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label terminal-font">FRAMEWORK</span>
                <span className="detail-value">{result.agentData.framework}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label terminal-font">OWNER</span>
                <span className="detail-value mono">{result.agentData.owner?.slice(0, 10)}...{result.agentData.owner?.slice(-6)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label terminal-font">VECTORS</span>
                <span className="detail-value mono">{result.agentData.vectorCount}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label terminal-font">LAST UPDATED</span>
                <span className="detail-value mono">{formatTime(result.agentData.lastUpdated)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label terminal-font">TOTAL FEES PAID</span>
                <span className="detail-value mono">{result.agentData.totalFeePaid} 0G</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MerkleVerifier;
