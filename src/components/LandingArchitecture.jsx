import React from 'react';
import './LandingArchitecture.css';

const LandingArchitecture = () => {
  return (
    <section className="landing-architecture" id="architecture">
      <div className="architecture-container">
        <div className="arch-header">
          <h2 className="heading-font">The <span className="text-gradient-cyan">Architecture</span> of Memory</h2>
          <p className="terminal-font">DECENTRALIZED_VECTOR_LIFECYCLE</p>
        </div>
        
        <div className="arch-visual">
          {/* Node 1 */}
          <div className="arch-node active">
            <span className="node-label">PHASE_01</span>
            <div className="node-title heading-font">AGENT_STORE</div>
          </div>

          {/* Arrow 1 */}
          <div className="arch-arrow">
            <div className="arrow-line" />
          </div>

          {/* Node 2 */}
          <div className="arch-node active">
            <span className="node-label">PHASE_02</span>
            <div className="node-title heading-font">CHAIN_REGISTRY</div>
          </div>

          {/* Arrow 2 */}
          <div className="arch-arrow">
            <div className="arrow-line" />
          </div>

          {/* Node 3 */}
          <div className="arch-node active">
            <span className="node-label">PHASE_03</span>
            <div className="node-title heading-font">VECTOR_RETRIEVAL</div>
          </div>
        </div>

        <div className="arch-description">
          <div className="desc-item">
            <h4 className="heading-font">01. STORE</h4>
            <p className="terminal-font">Agent sends memory → embedded as 1536-dim vector → uploaded as Merkle blob to 0G Storage.</p>
          </div>
          <div className="desc-item">
            <h4 className="heading-font">02. REGISTER</h4>
            <p className="terminal-font">Root hash posted to MemoriaRegistry on 0G Chain → permanent, verifiable onchain record.</p>
          </div>
          <div className="desc-item">
            <h4 className="heading-font">03. RETRIEVE</h4>
            <p className="terminal-font">Agents query by similarity → fetch blob by hash → verify Merkle proof against 0G Chain.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingArchitecture;
