import { FileCode2, Lightbulb } from "lucide-react";

interface CodeBlock {
  filename: string;
  language: string;
  path: string;
}

interface BuildSummaryCardProps {
  explanation: string;
  files: CodeBlock[];
  onViewFile?: (path: string) => void;
}

export const BuildSummaryCard = ({ explanation, files, onViewFile }: BuildSummaryCardProps) => {
  return (
    <div className="space-y-4">
      {/* Explanation */}
      {explanation && (
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 rounded-xl p-4 border-l-4 border-sky-500">
          <div className="flex items-center gap-2 text-xs text-sky-400 mb-2">
            <Lightbulb className="h-4 w-4" />
            <span className="font-medium">Here's my approach:</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {explanation}
          </p>
        </div>
      )}

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-medium px-1">Files modified:</p>
          <div className="grid gap-2">
            {files.map((file, index) => (
              <button
                key={`${file.path}-${index}`}
                onClick={() => onViewFile?.(file.path)}
                className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50 hover:border-sky-500/50 hover:bg-slate-800/80 transition-all text-left group"
              >
                <FileCode2 className="h-4 w-4 text-sky-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-slate-200 flex-1 truncate group-hover:text-sky-300 transition-colors">
                  {file.filename}
                </span>
                <span className="text-xs text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-700/50">
                  {file.language}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
