import hre from "hardhat";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log("Starting deployment of MemoriaRegistry to 0G Galileo...");

  // Load compiled artifact
  const artifactPath = path.join(__dirname, "../artifacts/contracts/MemoriaRegistry.sol/MemoriaRegistry.json");
  
  if (!fs.existsSync(artifactPath)) {
    throw new Error("Contract not compiled. Run: npx hardhat compile");
  }
  
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // Bypass Hardhat's config objects for the URL to avoid ethers v6 URL parsing bugs
  const rpcUrl = "https://evmrpc-testnet.0g.ai";
  const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, { staticNetwork: new ethers.Network("0G-Galileo-Testnet", 16602) });
  let privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error("PRIVATE_KEY not set in .env file");
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
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
  const contract = await factory.deploy();
  
  console.log("Deployment tx sent. Waiting for confirmation...");
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("--------------------------------------------------");
  console.log("✅ MemoriaRegistry deployed to:", address);
  console.log("--------------------------------------------------");
  console.log("Update your src/config/network.js:");
  console.log(`  registryAddress: '${address}',`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
