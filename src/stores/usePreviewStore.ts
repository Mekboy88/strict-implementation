/**
 * Preview Store - Manages preview state and UI updates
 * Simplified state management without external dependencies
 */

import { previewEngine, PreviewError } from "../core/PreviewEngine";

interface PreviewState {
  // Content
  desktopHtml: string;
  mobileHtml: string;

  // Status
  isBuilding: boolean;
  isReady: boolean;
  lastBuildTime: number | null;

  // Errors
  errors: PreviewError[];
  hasErrors: boolean;

  // Console
  consoleLogs: ConsoleLogEntry[];

  // Settings
  isMobile: boolean;
  autoReload: boolean;
}

interface ConsoleLogEntry {
  level: "log" | "warn" | "error" | "info";
  message: string;
  timestamp: number;
  args?: any[];
}

/**
 * Simple EventEmitter for state changes
 */
class StoreEmitter {
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(): void {
    this.listeners.forEach((listener) => listener());
  }
}

/**
 * Preview Store with reactive state management
 */
class PreviewStore {
  private emitter = new StoreEmitter();
  private state: PreviewState = {
    desktopHtml: "",
    mobileHtml: "",
    isBuilding: false,
    isReady: false,
    lastBuildTime: null,
    errors: [],
    hasErrors: false,
    consoleLogs: [],
    isMobile: false,
    autoReload: true,
  };

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Listen to PreviewEngine events
    previewEngine.on("preview:buildSuccess", (data) => {
      this.updateState({
        isBuilding: false,
        isReady: true,
        lastBuildTime: Date.now(),
      });
    });

    previewEngine.on("preview:updateQueued", (data) => {
      this.updateState({
        isBuilding: true,
      });
    });

    previewEngine.on("preview:runtimeError", (error: PreviewError) => {
      this.addError(error);
    });

    previewEngine.on("preview:consoleLog", (log) => {
      this.addConsoleLog(log);
    });
  }

  // State getters
  getState(): PreviewState {
    return { ...this.state };
  }

  subscribe(callback: () => void): () => void {
    return this.emitter.subscribe(callback);
  }

  // State update methods
  private updateState(updates: Partial<PreviewState>): void {
    this.state = { ...this.state, ...updates };
    this.emitter.emit();
  }

  // Content management
  setDesktopHtml(html: string): void {
    this.updateState({ desktopHtml: html });
  }

  setMobileHtml(html: string): void {
    this.updateState({ mobileHtml: html });
  }

  getCurrentHtml(): string {
    return this.state.isMobile ? this.state.mobileHtml : this.state.desktopHtml;
  }

  // Error management
  private addError(error: PreviewError): void {
    const newErrors = [...this.state.errors, error];
    this.updateState({
      errors: newErrors,
      hasErrors: newErrors.length > 0,
    });
  }

  clearErrors(): void {
    this.updateState({
      errors: [],
      hasErrors: false,
    });
  }

  getLatestError(): PreviewError | null {
    return this.state.errors.length > 0 ? this.state.errors[this.state.errors.length - 1] : null;
  }

  // Console management
  private addConsoleLog(log: ConsoleLogEntry): void {
    const newLogs = [...this.state.consoleLogs, log];
    // Keep only last 100 logs
    const trimmedLogs = newLogs.slice(-100);
    this.updateState({
      consoleLogs: trimmedLogs,
    });
  }

  clearConsoleLogs(): void {
    this.updateState({ consoleLogs: [] });
  }

  // Settings management
  setMobileMode(isMobile: boolean): void {
    this.updateState({ isMobile });
  }

  setAutoReload(enabled: boolean): void {
    this.updateState({ autoReload: enabled });
  }

  toggleMobileMode(): void {
    this.updateState({ isMobile: !this.state.isMobile });
  }

  // Utility methods
  isHealthy(): boolean {
    return this.state.isReady && !this.state.hasErrors;
  }

  getBuildDuration(): number | null {
    if (!this.state.lastBuildTime) return null;
    return Date.now() - this.state.lastBuildTime;
  }

  getConsoleLogsByLevel(level: ConsoleLogEntry["level"]): ConsoleLogEntry[] {
    return this.state.consoleLogs.filter((log) => log.level === level);
  }

  // File operations
  handleFileChange(filePath: string, content: string): void {
    if (!this.state.autoReload) return;

    // Trigger preview update
    previewEngine.liveUpdate(filePath, content);
  }

  // Manual operations
  forceReload(): void {
    this.updateState({
      isBuilding: true,
      lastBuildTime: Date.now(),
    });

    // Trigger a refresh (would be implemented by editor system)
    this.emitter.emit();
  }

  refresh(): void {
    this.clearErrors();
    this.clearConsoleLogs();
    this.forceReload();
  }

  // Reset
  reset(): void {
    this.updateState({
      desktopHtml: "",
      mobileHtml: "",
      isBuilding: false,
      isReady: false,
      lastBuildTime: null,
      errors: [],
      hasErrors: false,
      consoleLogs: [],
    });
  }
}

// Export singleton store
export const previewStore = new PreviewStore();

// React hook for convenient state access
export function usePreviewStore(): PreviewState {
  const [state, setState] = React.useState(previewStore.getState());

  React.useEffect(() => {
    const unsubscribe = previewStore.subscribe(() => {
      setState(previewStore.getState());
    });

    return unsubscribe;
  }, []);

  return state;
}

// Individual hooks for specific state pieces
export function usePreviewContent() {
  const [html, setHtml] = React.useState("");

  React.useEffect(() => {
    const unsubscribe = previewStore.subscribe(() => {
      setHtml(previewStore.getCurrentHtml());
    });

    return unsubscribe;
  }, []);

  return {
    html,
    setDesktopHtml: previewStore.setDesktopHtml.bind(previewStore),
    setMobileHtml: previewStore.setMobileHtml.bind(previewStore),
    getCurrentHtml: previewStore.getCurrentHtml.bind(previewStore),
  };
}

export function usePreviewStatus() {
  const [status, setStatus] = React.useState({
    isBuilding: false,
    isReady: false,
    hasErrors: false,
    lastBuildTime: null as number | null,
  });

  React.useEffect(() => {
    const unsubscribe = previewStore.subscribe(() => {
      const state = previewStore.getState();
      setStatus({
        isBuilding: state.isBuilding,
        isReady: state.isReady,
        hasErrors: state.hasErrors,
        lastBuildTime: state.lastBuildTime,
      });
    });

    return unsubscribe;
  }, []);

  return {
    ...status,
    isHealthy: previewStore.isHealthy(),
    getBuildDuration: previewStore.getBuildDuration(),
    forceReload: previewStore.forceReload.bind(previewStore),
    refresh: previewStore.refresh.bind(previewStore),
  };
}

export function usePreviewErrors() {
  const [errors, setErrors] = React.useState<PreviewError[]>([]);
  const [hasErrors, setHasErrors] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = previewStore.subscribe(() => {
      const state = previewStore.getState();
      setErrors(state.errors);
      setHasErrors(state.hasErrors);
    });

    return unsubscribe;
  }, []);

  return {
    errors,
    hasErrors,
    latestError: previewStore.getLatestError(),
    clearErrors: previewStore.clearErrors.bind(previewStore),
  };
}

export function usePreviewConsole() {
  const [logs, setLogs] = React.useState<ConsoleLogEntry[]>([]);

  React.useEffect(() => {
    const unsubscribe = previewStore.subscribe(() => {
      const state = previewStore.getState();
      setLogs(state.consoleLogs);
    });

    return unsubscribe;
  }, []);

  return {
    logs,
    clearLogs: previewStore.clearConsoleLogs.bind(previewStore),
    getLogsByLevel: previewStore.getConsoleLogsByLevel.bind(previewStore),
  };
}

export function usePreviewSettings() {
  const [settings, setSettings] = React.useState({
    isMobile: false,
    autoReload: true,
  });

  React.useEffect(() => {
    const unsubscribe = previewStore.subscribe(() => {
      const state = previewStore.getState();
      setSettings({
        isMobile: state.isMobile,
        autoReload: state.autoReload,
      });
    });

    return unsubscribe;
  }, []);

  return {
    ...settings,
    setMobileMode: previewStore.setMobileMode.bind(previewStore),
    setAutoReload: previewStore.setAutoReload.bind(previewStore),
    toggleMobileMode: previewStore.toggleMobileMode.bind(previewStore),
  };
}

// Helper hook for file change handling
export function useFileChangeHandler() {
  return previewStore.handleFileChange.bind(previewStore);
}

// Simple React-like utilities (if React is not available)
const React = {
  useState: function <T>(initial: T): [T, (value: T | ((prev: T) => T)) => void] {
    let state = initial;
    let setState: (value: T | ((prev: T) => T)) => void;

    setState = (value: T | ((prev: T) => T)) => {
      state = typeof value === "function" ? (value as (prev: T) => T)(state) : value;
      // In a real implementation, this would trigger re-renders
    };

    return [state, setState];
  },

  useEffect: function (effect: () => (() => void) | void, dependencies?: any[]): void {
    // In a real implementation, this would handle cleanup
    const cleanup = effect();
    if (typeof cleanup === "function") {
      // Register cleanup
    }
  },
};

if (typeof window !== "undefined") {
  (window as any).React = React;
}
