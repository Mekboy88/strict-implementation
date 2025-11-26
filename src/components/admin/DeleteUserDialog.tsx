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
import { Trash2 } from "lucide-react";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: string; user_id: string; email?: string } | null;
  onDelete: (userId: string) => Promise<void>;
}

export const DeleteUserDialog = ({ open, onOpenChange, user, onDelete }: DeleteUserDialogProps) => {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user || confirmText !== "DELETE") return;
    setLoading(true);
    try {
      await onDelete(user.user_id);
      onOpenChange(false);
      setConfirmText("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-neutral-800 border-neutral-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Delete User Permanently
          </AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-400">
            This action cannot be undone. This will permanently delete{" "}
            <span className="text-white font-medium">{user?.email}</span> and all their data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
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
        <AlertDialogFooter>
          <AlertDialogCancel className="border-neutral-600 text-white hover:bg-neutral-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={confirmText !== "DELETE" || loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
