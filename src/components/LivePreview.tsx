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

  useEffect(() => {
    if (!iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    // Sort files by dependency (components before pages)
    const sortedFiles = sortFilesByDependency(files);
    
    // Transform all files to browser-compatible code
    const transformedFiles = sortedFiles.map(([id, content]) => {
      const result = transformCodeForPreview(content, id);
      return result.transformedCode;
    });

    // Detect the main component to render
    const mainComponent = detectMainComponent(files);
    const mainComponentName = mainComponent ?? "";

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
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="env,react,typescript">
    const { createElement: h, Fragment } = React;
    const { createRoot } = ReactDOM;

    // Global error handler to surface issues in the preview iframe
    window.addEventListener('error', (event) => {
      const root = document.getElementById('root');
      if (root) {
        root.innerHTML = '<div style="padding: 1.5rem; color: #b91c1c; font-family: monospace; white-space: pre-wrap;">' +
          '<strong>Preview error:</strong> ' + (event.message || 'Unknown error') +
          '<br/><br/>' + (event.filename ? 'File: ' + event.filename + ':' + event.lineno : '') + '</div>';
      }
    });

    try {
      // All transformed code bundled together
      const CODE_BUNDLE = ${JSON.stringify(transformedFiles.join("\n\n"))};
      console.log('Loading components...', ${JSON.stringify(Object.keys(files))});
      
      // Evaluate the bundled code safely
      // eslint-disable-next-line no-eval
      eval(CODE_BUNDLE);

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
      } else {
        throw new Error('Invalid component: ' + (typeof RootComponent));
      }
    } catch (error) {
      console.error('Preview error:', error);
      const root = document.getElementById('root');
      if (root) {
        root.innerHTML =
          '<div style="padding: 2rem; color: #ef4444; font-family: monospace; white-space: pre-wrap; max-width: 800px;">' +
          '<strong style="font-size: 1.25rem;">Compilation Error</strong><br/><br/>' +
          (error && error.message ? error.message : 'Unknown error') +
          (error && error.stack ? '<br/><br/><details><summary style="cursor: pointer;">Stack trace</summary><pre style="margin-top: 1rem; padding: 1rem; background: #fee; border-radius: 4px; overflow-x: auto;">' + error.stack + '</pre></details>' : '') +
          '</div>';
      }
    }
  </script>
</body>
</html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();
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
