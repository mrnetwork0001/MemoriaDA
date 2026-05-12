import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import registryService from '../services/registryService';
import { DOCS_SECTIONS } from './docsContent';
import { IconBolt, IconChain, IconNeural, IconBox, IconGlobe, IconLock, IconSnapshot } from '../components/TerminalIcons';
import { NETWORKS } from '../config/network';
import './Docs.css';

const ProtocolMetrics = () => {
  const [stats, setStats] = useState({
    anchored: '0.0 MB',
    users: '0',
    agents: '0',
    revenue: '0.00 0G',
    loading: true
  });

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        // Target Galileo Testnet for current traction display
        const testnet = NETWORKS.testnet;
        const provider = new ethers.JsonRpcProvider(testnet.rpcUrl);
        const agents = await registryService.getAllAgents(provider);
        
        if (agents && agents.length > 0) {
          const totalAgents = agents.length;
          const totalVectors = agents.reduce((acc, curr) => acc + (Number(curr.vectorCount) || 0), 0);
          const totalFees = agents.reduce((acc, curr) => acc + (parseFloat(curr.totalFeePaid) || 0), 0);
          
          // Count unique owners
          const uniqueOwners = new Set(agents.map(a => a.owner?.toLowerCase()).filter(Boolean));
          
          const anchoredSize = (totalVectors * 1.5); // 1.5KB per vector average
          const displaySize = anchoredSize > 1024 
            ? `${(anchoredSize / 1024).toFixed(1)} MB` 
            : `${anchoredSize.toFixed(0)} KB`;

          setStats({
            anchored: displaySize,
            users: uniqueOwners.size.toString(),
            agents: totalAgents.toString(),
            revenue: `${totalFees.toFixed(3)} 0G`,
            loading: false
          });
        } else {
          setStats({
            anchored: '0.0 MB',
            users: '0',
            agents: '0',
            revenue: '0.000 0G',
            loading: false
          });
        }
      } catch (err) {
        console.error("Metrics fetch error:", err);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchLiveStats();
    const interval = setInterval(fetchLiveStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-value">{stats.loading ? '...' : stats.anchored}</div>
        <div className="metric-label">KNOWLEDGE ANCHORED</div>
      </div>
      <div className="metric-card">
        <div className="metric-value">{stats.loading ? '...' : stats.users}</div>
        <div className="metric-label">UNIQUE OWNERS</div>
      </div>
      <div className="metric-card">
        <div className="metric-value">{stats.loading ? '...' : stats.agents}</div>
        <div className="metric-label">ACTIVE AGENT NFTS</div>
      </div>
      <div className="metric-card">
        <div className="metric-value">{stats.loading ? '...' : stats.revenue}</div>
        <div className="metric-label">PROTOCOL REVENUE</div>
      </div>
    </div>
  );
};

const FAQAccordion = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: "Is Memoria DA live on 0G Mainnet?",
      a: "Yes. Following the 0G Protocol upgrade, Memoria DA is now fully operational on the 0G Mainnet. All hackathon submissions must use the Mainnet RPC and contract addresses found in the 'Smart Contracts' section."
    },
    {
      q: "How do I ensure my app is Mainnet-ready?",
      a: "Switch your provider RPC to 'https://evmrpc.0g.ai' and ensure your agent registry transactions are pointing to the Mainnet contract. You should also ensure your server-side wallets have a sufficient 0G balance for production-grade anchoring."
    },
    {
      q: "What are the gas costs on 0G Mainnet?",
      a: "Mainnet anchoring fees are dynamic but generally hover around 0.001 0G per memory commit. Our 'Developer Pays' model is highly recommended for Mainnet to ensure users don't face high friction during agent interactions."
    },
    {
      q: "Does Mainnet support the same features as Galileo?",
      a: "Yes, all core features including NFT-based identity, Merkle anchoring, and 0G Storage blob integration are 1:1 compatible between Galileo and Mainnet."
    },
    {
      q: "Is my data private on Memoria DA?",
      a: "By default, data on 0G Storage is public (but hashed). For private memories, we recommend encrypting your JSON payload using the agent's public key before calling the upload API."
    },
    {
      q: "Can I delete a memory?",
      a: "Onchain anchors are immutable. However, you can 'prune' your local state and update the Merkle root to exclude certain data. The old data will remain in 0G Storage until the rent expires, but it will no longer be part of the 'active' memory root."
    },
    {
      q: "What is the cost for 1,000 memories?",
      a: "Approximately 1 0G token total. Our goal is to keep memory extremely affordable for millions of autonomous agents."
    },
    {
      q: "How do I get 0G tokens for anchoring?",
      a: "During the Galileo Testnet phase, you can use the official 0G Faucet (faucet.0g.ai) or use our 'Developer Pays' model where the backend handles token acquisition via Khalani intents."
    },
    {
      q: "Is it compatible with Eliza or Autonolas?",
      a: "Yes. Memoria DA is framework-agnostic. We provide a drop-in adapter for Eliza and a custom 'Skill' for OpenClaw. For Autonolas, you can use our REST API within your agent's service layer."
    },
    {
      q: "What is the maximum size of a single memory?",
      a: "There is no hard limit on 0G Storage, but for optimal semantic retrieval performance, we recommend keeping individual text chunks under 8,000 tokens (approx. 32KB)."
    },
    {
      q: "Can multiple agents share the same memory?",
      a: "Yes! By sharing the agentId and the private key (if encrypted), multiple agents can subscribe to the same memory root. This is useful for 'Swarm' architectures."
    },
    {
      q: "Does Memoria DA support other blockchains?",
      a: "Memoria DA is built natively and exclusively for the 0G ecosystem. We leverage 0G's specialized Data Availability (DA) and modular architecture because legacy chains lack the throughput and low-latency storage required for real-time AI agent memory."
    }
  ];

  return (
    <div className="faq-accordion-container">
      {faqs.map((f, idx) => (
        <div key={idx} className={`faq-row ${openIdx === idx ? 'open' : ''}`}>
          <button 
            className="faq-q-btn"
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
          >
            <span className="faq-q-text">{f.q}</span>
            <span className="faq-icon">{openIdx === idx ? '−' : '+'}</span>
          </button>
          <div className="faq-a-content">
            <div className="faq-a-inner">{f.a}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const PartnersShowcase = () => {
  const [openId, setOpenId] = useState(null);

  const partners = [
    {
      id: 'alpha',
      name: 'ALPHAJOURNAL',
      tagline: 'Decentralized Trading Diary',
      desc: 'The first platform that allows traders to immortalize their market theses onchain. Every prediction and entry reason is anchored to 0G Storage via Memoria DA, creating a verifiable track record for subscribers.',
      url: 'https://memoriada.xyz'
    },
    {
      id: 'sol',
      name: 'SOLTUTOR',
      tagline: 'AI Solidity Mentor',
      desc: 'SolTutor uses Memoria to maintain student progress. It remembers exactly which concepts you have mastered and where you left off, even across different devices or session resets.',
      url: 'https://memoriada.xyz'
    },
    {
      id: 'claw',
      name: 'OPENCLAW',
      tagline: 'Agent Orchestration',
      desc: 'Memoria DA provides the native long-term memory skill for the OpenClaw ecosystem. Every autonomous agent in the network uses our registry to store and retrieve contextual history.',
      url: 'https://memoriada.xyz'
    }
  ];

  return (
    <div className="partners-showcase-container">
      <div className="partners-horizontal-list">
        {partners.map((p, idx) => (
          <div key={p.id} className={`partner-item-wrap ${openId === p.id ? 'open' : ''}`}>
            <button 
              className="partner-btn-horizontal"
              onClick={() => setOpenId(openId === p.id ? null : p.id)}
            >
              <span className="partner-num">0{idx + 1}</span>
              <span className="partner-name-main">{p.name}</span>
              <span className="partner-chevron">{openId === p.id ? '−' : '+'}</span>
            </button>
            
            <div className="partner-dropdown-content">
              <div className="partner-inner-info">
                <div className="partner-tagline terminal-font">{p.tagline}</div>
                <p className="partner-desc-text">{p.desc}</p>
                <a href={p.url} target="_blank" rel="noreferrer" className="partner-visit-link">
                  VISIT_PROJECT_PAGE ❯
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContractDeploymentInfo = () => {
  const [network, setNetwork] = useState('testnet');
  const [copied, setCopied] = useState(false);

  const netData = NETWORKS[network];
  const address = netData.registryAddress || 'NOT_YET_DEPLOYED';

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="contract-deployment-card">
      <div className="deployment-tabs">
        <button 
          className={`deploy-tab ${network === 'testnet' ? 'active' : ''}`}
          onClick={() => setNetwork('testnet')}
        >
          0G_GALILEO_TESTNET
        </button>
        <button 
          className={`deploy-tab ${network === 'mainnet' ? 'active' : ''}`}
          onClick={() => setNetwork('mainnet')}
        >
          0G_MAINNET
        </button>
      </div>

      <div className="deployment-details">
        <table className="docs-table">
          <tbody>
            <tr>
              <td className="td-label">NETWORK</td>
              <td>{netData.chainName}</td>
            </tr>
            <tr>
              <td className="td-label">CHAIN_ID</td>
              <td className="td-code">{netData.chainId} ({netData.chainIdHex})</td>
            </tr>
            <tr>
              <td className="td-label">CONTRACT</td>
              <td className="td-address-cell">
                <code className="full-address mono">{address}</code>
                <button 
                  className={`copy-addr-btn ${copied ? 'copied' : ''}`}
                  onClick={handleCopy}
                  title="Copy Address"
                >
                  {copied ? 'COPIED!' : <IconSnapshot size={12} />}
                </button>
              </td>
            </tr>
            <tr>
              <td className="td-label">EXPLORER</td>
              <td>
                <a href={`${netData.blockExplorer}/address/${address}`} target="_blank" rel="noreferrer" className="text-link">
                  VIEW_ON_CHAINSCAN ❯
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Docs = () => {
  const [activeId, setActiveId] = useState(DOCS_SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  // Find current section and index
  const currentIndex = DOCS_SECTIONS.findIndex(s => s.id === activeId);
  const activeSection = DOCS_SECTIONS[currentIndex];
  
  const prevSection = currentIndex > 0 ? DOCS_SECTIONS[currentIndex - 1] : null;
  const nextSection = currentIndex < DOCS_SECTIONS.length - 1 ? DOCS_SECTIONS[currentIndex + 1] : null;

  // Copy to clipboard logic for code blocks
  useEffect(() => {
    const mainArea = document.getElementById('docs-main-area');
    if (!mainArea) return;
    mainArea.scrollTop = 0;

    // Give the DOM a moment to render the innerHTML
    const timer = setTimeout(() => {
      const wrappers = mainArea.querySelectorAll('.code-block-wrapper');
      wrappers.forEach(wrapper => {
        const header = wrapper.querySelector('.code-header');
        const codeBlock = wrapper.querySelector('.code-block');
        
        if (header && codeBlock && !header.querySelector('.auto-copy-btn')) {
          const btn = document.createElement('button');
          btn.className = 'copy-btn auto-copy-btn';
          btn.innerText = 'COPY';
          
          btn.onclick = () => {
            navigator.clipboard.writeText(codeBlock.innerText.trim());
            btn.innerText = 'COPIED!';
            btn.classList.add('copied');
            setTimeout(() => {
              btn.innerText = 'COPY';
              btn.classList.remove('copied');
            }, 2000);
          };
          
          header.appendChild(btn);
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [activeId]);

  const filteredSections = DOCS_SECTIONS.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="docs-page">
      {/* ── Sidebar ── */}
      <aside className="docs-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand heading-font">MEMORIA_DA // PROTOCOL</div>
          <div className="sidebar-version">DOCS_V1.0.0_ALPHA</div>
          
          <div className="sidebar-search">
            <span className="search-prefix">❯</span>
            <input 
              type="text" 
              placeholder="SEARCH_DOCS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <nav className="sidebar-nav terminal-font">
          <div className="sidebar-group">
            <div className="sidebar-group-label">Core_Documentation</div>
            {filteredSections.map((section, idx) => (
              <button
                key={section.id}
                className={`sidebar-link ${activeId === section.id ? 'active' : ''}`}
                onClick={() => setActiveId(section.id)}
              >
                <span className="link-num">{String(idx + 1).padStart(2, '0')}</span>
                {section.label.replace(/^\d+_/, '')}
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <Link to="/app" className="btn-back">
            <span style={{marginRight: '8px'}}>←</span> RETURN_TO_SYSTEM
          </Link>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="docs-main" id="docs-main-area">
        <div className="docs-topbar">
          <div className="docs-breadcrumb">
            DOCS / <span>{activeSection.label}</span>
          </div>
          <div className="docs-progress">
            PAGE {currentIndex + 1} OF {DOCS_SECTIONS.length}
          </div>
        </div>

        <div className="docs-section-content">
          <div className="section-label terminal-font">{activeSection.label}</div>
          <h1 className="section-title heading-font">{activeSection.title}</h1>
          <p className="section-subtitle terminal-font">{activeSection.subtitle}</p>

          {/* Injecting Live Metrics only for intro */}
          {activeId === 'intro' && (
            <>
              <h2 className="docs-h2" style={{marginTop: '40px'}}>PROTOCOL AT A GLANCE</h2>
              <ProtocolMetrics />
            </>
          )}
          
          {/* Injecting HTML content from data file */}
          <div 
            className="docs-body-render" 
            dangerouslySetInnerHTML={{ __html: activeSection.content }} 
          />

          {/* Custom interactive components */}
          {activeId === 'contracts' && <ContractDeploymentInfo />}
          {activeId === 'partners' && <PartnersShowcase />}
          {activeId === 'faq' && <FAQAccordion />}
        </div>

        {/* ── Pagination Footer ── */}
        <div className="docs-nav-footer">
          <button 
            className="nav-arrow-btn" 
            onClick={() => prevSection && setActiveId(prevSection.id)}
            disabled={!prevSection}
          >
            ← PREV: {prevSection ? prevSection.label.split('_')[1] : 'START'}
          </button>
          
          <div className="nav-section-hint terminal-font">
            {currentIndex + 1} / {DOCS_SECTIONS.length}
          </div>

          <button 
            className="nav-arrow-btn" 
            onClick={() => nextSection && setActiveId(nextSection.id)}
            disabled={!nextSection}
          >
            NEXT: {nextSection ? nextSection.label.split('_')[1] : 'END'} →
          </button>
        </div>
      </main>
    </div>
  );
};

export default Docs;
