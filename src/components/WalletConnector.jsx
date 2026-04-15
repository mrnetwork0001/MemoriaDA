import { useState } from 'react';
import { NETWORK_CONFIG } from '../config/network';
import './WalletConnector.css';

const WalletConnector = ({ wallet }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    isConnected,
    isConnecting,
    isCorrectChain,
    address,
    error,
    connect,
    disconnect,
    switchChain,
    formatAddress,
  } = wallet;

  if (!isConnected) {
    return (
      <button
        className="wallet-connect-btn"
        id="wallet-connect-btn"
        onClick={connect}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <span className="connect-spinner" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M4 4V3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="11" cy="9" r="1.5" fill="currentColor" />
            </svg>
            <span>Connect Wallet</span>
          </>
        )}
      </button>
    );
  }

  if (!isCorrectChain) {
    return (
      <button
        className="wallet-switch-btn"
        id="wallet-switch-btn"
        onClick={switchChain}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 5l5-3 5 3M2 9l5 3 5-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Switch to 0G</span>
      </button>
    );
  }

  return (
    <div className="wallet-connected" id="wallet-connected">
      <button
        className="wallet-address-btn"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span className="wallet-dot-connected" />
        <span className="wallet-addr mono">{formatAddress(address)}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={showDropdown ? 'chevron-up' : ''}>
          <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {showDropdown && (
        <div className="wallet-dropdown glass-panel-strong">
          <div className="dropdown-header">
            <span className="dropdown-label">Connected to</span>
            <span className="dropdown-chain">
              <span className="chain-dot" />
              {NETWORK_CONFIG.chainName}
            </span>
          </div>
          <div className="dropdown-address">
            <span className="mono">{address}</span>
          </div>
          <div className="dropdown-links">
            <a
              href={`${NETWORK_CONFIG.blockExplorer}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="dropdown-link"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 1H2a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <path d="M7 1h4v4M5 7L11 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              View on Explorer
            </a>
            <a
              href={NETWORK_CONFIG.faucet}
              target="_blank"
              rel="noopener noreferrer"
              className="dropdown-link"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v5M3 8a3 3 0 106 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
              Get Testnet A0GI
            </a>
          </div>
          <button className="dropdown-disconnect" onClick={() => { disconnect(); setShowDropdown(false); }}>
            Disconnect
          </button>
          {error && <div className="dropdown-error">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default WalletConnector;
