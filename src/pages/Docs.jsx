import React from 'react';
import './Docs.css';
import { Link } from 'react-router-dom';

const Docs = () => {
  return (
    <div className="docs-page">
      <div className="docs-sidebar">
        <div className="sidebar-brand heading-font">MEMORIA_DA // DOCS</div>
        <nav className="sidebar-nav terminal-font">
          <a href="#intro">01_INTRODUCTION</a>
          <a href="#problem">02_THE_PROBLEM</a>
          <a href="#architecture">03_ARCHITECTURE</a>
          <a href="#integration">04_QUICKSTART</a>
          <a href="#economics">05_0G_PAY_ECONOMICS</a>
          <a href="#partners">06_LIVE_PARTNERS</a>
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="btn-back">← BACK_TO_DASHBOARD</Link>
        </div>
      </div>

      <main className="docs-main">
        <section id="intro" className="docs-section">
          <h1 className="heading-font">01_INTRODUCTION</h1>
          <p className="lead terminal-font">Memoria DA is the permanent, decentralized memory standard for the AI Agent economy.</p>
          <p>
            In the current agentic landscape, memory is siloed, centralized, and unverifiable. When an agent's process restarts, its context is lost. Memoria DA solves this by providing a universal memory protocol anchored on the 0G high-performance network.
          </p>
          <div className="feature-grid-simple">
            <div className="feature-item-simple">
              <span className="icon">🧠</span>
              <strong>Universal Context</strong>
              <p>Framework-agnostic memory that travels with the agent across ecosystems.</p>
            </div>
            <div className="feature-item-simple">
              <span className="icon">⛓️</span>
              <strong>Cryptographic Proof</strong>
              <p>Every memory is anchored with a Merkle root on 0G Chain for full auditability.</p>
            </div>
            <div className="feature-item-simple">
              <span className="icon">⚡</span>
              <strong>High Throughput</strong>
              <p>Built on 0G Storage to handle millions of vector embeddings at sub-second speeds.</p>
            </div>
          </div>
        </section>

        <section id="problem" className="docs-section">
          <h2 className="heading-font">02_THE_PROBLEM: AI_AMNESIA</h2>
          <div className="problem-callout terminal-font">
            "Agents today suffer from a critical infrastructure gap: they cannot prove what they remember."
          </div>
          <p>
            Today's LLM applications rely on centralized vector databases (Pinecone, Weaviate) or local JSON files. This creates three critical failures:
          </p>
          <ul>
            <li><strong>Centralized Fragility:</strong> If the provider goes down, the agent loses its "soul."</li>
            <li><strong>Audit Blackout:</strong> There is no way to prove an agent hasn't been "gaslit" or its memories tampered with.</li>
            <li><strong>Isolation:</strong> An agent's learning in one application cannot be natively leveraged in another.</li>
          </ul>
        </section>

        <section id="architecture" className="docs-section">
          <h2 className="heading-font">03_ARCHITECTURE: THE_TRIPLE_G_STACK</h2>
          <p>Memoria DA is built natively and exclusively on the 0G modular stack. We leverage all three pillars to ensure a trustless memory cycle.</p>
          
          <div className="stack-diagram">
             <div className="stack-layer storage">
                <strong>0G_STORAGE (The Vector Vault)</strong>
                <p>Stores raw 1536-dim vector embeddings as Merkle-verified blobs. Provides the high-bandwidth DA layer.</p>
             </div>
             <div className="stack-layer chain">
                <strong>0G_CHAIN (The Audit Trail)</strong>
                <p>Anchors the Merkle root hash via the <code>MemoriaRegistryV2</code> contract. Every memory update is a verifiable on-chain event.</p>
             </div>
             <div className="stack-layer compute">
                <strong>0G_COMPUTE (The Sealed Inference)</strong>
                <p>Uses TEE-verified inference (Qwen 2.5 7B) to ensure that memory retrieval and reasoning are cryptographically sealed.</p>
             </div>
          </div>
        </section>

        <section id="integration" className="docs-section">
          <h2 className="heading-font">04_QUICKSTART: 3_STEPS_TO_INTEGRATION</h2>
          <p>Integrate decentralized memory into any agent framework in minutes.</p>
          
          <div className="code-block-wrapper">
            <div className="code-header">
              <span className="code-lang">javascript</span>
              <span className="code-file">memoria_init.js</span>
            </div>
            <pre className="code-block">
              <code>{`// 1. Initialize the Memoria SDK
const memoria = new MemoriaSDK({
  network: 'galileo-testnet',
  privateKey: process.env.PRIVATE_KEY
});

// 2. Store a memory vector
const { rootHash } = await memoria.store({
  content: "User prefers Solidity over Rust for smart contracts.",
  importance: 0.9
});

// 3. Anchor and Verify
const tx = await memoria.anchor(agentId, rootHash);
console.log("Memory verified at:", tx.explorerUrl);`}</code>
            </pre>
          </div>
        </section>

        <section id="economics" className="docs-section">
          <h2 className="heading-font">05_0G_PAY_ECONOMICS</h2>
          <p>We’ve integrated the new <strong>0G Pay × Khalani</strong> rails to create a self-sustaining memory economy.</p>
          <div className="eco-card">
            <h3 className="heading-font">How it works:</h3>
            <ol>
              <li>Developers deposit <strong>Compute Credits</strong> via 0G Pay (Fiat or Crypto).</li>
              <li>Every <code>anchor()</code> call deducts a 0.001 0G fee from the credits.</li>
              <li>This removes all wallet friction for the end-user while providing revenue to the protocol.</li>
            </ol>
          </div>
        </section>

        <section id="partners" className="docs-section">
          <h2 className="heading-font">06_LIVE_PARTNERS</h2>
          <p>Memoria DA is already powering live applications on the 0G testnet.</p>
          <div className="partner-showcase">
            <div className="partner-box">
              <h4 className="heading-font">AlphaJournal</h4>
              <p>Decentralized trading diary. Uses Memoria to ensure traders never lose their "alpha" or market thesis.</p>
            </div>
            <div className="partner-box">
              <h4 className="heading-font">SolTutor</h4>
              <p>AI Solidity mentor. Uses Memoria to track student progress and adapt lesson plans across sessions.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Docs;
