import React from 'react';
import './LandingArchitecture.css';

const LandingArchitecture = () => {
  return (
    <section className="landing-architecture" id="architecture">
      <div className="section-container">
        <h2 className="section-title">The <span className="text-gradient-cyan">Architecture</span> of Memory</h2>
        
        <div className="arch-flow-container">
          {/* Step 1: Store */}
          <div className="arch-card glass">
            <div className="arch-step">01</div>
            <h3>Store</h3>
            <p>Agent sends memory → embedded as 1536-dim vector → uploaded as Merkle blob to 0G Storage.</p>
            <div className="arch-visual-mini store-visual">
               <div className="blob-icon">📄</div>
               <div className="arrow">→</div>
               <div className="vector-icon">📊</div>
            </div>
          </div>

          <div className="arch-arrow">→</div>

          {/* Step 2: Register */}
          <div className="arch-card glass">
            <div className="arch-step">02</div>
            <h3>Register</h3>
            <p>Root hash posted to MemoriaRegistry on 0G Chain → permanent, verifiable on-chain record.</p>
            <div className="arch-visual-mini reg-visual">
               <div className="hash-icon">#</div>
               <div className="arrow">→</div>
               <div className="chain-icon">⛓️</div>
            </div>
          </div>

          <div className="arch-arrow">→</div>

          {/* Step 3: Retrieve */}
          <div className="arch-card glass">
            <div className="arch-step">03</div>
            <h3>Retrieve</h3>
            <p>Agents query by similarity → fetch blob by hash → verify Merkle proof against 0G Chain.</p>
            <div className="arch-visual-mini ret-visual">
               <div className="query-icon">🔍</div>
               <div className="arrow">→</div>
               <div className="proof-icon">✅</div>
            </div>
          </div>
        </div>

        <div className="arch-technical-diagram glass">
          <div className="diagram-header">Memoria DA Flow</div>
          <div className="diagram-body">
            <div className="diagram-row">
              <span className="node-box">Agent Framework</span>
              <span className="connector">→</span>
              <span className="node-box">Memoria SDK</span>
              <span className="connector">→</span>
              <span className="node-box highlight">0G Storage</span>
            </div>
            <div className="diagram-row vertical">
              <span className="connector-v">↕</span>
              <span className="connector-v spacer"></span>
              <span className="connector-v">↕</span>
            </div>
            <div className="diagram-row">
              <span className="node-box">Agent Chat</span>
              <span className="connector">←</span>
              <span className="node-box">Retrieval</span>
              <span className="connector">←</span>
              <span className="node-box secondary">0G Chain</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingArchitecture;
