import { useEffect, useRef, useState } from "react";
import { RefreshCw, Smartphone, Monitor, Tablet } from "lucide-react";

interface LivePreviewProps {
  files: { [key: string]: string };
  activeFileId: string;
}

type DeviceMode = "desktop" | "tablet" | "mobile";

const LivePreview = ({ files, activeFileId }: LivePreviewProps) => {
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
  <script type="text/babel">
    const { createElement: h, Fragment } = React;
    const { createRoot } = ReactDOM;

    try {
      ${Object.values(files).join('\n\n')}

      // Find and render the main component
      const App = typeof page_tsx !== 'undefined' ? page_tsx : 
                  typeof Banner !== 'undefined' ? Banner :
                  () => h('div', { style: { padding: '2rem', textAlign: 'center' } },
                    h('h1', { style: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' } }, 
                      'UR-DEV Preview'),
                    h('p', { style: { color: '#64748b' } }, 
                      'Edit your code to see changes here')
                  );

      createRoot(document.getElementById('root')).render(h(App));
    } catch (error) {
      document.getElementById('root').innerHTML = 
        '<div style="padding: 2rem; color: #ef4444; font-family: monospace;">' +
        '<strong>Error:</strong><br/>' + error.message + '</div>';
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
    setKey(prev => prev + 1);
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