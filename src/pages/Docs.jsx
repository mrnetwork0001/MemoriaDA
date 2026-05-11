import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DOCS_SECTIONS } from './docsContent';
import { IconBolt, IconChain, IconNeural, IconBox, IconGlobe, IconLock, IconSnapshot } from '../components/TerminalIcons';
import { NETWORKS } from '../config/network';
import './Docs.css';

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
          
          {/* Injecting HTML content from data file */}
          <div 
            className="docs-body-render" 
            dangerouslySetInnerHTML={{ __html: activeSection.content }} 
          />

          {/* Custom interactive components */}
          {activeId === 'contracts' && <ContractDeploymentInfo />}
          {activeId === 'partners' && <PartnersShowcase />}
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
