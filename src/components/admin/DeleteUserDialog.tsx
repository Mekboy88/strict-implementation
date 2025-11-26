import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: string; user_id: string; email?: string } | null;
  onDelete: (userId: string, reason: string) => Promise<void>;
}

export const DeleteUserDialog = ({ open, onOpenChange, user, onDelete }: DeleteUserDialogProps) => {
  const [confirmText, setConfirmText] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user || confirmText !== "DELETE" || !reason.trim()) return;
    setLoading(true);
    try {
      await onDelete(user.user_id, reason);
      onOpenChange(false);
      setConfirmText("");
      setReason("");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setConfirmText("");
      setReason("");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="bg-neutral-800 border-neutral-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Delete User Permanently
          </AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-400">
            This action cannot be undone. This will permanently delete{" "}
            <span className="text-white font-medium">{user?.email}</span> and all their data.
            The user will be notified via email with the reason provided.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label className="text-white mb-2 block">
              Reason for deletion <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this user is being deleted..."
              className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-500 min-h-[80px]"
            />
          </div>
          <div>
            <Label className="text-white mb-2 block">
              Type <span className="text-red-500 font-mono">DELETE</span> to confirm
            </Label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="bg-neutral-700 border-neutral-600 text-white"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-neutral-600 text-white hover:bg-neutral-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={confirmText !== "DELETE" || !reason.trim() || loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
