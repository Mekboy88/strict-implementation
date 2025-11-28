import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewErrorOverlayProps {
  error: {
    message: string;
    stack?: string;
    line?: number;
    column?: number;
  };
  onClose: () => void;
  onFixIt: () => void;
}

export function PreviewErrorOverlay({ error, onClose, onFixIt }: PreviewErrorOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-error-overlay-fade-in">
      <div className="bg-background border-2 border-destructive rounded-lg shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
        {/* Red Header */}
        <div className="bg-destructive text-destructive-foreground px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 animate-error-pulse" />
            <h2 className="text-lg font-bold">ERROR DETECTED</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={onFixIt}
              variant="secondary"
              size="sm"
              className="bg-white text-destructive hover:bg-white/90 font-semibold"
            >
              Fix It
            </Button>
            <button
              onClick={onClose}
              className="hover:bg-destructive-foreground/20 rounded p-1 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Content */}
        <div className="p-6 overflow-auto max-h-[calc(80vh-80px)]">
          <div className="space-y-4">
            {/* Error Message */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Error Message:</h3>
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                <p className="text-destructive font-mono text-sm break-words">
                  {error.message}
                </p>
              </div>
            </div>

            {/* Location */}
            {(error.line || error.column) && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Location:</h3>
                <div className="bg-muted rounded-md p-3">
                  <p className="text-sm font-mono">
                    Line {error.line || '?'}, Column {error.column || '?'}
                  </p>
                </div>
              </div>
            )}

            {/* Stack Trace */}
            {error.stack && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Stack Trace:</h3>
                <div className="bg-muted rounded-md p-4 overflow-x-auto">
                  <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-words">
                    {error.stack}
                  </pre>
                </div>
              </div>
            )}

            {/* Help Text */}
            <div className="bg-primary/5 border border-primary/20 rounded-md p-4">
              <p className="text-sm text-muted-foreground">
                💡 Click <span className="font-semibold text-foreground">"Fix It"</span> to let the AI automatically diagnose and fix this error.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
