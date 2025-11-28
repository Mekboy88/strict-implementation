import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AlertCircle, X, RefreshCw } from "lucide-react";
import { useEditorSystem } from "@/hooks/useEditorSystem";

/**
 * Panel to display errors and warnings from the editor system
 */
export function ErrorPanel() {
  const { errors, clearErrors } = useEditorSystem();

  if (errors.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[400px] bg-background border rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <h3 className="font-semibold text-sm">
            {errors.length} {errors.length === 1 ? 'Error' : 'Errors'}
          </h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={clearErrors}
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={clearErrors}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <ScrollArea className="max-h-[350px]">
        <div className="p-3 space-y-2">
          {errors.map((errorData, index) => (
            <Alert key={index} variant="destructive" className="text-sm">
              <AlertCircle className="h-3 w-3" />
              <AlertTitle className="text-xs font-medium">
                {errorData.category.toUpperCase()}
              </AlertTitle>
              <AlertDescription className="text-xs mt-1">
                {errorData.error.message}
                {errorData.error.line && (
                  <span className="block mt-1 text-muted-foreground">
                    Line {errorData.error.line}
                    {errorData.error.column && `:${errorData.error.column}`}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
