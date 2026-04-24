import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WalletConnector from './WalletConnector';
import NetworkSwitcher from './NetworkSwitcher';
import './Header.css';

const Header = ({ wallet, networkHook }) => {
  const [blockHeight, setBlockHeight] = useState(4_821_337);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockHeight(prev => prev + Math.floor(Math.random() * 3));
      setUptime(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleNetworkSwitch = (key) => {
    // Disconnect wallet when switching networks so user reconnects cleanly
    if (wallet?.isConnected) {
      wallet.disconnect();
    }
    networkHook.switchNetwork(key);
  };

  return (
    <header className="header" id="main-header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <div className="logo-container">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                    <stop offset="0%" stopColor="#00e0ff" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <circle cx="14" cy="14" r="12" stroke="url(#logoGrad)" strokeWidth="1.5" fill="none" />
                <circle cx="14" cy="14" r="5" fill="url(#logoGrad)" opacity="0.8" />
                <circle cx="14" cy="14" r="8" stroke="url(#logoGrad)" strokeWidth="0.8" fill="none" strokeDasharray="3 3">
                  <animateTransform attributeName="transform" type="rotate" from="0 14 14" to="360 14 14" dur="12s" repeatCount="indefinite" />
                </circle>
                <circle cx="14" cy="6" r="1.5" fill="#00e0ff">
                  <animateTransform attributeName="transform" type="rotate" from="0 14 14" to="360 14 14" dur="6s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
            <div className="logo-text">
            <h1 className="logo-title heading-font cyber-glitch-text" data-text="MEMORIA DA">
              MEMORIA<span className="logo-da">DA</span>
            </h1>
            <span className="logo-subtitle terminal-font">❯ Decentralized Memory Protocol</span>
          </div>
          </div>
        </Link>
      </div>

      <div className="header-center">
        <div className="header-stat">
          <span className="stat-label">0G BLOCK</span>
          <span className="stat-value mono">{blockHeight.toLocaleString()}</span>
        </div>
        <div className="stat-divider" />
        <div className="header-stat">
          <span className="stat-label">SESSION</span>
          <span className="stat-value mono">{formatUptime(uptime)}</span>
        </div>
        <div className="stat-divider" />
        <div className="header-stat">
          <span className="stat-label">PROTOCOL</span>
          <span className="stat-value">v0.1.0-α</span>
        </div>
      </div>

      <div className="header-right">
        <NetworkSwitcher
          networkKey={networkHook.networkKey}
          onSwitch={handleNetworkSwitch}
          disabled={false}
        />
        <WalletConnector wallet={wallet} networkKey={networkHook.networkKey} />
      </div>
    </header>
  );
};

export default Header;
