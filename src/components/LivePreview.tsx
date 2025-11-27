import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { PREVIEW_RUNTIME, PREVIEW_STYLES } from '@/utils/preview/previewRuntime';
import { convertJsxToJsxCalls, extractComponentName } from '@/utils/preview/simpleJsxConverter';

interface LivePreviewProps {
  files: { [key: string]: string };
  activeFileId: string;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export default function LivePreview({ files }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!iframeRef.current) return;

    // Find React component files
    const reactFiles = Object.entries(files).filter(([path]) => 
      path.endsWith('.tsx') || path.endsWith('.jsx')
    );

    if (reactFiles.length === 0) {
      const fallbackHtml = generateFallbackHtml();
      iframeRef.current.srcdoc = fallbackHtml;
      return;
    }

    // Find main entry point (prefer simple pages, avoid Index.tsx IDE file)
    const mainFile = reactFiles.find(([path]) => path === 'src/app/page.tsx') ||
                     reactFiles.find(([path]) => path.includes('App.tsx') && !path.includes('/pages/')) ||
                     reactFiles.find(([path]) => !path.includes('/pages/Index.tsx')) ||
                     reactFiles[0];

    const [filePath, fileContent] = mainFile;

    try {
      const convertedCode = convertJsxToJsxCalls(fileContent);
      const componentName = extractComponentName(fileContent);
      const previewHtml = generatePreviewHtml(convertedCode, componentName, filePath);
      
      console.log('🎯 Preview Generated:', {
        file: filePath,
        component: componentName,
        codeLength: convertedCode.length
      });

      iframeRef.current.srcdoc = previewHtml;
    } catch (error) {
      console.error('❌ Preview Error:', error);
      const errorHtml = generateErrorHtml(error as Error, filePath);
      iframeRef.current.srcdoc = errorHtml;
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
          sandbox="allow-scripts allow-same-origin"
          title="Preview"
        />
      </div>
    </div>
  );
}

function generatePreviewHtml(componentCode: string, componentName: string, filePath: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>
  <style>${PREVIEW_STYLES}</style>
</head>
<body>
  <div id="root">Loading...</div>
  
  <script>
    try {
      ${PREVIEW_RUNTIME}
      
      // Component code
      ${componentCode}
      
      // Render
      const root = document.getElementById("root");
      const App = window.__APP__ || window.${componentName};
      
      if (App) {
        ReactDOM.render(jsx(App, {}), root);
        console.log("✅ Rendered:", "${componentName}");
      } else {
        throw new Error("Component not found");
      }
    } catch (error) {
      console.error("Preview Error:", error);
      document.getElementById("root").innerHTML = 
        '<div style="padding: 2rem; color: #dc2626;">' +
        '<h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Preview Error</h1>' +
        '<p style="color: #6b7280;">' + error.message + '</p>' +
        '<pre style="margin-top: 1rem; padding: 1rem; background: #f3f4f6; border-radius: 0.5rem; overflow: auto;">' +
        error.stack + '</pre>' +
        '</div>';
    }
  </script>
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
      <p class="text-gray-900 mb-4">${error.message}</p>
      <pre class="p-4 bg-gray-100 rounded-lg text-sm overflow-auto">${error.stack || 'No stack trace'}</pre>
    </div>
  </div>
</body>
</html>`;
}
