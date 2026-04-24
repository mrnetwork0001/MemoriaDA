// ============================================================
// useNetwork Hook — Reactive network selection state
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import {
  getActiveNetwork,
  getActiveNetworkKey,
  setActiveNetwork,
  onNetworkChange,
} from '../config/network';

export function useNetwork() {
  const [networkKey, setNetworkKey] = useState(getActiveNetworkKey());
  const [network, setNetwork] = useState(getActiveNetwork());

  useEffect(() => {
    const unsub = onNetworkChange((net, key) => {
      setNetwork(net);
      setNetworkKey(key);
    });
    return unsub;
  }, []);

  const switchNetwork = useCallback((key) => {
    setActiveNetwork(key);
  }, []);

  return {
    network,
    networkKey,
    isTestnet: networkKey === 'testnet',
    isMainnet: networkKey === 'mainnet',
    switchNetwork,
  };
}

export default useNetwork;
