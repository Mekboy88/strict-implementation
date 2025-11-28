import { CheckCircle2, FileCode2, ExternalLink, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface BuildCompleteAnimationProps {
  files: string[];
  onViewPreview?: () => void;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

export const BuildCompleteAnimation = ({ 
  files, 
  onViewPreview,
  suggestions = [],
  onSuggestionClick 
}: BuildCompleteAnimationProps) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Success Header */}
      <div className="relative bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 text-center overflow-hidden">
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <Sparkles
                key={i}
                className="absolute text-yellow-400 animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        )}
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-3 animate-scale-in">
            <CheckCircle2 className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-green-400 mb-2">Build Complete!</h3>
          <p className="text-sm text-green-300/80">Your app is ready to preview</p>
        </div>
      </div>

      {/* Files Created */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-medium px-1">Files created:</p>
          <div className="grid grid-cols-1 gap-2">
            {files.map((file, index) => (
              <div
                key={file}
                className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50 animate-slide-in-right"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0" />
                <FileCode2 className="h-4 w-4 text-sky-400 flex-shrink-0" />
                <span className="text-sm text-slate-200 flex-1 truncate">{file}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Preview Button */}
      {onViewPreview && (
        <button
          onClick={onViewPreview}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-600 hover:to-violet-600 text-white rounded-lg px-4 py-3 font-medium transition-all hover:scale-105"
        >
          <ExternalLink className="h-4 w-4" />
          View in Preview
        </button>
      )}

      {/* Smart Suggestions */}
      {suggestions.length > 0 && onSuggestionClick && (
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-medium px-1">What's next?</p>
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-sky-500/50 hover:bg-slate-800/80 text-sm text-slate-300 hover:text-sky-300 transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
