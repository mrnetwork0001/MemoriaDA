import React from 'react';
import './Landing.css';
import LandingHero from '../components/LandingHero';
import LandingFeatures from '../components/LandingFeatures';
import LandingArchitecture from '../components/LandingArchitecture';

const Landing = () => {
  return (
    <div className="landing-page" id="landing-root">
      {/* Ambient Glow Orbs - Consistent with Dashboard */}
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />

      {/* Hero Section */}
      <LandingHero />

      {/* Problem Section */}
      <section className="landing-section problem-section" id="problem">
        <div className="section-container">
          <h2 className="section-title text-gradient-amber">AI Agents Are Stateless. That's a $100B Problem.</h2>
          <div className="pain-grid">
            <div className="pain-card glass">
              <div className="pain-icon">⚠️</div>
              <h3>Centralized Memory</h3>
              <p>Agents rely on AWS or Pinecone. One provider outage means total agent amnesia.</p>
            </div>
            <div className="pain-card glass">
              <div className="pain-icon">🕵️</div>
              <h3>No Verifiability</h3>
              <p>You can't prove what an agent remembers. No cryptographic audit trail for memory retrieval.</p>
            </div>
            <div className="pain-card glass">
              <div className="pain-icon">🧱</div>
              <h3>Walled Gardens</h3>
              <p>Memory is locked to specific frameworks. No interoperability between agent ecosystems.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="landing-section solution-section" id="solution">
        <div className="section-container">
          <h2 className="section-title text-gradient-cyan">Permanent. Verifiable. Universal.</h2>
          <div className="solution-grid">
            <div className="solution-card glass-cyan">
              <div className="solution-icon">🌐</div>
              <h3>Decentralized Storage</h3>
              <p>Every memory vector is stored on 0G's decentralized network. No single point of failure.</p>
            </div>
            <div className="solution-card glass-cyan">
              <div className="solution-icon">🛡️</div>
              <h3>Merkle-Verified</h3>
              <p>Every memory has a cryptographic root hash. Fully auditable and tamper-proof storage.</p>
            </div>
            <div className="solution-card glass-cyan">
              <div className="solution-icon">🧩</div>
              <h3>Framework Agnostic</h3>
              <p>Works with OpenClaw, LangChain, AutoGPT — and any agent framework of the future.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <LandingArchitecture />

      {/* Features Grid */}
      <LandingFeatures />

      {/* Built on 0G */}
      <section className="landing-section og-section" id="og-integration">
        <div className="section-container">
          <h2 className="section-title">Powered by the 0G Ecosystem</h2>
          <div className="og-pill">
            <span className="og-logo">0G</span>
            <span className="og-plus">+</span>
            <span className="og-brand">Memoria DA</span>
          </div>
          <div className="og-grid">
            <div className="og-item">
              <h4>0G Storage</h4>
              <p>Decentralized blob storage for high-dimensional memory vectors.</p>
            </div>
            <div className="og-item">
              <h4>0G Chain</h4>
              <p>MemoriaRegistry smart contract on a high-throughput settlement layer.</p>
            </div>
            <div className="og-item">
              <h4>0G Memory</h4>
              <p>Persistent memory layer for cross-session agent continuity.</p>
            </div>
          </div>
          <a href="https://0g.ai" target="_blank" rel="noopener noreferrer" className="og-link">Learn more about 0G →</a>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-section cta-section" id="cta">
        <div className="section-container">
          <h2 className="cta-title">Give Your Agents Memory That Lasts Forever.</h2>
          <div className="cta-buttons">
            <button className="btn-primary-large" onClick={() => window.location.href = '/app'}>
              Launch App →
            </button>
          </div>
          <div className="cta-links">
            <a href="#">GitHub</a>
            <a href="#">0G Docs</a>
            <a href="#">Twitter / X</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">Memoria DA</div>
          <div className="footer-text">Built for the 0G APAC Hackathon — Track 1: Agentic Infrastructure</div>
          <div className="footer-links">
            <span>Powered by 0G Storage & Chain</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
