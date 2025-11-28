/**
 * Preview Manager
 *
 * Manages live preview state, iframe communication, and file synchronization
 * Handles real-time updates and error handling for the preview system
 */

import { previewEngine, PreviewError } from "../../core/PreviewEngine";
import { previewStore } from "../../stores/usePreviewStore";

interface PreviewSession {
  id: string;
  files: Map<string, string>;
  lastUpdated: number;
  isActive: boolean;
}

interface PreviewSettings {
  autoReload: boolean;
  showConsole: boolean;
  mobileMode: boolean;
  fullscreen: boolean;
}

/**
 * File Change Tracker - monitors file system changes
 */
class FileChangeTracker {
  private trackedFiles: Map<string, FileInfo> = new Map();
  private observers: FileSystemObserver[] = [];

  constructor() {
    this.setupFileSystemMonitoring();
  }

  private setupFileSystemMonitoring(): void {
    // In a real implementation, this would monitor actual file system
    // For demo purposes, we'll use a simple polling mechanism
    setInterval(() => {
      this.checkForChanges();
    }, 500);
  }

  trackFile(filePath: string, content: string): void {
    this.trackedFiles.set(filePath, {
      content,
      lastModified: Date.now(),
      isDirty: false,
    });
  }

  updateFile(filePath: string, content: string): boolean {
    const fileInfo = this.trackedFiles.get(filePath);
    if (!fileInfo) return false;

    const hasChanged = fileInfo.content !== content;
    if (hasChanged) {
      fileInfo.content = content;
      fileInfo.lastModified = Date.now();
      fileInfo.isDirty = true;
      return true;
    }
    return false;
  }

  private checkForChanges(): void {
    // Check tracked files for changes and notify preview engine
    this.trackedFiles.forEach((fileInfo, filePath) => {
      if (fileInfo.isDirty) {
        this.notifyPreviewChange(filePath, fileInfo.content);
        fileInfo.isDirty = false;
      }
    });
  }

  private notifyPreviewChange(filePath: string, content: string): void {
    console.log("[FileTracker] Notifying preview change:", filePath);
    previewEngine.liveUpdate(filePath, content);
  }

  getTrackedFiles(): string[] {
    return Array.from(this.trackedFiles.keys());
  }

  isTrackingFile(filePath: string): boolean {
    return this.trackedFiles.has(filePath);
  }
}

interface FileInfo {
  content: string;
  lastModified: number;
  isDirty: boolean;
}

interface FileSystemObserver {
  filePath: string;
  callback: (content: string) => void;
}

/**
 * Preview Communication Handler
 */
class PreviewCommunicator {
  private iframe: HTMLIFrameElement | null = null;
  private messageQueue: MessageQueueItem[] = [];
  private isIframeReady: boolean = false;

  setIframe(iframe: HTMLIFrameElement): void {
    this.iframe = iframe;
    this.setupMessageHandling();
  }

  private setupMessageHandling(): void {
    if (!this.iframe) return;

    window.addEventListener("message", (event) => {
      if (event.source !== this.iframe?.contentWindow) return;

      const { type, data } = event.data;

      switch (type) {
        case "preview:ready":
          this.isIframeReady = true;
          this.processMessageQueue();
          break;

        case "preview:error":
          this.handleIframeError(data);
          break;

        case "preview:console":
          this.handleIframeConsole(data);
          break;

        case "preview:build-status":
          this.handleBuildStatus(data);
          break;
      }
    });
  }

  sendToIframe(message: any): void {
    if (!this.iframe || !this.isIframeReady) {
      this.messageQueue.push(message);
      return;
    }

    this.iframe.contentWindow?.postMessage(message, "*");
  }

  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!;
      this.sendToIframe(message);
    }
  }

  private handleIframeError(error: any): void {
    console.error("[Communicator] Iframe error:", error);

    const previewError: PreviewError = {
      message: error.message || "Preview runtime error",
      stack: error.stack,
      source: "preview-iframe",
      timestamp: Date.now(),
    };

    previewEngine.handleRuntimeError(previewError);
  }

  private handleIframeConsole(log: any): void {
    console.log("[Communicator] Iframe console:", log);
    previewEngine.captureConsoleLog(log);
  }

  private handleBuildStatus(status: any): void {
    console.log("[Communicator] Build status:", status);
    // Update UI with build status
  }
}

interface MessageQueueItem {
  type: string;
  data: any;
  timestamp: number;
}

/**
 * Main Preview Manager
 */
export class PreviewManager {
  private session: PreviewSession;
  private fileTracker: FileChangeTracker = new FileChangeTracker();
  private communicator: PreviewCommunicator = new PreviewCommunicator();
  private settings: PreviewSettings = {
    autoReload: true,
    showConsole: true,
    mobileMode: false,
    fullscreen: false,
  };

  constructor() {
    this.session = this.createNewSession();
    this.setupEventHandlers();
  }

  private createNewSession(): PreviewSession {
    return {
      id: this.generateSessionId(),
      files: new Map(),
      lastUpdated: Date.now(),
      isActive: true,
    };
  }

  private generateSessionId(): string {
    return `preview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupEventHandlers(): void {
    // Handle file changes from editor
    previewEngine.on("preview:updateQueued", (data) => {
      this.updateSessionTimestamp();
    });

    // Handle build success
    previewEngine.on("preview:buildSuccess", (data) => {
      this.handleBuildSuccess();
    });

    // Handle errors
    previewEngine.on("preview:runtimeError", (error) => {
      this.handlePreviewError(error);
    });
  }

  /**
   * Initialize preview with entry files
   */
  initialize(entryFiles: Record<string, string>): void {
    console.log("[PreviewManager] Initializing with", Object.keys(entryFiles).length, "files");

    // Track all entry files
    Object.entries(entryFiles).forEach(([filePath, content]) => {
      this.trackFile(filePath, content);
    });

    // Set up iframe communication
    this.setupIframeCommunication();

    // Trigger initial build
    this.triggerInitialBuild(entryFiles);
  }

  private triggerInitialBuild(files: Record<string, string>): void {
    const mainFiles = this.findMainFiles(files);
    mainFiles.forEach((filePath) => {
      previewEngine.liveUpdate(filePath, files[filePath]);
    });
  }

  private findMainFiles(files: Record<string, string>): string[] {
    const mainFiles: string[] = [];

    Object.keys(files).forEach((filePath) => {
      if (filePath.includes("main.tsx") || filePath.includes("App.tsx") || filePath.includes("page.tsx")) {
        mainFiles.push(filePath);
      }
    });

    return mainFiles;
  }

  private setupIframeCommunication(): void {
    // This would be called when the iframe is created
    // In a real implementation, the iframe reference would be passed here
  }

  /**
   * Track a file for preview updates
   */
  trackFile(filePath: string, content: string): void {
    this.session.files.set(filePath, content);
    this.fileTracker.trackFile(filePath, content);
    this.updateSessionTimestamp();
  }

  /**
   * Update file content and trigger preview if needed
   */
  updateFile(filePath: string, content: string): boolean {
    const wasUpdated = this.fileTracker.updateFile(filePath, content);

    if (wasUpdated) {
      this.session.files.set(filePath, content);
      this.updateSessionTimestamp();

      if (this.settings.autoReload) {
        this.handleFileChange(filePath, content);
      }
    }

    return wasUpdated;
  }

  private handleFileChange(filePath: string, content: string): void {
    console.log("[PreviewManager] Handling file change:", filePath);

    // Determine the type of change and handle accordingly
    const fileType = this.getFileType(filePath);

    switch (fileType) {
      case "entry":
        this.handleEntryFileChange(filePath, content);
        break;
      case "component":
        this.handleComponentChange(filePath, content);
        break;
      case "style":
        this.handleStyleChange(filePath, content);
        break;
      default:
        this.handleGenericChange(filePath, content);
    }
  }

  private getFileType(filePath: string): "entry" | "component" | "style" | "config" | "other" {
    if (filePath.includes("main.tsx") || filePath.includes("App.tsx") || filePath.includes("page.tsx")) {
      return "entry";
    }
    if (filePath.includes("/components/") || filePath.endsWith(".tsx")) {
      return "component";
    }
    if (filePath.endsWith(".css") || filePath.endsWith(".scss")) {
      return "style";
    }
    if (filePath.includes("config.") || filePath.includes("vite.config") || filePath.includes("tailwind.config")) {
      return "config";
    }
    return "other";
  }

  private handleEntryFileChange(filePath: string, content: string): void {
    // Entry file changes trigger full rebuild
    console.log("[PreviewManager] Entry file changed:", filePath);
    previewEngine.liveUpdate(filePath, content);
  }

  private handleComponentChange(filePath: string, content: string): void {
    // Component changes can use hot reload
    console.log("[PreviewManager] Component changed:", filePath);
    previewEngine.liveUpdate(filePath, content);
  }

  private handleStyleChange(filePath: string, content: string): void {
    // Style changes can use hot reload with CSS injection
    console.log("[PreviewManager] Style changed:", filePath);
    previewEngine.liveUpdate(filePath, content);
  }

  private handleGenericChange(filePath: string, content: string): void {
    // Generic changes trigger appropriate updates
    console.log("[PreviewManager] Generic file changed:", filePath);
    previewEngine.liveUpdate(filePath, content);
  }

  /**
   * Set preview settings
   */
  setSettings(settings: Partial<PreviewSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.updateSessionTimestamp();

    // Apply settings immediately
    if (settings.mobileMode !== undefined) {
      this.toggleMobileMode(settings.mobileMode);
    }
  }

  /**
   * Toggle mobile/desktop preview mode
   */
  toggleMobileMode(enabled?: boolean): void {
    const mobileMode = enabled !== undefined ? enabled : !this.settings.mobileMode;
    this.settings.mobileMode = mobileMode;

    // Update store
    previewStore.setMobileMode(mobileMode);

    // Notify iframe
    this.communicator.sendToIframe({
      type: "preview:toggle-mobile",
      data: { enabled: mobileMode },
    });
  }

  /**
   * Force preview refresh
   */
  forceRefresh(): void {
    console.log("[PreviewManager] Forcing preview refresh");
    this.session.files.forEach((content, filePath) => {
      previewEngine.liveUpdate(filePath, content);
    });
  }

  /**
   * Clear preview and reset
   */
  clear(): void {
    console.log("[PreviewManager] Clearing preview");
    this.session.files.clear();
    this.fileTracker = new FileChangeTracker();
    this.communicator = new PreviewCommunicator();
    this.session = this.createNewSession();

    // Clear store
    previewStore.reset();
  }

  /**
   * Get current session info
   */
  getSessionInfo(): PreviewSession {
    return { ...this.session };
  }

  /**
   * Check if preview is healthy
   */
  isHealthy(): boolean {
    const state = previewStore.getState();
    return state.isReady && !state.hasErrors;
  }

  private updateSessionTimestamp(): void {
    this.session.lastUpdated = Date.now();
  }

  private handleBuildSuccess(): void {
    console.log("[PreviewManager] Build completed successfully");
    this.session.isActive = true;
  }

  private handlePreviewError(error: PreviewError): void {
    console.error("[PreviewManager] Preview error:", error);
    this.session.isActive = false;
  }

  /**
   * Get all tracked files
   */
  getTrackedFiles(): string[] {
    return this.fileTracker.getTrackedFiles();
  }

  /**
   * Check if a file is being tracked
   */
  isFileTracked(filePath: string): boolean {
    return this.fileTracker.isTrackingFile(filePath);
  }

  /**
   * Set iframe reference for communication
   */
  setIframe(iframe: HTMLIFrameElement): void {
    this.communicator.setIframe(iframe);
  }
}

// Export singleton instance
export const previewManager = new PreviewManager();

/**
 * Helper function to detect file change intent
 */
export const detectFileChangeIntent = (message: string, currentFiles: Record<string, string>): string | null => {
  const lower = message.toLowerCase().trim();

  // File change patterns
  const patterns = [
    /update\s+([^\s]+)/i,
    /modify\s+([^\s]+)/i,
    /change\s+([^\s]+)/i,
    /edit\s+([^\s]+)/i,
    /update\s+file\s+([^\s]+)/i,
  ];

  for (const pattern of patterns) {
    const match = lower.match(pattern);
    if (match && match[1]) {
      const fileName = match[1];
      // Check if this matches any tracked file
      const matchingFile = Object.keys(currentFiles).find(
        (path) => path.includes(fileName) || fileName.includes(path.split("/").pop() || ""),
      );
      if (matchingFile) {
        return matchingFile;
      }
    }
  }

  return null;
};

/**
 * Helper function to determine if a file should trigger preview update
 */
export const shouldTriggerPreviewUpdate = (filePath: string, content: string): boolean => {
  // Don't trigger for temporary files or certain patterns
  if (filePath.includes(".tmp") || filePath.includes(".backup") || filePath.includes("node_modules")) {
    return false;
  }

  // Always trigger for these file types
  const triggerFileTypes = [".tsx", ".ts", ".jsx", ".js", ".css", ".html"];
  return triggerFileTypes.some((ext) => filePath.endsWith(ext));
};
