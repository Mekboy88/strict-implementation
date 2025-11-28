import { Loader2, Check, FileCode } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

interface FileBuildingAnimationProps {
  content: string;
  isStreaming?: boolean;
}

export const FileBuildingAnimation = ({ content, isStreaming = true }: FileBuildingAnimationProps) => {
  const [completedFiles, setCompletedFiles] = useState<Set<string>>(new Set());

  // Extract file paths from content using regex
  const detectedFiles = useMemo(() => {
    const fileRegex = /(?:src\/[\w\/\-\.]+\.(?:tsx?|jsx?|css))|(?:```(?:typescript|tsx|ts|jsx|javascript|js)\s*(?:\/\/\s*)?(src\/[\w\/\-\.]+\.(?:tsx?|jsx?)))/g;
    const matches = content.matchAll(fileRegex);
    const paths = new Set<string>();
    
    for (const match of matches) {
      // Get the file path from either capture group
      const path = match[1] || match[0].split('//')[1]?.trim();
      if (path && path.startsWith('src/')) {
        paths.add(path);
      }
    }
    
    return Array.from(paths).map(path => ({ path, type: 'file' }));
  }, [content]);

  useEffect(() => {
    if (!isStreaming) {
      setCompletedFiles(new Set(detectedFiles.map(f => f.path)));
    } else {
      const timer = setInterval(() => {
        setCompletedFiles(prev => {
          const completed = new Set(prev);
          const nextIncomplete = detectedFiles.find(f => !completed.has(f.path));
          if (nextIncomplete) {
            completed.add(nextIncomplete.path);
          }
          return completed;
        });
      }, 800);
      
      return () => clearInterval(timer);
    }
  }, [detectedFiles, isStreaming]);

  // Always show the "Building..." header when there are files
  const showHeader = detectedFiles.length > 0 || isStreaming;
  
  // Show "Analyzing..." if streaming but no files detected yet
  if (isStreaming && detectedFiles.length === 0) {
    return (
      <div className="space-y-3 py-3 animate-fade-in">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
          <span className="text-sm text-blue-200 font-medium">Analyzing your request...</span>
        </div>
      </div>
    );
  }

  if (detectedFiles.length === 0) return null;

  return (
    <div className="space-y-3 py-3">
      {/* Header - Always visible */}
      {showHeader && (
        <div className="flex items-center gap-2 mb-2 animate-fade-in sticky top-0 bg-gradient-to-b from-ide-panel to-transparent pb-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-sm text-blue-200 font-medium">Building your project...</span>
        </div>
      )}
      
      {/* Files list - Progressive reveal */}
      <div className="space-y-2 pl-4 border-l-2 border-blue-900/30">
        {detectedFiles.map((file, index) => {
          const isCompleted = completedFiles.has(file.path);
          const shouldShow = index === 0 || completedFiles.has(detectedFiles[index - 1]?.path);
          
          if (!shouldShow && isStreaming) return null;
          
          return (
            <div
              key={file.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-950/20 border border-blue-900/30 transition-all duration-300 animate-fade-in hover:bg-blue-950/30"
              style={{ 
                animationDelay: `${index * 150}ms`,
                opacity: shouldShow ? 1 : 0,
                transform: shouldShow ? 'translateY(0)' : 'translateY(-10px)'
              }}
            >
              <FileCode className="w-4 h-4 text-blue-400 flex-shrink-0" />
              
              <span className="text-sm text-blue-100 flex-1 truncate font-mono">
                {file.path}
              </span>
              
              {isCompleted ? (
                <Check className="w-4 h-4 text-green-400 flex-shrink-0 animate-scale-in" />
              ) : (
                <Loader2 className="w-4 h-4 text-blue-400 flex-shrink-0 animate-spin" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
