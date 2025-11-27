interface TransformResult {
  transformedCode: string;
  componentName: string | null;
}

/**
 * Transforms ES6 module code to browser-compatible code for iframe preview
 * - Strips import statements (React/ReactDOM are loaded via CDN)
 * - Converts exports to global variable declarations
 * - Extracts the main component name
 */
export function transformCodeForPreview(code: string, filename: string): TransformResult {
  // Skip non-React files
  if (!filename.endsWith('.tsx') && !filename.endsWith('.jsx')) {
    return { transformedCode: '', componentName: null };
  }
  
  // Skip config files even if they have .ts extension
  if (filename.includes('config') || filename === 'package.json' || filename === 'index.html') {
    return { transformedCode: '', componentName: null };
  }
  
  let transformedCode = code;
  let componentName: string | null = null;

  // Remove all import statements
  transformedCode = transformedCode.replace(/^import\s+.+?\s+from\s+['"][^'"]+['"];?\s*$/gm, '');
  
  // Handle: export default function ComponentName() {...}
  const defaultFunctionMatch = transformedCode.match(/export\s+default\s+function\s+(\w+)/);
  if (defaultFunctionMatch) {
    componentName = defaultFunctionMatch[1];
    transformedCode = transformedCode.replace(
      /export\s+default\s+function\s+(\w+)/,
      'function $1'
    );
  }

  // Handle: export default const ComponentName = ...
  const defaultConstMatch = transformedCode.match(/export\s+default\s+const\s+(\w+)/);
  if (defaultConstMatch) {
    componentName = defaultConstMatch[1];
    transformedCode = transformedCode.replace(/export\s+default\s+const\s+/, 'const ');
  }

  // Handle: const ComponentName = ...; export default ComponentName;
  const exportDefaultMatch = transformedCode.match(/export\s+default\s+(\w+);?\s*$/m);
  if (exportDefaultMatch) {
    componentName = exportDefaultMatch[1];
    transformedCode = transformedCode.replace(/export\s+default\s+\w+;?\s*$/m, '');
  }

  // Handle: export function ComponentName() {...}
  transformedCode = transformedCode.replace(
    /export\s+function\s+(\w+)/g,
    (match, name) => {
      if (!componentName) componentName = name;
      return `function ${name}`;
    }
  );

  // Handle: export const ComponentName = ...
  transformedCode = transformedCode.replace(
    /export\s+const\s+(\w+)/g,
    (match, name) => {
      if (!componentName) componentName = name;
      return `const ${name}`;
    }
  );

  // Remove any remaining export statements
  transformedCode = transformedCode.replace(/export\s+{[^}]+};?\s*/g, '');

  // If we detected a component name, expose it on window so the preview can find it
  if (componentName) {
    transformedCode += `\n;window.${componentName} = ${componentName};`;
  }

  return { transformedCode, componentName };
}

/**
 * Sorts files so dependencies come before components that use them
 */
export function sortFilesByDependency(files: { [key: string]: string }): [string, string][] {
  const entries = Object.entries(files);
  
  // Simple heuristic: files in subdirectories or with "component" in name come first
  // Then pages/app files that likely import from components
  return entries.sort(([pathA], [pathB]) => {
    const aIsComponent = pathA.includes('component') || pathA.includes('banner') || pathA.includes('button');
    const bIsComponent = pathB.includes('component') || pathB.includes('banner') || pathB.includes('button');
    const aIsPage = pathA.includes('page') || pathA.includes('app') || pathA.includes('index');
    const bIsPage = pathB.includes('page') || pathB.includes('app') || pathB.includes('index');
    
    // Components before pages
    if (aIsComponent && bIsPage) return -1;
    if (bIsComponent && aIsPage) return 1;
    
    return 0;
  });
}

/**
 * Detects the main component from a collection of files
 * Prioritizes page-like files first
 */
export function detectMainComponent(files: { [key: string]: string }): string | null {
  // Priority patterns to look for (most specific first)
  const priorityPatterns = [
    /page\.tsx?$/i,
    /app\.tsx?$/i,
    /index\.tsx?$/i,
    /home\.tsx?$/i,
    /main\.tsx?$/i,
    /page_tsx/i,
    /app_tsx/i,
  ];
  
  // First pass: look for priority patterns in filenames
  for (const pattern of priorityPatterns) {
    for (const [filename, content] of Object.entries(files)) {
      // Skip config files and non-React files
      if (!filename.endsWith('.tsx') && !filename.endsWith('.jsx')) continue;
      if (filename.includes('config') || filename === 'package.json' || filename === 'index.html') continue;
      
      if (pattern.test(filename)) {
        const result = transformCodeForPreview(content, filename);
        if (result.componentName) {
          return result.componentName;
        }
      }
    }
  }

  // Second pass: look for any component
  for (const [filename, content] of Object.entries(files)) {
    // Skip config files and non-React files
    if (!filename.endsWith('.tsx') && !filename.endsWith('.jsx')) continue;
    if (filename.includes('config') || filename === 'package.json' || filename === 'index.html') continue;
    
    const result = transformCodeForPreview(content, filename);
    if (result.componentName) {
      return result.componentName;
    }
  }

  return null;
}
