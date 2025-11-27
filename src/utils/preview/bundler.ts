/**
 * Complete Preview Bundler with JSX Compilation
 * Transforms multi-file React applications into executable JavaScript
 */

import { compileJSX } from "./jsxCompiler";
import { resolveModules, stripImports } from "./moduleResolver";

export function bundleForPreview(
  files: Record<string, string>,
  entryPoint: string = "src/app/page.tsx"
): string {
  try {
    // Resolve all modules and their dependencies
    const modules = resolveModules(files, entryPoint);
    
    if (modules.length === 0) {
      console.error('No modules resolved');
      return generateFallbackBundle();
    }
    
    // Transform each module
    const transformedModules: string[] = [];
    
    for (const module of modules) {
      try {
        // Strip imports (they're already resolved)
        let code = stripImports(module.code);
        
        // Remove export statements but keep the function/component
        code = code.replace(/export\s+default\s+/g, '');
        code = code.replace(/export\s+/g, '');
        
        // Compile JSX to React.createElement
        code = compileJSX(code);
        
        transformedModules.push(`\n// ==== ${module.path} ====\n${code}\n`);
      } catch (error) {
        console.error(`Error transforming ${module.path}:`, error);
      }
    }
    
    // Bundle everything together
    const bundle = `
${transformedModules.join('\n')}

// Auto-detect and expose the main component
const __mainComponent__ = 
  (typeof Page !== "undefined" && Page) ||
  (typeof App !== "undefined" && App) ||
  null;

if (__mainComponent__) {
  window.__PREVIEW_RENDER__ = __mainComponent__;
} else {
  console.error('No Page or App component found');
}
`;
    
    return bundle;
  } catch (error) {
    console.error('Bundle error:', error);
    return generateFallbackBundle();
  }
}

function generateFallbackBundle(): string {
  return `
function Page() {
  return React.createElement('div', 
    { style: { padding: '2rem', textAlign: 'center' } },
    React.createElement('h1', null, 'Preview Error'),
    React.createElement('p', null, 'Could not compile the preview. Check console for details.')
  );
}
window.__PREVIEW_RENDER__ = Page;
`;
}
