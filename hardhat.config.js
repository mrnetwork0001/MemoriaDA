import "dotenv/config";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainId: 31337,
    },
    zgGalileo: {
      type: 'http',
      url: "https://evmrpc-testnet.0g.ai",
      accounts: (process.env.PRIVATE_KEY || process.env.VITE_PRIVATE_KEY) ? [process.env.PRIVATE_KEY || process.env.VITE_PRIVATE_KEY] : [],
      chainId: 16602,
    },
    zgMainnet: {
      type: 'http',
      url: "https://evmrpc.0g.ai",
      accounts: (process.env.PRIVATE_KEY || process.env.VITE_PRIVATE_KEY) ? [process.env.PRIVATE_KEY || process.env.VITE_PRIVATE_KEY] : [],
      chainId: 16661,
    },
  },
};
