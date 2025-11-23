import { Eye, RotateCcw, X, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PreviewItem {
  id: string;
  timestamp: string;
  description: string;
  previewUrl: string;
  color: string;
}

interface PreviewHistoryPanelProps {
  onClose: () => void;
}

const PreviewHistoryPanel = ({ onClose }: PreviewHistoryPanelProps) => {
  // Mock preview history data
  const previewHistory: PreviewItem[] = [
    {
      id: "1",
      timestamp: "17 Nov 2024 · 16:44",
      description: "Added unified menu dropdown to top navigation",
      previewUrl: "#",
      color: "bg-ide-active"
    },
    {
      id: "2",
      timestamp: "17 Nov 2024 · 15:32",
      description: "Implemented customizable workspace presets",
      previewUrl: "#",
      color: "bg-blue-500"
    },
    {
      id: "3",
      timestamp: "17 Nov 2024 · 14:18",
      description: "Created diff mode for file comparison",
      previewUrl: "#",
      color: "bg-purple-500"
    },
    {
      id: "4",
      timestamp: "17 Nov 2024 · 13:05",
      description: "Added AI snippets library feature",
      previewUrl: "#",
      color: "bg-orange-500"
    },
    {
      id: "5",
      timestamp: "17 Nov 2024 · 11:47",
      description: "Enhanced terminal with typing animation",
      previewUrl: "#",
      color: "bg-pink-500"
    },
  ];

  const handlePreview = (url: string) => {
    console.log("Opening preview:", url);
    // UI only - no actual navigation
  };

  const handleRestore = (id: string, description: string) => {
    console.log("Restoring preview:", id, description);
    // UI only - no actual restore
  };

  return (
    <div className="absolute inset-0 bg-ide-sidebar/95 backdrop-blur-sm z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ide-border">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-ide-active" />
          <h3 className="text-sm font-semibold text-foreground">Preview History</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-ide-hover transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 px-4 py-2">
        <div className="space-y-2">
          {previewHistory.map((item) => (
            <div
              key={item.id}
              className="group p-3 rounded-lg bg-ide-panel border border-ide-border hover:border-ide-active hover:bg-ide-hover transition-all"
            >
              <div className="flex items-start gap-3">
                {/* Status indicator */}
                <div className={`w-2 h-2 rounded-full ${item.color} mt-1.5 flex-shrink-0`} />
                
                <div className="flex-1 min-w-0">
                  {/* Timestamp */}
                  <div className="text-xs text-muted-foreground mb-1">
                    {item.timestamp}
                  </div>
                  
                  {/* Description */}
                  <div className="text-sm text-foreground mb-2 line-clamp-2">
                    {item.description}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handlePreview(item.previewUrl)}
                      className="flex items-center gap-1.5 px-2 py-1 text-xs rounded bg-ide-hover hover:bg-ide-active transition-colors text-blue-400 hover:text-blue-300"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => handleRestore(item.id, item.description)}
                      className="flex items-center gap-1.5 px-2 py-1 text-xs rounded bg-ide-hover hover:bg-ide-active transition-colors text-ide-active/90 hover:text-ide-active"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer info */}
      <div className="px-4 py-2 border-t border-ide-border">
        <p className="text-xs text-muted-foreground">
          {previewHistory.length} preview{previewHistory.length !== 1 ? 's' : ''} available
        </p>
      </div>
    </div>
  );
};

export default PreviewHistoryPanel;
