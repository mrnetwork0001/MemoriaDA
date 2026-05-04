// ============================================================
// Deploy MemoriaRegistry to 0G Mainnet (Chain ID 16661)
// Usage: node scripts/deploy-mainnet.js
// ============================================================

import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log('');
  console.log('══════════════════════════════════════════════');
  console.log('  MEMORIA DA — Mainnet Deployment');
  console.log('══════════════════════════════════════════════');
  console.log('');

  // Load compiled artifact
  const artifactPath = path.join(__dirname, '../artifacts/contracts/MemoriaRegistryV2.sol/MemoriaRegistryV2.json');

  if (!fs.existsSync(artifactPath)) {
    throw new Error('Contract not compiled. Run: npx hardhat compile');
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  // 0G Mainnet config
  const rpcUrl = 'https://evmrpc.0g.ai';
  const chainId = 16661;
  const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, {
    staticNetwork: new ethers.Network('0G-Mainnet', chainId),
  });

  let privateKey = process.env.VITE_PRIVATE_KEY || process.env.PRIVATE_KEY || process.env.ZG_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('No private key found. Set VITE_PRIVATE_KEY, PRIVATE_KEY, or ZG_PRIVATE_KEY in .env');
  }

  privateKey = String(privateKey).trim();
  if (!privateKey.startsWith('0x')) {
    privateKey = '0x' + privateKey;
  }

  const signer = new ethers.Wallet(privateKey, provider);
  console.log(`Deploying from: ${signer.address}`);
  console.log(`Network:        0G Mainnet (Chain ID ${chainId})`);
  console.log(`RPC:            ${rpcUrl}`);
  console.log('');

  // Check balance
  const balance = await provider.getBalance(signer.address);
  console.log(`Balance: ${ethers.formatEther(balance)} 0G`);

  if (balance === 0n) {
    throw new Error('Wallet has no balance on 0G Mainnet. You need real 0G tokens.');
  }

  // Deploy contract
  console.log('Deploying MemoriaRegistry...');
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
  const contract = await factory.deploy();

  console.log('Tx sent. Waiting for confirmation...');
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log('');
  console.log('══════════════════════════════════════════════');
  console.log('  ✅ MemoriaRegistry deployed to MAINNET');
  console.log('══════════════════════════════════════════════');
  console.log('');
  console.log(`  Contract: ${address}`);
  console.log(`  Explorer: https://chainscan.0g.ai/address/${address}`);
  console.log('');
  console.log('  📋 Next steps:');
  console.log(`  1. Update src/config/network.js → mainnet.registryAddress = '${address}'`);
  console.log('  2. Switch to Mainnet in the app');
  console.log('  3. Register an agent and commit a memory to generate on-chain activity');
  console.log('');
}

main().catch((error) => {
  console.error('Deployment failed:', error.message || error);
  process.exitCode = 1;
});
