import React from 'react';
import './Landing.css';
import LandingHero from '../components/LandingHero';
import LandingFeatures from '../components/LandingFeatures';
import LandingArchitecture from '../components/LandingArchitecture';

const Landing = () => {
  return (
    <div className="landing-page" id="landing-root">
      {/* Global HUD Overlay */}
      <div className="scanline" />
      
      {/* Hero Section */}
      <LandingHero />

      {/* Problem Section (Glitch Themed) */}
      <section className="landing-section problem-section" id="problem">
        <div className="section-container">
          <h2 className="section-title heading-font cyber-glitch-text" data-text="SYST_CRITICAL: AI_AMNESIA">
            SYST_CRITICAL: AI_AMNESIA
          </h2>
          <div className="pain-grid">
            <div className="pain-card cyber-chamfer">
              <div className="pain-icon text-accent-secondary">01</div>
              <h3 className="heading-font">Centralized Void</h3>
              <p className="terminal-font">Agents rely on corporate silos. One outage means total amnesia. Your data is leased, not owned.</p>
            </div>
            <div className="pain-card cyber-chamfer">
              <div className="pain-icon text-accent-tertiary">02</div>
              <h3 className="heading-font">Audit Blackout</h3>
              <p className="terminal-font">No cryptographic proof. No audit trail. You cannot prove what an agent remembers or why.</p>
            </div>
            <div className="pain-card cyber-chamfer">
              <div className="pain-icon text-accent-primary">03</div>
              <h3 className="heading-font">Isolation Protocols</h3>
              <p className="terminal-font">Memory is locked to specific frameworks. No interoperability. No continuity across the sprawl.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="landing-section solution-section" id="solution">
        <div className="section-container">
          <div className="solution-header">
            <h2 className="section-title heading-font">PERMANENT. VERIFIABLE. UNIVERSAL.</h2>
            <div className="terminal-output terminal-font">❯ INITIALIZING_MEMORIA_DA... [OK]</div>
          </div>
          
          <div className="solution-grid">
            <div className="solution-card holographic">
              <div className="solution-glow" />
              <h3 className="heading-font">0G_STORAGE</h3>
              <p className="terminal-font">Every memory vector is committed to 0G's decentralized network. Immutable. Distributed. Eternal.</p>
            </div>
            <div className="solution-card holographic">
              <div className="solution-glow" />
              <h3 className="heading-font">MERKLE_PROOF</h3>
              <p className="terminal-font">Cryptographic root hashes ensure data integrity. Fully auditable storage that cannot be tampered with.</p>
            </div>
            <div className="solution-card holographic">
              <div className="solution-glow" />
              <h3 className="heading-font">NEURAL_BRIDGE</h3>
              <p className="terminal-font">Framework agnostic. Works with any agent ecosystem on the network. The universal memory standard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <LandingArchitecture />

      {/* Features Grid */}
      <LandingFeatures />

      {/* Integration */}
      <section className="landing-section og-section" id="og-integration">
        <div className="section-container cyber-chamfer">
          <h2 className="section-title heading-font">POWERED_BY_0G_SYSTEM</h2>
          <div className="og-visual">
             <div className="og-node heading-font">0G_CHAIN</div>
             <div className="og-link-pulse" />
             <div className="og-node heading-font">MEMORIA_DA</div>
             <div className="og-link-pulse" />
             <div className="og-node heading-font">0G_STORAGE</div>
          </div>
          <div className="og-cta">
            <a href="https://0g.ai" target="_blank" rel="noopener noreferrer" className="btn-cyber terminal-font">
              VIEW_0G_DOCS__❯
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer terminal-font">
        <div className="footer-content">
          <div className="footer-brand heading-font">MEMORIA_DA // 0G_APAC_TRACK_1</div>
          <div className="footer-status">SYSTEM_STATUS: OPERATIONAL</div>
          <div className="footer-copyright">© 2026 MRNETWORK // NEURAL_LINK_ACTIVE</div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
