import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { PREVIEW_RUNTIME, PREVIEW_STYLES } from '@/utils/preview/previewRuntime';
import { convertJsxToJsxCalls, extractComponentName } from '@/utils/preview/simpleJsxConverter';

interface LivePreviewProps {
  files: { [key: string]: string };
  activeFileId: string;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

declare global {
  interface Window {
    __APP__?: any;
    __PREVIEW_RUNTIME_INITIALIZED__?: boolean;
    React?: any;
    ReactDOM?: any;
    jsx?: any;
  }
}

export default function LivePreview({ files }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!iframeRef.current) return;

    // Find main entry (for now we only support src/app/page.tsx)
    const mainEntry = Object.entries(files).find(([path]) => path === 'src/app/page.tsx');

    if (!mainEntry) {
      iframeRef.current.srcdoc = generateFallbackHtml();
      return;
    }

    const [filePath, fileContent] = mainEntry;

    try {
      // 1) Initialize lightweight React-like runtime in the parent window (once)
      if (!window.__PREVIEW_RUNTIME_INITIALIZED__) {
        // eslint-disable-next-line no-new-func
        const runtimeFn = new Function(PREVIEW_RUNTIME);
        runtimeFn();
        window.__PREVIEW_RUNTIME_INITIALIZED__ = true;
      }

      // 2) Transform JSX to jsx() calls
      const convertedCode = convertJsxToJsxCalls(fileContent);
      const componentName = extractComponentName(fileContent);

      // 3) Execute transformed component code in parent window
      window.__APP__ = undefined;
      // eslint-disable-next-line no-new-func
      const componentFn = new Function(convertedCode);
      componentFn();

      const App = window.__APP__ || (window as any)[componentName];

      if (!App) {
        throw new Error(`Component '${componentName}' not found on window after execution`);
      }

      // 4) Render into an off-screen container using the inline runtime
      const container = document.createElement('div');
      container.id = 'preview-temp-root';
      document.body.appendChild(container);

      try {
        window.ReactDOM.render(window.jsx(App, {}), container);
        const innerHtml = container.innerHTML;
        const previewHtml = generatePreviewHtml(innerHtml, filePath);

        console.log('🎯 Static Preview Generated:', {
          file: filePath,
          component: componentName,
          htmlLength: innerHtml.length,
        });

        iframeRef.current.srcdoc = previewHtml;
      } finally {
        container.remove();
      }
    } catch (error) {
      console.error('❌ Preview Error (parent runtime):', error);
      iframeRef.current.srcdoc = generateErrorHtml(error as Error, filePath);
    }
  }, [files, key]);

  const handleRefresh = () => {
    setKey(prev => prev + 1);
  };

  const deviceModeClass = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-full mx-auto border-x border-border',
    mobile: 'w-[375px] h-full mx-auto border-x border-border'
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
          // No scripts needed inside iframe; we render HTML statically from parent
          sandbox="allow-same-origin"
          title="Preview"
        />
      </div>
    </div>
  );
}

function generatePreviewHtml(innerHtml: string, filePath: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview - ${filePath}</title>
  <style>${PREVIEW_STYLES}</style>
</head>
<body>
  <div id="root">${innerHtml}</div>
</body>
</html>`;
}

function generateFallbackHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>
  <style>${PREVIEW_STYLES}</style>
</head>
<body>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center space-y-4 p-8">
      <h1 class="text-2xl font-bold text-gray-900">No Preview Available</h1>
      <p class="text-gray-600">No React components found in project</p>
      <p class="text-sm text-gray-600">Create a .tsx or .jsx file to see preview</p>
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
