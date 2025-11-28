import { FileCode2, Loader2, CheckCircle2, Clock } from "lucide-react";

interface FileProgress {
  name: string;
  status: 'pending' | 'processing' | 'done';
}

interface FileCreationAnimationProps {
  files: FileProgress[];
}

export const FileCreationAnimation = ({ files }: FileCreationAnimationProps) => {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2 animate-fade-in">
      <p className="text-xs text-slate-400 font-medium px-1">Files being created:</p>
      {files.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50 hover:border-sky-500/30 transition-all animate-slide-in-right"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex-shrink-0">
            {file.status === 'done' && (
              <CheckCircle2 className="h-4 w-4 text-green-400 animate-scale-in" />
            )}
            {file.status === 'processing' && (
              <Loader2 className="h-4 w-4 text-sky-400 animate-spin" />
            )}
            {file.status === 'pending' && (
              <Clock className="h-4 w-4 text-slate-500" />
            )}
          </div>
          
          <FileCode2 className="h-4 w-4 text-sky-400 flex-shrink-0" />
          
          <span className={`text-sm flex-1 truncate transition-colors ${
            file.status === 'done' ? 'text-green-300' : 'text-slate-200'
          }`}>
            {file.name}
          </span>
          
          <span className={`text-xs uppercase px-2 py-0.5 rounded ${
            file.status === 'done' 
              ? 'bg-green-500/20 text-green-400' 
              : file.status === 'processing'
              ? 'bg-sky-500/20 text-sky-400'
              : 'bg-slate-700/50 text-slate-500'
          }`}>
            {file.status}
          </span>
        </div>
      ))}
    </div>
  );
};
