import React from 'react';
import './LandingFeatures.css';

const LandingFeatures = () => {
  const features = [
    {
      id: "01",
      title: "0G_STORAGE_NATIVE",
      desc: "Direct blob upload and download via the @0gfoundation/0g-ts-sdk.",
      badge: "STORAGE_LAYER"
    },
    {
      id: "02",
      title: "CHAIN_REGISTRY",
      desc: "Solidity contract maps Agent ID to Storage Root for permanent records.",
      badge: "ON_CHAIN_LINK"
    },
    {
      id: "03",
      title: "VECTOR_EMBEDDINGS",
      desc: "1536-dimensional cosine similarity search for semantic memory retrieval.",
      badge: "AI_LOGIC"
    },
    {
      id: "04",
      title: "LIVE_HUD_TERMINAL",
      desc: "Real-time data feed shows every storage operation and Merkle proof.",
      badge: "READ_OUT"
    },
    {
      id: "05",
      title: "WALLET_PROTOCOL",
      desc: "Secure MetaMask integration with auto chain-switch to 0G Aristotle Mainnet.",
      badge: "AUTH_LINK"
    },
    {
      id: "06",
      title: "OPEN_COMM_STANDARD",
      desc: "MIT-licensed, framework-agnostic, and fully composable design.",
      badge: "NETWORK"
    }
  ];

  return (
    <section className="landing-features" id="features">
      <div className="features-container">
        <h2 className="section-title heading-font">BUILT_FOR_THE_AGENTIC_SPRAWL</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <span className="feature-badge terminal-font">{f.badge}</span>
              <div className="feature-icon-wrapper">
                <span className="terminal-font">{f.id}</span>
              </div>
              <h3 className="heading-font">{f.title}</h3>
              <p className="terminal-font">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
