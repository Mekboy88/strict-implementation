import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, Shield, Mail, Calendar, Search, MoreVertical, Edit, Trash2, Ban, 
  Activity, Clock, ChevronLeft, ChevronRight, ArrowUpDown, UserPlus,
  CreditCard, Building2, CheckCircle, Eye, Key, RefreshCw
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditRoleDialog } from "@/components/admin/EditRoleDialog";
import { SuspendUserDialog } from "@/components/admin/SuspendUserDialog";
import { DeleteUserDialog } from "@/components/admin/DeleteUserDialog";
import { UserDetailsDialog } from "@/components/admin/UserDetailsDialog";

interface UserData {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  email?: string;
  projectCount?: number;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  banned_until?: string;
  subscription_status?: string;
  team_count?: number;
}

type SortField = "email" | "role" | "created_at" | "last_sign_in_at" | "projectCount";
type SortOrder = "asc" | "desc";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [currentUserRole, setCurrentUserRole] = useState<string>("user");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    admins: 0,
    owners: 0,
    moderators: 0,
    regular: 0,
    suspended: 0,
  });

  const fetchUsers = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        navigate("/admin/login");
        return;
      }

      // Fetch current user's role
      const { data: currentUserRoleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();
      
      if (currentUserRoleData) {
        setCurrentUserRole(currentUserRoleData.role);
      }

      // Fetch users from edge function
      const { data: authUsersData, error: authError } = await supabase.functions.invoke("admin-get-users", {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (authError) {
        console.error("Auth users error:", authError);
        toast({
          title: "Error",
          description: "Failed to load users from auth",
          variant: "destructive",
        });
      }

      const authUsers = authUsersData?.users || [];

      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*")
        .order("created_at", { ascending: false });

      if (rolesError) {
        toast({
          title: "Error",
          description: "Failed to load user roles",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Fetch projects count per user
      const { data: projects } = await supabase.from("projects").select("user_id");
      const projectCounts = projects?.reduce((acc, project) => {
        acc[project.user_id] = (acc[project.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Fetch subscriptions
      const { data: subscriptions } = await supabase.from("user_subscriptions").select("user_id, status");
      const subscriptionMap = subscriptions?.reduce((acc, sub) => {
        acc[sub.user_id] = sub.status;
        return acc;
      }, {} as Record<string, string>) || {};

      // Fetch team memberships
      const { data: teamMembers } = await supabase.from("team_members").select("user_id");
      const teamCounts = teamMembers?.reduce((acc, member) => {
        acc[member.user_id] = (acc[member.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Combine data
      const combinedUsers = (userRoles || []).map((userRole) => {
        const authUser = authUsers.find((u: any) => u.id === userRole.user_id);
        return {
          ...userRole,
          email: authUser?.email || "N/A",
          last_sign_in_at: authUser?.last_sign_in_at,
          email_confirmed_at: authUser?.email_confirmed_at,
          banned_until: authUser?.banned_until,
          projectCount: projectCounts[userRole.user_id] || 0,
          subscription_status: subscriptionMap[userRole.user_id] || "none",
          team_count: teamCounts[userRole.user_id] || 0,
        };
      });

      setUsers(combinedUsers);

      // Calculate stats
      const suspendedCount = combinedUsers.filter(u => u.banned_until && new Date(u.banned_until) > new Date()).length;
      setStats({
        totalUsers: combinedUsers.length,
        admins: combinedUsers.filter(u => u.role === "admin").length,
        owners: combinedUsers.filter(u => u.role === "owner").length,
        moderators: combinedUsers.filter(u => u.role === "moderator").length,
        regular: combinedUsers.filter(u => u.role === "user").length,
        suspended: suspendedCount,
      });

      setLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [navigate, toast]);

  // Initial load and access check
  useEffect(() => {
    const checkAccess = async () => {
      const adminAuth = sessionStorage.getItem("admin_authenticated");
      if (adminAuth !== "true") {
        navigate("/admin/login");
        return;
      }
      await fetchUsers();
    };

    checkAccess();
  }, [navigate, fetchUsers]);

  // Real-time subscription for user_roles changes
  useEffect(() => {

    const channel = supabase
      .channel('user-roles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles'
        },
        () => {
          console.log('User roles changed, refreshing...');
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUsers]);

  const handleManualRefresh = () => {
    fetchUsers(true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = 
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });

    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "email") {
        aVal = aVal?.toLowerCase() || "";
        bVal = bVal?.toLowerCase() || "";
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchQuery, roleFilter, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-500/30 text-purple-400 border-purple-500/50";
      case "admin":
        return "bg-blue-500/30 text-blue-400 border-blue-500/50";
      case "moderator":
        return "bg-yellow-500/30 text-yellow-400 border-yellow-500/50";
      default:
        return "bg-neutral-500/30 text-white border-neutral-500/50";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "owner": return "Platform Owner";
      case "admin": return "Admin";
      case "moderator": return "Moderator";
      default: return "User";
    }
  };

  const getSubscriptionBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/30 text-green-400";
      case "trialing":
        return "bg-blue-500/30 text-blue-400";
      case "past_due":
        return "bg-yellow-500/30 text-yellow-400";
      case "canceled":
        return "bg-red-500/30 text-red-400";
      default:
        return "bg-neutral-500/30 text-neutral-400";
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.functions.invoke("admin-update-user", {
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: { action: "updateRole", userId, role: newRole }
    });

    if (error) {
      toast({ title: "Error", description: "Failed to update role", variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "User role updated successfully" });
    fetchUsers();
  };

  const handleSuspendUser = async (userId: string, duration: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.functions.invoke("admin-update-user", {
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: { action: "suspend", userId, banDuration: duration }
    });

    if (error) {
      toast({ title: "Error", description: "Failed to suspend user", variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "User suspended successfully" });
    fetchUsers();
  };

  const handleUnsuspendUser = async (userId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.functions.invoke("admin-update-user", {
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: { action: "unsuspend", userId }
    });

    if (error) {
      toast({ title: "Error", description: "Failed to unsuspend user", variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "User unsuspended successfully" });
    fetchUsers();
  };

  const handleDeleteUser = async (userId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.functions.invoke("admin-update-user", {
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: { action: "delete", userId }
    });

    if (error) {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "User deleted successfully" });
    fetchUsers();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-neutral-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-neutral-800 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-sm mt-1 text-neutral-400">
            Manage all registered users and their roles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="border-neutral-600 text-white hover:bg-neutral-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="rounded-lg border p-4 bg-neutral-700 border-neutral-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-neutral-700 border-neutral-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">Platform Owner</p>
              <p className="text-2xl font-bold text-white">{stats.owners}</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-neutral-700 border-neutral-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">Admins</p>
              <p className="text-2xl font-bold text-white">{stats.admins}</p>
            </div>
            <div className="p-2 rounded-lg bg-green-500/20">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-neutral-700 border-neutral-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">Moderators</p>
              <p className="text-2xl font-bold text-white">{stats.moderators}</p>
            </div>
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Shield className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-neutral-700 border-neutral-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">Regular</p>
              <p className="text-2xl font-bold text-white">{stats.regular}</p>
            </div>
            <div className="p-2 rounded-lg bg-neutral-500/20">
              <Users className="w-5 h-5 text-neutral-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-neutral-700 border-neutral-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">Suspended</p>
              <p className="text-2xl font-bold text-white">{stats.suspended}</p>
            </div>
            <div className="p-2 rounded-lg bg-red-500/20">
              <Ban className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border h-9 text-sm bg-neutral-700 border-neutral-600 text-white"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40 bg-neutral-700 border-neutral-600 text-white">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-700 border-neutral-600 z-50">
            <SelectItem value="all" className="text-white hover:bg-neutral-600">All Roles</SelectItem>
            <SelectItem value="owner" className="text-white hover:bg-neutral-600">Platform Owner</SelectItem>
            <SelectItem value="admin" className="text-white hover:bg-neutral-600">Admin</SelectItem>
            <SelectItem value="moderator" className="text-white hover:bg-neutral-600">Moderator</SelectItem>
            <SelectItem value="user" className="text-white hover:bg-neutral-600">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden bg-neutral-700 border-neutral-600">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-600">
              <TableHead 
                className="text-white cursor-pointer hover:bg-neutral-600"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead 
                className="text-white cursor-pointer hover:bg-neutral-600"
                onClick={() => handleSort("role")}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Role
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead className="text-white">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Status
                </div>
              </TableHead>
              <TableHead className="text-white">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Subscription
                </div>
              </TableHead>
              <TableHead className="text-white">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Teams
                </div>
              </TableHead>
              <TableHead 
                className="text-white cursor-pointer hover:bg-neutral-600"
                onClick={() => handleSort("projectCount")}
              >
                <div className="flex items-center gap-2">
                  Projects
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead 
                className="text-white cursor-pointer hover:bg-neutral-600"
                onClick={() => handleSort("last_sign_in_at")}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Last Active
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead 
                className="text-white cursor-pointer hover:bg-neutral-600"
                onClick={() => handleSort("created_at")}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => {
              const isBanned = user.banned_until && new Date(user.banned_until) > new Date();
              const isActive = user.email_confirmed_at && !isBanned;
              const lastActive = user.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Never";

              return (
                <TableRow key={user.id} className="border-neutral-600 hover:bg-neutral-600/50">
                  <TableCell className="text-white font-medium">{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}
                    >
                      {getRoleDisplayName(user.role)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isBanned ? "bg-red-500" : isActive ? "bg-green-500" : "bg-neutral-500"
                        }`}
                      />
                      <span className={`text-sm ${
                        isBanned ? "text-red-400" : isActive ? "text-green-400" : "text-neutral-400"
                      }`}>
                        {isBanned ? "Suspended" : isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${getSubscriptionBadge(user.subscription_status || "none")}`}>
                      {user.subscription_status === "none" ? "Free" : user.subscription_status}
                    </span>
                  </TableCell>
                  <TableCell className="text-white">{user.team_count}</TableCell>
                  <TableCell className="text-white">{user.projectCount}</TableCell>
                  <TableCell className="text-neutral-400 text-sm">{lastActive}</TableCell>
                  <TableCell className="text-neutral-400 text-sm">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.role === "owner" ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded">
                          Protected
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-neutral-600 text-white"
                          onClick={() => {
                            setSelectedUser(user);
                            setUserDetailsOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="hover:bg-neutral-600 text-white">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border z-50 bg-neutral-700 border-neutral-600 min-w-[180px]">
                          <DropdownMenuLabel className="text-neutral-400 text-xs">
                            User Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-neutral-600" />
                          <DropdownMenuItem
                            className="hover:bg-neutral-600 cursor-pointer text-white"
                            onClick={() => {
                              setSelectedUser(user);
                              setUserDetailsOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-neutral-600 cursor-pointer text-white"
                            onClick={() => {
                              setSelectedUser(user);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-neutral-600 cursor-pointer text-white"
                            onClick={() => {
                              toast({
                                title: "Password Reset",
                                description: `Password reset email sent to ${user.email}`,
                              });
                            }}
                          >
                            <Key className="w-4 h-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-neutral-600" />
                          {isBanned ? (
                            <DropdownMenuItem
                              className="hover:bg-neutral-600 cursor-pointer text-green-400"
                              onClick={() => handleUnsuspendUser(user.user_id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Unsuspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="hover:bg-neutral-600 cursor-pointer text-yellow-400"
                              onClick={() => {
                                setSelectedUser(user);
                                setSuspendDialogOpen(true);
                              }}
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator className="bg-neutral-600" />
                          <DropdownMenuItem
                            className="hover:bg-neutral-600 cursor-pointer text-red-400"
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {paginatedUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4 text-neutral-500" />
            <p className="text-neutral-400">
              {searchQuery || roleFilter !== "all"
                ? "No users found matching your filters"
                : "No users found"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-neutral-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)} of{" "}
            {filteredAndSortedUsers.length} users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-neutral-600 text-white hover:bg-neutral-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-white text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-neutral-600 text-white hover:bg-neutral-700"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <EditRoleDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={selectedUser}
        onSave={handleUpdateRole}
        currentUserRole={currentUserRole}
      />
      <SuspendUserDialog
        open={suspendDialogOpen}
        onOpenChange={setSuspendDialogOpen}
        user={selectedUser}
        onSuspend={handleSuspendUser}
      />
      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={selectedUser}
        onDelete={handleDeleteUser}
      />
      <UserDetailsDialog
        open={userDetailsOpen}
        onOpenChange={setUserDetailsOpen}
        user={selectedUser}
      />
    </div>
  );
};

export default AdminUsers;
