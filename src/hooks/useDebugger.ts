import { useEffect, useState } from 'react';
import { editorSystem } from '@/core/EditorSystem';
import { eventBus } from '@/core/EventBus';

/**
 * Hook to access comprehensive debugging information
 */
export function useDebugger() {
  const [consoleErrors, setConsoleErrors] = useState<any[]>([]);
  const [networkRequests, setNetworkRequests] = useState<any[]>([]);
  const [fileChanges, setFileChanges] = useState<any[]>([]);
  const [hotReloadLogs, setHotReloadLogs] = useState<any[]>([]);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  useEffect(() => {
    // Listen to debug events
    const errorUnsub = eventBus.on('debug:console-error', (error) => {
      setConsoleErrors(prev => [...prev, error]);
    });

    const networkUnsub = eventBus.on('debug:network-request', (request) => {
      setNetworkRequests(prev => [...prev, request]);
    });

    const fileChangeUnsub = eventBus.on('debug:file-change', (change) => {
      setFileChanges(prev => [...prev, change]);
    });

    const hotReloadUnsub = eventBus.on('debug:hot-reload', (log) => {
      setHotReloadLogs(prev => [...prev, log]);
    });

    const healthCheckUnsub = eventBus.on('debug:health-check', (health) => {
      setHealthStatus(health);
    });

    // Run initial health check
    setHealthStatus(editorSystem.debugManager.runHealthCheck());

    // Cleanup
    return () => {
      errorUnsub();
      networkUnsub();
      fileChangeUnsub();
      hotReloadUnsub();
      healthCheckUnsub();
    };
  }, []);

  const runHealthCheck = () => {
    const health = editorSystem.debugManager.runHealthCheck();
    setHealthStatus(health);
    return health;
  };

  const verifyFileLoading = () => {
    return editorSystem.debugManager.verifyFileLoading();
  };

  const checkFilePaths = () => {
    return editorSystem.debugManager.checkFilePaths();
  };

  const getFailedRequests = () => {
    return editorSystem.debugManager.getFailedRequests();
  };

  const exportDebugData = () => {
    return editorSystem.debugManager.exportDebugData();
  };

  const clearLogs = () => {
    editorSystem.debugManager.clearLogs();
    setConsoleErrors([]);
    setNetworkRequests([]);
    setFileChanges([]);
    setHotReloadLogs([]);
  };

  return {
    consoleErrors,
    networkRequests,
    fileChanges,
    hotReloadLogs,
    healthStatus,
    runHealthCheck,
    verifyFileLoading,
    checkFilePaths,
    getFailedRequests,
    exportDebugData,
    clearLogs
  };
}

/**
 * Hook to monitor network activity
 */
export function useNetworkMonitor() {
  const [requests, setRequests] = useState<any[]>([]);
  const [failedRequests, setFailedRequests] = useState<any[]>([]);

  useEffect(() => {
    const unsub = eventBus.on('debug:network-request', (request) => {
      setRequests(prev => [...prev, request]);
      
      if (request.status === 'failed') {
        setFailedRequests(prev => [...prev, request]);
      }
    });

    return unsub;
  }, []);

  return {
    requests,
    failedRequests,
    clearRequests: () => {
      setRequests([]);
      setFailedRequests([]);
    }
  };
}

/**
 * Hook to monitor file changes
 */
export function useFileChangeMonitor() {
  const [changes, setChanges] = useState<any[]>([]);
  const [recentChanges, setRecentChanges] = useState<any[]>([]);

  useEffect(() => {
    const unsub = eventBus.on('debug:file-change', (change) => {
      setChanges(prev => [...prev, change]);
    });

    // Update recent changes every second
    const interval = setInterval(() => {
      const recent = editorSystem.debugManager.getFileChanges(true);
      setRecentChanges(recent);
    }, 1000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  return {
    changes,
    recentChanges,
    clearChanges: () => setChanges([])
  };
}
