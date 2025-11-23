import { useRef, useEffect, useState } from "react";
import { usePreviewStore } from "@/stores/usePreviewStore";
import { AlertCircle } from "lucide-react";

const MobilePreview = () => {
  const { mobilePreviewHtml } = usePreviewStore();
  const selectedModel = { name: "iPhone 15 Pro Max", width: 430, height: 932 };
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewError, setPreviewError] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const isValidHtml = (html: string): boolean => {
    if (!html || html.trim().length === 0) return false;
    return html.includes('<') && html.includes('>');
  };

  const handleIframeLoad = () => {
    setIsPreviewLoading(false);
    setPreviewError(false);
  };

  const handleIframeError = () => {
    setIsPreviewLoading(false);
    setPreviewError(true);
  };

  useEffect(() => {
    if (mobilePreviewHtml && isValidHtml(mobilePreviewHtml)) {
      setIsPreviewLoading(true);
      setPreviewError(false);
    }
  }, [mobilePreviewHtml]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-ide-editor p-8 relative">
      <div className="relative" style={{ width: `${selectedModel.width}px`, height: `${selectedModel.height}px` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl border-8 border-gray-900">
          <div className="absolute inset-2 bg-black rounded-[2.5rem] overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10"></div>
            
            <div className="w-full h-full bg-white relative">
              {mobilePreviewHtml && isValidHtml(mobilePreviewHtml) ? (
                previewError ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 p-4">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Preview Issue</h3>
                      <p className="text-xs text-gray-600 mb-3">
                        Content ready but couldn't display
                      </p>
                      <button
                        onClick={() => {
                          setPreviewError(false);
                          setIsPreviewLoading(true);
                        }}
                        className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ) : (
                  <iframe
                    ref={iframeRef}
                    srcDoc={mobilePreviewHtml}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    title="Mobile Preview"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Mobile preview will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePreview;
