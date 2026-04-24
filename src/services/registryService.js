// ============================================================
// Registry Service — MemoriaRegistry On-Chain Interactions
// ============================================================

import { Contract, ethers } from 'ethers';
import { MEMORIA_REGISTRY_ABI } from '../config/constants';
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

  _getContract(signer) {
    const address = NETWORK_CONFIG.registryAddress;
    if (!address) {
      throw new Error('MemoriaRegistry not deployed. Set registryAddress in network.js.');
    }
    return new Contract(address, MEMORIA_REGISTRY_ABI, signer);
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

  // ─── Register a new agent on-chain ───────────────────────────

  async registerAgent(agentId, framework, signer) {
    this._emitLog('REGISTRY', `Registering agent on-chain  ❯  id: ${agentId}  ❯  framework: ${framework}`, 'info');
    const contract = this._getContract(signer);

    const tx = await contract.registerAgent(agentId, framework);
    this._emitLog('REGISTRY', `Tx submitted  ❯  hash: ${tx.hash.slice(0, 14)}...  ❯  awaiting confirm`, 'info');

    const receipt = await tx.wait();
    this._emitLog('REGISTRY', `✓ Agent registered  ❯  block: ${receipt.blockNumber}  ❯  gas: ${receipt.gasUsed.toString()}`, 'success');

    return receipt;
  }

  // ─── Update Memory Root after 0G Storage upload ──────────────

  async updateMemoryRoot(agentId, rootHash, vectorCount, signer) {
    this._emitLog('CHAIN', `Anchoring memory root on-chain  ❯  agent: ${agentId}  ❯  root: ${rootHash.slice(0, 10)}...${rootHash.slice(-6)}`, 'info');
    const contract = this._getContract(signer);

    // Convert the hex root hash string to bytes32
    const rootHashBytes = ethers.zeroPadValue(
      ethers.hexlify(ethers.toBeArray(BigInt(rootHash))),
      32
    );

    const tx = await contract.updateMemoryRoot(agentId, rootHashBytes, vectorCount);
    this._emitLog('CHAIN', `Tx submitted  ❯  hash: ${tx.hash.slice(0, 14)}...  ❯  awaiting confirm`, 'info');

    const receipt = await tx.wait();
    this._emitLog('CHAIN', `✓ Memory root anchored  ❯  root: ${rootHash.slice(0, 10)}...${rootHash.slice(-6)}  ❯  block: ${receipt.blockNumber}`, 'success');

    return receipt;
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
}

export const registryService = new RegistryService();
export default registryService;
