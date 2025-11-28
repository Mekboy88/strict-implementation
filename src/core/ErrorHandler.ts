import { eventBus } from './EventBus';
import type { PreviewError } from './PreviewEngine';
import type { EditorError } from './CodeEditor';

interface ErrorRecord {
  error: PreviewError | EditorError;
  timestamp: number;
  category: ErrorCategory;
  resolved: boolean;
}

type ErrorCategory = 'syntax' | 'runtime' | 'import' | 'type' | 'other';

/**
 * Handles errors with recovery strategies and AI suggestions
 */
export class ErrorHandler {
  private errorHistory: ErrorRecord[] = [];
  private maxHistorySize: number = 100;

  constructor() {
    this.setupListeners();
  }

  private setupListeners(): void {
    // Listen for preview errors
    eventBus.on('preview:runtimeError', (error: PreviewError) => {
      this.handleError(error, 'runtime');
    });

    // Listen for editor errors
    eventBus.on('editor:errors', (data: { filePath: string; errors: EditorError[] }) => {
      data.errors.forEach(error => {
        this.handleError(error, this.categorizeEditorError(error));
      });
    });
  }

  handleError(error: PreviewError | EditorError, category?: ErrorCategory): void {
    const errorCategory = category || this.categorizeError(error);
    
    // Add to history
    this.addToHistory(error, errorCategory);
    
    // Apply recovery strategy
    this.applyRecoveryStrategy(error, errorCategory);
    
    // Request AI suggestion
    this.requestAISuggestion(error, errorCategory);
    
    // Emit error event
    eventBus.emit('error:handled', {
      error,
      category: errorCategory,
      timestamp: Date.now()
    });
  }

  private categorizeError(error: PreviewError | EditorError): ErrorCategory {
    if ('severity' in error) {
      return this.categorizeEditorError(error);
    }
    
    const message = error.message.toLowerCase();
    
    if (message.includes('import') || message.includes('module')) {
      return 'import';
    }
    
    if (message.includes('type') || message.includes('undefined')) {
      return 'type';
    }
    
    if (message.includes('syntax')) {
      return 'syntax';
    }
    
    return 'runtime';
  }

  private categorizeEditorError(error: EditorError): ErrorCategory {
    if (error.source === 'syntax') return 'syntax';
    if (error.source === 'import') return 'import';
    return 'other';
  }

  private addToHistory(error: PreviewError | EditorError, category: ErrorCategory): void {
    const record: ErrorRecord = {
      error,
      timestamp: Date.now(),
      category,
      resolved: false
    };

    this.errorHistory.push(record);

    // Keep history size manageable
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift();
    }
  }

  private applyRecoveryStrategy(error: PreviewError | EditorError, category: ErrorCategory): void {
    switch (category) {
      case 'import':
        this.handleImportError(error);
        break;
      case 'syntax':
        this.handleSyntaxError(error);
        break;
      case 'runtime':
        this.handleRuntimeError(error);
        break;
      case 'type':
        this.handleTypeError(error);
        break;
      default:
        console.warn('No recovery strategy for error category:', category);
    }
  }

  private handleImportError(error: PreviewError | EditorError): void {
    eventBus.emit('error:recovery', {
      type: 'import',
      suggestion: 'Check if the imported file exists and the path is correct',
      error
    });
  }

  private handleSyntaxError(error: PreviewError | EditorError): void {
    eventBus.emit('error:recovery', {
      type: 'syntax',
      suggestion: 'Review the syntax at the indicated line',
      error
    });
  }

  private handleRuntimeError(error: PreviewError | EditorError): void {
    eventBus.emit('error:recovery', {
      type: 'runtime',
      suggestion: 'Check for null/undefined values or incorrect function calls',
      error
    });
  }

  private handleTypeError(error: PreviewError | EditorError): void {
    eventBus.emit('error:recovery', {
      type: 'type',
      suggestion: 'Verify variable types and object properties',
      error
    });
  }

  private requestAISuggestion(error: PreviewError | EditorError, category: ErrorCategory): void {
    eventBus.emit('ai:diagnoseError', {
      error,
      category,
      context: this.getErrorContext(error)
    });
  }

  private getErrorContext(error: PreviewError | EditorError): any {
    // Get recent errors of the same type
    const recentSimilar = this.errorHistory
      .filter(record => {
        const recordMsg = record.error.message.toLowerCase();
        const currentMsg = error.message.toLowerCase();
        return recordMsg.includes(currentMsg) || currentMsg.includes(recordMsg);
      })
      .slice(-3);

    return {
      recentSimilarErrors: recentSimilar.length,
      errorFrequency: this.getErrorFrequency(error),
      timestamp: Date.now()
    };
  }

  private getErrorFrequency(error: PreviewError | EditorError): number {
    const last5Minutes = Date.now() - 5 * 60 * 1000;
    return this.errorHistory.filter(record => 
      record.timestamp > last5Minutes &&
      record.error.message === error.message
    ).length;
  }

  markResolved(errorMessage: string): void {
    const record = this.errorHistory.find(r => 
      r.error.message === errorMessage && !r.resolved
    );
    
    if (record) {
      record.resolved = true;
      eventBus.emit('error:resolved', { error: record.error });
    }
  }

  getErrorHistory(limit?: number): ErrorRecord[] {
    const history = [...this.errorHistory].reverse();
    return limit ? history.slice(0, limit) : history;
  }

  getUnresolvedErrors(): ErrorRecord[] {
    return this.errorHistory.filter(record => !record.resolved);
  }

  clear(): void {
    this.errorHistory = [];
  }
}
