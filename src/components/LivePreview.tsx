import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { PREVIEW_STYLES } from '@/utils/preview/previewRuntime';
import { convertJSXToHTML } from '@/utils/preview/jsxToHtmlConverter';
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

    const mainEntry = Object.entries(files).find(([path]) => path === 'src/app/page.tsx');

    if (!mainEntry) {
      console.warn('⚠️ No src/app/page.tsx found in files');
      iframeRef.current.srcdoc = generateFallbackHtml();
      return;
    }

    const [filePath, fileContent] = mainEntry;
    
    console.log('🔍 Converting JSX to HTML:', {
      file: filePath,
      contentLength: fileContent.length,
      contentPreview: fileContent.slice(0, 200) + '...',
    });

    try {
      const { html, success, error } = convertJSXToHTML(fileContent, filePath);

      if (!success) {
        console.error('❌ JSX Conversion Failed:', error);
        console.log('📄 File content:', fileContent);
        iframeRef.current.srcdoc = generateFallbackHtml(error);
        return;
      }

      const previewHtml = generatePreviewHtml(html, filePath);
      console.log('✅ Static Preview Generated:', {
        file: filePath,
        htmlLength: html.length,
      });

      iframeRef.current.srcdoc = previewHtml;
    } catch (error) {
      console.error('❌ Preview Error:', error);
      console.log('📄 File content:', fileContent);
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
          sandbox="allow-same-origin"
          title="Preview"
        />
      </div>
    </div>
  );
}

// --- Helpers ---------------------------------------------------------------

function extractStaticHtmlFromReactComponent(source: string): string {
  // Handle: return (<main>...</main>); or return <main>...</main>;
  let match = source.match(/return\s*\(([\s\S]*?)\);/);

  if (!match) {
    match = source.match(/return\s*(<[^;]+);/);
  }

  if (!match) {
    throw new Error('Could not find JSX return in component');
  }

  let jsxBlock = match[1].trim();

  // Convert React-specific attributes to HTML
  jsxBlock = jsxBlock.replace(/className=/g, 'class=');

  // Remove very simple fragments: <>...</>
  if (jsxBlock.startsWith('<>') && jsxBlock.endsWith('</>')) {
    jsxBlock = jsxBlock.slice(2, -3).trim();
  }

  return jsxBlock;
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

function generateFallbackHtml(errorMessage?: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>
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
