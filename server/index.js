// ============================================================
// Memoria DA — Compute Backend Server
// ============================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import computeService from './computeService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow any localhost port in development
    if (!origin || /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
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
