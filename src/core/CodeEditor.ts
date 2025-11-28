import { eventBus } from './EventBus';

export interface EditorError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  source: string;
}

export interface CodeContext {
  filePath: string;
  content: string;
  cursorPosition: { line: number; column: number };
  fileType: string;
}

/**
 * Enhanced code editor with error detection and AI integration
 */
export class CodeEditor {
  private activeFiles: Map<string, { content: string; errors: EditorError[] }> = new Map();
  private currentFile: string | null = null;

  setActiveFile(filePath: string, content: string): void {
    this.currentFile = filePath;
    this.updateFile(filePath, content);
  }

  updateFile(filePath: string, content: string): void {
    const errors = this.detectErrors(content, filePath);
    
    this.activeFiles.set(filePath, { content, errors });
    
    // Broadcast change
    eventBus.emit('editor:change', {
      filePath,
      content,
      errors,
      timestamp: Date.now()
    });

    // If there are errors, emit error event
    if (errors.length > 0) {
      eventBus.emit('editor:errors', { filePath, errors });
    }
  }

  getActiveFile(): string | null {
    return this.currentFile;
  }

  getFileContent(filePath: string): string | undefined {
    return this.activeFiles.get(filePath)?.content;
  }

  getFileErrors(filePath: string): EditorError[] {
    return this.activeFiles.get(filePath)?.errors || [];
  }

  private detectErrors(content: string, filePath: string): EditorError[] {
    const errors: EditorError[] = [];
    
    // Basic syntax validation
    errors.push(...this.validateSyntax(content, filePath));
    
    // Import validation
    errors.push(...this.validateImports(content, filePath));
    
    return errors;
  }

  private validateSyntax(content: string, filePath: string): EditorError[] {
    const errors: EditorError[] = [];
    
    // Check for unclosed brackets
    const openBrackets = (content.match(/\{/g) || []).length;
    const closeBrackets = (content.match(/\}/g) || []).length;
    
    if (openBrackets !== closeBrackets) {
      errors.push({
        line: 1,
        column: 1,
        message: 'Mismatched curly braces',
        severity: 'error',
        source: 'syntax'
      });
    }
    
    // Check for unclosed parentheses
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    
    if (openParens !== closeParens) {
      errors.push({
        line: 1,
        column: 1,
        message: 'Mismatched parentheses',
        severity: 'error',
        source: 'syntax'
      });
    }
    
    return errors;
  }

  private validateImports(content: string, filePath: string): EditorError[] {
    const errors: EditorError[] = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.trim().startsWith('import') && !line.includes('from')) {
        if (!line.includes('import(')) { // Ignore dynamic imports
          errors.push({
            line: index + 1,
            column: 1,
            message: 'Invalid import statement',
            severity: 'error',
            source: 'import'
          });
        }
      }
    });
    
    return errors;
  }

  highlightError(error: EditorError): void {
    eventBus.emit('editor:highlightError', error);
  }

  insertCode(filePath: string, code: string, position?: { line: number; column: number }): void {
    const currentContent = this.getFileContent(filePath) || '';
    
    let newContent: string;
    if (position) {
      // Insert at specific position
      const lines = currentContent.split('\n');
      const before = lines.slice(0, position.line).join('\n');
      const after = lines.slice(position.line).join('\n');
      newContent = before + '\n' + code + '\n' + after;
    } else {
      // Append to end
      newContent = currentContent + '\n' + code;
    }
    
    this.updateFile(filePath, newContent);
  }

  getSurroundingCode(position: { line: number; column: number }, lineCount: number = 10): string {
    if (!this.currentFile) return '';
    
    const content = this.getFileContent(this.currentFile);
    if (!content) return '';
    
    const lines = content.split('\n');
    const start = Math.max(0, position.line - lineCount);
    const end = Math.min(lines.length, position.line + lineCount);
    
    return lines.slice(start, end).join('\n');
  }

  getFileType(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    return ext || 'text';
  }

  clear(): void {
    this.activeFiles.clear();
    this.currentFile = null;
  }
}
