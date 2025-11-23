import { useEditorStore } from "@/stores/useEditorStore";
import { usePreviewStore } from "@/stores/usePreviewStore";
import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { Eye, AlertCircle } from "lucide-react";

const EditorPanel = ({ viewMode = 'code' }: { viewMode?: 'code' | 'preview' }) => {
  const { activeFile, fileContent, updateFileContent } = useEditorStore();
  const { desktopPreviewHtml } = usePreviewStore();
  const editorRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewError, setPreviewError] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Validate HTML content
  const isValidHtml = (html: string): boolean => {
    if (!html || html.trim().length === 0) return false;
    // Check for basic HTML structure
    return html.includes('<') && html.includes('>');
  };

  // Handle iframe load success
  const handleIframeLoad = () => {
    setIsPreviewLoading(false);
    setPreviewError(false);
  };

  // Handle iframe load error
  const handleIframeError = () => {
    setIsPreviewLoading(false);
    setPreviewError(true);
    console.error('Preview iframe failed to load');
  };

  // Reset preview state when desktopPreviewHtml changes
  useEffect(() => {
    if (desktopPreviewHtml && isValidHtml(desktopPreviewHtml)) {
      setIsPreviewLoading(true);
      setPreviewError(false);
    }
  }, [desktopPreviewHtml]);

  const handleEditorChange = (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      updateFileContent(activeFile, value);
    }
  };

  // Update editor when file content changes
  useEffect(() => {
    if (editorRef.current && fileContent) {
      // Preserve cursor position when updating content
      if (editorRef.current.getValue() !== fileContent) {
        const model = editorRef.current.getModel();
        model?.setValue(fileContent);
      }
    }
  }, [fileContent]);

  // Force layout recalculation on file change
  useEffect(() => {
    setTimeout(() => {
      editorRef.current?.layout();
    }, 0);
  }, [activeFile]);

  // Fix Monaco layout on window resize
  useEffect(() => {
    const handleResize = () => editorRef.current?.layout();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine language from file extension
  const getLanguage = (filename: string | null) => {
    if (!filename) return "typescript";
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'json': 'json',
      'css': 'css',
      'html': 'html',
      'md': 'markdown',
    };
    return languageMap[ext || ''] || 'typescript';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden" data-editor-pane>
      {/* Editor content area */}
      <div
        id="editor-container"
        className="flex-1 min-h-0 relative"
      >
        {viewMode === 'preview' ? (
          /* Preview Mode - Show live application */
          desktopPreviewHtml && isValidHtml(desktopPreviewHtml) ? (
            previewError ? (
              /* Error fallback */
              <div className="w-full h-full bg-ide-editor flex items-center justify-center">
                <div className="text-center space-y-4 p-8 max-w-md">
                  <AlertCircle className="w-16 h-16 mx-auto text-yellow-500/70" />
                  <p className="text-foreground text-lg font-medium">Preview Display Issue</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The preview content is ready but couldn't display in the frame.
                    The code has been created successfully and is ready to use.
                  </p>
                  <button
                    onClick={() => {
                      setPreviewError(false);
                      setIsPreviewLoading(true);
                      // Force iframe reload
                      if (iframeRef.current) {
                        iframeRef.current.src = 'about:blank';
                        setTimeout(() => {
                          if (iframeRef.current) {
                            iframeRef.current.removeAttribute('src');
                          }
                        }, 100);
                      }
                    }}
                    className="px-4 py-2 bg-ide-hover hover:bg-ide-active border border-ide-border rounded-lg text-sm text-foreground transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              /* Main preview iframe */
              <>
                {isPreviewLoading && (
                  <div className="absolute inset-0 bg-ide-editor/50 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="text-muted-foreground text-sm">Loading preview...</div>
                  </div>
                )}
                <iframe
                  ref={iframeRef}
                  className="w-full h-full bg-white border-0"
                  srcDoc={desktopPreviewHtml}
                  title="Live Preview"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  style={{ 
                    pointerEvents: 'auto',
                    isolation: 'isolate',
                  }}
                />
              </>
            )
          ) : (
            /* Empty state - no preview available */
            <div className="w-full h-full bg-ide-editor flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <Eye className="w-16 h-16 mx-auto text-muted-foreground/30" />
                <p className="text-muted-foreground text-lg">Live Preview</p>
                <p className="text-xs text-muted-foreground/60 max-w-md">
                  Your built application will appear here.<br />
                  Continue building in the chat to generate components.
                </p>
              </div>
            </div>
          )
        ) : activeFile !== null ? (
          <Editor
            height="100%"
            language={getLanguage(activeFile)}
            value={fileContent}
            onChange={handleEditorChange}
            onMount={(editor) => { editorRef.current = editor; }}
            theme="vs-dark"
             options={{
               fontSize: 16,
               minimap: {
                  enabled: false,
                 autohide: true,
                 side: "right",
                 scale: 1,
                 showSlider: "always",
               },
               wordWrap: "off",
               smoothScrolling: true,
               scrollBeyondLastLine: false,
               lineNumbers: "on",
               lineDecorationsWidth: 16,
               lineNumbersMinChars: 3,
               automaticLayout: true,
               readOnly: false,
               renderWhitespace: "boundary",
             }}
          />
        ) : (
          // Placeholder when no file is open
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="text-sm">No file open</p>
              <p className="text-xs mt-2">Open a file from the chat to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPanel;
