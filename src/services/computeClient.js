// ============================================================
// Compute Client — Frontend bridge to 0G Compute backend
// ============================================================

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

class ComputeClient {
  constructor() {
    this._status = null;
    this._statusChecked = false;
  }

  // ─── Check backend status ──────────────────────────────────

  async getStatus() {
    try {
      const res = await fetch(`${BACKEND_URL}/api/compute/status`);
      this._status = await res.json();
      this._statusChecked = true;
      return this._status;
    } catch {
      this._status = { isReady: false, error: 'Backend unreachable' };
      this._statusChecked = true;
      return this._status;
    }
  }

  get isAvailable() {
    return this._status?.isReady === true;
  }

  get isChecked() {
    return this._statusChecked;
  }

  // ─── Chat with agent via 0G Compute ────────────────────────

  async chatWithAgent(messages) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/compute/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Backend returned ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.error('[ComputeClient] Chat error:', err.message);
      throw err;
    }
  }

  // ─── Generate embedding via backend ────────────────────────

  async generateEmbedding(text, dimensions = 1536) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/compute/embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, dimensions }),
      });

      if (!res.ok) {
        throw new Error(`Embedding request failed (${res.status})`);
      }

      const data = await res.json();
      return data.embedding;
    } catch (err) {
      console.warn('[ComputeClient] Embedding fallback to local:', err.message);
      return null; // Caller should fall back to local embedding
    }
  }
}

export const computeClient = new ComputeClient();
export default computeClient;
