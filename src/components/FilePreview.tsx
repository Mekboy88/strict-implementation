import { File } from "lucide-react";

const FilePreview = () => {
  return (
    <div className="h-full bg-ide-panel border-r border-ide-border flex flex-col">
      <div className="px-3 py-3 border-b border-ide-border">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Preview
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* File Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <File className="w-4 h-4 text-ide-active" />
            <span className="text-sm font-medium text-foreground">index.tsx</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Size: 2.4 KB</div>
            <div>Type: TypeScript React</div>
          </div>
        </div>
        
        {/* Code Preview */}
        <div className="mt-4">
          <div className="text-xs text-muted-foreground mb-2">First 10 lines:</div>
          <div className="bg-ide-editor rounded border border-ide-border p-2 text-xs font-mono space-y-1">
            <div className="text-muted-foreground">
              <span className="text-purple-400">import</span> <span className="text-foreground">React</span> <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>;
            </div>
            <div className="text-muted-foreground">
              <span className="text-purple-400">import</span> <span className="text-foreground">ReactDOM</span> <span className="text-purple-400">from</span> <span className="text-green-400">'react-dom'</span>;
            </div>
            <div className="text-muted-foreground">
              <span className="text-purple-400">import</span> <span className="text-foreground">App</span> <span className="text-purple-400">from</span> <span className="text-green-400">'./App'</span>;
            </div>
            <div className="h-3"></div>
            <div className="text-muted-foreground">
              <span className="text-purple-400">const</span> <span className="text-blue-400">root</span> = <span className="text-foreground">ReactDOM</span>.<span className="text-yellow-400">createRoot</span>(
            </div>
            <div className="text-muted-foreground ml-4">
              <span className="text-foreground">document</span>.<span className="text-yellow-400">getElementById</span>(<span className="text-green-400">'root'</span>)
            </div>
            <div className="text-muted-foreground">);</div>
            <div className="h-3"></div>
            <div className="text-muted-foreground">
              <span className="text-foreground">root</span>.<span className="text-yellow-400">render</span>(
            </div>
            <div className="text-muted-foreground ml-4">
              &lt;<span className="text-blue-400">App</span> /&gt;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
