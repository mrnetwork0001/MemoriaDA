// ============================================================
// 0G Network Configuration — Galileo Testnet
// ============================================================

export const NETWORK_CONFIG = {
  // Chain
  chainId: 16600,
  chainIdHex: '0x40D8',
  chainName: '0G Galileo Testnet',
  nativeCurrency: {
    name: 'A0GI',
    symbol: 'A0GI',
    decimals: 18,
  },
  rpcUrl: 'https://evmrpc-testnet.0g.ai',
  blockExplorer: 'https://chainscan-galileo.0g.ai',
  faucet: 'https://faucet.0g.ai',

  // Storage
  indexerRpc: 'https://indexer-storage-testnet-turbo.0g.ai',
  flowContractAddress: '0xbD75117F80b4E22698D0Cd7612d92BDb8eaff628',

  // Memoria DA Registry (to be deployed)
  registryAddress: null, // Will be set after deployment
};

// Chain definition for wallet
export const ZG_CHAIN = {
  chainId: NETWORK_CONFIG.chainIdHex,
  chainName: NETWORK_CONFIG.chainName,
  nativeCurrency: NETWORK_CONFIG.nativeCurrency,
  rpcUrls: [NETWORK_CONFIG.rpcUrl],
  blockExplorerUrls: [NETWORK_CONFIG.blockExplorer],
};

export default NETWORK_CONFIG;
