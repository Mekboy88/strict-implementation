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

  // Show "Analyzing..." if streaming but no files detected yet
  if (isStreaming && detectedFiles.length === 0) {
    return (
      <div className="space-y-2 py-3">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
          <span className="text-sm text-blue-200">Analyzing your request...</span>
        </div>
      </div>
    );
  }

  if (detectedFiles.length === 0) return null;

  // Calculate progress
  const progress = detectedFiles.length > 0 
    ? (completedFiles.size / detectedFiles.length) * 100 
    : 0;

  return (
    <div className="space-y-3 py-3 min-h-[80px]">
      {/* Fixed header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <span className="text-sm text-blue-200 font-medium">Building your project...</span>
        <span className="text-xs text-blue-400/60 ml-auto">
          {completedFiles.size}/{detectedFiles.length}
        </span>
      </div>
      
      {/* Progress bar */}
      {detectedFiles.length > 0 && (
        <div className="w-full h-1 bg-blue-950/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      {/* File list with staggered animation */}
      <div className="space-y-2">
        {detectedFiles.map((file, index) => {
          const isCompleted = completedFiles.has(file.path);
          
          return (
            <div
              key={file.path}
              className="file-entry flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-950/20 border border-blue-900/30 opacity-0"
              style={{ 
                animation: 'fadeInFile 0.4s ease-out forwards',
                animationDelay: `${index * 150}ms`
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
