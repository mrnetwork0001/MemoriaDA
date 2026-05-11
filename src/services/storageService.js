// ============================================================
// 0G Storage Service — Upload/Download Memory Blobs
// ============================================================

import { NETWORK_CONFIG } from '../config/network';
import { onNetworkChange } from '../config/network';
import { UPLOAD_OPTIONS, EMBEDDING_DIMENSIONS } from '../config/constants';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

// Lazy-load the SDK to avoid polyfill issues at module init time
let _sdk = null;
async function getSDK() {
  if (!_sdk) {
    try {
      _sdk = await import('@0gfoundation/0g-ts-sdk/browser');
    } catch (e) {
      console.warn('[StorageService] Browser SDK import failed, trying main path:', e.message);
      try {
        _sdk = await import('@0gfoundation/0g-ts-sdk');
      } catch (e2) {
        console.error('[StorageService] SDK import failed entirely:', e2.message);
        throw new Error('0G SDK could not be loaded. Check polyfill configuration.');
      }
    }
  }
  return _sdk;
}

class StorageService {
  constructor() {
    this.indexer = null;
    this.logs = [];
    this.logListeners = new Set();

    // Reset indexer when network changes
    onNetworkChange(() => {
      this.indexer = null;
      this._emitLog('CONNECT', 'Network changed — indexer reset, will reconnect on next operation', 'info');
    });
  }

  // Subscribe to log events (for the Data Terminal)
  onLog(listener) {
    this.logListeners.add(listener);
    return () => this.logListeners.delete(listener);
  }

  _emitLog(type, message, status = 'info') {
    const log = {
      id: Date.now() + Math.random(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
      }),
      status,
    };
    this.logs.push(log);
    this.logListeners.forEach(fn => fn(log));
    return log;
  }

  // Initialize the Indexer client
  async _getIndexer() {
    if (!this.indexer) {
      const sdk = await getSDK();
      this.indexer = new sdk.Indexer(NETWORK_CONFIG.indexerRpc);
      this._emitLog('CONNECT', `0G Storage indexer connected  ❯  ${NETWORK_CONFIG.indexerRpc}`, 'success');
    }
    return this.indexer;
  }

  // ─── CORE: Store Memory Vector ───────────────────────────────

  async storeMemory(memoryData, signer) {
    const startTime = performance.now();
    this._emitLog('STORE', `Preparing memory blob  ❯  agent: ${memoryData.agentId}  ❯  dim: ${memoryData.embedding?.length || EMBEDDING_DIMENSIONS}`, 'info');

    try {
      // 1. Serialize the memory object to JSON
      const memoryPayload = {
        protocol: 'memoria-da',
        version: '0.1.0',
        timestamp: new Date().toISOString(),
        agentId: memoryData.agentId,
        content: memoryData.content,
        embedding: memoryData.embedding,
        dimensions: memoryData.embedding?.length || EMBEDDING_DIMENSIONS,
        metadata: {
          ...memoryData.metadata,
          framework: memoryData.metadata?.framework || 'OpenClaw',
        },
      };

      const jsonStr = JSON.stringify(memoryPayload);
      const nativeBlob = new Blob([jsonStr], { type: 'application/json' });
      const blobSize = nativeBlob.size;

      this._emitLog('VECTOR', `Embedding serialized  ❯  size: ${(blobSize / 1024).toFixed(1)} KB  ❯  segments: ${Math.ceil(blobSize / 256)}`, 'info');

      // 2–4. Upload via backend server (avoids browser CORS block on 0G Storage nodes)
      this._emitLog('UPLOAD', `Uploading to 0G Storage via backend  ❯  blob_size: ${(blobSize / 1024).toFixed(1)} KB  ❯  indexer: turbo`, 'info');

      const networkKey = NETWORK_CONFIG.key || 'testnet';
      const uploadRes = await fetch(`${BACKEND_URL}/api/storage/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: memoryPayload, network: networkKey }),
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({ error: `HTTP ${uploadRes.status}` }));
        this._emitLog('ERROR', `Upload failed: ${errData.error}`, 'error');
        throw new Error(errData.error || `Storage upload failed (${uploadRes.status})`);
      }

      const { rootHash, tx, blobSize: serverBlobSize } = await uploadRes.json();

      this._emitLog('MERKLE', `Merkle root received  ❯  root: ${rootHash.slice(0, 10)}...${rootHash.slice(-6)}`, 'success');

      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
      this._emitLog('CONFIRM', `✓ Memory committed to 0G Storage  ❯  root: ${rootHash.slice(0, 10)}...${rootHash.slice(-6)}  ❯  ${elapsed}s`, 'success');

      if (tx) {
        this._emitLog('TX', `Onchain tx confirmed  ❯  hash: ${typeof tx === 'string' ? tx.slice(0, 14) : '0x...'}`, 'success');
      }

      return {
        rootHash,
        blobSize: serverBlobSize || blobSize,
        tx,
        elapsed: parseFloat(elapsed),
      };
    } catch (error) {
      this._emitLog('ERROR', `Storage error: ${error.message}`, 'error');
      throw error;
    }
  }

  // ─── CORE: Retrieve Memory Vector ──────────────────────────────

  async retrieveMemory(rootHash) {
    const startTime = performance.now();
    this._emitLog('FETCH', `Fetching from 0G Storage  ❯  root: ${rootHash.slice(0, 10)}...${rootHash.slice(-6)}`, 'info');

    try {
      // Use the REST API endpoint for browser-compatible download
      const apiUrl = `${NETWORK_CONFIG.indexerRpc}/file?root=${rootHash}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errData = await response.json();
          throw new Error(errData.message || `Download failed (${response.status})`);
        }
        throw new Error(`Download failed with status ${response.status}`);
      }

      const fileData = await response.arrayBuffer();
      const decoder = new TextDecoder('utf-8');
      const jsonStr = decoder.decode(fileData);
      const memoryData = JSON.parse(jsonStr);

      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
      this._emitLog('RETRIEVE', `Memory retrieved  ❯  dim: ${memoryData.dimensions || '?'}  ❯  size: ${(fileData.byteLength / 1024).toFixed(1)} KB  ❯  ${elapsed}s`, 'success');

      return memoryData;
    } catch (error) {
      this._emitLog('ERROR', `Retrieval error: ${error.message}`, 'error');
      throw error;
    }
  }

  // ─── HELPER: Generate Mock Embedding ────────────────────────────

  generateMockEmbedding(text, dimensions = EMBEDDING_DIMENSIONS) {
    this._emitLog('VECTOR', `Generating embedding  ❯  dim: ${dimensions}  ❯  model: local-mock`, 'info');

    let seed = 0;
    for (let i = 0; i < text.length; i++) {
      seed = ((seed << 5) - seed + text.charCodeAt(i)) | 0;
    }

    const embedding = [];
    for (let i = 0; i < dimensions; i++) {
      seed = (seed * 16807 + 0) % 2147483647;
      embedding.push((seed / 2147483647) * 2 - 1);
    }

    const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
    return embedding.map(v => v / magnitude);
  }

  // ─── HELPER: Cosine Similarity ──────────────────────────────────

  cosineSimilarity(a, b) {
    if (a.length !== b.length) return 0;
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  }
}

export const storageService = new StorageService();
export default storageService;
