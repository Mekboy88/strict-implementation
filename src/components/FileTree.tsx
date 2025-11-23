import { 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  Search as SearchIcon,
  FileCode,
  FileJson,
  FileImage,
  FileType,
  FolderOpen,
  Smartphone,
  Monitor
} from "lucide-react";
import { useState, useEffect } from "react";
import { useFileSystemStore } from "@/stores/useFileSystemStore";
import { useEditorStore } from "@/stores/useEditorStore";

interface FileTreeProps {
  activePlatform: "web" | "mobile";
  onPlatformChange: (platform: "web" | "mobile") => void;
}

const FileTree = ({ activePlatform, onPlatformChange }: FileTreeProps) => {
  const { 
    files, 
    expandedFolders,
    createFile, 
    deleteFile, 
    toggleFolder,
    isExpanded,
    getFilesByPath,
    initializeProject,
    getAllFiles
  } = useFileSystemStore();
  
  const { setActiveFile } = useEditorStore();
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Initialize project on mount
  useEffect(() => {
    initializeProject();
  }, []);

  const fileIcons = {
    tsx: <FileCode className="w-4 h-4 text-blue-400" />,
    ts: <FileCode className="w-4 h-4 text-blue-500" />,
    jsx: <FileCode className="w-4 h-4 text-cyan-400" />,
    js: <FileCode className="w-4 h-4 text-yellow-400" />,
    css: <FileType className="w-4 h-4 text-pink-400" />,
    json: <FileJson className="w-4 h-4 text-ide-active/70" />,
    png: <FileImage className="w-4 h-4 text-purple-400" />,
    jpg: <FileImage className="w-4 h-4 text-purple-400" />,
    svg: <FileImage className="w-4 h-4 text-orange-400" />,
    md: <FileType className="w-4 h-4 text-gray-400" />,
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    return fileIcons[ext as keyof typeof fileIcons] || <FileCode className="w-4 h-4 text-muted-foreground" />;
  };
  
  const handleFileClick = (path: string, content: string) => {
    setActiveFile(path, content);
  };

  const allFiles = getAllFiles();
  
  const renderFileNode = (node: ReturnType<typeof getFilesByPath>[0], depth: number = 0) => {
    if (node.type === 'folder') {
      const isOpen = isExpanded(node.path);
      const children = getFilesByPath(node.path);
      
      return (
        <div key={node.path} style={{ marginLeft: `${depth * 12}px` }}>
          <div 
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-ide-hover rounded cursor-pointer group"
            onClick={() => toggleFolder(node.path)}
          >
            {isOpen ? (
              <>
                <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform" />
                <FolderOpen className="w-4 h-4 text-primary" />
              </>
            ) : (
              <>
                <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform" />
                <Folder className="w-4 h-4 text-primary" />
              </>
            )}
            <span className="text-sm text-foreground">{node.name}</span>
          </div>
          {isOpen && (
            <div>
              {children.map(child => renderFileNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          key={node.path}
          style={{ marginLeft: `${depth * 12}px` }}
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-ide-hover rounded cursor-pointer group"
          onClick={() => handleFileClick(node.path, node.content || '')}
        >
          {getFileIcon(node.name)}
          <span className="text-sm text-foreground">{node.name}</span>
        </div>
      );
    }
  };

  return (
    <div className="h-full bg-ide-panel flex flex-col text-foreground">
      {/* Explorer Header */}
      <div className="px-3 py-2.5 border-b border-ide-border flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
          Explorer
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md bg-ide-hover/40 border border-white/5 px-1.5 py-0.5">
            <button
              onClick={() => onPlatformChange("web")}
              className={`p-1 rounded-sm transition-colors ${
                activePlatform === "web"
                  ? "bg-transparent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-ide-hover"
              }`}
              title="Desktop files"
            >
              <span className="sr-only">Desktop files</span>
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onPlatformChange("mobile")}
              className={`p-1 rounded-sm transition-colors ${
                activePlatform === "mobile"
                  ? "bg-transparent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-ide-hover"
              }`}
              title="Mobile files"
            >
              <span className="sr-only">Mobile files</span>
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <SearchIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Search Input - Collapsible */}
      {searchOpen && (
        <div className="px-3 py-2 border-b border-ide-border">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full px-3 py-1.5 bg-ide-hover border border-ide-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ide-active"
            autoFocus
          />
        </div>
      )}
      
      {/* File Tree Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {activePlatform === "web" ? (
          // Desktop Files - Real file system (excluding mobile folder)
          <div className="space-y-0.5">
            {getFilesByPath('/').filter(node => node.path !== 'mobile').map(node => renderFileNode(node, 0))}
          </div>
        ) : (
          // Mobile Files - Files from mobile/ folder
          <div className="space-y-0.5">
            {(() => {
              const mobileFolder = allFiles.find(f => f.path === 'mobile' && f.type === 'folder');
              if (mobileFolder) {
                const mobileFiles = getFilesByPath('mobile');
                return mobileFiles.length > 0 
                  ? mobileFiles.map(node => renderFileNode(node, 0))
                  : (
                      <div className="flex items-center justify-center py-8 text-center">
                        <div className="space-y-2">
                          <Smartphone className="w-12 h-12 text-muted-foreground mx-auto" />
                          <p className="text-sm text-muted-foreground">No mobile files yet</p>
                        </div>
                      </div>
                    );
              }
              return (
                <div className="flex items-center justify-center py-8 text-center">
                  <div className="space-y-2">
                    <Smartphone className="w-12 h-12 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">Mobile folder not found</p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileTree;
