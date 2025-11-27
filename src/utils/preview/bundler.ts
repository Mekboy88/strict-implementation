/**
 * Preview Bundler with Error Handling
 * Bundles React code for preview iframe
 */

import { compileJSX } from "./jsxCompiler";
import { resolveModules, stripImports } from "./moduleResolver";

export function bundleForPreview(
  files: Record<string, string>,
  entryPoint: string = "src/app/page.tsx"
): string {
  try {
    const entryCode = files[entryPoint];
    if (!entryCode) {
      console.error('[Bundler] Entry point not found:', entryPoint);
      return generateErrorBundle('Entry point not found: ' + entryPoint);
    }
    
    console.log('[Bundler] Starting bundle for:', entryPoint);
    
    // Check if entry has imports
    const hasImports = /^import\s+/m.test(entryCode);
    
    if (!hasImports) {
      console.log('[Bundler] Fast path: no imports detected');
      return bundleSingleFile(entryCode);
    }
    
    console.log('[Bundler] Complex path: resolving modules');
    return bundleWithModules(files, entryPoint);
    
  } catch (error) {
    console.error('[Bundler] Fatal error:', error);
    return generateErrorBundle(error instanceof Error ? error.message : String(error));
  }
}

function bundleSingleFile(code: string): string {
  try {
    // Remove exports
    code = code.replace(/export\s+default\s+/g, '');
    code = code.replace(/export\s+/g, '');
    
    // Compile JSX
    code = compileJSX(code);
    
    console.log('[Bundler] Single file compiled, size:', code.length);
    
    return `
${code}

// Auto-detect and expose component
const __main__ = (typeof Page !== "undefined") ? Page : 
                 (typeof App !== "undefined") ? App : null;

if (__main__) {
  window.__PREVIEW_RENDER__ = __main__;
  console.log('[Preview] Component exposed:', __main__.name);
} else {
  console.error('[Preview] No Page or App component found');
}
`;
  } catch (error) {
    console.error('[Bundler] Single file compilation failed:', error);
    throw error;
  }
}

function bundleWithModules(files: Record<string, string>, entryPoint: string): string {
  try {
    const modules = resolveModules(files, entryPoint);
    console.log('[Bundler] Resolved', modules.length, 'modules');
    
    if (modules.length === 0) {
      throw new Error('No modules resolved');
    }
    
    const transformedModules: string[] = [];
    
    // Process dependencies first, entry last
    for (const module of modules) {
      try {
        let code = stripImports(module.code);
        code = code.replace(/export\s+default\s+/g, '');
        code = code.replace(/export\s+(function|const|class)\s+/g, '$1 ');
        code = compileJSX(code);
        
        transformedModules.push(`\n// Module: ${module.path}\n${code}\n`);
        console.log('[Bundler] Transformed:', module.path);
      } catch (error) {
        console.error(`[Bundler] Failed to transform ${module.path}:`, error);
        // Continue with other modules
      }
    }
    
    return `
${transformedModules.join('\n')}

// Auto-detect and expose component
const __main__ = (typeof Page !== "undefined") ? Page : 
                 (typeof App !== "undefined") ? App : null;

if (__main__) {
  window.__PREVIEW_RENDER__ = __main__;
  console.log('[Preview] Component exposed:', __main__.name);
} else {
  console.error('[Preview] No Page or App component found');
}
`;
  } catch (error) {
    console.error('[Bundler] Module bundling failed:', error);
    throw error;
  }
}

function generateErrorBundle(errorMessage: string): string {
  return `
function Page() {
  return React.createElement('div', 
    { style: { padding: '2rem', color: '#dc2626', fontFamily: 'monospace' } },
    React.createElement('h2', null, 'Preview Build Error'),
    React.createElement('p', null, errorMessage)
  );
}
window.__PREVIEW_RENDER__ = Page;
`;
}
