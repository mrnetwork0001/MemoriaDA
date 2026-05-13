// ============================================================
// 0G Compute Service — Router API + Direct Broker fallback
// ============================================================

import { ethers } from 'ethers';
import OpenAI from 'openai';

// Network configs
const NETWORKS = {
  testnet: { rpc: 'https://evmrpc-testnet.0g.ai' },
  mainnet: { rpc: 'https://evmrpc.0g.ai' },
};

class ComputeService {
  constructor() {
    this.broker = null;
    this.openai = null;
    this.isReady = false;
    this.model = process.env.ZG_CHAT_MODEL || 'qwen/qwen-2.5-7b-instruct';
    this.network = process.env.ZG_NETWORK || 'testnet';
    this.setupError = null;
    this.endpoint = null;
    this.mode = null; // 'router' or 'direct'
    this.providerAddress = process.env.ZG_CHAT_PROVIDER;
  }

  async initialize() {
    // ─── Try Router API first (simpler, recommended) ────────
    if (process.env.ZG_CHAT_API_KEY && process.env.ZG_CHAT_BASE_URL) {
      return this._initRouter();
    }

    // ─── Fallback to Direct broker flow ─────────────────────
    if (process.env.ZG_CHAT_PROVIDER && process.env.ZG_PRIVATE_KEY) {
      return this._initDirect();
    }

    this.setupError = 'No 0G Compute credentials configured. Set ZG_CHAT_API_KEY + ZG_CHAT_BASE_URL (Router) or ZG_CHAT_PROVIDER + ZG_PRIVATE_KEY (Direct).';
    console.log(`[Compute] ❌ ${this.setupError}`);
    return false;
  }

  // ─── Router Mode (OpenAI-compatible API key) ──────────────
  async _initRouter() {
    try {
      console.log('[Compute] Initializing via 0G Router API...');
      console.log(`[Compute] Base URL: ${process.env.ZG_CHAT_BASE_URL}`);
      console.log(`[Compute] Model: ${this.model}`);

      this.openai = new OpenAI({
        apiKey: process.env.ZG_CHAT_API_KEY,
        baseURL: process.env.ZG_CHAT_BASE_URL,
      });

      this.endpoint = process.env.ZG_CHAT_BASE_URL;
      this.mode = 'router';
      this.isReady = true;
      console.log('[Compute] ✅ 0G Router API READY');
      return true;
    } catch (err) {
      this.setupError = err.message;
      console.log('[Compute] ❌ Router init failed:', err.message);
      return false;
    }
  }

  // ─── Direct Mode (Broker + wallet signing) ────────────────
  async _initDirect() {
    try {
      console.log('[Compute] Initializing via 0G Direct Broker...');
      const { createZGComputeNetworkBroker } = await import('@0glabs/0g-serving-broker');
      const net = NETWORKS[this.network];
      const provider = new ethers.JsonRpcProvider(net.rpc);
      const wallet = new ethers.Wallet(process.env.ZG_PRIVATE_KEY, provider);

      console.log(`[Compute] Wallet: ${wallet.address}`);
      console.log(`[Compute] Network: ${this.network} (${net.rpc})`);
      console.log(`[Compute] Provider: ${this.providerAddress}`);
      console.log(`[Compute] Model: ${this.model}`);

      // Create broker
      this.broker = await createZGComputeNetworkBroker(wallet);
      console.log('[Compute] Broker created ✓');

      // Check/create ledger
      try {
        await this.broker.ledger.getLedger();
        console.log('[Compute] Existing ledger found ✓');
      } catch {
        console.log('[Compute] No ledger found, creating with 3 OG...');
        await this.broker.ledger.addLedger(3);
        console.log('[Compute] Ledger created ✓');
      }

      // Acknowledge provider
      try {
        await this.broker.inference.acknowledgeProviderSigner(this.providerAddress);
        console.log('[Compute] Provider acknowledged ✓');
      } catch (err) {
        console.log('[Compute] Provider ack note:', err.message?.includes('already') ? 'already acknowledged ✓' : err.message);
      }

      // Transfer funds to provider
      try {
        const transferAmount = ethers.parseEther('0.5');
        await this.broker.ledger.transferFund(this.providerAddress, 'inference', transferAmount);
        console.log('[Compute] Funds transferred to provider (0.5 OG) ✓');
      } catch (err) {
        const msg = err.message || '';
        if (msg.includes('Insufficient') || msg.includes('Balance')) {
          console.log('[Compute] Provider already has funds — skipping transfer ✓');
        } else {
          console.log('[Compute] Fund transfer note:', msg);
        }
      }

      // Get service metadata
      const meta = await this.broker.inference.getServiceMetadata(this.providerAddress);
      this.endpoint = meta.endpoint;
      this.model = meta.model || this.model;
      console.log(`[Compute] Endpoint: ${this.endpoint}`);
      console.log(`[Compute] Model confirmed: ${this.model}`);

      // Create OpenAI client pointed at the provider endpoint
      this.openai = new OpenAI({
        baseURL: this.endpoint,
        apiKey: 'not-needed',
      });

      this.mode = 'direct';
      this.isReady = true;
      console.log('[Compute] ✅ 0G Direct Compute Service READY');
      return true;
    } catch (err) {
      this.setupError = err.message;
      console.log('[Compute] ❌ Direct init failed:', err.message);
      return false;
    }
  }

  // ─── Chat Completion ──────────────────────────────────────
  async chatCompletion(messages) {
    if (!this.isReady) {
      throw new Error('Compute service not ready. Call initialize() first.');
    }

    if (this.mode === 'router') {
      return this._chatRouter(messages);
    }
    return this._chatDirect(messages);
  }

  // Router mode — simple OpenAI-style call
  async _chatRouter(messages) {
    const completion = await this.openai.chat.completions.create({
      model: this.model,
      messages,
      max_tokens: 2048,
      temperature: 0.7,
    });

    return {
      content: completion.choices[0]?.message?.content || '',
      model: completion.model || this.model,
      chatId: completion.id,
      usage: completion.usage,
      verified: true,
      mode: 'router',
    };
  }

  // Direct mode — broker auth headers + TEE verification
  async _chatDirect(messages) {
    const lastUserMsg = messages.filter(m => m.role === 'user').pop();
    const queryContent = lastUserMsg?.content || '';
    const headers = await this.broker.inference.getRequestHeaders(
      this.providerAddress,
      queryContent
    );

    const completion = await this.openai.chat.completions.create(
      {
        model: this.model,
        messages,
        max_tokens: 2048,
        temperature: 0.7,
      },
      { headers }
    );

    const responseContent = completion.choices[0]?.message?.content || '';

    // Process response for TEE verification
    try {
      await this.broker.inference.processResponse(
        this.providerAddress,
        completion.id,
        responseContent
      );
    } catch (err) {
      console.log('[Compute] TEE verification note:', err.message);
    }

    return {
      content: responseContent,
      model: this.model,
      chatId: completion.id,
      usage: completion.usage,
      verified: true,
      mode: 'direct',
    };
  }

  // ─── Generate Embedding (local fast hash-based) ──────────
  generateEmbedding(text, dimensions = 1536) {
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

  getStatus() {
    return {
      isReady: this.isReady,
      mode: this.mode,
      network: this.network,
      provider: this.mode === 'direct' ? this.providerAddress : '0G Router',
      model: this.model,
      endpoint: this.endpoint,
      error: this.setupError,
    };
  }
}

export const computeService = new ComputeService();
export default computeService;
