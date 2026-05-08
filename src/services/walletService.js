// ============================================================
// Wallet Service — MetaMask / EVM Wallet Connection
// ============================================================

import { BrowserProvider } from 'ethers';
import {
  getActiveNetwork,
  buildChainParam,
  onNetworkChange,
} from '../config/network';

class WalletService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.address = null;
    this.chainId = null;
    this.listeners = new Set();

    // Auto-react to network config changes
    onNetworkChange(() => {
      if (this.address) {
        // Re-switch chain when user toggles network
        this.switchTo0GChain().catch(err => {
          console.warn('[Wallet] Auto chain-switch failed:', err.message);
        });
      }
    });
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  _notify() {
    const state = this.getState();
    this.listeners.forEach(fn => fn(state));
  }

  getState() {
    const net = getActiveNetwork();
    return {
      address: this.address,
      chainId: this.chainId,
      isConnected: !!this.address,
      isCorrectChain: this.chainId === net.chainId,
      provider: this.provider,
      signer: this.signer,
    };
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

  // Connect wallet
  async connect() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to use Memoria DA.');
    }

    try {
      this.provider = new BrowserProvider(window.ethereum);
      const accounts = await this.provider.send('eth_requestAccounts', []);
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet.');
      }

      this.signer = await this.provider.getSigner();
      this.address = accounts[0];
      
      const network = await this.provider.getNetwork();
      this.chainId = Number(network.chainId);

      // Setup event listeners
      this._setupListeners();
      this._notify();

      return this.getState();
    } catch (error) {
      console.error('[Wallet] Connection failed:', error);
      throw error;
    }
  }

  // Switch to the currently-selected 0G chain (testnet or mainnet)
  async switchTo0GChain() {
    if (!this.isMetaMaskInstalled()) throw new Error('MetaMask not installed');

    const chainParam = buildChainParam();
    console.log('[Wallet] Switching to chain:', chainParam.chainName, chainParam.chainId);

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainParam.chainId }],
      });
    } catch (switchError) {
      // User rejected the switch
      const code = switchError?.code ?? switchError?.data?.originalError?.code;
      if (code === 4001) throw new Error('Chain switch rejected by user.');

      // Chain not in wallet — try adding it
      // Different wallets use different codes: 4902, -32603, or no code at all
      console.log('[Wallet] Chain not found, attempting to add...', switchError?.code, switchError?.message);
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [chainParam],
        });
      } catch (addError) {
        const addCode = addError?.code ?? addError?.data?.originalError?.code;
        if (addCode === 4001) throw new Error('User rejected adding the 0G network.');
        console.error('[Wallet] Failed to add chain:', addError);
        throw new Error(`Could not add 0G network: ${addError?.message || 'Unknown error'}`);
      }
    }

    // Re-initialize after chain switch
    // Small delay to let MetaMask finish the internal switch
    await new Promise(r => setTimeout(r, 500));
    this.provider = new BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    const network = await this.provider.getNetwork();
    this.chainId = Number(network.chainId);
    this._notify();
  }

  // Disconnect (client-side only — MetaMask doesn't truly disconnect)
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.address = null;
    this.chainId = null;
    this._notify();
  }

  // Format address for display
  formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Setup MetaMask event listeners
  _setupListeners() {
    if (!window.ethereum) return;

    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        this.address = accounts[0];
        this._notify();
      }
    });

    window.ethereum.on('chainChanged', (chainIdHex) => {
      this.chainId = parseInt(chainIdHex, 16);
      // Re-create provider/signer
      this.provider = new BrowserProvider(window.ethereum);
      this.provider.getSigner().then(signer => {
        this.signer = signer;
        this._notify();
      });
    });
  }
}

// Singleton
export const walletService = new WalletService();
export default walletService;
