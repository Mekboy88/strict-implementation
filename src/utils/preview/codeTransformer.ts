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
      'const $1 = function $1'
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
      return `const ${name} = function ${name}`;
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

  return { transformedCode, componentName };
}

/**
 * Detects the main component from a collection of files
 */
export function detectMainComponent(files: { [key: string]: string }): string | null {
  const priorityNames = ['App', 'Page', 'Home', 'Index', 'Main', 'page_tsx', 'app_tsx'];
  
  // First pass: look for priority component names in filenames
  for (const [filename, content] of Object.entries(files)) {
    const lowerFilename = filename.toLowerCase();
    for (const priority of priorityNames) {
      if (lowerFilename.includes(priority.toLowerCase())) {
        const result = transformCodeForPreview(content, filename);
        if (result.componentName) {
          return result.componentName;
        }
      }
    }
  }

  // Second pass: look for any component
  for (const [filename, content] of Object.entries(files)) {
    const result = transformCodeForPreview(content, filename);
    if (result.componentName) {
      return result.componentName;
    }
  }

  return null;
}
