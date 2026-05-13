import React from 'react';
import { Link } from 'react-router-dom';
import { IconRocket, IconNeural, IconAgent, IconBolt } from './TerminalIcons';
import './LandingHero.css';

const LandingHero = () => {
  return (
    <section className="landing-hero" id="hero">
      {/* Dynamic Background */}
      <div className="hero-background">
        <div className="grid-overlay" />
        <div className="data-streams">
          {Array.from({ length: 8 }).map((_, i) => (
             <div key={i} className="stream" style={{ '--delay': `${i * 0.7}s`, '--left': `${i * 12}%` }} />
          ))}
        </div>
      </div>

      <div className="hero-grid-container">
        {/* Left Content (Aligned Left) */}
        <div className="hero-content-left">
          <div className="hero-badge terminal-font">
            <span className="blink">●</span> SYSTEM_READY: 0G_ARISTOTLE_MAINNET
          </div>
          
          <h1 className="hero-main-title heading-font cyber-glitch-text" data-text="DECENTRALIZED MEMORY STANDARD">
            DECENTRALIZED<br/>
            <span className="text-gradient-cyan">MEMORY STANDARD</span>
          </h1>
          
          <p className="hero-desc terminal-font">
            The permanent memory layer for the AI Agent economy.<br/>
            Secure, verifiable, and perpetually searchable neural storage powered by 0G.
          </p>

          <div className="hero-cta-wrapper">
            <Link to="/app" className="btn-hero-primary heading-font">
              ENTER_SYSTEM__❯
            </Link>
            <Link to="/docs" className="btn-hero-secondary terminal-font">
              VIEW_DOCS__❯
            </Link>
          </div>

          <div className="hero-metrics terminal-font">
            <div className="metric">
              <span className="m-label">THROUGHPUT_</span>
              <span className="m-val"><IconRocket size={12} className="icon-accent" /> MAX</span>
            </div>
            <div className="metric">
              <span className="m-label">LATENCY_</span>
              <span className="m-val">~42ms</span>
            </div>
            <div className="metric">
              <span className="m-label">VERSION_</span>
              <span className="m-val">v0.1.0-α</span>
            </div>
          </div>
        </div>

        {/* Right Visual (Rotating Orbital) */}
        <div className="hero-visual-right">
          <div className="orbital-system-cyber">
            <div className="orbit-path orbit-inner" />
            <div className="orbit-path orbit-mid" />
            <div className="orbit-path orbit-outer" />
            
            <div className="central-neural-core">
              <div className="core-pulse" />
              <div className="core-icon"><IconNeural size={16} className="icon-accent" /></div>
              <div className="core-label heading-font">MEMORIA_CORE</div>
            </div>

            {/* Orbital Nodes */}
            <div className="orbital-node node-agent-1"><IconAgent size={14} className="icon-accent" /></div>
            <div className="orbital-node node-agent-2"><IconBolt size={14} className="icon-accent" /></div>
            <div className="orbital-node node-chip"><IconNeural size={14} className="icon-accent" /></div>
            
            <div className="storage-sphere-0g">
              <div className="sphere-inner heading-font">0G</div>
              <div className="sphere-glow" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
