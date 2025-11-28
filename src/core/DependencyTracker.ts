/**
 * Tracks dependencies between files for cascade updates
 */
export class DependencyTracker {
  private dependencies: Map<string, Set<string>> = new Map();
  private dependents: Map<string, Set<string>> = new Map();

  analyze(content: string, filePath: string): string[] {
    const imports = this.extractImports(content);
    
    // Update dependency graph
    this.dependencies.set(filePath, new Set(imports));
    
    imports.forEach(importPath => {
      if (!this.dependents.has(importPath)) {
        this.dependents.set(importPath, new Set());
      }
      this.dependents.get(importPath)!.add(filePath);
    });

    return imports;
  }

  private extractImports(content: string): string[] {
    const imports: string[] = [];
    
    // ES6 imports
    const importRegex = /import\s+(?:[\w{},\s*]+\s+from\s+)?['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(this.normalizePath(match[1]));
    }
    
    // Dynamic imports
    const dynamicImportRegex = /import\(['"]([^'"]+)['"]\)/g;
    while ((match = dynamicImportRegex.exec(content)) !== null) {
      imports.push(this.normalizePath(match[1]));
    }
    
    // Require statements
    const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
    while ((match = requireRegex.exec(content)) !== null) {
      imports.push(this.normalizePath(match[1]));
    }
    
    return [...new Set(imports)];
  }

  private normalizePath(path: string): string {
    // Convert relative paths to absolute
    if (path.startsWith('./') || path.startsWith('../')) {
      return path;
    }
    if (!path.startsWith('/')) {
      return `/${path}`;
    }
    return path;
  }

  getDependencies(filePath: string): string[] {
    return Array.from(this.dependencies.get(filePath) || []);
  }

  getDependents(filePath: string): string[] {
    return Array.from(this.dependents.get(filePath) || []);
  }

  removeDependencies(filePath: string): void {
    this.dependencies.delete(filePath);
    this.dependents.forEach(deps => deps.delete(filePath));
  }

  clear(): void {
    this.dependencies.clear();
    this.dependents.clear();
  }
}
