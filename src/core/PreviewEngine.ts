import { eventBus } from './EventBus';
import { HotReloadManager } from './HotReloadManager';

interface BuildTask {
  filePath: string;
  content: string;
  priority: number;
}

export interface PreviewError {
  message: string;
  stack?: string;
  source: string;
  line?: number;
  column?: number;
}

/**
 * Enhanced preview engine with hot reload and error capture
 */
export class PreviewEngine {
  private buildQueue: BuildTask[] = [];
  private hotReloader: HotReloadManager = new HotReloadManager();
  private processing: boolean = false;
  private currentHtml: string = '';

  constructor() {
    this.setupListeners();
  }

  private setupListeners(): void {
    // Listen for editor changes
    eventBus.on('editor:change', (data) => {
      this.liveUpdate(data.filePath, data.content);
    });

    // Listen for hot reload events
    eventBus.on('hotReload:success', (data) => {
      console.log('Hot reload successful:', data.filePath);
    });

    eventBus.on('hotReload:error', (data) => {
      this.handleBuildError(new Error(data.error), data.filePath);
    });
  }

  liveUpdate(filePath: string, newContent: string): void {
    const priority = this.getPriority(filePath);
    
    this.buildQueue.push({
      filePath,
      content: newContent,
      priority
    });

    // Sort by priority (higher first)
    this.buildQueue.sort((a, b) => b.priority - a.priority);

    this.processBuildQueue();
  }

  private async processBuildQueue(): Promise<void> {
    if (this.processing || this.buildQueue.length === 0) return;
    
    this.processing = true;

    while (this.buildQueue.length > 0) {
      const task = this.buildQueue.shift()!;
      
      try {
        await this.processTask(task);
      } catch (error) {
        this.handleBuildError(error as Error, task.filePath);
      }
    }

    this.processing = false;
  }

  private async processTask(task: BuildTask): Promise<void> {
    // Trigger hot reload
    this.hotReloader.processChange(task.filePath, task.content);
    
    // Update preview
    eventBus.emit('preview:update', {
      filePath: task.filePath,
      content: task.content,
      timestamp: Date.now()
    });
  }

  private getPriority(filePath: string): number {
    // Entry points get highest priority
    if (filePath.includes('index.') || filePath.includes('main.') || filePath.includes('App.')) {
      return 100;
    }
    
    // Page components
    if (filePath.includes('/pages/') || filePath.includes('page.tsx')) {
      return 80;
    }
    
    // Regular components
    if (filePath.includes('/components/')) {
      return 60;
    }
    
    // Styles
    if (filePath.endsWith('.css')) {
      return 40;
    }
    
    // Everything else
    return 20;
  }

  handleRuntimeError(error: PreviewError): void {
    console.error('Preview runtime error:', error);
    
    eventBus.emit('preview:runtimeError', {
      message: error.message,
      stack: error.stack,
      source: error.source,
      line: error.line,
      column: error.column,
      timestamp: Date.now()
    });

    // Request AI assistance for the error
    eventBus.emit('ai:diagnoseError', error);
  }

  private handleBuildError(error: Error, filePath: string): void {
    const previewError: PreviewError = {
      message: error.message,
      stack: error.stack,
      source: filePath
    };

    this.handleRuntimeError(previewError);
  }

  captureConsoleLog(log: { level: string; args: any[] }): void {
    eventBus.emit('preview:consoleLog', {
      level: log.level,
      args: log.args,
      timestamp: Date.now()
    });
  }

  setPreviewHtml(html: string): void {
    this.currentHtml = html;
    eventBus.emit('preview:htmlUpdated', { html });
  }

  getPreviewHtml(): string {
    return this.currentHtml;
  }

  clear(): void {
    this.buildQueue = [];
    this.currentHtml = '';
  }
}
