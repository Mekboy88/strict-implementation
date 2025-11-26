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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: string; user_id: string; email?: string; role: string } | null;
  onSave: (userId: string, newRole: string) => Promise<void>;
}

export const EditRoleDialog = ({ open, onOpenChange, user, onSave }: EditRoleDialogProps) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || "user");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await onSave(user.user_id, selectedRole);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-800 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-white">Edit User Role</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Change the role for {user?.email}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label className="text-white mb-2 block">Role</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-neutral-700 border-neutral-600">
              <SelectItem value="user" className="text-white hover:bg-neutral-600">User</SelectItem>
              <SelectItem value="moderator" className="text-white hover:bg-neutral-600">Moderator</SelectItem>
              <SelectItem value="admin" className="text-white hover:bg-neutral-600">Admin</SelectItem>
              <SelectItem value="owner" className="text-white hover:bg-neutral-600">Owner</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-neutral-600 text-white hover:bg-neutral-700">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
