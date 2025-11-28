import { AlertCircle, RefreshCw, MessageSquare, X } from "lucide-react";

interface ErrorRecoveryPanelProps {
  error: string;
  onRetry: () => void;
  onAskAI: () => void;
  onDismiss: () => void;
}

export const ErrorRecoveryPanel = ({ error, onRetry, onAskAI, onDismiss }: ErrorRecoveryPanelProps) => {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-500/20">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-red-400 mb-1">Error Occurred</h3>
            <p className="text-sm text-red-300/70">
              Something went wrong. Choose an option below to continue.
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-red-500/20 rounded transition-colors"
        >
          <X className="h-4 w-4 text-red-400" />
        </button>
      </div>

      {/* Error Message */}
      <div className="bg-slate-900/50 rounded-lg p-3 border border-red-500/20">
        <pre className="text-xs text-red-300/80 overflow-auto max-h-24 whitespace-pre-wrap">
          {error}
        </pre>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm font-medium text-slate-200 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
        
        <button
          onClick={onAskAI}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 rounded-lg text-sm font-medium text-sky-300 transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          Ask AI for Help
        </button>
      </div>
    </div>
  );
};
