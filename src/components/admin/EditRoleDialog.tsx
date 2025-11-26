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
import { Shield, Crown, UserCog, Users, User as UserIcon, AlertTriangle } from "lucide-react";

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: string; user_id: string; email?: string; role: string } | null;
  onSave: (userId: string, newRole: string) => Promise<void>;
  currentUserRole?: string; // The role of the logged-in admin user
}

const ALL_ROLES = [
  { 
    value: "owner", 
    label: "Primary Super Admin", 
    description: "Full platform control - highest level access",
    color: "bg-purple-500/30 text-purple-400 border-purple-500/50",
    icon: Crown
  },
  { 
    value: "admin", 
    label: "Admin", 
    description: "Full administrative access to manage platform",
    color: "bg-blue-500/30 text-blue-400 border-blue-500/50",
    icon: Shield
  },
  { 
    value: "moderator", 
    label: "Moderator", 
    description: "Can moderate content and manage users",
    color: "bg-yellow-500/30 text-yellow-400 border-yellow-500/50",
    icon: UserCog
  },
  { 
    value: "user", 
    label: "User", 
    description: "Basic access with limited permissions",
    color: "bg-neutral-500/30 text-neutral-300 border-neutral-500/50",
    icon: UserIcon
  },
];

export const EditRoleDialog = ({ open, onOpenChange, user, onSave, currentUserRole = "user" }: EditRoleDialogProps) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || "user");
  const [loading, setLoading] = useState(false);

  // Check if current logged-in user is the platform owner
  const isCurrentUserOwner = currentUserRole === "owner";

  // Reset selected role when user changes
  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user || !isCurrentUserOwner) return;
    setLoading(true);
    try {
      await onSave(user.user_id, selectedRole);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const getRoleInfo = (roleValue: string) => {
    return ALL_ROLES.find(r => r.value === roleValue);
  };

  const currentRoleInfo = getRoleInfo(user?.role || "user");
  const selectedRoleInfo = getRoleInfo(selectedRole);

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

        {/* Warning if current user is NOT the platform owner */}
        {!isCurrentUserOwner && (
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

        {/* Current Role Display */}
        <div className="py-2">
          <Label className="text-neutral-400 text-xs mb-2 block">Current Role</Label>
          <div className="flex items-center gap-2">
            {currentRoleInfo && (
              <>
                <Badge className={`${currentRoleInfo.color} border flex items-center gap-1`}>
                  <currentRoleInfo.icon className="w-3 h-3" />
                  {currentRoleInfo.label}
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Role Selection - Only enabled for platform owner */}
        <div className="py-2">
          <Label className="text-white mb-2 block">Select New Role</Label>
          <Select 
            value={selectedRole} 
            onValueChange={setSelectedRole}
            disabled={!isCurrentUserOwner}
          >
            <SelectTrigger className={`bg-neutral-700 border-neutral-600 text-white ${!isCurrentUserOwner ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
              {ALL_ROLES.map((role) => (
                <SelectItem 
                  key={role.value} 
                  value={role.value} 
                  className="text-white hover:bg-neutral-600 cursor-pointer py-3"
                >
                  <div className="flex items-center gap-3">
                    <role.icon className={`w-4 h-4 ${
                      role.value === "owner" ? "text-purple-400" :
                      role.value === "admin" ? "text-blue-400" :
                      role.value === "moderator" ? "text-yellow-400" :
                      "text-neutral-400"
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

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="border-neutral-600 text-white hover:bg-neutral-700"
          >
            Cancel
          </Button>
          {isCurrentUserOwner && (
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
