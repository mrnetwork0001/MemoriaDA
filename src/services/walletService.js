// ============================================================
// Wallet Service — MetaMask / EVM Wallet Connection
// ============================================================

import { BrowserProvider } from 'ethers';
import { ZG_CHAIN, NETWORK_CONFIG } from '../config/network';

class WalletService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.address = null;
    this.chainId = null;
    this.listeners = new Set();
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
    return {
      address: this.address,
      chainId: this.chainId,
      isConnected: !!this.address,
      isCorrectChain: this.chainId === NETWORK_CONFIG.chainId,
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

  // Switch to 0G Galileo Testnet
  async switchTo0GChain() {
    if (!this.isMetaMaskInstalled()) throw new Error('MetaMask not installed');

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ZG_CHAIN.chainId }],
      });
    } catch (switchError) {
      // Chain not added yet — add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [ZG_CHAIN],
        });
      } else {
        throw switchError;
      }
    }

    // Re-initialize after chain switch
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
