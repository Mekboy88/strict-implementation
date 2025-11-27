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
  const [lastFilesHash, setLastFilesHash] = useState('');

  useEffect(() => {
    if (!iframeRef.current) return;

    // TEMP: render a guaranteed-safe demo preview independent of project files
    const demoHtml = generateFixedDemoHtml();
    iframeRef.current.srcdoc = demoHtml;
  }, [key]);

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
  const escapedComponentCode = componentCode
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");

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
</body>
</html>`;
}

// TEMP: fixed demo HTML so preview is never blank while we debug runtime
function generateFixedDemoHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UR-DEV Preview Demo</title>
  <style>${PREVIEW_STYLES}</style>
</head>
<body class="min-h-screen flex items-center justify-center bg-gray-50">
  <div class="max-w-2xl w-full text-center space-y-4 p-8 bg-white border border-gray-200 rounded-lg shadow-lg">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">UR-DEV Preview Demo</h1>
    <p class="text-lg text-gray-600">Preview engine is online and rendering a safe demo layout.</p>
    <p class="text-sm text-gray-600 mt-2">Your code will be wired into this preview once the runtime pipeline is fully stable.</p>
  </div>
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
