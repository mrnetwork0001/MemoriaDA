import React from 'react';
import './LandingFeatures.css';

const LandingFeatures = () => {
  const features = [
    {
      title: "0G Storage Native",
      desc: "Direct blob upload and download via the @0gfoundation/0g-ts-sdk.",
      icon: "📦"
    },
    {
      title: "On-Chain Registry",
      desc: "Solidity contract maps Agent ID to Storage Root for permanent records.",
      icon: "🔗"
    },
    {
      title: "Vector Embeddings",
      desc: "1536-dimensional cosine similarity search for semantic memory retrieval.",
      icon: "⚡"
    },
    {
      title: "Live Terminal",
      desc: "Real-time data feed shows every storage operation and Merkle proof.",
      icon: "🖥️"
    },
    {
      title: "Wallet-Gated",
      desc: "Secure MetaMask integration with auto chain-switch to 0G Galileo.",
      icon: "🔐"
    },
    {
      title: "Open Protocol",
      desc: "MIT-licensed, framework-agnostic, and fully composable design.",
      icon: "🌍"
    }
  ];

  return (
    <section className="landing-features" id="features">
      <div className="section-container">
        <h2 className="section-title">Built for the <span className="text-gradient-cyan">Agentic Future</span></h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card glass">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
