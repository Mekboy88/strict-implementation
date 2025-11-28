/**
 * Enhanced Preview Engine with Complete Hot Reload & Error Handling
 * Handles real-time preview updates, iframe communication, and error management
 */

import { bundleForPreview } from "../utils/preview/bundler";

interface BuildTask {
  filePath: string;
  content: string;
  priority: number;
  timestamp: number;
}

export interface PreviewError {
  message: string;
  stack?: string;
  source: string;
  line?: number;
  column?: number;
  timestamp: number;
}

export interface PreviewUpdate {
  type: "success" | "error" | "building";
  filePath?: string;
  content?: string;
  error?: string;
  timestamp: number;
}

type EventCallback = (data: any) => void;

/**
 * Simple Event Bus for component communication
 */
class EventBus {
  private events: Map<string, EventCallback[]> = new Map();

  on(event: string, callback: EventCallback): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, data?: any): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }
}

/**
 * Hot Reload Manager for detecting and handling file changes
 */
class HotReloadManager {
  private changedFiles: Map<string, string> = new Map();

  processChange(filePath: string, content: string): void {
    console.log("[HotReload] Processing change:", filePath);

    this.changedFiles.set(filePath, {
      content,
      timestamp: Date.now(),
    });
  }

  getChangedFiles(): Array<{ filePath: string; content: string; timestamp: number }> {
    const result: Array<{ filePath: string; content: string; timestamp: number }> = [];

    this.changedFiles.forEach((value, key) => {
      result.push({
        filePath: key,
        content: value.content,
        timestamp: value.timestamp,
      });
    });

    this.changedFiles.clear();
    return result;
  }
}

/**
 * Main Preview Engine
 */
export class PreviewEngine {
  private buildQueue: BuildTask[] = [];
  private hotReloader: HotReloadManager = new HotReloadManager();
  private eventBus: EventBus = new EventBus();
  private processing: boolean = false;
  private iframe: HTMLIFrameElement | null = null;
  private currentBuildId: number = 0;
  private pendingUpdates: Map<string, string> = new Map();

  constructor() {
    this.setupPreviewIframe();
    this.startBuildProcessor();
  }

  private setupPreviewIframe(): void {
    // Listen for messages from preview iframe
    window.addEventListener("message", (event) => {
      if (event.data && event.data.type === "preview:ready") {
        console.log("[PreviewEngine] Preview iframe is ready");
        this.eventBus.emit("preview:ready", event.data);
      } else if (event.data && event.data.type === "preview:error") {
        this.handleRuntimeError(event.data.error);
      } else if (event.data && event.data.type === "preview:console") {
        this.captureConsoleLog(event.data.log);
      }
    });
  }

  private startBuildProcessor(): void {
    // Process build queue every 100ms
    setInterval(() => {
      this.processBuildQueue();
    }, 100);
  }

  /**
   * Main method for updating preview with new file content
   */
  liveUpdate(filePath: string, newContent: string): void {
    const priority = this.calculatePriority(filePath);

    // Add to build queue
    this.buildQueue.push({
      filePath,
      content: newContent,
      priority,
      timestamp: Date.now(),
    });

    // Sort by priority (higher first)
    this.buildQueue.sort((a, b) => b.priority - a.priority);

    // Also track pending updates for immediate feedback
    this.pendingUpdates.set(filePath, newContent);

    console.log("[PreviewEngine] Queued update for:", filePath, "Priority:", priority);
    this.eventBus.emit("preview:updateQueued", { filePath, priority });
  }

  private async processBuildQueue(): Promise<void> {
    if (this.processing || this.buildQueue.length === 0) return;

    this.processing = true;
    const currentBuildId = ++this.currentBuildId;

    console.log(`[PreviewEngine] Starting build #${currentBuildId} with ${this.buildQueue.length} tasks`);

    try {
      // Group related updates
      const groupedUpdates = this.groupRelatedUpdates();

      // Process each group
      for (const group of groupedUpdates) {
        if (!this.shouldProcessGroup(group, currentBuildId)) continue;

        await this.processUpdateGroup(group);
      }

      console.log(`[PreviewEngine] Build #${currentBuildId} completed successfully`);
      this.eventBus.emit("preview:buildSuccess", { buildId: currentBuildId });
    } catch (error) {
      console.error(`[PreviewEngine] Build #${currentBuildId} failed:`, error);
      this.handleBuildError(error as Error, "build process");
    } finally {
      this.buildQueue = [];
      this.processing = false;
    }
  }

  private groupRelatedUpdates(): BuildTask[][] {
    const groups: BuildTask[][] = [];

    while (this.buildQueue.length > 0) {
      const task = this.buildQueue.shift()!;
      const relatedGroup = [task];

      // Find related tasks (same directory or import dependencies)
      this.buildQueue = this.buildQueue.filter((other) => {
        if (this.areRelatedTasks(task, other)) {
          relatedGroup.push(other);
          return false;
        }
        return true;
      });

      groups.push(relatedGroup);
    }

    return groups;
  }

  private areRelatedTasks(task1: BuildTask, task2: BuildTask): boolean {
    // Same directory
    if (task1.filePath.split("/").slice(0, -1).join("/") === task2.filePath.split("/").slice(0, -1).join("/")) {
      return true;
    }

    // Import dependency (simplified check)
    if (task1.content.includes(task2.filePath) || task2.content.includes(task1.filePath)) {
      return true;
    }

    return false;
  }

  private shouldProcessGroup(group: BuildTask[], currentBuildId: number): boolean {
    // Only process if this is still the latest build
    return currentBuildId === this.currentBuildId;
  }

  private async processUpdateGroup(group: BuildTask[]): Promise<void> {
    const files: Record<string, string> = {};

    // Collect all files for bundling
    group.forEach((task) => {
      files[task.filePath] = task.content;
    });

    // Determine entry point
    const entryPoint = this.findEntryPoint(group);

    try {
      // Bundle the code
      const bundledCode = bundleForPreview(files, entryPoint);

      // Send to iframe
      await this.updatePreviewIframe(bundledCode);

      console.log("[PreviewEngine] Updated preview with", group.length, "files");
    } catch (error) {
      this.handleBuildError(error as Error, entryPoint);
    }
  }

  private findEntryPoint(group: BuildTask[]): string {
    // Priority: main.tsx > App.tsx > page.tsx > first file
    for (const task of group) {
      if (task.filePath.includes("main.tsx")) return task.filePath;
    }

    for (const task of group) {
      if (task.filePath.includes("App.tsx")) return task.filePath;
    }

    for (const task of group) {
      if (task.filePath.includes("page.tsx")) return task.filePath;
    }

    return group[0]?.filePath || "src/main.tsx";
  }

  private async updatePreviewIframe(bundledCode: string): Promise<void> {
    if (!this.iframe) {
      this.createPreviewIframe();
    }

    if (this.iframe && this.iframe.contentWindow) {
      // Send code to iframe
      this.iframe.contentWindow.postMessage(
        {
          type: "preview:update",
          code: bundledCode,
          timestamp: Date.now(),
        },
        "*",
      );
    }
  }

  private createPreviewIframe(): void {
    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.src = "about:blank";

    // Set up iframe HTML
    const iframeHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; font-family: system-ui; }
          #root { min-height: 100vh; }
        </style>
      </head>
      <body>
        <div id="root">Loading...</div>
        <script>
          // Listen for preview updates
          window.addEventListener('message', function(event) {
            if (event.data.type === 'preview:update') {
              try {
                // Clear old code
                document.body.innerHTML = '<div id="root">Loading...</div>';
                
                // Execute new code
                eval(event.data.code);
                
                // Try to render the component
                if (typeof window.__PREVIEW_RENDER__ === 'function') {
                  const root = document.getElementById('root');
                  if (root) {
                    try {
                      window.__PREVIEW_RENDER__(root);
                    } catch (renderError) {
                      console.error('Render error:', renderError);
                      root.innerHTML = '<div style="color: red; padding: 20px;">Render Error: ' + renderError.message + '</div>';
                    }
                  }
                }
                
                // Notify parent that we're ready
                parent.postMessage({
                  type: 'preview:ready',
                  timestamp: Date.now()
                }, '*');
                
              } catch (evalError) {
                console.error('Preview evaluation error:', evalError);
                parent.postMessage({
                  type: 'preview:error',
                  error: {
                    message: evalError.message,
                    stack: evalError.stack
                  }
                }, '*');
              }
            }
          });
          
          // Notify parent we're ready
          parent.postMessage({
            type: 'preview:ready',
            timestamp: Date.now()
          }, '*');
        </script>
      </body>
      </html>
    `;

    // Write HTML to iframe
    const blob = new Blob([iframeHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframe.src = url;

    this.iframe = iframe;
  }

  private calculatePriority(filePath: string): number {
    // Entry files get highest priority
    if (filePath.includes("main.tsx") || filePath.includes("App.tsx")) return 100;

    // Page files
    if (filePath.includes("page.tsx")) return 90;

    // Component files
    if (filePath.includes("/components/")) return 80;

    // Layout files
    if (filePath.includes("layout.tsx")) return 70;

    // Style files
    if (filePath.endsWith(".css") || filePath.endsWith(".scss")) return 60;

    // Config files
    if (filePath.includes("config.") || filePath.includes("vite.config.") || filePath.includes("tailwind.config."))
      return 50;

    // Other files
    return 30;
  }

  handleRuntimeError(error: PreviewError): void {
    console.error("[PreviewEngine] Runtime error:", error);

    this.eventBus.emit("preview:runtimeError", {
      ...error,
      timestamp: error.timestamp || Date.now(),
    });
  }

  private handleBuildError(error: Error, filePath: string): void {
    const previewError: PreviewError = {
      message: error.message,
      stack: error.stack,
      source: filePath,
      timestamp: Date.now(),
    };

    this.handleRuntimeError(previewError);
  }

  captureConsoleLog(log: { level: string; args: any[]; timestamp: number }): void {
    this.eventBus.emit("preview:consoleLog", log);
  }

  setPreviewIframe(iframe: HTMLIFrameElement): void {
    this.iframe = iframe;
  }

  getPreviewIframe(): HTMLIFrameElement | null {
    return this.iframe;
  }

  clear(): void {
    this.buildQueue = [];
    this.pendingUpdates.clear();
    this.currentBuildId = 0;
  }

  // Event system
  on(event: string, callback: EventCallback): void {
    this.eventBus.on(event, callback);
  }

  off(event: string, callback: EventCallback): void {
    this.eventBus.off(event, callback);
  }

  emit(event: string, data?: any): void {
    this.eventBus.emit(event, data);
  }
}

// Export singleton instance
export const previewEngine = new PreviewEngine();
