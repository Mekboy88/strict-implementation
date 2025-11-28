import { FileTreeManager } from './FileTreeManager';
import { CodeEditor } from './CodeEditor';
import { PreviewEngine } from './PreviewEngine';
import { HotReloadManager } from './HotReloadManager';
import { ErrorHandler } from './ErrorHandler';
import { CommunicationHub } from './CommunicationHub';
import { DebugManager } from './DebugManager';
import { eventBus } from './EventBus';

/**
 * Main application controller that orchestrates all system components
 */
export class EditorSystem {
  public fileTree: FileTreeManager;
  public codeEditor: CodeEditor;
  public previewEngine: PreviewEngine;
  public hotReload: HotReloadManager;
  public errorHandler: ErrorHandler;
  public debugManager: DebugManager;
  private communicationHub: CommunicationHub;

  constructor() {
    // Initialize all subsystems
    this.fileTree = new FileTreeManager();
    this.codeEditor = new CodeEditor();
    this.previewEngine = new PreviewEngine();
    this.hotReload = new HotReloadManager();
    this.errorHandler = new ErrorHandler();
    this.debugManager = new DebugManager();
    this.communicationHub = new CommunicationHub();

    this.initializeCommunication();
    
    // Start debugging automatically
    this.debugManager.startMonitoring();
  }

  private initializeCommunication(): void {
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // File changes → Update all components
    eventBus.on('fileTreeChanged', (data) => {
      if (data.event === 'fileUpdated') {
        this.codeEditor.updateFile(data.filePath, data.content);
        this.previewEngine.liveUpdate(data.filePath, data.content);
      }
    });

    // Editor changes → Hot reload
    eventBus.on('editor:change', (data) => {
      this.hotReload.processChange(data.filePath, data.content);
    });

    // Preview errors → Handle and suggest fixes
    eventBus.on('preview:runtimeError', (error) => {
      this.errorHandler.handleError(error, 'runtime');
    });

    // Editor errors → Handle
    eventBus.on('editor:errors', (data) => {
      data.errors.forEach((error: any) => {
        this.errorHandler.handleError(error);
      });
    });
  }

  // Public API for external usage
  createFile(filePath: string, content: string = ''): void {
    this.fileTree.createFile(filePath, content);
  }

  updateFile(filePath: string, content: string): void {
    this.fileTree.updateFile(filePath, content);
  }

  deleteFile(filePath: string): void {
    this.fileTree.deleteFile(filePath);
  }

  setActiveFile(filePath: string, content: string): void {
    this.codeEditor.setActiveFile(filePath, content);
  }

  getFileContent(filePath: string): string | undefined {
    return this.fileTree.getFileContent(filePath);
  }

  getAllFiles(): Map<string, any> {
    return this.fileTree.getAllFiles();
  }

  getPreviewIframe(): HTMLIFrameElement | null {
    return this.previewEngine.getPreviewIframe();
  }

  setPreviewIframe(iframe: HTMLIFrameElement): void {
    this.previewEngine.setPreviewIframe(iframe);
  }

  getErrors(): any[] {
    return this.errorHandler.getUnresolvedErrors();
  }

  clearAllErrors(): void {
    this.errorHandler.clear();
  }

  getDebugData(): string {
    return this.debugManager.exportDebugData();
  }

  runHealthCheck() {
    return this.debugManager.runHealthCheck();
  }

  destroy(): void {
    // Stop monitoring
    this.debugManager.stopMonitoring();
    
    // Clean up all subsystems
    this.fileTree.clear();
    this.codeEditor.clear();
    this.previewEngine.clear();
    this.hotReload.clear();
    this.errorHandler.clear();
    this.debugManager.clearLogs();
    eventBus.clear();
  }
}

// Create singleton instance
export const editorSystem = new EditorSystem();
