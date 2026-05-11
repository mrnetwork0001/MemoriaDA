import { useState, useRef, useEffect } from 'react';
import { NETWORKS } from '../config/network';
import './NetworkSwitcher.css';

const NetworkSwitcher = ({ networkKey, onSwitch, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handle = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const current = NETWORKS[networkKey];
  const isTestnet = networkKey === 'testnet';

  const handleSelect = (key) => {
    if (key !== networkKey) {
      onSwitch(key);
    }
    setIsOpen(false);
  };

  return (
    <div className="network-switcher" ref={dropdownRef} id="network-switcher">
      <button
        className={`network-toggle ${isTestnet ? 'network-testnet' : 'network-mainnet'}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        title={`Connected to ${current.chainName}`}
      >
        <span className={`network-dot ${isTestnet ? 'dot-testnet' : 'dot-mainnet'}`} />
        <span className="network-name terminal-font">{current.label}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`network-chevron ${isOpen ? 'chevron-up' : ''}`}
        >
          <path
            d="M2.5 4L5 6.5L7.5 4"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="network-dropdown glass-panel-strong">
          <div className="network-dropdown-title terminal-font">SELECT NETWORK</div>

          {Object.entries(NETWORKS).map(([key, net]) => {
            const isActive = key === networkKey;
            const isTest = key === 'testnet';
            return (
              <button
                key={key}
                className={`network-option ${isActive ? 'network-option-active' : ''}`}
                onClick={() => handleSelect(key)}
              >
                <span className={`network-dot ${isTest ? 'dot-testnet' : 'dot-mainnet'}`} />
                <div className="network-option-info">
                  <span className="network-option-name">{net.chainName}</span>
                  <span className="network-option-id terminal-font">
                    Chain ID: {net.chainId}
                  </span>
                </div>
                {isActive && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}

          <div className="network-dropdown-hint terminal-font">
            {isTestnet
              ? '[FREE] Free testnet tokens via faucet'
              : '[REAL] Real assets — use with caution'}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkSwitcher;
