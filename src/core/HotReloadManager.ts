import { eventBus } from './EventBus';

interface UpdateTask {
  filePath: string;
  content: string;
  changeType: 'style' | 'script' | 'html' | 'component';
  timestamp: number;
}

interface PreservedState {
  [key: string]: any;
}

/**
 * Manages hot reload with state preservation
 */
export class HotReloadManager {
  private updateQueue: UpdateTask[] = [];
  private stateCache: Map<string, PreservedState> = new Map();
  private processing: boolean = false;

  processChange(filePath: string, newContent: string): void {
    const changeType = this.determineChangeType(filePath, newContent);
    
    // Preserve state for component files
    if (changeType === 'component') {
      this.preserveState(filePath);
    }

    const task: UpdateTask = {
      filePath,
      content: newContent,
      changeType,
      timestamp: Date.now()
    };

    this.updateQueue.push(task);
    this.processUpdates();
  }

  private async processUpdates(): Promise<void> {
    if (this.processing || this.updateQueue.length === 0) return;
    
    this.processing = true;

    while (this.updateQueue.length > 0) {
      const task = this.updateQueue.shift()!;
      
      try {
        await this.applyUpdate(task);
        
        // Restore state if it was preserved
        if (task.changeType === 'component' && this.stateCache.has(task.filePath)) {
          await this.restoreState(task.filePath);
        }
        
        eventBus.emit('hotReload:success', {
          filePath: task.filePath,
          changeType: task.changeType
        });
      } catch (error) {
        eventBus.emit('hotReload:error', {
          filePath: task.filePath,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    this.processing = false;
  }

  private async applyUpdate(task: UpdateTask): Promise<void> {
    switch (task.changeType) {
      case 'style':
        return this.updateStyles(task.filePath, task.content);
      case 'script':
        return this.updateScript(task.filePath, task.content);
      case 'html':
        return this.updateMarkup(task.filePath, task.content);
      case 'component':
        return this.updateComponent(task.filePath, task.content);
    }
  }

  private determineChangeType(filePath: string, content: string): UpdateTask['changeType'] {
    const ext = filePath.split('.').pop()?.toLowerCase();
    
    if (ext === 'css' || ext === 'scss' || ext === 'sass') {
      return 'style';
    }
    
    if (ext === 'html') {
      return 'html';
    }
    
    if ((ext === 'tsx' || ext === 'jsx') && this.isComponentFile(content)) {
      return 'component';
    }
    
    return 'script';
  }

  private isComponentFile(content: string): boolean {
    // Check if file exports a React component
    return /export\s+(default\s+)?(function|const|class)\s+\w+/.test(content) &&
           /return\s*\(?\s*</.test(content);
  }

  private preserveState(filePath: string): void {
    // In a real implementation, this would capture React component state
    // For now, we'll just mark that we should preserve state
    this.stateCache.set(filePath, {
      timestamp: Date.now(),
      preserved: true
    });
  }

  private async restoreState(filePath: string): Promise<void> {
    const state = this.stateCache.get(filePath);
    if (state) {
      eventBus.emit('hotReload:restoreState', {
        filePath,
        state
      });
      this.stateCache.delete(filePath);
    }
  }

  private async updateStyles(filePath: string, content: string): Promise<void> {
    eventBus.emit('preview:updateStyles', { filePath, content });
  }

  private async updateScript(filePath: string, content: string): Promise<void> {
    eventBus.emit('preview:updateScript', { filePath, content });
  }

  private async updateMarkup(filePath: string, content: string): Promise<void> {
    eventBus.emit('preview:updateMarkup', { filePath, content });
  }

  private async updateComponent(filePath: string, content: string): Promise<void> {
    eventBus.emit('preview:updateComponent', { filePath, content });
  }

  clear(): void {
    this.updateQueue = [];
    this.stateCache.clear();
  }
}
