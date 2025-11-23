import { FileCode, FileText, Folder, FileJson, Image as ImageIcon } from "lucide-react";

interface FileMentionAutocompleteProps {
  onSelect: (fileName: string) => void;
  onClose: () => void;
}

const FileMentionAutocomplete = ({ onSelect, onClose }: FileMentionAutocompleteProps) => {
  // Mock file list - in real app this would come from file tree state
  const files = [
    { name: "index.tsx", type: "tsx", icon: FileCode },
    { name: "App.tsx", type: "tsx", icon: FileCode },
    { name: "components/AssistantPanel.tsx", type: "tsx", icon: FileCode },
    { name: "components/EditorPanel.tsx", type: "tsx", icon: FileCode },
    { name: "components/FileTree.tsx", type: "tsx", icon: FileCode },
    { name: "index.css", type: "css", icon: FileText },
    { name: "package.json", type: "json", icon: FileJson },
    { name: "README.md", type: "md", icon: FileText },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "tsx":
      case "ts":
      case "jsx":
      case "js":
        return FileCode;
      case "json":
        return FileJson;
      case "png":
      case "jpg":
      case "svg":
        return ImageIcon;
      case "folder":
        return Folder;
      default:
        return FileText;
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      <div className="absolute bottom-full left-4 mb-2 w-80 bg-ide-panel border border-ide-border rounded-lg shadow-xl z-50 animate-scale-in overflow-hidden">
        <div className="px-3 py-2 border-b border-ide-border">
          <p className="text-xs text-muted-foreground">Mention File</p>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {files.map((file) => {
            const Icon = getFileIcon(file.type);
            return (
              <button
                key={file.name}
                onClick={() => onSelect(file.name)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-ide-hover transition-colors text-left"
              >
                <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm text-foreground font-mono flex-1 truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground uppercase">{file.type}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default FileMentionAutocomplete;
