import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Edit, Trash2, Check, X, Search, Download, Users, 
  ChevronLeft, ChevronRight, UserPlus, RefreshCw
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

type AppRole = "owner" | "admin" | "moderator" | "user";

interface RoleConfig {
  name: AppRole;
  displayName: string;
  description: string;
  userCount: number;
  permissions: {
    users: { create: boolean; read: boolean; update: boolean; delete: boolean };
    projects: { create: boolean; read: boolean; update: boolean; delete: boolean };
    settings: { create: boolean; read: boolean; update: boolean; delete: boolean };
    security: { create: boolean; read: boolean; update: boolean; delete: boolean };
    roles: { create: boolean; read: boolean; update: boolean; delete: boolean };
  };
}

interface ActivityLog {
  id: string;
  created_at: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  user_email?: string;
  user_name?: string;
}

interface UserForAssignment {
  id: string;
  email: string;
  full_name: string | null;
  current_role: AppRole | null;
}

// Role definitions with their default permissions
const ROLE_DEFINITIONS: Record<AppRole, Omit<RoleConfig, 'userCount'>> = {
  owner: {
    name: "owner",
    displayName: "Owner",
    description: "Full platform access with all permissions",
    permissions: {
      users: { create: true, read: true, update: true, delete: true },
      projects: { create: true, read: true, update: true, delete: true },
      settings: { create: true, read: true, update: true, delete: true },
      security: { create: true, read: true, update: true, delete: true },
      roles: { create: true, read: true, update: true, delete: true },
    },
  },
  admin: {
    name: "admin",
    displayName: "Admin",
    description: "Administrative access with limited security controls",
    permissions: {
      users: { create: true, read: true, update: true, delete: false },
      projects: { create: true, read: true, update: true, delete: true },
      settings: { create: false, read: true, update: true, delete: false },
      security: { create: false, read: true, update: false, delete: false },
      roles: { create: false, read: true, update: false, delete: false },
    },
  },
  moderator: {
    name: "moderator",
    displayName: "Moderator",
    description: "Content moderation and user management",
    permissions: {
      users: { create: false, read: true, update: true, delete: false },
      projects: { create: false, read: true, update: true, delete: false },
      settings: { create: false, read: true, update: false, delete: false },
      security: { create: false, read: true, update: false, delete: false },
      roles: { create: false, read: true, update: false, delete: false },
    },
  },
  user: {
    name: "user",
    displayName: "User",
    description: "Standard user with basic access",
    permissions: {
      users: { create: false, read: false, update: false, delete: false },
      projects: { create: true, read: true, update: true, delete: true },
      settings: { create: false, read: false, update: false, delete: false },
      security: { create: false, read: false, update: false, delete: false },
      roles: { create: false, read: false, update: false, delete: false },
    },
  },
};

const AdminRoles = () => {
  const { toast } = useToast();
  
  // State
  const [roles, setRoles] = useState<RoleConfig[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  
  // Search/Filter
  const [roleSearch, setRoleSearch] = useState("");
  const [activitySearch, setActivitySearch] = useState("");
  const [activityFilter, setActivityFilter] = useState<string>("all");
  
  // Pagination for activity log
  const [activityPage, setActivityPage] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);
  const activitiesPerPage = 10;
  
  // Role Assignment Dialog
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [usersForAssignment, setUsersForAssignment] = useState<UserForAssignment[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("user");
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Fetch role counts from user_roles table
  const fetchRoleCounts = async () => {
    try {
      setLoading(true);
      
      // Get counts for each role
      const roleNames: AppRole[] = ["owner", "admin", "moderator", "user"];
      const countsPromises = roleNames.map(async (role) => {
        const { count, error } = await supabase
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("role", role);
        
        if (error) throw error;
        return { role, count: count || 0 };
      });
      
      const counts = await Promise.all(countsPromises);
      
      // Build roles array with counts
      const rolesWithCounts: RoleConfig[] = roleNames.map((roleName) => {
        const roleCount = counts.find(c => c.role === roleName)?.count || 0;
        return {
          ...ROLE_DEFINITIONS[roleName],
          userCount: roleCount,
        };
      });
      
      setRoles(rolesWithCounts);
    } catch (error) {
      console.error("Error fetching role counts:", error);
      toast({
        title: "Error",
        description: "Failed to load role counts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch activity logs with pagination
  const fetchActivityLogs = async () => {
    try {
      setActivitiesLoading(true);
      
      const from = (activityPage - 1) * activitiesPerPage;
      const to = from + activitiesPerPage - 1;
      
      // Build query
      let query = supabase
        .from("activity_logs")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);
      
      // Filter by entity type if not "all"
      if (activityFilter !== "all") {
        query = query.eq("entity_type", activityFilter);
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Get user emails for the activities
      if (data && data.length > 0) {
        const userIds = [...new Set(data.filter(a => a.user_id).map(a => a.user_id))];
        
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from("user_profiles")
            .select("id, full_name")
            .in("id", userIds as string[]);
          
          const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);
          
          const activitiesWithUsers = data.map(activity => ({
            ...activity,
            user_name: activity.user_id ? profileMap.get(activity.user_id) || "Unknown" : "System",
            metadata: activity.metadata as Record<string, unknown> | null,
          }));
          
          setActivities(activitiesWithUsers);
        } else {
          setActivities(data.map(a => ({ 
            ...a, 
            user_name: "System",
            metadata: a.metadata as Record<string, unknown> | null,
          })));
        }
      } else {
        setActivities([]);
      }
      
      setTotalActivities(count || 0);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      toast({
        title: "Error",
        description: "Failed to load activity logs",
        variant: "destructive",
      });
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Fetch users for role assignment
  const fetchUsersForAssignment = async () => {
    try {
      // Get all user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("user_profiles")
        .select("id, full_name")
        .order("full_name");
      
      if (profilesError) throw profilesError;
      
      // Get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");
      
      if (rolesError) throw rolesError;
      
      const roleMap = new Map(userRoles?.map(r => [r.user_id, r.role as AppRole]) || []);
      
      const users: UserForAssignment[] = (profiles || []).map(profile => ({
        id: profile.id,
        email: "", // We don't have email in profiles, show name instead
        full_name: profile.full_name,
        current_role: roleMap.get(profile.id) || null,
      }));
      
      setUsersForAssignment(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    }
  };

  // Assign role to user
  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedRole) return;
    
    try {
      setAssignmentLoading(true);
      
      // Check if user already has a role
      const { data: existingRole, error: checkError } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", selectedUserId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from("user_roles")
          .update({ role: selectedRole, updated_at: new Date().toISOString() })
          .eq("user_id", selectedUserId);
        
        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: selectedUserId, role: selectedRole });
        
        if (error) throw error;
      }
      
      // Log the activity
      const { data: userData } = await supabase.auth.getUser();
      await supabase.from("activity_logs").insert({
        user_id: userData.user?.id,
        action: existingRole ? "role_updated" : "role_assigned",
        entity_type: "role",
        entity_id: selectedUserId,
        metadata: { 
          role: selectedRole,
          target_user_id: selectedUserId,
        },
      });
      
      toast({
        title: "Role Assigned",
        description: `Role "${selectedRole}" has been assigned successfully.`,
      });
      
      setIsAssignDialogOpen(false);
      setSelectedUserId("");
      setSelectedRole("user");
      
      // Refresh data
      fetchRoleCounts();
      fetchActivityLogs();
      fetchUsersForAssignment();
    } catch (error) {
      console.error("Error assigning role:", error);
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive",
      });
    } finally {
      setAssignmentLoading(false);
    }
  };

  // Export roles to CSV
  const exportRolesToCSV = () => {
    const headers = ["Role", "Description", "User Count", "Users Permission", "Projects Permission", "Settings Permission", "Security Permission", "Roles Permission"];
    
    const rows = roles.map(role => [
      role.displayName,
      role.description,
      role.userCount.toString(),
      Object.values(role.permissions.users).filter(v => v).length > 0 ? "Yes" : "No",
      Object.values(role.permissions.projects).filter(v => v).length > 0 ? "Yes" : "No",
      Object.values(role.permissions.settings).filter(v => v).length > 0 ? "Yes" : "No",
      Object.values(role.permissions.security).filter(v => v).length > 0 ? "Yes" : "No",
      Object.values(role.permissions.roles).filter(v => v).length > 0 ? "Yes" : "No",
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `roles-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Roles data has been exported to CSV",
    });
  };

  // Export activity log to CSV
  const exportActivityToCSV = () => {
    const headers = ["Timestamp", "User", "Action", "Entity Type", "Details"];
    
    const rows = activities.map(activity => [
      format(new Date(activity.created_at), "yyyy-MM-dd HH:mm:ss"),
      activity.user_name || "System",
      activity.action,
      activity.entity_type,
      activity.metadata ? JSON.stringify(activity.metadata) : "",
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(row => row.map(cell => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `activity-log-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Activity log has been exported to CSV",
    });
  };

  // Filter roles based on search
  const filteredRoles = useMemo(() => {
    if (!roleSearch) return roles;
    const search = roleSearch.toLowerCase();
    return roles.filter(
      role => 
        role.displayName.toLowerCase().includes(search) ||
        role.description.toLowerCase().includes(search)
    );
  }, [roles, roleSearch]);

  // Filter activities based on search
  const filteredActivities = useMemo(() => {
    if (!activitySearch) return activities;
    const search = activitySearch.toLowerCase();
    return activities.filter(
      activity =>
        activity.action.toLowerCase().includes(search) ||
        activity.entity_type.toLowerCase().includes(search) ||
        (activity.user_name && activity.user_name.toLowerCase().includes(search))
    );
  }, [activities, activitySearch]);

  // Filtered users for assignment dialog
  const filteredUsersForAssignment = useMemo(() => {
    if (!userSearchQuery) return usersForAssignment;
    const search = userSearchQuery.toLowerCase();
    return usersForAssignment.filter(
      user => 
        (user.full_name && user.full_name.toLowerCase().includes(search)) ||
        user.id.toLowerCase().includes(search)
    );
  }, [usersForAssignment, userSearchQuery]);

  // Pagination
  const totalPages = Math.ceil(totalActivities / activitiesPerPage);

  useEffect(() => {
    fetchRoleCounts();
    fetchActivityLogs();
  }, []);

  useEffect(() => {
    fetchActivityLogs();
  }, [activityPage, activityFilter]);

  useEffect(() => {
    if (isAssignDialogOpen) {
      fetchUsersForAssignment();
    }
  }, [isAssignDialogOpen]);

  return (
    <div className="h-full bg-neutral-800 p-6 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-neutral-700">
        <div className="px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Role & Permission Management
            </h1>
            <p className="text-sm mt-1 text-white/70">
              Define roles, manage permissions, and track admin activities
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-neutral-800 border-neutral-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Assign Role to User</DialogTitle>
                  <DialogDescription className="text-white/70">
                    Select a user and assign them a role
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-white">Search User</Label>
                    <Input
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder="Search by name..."
                      className="bg-neutral-900 border-neutral-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Select User</Label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger className="bg-neutral-900 border-neutral-600 text-white">
                        <SelectValue placeholder="Choose a user" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-600 max-h-60">
                        {filteredUsersForAssignment.map((user) => (
                          <SelectItem 
                            key={user.id} 
                            value={user.id}
                            className="text-white hover:bg-neutral-700"
                          >
                            <div className="flex items-center gap-2">
                              <span>{user.full_name || "Unnamed User"}</span>
                              {user.current_role && (
                                <Badge variant="outline" className="text-xs">
                                  {user.current_role}
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Assign Role</Label>
                    <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                      <SelectTrigger className="bg-neutral-900 border-neutral-600 text-white">
                        <SelectValue placeholder="Choose a role" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-600">
                        {Object.values(ROLE_DEFINITIONS).map((role) => (
                          <SelectItem 
                            key={role.name} 
                            value={role.name}
                            className="text-white hover:bg-neutral-700"
                          >
                            <div>
                              <div className="font-medium">{role.displayName}</div>
                              <div className="text-xs text-white/60">{role.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAssignDialogOpen(false)}
                    className="border-neutral-600 text-white hover:bg-neutral-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAssignRole}
                    disabled={!selectedUserId || assignmentLoading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {assignmentLoading ? "Assigning..." : "Assign Role"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-6 overflow-y-auto">
        <Tabs defaultValue="roles" className="w-full">
          <TabsList className="mb-6 bg-neutral-700 border-neutral-600">
            <TabsTrigger 
              value="roles" 
              className="text-white data-[state=active]:bg-neutral-600 data-[state=active]:text-white"
            >
              Roles
            </TabsTrigger>
            <TabsTrigger 
              value="matrix" 
              className="text-white data-[state=active]:bg-neutral-600 data-[state=active]:text-white"
            >
              Permission Matrix
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="text-white data-[state=active]:bg-neutral-600 data-[state=active]:text-white"
            >
              Admin Activity Log
            </TabsTrigger>
          </TabsList>

          {/* Roles List */}
          <TabsContent value="roles">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  placeholder="Search roles..."
                  className="pl-9 bg-neutral-600 border-neutral-500 text-white placeholder:text-neutral-300"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={fetchRoleCounts}
                  className="bg-neutral-600 border-neutral-500 text-white hover:bg-neutral-500"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button 
                  variant="outline" 
                  onClick={exportRolesToCSV}
                  className="bg-neutral-600 border-neutral-500 text-white hover:bg-neutral-500"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-white/70">Loading roles...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRoles.map((role) => (
                  <div
                    key={role.name}
                    className="rounded-lg border p-5 bg-neutral-700 border-neutral-600"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {role.displayName}
                        </h3>
                        <p className="text-sm mt-1 text-white/70">
                          {role.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-neutral-600 px-3 py-1 rounded-full">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-medium">{role.userCount}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-neutral-600">
                      <p className="text-xs font-medium mb-2 text-white/70">
                        Key Permissions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(role.permissions).map(([category, perms]) => {
                          const hasAnyPerm = Object.values(perms).some((v) => v);
                          if (!hasAnyPerm) return null;
                          return (
                            <span
                              key={category}
                              className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 capitalize"
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
            )}
          </TabsContent>

          {/* Permission Matrix */}
          <TabsContent value="matrix">
            <div className="rounded-lg border overflow-hidden border-neutral-600 bg-neutral-700">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-600">
                    <TableHead className="text-white/70">Role</TableHead>
                    <TableHead className="text-white/70 text-center">Users</TableHead>
                    <TableHead className="text-white/70 text-center">Users</TableHead>
                    <TableHead className="text-white/70 text-center">Projects</TableHead>
                    <TableHead className="text-white/70 text-center">Settings</TableHead>
                    <TableHead className="text-white/70 text-center">Security</TableHead>
                    <TableHead className="text-white/70 text-center">Roles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.name} className="border-neutral-600">
                      <TableCell className="text-white font-medium">
                        <div className="flex items-center gap-2">
                          {role.displayName}
                          <Badge variant="outline" className="text-xs">
                            {role.userCount} users
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-white font-medium">{role.userCount}</span>
                      </TableCell>
                      {Object.keys(role.permissions).map((category) => {
                        const perms = role.permissions[category as keyof typeof role.permissions];
                        const hasFullAccess = Object.values(perms).every((v) => v);
                        const hasPartialAccess = Object.values(perms).some((v) => v);

                        return (
                          <TableCell key={category} className="text-center">
                            {hasFullAccess ? (
                              <Check className="w-5 h-5 mx-auto text-green-500" />
                            ) : hasPartialAccess ? (
                              <span className="text-xs text-blue-400">Partial</span>
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
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    value={activitySearch}
                    onChange={(e) => setActivitySearch(e.target.value)}
                    placeholder="Search activity logs..."
                    className="pl-9 bg-neutral-900 border-neutral-600 text-white"
                  />
                </div>
                <Select value={activityFilter} onValueChange={setActivityFilter}>
                  <SelectTrigger className="w-40 bg-neutral-900 border-neutral-600 text-white">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-600">
                    <SelectItem value="all" className="text-white hover:bg-neutral-700">All Types</SelectItem>
                    <SelectItem value="role" className="text-white hover:bg-neutral-700">Roles</SelectItem>
                    <SelectItem value="user" className="text-white hover:bg-neutral-700">Users</SelectItem>
                    <SelectItem value="project" className="text-white hover:bg-neutral-700">Projects</SelectItem>
                    <SelectItem value="settings" className="text-white hover:bg-neutral-700">Settings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={fetchActivityLogs}
                  className="bg-neutral-600 border-neutral-500 text-white hover:bg-neutral-500"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button 
                  variant="outline" 
                  onClick={exportActivityToCSV}
                  className="bg-neutral-600 border-neutral-500 text-white hover:bg-neutral-500"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="rounded-lg border overflow-hidden border-neutral-600 bg-neutral-700">
              {activitiesLoading ? (
                <div className="text-center py-8 text-white/70">Loading activity logs...</div>
              ) : filteredActivities.length === 0 ? (
                <div className="text-center py-8 text-white/70">No activity logs found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-neutral-600">
                      <TableHead className="text-white/70">Timestamp</TableHead>
                      <TableHead className="text-white/70">User</TableHead>
                      <TableHead className="text-white/70">Action</TableHead>
                      <TableHead className="text-white/70">Entity Type</TableHead>
                      <TableHead className="text-white/70">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.map((activity) => (
                      <TableRow
                        key={activity.id}
                        className="hover:bg-neutral-600/50 border-neutral-600"
                      >
                        <TableCell className="text-white">
                          {format(new Date(activity.created_at), "yyyy-MM-dd HH:mm:ss")}
                        </TableCell>
                        <TableCell className="text-white">
                          {activity.user_name || "System"}
                        </TableCell>
                        <TableCell className="text-white">
                          <Badge 
                            variant="outline" 
                            className={
                              activity.action.includes("delete") ? "text-red-400 border-red-400" :
                              activity.action.includes("create") || activity.action.includes("assign") ? "text-green-400 border-green-400" :
                              "text-blue-400 border-blue-400"
                            }
                          >
                            {activity.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white capitalize">
                          {activity.entity_type}
                        </TableCell>
                        <TableCell className="text-white/70 max-w-xs truncate">
                          {activity.metadata ? JSON.stringify(activity.metadata) : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-white/70">
                  Showing {((activityPage - 1) * activitiesPerPage) + 1} to {Math.min(activityPage * activitiesPerPage, totalActivities)} of {totalActivities} entries
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActivityPage(p => Math.max(1, p - 1))}
                    disabled={activityPage === 1}
                    className="border-neutral-600 text-white hover:bg-neutral-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-white px-3">
                    Page {activityPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActivityPage(p => Math.min(totalPages, p + 1))}
                    disabled={activityPage === totalPages}
                    className="border-neutral-600 text-white hover:bg-neutral-700"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminRoles;
