import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Bug, 
  Network, 
  FileCode, 
  Activity, 
  Download, 
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  XCircle
} from "lucide-react";
import { useDebugger, useNetworkMonitor, useFileChangeMonitor } from "@/hooks/useDebugger";
import { cn } from "@/lib/utils";

/**
 * Comprehensive debugging panel showing all monitoring data
 */
export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    consoleErrors,
    networkRequests,
    fileChanges,
    hotReloadLogs,
    healthStatus,
    runHealthCheck,
    exportDebugData,
    clearLogs
  } = useDebugger();

  const { failedRequests } = useNetworkMonitor();
  const { recentChanges } = useFileChangeMonitor();

  const handleExport = () => {
    const data = exportDebugData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 z-50 h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
        title="Open Debug Panel"
      >
        <Bug className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-96 bg-background border-t shadow-lg z-50">
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <Bug className="h-5 w-5" />
          <h3 className="font-semibold">Debug Panel</h3>
          
          {healthStatus && (
            <div className="flex items-center gap-2 text-sm">
              {healthStatus.documentReady === 'complete' ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
              <span className="text-muted-foreground">
                {healthStatus.scriptsCount} scripts, {healthStatus.stylesheetsCount} styles
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {consoleErrors.length} errors
          </Badge>
          <Badge variant="outline">
            {failedRequests.length} failed requests
          </Badge>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={runHealthCheck}
            title="Refresh health check"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleExport}
            title="Export debug data"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={clearLogs}
            title="Clear logs"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="errors" className="h-[calc(100%-4rem)]">
        <TabsList className="w-full justify-start rounded-none border-b bg-muted/30 p-0">
          <TabsTrigger value="errors" className="rounded-none">
            <AlertCircle className="h-4 w-4 mr-2" />
            Errors ({consoleErrors.length})
          </TabsTrigger>
          <TabsTrigger value="network" className="rounded-none">
            <Network className="h-4 w-4 mr-2" />
            Network ({networkRequests.length})
          </TabsTrigger>
          <TabsTrigger value="files" className="rounded-none">
            <FileCode className="h-4 w-4 mr-2" />
            Files ({recentChanges.length})
          </TabsTrigger>
          <TabsTrigger value="reload" className="rounded-none">
            <Activity className="h-4 w-4 mr-2" />
            Hot Reload ({hotReloadLogs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="errors" className="h-[calc(100%-2.5rem)] m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {consoleErrors.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No errors logged
                </div>
              ) : (
                consoleErrors.map((error, index) => (
                  <div
                    key={index}
                    className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-destructive">
                          {error.message}
                        </p>
                        {error.filename && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {error.filename}:{error.line}:{error.column}
                          </p>
                        )}
                        {error.stack && (
                          <pre className="text-xs mt-2 p-2 bg-background rounded overflow-x-auto">
                            {error.stack}
                          </pre>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(error.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="network" className="h-[calc(100%-2.5rem)] m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {networkRequests.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No network requests logged
                </div>
              ) : (
                networkRequests.map((request, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-lg border",
                      request.status === 'failed' 
                        ? "bg-destructive/10 border-destructive/20" 
                        : request.status === 'completed'
                        ? "bg-green-500/10 border-green-500/20"
                        : "bg-muted/50 border-border"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {request.status === 'failed' && (
                        <XCircle className="h-4 w-4 text-destructive mt-0.5" />
                      )}
                      {request.status === 'completed' && (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {request.type}
                          </Badge>
                          <span className="text-xs font-mono text-muted-foreground">
                            {request.status}
                          </span>
                          {request.duration && (
                            <span className="text-xs text-muted-foreground">
                              {request.duration.toFixed(0)}ms
                            </span>
                          )}
                        </div>
                        <p className="text-sm mt-1 font-mono truncate">
                          {request.url}
                        </p>
                        {request.error && (
                          <p className="text-xs text-destructive mt-1">
                            {request.error}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(request.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="files" className="h-[calc(100%-2.5rem)] m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {recentChanges.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No recent file changes
                </div>
              ) : (
                recentChanges.map((change, index) => (
                  <div
                    key={index}
                    className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="outline" className="text-xs">
                          {change.type}
                        </Badge>
                        <span className="ml-2 text-sm font-mono">
                          {change.element}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(change.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="reload" className="h-[calc(100%-2.5rem)] m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {hotReloadLogs.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No hot reload events logged
                </div>
              ) : (
                hotReloadLogs.map((log, index) => (
                  <div
                    key={index}
                    className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg"
                  >
                    <div className="flex items-start gap-2">
                      <Activity className="h-4 w-4 text-purple-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm">{log.message}</p>
                        {log.args.length > 0 && (
                          <pre className="text-xs mt-2 p-2 bg-background rounded overflow-x-auto">
                            {JSON.stringify(log.args, null, 2)}
                          </pre>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
