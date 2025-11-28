import { eventBus } from './EventBus';
import { DependencyTracker } from './DependencyTracker';

export interface FileMetadata {
  content: string;
  lastModified: number;
  dependencies: string[];
  type: string;
}

/**
 * Manages the file tree with real-time updates and dependency tracking
 */
export class FileTreeManager {
  private files: Map<string, FileMetadata> = new Map();
  private dependencies: DependencyTracker = new DependencyTracker();

  createFile(filePath: string, content: string = ''): void {
    const metadata: FileMetadata = {
      content,
      lastModified: Date.now(),
      dependencies: this.dependencies.analyze(content, filePath),
      type: this.getFileType(filePath)
    };

    this.files.set(filePath, metadata);
    this.broadcastChange('fileCreated', filePath, content);
  }

  updateFile(filePath: string, content: string): void {
    const oldMetadata = this.files.get(filePath);
    const metadata: FileMetadata = {
      content,
      lastModified: Date.now(),
      dependencies: this.dependencies.analyze(content, filePath),
      type: this.getFileType(filePath)
    };

    this.files.set(filePath, metadata);

    // Update dependent files if imports changed
    if (oldMetadata) {
      this.updateDependentFiles(filePath, oldMetadata.content, content);
    }

    this.broadcastChange('fileUpdated', filePath, content);
  }

  deleteFile(filePath: string): void {
    this.files.delete(filePath);
    this.dependencies.removeDependencies(filePath);
    this.broadcastChange('fileDeleted', filePath, '');
  }

  getFile(filePath: string): FileMetadata | undefined {
    return this.files.get(filePath);
  }

  getAllFiles(): Map<string, FileMetadata> {
    return new Map(this.files);
  }

  getFileContent(filePath: string): string | undefined {
    return this.files.get(filePath)?.content;
  }

  private updateDependentFiles(changedFile: string, oldContent: string, newContent: string): void {
    const dependents = this.dependencies.getDependents(changedFile);
    
    dependents.forEach(dependentFile => {
      const metadata = this.files.get(dependentFile);
      if (metadata) {
        // Re-analyze dependencies for dependent files
        const updatedDeps = this.dependencies.analyze(metadata.content, dependentFile);
        metadata.dependencies = updatedDeps;
        metadata.lastModified = Date.now();
        
        // Broadcast update for dependent file
        eventBus.emit('dependentFileUpdated', {
          filePath: dependentFile,
          changedDependency: changedFile
        });
      }
    });
  }

  private broadcastChange(event: string, filePath: string, content: string): void {
    eventBus.emit('fileTreeChanged', {
      event,
      filePath,
      content,
      timestamp: Date.now()
    });

    // Specific event for the action type
    eventBus.emit(event, { filePath, content, timestamp: Date.now() });
  }

  private getFileType(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    const typeMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript-react',
      'js': 'javascript',
      'jsx': 'javascript-react',
      'css': 'css',
      'json': 'json',
      'html': 'html',
      'md': 'markdown'
    };
    return typeMap[ext || ''] || 'text';
  }

  getDependencies(filePath: string): string[] {
    return this.dependencies.getDependencies(filePath);
  }

  getDependents(filePath: string): string[] {
    return this.dependencies.getDependents(filePath);
  }

  clear(): void {
    this.files.clear();
    this.dependencies.clear();
  }
}
