import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DOCS_SECTIONS } from './docsContent';
import { IconBolt, IconChain, IconNeural, IconBox, IconGlobe, IconLock } from '../components/TerminalIcons';
import './Docs.css';

const Docs = () => {
  const [activeId, setActiveId] = useState(DOCS_SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  // Find current section and index
  const currentIndex = DOCS_SECTIONS.findIndex(s => s.id === activeId);
  const activeSection = DOCS_SECTIONS[currentIndex];
  
  const prevSection = currentIndex > 0 ? DOCS_SECTIONS[currentIndex - 1] : null;
  const nextSection = currentIndex < DOCS_SECTIONS.length - 1 ? DOCS_SECTIONS[currentIndex + 1] : null;

  // Scroll to top when section changes
  useEffect(() => {
    const mainArea = document.getElementById('docs-main-area');
    if (mainArea) mainArea.scrollTop = 0;
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
