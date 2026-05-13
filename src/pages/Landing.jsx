import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import LandingHero from '../components/LandingHero';
import LandingFeatures from '../components/LandingFeatures';
import LandingArchitecture from '../components/LandingArchitecture';
import Header from '../components/Header';
import registryService from '../services/registryService';
import { NETWORKS, getActiveNetwork } from '../config/network';
import useWallet from '../hooks/useWallet';
import useNetwork from '../hooks/useNetwork';
import { ethers } from 'ethers';

const Landing = () => {
  const wallet = useWallet();
  const networkHook = useNetwork();
  const [stats, setStats] = useState({ agents: '...', vectors: '...', fees: '...', network: 'MAINNET' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const net = getActiveNetwork();
        const provider = new ethers.JsonRpcProvider(net.rpcUrl);
        const agents = await registryService.getAllAgents(provider);
        const totalVectors = agents.reduce((sum, a) => sum + (a.vectorCount || 0), 0);
        const totalFees = agents.reduce((sum, a) => sum + parseFloat(a.totalFeePaid || '0'), 0);
        setStats({
          agents: agents.length.toString(),
          vectors: totalVectors.toString(),
          fees: totalFees.toFixed(3),
          network: net.label.toUpperCase(),
        });
      } catch (err) {
        console.warn('[Landing] Stats fetch failed:', err.message);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="landing-page" id="landing-root">
      {/* Global HUD Overlay */}
      <div className="scanline" />

      <Header wallet={wallet} networkHook={networkHook} />
      
      {/* Hero Section */}
      <LandingHero />

      {/* Live Stats Banner */}
      <div className="live-stats-banner">
        <div className="stats-inner">
          <div className="stat-item">
            <span className="stat-number text-gradient-cyan">{stats.agents}</span>
            <span className="stat-label terminal-font">AGENTS LIVE</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number text-gradient-cyan">{stats.vectors}</span>
            <span className="stat-label terminal-font">MEMORY ANCHORS</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number text-gradient-cyan">{stats.fees} 0G</span>
            <span className="stat-label terminal-font">FEES COLLECTED</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-dot" />
            <span className="stat-label terminal-font">{stats.network}</span>
          </div>
        </div>
      </div>

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

      {/* Protocol Partners */}
      <section className="landing-section partners-section" id="partners">
        <div className="section-container">
          <div className="partners-header">
            <h2 className="section-title heading-font cyber-glitch-text" data-text="TRUSTED_BY_THE_SPRAWL">
              TRUSTED_BY_THE_SPRAWL
            </h2>
            <p className="terminal-font partner-subtitle">The first wave of agents building on the Memoria DA protocol.</p>
          </div>
          
          <div className="partners-grid">
            <a href="https://alphajournal.online" target="_blank" rel="noopener noreferrer" className="partner-card cyber-chamfer">
              <div className="partner-logo-wrapper">
                <img src="/partners/alphajournal_logo.png" alt="AlphaJournal Logo" className="partner-logo" />
              </div>
              <div className="partner-info">
                <h3 className="heading-font">AlphaJournal</h3>
                <p className="terminal-font">AI-Powered Trading Diary</p>
                <div className="partner-badge terminal-font">LIVE_ON_CHAIN</div>
              </div>
            </a>

            <a href="https://soltutor.memoriada.xyz" target="_blank" rel="noopener noreferrer" className="partner-card cyber-chamfer">
              <div className="partner-logo-wrapper">
                <img src="/partners/soltutor_logo.png" alt="SolTutor Logo" className="partner-logo" />
              </div>
              <div className="partner-info">
                <h3 className="heading-font">SolTutor</h3>
                <p className="terminal-font">AI Solidity Mentor</p>
                <div className="partner-badge terminal-font">INTEGRATED</div>
              </div>
            </a>

            <div className="partner-card cyber-chamfer partner-placeholder">
              <div className="partner-logo-wrapper">
                <div className="placeholder-icon">?</div>
              </div>
              <div className="partner-info">
                <h3 className="heading-font">Your Agent Here</h3>
                <p className="terminal-font">Join the Global Registry</p>
                <a href="#og-integration" className="partner-link terminal-font">SDK_DOCS__❯</a>
              </div>
            </div>
          </div>
        </div>
      </section>

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
          <Link to="/" className="footer-brand-link">
            <div className="footer-brand heading-font">MEMORIA_DA // 0G_APAC_TRACK_1</div>
          </Link>
          <div className="footer-status">SYSTEM_STATUS: OPERATIONAL</div>
          <div className="footer-copyright">© 2026 MRNETWORK // NEURAL_LINK_ACTIVE</div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
