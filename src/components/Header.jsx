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
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="1" y="1" width="20" height="20" stroke="#e3c1ff" strokeWidth="1" fill="none"/>
                <rect x="5" y="5" width="5" height="5" fill="#e3c1ff" opacity="0.9"/>
                <rect x="12" y="5" width="5" height="5" fill="#e3c1ff" opacity="0.5"/>
                <rect x="5" y="12" width="5" height="5" fill="#e3c1ff" opacity="0.5"/>
                <rect x="12" y="12" width="5" height="5" fill="#e3c1ff" opacity="0.2"/>
              </svg>
            </div>
            <div className="logo-text">
            <h1 className="logo-title heading-font" data-text="MEMORIA DA">
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
