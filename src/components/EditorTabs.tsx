import React from "react";
import { X, Copy, Eye, XCircle, ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import DiffView from "./DiffView";
import { useEditorStore } from "@/stores/useEditorStore";

interface EditorTabsProps {
  viewMode?: 'code' | 'preview';
}

const EditorTabs = ({ viewMode = 'code' }: EditorTabsProps) => {
  const { activeFile, setActiveFile } = useEditorStore();
  const [tabs, setTabs] = useState([
    { name: 'banner.tsx', path: 'src/components/banner.tsx', dirty: false },
    { name: 'product.js', path: 'src/components/product.js', dirty: false },
    { name: 'package.js', path: 'package.json', dirty: false },
    { name: 'index.html', path: 'index.html', dirty: false },
  ]);
  
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tabIndex: number } | null>(null);
  const [diffMode, setDiffMode] = useState(false);

  const handleCloseTab = (index: number) => {
    setTabs(tabs.filter((_, i) => i !== index));
  };

  const handleCloseOthers = (index: number) => {
    setTabs(tabs.filter((_, i) => i === index));
  };

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, tabIndex: index });
  };

  return (
    <>
      {diffMode ? (
        <DiffView onClose={() => setDiffMode(false)} />
      ) : (
        <>
          {/* Context Menu */}
          {contextMenu && (
            <>
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setContextMenu(null)}
              />
              <div 
                className="fixed bg-ide-panel border border-ide-border rounded-lg shadow-2xl z-40 py-1 min-w-[200px]"
                style={{ left: contextMenu.x, top: contextMenu.y }}
              >
                <button 
                  onClick={() => {
                    handleCloseTab(contextMenu.tabIndex);
                    setContextMenu(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-ide-hover hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                  Close Tab
                </button>
                <button 
                  onClick={() => {
                    handleCloseOthers(contextMenu.tabIndex);
                    setContextMenu(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-ide-hover hover:text-foreground transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Close Others
                </button>
                <div className="my-1 h-px bg-ide-border" />
                <button 
                  onClick={() => handleCopyPath(tabs[contextMenu.tabIndex].path)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-ide-hover hover:text-foreground transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy Path
                </button>
                <button 
                  onClick={() => setContextMenu(null)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-ide-hover hover:text-foreground transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Reveal in Explorer
                </button>
              </div>
            </>
          )}

          <div className="flex items-center gap-2 px-3 py-2 bg-ide-editor">
            {/* File Tabs */}
            <div className="flex items-center overflow-x-auto flex-1 scrollbar-hide">
              {tabs.map((tab, index) => (
                <React.Fragment key={index}>
                  <button
                    onContextMenu={(e) => handleContextMenu(e, index)}
                    onClick={() => setActiveFile(tab.path, `// ${tab.name} content`)}
                    className={`
                      group px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap flex items-center gap-2
                      transition-all
                      ${activeFile === tab.path 
                        ? 'bg-white/5 text-white' 
                        : 'text-gray-400 hover:text-gray-200'
                      }
                    `}
                  >
                    <span>{tab.name}</span>
                    {tab.dirty && (
                      <span className="text-ide-active text-sm">●</span>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseTab(index);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-full p-0.5 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </button>
                  {index < tabs.length - 1 && (
                    <span className="text-gray-600 mx-1">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Diff Mode Button - Only show in code view */}
            {viewMode === 'code' && (
              <>
                <button 
                  onClick={() => setDiffMode(!diffMode)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-gray-400 hover:text-gray-200 border border-white/10 bg-ide-editor/50 backdrop-blur-sm hover:bg-ide-hover/40 hover:border-white/15 flex items-center gap-2 transition-all"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  Diff Mode
                </button>
                
                <button 
                  onClick={() => navigator.clipboard.writeText('Copied!')}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-200 border border-white/10 bg-ide-editor/50 backdrop-blur-sm hover:bg-ide-hover/40 hover:border-white/15 transition-all"
                  title="Copy"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1, 0, 0, 1, 0, 0)" className="w-4 h-4">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z" stroke="currentColor" strokeWidth="1.5"></path>
                      <path d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" stroke="currentColor" strokeWidth="1.5"></path>
                    </g>
                  </svg>
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default EditorTabs;
