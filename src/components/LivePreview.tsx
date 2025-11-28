import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { PREVIEW_RUNTIME, PREVIEW_STYLES } from '@/utils/preview/previewRuntime';
import { bundleForPreview } from '@/utils/preview/bundler';
interface LivePreviewProps {
  files: { [key: string]: string };
  activeFileId: string;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const DEFAULT_PAGE_TSX = `export default function Page() {
  return (
    <main className=\"min-h-screen flex items-center justify-center bg-white\">
      <h1 className=\"text-2xl font-bold text-gray-900\">Preview Works!</h1>
    </main>
  );
}`;

export default function LivePreview({ files }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!iframeRef.current) return;

    console.log('📁 LivePreview received files:', Object.keys(files));
    console.log('📄 Has src/app/page.tsx:', !!files['src/app/page.tsx']);

    const entryPath = 'src/app/page.tsx';
    const filesForPreview = { ...files };

    if (!filesForPreview[entryPath] || !filesForPreview[entryPath].trim()) {
      console.warn('⚠️ No valid src/app/page.tsx content found, using default preview page');
      filesForPreview[entryPath] = DEFAULT_PAGE_TSX;
    }

    console.log('🔍 Bundling app for preview:', {
      file: entryPath,
      totalFiles: Object.keys(filesForPreview).length,
    });
    
    console.log('📝 Page content:', filesForPreview[entryPath].substring(0, 200));

    try {
      console.log('[LivePreview] Starting bundle process');
      
      // Bundle the code with JSX compilation
      const bundledCode = bundleForPreview(filesForPreview, entryPath);
      console.log('[LivePreview] Bundle complete, size:', bundledCode.length);
      console.log('[LivePreview] Bundled code preview:', bundledCode.substring(0, 300));
      
      // Generate HTML with runtime and bundled code
      const previewHtml = generateBundledPreview(bundledCode);
      iframeRef.current.srcdoc = previewHtml;
      
      console.log('[LivePreview] Preview HTML injected');
    } catch (error) {
      console.error('[LivePreview] Fatal error:', error);
      iframeRef.current.srcdoc = generateFallbackHtml((error as Error).message);
    }
  }, [files, key]);

  const handleRefresh = () => {
    setKey(prev => prev + 1);
  };

  const deviceModeClass = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-full mx-auto border-x border-border',
    mobile: 'w-[375px] h-full mx-auto border-x border-border',
  }[deviceMode];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-2 p-2 border-b border-border bg-card">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`px-3 py-1 text-sm rounded ${
              deviceMode === 'desktop' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`px-3 py-1 text-sm rounded ${
              deviceMode === 'tablet' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            Tablet
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`px-3 py-1 text-sm rounded ${
              deviceMode === 'mobile' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            Mobile
          </button>
        </div>
        <button
          onClick={handleRefresh}
          className="ml-auto p-2 hover:bg-muted rounded"
          title="Refresh preview"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-muted/20">
        <iframe
          ref={iframeRef}
          key={key}
          className={`${deviceModeClass} transition-all duration-300`}
          sandbox="allow-scripts allow-same-origin"
          title="Preview"
        />
      </div>
    </div>
  );
}

// --- Bundled Preview Generator ---------------------------------------------------------------

function generateBundledPreview(bundledCode: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>${PREVIEW_STYLES}</style>
      </head>
      <body class="min-h-screen bg-slate-950 text-slate-50">
        <div id="debug" style="width:100%;max-height:160px;overflow:auto;background:#020617;color:#e5e7eb;padding:8px 12px;font-family:monospace;font-size:11px;border-bottom:1px solid #1f2937;box-sizing:border-box;position:relative;z-index:10;">
          <div style="color:#38bdf8;font-weight:600;margin-bottom:4px;">🔍 Preview Debug Panel</div>
        </div>
        <div id="root" style="min-height:calc(100vh - 160px);"></div>
        <script>
          // Debug logger
          const debugLog = (msg, type = 'info') => {
            const debug = document.getElementById('debug');
            if (!debug) return;
            const color = type === 'error' ? '#f97373' : type === 'success' ? '#4ade80' : '#60a5fa';
            const line = document.createElement('div');
            line.textContent = msg;
            line.style.margin = '2px 0';
            line.style.color = color;
            debug.appendChild(line);
            debug.scrollTop = debug.scrollHeight;
            console.log('[Preview Debug]', msg);
          };
          
          debugLog('🔧 Preview initializing...', 'info');
          
          // Catch any early errors
          window.onerror = function(msg, url, line, col, error) {
            debugLog('❌ Global error: ' + msg, 'error');
            console.error('[Preview Global Error]', msg, error);
            document.getElementById('root').innerHTML = 
              '<div style="padding:2rem;color:red;font-family:monospace;"><h2>JavaScript Error</h2><pre>' + msg + '</pre></div>';
            return true;
          };
          
          // Load React from CDN
          debugLog('📦 Loading React...', 'info');
          const script = document.createElement('script');
          script.crossOrigin = 'anonymous';
          script.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
          
          const scriptDOM = document.createElement('script');
          scriptDOM.crossOrigin = 'anonymous';
          scriptDOM.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
          
          script.onerror = function() {
            debugLog('❌ Failed to load React', 'error');
          };
          
          scriptDOM.onerror = function() {
            debugLog('❌ Failed to load ReactDOM', 'error');
          };
          
          script.onload = function() {
            debugLog('✅ React loaded', 'success');
            debugLog('📦 Loading ReactDOM...', 'info');
            document.head.appendChild(scriptDOM);
          };
          
          scriptDOM.onload = function() {
            debugLog('✅ ReactDOM loaded', 'success');
            try {
              debugLog('🔄 Executing component code...', 'info');
              ${bundledCode}
              
              // Render the component
              if (window.__PREVIEW_RENDER__) {
                debugLog('✅ Component found', 'success');
                debugLog('🎨 Rendering...', 'info');
                const root = document.getElementById('root');
                const component = window.__PREVIEW_RENDER__();
                ReactDOM.render(component, root);
                debugLog('✅ Rendered successfully!', 'success');
              } else {
                debugLog('❌ No component exported', 'error');
                document.getElementById('root').innerHTML = 
                  '<div style="padding:2rem;text-align:center;background:#fef2f2;border:2px solid #ef4444;border-radius:8px;margin:1rem;"><h2 style="color:#dc2626;margin-bottom:1rem;">⚠️ No Component Found</h2><p style="color:#991b1b;">Your code must export a default <code style="background:#fee2e2;padding:2px 6px;border-radius:4px;">Page</code> or <code style="background:#fee2e2;padding:2px 6px;border-radius:4px;">App</code> component.</p><pre style="margin-top:1rem;text-align:left;background:#fff;padding:1rem;border-radius:4px;color:#1f2937;">export default function Page() {\\n  return <div>Hello</div>;\\n}</pre></div>';
              }
            } catch (error) {
              debugLog('❌ Execution error: ' + error.message, 'error');
              document.getElementById('root').innerHTML = 
                '<div style="padding:2rem;color:#dc2626;font-family:monospace;background:#fef2f2;border:2px solid #ef4444;border-radius:8px;margin:1rem;"><h2>❌ Execution Error</h2><pre style="background:#fff;padding:1rem;border-radius:4px;margin-top:1rem;overflow:auto;">' + 
                error.message + '\\n\\n' + (error.stack || '') + '</pre></div>';
            }
          };
          
          document.head.appendChild(script);
        </script>
      </body>
    </html>
  `;
}

function generatePreviewHtml(innerHtml: string, filePath: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview - ${filePath}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${PREVIEW_STYLES}</style>
</head>
<body class="min-h-screen bg-slate-950 text-slate-50">
  <div id="debug" style="width:100%;max-height:140px;overflow:auto;background:#020617;color:#e5e7eb;padding:8px 12px;font-family:monospace;font-size:11px;border-bottom:1px solid #1f2937;box-sizing:border-box;">
    <div style="color:#38bdf8;font-weight:600;margin-bottom:4px;">🔍 Preview Debug Panel</div>
  </div>
  <div id="root" style="min-height:calc(100vh - 140px);"></div>
</body>
</html>`;
}

function generateFallbackHtml(errorMessage?: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${PREVIEW_STYLES}</style>
</head>
<body>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-4 border border-gray-200">
      <div class="text-center">
        <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Preview Unavailable</h1>
        ${errorMessage ? `
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-amber-800 font-medium">Error: ${errorMessage}</p>
          </div>
        ` : ''}
        <p class="text-gray-600 mb-4">The page component couldn't be rendered as static HTML.</p>
        <div class="space-y-2 text-left bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-gray-700 font-medium">Possible reasons:</p>
          <ul class="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Custom components need to be imported</li>
            <li>Dynamic JavaScript expressions</li>
            <li>Complex JSX structure</li>
          </ul>
        </div>
        <p class="text-xs text-gray-500 mt-4">Try simplifying src/app/page.tsx to use only native HTML elements</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateErrorHtml(error: Error, filePath: string): string {
  const message = error.message || 'Unknown error';
  const stack = error.stack || 'No stack trace';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview Error</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${PREVIEW_STYLES}</style>
</head>
<body>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-8">
    <div class="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Preview Error</h1>
      <p class="text-gray-600 mb-2">File: <code>${filePath}</code></p>
      <p class="text-gray-900 mb-4">${message}</p>
      <pre class="p-4 bg-gray-100 rounded-lg text-sm overflow-auto">${stack}</pre>
    </div>
  </div>
</body>
</html>`;
}
