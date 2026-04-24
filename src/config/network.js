// ============================================================
// 0G Network Configuration — Testnet & Mainnet
// ============================================================

export const NETWORKS = {
  testnet: {
    key: 'testnet',
    label: 'Testnet',
    chainId: 16602,
    chainIdHex: '0x40DA',
    chainName: '0G-Galileo-Testnet',
    nativeCurrency: {
      name: '0G',
      symbol: '0G',
      decimals: 18,
    },
    rpcUrl: 'https://evmrpc-testnet.0g.ai',
    blockExplorer: 'https://explorer.0g.ai/testnet',
    faucet: 'https://faucet.0g.ai',

    // Storage
    indexerRpc: 'https://indexer-storage-testnet-turbo.0g.ai',
    flowContractAddress: '0xbD75117F80b4E22698D0Cd7612d92BDb8eaff628',

    // Memoria DA Registry
    registryAddress: '0x532Aa5A41ffC5DD039CA1Bc53db7c26F86EfE4A7',
  },

  mainnet: {
    key: 'mainnet',
    label: 'Mainnet',
    chainId: 16661,
    chainIdHex: '0x4115',
    chainName: '0G-Mainnet',
    nativeCurrency: {
      name: '0G',
      symbol: '0G',
      decimals: 18,
    },
    rpcUrl: 'https://evmrpc.0g.ai',
    blockExplorer: 'https://chainscan.0g.ai',
    faucet: null, // No faucet for mainnet

    // Storage
    indexerRpc: 'https://indexer-storage-turbo.0g.ai',
    flowContractAddress: '', // To be set after mainnet deploy

    // Memoria DA Registry — to be deployed on mainnet
    registryAddress: '',
  },
};

// ─── Active Network State ───────────────────────────────────

const STORAGE_KEY = 'memoria_network';

let _activeNetworkKey =
  (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)) ||
  'testnet';

// Listeners for network changes
const _listeners = new Set();

export function getActiveNetwork() {
  return NETWORKS[_activeNetworkKey];
}

export function getActiveNetworkKey() {
  return _activeNetworkKey;
}

export function setActiveNetwork(key) {
  if (!NETWORKS[key]) throw new Error(`Unknown network: ${key}`);
  _activeNetworkKey = key;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, key);
  }
  _listeners.forEach(fn => fn(NETWORKS[key], key));
}

export function onNetworkChange(listener) {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

// ─── Helpers ────────────────────────────────────────────────

/** Build the chain object for wallet_addEthereumChain */
export function buildChainParam(networkKey) {
  const net = NETWORKS[networkKey || _activeNetworkKey];
  return {
    chainId: net.chainIdHex,
    chainName: net.chainName,
    nativeCurrency: net.nativeCurrency,
    rpcUrls: [net.rpcUrl],
    blockExplorerUrls: [net.blockExplorer],
  };
}

// ─── Backward-compat exports ────────────────────────────────
// These are dynamic getters so existing code still works
export const NETWORK_CONFIG = new Proxy({}, {
  get(_, prop) {
    return getActiveNetwork()[prop];
  },
});

export const ZG_CHAIN = new Proxy({}, {
  get(_, prop) {
    return buildChainParam()[prop];
  },
});

export default NETWORK_CONFIG;
