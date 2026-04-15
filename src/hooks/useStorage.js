// ============================================================
// useStorage Hook — 0G Storage operations
// ============================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { storageService } from '../services/storageService';

export function useStorage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [lastUpload, setLastUpload] = useState(null);
  const [lastDownload, setLastDownload] = useState(null);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const logUnsubRef = useRef(null);

  // Subscribe to storage service logs
  useEffect(() => {
    logUnsubRef.current = storageService.onLog((log) => {
      setLogs(prev => [...prev.slice(-150), log]);
    });
    return () => {
      if (logUnsubRef.current) logUnsubRef.current();
    };
  }, []);

  const storeMemory = useCallback(async (memoryData, signer) => {
    setIsUploading(true);
    setError(null);
    try {
      const result = await storageService.storeMemory(memoryData, signer);
      setLastUpload(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const retrieveMemory = useCallback(async (rootHash) => {
    setIsDownloading(true);
    setError(null);
    try {
      const result = await storageService.retrieveMemory(rootHash);
      setLastDownload(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsDownloading(false);
    }
  }, []);

  const generateEmbedding = useCallback((text, dim) => {
    return storageService.generateMockEmbedding(text, dim);
  }, []);

  return {
    isUploading,
    isDownloading,
    lastUpload,
    lastDownload,
    error,
    logs,
    storeMemory,
    retrieveMemory,
    generateEmbedding,
    cosineSimilarity: storageService.cosineSimilarity,
  };
}

export default useStorage;
