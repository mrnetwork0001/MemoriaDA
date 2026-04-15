import { useState } from 'react';
import Header from '../components/Header';
import AgentChat from '../components/AgentChat';
import DataTerminal from '../components/DataTerminal';
import useWallet from '../hooks/useWallet';
import useStorage from '../hooks/useStorage';
import '../App.css';

function Dashboard() {
  const [memoryEvents, setMemoryEvents] = useState([]);
  const wallet = useWallet();
  const storage = useStorage();

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

      <Header wallet={wallet} />
      
      <main className="dashboard" id="dashboard-main">
        <AgentChat
          onMemoryEvent={handleMemoryEvent}
          wallet={wallet}
          storage={storage}
        />
        <DataTerminal
          memoryEvents={memoryEvents}
          storageLogs={storage.logs}
          wallet={wallet}
          storage={storage}
        />
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
