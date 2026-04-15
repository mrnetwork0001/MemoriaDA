// ============================================================
// useWallet Hook — Reactive wallet state management
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import walletService from '../services/walletService';

export function useWallet() {
  const [state, setState] = useState(walletService.getState());
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = walletService.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      await walletService.connect();
      // Auto-switch to 0G chain if not on it
      const currentState = walletService.getState();
      if (!currentState.isCorrectChain) {
        await walletService.switchTo0GChain();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    walletService.disconnect();
    setError(null);
  }, []);

  const switchChain = useCallback(async () => {
    setError(null);
    try {
      await walletService.switchTo0GChain();
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return {
    ...state,
    isConnecting,
    error,
    connect,
    disconnect,
    switchChain,
    formatAddress: walletService.formatAddress,
  };
}

export default useWallet;
