import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle } from "lucide-react";

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: string; user_id: string; email?: string; role: string } | null;
  onSave: (userId: string, newRole: string) => Promise<void>;
}

const ASSIGNABLE_ROLES = [
  { 
    value: "user", 
    label: "User", 
    description: "Basic access with limited permissions",
    color: "bg-neutral-500/30 text-neutral-300"
  },
  { 
    value: "moderator", 
    label: "Moderator", 
    description: "Can moderate content and manage users",
    color: "bg-yellow-500/30 text-yellow-400"
  },
  { 
    value: "admin", 
    label: "Admin", 
    description: "Full administrative access",
    color: "bg-blue-500/30 text-blue-400"
  },
];

export const EditRoleDialog = ({ open, onOpenChange, user, onSave }: EditRoleDialogProps) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || "user");
  const [loading, setLoading] = useState(false);

  // Reset selected role when user changes
  useEffect(() => {
    if (user) {
      // If user is owner, default to admin since owner can't be assigned
      setSelectedRole(user.role === "owner" ? "admin" : user.role);
    }
  }, [user]);

  const isOwner = user?.role === "owner";

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

  const getSelectedRoleInfo = () => {
    return ASSIGNABLE_ROLES.find(r => r.value === selectedRole);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-800 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Edit User Role
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Change the role for {user?.email}
          </DialogDescription>
        </DialogHeader>

        {/* Warning if user is Primary Super Admin */}
        {isOwner && (
          <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-medium text-sm">Primary Super Admin</p>
              <p className="text-yellow-400/70 text-xs mt-1">
                This user is the Primary Super Admin. This role cannot be changed or reassigned through this interface.
              </p>
            </div>
          </div>
        )}

        {/* Current Role Display */}
        <div className="py-2">
          <Label className="text-neutral-400 text-xs mb-1 block">Current Role</Label>
          <Badge className={`${
            user?.role === "owner" ? "bg-purple-500/30 text-purple-400 border-purple-500/50" :
            user?.role === "admin" ? "bg-blue-500/30 text-blue-400 border-blue-500/50" :
            user?.role === "moderator" ? "bg-yellow-500/30 text-yellow-400 border-yellow-500/50" :
            "bg-neutral-500/30 text-neutral-300 border-neutral-500/50"
          } border`}>
            {user?.role === "owner" ? "Primary Super Admin" : 
             user?.role === "admin" ? "Admin" :
             user?.role === "moderator" ? "Moderator" : "User"}
          </Badge>
        </div>

        {!isOwner && (
          <div className="py-2">
            <Label className="text-white mb-2 block">New Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-700 border-neutral-600 z-50">
                {ASSIGNABLE_ROLES.map((role) => (
                  <SelectItem 
                    key={role.value} 
                    value={role.value} 
                    className="text-white hover:bg-neutral-600 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span>{role.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Role Description */}
            {getSelectedRoleInfo() && (
              <p className="text-neutral-400 text-xs mt-2">
                {getSelectedRoleInfo()?.description}
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="border-neutral-600 text-white hover:bg-neutral-700"
          >
            Cancel
          </Button>
          {!isOwner && (
            <Button 
              onClick={handleSave} 
              disabled={loading || selectedRole === user?.role} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
