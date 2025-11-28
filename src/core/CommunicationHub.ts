import { eventBus } from './EventBus';

/**
 * Central hub for real-time communication between all system components
 */
export class CommunicationHub {
  constructor() {
    this.establishConnections();
  }

  private establishConnections(): void {
    this.setupEditorPreviewSync();
    this.setupPreviewEditorSync();
    this.setupFileTreeSync();
    this.setupAIIntegration();
    this.setupErrorSync();
  }

  private setupEditorPreviewSync(): void {
    // Editor changes trigger immediate preview updates
    eventBus.on('editor:change', (data) => {
      // Forward to preview engine
      eventBus.emit('preview:update', {
        filePath: data.filePath,
        content: data.content,
        timestamp: data.timestamp
      });

      // Update AI context
      eventBus.emit('ai:updateContext', {
        filePath: data.filePath,
        content: data.content
      });
    });
  }

  private setupPreviewEditorSync(): void {
    // Preview errors trigger editor highlighting
    eventBus.on('preview:runtimeError', (error) => {
      if (error.line && error.column) {
        eventBus.emit('editor:highlightError', {
          line: error.line,
          column: error.column,
          message: error.message,
          severity: 'error',
          source: error.source
        });
      }

      // Request AI fix suggestion
      eventBus.emit('ai:suggestFix', error);
    });

    // Console logs from preview
    eventBus.on('preview:consoleLog', (log) => {
      console.log(`[Preview Console ${log.level}]:`, ...log.args);
    });
  }

  private setupFileTreeSync(): void {
    // File tree changes update all components
    eventBus.on('fileCreated', (data) => {
      eventBus.emit('editor:fileAvailable', data);
      eventBus.emit('ai:fileCreated', data);
    });

    eventBus.on('fileUpdated', (data) => {
      // Update editor if file is currently open
      eventBus.emit('editor:refreshFile', data);
    });

    eventBus.on('fileDeleted', (data) => {
      eventBus.emit('editor:closeFile', data);
      eventBus.emit('ai:fileDeleted', data);
    });
  }

  private setupAIIntegration(): void {
    // AI code generation triggers editor insertion
    eventBus.on('ai:codeGenerated', (data) => {
      eventBus.emit('editor:insertCode', {
        filePath: data.filePath,
        code: data.code,
        position: data.position
      });

      // Update preview with new code
      eventBus.emit('preview:update', {
        filePath: data.filePath,
        content: data.code
      });
    });

    // AI suggestions
    eventBus.on('ai:suggestion', (suggestion) => {
      console.log('[AI Suggestion]:', suggestion);
    });
  }

  private setupErrorSync(): void {
    // Error handling coordination
    eventBus.on('error:handled', (data) => {
      // Log for debugging
      console.error('[Error Handled]:', data.category, data.error);
    });

    eventBus.on('error:resolved', (data) => {
      console.log('[Error Resolved]:', data.error.message);
    });

    eventBus.on('error:recovery', (data) => {
      // Show recovery suggestion to user
      console.log('[Recovery Suggestion]:', data.suggestion);
    });
  }

  // Methods to manually trigger events
  broadcastEditorChange(filePath: string, content: string): void {
    eventBus.emit('editor:change', {
      filePath,
      content,
      timestamp: Date.now()
    });
  }

  broadcastPreviewError(error: any): void {
    eventBus.emit('preview:runtimeError', error);
  }

  broadcastAIResponse(response: any): void {
    eventBus.emit('ai:response', response);
  }
}
