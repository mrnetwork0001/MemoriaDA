// ============================================================
// Registry Service — MemoriaRegistryV2 On-Chain Interactions
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

  // ─── Register a new agent on-chain (mints NFT) ──────────────

  async registerAgent(agentId, framework, signer) {
    this._emitLog('REGISTRY', `Registering agent on-chain  ❯  id: ${agentId}  ❯  framework: ${framework}`, 'info');
    const contract = this._getContract(signer);

    const tx = await contract.registerAgent(agentId, framework);
    this._emitLog('REGISTRY', `Tx submitted  ❯  hash: ${tx.hash.slice(0, 14)}...  ❯  awaiting confirm`, 'info');

    const receipt = await tx.wait();
    this._emitLog('REGISTRY', `✓ Agent registered + NFT minted  ❯  block: ${receipt.blockNumber}  ❯  gas: ${receipt.gasUsed.toString()}`, 'success');

    return receipt;
  }

  // ─── Update Memory Root with micropayment ────────────────────

  async updateMemoryRoot(agentId, rootHash, vectorCount, signer) {
    this._emitLog('CHAIN', `Anchoring memory root on-chain  ❯  agent: ${agentId}  ❯  root: ${rootHash.slice(0, 10)}...${rootHash.slice(-6)}`, 'info');
    const contract = this._getContract(signer);

    // Convert the hex root hash string to bytes32
    const rootHashBytes = ethers.zeroPadValue(
      ethers.hexlify(ethers.toBeArray(BigInt(rootHash))),
      32
    );

    // Send with micropayment fee
    const fee = ethers.parseEther(MEMORY_FEE);
    this._emitLog('CHAIN', `Attaching memory fee  ❯  ${MEMORY_FEE} 0G`, 'info');

    const tx = await contract.updateMemoryRoot(agentId, rootHashBytes, vectorCount, { value: fee });
    this._emitLog('CHAIN', `Tx submitted  ❯  hash: ${tx.hash.slice(0, 14)}...  ❯  awaiting confirm`, 'info');

    const receipt = await tx.wait();
    this._emitLog('CHAIN', `✓ Memory root anchored + fee paid  ❯  root: ${rootHash.slice(0, 10)}...${rootHash.slice(-6)}  ❯  block: ${receipt.blockNumber}  ❯  fee: ${MEMORY_FEE} 0G`, 'success');

    return receipt;
  }

  // ─── On-chain memory verification ────────────────────────────

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
      const agents = [];
      
      for (let i = 0; i < count; i++) {
        try {
          const agentId = await contract.getAgentIdByIndex(i);
          const details = await this.getAgentFull(agentId, provider);
          if (details) {
            agents.push({ id: agentId, ...details });
          }
        } catch (err) {
          console.warn(`Failed to fetch agent at index ${i}:`, err.message);
        }
      }
      
      return agents.sort((a, b) => b.lastUpdated - a.lastUpdated);
    } catch (err) {
      console.warn('Failed to enumerate agents:', err.message);
      // Fallback: try event-based query
      try {
        const filter = contract.filters.AgentRegistered();
        const events = await contract.queryFilter(filter, -50000, "latest");
        const agentIds = [...new Set(events.map(e => e.args.agentId))];
        
        const agents = [];
        for (const id of agentIds) {
          const details = await this.getAgentFull(id, provider);
          if (details) {
            agents.push({ id, ...details });
          }
        }
        return agents.sort((a, b) => b.lastUpdated - a.lastUpdated);
      } catch {
        return [];
      }
    }
  }
}

export const registryService = new RegistryService();
export default registryService;
