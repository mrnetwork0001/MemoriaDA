import hre from "hardhat";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log("");
  console.log("══════════════════════════════════════════════");
  console.log("  MEMORIA DA — Testnet Deployment (V2)");
  console.log("══════════════════════════════════════════════");
  console.log("");

  // Load compiled artifact — V2 with NFTs + Micropayments
  const artifactPath = path.join(__dirname, "../artifacts/contracts/MemoriaRegistryV2.sol/MemoriaRegistryV2.json");
  
  if (!fs.existsSync(artifactPath)) {
    throw new Error("Contract not compiled. Run: npx hardhat compile");
  }
  
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // Bypass Hardhat's config objects for the URL to avoid ethers v6 URL parsing bugs
  const rpcUrl = "https://evmrpc-testnet.0g.ai";
  const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, { staticNetwork: new ethers.Network("0G-Galileo-Testnet", 16602) });
  let privateKey = process.env.PRIVATE_KEY || process.env.VITE_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error("PRIVATE_KEY or VITE_PRIVATE_KEY not set in .env file");
  }
  
  privateKey = String(privateKey).trim();
  
  // Ethers v6 requires the 0x prefix
  if (!privateKey.startsWith('0x')) {
    privateKey = '0x' + privateKey;
  }
  
  const signer = new ethers.Wallet(privateKey, provider);
  console.log("Deploying from address:", signer.address);

  // Check balance
  const balance = await provider.getBalance(signer.address);
  console.log("Balance:", ethers.formatEther(balance), "0G");
  
  if (balance === 0n) {
    throw new Error("Wallet has no balance. Get testnet tokens from https://faucet.0g.ai");
  }

  // Deploy contract
  console.log("Deploying MemoriaRegistryV2 (NFT + Micropayments)...");
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
  const contract = await factory.deploy();
  
  console.log("Deployment tx sent. Waiting for confirmation...");
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("");
  console.log("══════════════════════════════════════════════");
  console.log("  ✅ MemoriaRegistryV2 deployed to TESTNET");
  console.log("══════════════════════════════════════════════");
  console.log("");
  console.log(`  Contract: ${address}`);
  console.log(`  Features: ERC-721 Agent Identity, Micropayments, Verification`);
  console.log("");
  console.log("  📋 Next steps:");
  console.log(`  1. Update src/config/network.js → testnet.registryAddress = '${address}'`);
  console.log("");
}

main().catch((error) => {
  console.error("Deployment failed:", error.message || error);
  process.exitCode = 1;
});
