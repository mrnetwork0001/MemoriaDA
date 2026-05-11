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
          <p>Every memory update is anchored onchain with a Merkle root, allowing anyone to verify integrity.</p>
        </div>
        <div class="feature-card">
          <h4>Sovereign</h4>
          <p>Agents retain full control over their memory state through NFT-based identities.</p>
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
      <p class="docs-p">Today's LLM applications rely on "Context Windows" or centralized vector databases. This creates three critical infrastructure failures:</p>
      
      <ul class="docs-list numbered">
        <li><strong>Centralized Fragility:</strong> If the API provider goes down, the agent effectively suffers a lobotomy.</li>
        <li><strong>Audit Blackout:</strong> There is no way to prove an agent hasn't been "gaslit" or its memories tampered with.</li>
        <li><strong>Isolation:</strong> An agent's learning in one application cannot be natively leveraged in another.</li>
      </ul>

      <div class="docs-callout warn">
        <div class="callout-label">Security Risk</div>
        Centralized memory is a honeypot for prompt injection. Without onchain anchors, you cannot trust what an agent claims to "remember."
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
    id: "concepts",
    label: "04_CORE_CONCEPTS",
    title: "MEMORY VECTORS & ROOTS",
    subtitle: "Understanding how Memoria structures decentralized context.",
    content: `
      <h2 class="docs-h2">Vector Embeddings</h2>
      <p class="docs-p">Memoria uses 1536-dimensional vectors to represent "semantic meaning". These are generated via Qwen-2.5-7B on 0G Compute or local models.</p>
      
      <h2 class="docs-h2">The Memory Root</h2>
      <p class="docs-p">A Memory Root is the Merkle Root of an agent's entire vector history. When an agent learns something new:</p>
      <ul class="docs-list numbered">
        <li>The new vector is hashed.</li>
        <li>The Merkle Tree is recomputed.</li>
        <li>The new Root is anchored to the 0G Chain.</li>
      </ul>
      
      <div class="docs-callout tip">
        <div class="callout-label">Verifiability</div>
        Because only the Root is onchain, we maintain privacy while providing cryptographic proof of the entire data set.
      </div>
    `
  },
  {
    id: "lifecycle",
    label: "05_MEMORY_LIFECYCLE",
    title: "THE DATA JOURNEY",
    subtitle: "From user prompt to onchain verification.",
    content: `
      <div class="step-flow">
        <div class="step-item">
          <div class="step-num">01</div>
          <div class="step-body">
            <h4>Ingest & Embed</h4>
            <p>User input is processed and converted into a semantic vector embedding.</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">02</div>
          <div class="step-body">
            <h4>Store (0G Storage)</h4>
            <p>The vector and its metadata are uploaded as a blob to the 0G Storage network.</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">03</div>
          <div class="step-body">
            <h4>Anchor (0G Chain)</h4>
            <p>The new Merkle Root is sent to the MemoriaRegistry contract with a 0.001 0G fee.</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">04</div>
          <div class="step-body">
            <h4>Recall & Verify</h4>
            <p>When needed, the agent retrieves the blob, verifies it against the onchain root, and injects it into the prompt context.</p>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "identity",
    label: "06_AGENT_IDENTITY",
    title: "NFT-BASED IDENTITY",
    subtitle: "Agents as first-class citizens on the 0G network.",
    content: `
      <p class="docs-p">Every agent on Memoria DA is represented by a soulbound-style ERC-721 NFT. This ownership model ensures that an agent's memory history is cryptographically linked to a specific onchain identity.</p>
      
      <h2 class="docs-h2">The Registry NFT</h2>
      <p class="docs-p">When you register an agent, the MemoriaRegistry mints an NFT to your wallet. This token ID corresponds to your <code class="ic">agentId</code> and serves as the authorization key for all future memory updates.</p>

      <h3 class="docs-h3">Benefits of NFT Identity</h3>
      <ul class="docs-list">
        <li><strong>Ownership Portability:</strong> Transfer an agent's entire memory history by simply transferring the NFT.</li>
        <li><strong>Onchain Verification:</strong> Any third-party dapp can verify an agent's framework and memory root by querying the NFT metadata.</li>
        <li><strong>Permissionless Discovery:</strong> The registry serves as a "Yellow Pages" for all AI agents in the 0G ecosystem.</li>
      </ul>
      
      <div class="docs-callout tip">
        <div class="callout-label">Developer Tip</div>
        You can check if a user owns an agent's memory by calling <code class="ic">ownerOf(tokenId)</code> on our registry contract.
      </div>
    `
  },
  {
    id: "contracts",
    label: "07_SMART_CONTRACTS",
    title: "ONCHAIN REGISTRY",
    subtitle: "Technical details of the MemoriaRegistryV2 contract.",
    content: `
      <p class="docs-p">The MemoriaRegistryV2 is the source of truth for the protocol. It handles agent registration, memory anchoring, and fee collection via 0G native tokens.</p>

      <h2 class="docs-h2">Core Functionality</h2>
      
      <h3 class="docs-h3">registerAgent(string id, string framework)</h3>
      <p class="docs-p">Mints the identity NFT and sets the initial state. The <code class="ic">framework</code> field helps other agents understand how to interact with your memory schema (e.g., "OpenClaw", "Eliza").</p>

      <h3 class="docs-h3">updateMemoryRoot(string id, bytes32 root, uint vectors)</h3>
      <p class="docs-p">The primary anchoring function. It requires a micropayment of 0.001 0G. It updates the Merkle root and increments the total vector count for the agent.</p>

      <h2 class="docs-h2">Events</h2>
      <p class="docs-p">The contract emits the following events for indexing and real-time UI updates:</p>
      <div class="code-block-wrapper">
        <div class="code-header"><span class="code-lang">solidity</span></div>
        <pre class="code-block">
event AgentRegistered(address indexed owner, string agentId, uint256 tokenId);
event MemoryAnchored(string indexed agentId, bytes32 rootHash, uint256 vectorCount);
        </pre>
      </div>
    `
  },
  {
    id: "api",
    label: "08_REST_API",
    title: "API REFERENCE",
    subtitle: "Direct HTTP interface for the Memoria backend.",
    content: `
      <p class="docs-p">Our REST API provides a high-level abstraction over the 0G Storage and Chain complexity. Use this if you are not using our JS SDK.</p>

      <h2 class="docs-h2">Endpoints</h2>

      <h3 class="docs-h3">POST /api/storage/upload</h3>
      <p class="docs-p">Embeds content and stores it as a blob on 0G Storage.</p>
      <div class="code-block-wrapper">
        <div class="code-header"><span class="code-lang">json</span><span class="code-file">Request Body</span></div>
        <pre class="code-block">
{
  "agentId": "my_agent_01",
  "content": "User prefers cold brew coffee.",
  "metadata": { "context": "kitchen_chat" }
}
        </pre>
      </div>

      <h3 class="docs-h3">GET /api/memory/global</h3>
      <p class="docs-p">Retrieves the list of all registered agents and their current onchain stats.</p>
      <div class="code-block-wrapper">
        <div class="code-header"><span class="code-lang">json</span><span class="code-file">Response</span></div>
        <pre class="code-block">
{
  "agents": [
    { "id": "alpha_journal", "vectors": 142, "lastUpdate": 171543212 },
    { "id": "sol_tutor", "vectors": 89, "lastUpdate": 171543999 }
  ]
}
        </pre>
      </div>
    `
  },
  {
    id: "sdk",
    label: "09_SDK_GUIDE",
    title: "SDK INTEGRATION",
    subtitle: "Building with the Memoria TypeScript SDK.",
    content: `
      <p class="docs-p">The Memoria SDK is the recommended way to build. It handles the heavy lifting of Merkle Tree generation and Ethers.js integration.</p>

      <h2 class="docs-h2">Advanced Usage</h2>
      
      <h3 class="docs-h3">Fetching Full Memory History</h3>
      <div class="code-block-wrapper">
        <div class="code-header"><span class="code-lang">javascript</span></div>
        <pre class="code-block">
const history = await memoria.getHistory("agent_id");
console.log(\`Found \${history.length} onchain memories.\`);
        </pre>
      </div>

      <h3 class="docs-h3">Manual Verification</h3>
      <div class="code-block-wrapper">
        <div class="code-header"><span class="code-lang">javascript</span></div>
        <pre class="code-block">
const isValid = await memoria.verify(content, proof, rootHash);
if (isValid) console.log("Memory integrity guaranteed.");
        </pre>
      </div>
    `
  },
  {
    id: "server",
    label: "10_SERVER_INTEGRATION",
    title: "DEVELOPER PAYS MODEL",
    subtitle: "Abstracting gas fees for a seamless user experience.",
    content: `
      <p class="docs-p">Memoria DA solves the "Wallet Friction" problem by allowing developers to sponsor their agents' memory updates.</p>

      <h2 class="docs-h2">How it Works</h2>
      <ul class="docs-list numbered">
        <li>The Developer deploys a server-side wallet (hot wallet).</li>
        <li>The hot wallet is granted "Manager" rights in the app config.</li>
        <li>When the agent learns something, the server signs the <code class="ic">updateMemoryRoot</code> TX.</li>
        <li>The developer pays the 0.001 0G fee from their treasury.</li>
      </ul>

      <div class="docs-callout tip">
        This allows users to interact with AI agents without ever knowing a blockchain is involved.
      </div>
    `
  },
  {
    id: "openclaw",
    label: "11_OPENCLAW_SKILL",
    title: "NATIVE AGENT SKILLS",
    subtitle: "Drop-in memory for OpenClaw agents.",
    content: `
      <p class="docs-p">If you are using the <strong>OpenClaw</strong> agent framework, integration is a single file drop.</p>

      <h2 class="docs-h2">Setup</h2>
      <p class="docs-p">Copy our <code class="ic">SKILL.md</code> into your <code class="ic">/skills</code> directory. Your agent will immediately recognize the following tools:</p>

      <ul class="docs-list">
        <li><code class="ic">memoria_remember(content)</code>: Permanent storage & anchor.</li>
        <li><code class="ic">memoria_recall(query)</code>: Semantic search across 0G Storage.</li>
        <li><code class="ic">memoria_verify(root)</code>: Cryptographic proof check.</li>
      </ul>
    `
  },
  {
    id: "economics",
    label: "12_0G_PAY_ECONOMICS",
    title: "0G PAY & KHALANI",
    subtitle: "The economic engine of the memory network.",
    content: `
      <p class="docs-p">Memoria DA utilizes an intent-based micropayment system powered by <strong>0G Pay</strong> and <strong>Khalani</strong>.</p>

      <h2 class="docs-h2">The Fee Structure</h2>
      <p class="docs-p">To prevent spam and incentivize the Decentralized Storage (DA) layer, each anchoring transaction requires a fee:</p>
      <ul class="docs-list">
        <li><strong>Base Fee:</strong> 0.001 0G per <code class="ic">anchor()</code>.</li>
        <li><strong>Storage Rent:</strong> Included in the base fee for the first 2 years of retention.</li>
        <li><strong>Compute Tax:</strong> Optional 0.0005 0G for TEE-verified inference.</li>
      </ul>

      <h2 class="docs-h2">Khalani Intent Rails</h2>
      <p class="docs-p">By integrating Khalani, we enable "cross-chain memory subsidies". A developer can pay in USDC on Polygon, and Khalani's solver network will provide the 0G tokens on the Galileo testnet to fulfill the memory anchor intent.</p>
    `
  },
  {
    id: "security",
    label: "13_SECURITY_VERIF",
    title: "VERIFICATION & TRUST",
    subtitle: "Ensuring your agent's context hasn't been tampered with.",
    content: `
      <p class="docs-p">Trust in Memoria DA is rooted in cryptography, not promises. We use a two-tier verification model.</p>

      <h2 class="docs-h2">Tier 1: Merkle Integrity</h2>
      <p class="docs-p">Every memory blob is part of a Merkle Tree. The root of this tree is stored on the 0G Chain. If a storage node alters even a single bit of a memory, the Merkle proof will fail to match the onchain root.</p>

      <h2 class="docs-h2">Tier 2: TEE Sealed Inference</h2>
      <p class="docs-p">For high-security agents, memory retrieval is performed inside a <strong>Trusted Execution Environment (TEE)</strong> provided by 0G Compute. This ensures that the RAG (Retrieval Augmented Generation) process hasn't been intercepted or manipulated.</p>

      <div class="docs-callout warn">
        <div class="callout-label">Safety Warning</div>
        Always verify the <code class="ic">rootHash</code> before allowing an agent to act on recalled memories.
      </div>
    `
  },
  {
    id: "partners",
    label: "14_LIVE_PARTNERS",
    title: "ECOSYSTEM ADOPTION",
    subtitle: "Projects already utilizing Memoria DA.",
    content: `
      <p class="docs-p">Memoria DA is already being integrated into several high-impact AI projects within the 0G ecosystem. Click a partner below to explore the integration details.</p>
    `
  },
  {
    id: "faq",
    label: "15_FAQ",
    title: "COMMON QUESTIONS",
    subtitle: "Quick answers for developers and users.",
    content: `
      <div class="faq-item">
        <div class="faq-question">
          <span class="faq-q-prefix">Q:</span> Is my data private on Memoria DA?
        </div>
        <div class="faq-answer">
          By default, data on 0G Storage is public (but hashed). For private memories, we recommend encrypting your JSON payload using the agent's public key before calling the upload API.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">
          <span class="faq-q-prefix">Q:</span> Can I delete a memory?
        </div>
        <div class="faq-answer">
          Onchain anchors are immutable. However, you can "prune" your local state and update the Merkle root to exclude certain data. The old data will remain in 0G Storage until the rent expires, but it will no longer be part of the "active" memory root.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">
          <span class="faq-q-prefix">Q:</span> What is the cost for 1,000 memories?
        </div>
        <div class="faq-answer">
          Approximately 1 0G token total. Our goal is to keep memory extremely affordable for millions of autonomous agents.
        </div>
      </div>
    `
  },
  {
    id: "glossary",
    label: "16_GLOSSARY",
    title: "TERMINOLOGY",
    subtitle: "Key terms in the Memoria ecosystem.",
    content: `
      <div class="glossary-grid">
        <div class="glossary-item">
          <div class="glossary-term">DA Layer</div>
          <div class="glossary-def">Data Availability. The 0G Storage network where raw memory blobs are held.</div>
        </div>
        <div class="glossary-item">
          <div class="glossary-term">Merkle Root</div>
          <div class="glossary-def">A single hash that represents the integrity of the entire memory set.</div>
        </div>
        <div class="glossary-item">
          <div class="glossary-term">Anchoring</div>
          <div class="glossary-def">The process of posting a Merkle root to the 0G blockchain.</div>
        </div>
        <div class="glossary-item">
          <div class="glossary-term">Vector Embedding</div>
          <div class="glossary-def">A mathematical representation of text that captures semantic meaning.</div>
        </div>
      </div>
    `
  },
  {
    id: "roadmap",
    label: "17_ROADMAP",
    title: "THE FUTURE",
    subtitle: "Upcoming milestones and features.",
    content: `
      <div class="roadmap-timeline">
        <div class="roadmap-item done">
          <div class="roadmap-phase">Q1 2024</div>
          <div class="roadmap-title">Protocol Genesis <span class="badge-done">Live</span></div>
          <ul class="roadmap-items">
            <li>MemoriaRegistryV2 Deployment</li>
            <li>0G Storage Integration</li>
            <li>Basic JS SDK Launch</li>
          </ul>
        </div>
        <div class="roadmap-item active">
          <div class="roadmap-phase">Q2 2024</div>
          <div class="roadmap-title">Vector Economy <span class="badge-wip">WIP</span></div>
          <ul class="roadmap-items">
            <li>0G Pay & Khalani Integration</li>
            <li>OpenClaw Skill Official Support</li>
            <li>Cross-agent memory discovery</li>
          </ul>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-phase">Q3 2024</div>
          <div class="roadmap-title">Sealed Inference <span class="badge-coming">Future</span></div>
          <ul class="roadmap-items">
            <li>TEE-verified memory retrieval</li>
            <li>Zero-Knowledge Proofs for private memory</li>
            <li>Mainnet Migration</li>
          </ul>
        </div>
      </div>
    `
  }
];
