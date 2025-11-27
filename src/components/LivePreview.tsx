import { useEffect, useRef, useState } from "react";
import { RefreshCw, Smartphone, Monitor, Tablet } from "lucide-react";
import { convertJSXToHTML, extractComponentName } from "@/utils/preview/jsxToHtmlConverter";
import { INLINE_TAILWIND_RESET } from "@/utils/preview/inlineReactRuntime";

interface LivePreviewProps {
  files: { [key: string]: string };
  activeFileId: string;
}

type DeviceMode = "desktop" | "tablet" | "mobile";

// Helper function to escape HTML
function escapeHtml(text: string): string {
  const htmlEscapes: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}

const LivePreview = ({ files }: LivePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [key, setKey] = useState(0);

  const deviceSizes = {
    desktop: { width: "100%", height: "100%" },
    tablet: { width: "768px", height: "1024px" },
    mobile: { width: "375px", height: "667px" },
  };

  // Listen for fix error messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'FIX_ERROR') {
        console.log('Fix error requested from preview:', event.data.error);
        // Trigger a custom event that can be picked up by the chat component
        window.dispatchEvent(new CustomEvent('request-error-fix', { 
          detail: { error: event.data.error } 
        }));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (!iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    // DEBUG: Log what files we received
    console.log('LivePreview received files:', Object.keys(files));

    // Filter to only include React component files for preview
    const reactFiles = Object.fromEntries(
      Object.entries(files).filter(([path]) => 
        (path.endsWith('.tsx') || path.endsWith('.jsx')) &&
        !path.includes('config') &&
        !path.includes('vite.config') &&
        !path.includes('tailwind.config') &&
        !path.includes('main.tsx') &&
        !path.includes('main.jsx') &&
        !path.includes('/main.') &&
        path !== 'package.json' &&
        path !== 'index.html'
      )
    );

    console.log('LivePreview filtered to React files:', Object.keys(reactFiles));
    
    // Find the main page component (prioritize page.tsx, app.tsx, index.tsx)
    const priorityPatterns = [
      /page\.tsx?$/i,
      /app\.tsx?$/i,
      /index\.tsx?$/i,
    ];
    
    let mainFilePath: string | null = null;
    let mainFileContent: string | null = null;
    
    for (const pattern of priorityPatterns) {
      const entry = Object.entries(reactFiles).find(([path]) => pattern.test(path));
      if (entry) {
        [mainFilePath, mainFileContent] = entry;
        break;
      }
    }
    
    // If no priority file found, use the first available
    if (!mainFilePath && Object.keys(reactFiles).length > 0) {
      [mainFilePath, mainFileContent] = Object.entries(reactFiles)[0];
    }
    
    console.log('LivePreview main file:', mainFilePath);

    // If there are no React files or no main file, show debug screen
    if (!mainFilePath || !mainFileContent) {
      console.warn('LivePreview: no React files detected for preview. All files:', Object.keys(files));
      const debugHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #020617; color: #e5e7eb; margin: 0; padding: 0; }
    .wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .card { max-width: 720px; width: 100%; border-radius: 1rem; border: 1px solid rgba(148,163,184,0.4); background: radial-gradient(circle at top left, rgba(56,189,248,0.12), transparent 55%), #020617; padding: 1.75rem 2rem; box-shadow: 0 22px 45px rgba(15,23,42,0.8); }
    .eyebrow { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.18em; color: #38bdf8; font-weight: 600; margin-bottom: 0.5rem; }
    h1 { font-size: 1.3rem; margin: 0 0 0.5rem 0; color: #e5e7eb; }
    p { font-size: 0.85rem; color: #9ca3af; margin: 0.25rem 0; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size: 0.8rem; padding: 0.15rem 0.35rem; border-radius: 0.375rem; background: rgba(15,23,42,0.9); color: #e5e7eb; }
    .list { margin-top: 0.75rem; padding: 0.75rem 0.75rem 0.5rem; border-radius: 0.75rem; background: rgba(15,23,42,0.85); max-height: 190px; overflow: auto; border: 1px solid rgba(15,23,42,0.9); }
    .list h2 { font-size: 0.8rem; margin: 0 0 0.35rem 0; color: #cbd5f5; }
    .list p { font-size: 0.78rem; margin: 0.1rem 0; color: #9ca3af; word-break: break-all; }
    .hint { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed rgba(51,65,85,0.9); font-size: 0.78rem; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <article class="card" aria-label="Preview debugging information">
      <div class="eyebrow">UR-DEV · Preview Debug</div>
      <h1>Nothing to render yet</h1>
      <p>The preview engine couldn't find any <code>.tsx</code> or <code>.jsx</code> files to render.</p>
      <p>Once AI creates a React file like <code>src/app/page.tsx</code> with a default export, it will show up here automatically.</p>
      <div class="list">
        <h2>Files currently visible to preview:</h2>
        ${Object.keys(files).length
          ? Object.keys(files).map((f) => `<p>• <code>${f}</code></p>`).join('')
          : '<p>No files yet – ask AI to generate your project files.</p>'}
      </div>
      <div class="hint">
        Tip: ask the assistant to "Create a main page at <code>src/app/page.tsx</code> with a simple heading" to get started.
      </div>
    </article>
  </div>
</body>
</html>`;

      doc.open();
      doc.write(debugHtml);
      doc.close();

      // Notify parent that preview is in a blank state for higher-level automation
      try {
        window.parent.postMessage({ type: 'PREVIEW_BLANK', fileCount: Object.keys(files).length }, '*');
      } catch (e) {
        console.warn('LivePreview: unable to post PREVIEW_BLANK message', e);
      }

      return;
    }

    // Convert JSX to static HTML
    console.log('Converting JSX to HTML for:', mainFilePath);
    const conversionResult = convertJSXToHTML(mainFileContent, mainFilePath);
    
    if (!conversionResult.success) {
      console.error('JSX to HTML conversion failed:', conversionResult.error);
      
      // Show error in preview
      const errorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: system-ui; background: #1a1a1a; color: #fff; margin: 0; padding: 2rem; }
    .error { max-width: 600px; margin: 0 auto; }
    h1 { color: #ef4444; margin-bottom: 1rem; }
    pre { background: #2d2d2d; padding: 1rem; border-radius: 8px; overflow-x: auto; }
  </style>
</head>
<body>
  <div class="error">
    <h1>⚠️ Preview Error</h1>
    <p>Failed to convert JSX to HTML for preview.</p>
    <pre>${escapeHtml(conversionResult.error || 'Unknown error')}</pre>
    <p style="margin-top: 1rem; color: #9ca3af;">File: <code>${mainFilePath}</code></p>
  </div>
</body>
</html>`;
      
      doc.open();
      doc.write(errorHtml);
      doc.close();
      return;
    }

    const componentName = extractComponentName(mainFileContent);
    console.log('Component name:', componentName, 'HTML length:', conversionResult.html.length);

    // Create static HTML document (NO JAVASCRIPT EXECUTION)
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    ${INLINE_TAILWIND_RESET}
    :root {
      --background: 0 0% 100%;
      --foreground: 240 10% 3.9%;
      --card: 0 0% 100%;
      --card-foreground: 240 10% 3.9%;
      --primary: 240 5.9% 10%;
      --primary-foreground: 0 0% 98%;
      --secondary: 240 4.8% 95.9%;
      --secondary-foreground: 240 5.9% 10%;
      --muted: 240 4.8% 95.9%;
      --muted-foreground: 240 3.8% 46.1%;
      --accent: 240 4.8% 95.9%;
      --accent-foreground: 240 5.9% 10%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 0 0% 98%;
      --border: 240 5.9% 90%;
      --input: 240 5.9% 90%;
      --ring: 240 5.9% 10%;
      --radius: 0.5rem;
    }
    
    /* Comprehensive Tailwind utility classes */
    * { box-sizing: border-box; }
    .min-h-screen { min-height: 100vh; }
    .bg-background { background-color: hsl(var(--background)); }
    .text-foreground { color: hsl(var(--foreground)); }
    .text-muted-foreground { color: hsl(var(--muted-foreground)); }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .justify-between { justify-content: space-between; }
    .space-y-4 > * + * { margin-top: 1rem; }
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .p-8 { padding: 2rem; }
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
    .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
    .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
    .text-2xl { font-size: 1.5rem; line-height: 2rem; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .text-base { font-size: 1rem; line-height: 1.5rem; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-8 { margin-top: 2rem; }
    .max-w-7xl { max-width: 80rem; }
    .max-w-6xl { max-width: 72rem; }
    .max-w-4xl { max-width: 56rem; }
    .max-w-2xl { max-width: 42rem; }
    .max-w-xl { max-width: 36rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .w-full { width: 100%; }
    .h-full { height: 100%; }
    .text-center { text-align: center; }
    .rounded-lg { border-radius: 0.5rem; }
    .rounded { border-radius: 0.25rem; }
    .border { border-width: 1px; }
    .border-border { border-color: hsl(var(--border)); }
    .bg-card { background-color: hsl(var(--card)); }
    .bg-primary { background-color: hsl(var(--primary)); }
    .bg-secondary { background-color: hsl(var(--secondary)); }
    .bg-muted { background-color: hsl(var(--muted)); }
    .bg-white { background-color: white; }
    .bg-gray-50 { background-color: rgb(249 250 251); }
    .bg-gray-100 { background-color: rgb(243 244 246); }
    .text-primary-foreground { color: hsl(var(--primary-foreground)); }
    .text-secondary-foreground { color: hsl(var(--secondary-foreground)); }
    .shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
    .shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
    .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
    .overflow-hidden { overflow: hidden; }
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }
    .gap-8 { gap: 2rem; }
    .object-cover { object-fit: cover; }
    .h-48 { height: 12rem; }
    .h-64 { height: 16rem; }
    .container { width: 100%; padding-left: 1rem; padding-right: 1rem; margin-left: auto; margin-right: auto; }
    @media (min-width: 640px) { .container { max-width: 640px; } }
    @media (min-width: 768px) { .container { max-width: 768px; } }
    @media (min-width: 1024px) { .container { max-width: 1024px; } }
    @media (min-width: 1280px) { .container { max-width: 1280px; } }
  </style>
</head>
<body>
  <div id="app">
    ${conversionResult.html}
  </div>
  <div style="position: fixed; bottom: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-family: monospace;">
    ✓ Static HTML • CDN-Free ${componentName ? `• ${componentName}` : ''}
  </div>
</body>
</html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    // Fallback detection: if nothing rendered after a short delay, notify parent
    setTimeout(() => {
      const iframeDoc = iframeRef.current?.contentDocument;
      const root = iframeDoc?.getElementById('root');
      const errorDisplay = iframeDoc?.getElementById('error-display');
      if (root && !errorDisplay && root.innerHTML.trim() === '') {
        window.dispatchEvent(new CustomEvent('preview-not-rendering', {
          detail: {
            reason: 'empty-root',
            fileCount: Object.keys(files).length,
          },
        }));
      }
    }, 2500);
  }, [files, key]);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const currentSize = deviceSizes[deviceMode];

  return (
    <div className="h-full flex flex-col bg-neutral-900">
      {/* Preview toolbar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-neutral-900 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Live Preview</span>
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs text-slate-500">Auto-refresh on save</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Device mode selector */}
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`p-1.5 rounded transition-colors ${
                deviceMode === "desktop"
                  ? "bg-white/10 text-sky-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
              title="Desktop view"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode("tablet")}
              className={`p-1.5 rounded transition-colors ${
                deviceMode === "tablet"
                  ? "bg-white/10 text-sky-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
              title="Tablet view"
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`p-1.5 rounded transition-colors ${
                deviceMode === "mobile"
                  ? "bg-white/10 text-sky-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
              title="Mobile view"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            title="Refresh preview"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Preview iframe container */}
      <div className="flex-1 overflow-auto bg-neutral-950 flex items-center justify-center p-4">
        <div
          className="bg-white shadow-2xl transition-all duration-300"
          style={{
            width: currentSize.width,
            height: currentSize.height,
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          <iframe
            ref={iframeRef}
            key={key}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title="Live Preview"
          />
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
