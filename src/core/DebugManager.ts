import { eventBus } from './EventBus';

interface ErrorLog {
  message: string;
  filename?: string;
  line?: number;
  column?: number;
  stack?: string;
  timestamp: number;
}

interface NetworkRequest {
  type: string;
  url: string;
  status: string;
  timestamp: number;
  duration?: number;
  error?: string;
  statusCode?: number;
}

interface BuildLog {
  event: string;
  data: any;
  timestamp: number;
}

interface FileChange {
  type: string;
  element: string;
  timestamp: number;
}

/**
 * Comprehensive debugging manager for the editor system
 */
export class DebugManager {
  private consoleErrors: ErrorLog[] = [];
  private cssErrors: Array<{ href: string; status: string }> = [];
  private networkRequests: NetworkRequest[] = [];
  private buildLogs: BuildLog[] = [];
  private fileChanges: FileChange[] = [];
  private hotReloadLogs: Array<{ timestamp: number; message: string; args: any[] }> = [];
  private communicationLog: Array<{ timestamp: number; source: string; data: any }> = [];
  
  private observers: MutationObserver[] = [];
  private isMonitoring: boolean = false;

  constructor() {
    this.setupGlobalErrorHandling();
  }

  /**
   * Start all debugging monitors
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.setupCSSErrorDetection();
    this.setupNetworkInterception();
    this.setupDOMObserver();
    this.setupMessageListener();
    this.setupHotReloadMonitoring();
    
    eventBus.emit('debug:monitoring-started', {
      timestamp: Date.now()
    });
  }

  /**
   * Stop all debugging monitors
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    
    eventBus.emit('debug:monitoring-stopped', {
      timestamp: Date.now()
    });
  }

  /**
   * Setup global error handling
   */
  private setupGlobalErrorHandling(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (e) => {
      const errorLog: ErrorLog = {
        message: e.message,
        filename: e.filename,
        line: e.lineno,
        column: e.colno,
        stack: e.error?.stack,
        timestamp: Date.now()
      };
      
      this.consoleErrors.push(errorLog);
      eventBus.emit('debug:console-error', errorLog);
    });

    window.addEventListener('unhandledrejection', (e) => {
      const errorLog: ErrorLog = {
        message: e.reason?.message || String(e.reason),
        stack: e.reason?.stack,
        timestamp: Date.now()
      };
      
      this.consoleErrors.push(errorLog);
      eventBus.emit('debug:unhandled-rejection', errorLog);
    });
  }

  /**
   * Setup CSS error detection
   */
  private setupCSSErrorDetection(): void {
    if (typeof document === 'undefined') return;

    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const linkElement = link as HTMLLinkElement;
      linkElement.onerror = () => {
        const cssError = {
          href: linkElement.href,
          status: 'Failed to load CSS'
        };
        this.cssErrors.push(cssError);
        eventBus.emit('debug:css-error', cssError);
      };
    });
  }

  /**
   * Setup network request interception
   */
  private setupNetworkInterception(): void {
    if (typeof window === 'undefined') return;

    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = (...args: Parameters<typeof fetch>) => {
      const startTime = performance.now();
      const url = args[0] instanceof Request ? args[0].url : String(args[0]);
      
      this.logNetworkRequest('fetch', url, 'started');
      
      return originalFetch(...args)
        .then(response => {
          const endTime = performance.now();
          this.logNetworkRequest('fetch', url, 'completed', {
            statusCode: response.status,
            duration: endTime - startTime
          });
          return response;
        })
        .catch(error => {
          const endTime = performance.now();
          this.logNetworkRequest('fetch', url, 'failed', {
            error: error.message,
            duration: endTime - startTime
          });
          throw error;
        });
    };
  }

  /**
   * Log network request
   */
  private logNetworkRequest(type: string, url: string, status: string, details: any = {}): void {
    const request: NetworkRequest = {
      type,
      url,
      status,
      timestamp: Date.now(),
      ...details
    };
    
    this.networkRequests.push(request);
    eventBus.emit('debug:network-request', request);
  }

  /**
   * Setup DOM mutation observer
   */
  private setupDOMObserver(): void {
    if (typeof document === 'undefined') return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const change: FileChange = {
                type: 'added',
                element: element.tagName,
                timestamp: Date.now()
              };
              this.fileChanges.push(change);
              eventBus.emit('debug:file-change', change);
            }
          });
        }
      });
    });

    if (document.head) observer.observe(document.head, { childList: true });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    
    this.observers.push(observer);
  }

  /**
   * Setup message listener for iframe communication
   */
  private setupMessageListener(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('message', (event) => {
      const logEntry = {
        timestamp: Date.now(),
        source: event.origin,
        data: event.data
      };
      
      this.communicationLog.push(logEntry);
      eventBus.emit('debug:message', logEntry);
    });
  }

  /**
   * Setup hot reload monitoring
   */
  private setupHotReloadMonitoring(): void {
    // Listen to hot reload events from the system
    eventBus.on('hotReload:success', (data) => {
      this.logHotReload('HMR: Module accepted', data);
    });

    eventBus.on('hotReload:error', (data) => {
      this.logHotReload('HMR: Error occurred', data);
    });

    eventBus.on('preview:update', (data) => {
      this.logHotReload('Preview updated', data);
    });
  }

  /**
   * Log hot reload event
   */
  private logHotReload(message: string, ...args: any[]): void {
    const logEntry = {
      timestamp: Date.now(),
      message,
      args
    };
    
    this.hotReloadLogs.push(logEntry);
    eventBus.emit('debug:hot-reload', logEntry);
  }

  /**
   * Verify file loading status
   */
  verifyFileLoading(): { html: boolean; css: boolean; js: boolean } {
    if (typeof document === 'undefined') {
      return { html: false, css: false, js: false };
    }

    const checks = {
      html: document.readyState === 'complete',
      css: Array.from(document.styleSheets).length > 0,
      js: true
    };
    
    eventBus.emit('debug:file-loading-check', checks);
    return checks;
  }

  /**
   * Check file paths
   */
  checkFilePaths(): {
    css: string[];
    js: string[];
    img: string[];
  } {
    if (typeof document === 'undefined') {
      return { css: [], js: [], img: [] };
    }

    const paths = {
      css: Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(
        (link: any) => link.href
      ),
      js: Array.from(document.querySelectorAll('script')).map(
        (script: any) => script.src
      ).filter(Boolean),
      img: Array.from(document.querySelectorAll('img')).map(
        (img: any) => img.src
      ).filter(Boolean)
    };

    eventBus.emit('debug:file-paths', paths);
    return paths;
  }

  /**
   * Run health check
   */
  runHealthCheck(): {
    documentReady: string;
    bodyFound: boolean;
    scriptsCount: number;
    stylesheetsCount: number;
  } {
    if (typeof document === 'undefined') {
      return {
        documentReady: 'unknown',
        bodyFound: false,
        scriptsCount: 0,
        stylesheetsCount: 0
      };
    }

    const health = {
      documentReady: document.readyState,
      bodyFound: !!document.body,
      scriptsCount: document.querySelectorAll('script').length,
      stylesheetsCount: document.querySelectorAll('link[rel="stylesheet"]').length
    };

    eventBus.emit('debug:health-check', health);
    return health;
  }

  /**
   * Get console errors
   */
  getConsoleErrors(): ErrorLog[] {
    return [...this.consoleErrors];
  }

  /**
   * Get CSS errors
   */
  getCSSErrors(): Array<{ href: string; status: string }> {
    return [...this.cssErrors];
  }

  /**
   * Get network requests
   */
  getNetworkRequests(): NetworkRequest[] {
    return [...this.networkRequests];
  }

  /**
   * Get failed network requests
   */
  getFailedRequests(): NetworkRequest[] {
    return this.networkRequests.filter(req => req.status === 'failed');
  }

  /**
   * Get build logs
   */
  getBuildLogs(): BuildLog[] {
    return [...this.buildLogs];
  }

  /**
   * Get file changes
   */
  getFileChanges(recentOnly: boolean = false): FileChange[] {
    if (recentOnly) {
      const fiveSecondsAgo = Date.now() - 5000;
      return this.fileChanges.filter(change => change.timestamp > fiveSecondsAgo);
    }
    return [...this.fileChanges];
  }

  /**
   * Get hot reload logs
   */
  getHotReloadLogs(): typeof this.hotReloadLogs {
    return [...this.hotReloadLogs];
  }

  /**
   * Get communication logs
   */
  getCommunicationLogs(): typeof this.communicationLog {
    return [...this.communicationLog];
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.consoleErrors = [];
    this.cssErrors = [];
    this.networkRequests = [];
    this.buildLogs = [];
    this.fileChanges = [];
    this.hotReloadLogs = [];
    this.communicationLog = [];
    
    eventBus.emit('debug:logs-cleared', { timestamp: Date.now() });
  }

  /**
   * Export debug data
   */
  exportDebugData(): string {
    const data = {
      timestamp: Date.now(),
      consoleErrors: this.consoleErrors,
      cssErrors: this.cssErrors,
      networkRequests: this.networkRequests,
      buildLogs: this.buildLogs,
      fileChanges: this.fileChanges,
      hotReloadLogs: this.hotReloadLogs,
      communicationLog: this.communicationLog,
      healthCheck: this.runHealthCheck(),
      fileLoading: this.verifyFileLoading(),
      filePaths: this.checkFilePaths()
    };

    return JSON.stringify(data, null, 2);
  }
}
