import { ChevronDown, Check, Loader2, Circle } from "lucide-react";

interface EditingFilesDropdownProps {
  files: string[];
  currentFile: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const EditingFilesDropdown = ({ files, currentFile, isOpen, onToggle }: EditingFilesDropdownProps) => {
  return (
    <div className="relative ml-auto">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-2 py-1 rounded bg-blue-900/30 hover:bg-blue-900/50 transition-colors text-blue-200 text-xs"
      >
        <span>{files.length} files</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-slate-900 border border-blue-900/30 rounded-lg shadow-xl z-50 min-w-[280px] animate-fade-in">
          <div className="py-1">
            {files.map((file, index) => {
              const isCurrent = file === currentFile;
              const isCompleted = files.indexOf(file) < files.indexOf(currentFile);
              
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-950/30 transition-colors"
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 animate-spin" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                  )}
                  
                  <span className={`font-mono truncate ${
                    isCurrent ? 'text-blue-200 font-medium' : 
                    isCompleted ? 'text-green-200/70' : 
                    'text-slate-400'
                  }`}>
                    {file}
                  </span>
                  
                  {isCurrent && (
                    <span className="ml-auto text-xs text-blue-400/70">editing</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
