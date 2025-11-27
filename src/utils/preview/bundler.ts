/**
 * Mini bundler for preview - resolves imports and bundles components
 */

interface TransformedModule {
  name: string;
  code: string;
}

export function bundleForPreview(
  files: { [key: string]: string },
  entryPoint: string = 'src/app/page.tsx'
): string {
  // Ensure the bundler ALWAYS has a valid entry file so preview never breaks
  if (!files[entryPoint] || !files[entryPoint].trim()) {
    files[entryPoint] = `export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <h1 className="text-2xl font-bold text-gray-900">Preview Works!</h1>
    </main>
  );
}`;
  }

  const transformedModules: TransformedModule[] = [];
  const processedFiles = new Set<string>();

  function resolveImportPath(fromPath: string, importPath: string): string | null {
    // Handle relative imports: './Component' or '../components/Component'
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      const fromDir = fromPath.split('/').slice(0, -1).join('/');
      let resolved = importPath;
      
      // Handle ../ navigation
      const parts = importPath.split('/');
      let currentDir = fromDir.split('/');
      
      for (const part of parts) {
        if (part === '..') {
          currentDir.pop();
        } else if (part === '.') {
          continue;
        } else {
          currentDir.push(part);
        }
      }
      
      resolved = currentDir.join('/');
      
      // Try different extensions
      const extensions = ['.tsx', '.ts', '.jsx', '.js', ''];
      for (const ext of extensions) {
        const fullPath = resolved + ext;
        if (files[fullPath]) return fullPath;
      }
    }
    
    // Handle @/ alias (maps to src/)
    if (importPath.startsWith('@/')) {
      const withoutAlias = 'src/' + importPath.slice(2);
      const extensions = ['.tsx', '.ts', '.jsx', '.js', ''];
      for (const ext of extensions) {
        const fullPath = withoutAlias + ext;
        if (files[fullPath]) return fullPath;
      }
    }
    
    return null;
  }

  function extractImports(code: string): Array<{ path: string; names: string[] }> {
    const imports: Array<{ path: string; names: string[] }> = [];
    
    // Match: import { A, B } from './path'
    const namedImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = namedImportRegex.exec(code))) {
      const names = match[1].split(',').map(n => n.trim());
      imports.push({ path: match[2], names });
    }
    
    // Match: import Component from './path'
    const defaultImportRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g;
    while ((match = defaultImportRegex.exec(code))) {
      imports.push({ path: match[2], names: [match[1]] });
    }
    
    return imports;
  }

  function transformJSX(code: string): string {
    let result = code;

    // Strip basic TypeScript syntax so the browser can execute the code
    // Remove simple interface declarations
    result = result.replace(/interface\s+\w+\s*{[\s\S]*?}/g, "");
    // Remove basic type annotations like ": string", ": number", etc.
    result = result.replace(/:\s*[A-Za-z0-9_\[\]\<\>\| ]+/g, "");
    // Remove TypeScript generics on functions/components like <T>
    result = result.replace(/<[^>]+>\s*\(/g, "(");
    
    // Remove imports
    result = result.replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '');
    
    // Remove export default
    result = result.replace(/export\s+default\s+function\s+(\w+)/, 'function $1');
    result = result.replace(/export\s+default\s+/, '');
    result = result.replace(/export\s+function\s+/g, 'function ');
    result = result.replace(/export\s+const\s+/g, 'const ');
    
    // Transform JSX to React.createElement calls
    let iterations = 0;
    let prev = '';
    
    while (result !== prev && iterations < 50) {
      prev = result;
      iterations++;
      
      // Self-closing tags with props: <Component prop="value" />
      result = result.replace(
        /<(\w+)\s+([^>\/]+?)\s*\/>/g,
        (_, tag, attrs) => {
          const props = parseAttributes(attrs);
          return `React.createElement(${formatTagName(tag)}, ${props})`;
        }
      );
      
      // Self-closing without props: <Component />
      result = result.replace(
        /<(\w+)\s*\/>/g,
        (_, tag) => `React.createElement(${formatTagName(tag)}, null)`
      );
      
      // Opening tags with props: <div className="x">
      result = result.replace(
        /<(\w+)\s+([^>]+?)>/g,
        (_, tag, attrs) => {
          const props = parseAttributes(attrs);
          return `React.createElement(${formatTagName(tag)}, ${props}, `;
        }
      );
      
      // Opening tags without props: <div>
      result = result.replace(
        /<(\w+)>/g,
        (_, tag) => `React.createElement(${formatTagName(tag)}, null, `
      );
      
      // Closing tags
      result = result.replace(/<\/\w+>/g, ')');
    }
    
    return result;
  }

  function formatTagName(tag: string): string {
    // HTML elements are lowercase - need quotes
    // React components start with uppercase - no quotes
    const isHtmlElement = tag[0] === tag[0].toLowerCase();
    return isHtmlElement ? `"${tag}"` : tag;
  }

  function parseAttributes(attrStr: string): string {
    const props: string[] = [];
    
    // className="value" or className='value'
    const stringAttrRegex = /(\w+)=["']([^"']+)["']/g;
    let match;
    
    while ((match = stringAttrRegex.exec(attrStr))) {
      props.push(`${match[1]}: "${match[2]}"`);
    }
    
    // prop={value}
    const exprAttrRegex = /(\w+)=\{([^}]+)\}/g;
    while ((match = exprAttrRegex.exec(attrStr))) {
      props.push(`${match[1]}: ${match[2]}`);
    }
    
    return props.length ? `{ ${props.join(', ')} }` : 'null';
  }

  function processFile(filePath: string) {
    if (processedFiles.has(filePath)) return;
    processedFiles.add(filePath);
    
    const code = files[filePath];
    if (!code) return;
    
    // Extract and process imports first
    const imports = extractImports(code);
    for (const imp of imports) {
      const resolvedPath = resolveImportPath(filePath, imp.path);
      if (resolvedPath) {
        processFile(resolvedPath);
      }
    }
    
    // Transform this file
    const transformed = transformJSX(code);
    
    transformedModules.push({
      name: filePath,
      code: transformed,
    });
  }

  // Start processing from entry point
  processFile(entryPoint);

  // Bundle all modules together
  const bundledCode = transformedModules
    .map(m => `// === ${m.name} ===\n${m.code}`)
    .join('\n\n');

  return bundledCode;
}
