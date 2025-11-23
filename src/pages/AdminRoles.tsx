import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: {
    users: { create: boolean; read: boolean; update: boolean; delete: boolean };
    projects: { create: boolean; read: boolean; update: boolean; delete: boolean };
    settings: { create: boolean; read: boolean; update: boolean; delete: boolean };
    security: { create: boolean; read: boolean; update: boolean; delete: boolean };
    roles: { create: boolean; read: boolean; update: boolean; delete: boolean };
  };
}

interface AdminActivity {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  details: string;
  affectedUser?: string;
}

const AdminRoles = () => {
  const { toast } = useToast();
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Role Editor State
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [permissions, setPermissions] = useState({
    users: { create: false, read: false, update: false, delete: false },
    projects: { create: false, read: false, update: false, delete: false },
    settings: { create: false, read: false, update: false, delete: false },
    security: { create: false, read: false, update: false, delete: false },
    roles: { create: false, read: false, update: false, delete: false },
  });

  // Mock Roles Data
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Owner",
      description: "Full platform access with all permissions",
      permissions: {
        users: { create: true, read: true, update: true, delete: true },
        projects: { create: true, read: true, update: true, delete: true },
        settings: { create: true, read: true, update: true, delete: true },
        security: { create: true, read: true, update: true, delete: true },
        roles: { create: true, read: true, update: true, delete: true },
      },
    },
    {
      id: "2",
      name: "Admin",
      description: "Administrative access with limited security controls",
      permissions: {
        users: { create: true, read: true, update: true, delete: false },
        projects: { create: true, read: true, update: true, delete: true },
        settings: { create: false, read: true, update: true, delete: false },
        security: { create: false, read: true, update: false, delete: false },
        roles: { create: false, read: true, update: false, delete: false },
      },
    },
    {
      id: "3",
      name: "Moderator",
      description: "Content moderation and user management",
      permissions: {
        users: { create: false, read: true, update: true, delete: false },
        projects: { create: false, read: true, update: true, delete: false },
        settings: { create: false, read: true, update: false, delete: false },
        security: { create: false, read: true, update: false, delete: false },
        roles: { create: false, read: true, update: false, delete: false },
      },
    },
    {
      id: "4",
      name: "User",
      description: "Standard user with basic access",
      permissions: {
        users: { create: false, read: false, update: false, delete: false },
        projects: { create: true, read: true, update: true, delete: true },
        settings: { create: false, read: false, update: false, delete: false },
        security: { create: false, read: false, update: false, delete: false },
        roles: { create: false, read: false, update: false, delete: false },
      },
    },
  ]);

  // Admin Activity Log (Mock Data)
  const [adminActivities] = useState<AdminActivity[]>([
    {
      id: "1",
      timestamp: "2025-11-22 07:30:15",
      admin: "admin@youaredev.dev",
      action: "Role Created",
      details: "Created new role 'Content Manager' with custom permissions",
    },
    {
      id: "2",
      timestamp: "2025-11-22 07:15:23",
      admin: "admin@youaredev.dev",
      action: "Role Assigned",
      details: "Assigned 'Admin' role to user",
      affectedUser: "user@example.com",
    },
    {
      id: "3",
      timestamp: "2025-11-22 06:45:12",
      admin: "owner@youaredev.dev",
      action: "Permission Modified",
      details: "Updated 'Moderator' role permissions",
    },
    {
      id: "4",
      timestamp: "2025-11-22 05:22:41",
      admin: "admin@youaredev.dev",
      action: "Role Deleted",
      details: "Deleted role 'Guest'",
    },
  ]);

  const handleCreateRole = () => {
    const newRole: Role = {
      id: (roles.length + 1).toString(),
      name: roleName,
      description: roleDescription,
      permissions,
    };

    setRoles([...roles, newRole]);
    setIsRoleDialogOpen(false);
    resetRoleForm();

    toast({
      title: "Role Created",
      description: `Role "${roleName}" has been created successfully.`,
    });
  };

  const handleUpdateRole = () => {
    if (!editingRole) return;

    setRoles(
      roles.map((role) =>
        role.id === editingRole.id
          ? { ...role, name: roleName, description: roleDescription, permissions }
          : role,
      ),
    );

    setIsRoleDialogOpen(false);
    setEditingRole(null);
    resetRoleForm();

    toast({
      title: "Role Updated",
      description: `Role has been updated successfully.`,
    });
  };

  const handleDeleteRole = (roleId: string, roleName: string) => {
    if (!confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
      return;
    }

    setRoles(roles.filter((role) => role.id !== roleId));

    toast({
      title: "Role Deleted",
      description: `Role "${roleName}" has been deleted.`,
    });
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description);
    setPermissions(role.permissions);
    setIsRoleDialogOpen(true);
  };

  const resetRoleForm = () => {
    setRoleName("");
    setRoleDescription("");
    setPermissions({
      users: { create: false, read: false, update: false, delete: false },
      projects: { create: false, read: false, update: false, delete: false },
      settings: { create: false, read: false, update: false, delete: false },
      security: { create: false, read: false, update: false, delete: false },
      roles: { create: false, read: false, update: false, delete: false },
    });
    setEditingRole(null);
  };

  const togglePermission = (
    category: keyof typeof permissions,
    action: "create" | "read" | "update" | "delete",
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [action]: !prev[category][action],
      },
    }));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="border-b" style={{ borderColor: "#ffffff15" }}>
        <div className="px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#D6E4F0" }}>
              Role & Permission Management
            </h1>
            <p className="text-sm mt-1" style={{ color: "#8FA3B7" }}>
              Define roles, manage permissions, and track admin activities
            </p>
          </div>
          <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetRoleForm} style={{ background: "#4CB3FF", color: "#ffffff" }}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
              <DialogHeader>
                <DialogTitle style={{ color: "#D6E4F0" }}>
                  {editingRole ? "Edit Role" : "Create New Role"}
                </DialogTitle>
                <DialogDescription style={{ color: "#8FA3B7" }}>
                  Define role details and set granular permissions
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label style={{ color: "#D6E4F0" }}>Role Name</Label>
                  <Input
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="e.g., Content Manager"
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: "#D6E4F0" }}>Description</Label>
                  <Textarea
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    placeholder="Describe this role's purpose"
                    rows={2}
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                  />
                </div>

                <div className="space-y-3">
                  <Label style={{ color: "#D6E4F0" }}>Permissions Matrix</Label>
                  <div className="rounded-lg border" style={{ borderColor: "#ffffff15" }}>
                    <Table>
                      <TableHeader>
                        <TableRow style={{ borderColor: "#ffffff15" }}>
                          <TableHead style={{ color: "#8FA3B7" }}>Resource</TableHead>
                          <TableHead style={{ color: "#8FA3B7", textAlign: "center" }}>Create</TableHead>
                          <TableHead style={{ color: "#8FA3B7", textAlign: "center" }}>Read</TableHead>
                          <TableHead style={{ color: "#8FA3B7", textAlign: "center" }}>Update</TableHead>
                          <TableHead style={{ color: "#8FA3B7", textAlign: "center" }}>Delete</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.keys(permissions).map((category) => (
                          <TableRow key={category} style={{ borderColor: "#ffffff15" }}>
                            <TableCell style={{ color: "#D6E4F0", textTransform: "capitalize" }}>
                              {category}
                            </TableCell>
                            {["create", "read", "update", "delete"].map((action) => (
                              <TableCell key={action} style={{ textAlign: "center" }}>
                                <Switch
                                  checked={
                                    permissions[category as keyof typeof permissions][
                                      action as "create" | "read" | "update" | "delete"
                                    ]
                                  }
                                  onCheckedChange={() =>
                                    togglePermission(
                                      category as keyof typeof permissions,
                                      action as "create" | "read" | "update" | "delete",
                                    )
                                  }
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={editingRole ? handleUpdateRole : handleCreateRole}
                  style={{ background: "#4CB3FF", color: "#ffffff" }}
                >
                  {editingRole ? "Update Role" : "Create Role"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="pt-6 overflow-y-auto">
        <Tabs defaultValue="roles" className="w-full">
          <TabsList className="mb-6" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            <TabsTrigger value="roles" style={{ color: "#D6E4F0" }}>
              Roles
            </TabsTrigger>
            <TabsTrigger value="matrix" style={{ color: "#D6E4F0" }}>
              Permission Matrix
            </TabsTrigger>
            <TabsTrigger value="activity" style={{ color: "#D6E4F0" }}>
              Admin Activity Log
            </TabsTrigger>
          </TabsList>

          {/* Roles List */}
          <TabsContent value="roles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="rounded-lg border p-5"
                  style={{ background: "#0B111A", borderColor: "#ffffff15" }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: "#D6E4F0" }}>
                        {role.name}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: "#8FA3B7" }}>
                        {role.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditRole(role)}>
                        <Edit className="w-4 h-4" style={{ color: "#4CB3FF" }} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id, role.name)}
                      >
                        <Trash2 className="w-4 h-4" style={{ color: "#ef4444" }} />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t" style={{ borderColor: "#ffffff15" }}>
                    <p className="text-xs font-medium mb-2" style={{ color: "#8FA3B7" }}>
                      Key Permissions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(role.permissions).map(([category, perms]) => {
                        const hasAnyPerm = Object.values(perms).some((v) => v);
                        if (!hasAnyPerm) return null;
                        return (
                          <span
                            key={category}
                            className="text-xs px-2 py-1 rounded"
                            style={{ background: "#4CB3FF20", color: "#4CB3FF" }}
                          >
                            {category}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Permission Matrix */}
          <TabsContent value="matrix">
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: "#ffffff15" }}>
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: "#ffffff15" }}>
                    <TableHead style={{ color: "#8FA3B7" }}>Role</TableHead>
                    <TableHead style={{ color: "#8FA3B7", textAlign: "center" }}>Users</TableHead>
                    <TableHead style={{ color: "#8FA3B7", textAlign: "center" }}>Projects</TableHead>
                    <TableHead style={{ color: "#8FA3B7", textAlign: "center" }}>Settings</TableHead>
                    <TableHead style={{ color: "#8FA3B7", textAlign: "center" }}>Security</TableHead>
                    <TableHead style={{ color: "#8FA3B7", textAlign: "center" }}>Roles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id} style={{ borderColor: "#ffffff15" }}>
                      <TableCell style={{ color: "#D6E4F0", fontWeight: 500 }}>{role.name}</TableCell>
                      {Object.keys(role.permissions).map((category) => {
                        const perms = role.permissions[category as keyof typeof role.permissions];
                        const hasFullAccess = Object.values(perms).every((v) => v);
                        const hasPartialAccess = Object.values(perms).some((v) => v);

                        return (
                          <TableCell key={category} style={{ textAlign: "center" }}>
                            {hasFullAccess ? (
                              <Check className="w-5 h-5 mx-auto" style={{ color: "#10b981" }} />
                            ) : hasPartialAccess ? (
                              <span className="text-xs" style={{ color: "#4CB3FF" }}>
                                Partial
                              </span>
                            ) : (
                              <X className="w-5 h-5 mx-auto" style={{ color: "#6b7280" }} />
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Admin Activity Log */}
          <TabsContent value="activity">
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: "#ffffff15" }}>
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: "#ffffff15" }}>
                    <TableHead style={{ color: "#8FA3B7" }}>Timestamp</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Admin</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Action</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Details</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Affected User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminActivities.map((activity) => (
                    <TableRow
                      key={activity.id}
                      className="hover:bg-[#ffffff05]"
                      style={{ borderColor: "#ffffff15" }}
                    >
                      <TableCell style={{ color: "#D6E4F0" }}>{activity.timestamp}</TableCell>
                      <TableCell style={{ color: "#D6E4F0" }}>{activity.admin}</TableCell>
                      <TableCell style={{ color: "#D6E4F0" }}>{activity.action}</TableCell>
                      <TableCell style={{ color: "#8FA3B7" }}>{activity.details}</TableCell>
                      <TableCell style={{ color: "#8FA3B7" }}>{activity.affectedUser || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminRoles;
