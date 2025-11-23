import { ArrowLeftRight, X } from "lucide-react";

interface DiffLine {
  lineNum: number;
  content: string;
  type: 'unchanged' | 'added' | 'removed' | 'modified';
}

const DiffView = ({ onClose }: { onClose: () => void }) => {
  const leftFile: DiffLine[] = [];

  const rightFile: DiffLine[] = [];

  const getLineBackground = (type: string) => {
    switch (type) {
      case 'added':
        return 'bg-ide-active/20 border-l-2 border-ide-active/50';
      case 'removed':
        return 'bg-red-950/40 border-l-2 border-red-400';
      case 'modified':
        return 'bg-yellow-950/40 border-l-2 border-yellow-400';
      default:
        return 'bg-transparent';
    }
  };

  return (
    <div className="h-full bg-ide-editor flex flex-col">
      {/* Diff Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-ide-panel border-b border-ide-border">
        <div className="flex items-center gap-3">
          <ArrowLeftRight className="w-4 h-4 text-ide-active" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">App.tsx</span>
            <span className="text-xs text-muted-foreground">(Original)</span>
          </div>
          <ArrowLeftRight className="w-3 h-3 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">App.tsx</span>
            <span className="text-xs text-muted-foreground">(Modified)</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-ide-hover rounded transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </button>
      </div>

      {/* Diff Legend */}
      <div className="flex items-center gap-4 px-4 py-2 bg-ide-panel/50 border-b border-ide-border text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-ide-active/30 border border-ide-active/50 rounded" />
          <span className="text-foreground">Added</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-400/30 border border-red-400 rounded" />
          <span className="text-foreground">Removed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400/30 border border-yellow-400 rounded" />
          <span className="text-foreground">Modified</span>
        </div>
      </div>

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left (Original) */}
        <div className="flex-1 border-r border-ide-border overflow-y-auto">
          <div className="p-4">
            <p className="text-sm text-muted-foreground text-center">Original file content</p>
          </div>
        </div>

        {/* Right (Modified) */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <p className="text-sm text-muted-foreground text-center">Modified file content</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiffView;
