import { Loader2, Check, FileCode } from "lucide-react";
import { useEffect, useState } from "react";

interface FileBuildingAnimationProps {
  files: Array<{ path: string; type: string }>;
  isStreaming?: boolean;
}

export const FileBuildingAnimation = ({ files, isStreaming = true }: FileBuildingAnimationProps) => {
  const [completedFiles, setCompletedFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isStreaming) {
      // Mark all files as completed when streaming stops
      setCompletedFiles(new Set(files.map(f => f.path)));
    } else {
      // Gradually mark files as completed while streaming
      const timer = setInterval(() => {
        setCompletedFiles(prev => {
          const completed = new Set(prev);
          const nextIncomplete = files.find(f => !completed.has(f.path));
          if (nextIncomplete) {
            completed.add(nextIncomplete.path);
          }
          return completed;
        });
      }, 800);
      
      return () => clearInterval(timer);
    }
  }, [files, isStreaming]);

  if (files.length === 0) return null;

  return (
    <div className="space-y-2 py-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <span className="text-sm text-blue-200">Building your project...</span>
      </div>
      
      <div className="space-y-2">
        {files.map((file, index) => {
          const isCompleted = completedFiles.has(file.path);
          
          return (
            <div
              key={file.path}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-950/20 border border-blue-900/30 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
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
