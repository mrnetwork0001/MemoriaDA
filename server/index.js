// ============================================================
// Memoria DA — Compute Backend Server
// ============================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
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
