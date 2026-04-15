import React from 'react';
import './LandingHero.css';

const LandingHero = () => {
  return (
    <section className="landing-hero" id="hero">
      <div className="hero-content section-container">
        <div className="hero-text">
          <h1 className="hero-title">
            The Memory Layer for <span className="text-gradient-cyan">Autonomous AI</span>
          </h1>
          <p className="hero-subtitle">
            Memoria DA replaces centralized databases with decentralized, verifiable vector storage on 0G — 
            giving every AI agent permanent, tamper-proof memory.
          </p>
          <div className="hero-actions">
            <button className="btn-primary-large" onClick={() => window.location.href = '/app'}>
              Launch App →
            </button>
            <button className="btn-secondary-large">
              View on GitHub
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="orbital-system">
            <div className="central-node">
              <div className="brain-glow"></div>
              <div className="brain-icon">🧠</div>
            </div>
            
            <div className="orbit orbit-1">
              <div className="agent-node node-1">🤖</div>
            </div>
            <div className="orbit orbit-2">
              <div className="agent-node node-2">👾</div>
            </div>
            <div className="orbit orbit-3">
               <div className="agent-node node-3">💠</div>
            </div>

            <div className="data-stream-container">
               <div className="data-stream ds-1"></div>
               <div className="data-stream ds-2"></div>
            </div>

            <div className="storage-sphere">
               <div className="sphere-logo">0G</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
