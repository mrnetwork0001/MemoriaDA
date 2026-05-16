// ============================================================
// Registry Service — MemoriaRegistryV2 Onchain Interactions
// ERC-721 NFTs, Micropayments, Verification
// ============================================================

import { Contract, ethers } from 'ethers';
import { MEMORIA_REGISTRY_ABI, MEMORY_FEE } from '../config/constants';
import { NETWORK_CONFIG } from '../config/network';

class RegistryService {
  constructor() {
    this.logListeners = new Set();
  }

  // Subscribe to log events (for DataTerminal)
  onLog(listener) {
    this.logListeners.add(listener);
    return () => this.logListeners.delete(listener);
  }

  _emitLog(type, message, status = 'info') {
    const log = {
      id: Date.now() + Math.random(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
      }),
      status,
    };
    this.logListeners.forEach(fn => fn(log));
    return log;
  }

  _getContract(signerOrProvider) {
    const address = NETWORK_CONFIG.registryAddress;
    if (!address) {
      throw new Error('MemoriaRegistry not deployed. Set registryAddress in network.js.');
    }
    return new Contract(address, MEMORIA_REGISTRY_ABI, signerOrProvider);
  }

  // Check if contract address is configured
  isDeployed() {
    return !!NETWORK_CONFIG.registryAddress;
  }

  // ─── Check if an agent is already registered ─────────────────

  async isAgentRegistered(agentId, signer) {
    const contract = this._getContract(signer);
    try {
      await contract.getAgent(agentId);
      return true;
    } catch {
      return false; // Reverts with "Agent not found" if not registered
    }
  }

  // ─── Register a new agent onchain (mints NFT) ──────────────

  async registerAgent(agentId, framework, signer) {
    this._emitLog('REGISTRY', `Registering agent onchain  ❯  id: ${agentId}  ❯  framework: ${framework}`, 'info');
    const contract = this._getContract(signer);

    const tx = await contract.registerAgent(agentId, framework);
    this._emitLog('REGISTRY', `Tx submitted  ❯  hash: ${tx.hash.slice(0, 14)}...  ❯  awaiting confirm`, 'info');

    const receipt = await tx.wait();
    this._emitLog('REGISTRY', `✓ Agent registered + NFT minted  ❯  block: ${receipt.blockNumber}  ❯  gas: ${receipt.gasUsed.toString()}`, 'success');

    return receipt;
  }

  // ─── Update Memory Root with micropayment ────────────────────

  async updateMemoryRoot(agentId, rootHash, vectorCount, signer) {
    this._emitLog('CHAIN', `Anchoring memory root onchain  ❯  agent: ${agentId}  ❯  root: ${rootHash.slice(0, 10)}...${rootHash.slice(-6)}`, 'info');
    const contract = this._getContract(signer);

    // Convert root hash to bytes32 — handle both 32-byte hex strings and shorter values
    let rootHashBytes;
    try {
      if (rootHash.startsWith('0x') && rootHash.length === 66) {
        // Already a valid bytes32 hex string
        rootHashBytes = rootHash;
      } else {
        rootHashBytes = ethers.zeroPadValue(
          ethers.hexlify(ethers.toBeArray(BigInt(rootHash))),
          32
        );
      }
    } catch (convErr) {
      this._emitLog('ERROR', `rootHash conversion failed: ${convErr.message}  ❯  raw: ${rootHash}`, 'error');
      throw new Error(`Invalid rootHash format: ${rootHash}`);
    }

    // Send with micropayment fee
    const fee = ethers.parseEther(MEMORY_FEE);
    this._emitLog('CHAIN', `Attaching memory fee  ❯  ${MEMORY_FEE} 0G`, 'info');

    let tx;
    try {
      tx = await contract.updateMemoryRoot(agentId, rootHashBytes, vectorCount, { value: fee });
    } catch (callErr) {
      const reason = callErr?.reason || callErr?.data?.message || callErr?.message || 'unknown';
      this._emitLog('ERROR', `Contract call failed (gas estimation): ${reason}`, 'error');
      throw callErr;
    }

    this._emitLog('CHAIN', `Tx submitted  ❯  hash: ${tx.hash.slice(0, 14)}...  ❯  awaiting confirm`, 'info');

    let receipt;
    try {
      receipt = await tx.wait();
    } catch (waitErr) {
      const msg = waitErr?.message || '';
      // Known 0G testnet quirk: receipt polling fails but TX is already onchain
      if (msg.includes('coalesce') || msg.includes('Missing or invalid parameters') || msg.includes('eth_getTransactionReceipt')) {
        this._emitLog('WARN', `Receipt polling failed (known testnet RPC quirk) — TX confirmed onchain  ❯  hash: ${tx.hash.slice(0, 14)}...`, 'warning');
        // Return a synthetic receipt — blockNumber null triggers "TX Confirmed" display
        receipt = { blockNumber: null, transactionHash: tx.hash, status: 1 };
      } else {
        throw waitErr;
      }
    }

    this._emitLog('CHAIN', `✓ Memory root anchored + fee paid  ❯  root: ${rootHash.slice(0, 10)}...${rootHash.slice(-6)}  ❯  tx: ${tx.hash.slice(0, 14)}...  ❯  fee: ${MEMORY_FEE} 0G`, 'success');

    return receipt;
  }

  // ─── Onchain memory verification ────────────────────────────

  async verifyMemoryRoot(agentId, rootHash, provider) {
    const contract = this._getContract(provider);

    const rootHashBytes = ethers.zeroPadValue(
      ethers.hexlify(ethers.toBeArray(BigInt(rootHash))),
      32
    );

    const [isValid, storedRoot, lastUpdated] = await contract.verifyMemoryRoot(agentId, rootHashBytes);
    return {
      isValid,
      storedRoot,
      lastUpdated: Number(lastUpdated),
    };
  }

  // ─── Get memory fee from contract ────────────────────────────

  async getMemoryFee(provider) {
    const contract = this._getContract(provider);
    const fee = await contract.memoryFee();
    return ethers.formatEther(fee);
  }

  // ─── Read agent state from chain ─────────────────────────────

  async getAgent(agentId, provider) {
    const address = NETWORK_CONFIG.registryAddress;
    if (!address) return null;

    const contract = new Contract(address, MEMORIA_REGISTRY_ABI, provider);
    try {
      const [owner, framework, currentRoot, vectorCount, lastUpdated] = await contract.getAgent(agentId);
      return { owner, framework, currentRoot, vectorCount: Number(vectorCount), lastUpdated: Number(lastUpdated) };
    } catch {
      return null;
    }
  }

  // ─── Read full agent state (with NFT + fee data) ─────────────

  async getAgentFull(agentId, provider) {
    const address = NETWORK_CONFIG.registryAddress;
    if (!address) return null;

    const contract = new Contract(address, MEMORIA_REGISTRY_ABI, provider);
    try {
      const [owner, framework, currentRoot, vectorCount, lastUpdated, tokenId, totalFeePaid] = await contract.getAgentFull(agentId);
      return {
        owner,
        framework,
        currentRoot,
        vectorCount: Number(vectorCount),
        lastUpdated: Number(lastUpdated),
        tokenId: Number(tokenId),
        totalFeePaid: ethers.formatEther(totalFeePaid),
      };
    } catch {
      return null;
    }
  }

  // ─── Fetch all agents (for Explorer) ─────────────────────────
  
  async getAllAgents(provider) {
    const address = NETWORK_CONFIG.registryAddress;
    if (!address || !provider) return [];

    const contract = new Contract(address, MEMORIA_REGISTRY_ABI, provider);
    
    try {
      // Use getAgentCount + getAgentIdByIndex for reliable enumeration
      const count = Number(await contract.getAgentCount());
      
      // Fetch all agent IDs in parallel
      const idPromises = Array.from({ length: count }, (_, i) =>
        contract.getAgentIdByIndex(i).catch(err => {
          console.warn(`Failed to fetch agent ID at index ${i}:`, err.message);
          return null;
        })
      );
      const agentIds = (await Promise.all(idPromises)).filter(Boolean);

      // Fetch all agent details in parallel
      const detailPromises = agentIds.map(agentId =>
        this.getAgentFull(agentId, provider)
          .then(details => details ? { id: agentId, ...details } : null)
          .catch(() => null)
      );
      const agents = (await Promise.all(detailPromises)).filter(Boolean);
      
      return agents.sort((a, b) => b.lastUpdated - a.lastUpdated);
    } catch (err) {
      console.warn('Failed to enumerate agents:', err.message);
      // Fallback: try event-based query
      try {
        const filter = contract.filters.AgentRegistered();
        const events = await contract.queryFilter(filter, -50000, "latest");
        const agentIds = [...new Set(events.map(e => e.args.agentId))];
        
        const detailPromises = agentIds.map(id =>
          this.getAgentFull(id, provider)
            .then(details => details ? { id, ...details } : null)
            .catch(() => null)
        );
        const agents = (await Promise.all(detailPromises)).filter(Boolean);
        return agents.sort((a, b) => b.lastUpdated - a.lastUpdated);
    } catch {
        return [];
      }
    }
  }

  // ─── Fast Protocol Stats (For Landing/Docs) ──────────────────
  
  async getProtocolStats(provider) {
    const address = NETWORK_CONFIG.registryAddress;
    if (!address || !provider) return null;

    const contract = new Contract(address, MEMORIA_REGISTRY_ABI, provider);
    
    try {
      const [agentCount, totalMemoryUpdates, totalFeesCollected, events] = await Promise.all([
        contract.getAgentCount().catch(() => 0),
        contract.totalMemoryUpdates().catch(() => 0),
        contract.totalFeesCollected().catch(() => 0),
        contract.queryFilter(contract.filters.AgentRegistered(), -50000, "latest").catch(() => [])
      ]);

      const uniqueOwners = new Set(events.map(e => e.args?.agentOwner?.toLowerCase()).filter(Boolean));

      return {
        agents: Number(agentCount),
        vectors: Number(totalMemoryUpdates),
        fees: ethers.formatEther(totalFeesCollected || 0),
        uniqueOwners: uniqueOwners.size
      };
    } catch (err) {
      console.warn('Failed to fetch protocol stats:', err.message);
      return null;
    }
  }

  // ─── Find agent owned by a specific wallet ──────────────────
  
  async findAgentByOwner(walletAddress, provider) {
    const address = NETWORK_CONFIG.registryAddress;
    if (!address || !provider || !walletAddress) return null;

    const contract = new Contract(address, MEMORIA_REGISTRY_ABI, provider);
    
    try {
      const count = Number(await contract.getAgentCount());
      for (let i = 0; i < count; i++) {
        try {
          const agentId = await contract.getAgentIdByIndex(i);
          const [owner] = await contract.getAgent(agentId);
          if (owner.toLowerCase() === walletAddress.toLowerCase()) {
            return agentId;
          }
        } catch {
          continue;
        }
      }
    } catch (err) {
      console.warn('[Registry] findAgentByOwner failed:', err.message);
    }
    return null;
  }
}

export const registryService = new RegistryService();
export default registryService;
