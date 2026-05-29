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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
const ALLOWED_ORIGINS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https:\/\/memoria-app\.vercel\.app$/,
  /^https:\/\/.*\.vercel\.app$/,
  /^https:\/\/.*\.up\.railway\.app$/,
  /^https:\/\/.*memoriada.*$/,
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

// SDK Waitlist signup
app.post('/api/waitlist/signup', async (req, res) => {
  try {
    const { email, framework } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { promises: fs } = await import('fs');
    const waitlistPath = path.join(__dirname, 'waitlist.json');
    
    let list = [];
    try {
      const data = await fs.readFile(waitlistPath, 'utf8');
      list = JSON.parse(data);
    } catch (err) {
      // File doesn't exist yet, start with empty list
    }

    // Check duplicate
    if (list.some(entry => entry.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'This email is already registered on the waitlist.' });
    }

    const newEntry = {
      email,
      framework: framework || 'Other',
      timestamp: new Date().toISOString()
    };

    list.push(newEntry);
    await fs.writeFile(waitlistPath, JSON.stringify(list, null, 2), 'utf8');
    console.log(`[Waitlist] New developer signup logged locally: ${email} (${framework})`);

    // Forward to Google Sheets Webhook if configured
    const sheetUrl = process.env.WAITLIST_GOOGLE_SHEET_URL;
    if (sheetUrl) {
      try {
        console.log(`[Waitlist] Forwarding ${email} to Google Sheets...`);
        const sheetResponse = await fetch(sheetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, framework: newEntry.framework })
        });
        if (!sheetResponse.ok) {
          console.warn(`[Waitlist] Google Sheet webhook returned non-200 status: ${sheetResponse.status} ${sheetResponse.statusText}`);
          const text = await sheetResponse.text().catch(() => '');
          console.warn(`[Waitlist] Google Sheet error response: ${text.slice(0, 200)}`);
        } else {
          console.log('[Waitlist] Successfully synced with Google Sheets');
        }
      } catch (sheetErr) {
        console.warn('[Waitlist] Failed to forward to Google Sheets:', sheetErr.message);
      }
    }

    // Forward to Resend for Transactional Email if configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        console.log(`[Waitlist] Sending confirmation email to ${email} via Resend...`);
        
        const htmlBody = `
        <div style="font-family: monospace, sans-serif; background-color: #0d0d13; color: #f8f7ff; padding: 30px; border: 1px solid #7c3aed; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00f0ff; text-transform: uppercase; letter-spacing: 2px; margin-top: 0;">// INITIALIZING_NEURAL_LINK...</h2>
          <p style="font-size: 14px; line-height: 1.6;">Welcome to the sprawl. Your email has been anchored to the early-access list for the standalone <strong>@memoria/sdk</strong>.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #7c3aed;">
            <tr>
              <td style="padding: 12px; border: 1px solid #7c3aed; font-weight: bold;">Framework</td>
              <td style="padding: 12px; border: 1px solid #7c3aed; color: #00f0ff;">${newEntry.framework}</td>
            </tr>
          </table>
          
          <p style="font-size: 14px; line-height: 1.6;">We are currently live on the <strong>0G Aristotle Mainnet</strong>. Over the next few weeks, we will be rolling out SDK access codes to our waitlist developers so you can start giving your AI agents persistent, decentralized memory.</p>
          <p style="font-size: 14px; line-height: 1.6;">To prepare for early integration, check out our tutorial: <a href="https://memoriada.xyz/blog/permanent-memory-5-minutes" style="color: #7c3aed; text-decoration: none;"><strong>Read the 5-Minute Guide ❯</strong></a></p>
          
          <hr style="border: 0; border-top: 1px dashed #7c3aed; margin: 20px 0;" />
          <p style="font-size: 11px; color: #a5b4fc;">SYSTEM_STATUS: ACTIVE // 0G_APAC_TRACK_1 // © 2026 Memoria DA</p>
        </div>
        `;

        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Memoria DA <support@memoriada.xyz>',
            to: [email],
            subject: '🧠 Welcome to the Memoria DA SDK Waitlist!',
            html: htmlBody
          })
        });

        if (!emailResponse.ok) {
          const emailErrText = await emailResponse.text().catch(() => '');
          console.warn(`[Waitlist] Resend returned non-200 status: ${emailResponse.status} | ${emailErrText.slice(0, 200)}`);
        } else {
          console.log(`[Waitlist] Confirmation email sent successfully to ${email}`);
        }
      } catch (emailErr) {
        console.warn('[Waitlist] Failed to send email via Resend:', emailErr.message);
      }
    }

    res.json({ success: true, message: 'Welcome to the sprawl. Your neural link is established.' });
  } catch (err) {
    console.error('[Waitlist] Error:', err.message);
    res.status(500).json({ error: 'Failed to record waitlist signup' });
  }
});

// ─── Serve Frontend ─────────────────────────────────────────

app.use(express.static(path.join(__dirname, '../dist')));

// Fallback for SPA routing (Express 5.x compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

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

// Keep process alive — 0G Compute SDK can drain the event loop after init
process.stdin.resume();
