import { FileCode, Loader2, Check } from "lucide-react";

interface FileShimmerProps {
  filename: string;
  isComplete?: boolean;
}

export const FileShimmer = ({ filename, isComplete = false }: FileShimmerProps) => {
  const getFileIcon = (name: string) => {
    return <FileCode className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-950/30 to-blue-900/20 border border-blue-900/30 animate-fade-in mt-3 mb-1 transition-all duration-300">
      {getFileIcon(filename)}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-100 font-mono truncate">{filename}</span>
          {!isComplete && (
            <div className="h-2 flex-1 bg-blue-950/40 rounded-full overflow-hidden max-w-[100px]">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full animate-pulse"
                style={{ width: '60%' }}
              />
            </div>
          )}
        </div>
      </div>
      
      {isComplete ? (
        <Check className="w-4 h-4 text-green-400 flex-shrink-0 animate-scale-in" />
      ) : (
        <Loader2 className="w-4 h-4 text-blue-400 flex-shrink-0 animate-spin" />
      )}
    </div>
  );
};
