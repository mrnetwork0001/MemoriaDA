// ============================================================
// Memory Store — Local index for similarity search + persistence
// ============================================================

const STORAGE_KEY = 'memoria_memory_index';

class MemoryStore {
  constructor() {
    this.memories = [];
    this._load();
  }

  // ─── Load from localStorage ────────────────────────────────

  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.memories = JSON.parse(raw);
        console.log(`[MemoryStore] Loaded ${this.memories.length} memories from local storage`);
      }
    } catch {
      this.memories = [];
    }
  }

  _save() {
    try {
      // Only store last 200 memories to avoid localStorage limits
      const toSave = this.memories.slice(-200);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (err) {
      console.warn('[MemoryStore] Save failed:', err.message);
    }
  }

  // ─── Add a memory ─────────────────────────────────────────

  addMemory({ rootHash, content, embedding, metadata, agentId }) {
    const memory = {
      id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      rootHash,
      content,
      embedding,
      agentId: agentId || 'agent_0xClaw_7f3a',
      timestamp: new Date().toISOString(),
      metadata: metadata || {},
    };

    this.memories.push(memory);
    this._save();
    return memory;
  }

  // ─── Cosine similarity ────────────────────────────────────

  _cosineSimilarity(a, b) {
    if (!a || !b || a.length !== b.length) return 0;
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  }

  // ─── Search memories by similarity ─────────────────────────

  search(queryEmbedding, topK = 5) {
    if (!queryEmbedding || this.memories.length === 0) return [];

    const scored = this.memories
      .filter(m => m.embedding && m.embedding.length > 0)
      .map(m => ({
        ...m,
        similarity: this._cosineSimilarity(queryEmbedding, m.embedding),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);

    return scored;
  }

  // ─── Get all memories (for timeline) ───────────────────────

  getAll() {
    return [...this.memories].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }

  // ─── Get total count ──────────────────────────────────────

  get count() {
    return this.memories.length;
  }

  // ─── Clear all memories ────────────────────────────────────

  clear() {
    this.memories = [];
    localStorage.removeItem(STORAGE_KEY);
  }

  // ─── Build context string from retrieved memories ──────────
  
  buildContextPrompt(retrievedMemories) {
    if (!retrievedMemories || retrievedMemories.length === 0) return '';

    const lines = retrievedMemories.map((m, i) => {
      const time = new Date(m.timestamp).toLocaleString();
      const sim = (m.similarity * 100).toFixed(1);
      return `[Memory ${i + 1} | ${time} | relevance: ${sim}%]\n${m.content}`;
    });

    return `You have access to the following memories from previous conversations stored on 0G decentralized storage:\n\n${lines.join('\n\n')}\n\nUse these memories to provide context-aware, personalized responses. Reference specific memories when relevant.`;
  }
}

export const memoryStore = new MemoryStore();
export default memoryStore;
