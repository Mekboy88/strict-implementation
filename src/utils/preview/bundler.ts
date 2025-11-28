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
    // Priority order for preview (prefer simple pages over complex app structure)
    const entryPriority = [
      'src/app/page.tsx',
      'src/pages/LandingPage.tsx',
      'src/pages/Index.tsx',
      'src/App.tsx',
    ];
    
    // If entry is main.tsx or doesn't exist, find best alternative
    if (entryPoint === 'src/main.tsx' || !files[entryPoint]) {
      for (const candidate of entryPriority) {
        if (files[candidate]) {
          entryPoint = candidate;
          break;
        }
      }
    }
    
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
  try {
    // Ensure we're working with a string
    if (typeof code !== 'string') {
      console.error('[Bundler] stripTypeScript received non-string:', typeof code);
      return String(code || '');
    }

    // Remove non-null assertions: expr!
    code = String(code.replace(/([a-zA-Z_$][\w$]*|\)|\])\s*!/g, '$1'));
    
    // Remove type assertions: expr as Type
    code = String(code.replace(/\s+as\s+(?:string|number|boolean|any|unknown|never|void|null|undefined|[A-Z][\w<>\[\]|&\s]*)/g, ''));
    
    // Remove angle bracket type assertions: <Type>expr
    code = String(code.replace(/<(?:string|number|boolean|any|unknown|[A-Z][\w<>]*)>(?=\s*[\w\(])/g, ''));
    
    // Remove type annotations: : Type
    code = String(code.replace(/:\s*(?:string|number|boolean|any|unknown|void|never|null|undefined|[A-Z][\w<>\[\]{},\s|*&?]*)(?=[\s)=,;{])/g, ''));
    
    // Remove interface declarations
    code = String(code.replace(/interface\s+\w+\s*(\<[^>]*\>)?\s*\{[^}]*\}/gs, ''));
    
    // Remove type declarations  
    code = String(code.replace(/type\s+\w+\s*(\<[^>]*\>)?\s*=[^;]+;/g, ''));
    
    // Remove generic type parameters from functions: <T, U>
    code = String(code.replace(/\<[A-Z][\w,\s]*\>\s*\(/g, '('));
    
    // Remove import type statements
    code = String(code.replace(/import\s+type\s+[^;]+;/g, ''));
    
    // Final safety check
    if (typeof code !== 'string') {
      console.error('[Bundler] stripTypeScript produced non-string:', typeof code);
      return '';
    }
    
    return code;
  } catch (error) {
    console.error('[Bundler] Error in stripTypeScript:', error);
    return String(code || '');
  }
}

function handleImportsExports(code: string, dependencies: string[]): string {
  // Add global references for common React imports that we strip
  let preamble = '';
  
  // Check for React hooks/functions usage
  if (code.includes('useState')) preamble += 'const { useState } = React;\n';
  if (code.includes('useEffect')) preamble += 'const { useEffect } = React;\n';
  if (code.includes('useRef')) preamble += 'const { useRef } = React;\n';
  if (code.includes('useMemo')) preamble += 'const { useMemo } = React;\n';
  if (code.includes('useCallback')) preamble += 'const { useCallback } = React;\n';
  if (code.includes('useContext')) preamble += 'const { useContext } = React;\n';
  if (code.includes('useReducer')) preamble += 'const { useReducer } = React;\n';
  if (code.includes('Fragment')) preamble += 'const { Fragment } = React;\n';
  
  // Remove import statements but keep the code structure
  code = code.replace(/import\s+.*?from\s+['"][^'"]+['"];?/g, "");
  code = code.replace(/import\s+['"][^'"]+['"];?/g, "");

  // Remove export statements
  code = code.replace(/export\s+(default\s+)?/g, "");
  code = code.replace(/export\s+/g, "");

  return preamble + code;
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
  // Try to detect component names from the code
  const componentMatch = code.match(/(?:const|function|class)\s+(\w+)\s*[=:(]/);
  const detectedComponent = componentMatch ? componentMatch[1] : null;
  
  // Create stubs for undefined components
  const componentStubs = createComponentStubs(code);
  
  const baseCode = `
    // Preview Bundle - ${framework}
    
    // === Library Mocks for Preview ===
    
    // @tanstack/react-query
    window.QueryClient = function() { this.cache = {}; };
    window.QueryClientProvider = function({ children }) { return children; };
    window.useQuery = function() { return { data: null, isLoading: false, error: null }; };
    window.useMutation = function() { return { mutate: function(){}, isLoading: false }; };
    const QueryClient = window.QueryClient;
    const QueryClientProvider = window.QueryClientProvider;
    const useQuery = window.useQuery;
    const useMutation = window.useMutation;
    
    // react-router-dom
    window.BrowserRouter = function({ children }) { return children; };
    window.Routes = function({ children }) { return children; };
    window.Route = function({ element }) { return element || null; };
    window.Link = function({ children, to }) { return React.createElement('a', { href: to || '#' }, children); };
    window.Navigate = function() { return null; };
    window.Outlet = function() { return null; };
    window.useNavigate = function() { return function() {}; };
    window.useParams = function() { return {}; };
    window.useLocation = function() { return { pathname: '/', search: '', hash: '' }; };
    const BrowserRouter = window.BrowserRouter;
    const Routes = window.Routes;
    const Route = window.Route;
    const Link = window.Link;
    const Navigate = window.Navigate;
    const Outlet = window.Outlet;
    const useNavigate = window.useNavigate;
    const useParams = window.useParams;
    const useLocation = window.useLocation;
    
    // UI component stubs
    window.Toaster = function() { return null; };
    window.Sonner = function() { return null; };
    window.TooltipProvider = function({ children }) { return children; };
    const Toaster = window.Toaster;
    const Sonner = window.Sonner;
    const TooltipProvider = window.TooltipProvider;
    
    // Destructure commonly used React hooks globally
    const { useState, useEffect, useRef, useMemo, useCallback, useContext, useReducer, Fragment } = React;
    
    ${componentStubs}
    
    ${code}
    
    // Create render function that returns a React element
    window.__PREVIEW_RENDER__ = function() {
      try {
        // Try multiple component names in order of preference
        if (typeof Page !== "undefined") {
          console.log('[Preview] Rendering Page component');
          return React.createElement(Page);
        } else if (typeof App !== "undefined") {
          console.log('[Preview] Rendering App component');
          return React.createElement(App);
        } else if (typeof Index !== "undefined") {
          console.log('[Preview] Rendering Index component');
          return React.createElement(Index);
        }${detectedComponent && detectedComponent !== 'Page' && detectedComponent !== 'App' && detectedComponent !== 'Index' ? ` else if (typeof ${detectedComponent} !== "undefined") {
          console.log('[Preview] Rendering ${detectedComponent} component');
          return React.createElement(${detectedComponent});
        }` : ''} else {
          console.error('[Preview] No component found');
          return React.createElement('div', {
            style: {
              padding: '2rem',
              textAlign: 'center',
              color: '#dc2626'
            }
          }, 
            React.createElement('h2', null, '⚠️ No Component Found'),
            React.createElement('p', null, 'Expected Page, App, Index, or other exported component')
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

function createComponentStubs(code: string): string {
  // Find all component-like references (PascalCase)
  const componentRefs = code.match(/\<([A-Z][a-zA-Z0-9]+)/g) || [];
  const uniqueComponents = [...new Set(componentRefs.map(c => c.slice(1)))];
  
  let stubs = '';
  for (const comp of uniqueComponents) {
    // Skip React built-ins and common library components
    if (['Fragment', 'Suspense', 'StrictMode', 'QueryClientProvider', 'BrowserRouter', 'Routes', 'Route', 'Toaster', 'Sonner', 'TooltipProvider'].includes(comp)) continue;
    
    stubs += `
      if (typeof ${comp} === 'undefined') {
        var ${comp} = function() { 
          return React.createElement('div', { 
            style: { padding: '1rem', border: '1px dashed #ccc', borderRadius: '4px', margin: '0.5rem', textAlign: 'center', color: '#666' }
          }, '📦 ${comp}'); 
        };
      }
    `;
  }
  
  return stubs;
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
