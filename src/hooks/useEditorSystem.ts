import { useEffect, useState } from 'react';
import { editorSystem } from '@/core/EditorSystem';
import { eventBus } from '@/core/EventBus';

/**
 * Hook to access editor system and listen to events
 */
export function useEditorSystem() {
  const [errors, setErrors] = useState<any[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<any[]>([]);

  useEffect(() => {
    // Listen to errors
    const errorUnsub = eventBus.on('error:handled', (data) => {
      setErrors(prev => [...prev, data]);
    });

    // Listen to console logs
    const consoleUnsub = eventBus.on('preview:consoleLog', (log) => {
      setConsoleLogs(prev => [...prev, log]);
    });

    // Listen to error resolution
    const resolvedUnsub = eventBus.on('error:resolved', (data) => {
      setErrors(prev => prev.filter(e => e.error.message !== data.error.message));
    });

    // Cleanup
    return () => {
      errorUnsub();
      consoleUnsub();
      resolvedUnsub();
    };
  }, []);

  return {
    editorSystem,
    errors,
    consoleLogs,
    clearErrors: () => setErrors([]),
    clearConsoleLogs: () => setConsoleLogs([]),
  };
}

/**
 * Hook to listen to hot reload events
 */
export function useHotReload() {
  const [lastUpdate, setLastUpdate] = useState<{ filePath: string; type: string } | null>(null);
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    const successUnsub = eventBus.on('hotReload:success', (data) => {
      setLastUpdate({ filePath: data.filePath, type: data.changeType });
      setIsReloading(false);
    });

    const errorUnsub = eventBus.on('hotReload:error', (data) => {
      console.error('Hot reload error:', data);
      setIsReloading(false);
    });

    const updateUnsub = eventBus.on('preview:update', () => {
      setIsReloading(true);
    });

    return () => {
      successUnsub();
      errorUnsub();
      updateUnsub();
    };
  }, []);

  return {
    lastUpdate,
    isReloading,
  };
}

/**
 * Hook to access AI features
 */
export function useAIAssistant() {
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const suggestionUnsub = eventBus.on('ai:suggestion', (suggestion) => {
      setAiSuggestions(prev => [...prev, suggestion]);
    });

    return () => {
      suggestionUnsub();
    };
  }, []);

  const requestFix = (error: any) => {
    eventBus.emit('ai:suggestFix', error);
  };

  const updateContext = (filePath: string, content: string) => {
    eventBus.emit('ai:updateContext', { filePath, content });
  };

  return {
    aiSuggestions,
    requestFix,
    updateContext,
    clearSuggestions: () => setAiSuggestions([]),
  };
}
