import { useEffect, useRef, useState } from "react";
import { RefreshCw, Smartphone, Monitor, Tablet } from "lucide-react";
import { transformCodeForPreview, detectMainComponent, sortFilesByDependency } from "@/utils/preview/codeTransformer";

interface LivePreviewProps {
  files: { [key: string]: string };
  activeFileId: string;
}

type DeviceMode = "desktop" | "tablet" | "mobile";

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
        !path.includes('main.tsx') &&
        !path.includes('main.jsx') &&
        !path.includes('/main.') &&
        path !== 'package.json' &&
        path !== 'index.html'
      )
    );

    console.log('LivePreview filtered to React files:', Object.keys(reactFiles));

    // If there are no React files, show an explicit blank-preview debug screen
    if (Object.keys(reactFiles).length === 0) {
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

    // Sort files by dependency (components before pages)
    const sortedFiles = sortFilesByDependency(reactFiles);
    
    // Transform all files to browser-compatible code
    const transformedFiles = sortedFiles.map(([id, content]) => {
      const result = transformCodeForPreview(content, id);
      return result.transformedCode;
    });

    // Detect the main component to render
    const mainComponent = detectMainComponent(reactFiles);
    const mainComponentName = mainComponent ?? "";
    
    console.log('LivePreview detected main component:', mainComponentName);

    // Create HTML document with React app
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
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
  </style>
</head>
<body>
  <div id="root"><div style="min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;color:#0f172a;background:#f9fafb;">
      <div style="text-align:center;max-width:480px;padding:1.5rem;">
        <div style="font-size:0.75rem;letter-spacing:0.18em;text-transform:uppercase;color:#6b7280;margin-bottom:0.25rem;font-weight:600;">UR-DEV · Live preview</div>
        <div style="font-size:0.95rem;color:#111827;">Preparing preview… if this message stays, the scripts inside the iframe are failing to run.</div>
      </div>
    </div></div>
  <div id="error-display" style="display: none; padding: 2rem; background: #1a1a1a; color: #fff; font-family: system-ui; position: relative; min-height: 100vh;">
    <button 
      id="fix-error-top" 
      style="position: absolute; top: 1.5rem; right: 1.5rem; padding: 0.625rem 1.25rem; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.875rem; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: all 0.2s;"
      onmouseover="this.style.background='#dc2626'"
      onmouseout="this.style.background='#ef4444'"
      onclick="window.parent.postMessage({ type: 'FIX_ERROR', error: document.getElementById('error-data').textContent }, '*')"
    >
      🔧 Fix Error
    </button>
    <h2 style="color: #ef4444; margin-bottom: 1.5rem; font-size: 1.5rem; font-weight: 700;">Preview Error</h2>
    <div style="background: #2d2d2d; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 1.5rem;">
      <pre id="error-message" style="white-space: pre-wrap; color: #fbbf24; margin: 0; font-family: 'Courier New', monospace; font-size: 0.875rem; line-height: 1.6;"></pre>
    </div>
    <details style="margin-bottom: 2rem; background: #2d2d2d; padding: 1rem; border-radius: 8px;">
      <summary style="cursor: pointer; color: #60a5fa; font-weight: 600; user-select: none;">📋 Stack Trace</summary>
      <pre id="error-stack" style="white-space: pre-wrap; color: #9ca3af; margin-top: 1rem; font-family: 'Courier New', monospace; font-size: 0.75rem; line-height: 1.5; overflow-x: auto;"></pre>
    </details>
    <div id="error-data" style="display: none;"></div>
    <button 
      id="fix-error-bottom" 
      style="padding: 1rem 2rem; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; width: 100%; font-size: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: all 0.2s;"
      onmouseover="this.style.background='#dc2626'; this.style.transform='translateY(-2px)'"
      onmouseout="this.style.background='#ef4444'; this.style.transform='translateY(0)'"
      onclick="window.parent.postMessage({ type: 'FIX_ERROR', error: document.getElementById('error-data').textContent }, '*')"
    >
      🤖 Please Fix This Error
    </button>
  </div>
  <script type="text/babel" data-presets="env,react,typescript">
    const { createElement: h, Fragment } = React;
    const { createRoot } = ReactDOM;

    // Global error handler to show errors in the error display
    window.addEventListener('error', (event) => {
      const errorDisplay = document.getElementById('error-display');
      const errorMessage = document.getElementById('error-message');
      const errorStack = document.getElementById('error-stack');
      const errorData = document.getElementById('error-data');
      const root = document.getElementById('root');
      
      if (errorDisplay && errorMessage && root) {
        errorDisplay.style.display = 'block';
        root.style.display = 'none';
        errorMessage.textContent = event.message || 'Unknown error';
        if (errorStack && event.error && event.error.stack) {
          errorStack.textContent = event.error.stack;
        }
        if (errorData) {
          errorData.textContent = JSON.stringify({
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack
          }, null, 2);
        }
      }
    });

    try {
      // All transformed code (each file already exposes its component on window)
      ${transformedFiles.join("\n\n")}

      // Render the detected main component
      const MAIN_COMPONENT_NAME = ${JSON.stringify(mainComponentName)};
      console.log('Rendering component:', MAIN_COMPONENT_NAME);
      const RootComponent = MAIN_COMPONENT_NAME && typeof window[MAIN_COMPONENT_NAME] === 'function'
        ? window[MAIN_COMPONENT_NAME]
        : (() => h('div', { style: { padding: '2rem', textAlign: 'center', fontFamily: 'system-ui' } },
            h('div', { style: { fontSize: '3rem', marginBottom: '1rem' } }, '⚠️'),
            h('h1', { style: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' } },
              'No Component Found'),
            h('p', { style: { color: '#6b7280', marginBottom: '1rem' } },
              'Could not detect a React component to render.'),
            h('p', { style: { color: '#9ca3af', fontSize: '0.875rem' } },
              'Make sure your code exports a React component.')
          ));

      const root = document.getElementById('root');
      if (root && typeof RootComponent === 'function') {
        createRoot(root).render(h(RootComponent));
        // Notify parent window that preview rendered successfully
        try {
          window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
        } catch (e) {
          console.warn('Unable to notify parent about preview readiness', e);
        }
      } else {
        throw new Error('Invalid component: ' + (typeof RootComponent));
      }
    } catch (error) {
      console.error('Preview error:', error);
      const errorDisplay = document.getElementById('error-display');
      const errorMessage = document.getElementById('error-message');
      const errorStack = document.getElementById('error-stack');
      const errorData = document.getElementById('error-data');
      const root = document.getElementById('root');
      
      if (errorDisplay && errorMessage && root) {
        errorDisplay.style.display = 'block';
        root.style.display = 'none';
        errorMessage.textContent = error && error.message ? error.message : 'Unknown compilation error';
        if (errorStack && error && error.stack) {
          errorStack.textContent = error.stack;
        }
        if (errorData) {
          errorData.textContent = JSON.stringify({
            message: error?.message,
            stack: error?.stack,
            type: 'compilation'
          }, null, 2);
        }
      }
    }
  </script>
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
