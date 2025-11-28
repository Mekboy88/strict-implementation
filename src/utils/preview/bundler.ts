/**
 * Preview Bundler with Complete Error Handling
 * Bundles React/TypeScript code for preview iframe
 */

interface ModuleInfo {
  path: string;
  code: string;
  dependencies: string[];
}

export function bundleForPreview(files: Record<string, string>, entryPoint: string = "src/main.tsx"): string {
  try {
    console.log("[Bundler] Starting bundle for:", entryPoint);

    const entryCode = files[entryPoint];
    if (!entryCode) {
      console.error("[Bundler] Entry point not found:", entryPoint);
      return generateErrorBundle("Entry point not found: " + entryPoint);
    }

    // Handle different entry points
    if (entryPoint.includes("main.tsx") || entryPoint.includes("App.tsx")) {
      return bundleReactApp(files, entryPoint);
    } else if (entryPoint.includes("page.tsx")) {
      return bundleNextPage(files, entryPoint);
    } else {
      return bundleGeneric(files, entryPoint);
    }
  } catch (error) {
    console.error("[Bundler] Fatal error:", error);
    return generateErrorBundle(error instanceof Error ? error.message : String(error));
  }
}

function bundleReactApp(files: Record<string, string>, entryPoint: string): string {
  try {
    const modules = resolveDependencies(files, entryPoint);
    console.log("[Bundler] Resolved", modules.length, "modules");

    const transformedModules: string[] = [];

    for (const module of modules) {
      try {
        let code = module.code;

        // Remove TypeScript types
        code = stripTypeScript(code);

        // Handle imports/exports
        code = handleImportsExports(code, module.dependencies);

        // Transform JSX (simplified)
        code = transformJSX(code);

        transformedModules.push(`// ${module.path}\n${code}\n`);
        console.log("[Bundler] Transformed:", module.path);
      } catch (error) {
        console.error(`[Bundler] Failed to transform ${module.path}:`, error);
        transformedModules.push(`// Failed to load ${module.path}\nconsole.error('Failed to load ${module.path}');\n`);
      }
    }

    return createPreviewBundle(transformedModules.join("\n"), "react");
  } catch (error) {
    console.error("[Bundler] React bundling failed:", error);
    return generateErrorBundle(error instanceof Error ? error.message : String(error));
  }
}

function bundleNextPage(files: Record<string, string>, entryPoint: string): string {
  const pageCode = files[entryPoint] || "";
  const layoutCode = files["src/app/layout.tsx"] || "";

  let code = "";

  // Add layout if exists
  if (layoutCode) {
    code += handleLayoutCode(layoutCode);
  }

  // Add page code
  code += transformPageCode(pageCode);

  return createPreviewBundle(code, "next");
}

function bundleGeneric(files: Record<string, string>, entryPoint: string): string {
  const entryCode = files[entryPoint] || "";
  let code = entryCode;

  // Basic transformations
  code = stripTypeScript(code);
  code = transformJSX(code);

  return createPreviewBundle(code, "generic");
}

function resolveDependencies(files: Record<string, string>, entryPoint: string): ModuleInfo[] {
  const resolved: ModuleInfo[] = [];
  const visited = new Set<string>();
  const queue = [entryPoint];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;

    const code = files[current];
    if (!code) continue;

    const dependencies = extractDependencies(code);
    resolved.push({
      path: current,
      code,
      dependencies,
    });

    // Add dependencies to queue
    dependencies.forEach((dep) => {
      if (!visited.has(dep)) {
        queue.push(dep);
      }
    });

    visited.add(current);
  }

  return resolved;
}

function extractDependencies(code: string): string[] {
  const dependencies: string[] = [];

  // Extract import statements
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(code)) !== null) {
    dependencies.push(match[1]);
  }

  // Also check for relative imports
  const relativeImportRegex = /import\s+['"]([^'"]+)['"]/g;
  while ((match = relativeImportRegex.exec(code)) !== null) {
    const dep = match[1];
    if (dep.startsWith("./") || dep.startsWith("../")) {
      dependencies.push(dep);
    }
  }

  return dependencies;
}

function stripTypeScript(code: string): string {
  // Remove non-null assertions: expr!
  code = code.replace(/([a-zA-Z_$][\w$]*|\)|\])\s*!/g, '$1');
  
  // Remove type assertions: expr as Type
  code = code.replace(/\s+as\s+[\w<>\[\]|&\s]+/g, '');
  
  // Remove angle bracket type assertions: <Type>expr
  code = code.replace(/<[\w<>]+>(?=\s*\()/g, '');
  
  // Remove type annotations: : Type
  code = code.replace(/:\s*[A-Za-z_][\w<>[\]{},\s|*&?]*(?=[\s)=,;{])/g, '');
  
  // Remove interface declarations
  code = code.replace(/interface\s+\w+\s*(\<[^>]*\>)?\s*\{[^}]*\}/gs, '');
  
  // Remove type declarations
  code = code.replace(/type\s+\w+\s*(\<[^>]*\>)?\s*=[^;]+;/g, '');
  
  // Remove generic type parameters from functions: <T, U>
  code = code.replace(/\<[\w,\s]+\>\s*\(/g, '(');
  
  // Remove import type statements
  code = code.replace(/import\s+type\s+[^;]+;/g, '');
  
  return code;
}

function handleImportsExports(code: string, dependencies: string[]): string {
  // Remove import statements but keep the code structure
  code = code.replace(/import\s+.*?from\s+['"][^'"]+['"];?/g, "");
  code = code.replace(/import\s+['"][^'"]+['"];?/g, "");

  // Remove export statements
  code = code.replace(/export\s+(default\s+)?/g, "");
  code = code.replace(/export\s+/g, "");

  return code;
}

function transformJSX(code: string): string {
  // JSX will be compiled by Babel Standalone in the browser
  // Just return the code as-is for now
  return code;
}

function transformAttributes(attrs: string): string {
  // Simple attribute transformation
  return "{}";
}

function handleLayoutCode(code: string): string {
  // Extract layout JSX and wrap page content
  code = stripTypeScript(code);
  code = handleImportsExports(code, []);
  return `const Layout = ${code.replace(/const\s+Layout\s*=/, "").trim()};\n`;
}

function transformPageCode(code: string): string {
  // Extract page component
  code = stripTypeScript(code);
  code = handleImportsExports(code, []);
  return `const Page = ${code.replace(/const\s+Page\s*=|export\s+default\s+/, "").trim()};\n`;
}

function createPreviewBundle(code: string, framework: string): string {
  const baseCode = `
    // Preview Bundle - ${framework}
    
    ${code}
    
    // Create render function that returns a React element
    window.__PREVIEW_RENDER__ = function() {
      try {
        if (typeof Page !== "undefined") {
          console.log('[Preview] Rendering Page component');
          return React.createElement(Page);
        } else if (typeof App !== "undefined") {
          console.log('[Preview] Rendering App component');
          return React.createElement(App);
        } else {
          console.error('[Preview] No Page or App component found');
          return React.createElement('div', {
            style: {
              padding: '2rem',
              textAlign: 'center',
              color: '#dc2626'
            }
          }, 
            React.createElement('h2', null, '⚠️ No Component Found'),
            React.createElement('p', null, 'Export a default Page or App component')
          );
        }
      } catch (error) {
        console.error('[Preview] Error creating element:', error);
        return React.createElement('div', {
          style: {
            padding: '2rem',
            color: '#dc2626'
          }
        }, 
          React.createElement('h2', null, '❌ Render Error'),
          React.createElement('pre', {
            style: {
              background: '#fee',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto'
            }
          }, error.message)
        );
      }
    };
    
    console.log('[Preview] Render function ready');
  `;

  return baseCode.trim();
}

function generateErrorBundle(errorMessage: string): string {
  return `
    // Error Bundle
    function PreviewError() {
      return React.createElement('div', {
        style: {
          padding: '2rem',
          color: '#dc2626',
          fontFamily: 'monospace',
          backgroundColor: '#fef2f2',
          border: '2px solid #fecaca',
          borderRadius: '8px',
          margin: '1rem'
        }
      }, 
        React.createElement('h2', { style: { marginBottom: '1rem' }}, 'Preview Build Error'),
        React.createElement('pre', { 
          style: { 
            backgroundColor: '#fee2e2', 
            padding: '1rem', 
            borderRadius: '4px',
            overflow: 'auto'
          } 
        }, errorMessage)
      );
    }
    
    window.__PREVIEW_RENDER__ = PreviewError;
    console.error('[Bundler] Error bundle generated:', errorMessage);
  `;
}
