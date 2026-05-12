// ============================================================
// useRegistry Hook — Reactive state for MemoriaRegistry
// ============================================================

import { useState, useCallback, useEffect, useRef } from 'react';
import { registryService } from '../services/registryService';

export function useRegistry() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [agentRegistered, setAgentRegistered] = useState(false);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const logUnsubRef = useRef(null);

  // Subscribe to registry service logs
  useEffect(() => {
    logUnsubRef.current = registryService.onLog((log) => {
      setLogs(prev => [...prev.slice(-150), log]);
    });
    return () => {
      if (logUnsubRef.current) logUnsubRef.current();
    };
  }, []);

  // Check & auto-register an agent if not yet onchain
  const ensureAgentRegistered = useCallback(async (agentId, framework, signer) => {
    if (!registryService.isDeployed()) {
      console.warn('[useRegistry] Contract not deployed. Skipping onchain registration.');
      return false;
    }

    try {
      const alreadyRegistered = await registryService.isAgentRegistered(agentId, signer);
      if (alreadyRegistered) {
        setAgentRegistered(true);
        return true;
      }

      setIsRegistering(true);
      setError(null);
      await registryService.registerAgent(agentId, framework, signer);
      setAgentRegistered(true);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('[useRegistry] Registration failed:', err);
      return false;
    } finally {
      setIsRegistering(false);
    }
  }, []);

  // Anchor a memory root onchain after a successful 0G Storage upload
  const commitMemoryRoot = useCallback(async (agentId, rootHash, vectorCount, signer) => {
    if (!registryService.isDeployed()) {
      console.warn('[useRegistry] Contract not deployed. Skipping onchain commit.');
      return null;
    }

    setIsUpdating(true);
    setError(null);
    try {
      const receipt = await registryService.updateMemoryRoot(agentId, rootHash, vectorCount, signer);
      return receipt;
    } catch (err) {
      setError(err.message);
      console.error('[useRegistry] Memory root commit failed:', err);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const getAgent = useCallback(async (agentId) => {
    return await registryService.getAgent(agentId);
  }, []);

  return {
    isRegistering,
    isUpdating,
    agentRegistered,
    error,
    logs,
    isDeployed: registryService.isDeployed(),
    ensureAgentRegistered,
    commitMemoryRoot,
    getAgent,
  };
}

export default useRegistry;
