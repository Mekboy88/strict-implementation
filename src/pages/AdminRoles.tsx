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
    <div className="min-h-screen bg-neutral-800 p-6">
      {/* Header */}
      <div className="border-b border-neutral-700">
        <div className="px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-50">
              Role & Permission Management
            </h1>
            <p className="text-sm mt-1 text-neutral-400">
              Define roles, manage permissions, and track admin activities
            </p>
          </div>
          <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetRoleForm} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create New Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl bg-neutral-800 border-neutral-700">
              <DialogHeader>
                <DialogTitle className="text-neutral-50">
                  {editingRole ? "Edit Role" : "Create New Role"}
                </DialogTitle>
                <DialogDescription className="text-neutral-400">
                  Define role details and set granular permissions
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-neutral-200">Role Name</Label>
                  <Input
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="e.g., Content Manager"
                    className="bg-neutral-900 border-neutral-600 text-neutral-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-neutral-200">Description</Label>
                  <Textarea
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    placeholder="Describe this role's purpose"
                    rows={2}
                    className="bg-neutral-900 border-neutral-600 text-neutral-50"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-neutral-200">Permissions Matrix</Label>
                  <div className="rounded-lg border border-neutral-700">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-neutral-700">
                          <TableHead className="text-neutral-400">Resource</TableHead>
                          <TableHead className="text-neutral-400 text-center">Create</TableHead>
                          <TableHead className="text-neutral-400 text-center">Read</TableHead>
                          <TableHead className="text-neutral-400 text-center">Update</TableHead>
                          <TableHead className="text-neutral-400 text-center">Delete</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.keys(permissions).map((category) => (
                          <TableRow key={category} className="border-neutral-700">
                            <TableCell className="text-neutral-200 capitalize">
                              {category}
                            </TableCell>
                            {["create", "read", "update", "delete"].map((action) => (
                              <TableCell key={action} className="text-center">
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
                <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)} className="border-neutral-600 text-neutral-300 hover:bg-neutral-700">
                  Cancel
                </Button>
                <Button
                  onClick={editingRole ? handleUpdateRole : handleCreateRole}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
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
          <TabsList className="mb-6 bg-neutral-700 border-neutral-600">
            <TabsTrigger value="roles" className="text-neutral-200 data-[state=active]:bg-neutral-600 data-[state=active]:text-neutral-50">
              Roles
            </TabsTrigger>
            <TabsTrigger value="matrix" className="text-neutral-200 data-[state=active]:bg-neutral-600 data-[state=active]:text-neutral-50">
              Permission Matrix
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-neutral-200 data-[state=active]:bg-neutral-600 data-[state=active]:text-neutral-50">
              Admin Activity Log
            </TabsTrigger>
          </TabsList>

          {/* Roles List */}
          <TabsContent value="roles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="rounded-lg border p-5 bg-neutral-700 border-neutral-600"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-50">
                        {role.name}
                      </h3>
                      <p className="text-sm mt-1 text-neutral-400">
                        {role.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditRole(role)} className="hover:bg-neutral-600">
                        <Edit className="w-4 h-4 text-blue-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id, role.name)}
                        className="hover:bg-neutral-600"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-600">
                    <p className="text-xs font-medium mb-2 text-neutral-400">
                      Key Permissions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(role.permissions).map(([category, perms]) => {
                        const hasAnyPerm = Object.values(perms).some((v) => v);
                        if (!hasAnyPerm) return null;
                        return (
                          <span
                            key={category}
                            className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400"
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
            <div className="rounded-lg border overflow-hidden border-neutral-600 bg-neutral-700">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-600">
                    <TableHead className="text-neutral-400">Role</TableHead>
                    <TableHead className="text-neutral-400 text-center">Users</TableHead>
                    <TableHead className="text-neutral-400 text-center">Projects</TableHead>
                    <TableHead className="text-neutral-400 text-center">Settings</TableHead>
                    <TableHead className="text-neutral-400 text-center">Security</TableHead>
                    <TableHead className="text-neutral-400 text-center">Roles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id} className="border-neutral-600">
                      <TableCell className="text-neutral-50 font-medium">{role.name}</TableCell>
                      {Object.keys(role.permissions).map((category) => {
                        const perms = role.permissions[category as keyof typeof role.permissions];
                        const hasFullAccess = Object.values(perms).every((v) => v);
                        const hasPartialAccess = Object.values(perms).some((v) => v);

                        return (
                          <TableCell key={category} className="text-center">
                            {hasFullAccess ? (
                              <Check className="w-5 h-5 mx-auto text-green-500" />
                            ) : hasPartialAccess ? (
                              <span className="text-xs text-blue-400">
                                Partial
                              </span>
                            ) : (
                              <X className="w-5 h-5 mx-auto text-neutral-500" />
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
            <div className="rounded-lg border overflow-hidden border-neutral-600 bg-neutral-700">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-600">
                    <TableHead className="text-neutral-400">Timestamp</TableHead>
                    <TableHead className="text-neutral-400">Admin</TableHead>
                    <TableHead className="text-neutral-400">Action</TableHead>
                    <TableHead className="text-neutral-400">Details</TableHead>
                    <TableHead className="text-neutral-400">Affected User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminActivities.map((activity) => (
                    <TableRow
                      key={activity.id}
                      className="hover:bg-neutral-600/50 border-neutral-600"
                    >
                      <TableCell className="text-neutral-200">{activity.timestamp}</TableCell>
                      <TableCell className="text-neutral-200">{activity.admin}</TableCell>
                      <TableCell className="text-neutral-200">{activity.action}</TableCell>
                      <TableCell className="text-neutral-400">{activity.details}</TableCell>
                      <TableCell className="text-neutral-400">{activity.affectedUser || "-"}</TableCell>
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
