import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    id: string;
    name: string;
  } | null;
  onConfirm: (projectId: string, projectName: string) => Promise<void>;
}

export function DeleteProjectDialog({
  open,
  onOpenChange,
  project,
  onConfirm,
}: DeleteProjectDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Reset confirmation text when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setConfirmText("");
    }
  }, [open]);

  const isConfirmValid = project && confirmText === project.name;

  const handleDelete = async () => {
    if (!project || !isConfirmValid) return;
    
    setDeleting(true);
    try {
      await onConfirm(project.id, project.name);
      onOpenChange(false);
    } finally {
      setDeleting(false);
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-neutral-800 border-neutral-600 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Delete Project
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            This action cannot be undone. This will permanently delete the project and all associated files.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning Box */}
          <div className="p-4 rounded-lg bg-red-950/30 border border-red-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
              <div className="text-sm text-red-200">
                <p className="font-medium mb-1">You are about to delete:</p>
                <p className="font-mono text-red-400 text-base">{project.name}</p>
                <ul className="mt-2 text-red-300 space-y-1 list-disc list-inside">
                  <li>All project files will be deleted</li>
                  <li>All deployment history will be removed</li>
                  <li>This cannot be recovered</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <Label htmlFor="confirm-name" className="text-neutral-300">
              Type <span className="font-mono text-red-400 font-semibold">{project.name}</span> to confirm deletion:
            </Label>
            <Input
              id="confirm-name"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Enter project name"
              className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-500 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoComplete="off"
              autoFocus
            />
            {confirmText && !isConfirmValid && (
              <p className="text-xs text-red-400">
                Project name does not match. Please type exactly: {project.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
            className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={!isConfirmValid || deleting}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:opacity-50"
          >
            {deleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Project
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
