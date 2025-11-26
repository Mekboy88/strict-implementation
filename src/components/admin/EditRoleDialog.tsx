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
import { Shield, Crown, UserCog, AlertTriangle, ShieldAlert } from "lucide-react";

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: string; user_id: string; email?: string; role: string } | null;
  onSave: (userId: string, newRole: string) => Promise<void>;
  currentUserRole?: string;
}

// Only these roles can be assigned - owner is NEVER assignable
const ASSIGNABLE_ROLES = [
  { 
    value: "admin", 
    label: "Admin", 
    description: "Full administrative access to manage platform",
    icon: Shield
  },
  { 
    value: "moderator", 
    label: "Moderator", 
    description: "Can moderate content and manage users",
    icon: UserCog
  },
];

export const EditRoleDialog = ({ open, onOpenChange, user, onSave, currentUserRole = "user" }: EditRoleDialogProps) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || "moderator");
  const [loading, setLoading] = useState(false);

  const isCurrentUserOwner = currentUserRole === "owner";
  const isTargetUserOwner = user?.role === "owner";

  useEffect(() => {
    if (user) {
      // Default to moderator if current role is owner or user (non-assignable)
      const validRole = ASSIGNABLE_ROLES.find(r => r.value === user.role);
      setSelectedRole(validRole ? user.role : "moderator");
    }
  }, [user]);

  const handleSave = async () => {
    // Protection: cannot change owner role
    if (!user || !isCurrentUserOwner || isTargetUserOwner) return;
    if (selectedRole === "owner") return;
    
    setLoading(true);
    try {
      await onSave(user.user_id, selectedRole);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const selectedRoleInfo = ASSIGNABLE_ROLES.find(r => r.value === selectedRole);

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

        {/* CRITICAL: Owner Protection Warning */}
        {isTargetUserOwner && (
          <div className="flex items-start gap-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-purple-400 mt-0.5" />
            <div>
              <p className="text-purple-400 font-medium text-sm flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Platform Owner Protected
              </p>
              <p className="text-purple-400/70 text-xs mt-1">
                The Primary Super Admin role cannot be changed or removed through this interface. 
                This is a security measure to protect the platform.
              </p>
            </div>
          </div>
        )}

        {/* Warning if current user is NOT the platform owner */}
        {!isCurrentUserOwner && !isTargetUserOwner && (
          <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium text-sm">Permission Denied</p>
              <p className="text-red-400/70 text-xs mt-1">
                Only the Primary Super Admin can grant or change user roles.
              </p>
            </div>
          </div>
        )}

        {/* Role Selection - Only shown if NOT editing owner */}
        {!isTargetUserOwner && (
          <div className="py-2">
            <Label className="text-white mb-2 block">Select New Role</Label>
            <Select 
              value={selectedRole} 
              onValueChange={setSelectedRole}
              disabled={!isCurrentUserOwner}
            >
              <SelectTrigger className={`bg-neutral-700 border-neutral-600 text-white focus:ring-0 focus:ring-offset-0 focus:outline-none ${!isCurrentUserOwner ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <SelectValue>
                  {selectedRoleInfo && (
                    <div className="flex items-center gap-2">
                      <selectedRoleInfo.icon className="w-4 h-4" />
                      <span>{selectedRoleInfo.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-neutral-700 border-neutral-600 z-50">
                {ASSIGNABLE_ROLES.map((role) => (
                  <SelectItem 
                    key={role.value} 
                    value={role.value} 
                    className="text-white hover:bg-neutral-600 cursor-pointer py-3"
                  >
                    <div className="flex items-center gap-3">
                      <role.icon className={`w-4 h-4 ${
                        role.value === "admin" ? "text-blue-400" : "text-yellow-400"
                      }`} />
                      <div>
                        <p className="font-medium">{role.label}</p>
                        <p className="text-neutral-400 text-xs">{role.description}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600 focus:ring-0 focus:ring-offset-0 focus:outline-none"
          >
            {isTargetUserOwner ? "Close" : "Cancel"}
          </Button>
          {isCurrentUserOwner && !isTargetUserOwner && (
            <Button 
              onClick={handleSave} 
              disabled={loading || selectedRole === user?.role} 
              className="bg-blue-600 hover:bg-blue-700 focus:ring-0 focus:ring-offset-0 focus:outline-none"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
