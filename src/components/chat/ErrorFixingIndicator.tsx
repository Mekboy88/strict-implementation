import { Wrench, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";

interface ErrorFixingIndicatorProps {
  error: string;
  elapsedTime: number;
}

export const ErrorFixingIndicator = ({ error, elapsedTime }: ErrorFixingIndicatorProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Main Indicator */}
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-amber-500/20 animate-pulse">
            <Wrench className="h-5 w-5 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-400 flex items-center gap-2">
              Fixing Error
              <Loader2 className="h-4 w-4 animate-spin" />
            </h3>
            <p className="text-xs text-amber-300/70">
              Analyzing and applying fixes... ({elapsedTime}s)
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse" style={{ width: '70%' }} />
        </div>

        {/* Estimate */}
        <p className="text-xs text-slate-400 mt-3 text-center">
          This usually takes 5-10 seconds
        </p>
      </div>

      {/* Error Details (Collapsible) */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-800/80 transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-sm font-medium text-slate-300">Error Details</span>
          </div>
          <span className="text-xs text-slate-500">{showDetails ? 'Hide' : 'Show'}</span>
        </button>

        {showDetails && (
          <div className="px-4 pb-4 border-t border-slate-700/50">
            <pre className="text-xs text-red-300/80 bg-slate-900/50 rounded p-3 overflow-auto max-h-32 mt-2">
              {error}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
