import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Archive, Download, Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProjectBulkActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "delete" | "archive" | "export" | null;
  selectedCount: number;
  onConfirm: (reason?: string) => Promise<void>;
}

export function ProjectBulkActionsDialog({
  open,
  onOpenChange,
  action,
  selectedCount,
  onConfirm,
}: ProjectBulkActionsDialogProps) {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(reason);
      onOpenChange(false);
      setReason("");
    } finally {
      setIsLoading(false);
    }
  };

  const getActionConfig = () => {
    switch (action) {
      case "delete":
        return {
          icon: Trash2,
          title: "Delete Projects",
          description: `Are you sure you want to delete ${selectedCount} project(s)?`,
          buttonText: "Delete Projects",
          buttonClass: "bg-red-600 hover:bg-red-700",
          iconClass: "text-red-400",
          showReason: true,
          warning: "This action cannot be undone. All project files and data will be permanently deleted.",
        };
      case "archive":
        return {
          icon: Archive,
          title: "Archive Projects",
          description: `Archive ${selectedCount} project(s)?`,
          buttonText: "Archive Projects",
          buttonClass: "bg-amber-600 hover:bg-amber-700",
          iconClass: "text-amber-400",
          showReason: true,
          warning: "Archived projects will be hidden from the main list but can be restored later.",
        };
      case "export":
        return {
          icon: Download,
          title: "Export Projects",
          description: `Export ${selectedCount} project(s)?`,
          buttonText: "Export Projects",
          buttonClass: "bg-blue-600 hover:bg-blue-700",
          iconClass: "text-blue-400",
          showReason: false,
          warning: null,
        };
      default:
        return null;
    }
  };

  const config = getActionConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-neutral-800 border-neutral-600 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Icon className={`h-5 w-5 ${config.iconClass}`} />
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        {config.warning && (
          <Alert className="bg-red-500/10 border-red-500/30">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200 text-sm">
              {config.warning}
            </AlertDescription>
          </Alert>
        )}

        {config.showReason && (
          <div className="space-y-2">
            <Label className="text-white">Reason (optional)</Label>
            <Textarea
              placeholder="Enter reason for this action..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-neutral-500"
            />
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-neutral-600 bg-neutral-700 text-white hover:bg-neutral-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`text-white ${config.buttonClass}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Icon className="mr-2 h-4 w-4" />
                {config.buttonText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
