import { useState } from 'react';
import { IconChain } from '../components/TerminalIcons';
import Header from '../components/Header';
import AgentChat from '../components/AgentChat';
import DataTerminal from '../components/DataTerminal';
import MemoryExplorer from '../components/MemoryExplorer';
import DeveloperSDK from '../components/DeveloperSDK';
import MerkleVerifier from '../components/MerkleVerifier';
import useWallet from '../hooks/useWallet';
import useStorage from '../hooks/useStorage';
import useRegistry from '../hooks/useRegistry';
import useNetwork from '../hooks/useNetwork';
import '../App.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('playground'); // playground, explorer, sdk, verify
  const [memoryEvents, setMemoryEvents] = useState([]);
  const wallet = useWallet();
  const storage = useStorage();
  const registry = useRegistry();
  const networkHook = useNetwork();

  const handleMemoryEvent = (event) => {
    setMemoryEvents(prev => [...prev, event]);
  };

  return (
    <div className="app" id="app-root">
      {/* Ambient Glow Orbs */}
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />

      {/* Scanline Effect */}
      <div className="scanline" />

      <Header wallet={wallet} networkHook={networkHook} />
      
      {/* Navigation Tabs */}
      <div className="dashboard-nav">
        <button 
          className={`nav-tab ${activeTab === 'playground' ? 'active' : ''}`}
          onClick={() => setActiveTab('playground')}
        >
          AGENT PLAYGROUND
        </button>
        <button 
          className={`nav-tab ${activeTab === 'explorer' ? 'active' : ''}`}
          onClick={() => setActiveTab('explorer')}
        >
          GLOBAL EXPLORER
        </button>
        <button 
          className={`nav-tab ${activeTab === 'sdk' ? 'active' : ''}`}
          onClick={() => setActiveTab('sdk')}
        >
          DEVELOPER SDK
        </button>
        <button 
          className={`nav-tab ${activeTab === 'verify' ? 'active' : ''}`}
          onClick={() => setActiveTab('verify')}
        >
          <IconChain size={12} style={{marginRight:4, verticalAlign:'middle'}}/> VERIFY
        </button>
      </div>

      <main className="dashboard" id="dashboard-main">
        {activeTab === 'playground' && (
          <>
            <AgentChat
              onMemoryEvent={handleMemoryEvent}
              wallet={wallet}
              storage={storage}
              registry={registry}
            />
            <DataTerminal
              memoryEvents={memoryEvents}
              storageLogs={[...storage.logs, ...registry.logs]}
              wallet={wallet}
              storage={storage}
            />
          </>
        )}
        {activeTab === 'explorer' && (
          <div className="full-width-tab">
            <MemoryExplorer wallet={wallet} networkHook={networkHook} />
          </div>
        )}
        {activeTab === 'sdk' && (
          <div className="full-width-tab">
            <DeveloperSDK />
          </div>
        )}
        {activeTab === 'verify' && (
          <div className="full-width-tab">
            <MerkleVerifier wallet={wallet} networkHook={networkHook} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer" id="app-footer">
        <div className="footer-left">
          <span className="footer-brand text-gradient-cyan">Memoria DA</span>
          <span className="footer-sep">·</span>
          <span>Universal Agent Memory Protocol</span>
        </div>
        <div className="footer-right">
          <span>Powered by</span>
          <span className="footer-0g">0G</span>
          <span>Storage &amp; Chain</span>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
