/**
 * Preview Generator Utility
 * 
 * Handles detection and generation of HTML preview content for the IDE,
 * including intelligent main file detection and React component wrapping.
 * 
 * @module utils/preview/previewGenerator
 */

import { FileOperation } from "../aiFileParser";

/**
 * Detects the main file for preview rendering
 * 
 * Uses priority hierarchy:
 * 1. Files in src/pages/*.tsx (page components)
 * 2. App.tsx or main.tsx (application entry points)
 * 3. Any .tsx/.jsx/.html file (fallback to any component)
 * 
 * @param {FileOperation[]} operations - List of file operations from AI
 * @returns {string | null} Path to main file, or null if none found
 * 
 * @example
 * ```typescript
 * const mainFile = detectMainFile(fileOps);
 * // Returns: "src/pages/HomePage.tsx"
 * ```
 */
export const detectMainFile = (operations: FileOperation[]): string | null => {
  // Priority 1: src/pages/*.tsx files
  const pageFile = operations.find((op) =>
    op.path.startsWith('src/pages/') && op.path.endsWith('.tsx')
  );
  if (pageFile) return pageFile.path;

  // Priority 2: App.tsx or main.tsx
  const appFile = operations.find((op) =>
    op.path === 'src/App.tsx' || op.path === 'src/main.tsx'
  );
  if (appFile) return appFile.path;

  // Priority 3: Any .tsx/.jsx/.html file
  const anyFile = operations.find((op) =>
    op.path.endsWith('.tsx') || op.path.endsWith('.jsx') || op.path.endsWith('.html')
  );
  if (anyFile) return anyFile.path;

  return null;
};

/**
 * Finds a pure HTML preview file if AI generated one
 * 
 * @param {FileOperation[]} operations - List of file operations from AI
 * @returns {FileOperation | null} HTML preview file operation, or null
 * 
 * @example
 * ```typescript
 * const htmlFile = findPreviewHtmlFile(operations);
 * if (htmlFile) {
 *   setPreview(htmlFile.content);
 * }
 * ```
 */
export const findPreviewHtmlFile = (operations: FileOperation[]): FileOperation | null => {
  return operations.find((op) => op.path === 'public/preview.html') || null;
};

/**
 * Generates an HTML shell wrapper for React component preview
 * 
 * Creates a complete HTML document with:
 * - Tailwind CSS via CDN
 * - React and ReactDOM via CDN
 * - Babel for JSX/TSX transpilation
 * - Component rendering logic
 * 
 * @param {string} componentCode - The React component code (TSX/JSX)
 * @param {string} componentName - Name of the component to render
 * @returns {string} Complete HTML document as string
 * 
 * @example
 * ```typescript
 * const html = generatePreviewHtmlShell(
 *   "const Button = () => <button>Click</button>",
 *   "Button"
 * );
 * // Returns full HTML with React component rendered
 * ```
 */
export const generatePreviewHtmlShell = (
  componentCode: string,
  componentName: string
): string => {
  // Validate inputs
  if (!componentCode || componentCode.trim().length === 0) {
    return generateFallbackPreview('No component code provided');
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="typescript,react">
    try {
      ${componentCode}
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      const ComponentToRender = ${componentName} || defaultExport || App || (() => (
        <div style={{padding: '20px', fontFamily: 'system-ui', color: '#333'}}>
          <h2>Preview Ready</h2>
          <p>Component loaded successfully</p>
        </div>
      ));
      root.render(<ComponentToRender />);
    } catch (error) {
      console.error('Preview render error:', error);
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(
        <div style={{padding: '20px', fontFamily: 'system-ui', color: '#333'}}>
          <h2>Preview Error</h2>
          <p>The component code was created successfully but couldn't render in preview.</p>
          <p style={{fontSize: '14px', color: '#666', marginTop: '10px'}}>Check the editor for the generated code.</p>
        </div>
      );
    }
  </script>
</body>
</html>`;
};

/**
 * Generates a fallback preview when normal preview fails
 * 
 * @param {string} message - Error or info message to display
 * @returns {string} Fallback HTML content
 */
export const generateFallbackPreview = (message: string): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center p-4">
  <div class="text-center max-w-md">
    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
      <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </div>
    <h2 class="text-xl font-semibold text-gray-900 mb-2">Preview Status</h2>
    <p class="text-gray-600 text-sm">${message}</p>
  </div>
</body>
</html>`;
};
