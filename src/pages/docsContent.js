/* ── Documentation Content Data ── */

export const DOCS_SECTIONS = [
  {
    id: "intro",
    label: "01_INTRODUCTION",
    title: "THE MEMORIA PROTOCOL",
    subtitle: "A decentralized memory standard for the AI Agent economy.",
    content: `
      <p class="docs-p">Memoria DA is a high-performance Decentralized Asynchronous (DA) memory layer built natively on 0G Labs. It provides AI agents with a "Neural Link" to permanent, verifiable, and cross-framework storage.</p>
      
      <div class="docs-callout">
        <div class="callout-label">Vision</div>
        In the future, agents will be autonomous entities. For an agent to have a persistent identity and personality, it must have a memory that it owns—one that cannot be deleted by a centralized provider.
      </div>

      <h2 class="docs-h2">Core Pillars</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <h4>Permanent</h4>
          <p>Memories are stored as blobs on 0G Storage, ensuring they exist as long as the network does.</p>
        </div>
        <div class="feature-card">
          <h4>Verifiable</h4>
          <p>Every memory update is anchored on-chain with a Merkle root, allowing anyone to verify integrity.</p>
        </div>
        <div class="feature-card">
          <h4>Sovereign</h4>
          <p>Agents (via their owners) retain full control over their memory state through NFT-based identities.</p>
        </div>
      </div>
    `
  },
  {
    id: "problem",
    label: "02_THE_PROBLEM",
    title: "AI AMNESIA & FRAGILITY",
    subtitle: "Why centralized vector databases are failing the agentic future.",
    content: `
      <p class="docs-p">Today's LLM applications rely on "Context Windows" or centralized vector databases (Pinecone, Weaviate). This creates three critical infrastructure failures:</p>
      
      <ul class="docs-list numbered">
        <li><strong>Centralized Fragility:</strong> If the API provider goes down or changes pricing, the agent effectively suffers a lobotomy.</li>
        <li><strong>Audit Blackout:</strong> There is no way to prove an agent hasn't been "gaslit" or its memories tampered with by the database owner.</li>
        <li><strong>Isolation:</strong> An agent's learning in one application cannot be natively leveraged in another without complex migrations.</li>
      </ul>

      <div class="docs-callout warn">
        <div class="callout-label">Security Risk</div>
        Centralized memory is a honeypot for prompt injection and memory manipulation. Without on-chain anchors, you cannot trust what an agent claims to "remember."
      </div>
    `
  },
  {
    id: "architecture",
    label: "03_ARCHITECTURE",
    title: "THE TRIPLE-G STACK",
    subtitle: "Native integration with 0G Storage, Chain, and Compute.",
    content: `
      <p class="docs-p">Memoria DA leverages the full 0G modular stack to create a trustless memory cycle.</p>
      
      <div class="ascii-diagram">
+-------------------------------------------------------+
|                   AI AGENT LAYER                      |
|      (OpenClaw, Eliza, Autonolas, LangChain)          |
+---------------------------+---------------------------+
                            |
             (1) Query      |      (4) Context
                            v
+---------------------------+---------------------------+
|                  MEMORIA DA API                       |
|        (Embeddings, Retrieval, Verification)          |
+-------+-------------------+-------------------+-------+
        |                   |                   |
        | (2) Blob          | (3) Anchor        | (5) TEE
        v                   v                   v
+---------------+   +---------------+   +---------------+
|  0G STORAGE   |   |    0G CHAIN   |   |   0G COMPUTE  |
| (Data Layer)  |   | (Audit Layer) |   | (Trust Layer) |
+---------------+   +---------------+   +---------------+
      </div>

      <h2 class="docs-h2">Layer Responsibilities</h2>
      <table class="docs-table">
        <thead>
          <tr><th>Layer</th><th>Technology</th><th>Function</th></tr>
        </thead>
        <tbody>
          <tr><td class="td-code">Data</td><td>0G Storage</td><td>Stores raw 1536-dim vector embeddings as blobs.</td></tr>
          <tr><td class="td-code">Audit</td><td>0G Chain</td><td>Anchors Merkle roots in the MemoriaRegistry contract.</td></tr>
          <tr><td class="td-code">Trust</td><td>0G Compute</td><td>Ensures memory retrieval logic is executed in a TEE.</td></tr>
        </tbody>
      </table>
    `
  },
  {
    id: "integration",
    label: "04_QUICKSTART",
    title: "DEVELOPER QUICKSTART",
    subtitle: "Integrate decentralized memory in less than 5 minutes.",
    content: `
      <p class="docs-p">The easiest way to get started is using our high-level JS SDK.</p>

      <h3 class="docs-h3">1. Installation</h3>
      <div class="code-block-wrapper">
        <div class="code-header"><span class="code-lang">bash</span></div>
        <pre class="code-block">npm install @memoriada/sdk ethers</pre>
      </div>

      <h3 class="docs-h3">2. Store & Anchor</h3>
      <div class="code-block-wrapper">
        <div class="code-header"><span class="code-lang">javascript</span><span class="code-file">index.js</span></div>
        <pre class="code-block">
import { MemoriaSDK } from '@memoriada/sdk';

const memoria = new MemoriaSDK({
  apiKey: 'YOUR_API_KEY',
  network: 'galileo-testnet'
});

// Store memory and anchor it on-chain
const result = await memoria.remember({
  agentId: "agent_0xClaw",
  content: "User likes high-risk DeFi strategies."
});

console.log("Root Anchored:", result.rootHash);
        </pre>
      </div>
    `
  },
  {
    id: "api",
    label: "08_API_REFERENCE",
    title: "REST API REFERENCE",
    subtitle: "Direct HTTP interface for non-JS environments.",
    content: `
      <h2 class="docs-h2">Storage Endpoints</h2>
      
      <h3 class="docs-h3">POST /api/storage/upload</h3>
      <p class="docs-p">Uploads raw memory content and generates a 0G Storage blob.</p>
      
      <div class="docs-table-wrapper">
        <table class="docs-table">
          <tr><th>Param</th><th>Type</th><th>Description</th></tr>
          <tr><td>agentId</td><td>String</td><td>Unique ID of the agent</td></tr>
          <tr><td>content</td><td>String</td><td>Text to be embedded and stored</td></tr>
        </table>
      </div>

      <h3 class="docs-h3">POST /api/registry/anchor</h3>
      <p class="docs-p">Anchors a Merkle root hash on the 0G Galileo Testnet.</p>

      <div class="docs-callout tip">
        <div class="callout-label">Fee Note</div>
        Each anchor call requires a 0.001 0G fee, which is automatically deducted from your developer credits.
      </div>
    `
  },
  {
    id: "faq",
    label: "15_FAQ",
    title: "FREQUENTLY ASKED QUESTIONS",
    subtitle: "Common queries from the developer community.",
    content: `
      <div class="docs-list">
        <li>
          <strong>Is my data private?</strong><br/>
          Raw data is stored in 0G blobs. For sensitive data, we recommend encrypting the content before calling the upload API.
        </li>
        <li>
          <strong>What is the latency?</strong><br/>
          Storage upload is sub-second. Chain anchoring depends on block times (approx 2-6 seconds on Galileo).
        </li>
        <li>
          <strong>Can I use my own vector DB?</strong><br/>
          Yes! You can use Memoria as a "proof-of-memory" layer while keeping your existing DB for hot-retrieval.
        </li>
      </div>
    `
  }
];
