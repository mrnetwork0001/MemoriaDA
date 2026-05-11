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
      <p class="docs-p">Every agent on Memoria DA is represented by an ERC-721 NFT. This ownership model ensures that only the authorized owner can update an agent's memory.</p>
      
      <h3 class="docs-h3">Registration Process</h3>
      <p class="docs-p">Call <code class="ic">registerAgent(id, framework)</code> on the registry. This mints a unique NFT and initializes your memory root at 0x0.</p>
      
      <div class="docs-callout">
        <div class="callout-label">Agent ID Format</div>
        Recommended: <code class="ic">agent_[name]_[framework]</code> (e.g., <code class="ic">agent_claw_openclaw</code>).
      </div>
    `
  },
  {
    id: "contracts",
    label: "07_SMART_CONTRACTS",
    title: "ONCHAIN REGISTRY",
    subtitle: "Technical details of the MemoriaRegistryV2 contract.",
    content: `
      <h2 class="docs-h2">Deployment Info</h2>
      <table class="docs-table">
        <tr><td>Network</td><td>0G Galileo Testnet</td></tr>
        <tr><td>Chain ID</td><td>16602</td></tr>
        <tr><td>Contract</td><td class="td-code">0x85d31A4a95035...b7f3</td></tr>
      </table>

      <h2 class="docs-h2">Key Functions (ABI)</h2>
      <div class="code-block-wrapper">
        <div class="code-header"><span class="code-lang">solidity</span></div>
        <pre class="code-block">
function registerAgent(string id, string fw) external;
function updateMemoryRoot(string id, bytes32 root, uint vectors) external payable;
function verifyMemoryRoot(string id, bytes32 root) external view returns (bool isValid, bytes32 storedRoot);
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
      <h3 class="docs-h3">POST /api/storage/upload</h3>
      <p class="docs-p">Uploads memory to 0G Storage.</p>
      <div class="code-block-wrapper">
        <div class="code-header"><span class="code-lang">json</span><span class="code-file">Request Body</span></div>
        <pre class="code-block">{ "agentId": "string", "content": "string" }</pre>
      </div>

      <h3 class="docs-h3">POST /api/registry/anchor</h3>
      <p class="docs-p">Triggers onchain anchoring.</p>
    `
  },
  {
    id: "sdk",
    label: "09_SDK_GUIDE",
    title: "SDK QUICKSTART",
    subtitle: "Integrating Memoria in 3 steps.",
    content: `
      <h3 class="docs-h3">1. Install</h3>
      <div class="code-block-wrapper"><pre class="code-block">npm install @memoriada/sdk</pre></div>
      <h3 class="docs-h3">2. Initialize</h3>
      <h3 class="docs-h3">3. Remember</h3>
    `
  },
  {
    id: "server",
    label: "10_SERVER_INTEGRATION",
    title: "DEVELOPER PAYS MODEL",
    subtitle: "Abstracting gas fees for a seamless user experience.",
    content: `
      <p class="docs-p">To provide a Web2-like experience, we use a "Developer Pays" model via 0G Pay. The agent owner deposits 0G tokens into the registry, and the backend signs transactions on the agent's behalf.</p>
      <div class="docs-callout tip">
        Users never need a wallet to interact with your agent; they only need your application.
      </div>
    `
  },
  {
    id: "openclaw",
    label: "11_OPENCLAW_SKILL",
    title: "NATIVE AGENT SKILLS",
    subtitle: "Drop-in memory for OpenClaw agents.",
    content: `
      <p class="docs-p">MemoriaDA ships an official SKILL.md for the OpenClaw framework. Simply add the skill to your agent's directory to enable persistent memory.</p>
    `
  },
  {
    id: "economics",
    label: "12_0G_PAY_ECONOMICS",
    title: "0G PAY & KHALANI",
    subtitle: "The economic engine of the memory network.",
    content: `
      <p class="docs-p">We utilize 0G Pay and Khalani's intent-based rails to handle micro-payments. Each memory anchor costs 0.001 0G, which incentivizes storage nodes and maintainers.</p>
    `
  },
  {
    id: "security",
    label: "13_SECURITY_VERIF",
    title: "VERIFICATION & TRUST",
    subtitle: "Ensuring your agent's context hasn't been tampered with.",
    content: `
      <p class="docs-p">Merkle Proofs combined with 0G Compute TEEs ensure that retrieved memory is exactly what was stored. If a storage node attempts to serve false data, the cryptographic verification fails immediately.</p>
    `
  },
  {
    id: "partners",
    label: "14_LIVE_PARTNERS",
    title: "ECOSYSTEM ADOPTION",
    subtitle: "Projects already utilizing Memoria DA.",
    content: `
      <div class="feature-grid">
        <div class="feature-card">
          <h4>AlphaJournal</h4>
          <p>Decentralized trading diary with verifiable thesis history.</p>
        </div>
        <div class="feature-card">
          <h4>SolTutor</h4>
          <p>AI mentor that remembers student progress across session resets.</p>
        </div>
      </div>
    `
  },
  {
    id: "faq",
    label: "15_FAQ",
    title: "COMMON QUESTIONS",
    subtitle: "Quick answers for developers.",
    content: `
      <p><strong>Is it open source?</strong> Yes, the registry and SDK are fully MIT licensed.</p>
      <p><strong>Which chains are supported?</strong> Currently 0G Galileo Testnet. Mainnet support coming soon.</p>
    `
  },
  {
    id: "glossary",
    label: "16_GLOSSARY",
    title: "TERMINOLOGY",
    subtitle: "Key terms in the Memoria ecosystem.",
    content: `
      <div class="glossary-grid">
        <div class="glossary-item"><div class="glossary-term">DA Layer</div><div class="glossary-def">Data Availability layer (0G Storage).</div></div>
        <div class="glossary-item"><div class="glossary-term">Root Hash</div><div class="glossary-def">The Merkle Root of an agent's memory tree.</div></div>
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
        <div class="roadmap-item done"><div class="roadmap-phase">Phase 1</div><div class="roadmap-title">Protocol Genesis <span class="badge-done">Live</span></div></div>
        <div class="roadmap-item active"><div class="roadmap-phase">Phase 2</div><div class="roadmap-title">Vector Economy <span class="badge-wip">In Progress</span></div></div>
      </div>
    `
  }
];
