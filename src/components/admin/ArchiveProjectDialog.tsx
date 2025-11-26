import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Archive, ArchiveRestore } from "lucide-react";
import { useState } from "react";

interface ArchiveProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    id: string;
    name: string;
    isArchived?: boolean;
  } | null;
  onConfirm: (projectId: string, archive: boolean) => Promise<void>;
}

export function ArchiveProjectDialog({
  open,
  onOpenChange,
  project,
  onConfirm,
}: ArchiveProjectDialogProps) {
  const [loading, setLoading] = useState(false);
  const isArchiving = !project?.isArchived;

  const handleConfirm = async () => {
    if (!project) return;
    
    setLoading(true);
    try {
      await onConfirm(project.id, isArchiving);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] bg-neutral-800 border-neutral-600 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isArchiving ? (
              <Archive className="h-5 w-5 text-amber-400" />
            ) : (
              <ArchiveRestore className="h-5 w-5 text-green-400" />
            )}
            {isArchiving ? "Archive Project" : "Restore Project"}
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            {isArchiving
              ? "Archived projects are hidden from active view but can be restored later."
              : "Restoring this project will make it active again."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className={`p-4 rounded-lg border ${isArchiving ? "bg-amber-950/30 border-amber-500/30" : "bg-green-950/30 border-green-500/30"}`}>
            <p className="text-sm">
              {isArchiving ? (
                <span className="text-amber-200">
                  You are about to archive <span className="font-semibold text-amber-400">"{project.name}"</span>. 
                  The project will be moved to archived status and hidden from the main list.
                </span>
              ) : (
                <span className="text-green-200">
                  You are about to restore <span className="font-semibold text-green-400">"{project.name}"</span>. 
                  The project will become active again and visible in the main list.
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={isArchiving 
              ? "bg-amber-600 hover:bg-amber-700" 
              : "bg-green-600 hover:bg-green-700"
            }
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {isArchiving ? "Archiving..." : "Restoring..."}
              </>
            ) : (
              <>
                {isArchiving ? (
                  <Archive className="h-4 w-4 mr-2" />
                ) : (
                  <ArchiveRestore className="h-4 w-4 mr-2" />
                )}
                {isArchiving ? "Archive Project" : "Restore Project"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
