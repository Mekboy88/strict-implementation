/**
 * Module Resolver for Preview Bundler
 * Resolves imports and inlines dependencies
 */

export interface ResolvedModule {
  path: string;
  code: string;
  dependencies: string[];
}

export function resolveModules(
  files: Record<string, string>,
  entryPoint: string
): ResolvedModule[] {
  const modules: ResolvedModule[] = [];
  const visited = new Set<string>();
  
  function resolve(importPath: string, fromPath: string): string | null {
    // Handle @/ alias
    if (importPath.startsWith('@/')) {
      importPath = 'src/' + importPath.slice(2);
    }
    
    // Handle relative imports
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      const fromDir = fromPath.split('/').slice(0, -1).join('/');
      importPath = normalizePath(fromDir + '/' + importPath);
    }
    
    // Try different extensions
    const extensions = ['', '.tsx', '.ts', '.jsx', '.js'];
    for (const ext of extensions) {
      const fullPath = importPath + ext;
      if (files[fullPath]) {
        return fullPath;
      }
    }
    
    return null;
  }
  
  function normalizePath(path: string): string {
    const parts = path.split('/');
    const normalized: string[] = [];
    
    for (const part of parts) {
      if (part === '..') {
        normalized.pop();
      } else if (part !== '.' && part !== '') {
        normalized.push(part);
      }
    }
    
    return normalized.join('/');
  }
  
  function extractImports(code: string): Array<{ imported: string; from: string }> {
    const imports: Array<{ imported: string; from: string }> = [];
    
    // Match: import Something from "./path"
    const defaultImportRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = defaultImportRegex.exec(code)) !== null) {
      imports.push({ imported: match[1], from: match[2] });
    }
    
    // Match: import { Thing } from "./path"
    const namedImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
    while ((match = namedImportRegex.exec(code)) !== null) {
      imports.push({ imported: match[1].trim(), from: match[2] });
    }
    
    return imports;
  }
  
  function processModule(path: string) {
    if (visited.has(path)) return;
    visited.add(path);
    
    const code = files[path];
    if (!code) return;
    
    const imports = extractImports(code);
    const dependencies: string[] = [];
    
    // Resolve and process dependencies first
    for (const imp of imports) {
      const resolvedPath = resolve(imp.from, path);
      if (resolvedPath) {
        dependencies.push(resolvedPath);
        processModule(resolvedPath);
      }
    }
    
    modules.push({ path, code, dependencies });
  }
  
  processModule(entryPoint);
  
  return modules;
}

export function stripImports(code: string): string {
  // Remove all import statements
  return code.replace(/import\s+.*?from\s+['"][^'"]+['"];?\s*/g, '');
}
