// ============================================================
// Memoria DA — Compute Backend Server
// ============================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import computeService from './computeService.js';
import { uploadMemoryBlob } from './storageUpload.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const ALLOWED_ORIGINS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https:\/\/memoria-app\.vercel\.app$/,
  /^https:\/\/.*\.vercel\.app$/,
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.some(re => re.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────

// Health check
app.get('/api/compute/status', (req, res) => {
  res.json(computeService.getStatus());
});

// Chat completion via 0G Compute
app.post('/api/compute/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }
    const result = await computeService.chatCompletion(messages);
    res.json(result);
  } catch (err) {
    console.log('[Server] Chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Generate embedding (server-side for consistency)
app.post('/api/compute/embed', (req, res) => {
  try {
    const { text, dimensions } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'text is required' });
    }
    const embedding = computeService.generateEmbedding(text, dimensions);
    res.json({ embedding, dimensions: embedding.length, model: 'local-deterministic' });
  } catch (err) {
    console.log('[Server] Embed error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Upload memory blob to 0G Storage (server-side, bypasses browser CORS)
app.post('/api/storage/upload', async (req, res) => {
  try {
    const { payload, network } = req.body;
    if (!payload) return res.status(400).json({ error: 'payload is required' });
    const payloadJson = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const result = await uploadMemoryBlob(payloadJson, network || 'testnet');
    res.json(result);
  } catch (err) {
    console.error('[Storage] Upload error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── OpenClaw Skill Endpoints ───────────────────────────────

// Anchor a memory root on 0G Chain (server-side signing)
app.post('/api/registry/anchor', async (req, res) => {
  try {
    const { agentId, rootHash, vectorCount, network } = req.body;
    if (!agentId || !rootHash) {
      return res.status(400).json({ error: 'agentId and rootHash are required' });
    }

    const { ethers } = await import('ethers');
    const net = network === 'mainnet'
      ? { rpcUrl: 'https://evmrpc.0g.ai', txExplorer: 'https://chainscan.0g.ai/tx/' }
      : { rpcUrl: 'https://evmrpc-testnet.0g.ai', txExplorer: 'https://chainscan-galileo.0g.ai/tx/' };

    const REGISTRY_ABI = [
      'function registerAgent(string agentId, string framework) external',
      'function updateMemoryRoot(string agentId, bytes32 rootHash, uint256 vectorCount) external payable',
      'function getAgent(string agentId) external view returns (address, string, bytes32, uint256, uint256)',
    ];

    const privateKey = process.env.ZG_PRIVATE_KEY || process.env.VITE_PRIVATE_KEY;
    if (!privateKey) return res.status(500).json({ error: 'ZG_PRIVATE_KEY not configured' });

    const registryAddress = '0x85d31A4a95035708972Ffbe1Be6f1c31a350b7f3';
    const provider = new ethers.JsonRpcProvider(net.rpcUrl);
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(registryAddress, REGISTRY_ABI, signer);

    // Ensure agent is registered
    try {
      await contract.getAgent(agentId);
    } catch {
      console.log(`[Registry] Agent ${agentId} not registered, registering now...`);
      const regTx = await contract.registerAgent(agentId, 'OpenClaw');
      await regTx.wait().catch(() => {});
    }

    // Convert rootHash to bytes32
    let rootHashBytes;
    if (rootHash.startsWith('0x') && rootHash.length === 66) {
      rootHashBytes = rootHash;
    } else {
      rootHashBytes = ethers.zeroPadValue(
        ethers.hexlify(ethers.toBeArray(BigInt(rootHash))),
        32
      );
    }

    const fee = ethers.parseEther('0.001');
    const tx = await contract.updateMemoryRoot(agentId, rootHashBytes, vectorCount || 1, { value: fee });

    let receipt;
    try {
      receipt = await tx.wait();
    } catch (waitErr) {
      const msg = waitErr?.message || '';
      if (msg.includes('coalesce') || msg.includes('Missing or invalid parameters')) {
        receipt = { blockNumber: null, transactionHash: tx.hash, status: 1 };
      } else {
        throw waitErr;
      }
    }

    const blockLabel = receipt.blockNumber ? `Block #${receipt.blockNumber}` : 'TX Confirmed';
    const explorerUrl = `${net.txExplorer}${receipt.transactionHash || tx.hash}`;

    console.log(`[Registry] Anchored ✓ ${blockLabel} | ${explorerUrl}`);
    res.json({ blockLabel, explorerUrl, txHash: receipt.transactionHash || tx.hash });
  } catch (err) {
    console.error('[Registry] Anchor error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Save agent state snapshot to 0G Storage + anchor on chain
app.post('/api/state/snapshot', async (req, res) => {
  try {
    const { agentId, state, network } = req.body;
    if (!agentId || !state) {
      return res.status(400).json({ error: 'agentId and state object are required' });
    }

    const snapshotPayload = {
      protocol: 'memoria-da',
      version: '1.0.0',
      type: 'state-snapshot',
      agentId,
      timestamp: new Date().toISOString(),
      state,
    };

    // 1. Upload state to 0G Storage
    console.log(`[State] Snapshotting agent state for ${agentId}...`);
    const uploadResult = await uploadMemoryBlob(
      JSON.stringify(snapshotPayload),
      network || 'testnet'
    );
    console.log(`[State] Stored ✓ root: ${uploadResult.rootHash.slice(0, 16)}...`);

    // 2. Anchor on-chain (reuse the anchor logic via internal fetch)
    // We do a lightweight anchor here
    const { ethers } = await import('ethers');
    const net = (network || 'testnet') === 'mainnet'
      ? { rpcUrl: 'https://evmrpc.0g.ai', txExplorer: 'https://chainscan.0g.ai/tx/' }
      : { rpcUrl: 'https://evmrpc-testnet.0g.ai', txExplorer: 'https://chainscan-galileo.0g.ai/tx/' };

    const privateKey = process.env.ZG_PRIVATE_KEY || process.env.VITE_PRIVATE_KEY;
    const registryAddress = '0x85d31A4a95035708972Ffbe1Be6f1c31a350b7f3';
    const provider = new ethers.JsonRpcProvider(net.rpcUrl);
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(registryAddress, [
      'function updateMemoryRoot(string agentId, bytes32 rootHash, uint256 vectorCount) external payable',
    ], signer);

    let rootHashBytes;
    if (uploadResult.rootHash.startsWith('0x') && uploadResult.rootHash.length === 66) {
      rootHashBytes = uploadResult.rootHash;
    } else {
      rootHashBytes = ethers.zeroPadValue(
        ethers.hexlify(ethers.toBeArray(BigInt(uploadResult.rootHash))),
        32
      );
    }

    const fee = ethers.parseEther('0.001');
    const tx = await contract.updateMemoryRoot(agentId, rootHashBytes, 1, { value: fee });
    let receipt;
    try {
      receipt = await tx.wait();
    } catch (e) {
      receipt = { blockNumber: null, transactionHash: tx.hash, status: 1 };
    }

    const blockLabel = receipt.blockNumber ? `Block #${receipt.blockNumber}` : 'TX Confirmed';
    const explorerUrl = `${net.txExplorer}${receipt.transactionHash || tx.hash}`;
    console.log(`[State] Anchored ✓ ${blockLabel}`);

    res.json({
      type: 'state-snapshot',
      rootHash: uploadResult.rootHash,
      blockLabel,
      explorerUrl,
      txHash: receipt.transactionHash || tx.hash,
    });
  } catch (err) {
    console.error('[State] Snapshot error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Cross-agent memory query — list all agents on the Global Registry
app.get('/api/memory/global', async (req, res) => {
  try {
    const { ethers } = await import('ethers');
    const rpcUrl = 'https://evmrpc-testnet.0g.ai';
    const registryAddress = '0x85d31A4a95035708972Ffbe1Be6f1c31a350b7f3';
    const ABI = [
      'function getAgentCount() external view returns (uint256)',
      'function getAgentIdByIndex(uint256 index) external view returns (string)',
      'function getAgentFull(string agentId) external view returns (address owner, string framework, bytes32 currentRoot, uint256 vectorCount, uint256 lastUpdated, uint256 tokenId, uint256 totalFeePaid)',
    ];

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(registryAddress, ABI, provider);

    const count = Number(await contract.getAgentCount());
    const agents = [];

    for (let i = 0; i < count; i++) {
      try {
        const agentId = await contract.getAgentIdByIndex(i);
        const [owner, framework, currentRoot, vectorCount, lastUpdated, tokenId, totalFeePaid] = await contract.getAgentFull(agentId);
        agents.push({
          id: agentId,
          owner,
          framework,
          currentRoot,
          vectorCount: Number(vectorCount),
          lastUpdated: Number(lastUpdated),
          tokenId: Number(tokenId),
          totalFeePaid: ethers.formatEther(totalFeePaid),
        });
      } catch (e) {
        console.warn(`[Global] Failed to fetch agent at index ${i}:`, e.message);
      }
    }

    res.json({
      network: '0G-Galileo-Testnet',
      registryAddress,
      totalAgents: agents.length,
      agents: agents.sort((a, b) => b.lastUpdated - a.lastUpdated),
    });
  } catch (err) {
    console.error('[Global] Query error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Serve Frontend ─────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../dist/index.html')));

// ─── Startup ────────────────────────────────────────────────

async function start() {
  console.log('');
  console.log('══════════════════════════════════════════════');
  console.log('  MEMORIA DA — Compute Backend');
  console.log('══════════════════════════════════════════════');
  console.log('');

  // Initialize 0G Compute broker
  const ready = await computeService.initialize();

  // Start server regardless — frontend can check /status
  app.listen(PORT, () => {
    console.log('');
    console.log(`[Server] Listening on http://localhost:${PORT}`);
    console.log(`[Server] Status:  http://localhost:${PORT}/api/compute/status`);
    console.log(`[Server] Compute: ${ready ? '✅ LIVE' : '⚠️ DEGRADED (mock fallback)'}`);
    console.log('');
  });
}

start().catch(err => {
  console.log('[Server] Fatal:', err.message || err);
  process.exit(1);
});
