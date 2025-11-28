import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Terminal, X, Trash2 } from "lucide-react";
import { useEditorSystem } from "@/hooks/useEditorSystem";
import { cn } from "@/lib/utils";

/**
 * Console panel to display preview console logs
 */
export function ConsolePanel() {
  const { consoleLogs, clearConsoleLogs } = useEditorSystem();

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-destructive';
      case 'warn':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="h-full flex flex-col bg-background border-t">
      <div className="flex items-center justify-between p-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          <span className="text-sm font-medium">Console</span>
          {consoleLogs.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({consoleLogs.length})
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={clearConsoleLogs}
          title="Clear console"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1 font-mono text-xs">
          {consoleLogs.length === 0 ? (
            <div className="text-muted-foreground p-4 text-center">
              No console output
            </div>
          ) : (
            consoleLogs.map((log, index) => (
              <div
                key={index}
                className={cn(
                  "py-1 px-2 rounded hover:bg-muted/50",
                  getLogColor(log.level)
                )}
              >
                <span className="text-muted-foreground mr-2">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>
                <span className="font-semibold mr-2">[{log.level.toUpperCase()}]</span>
                {log.args.map((arg: any, i: number) => (
                  <span key={i}>
                    {typeof arg === 'object' 
                      ? JSON.stringify(arg, null, 2)
                      : String(arg)
                    }
                    {i < log.args.length - 1 && ' '}
                  </span>
                ))}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
