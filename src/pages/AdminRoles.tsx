import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Edit, Trash2, Check, X, Search, Download, Users, 
  ChevronLeft, ChevronRight, UserPlus, RefreshCw, Calendar,
  UserMinus, CheckSquare, Square, BarChart3, AlertTriangle, Shield
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

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

interface UserWithRole {
  id: string;
  user_id: string;
  role: AppRole;
  full_name: string | null;
  created_at: string;
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

const ROLE_COLORS: Record<AppRole, string> = {
  owner: "#ef4444",
  admin: "#f59e0b",
  moderator: "#3b82f6",
  user: "#22c55e",
};

const AdminRoles = () => {
  const { toast } = useToast();
  
  // Current user state
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<AppRole | null>(null);
  
  // State
  const [roles, setRoles] = useState<RoleConfig[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  
  // Owner count for protection
  const [ownerCount, setOwnerCount] = useState(0);
  
  // Search/Filter
  const [roleSearch, setRoleSearch] = useState("");
  const [activitySearch, setActivitySearch] = useState("");
  const [activityFilter, setActivityFilter] = useState<string>("all");
  
  // Date Range Filter
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
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
  
  // Bulk Assignment
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  
  // View Users by Role Dialog
  const [isViewUsersDialogOpen, setIsViewUsersDialogOpen] = useState(false);
  const [selectedRoleForView, setSelectedRoleForView] = useState<AppRole | null>(null);
  const [usersWithRole, setUsersWithRole] = useState<UserWithRole[]>([]);
  const [viewUsersLoading, setViewUsersLoading] = useState(false);
  
  // Quick User Lookup
  const [quickSearchQuery, setQuickSearchQuery] = useState("");
  const [quickSearchResults, setQuickSearchResults] = useState<UserForAssignment[]>([]);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [selectedQuickUser, setSelectedQuickUser] = useState<UserForAssignment | null>(null);
  const [quickRoleChange, setQuickRoleChange] = useState<AppRole>("user");
  
  // Self-demotion warning
  const [showSelfDemotionWarning, setShowSelfDemotionWarning] = useState(false);
  const [pendingSelfDemotion, setPendingSelfDemotion] = useState<{ userId: string; newRole: AppRole } | null>(null);

  // Fetch current user info
  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (roleData) {
        setCurrentUserRole(roleData.role as AppRole);
      }
    }
  };

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
      
      // Store owner count for protection
      const ownerCountResult = counts.find(c => c.role === "owner")?.count || 0;
      setOwnerCount(ownerCountResult);
      
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

  // Fetch activity logs with pagination and date filter
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
      
      // Date range filter
      if (dateFrom) {
        query = query.gte("created_at", `${dateFrom}T00:00:00`);
      }
      if (dateTo) {
        query = query.lte("created_at", `${dateTo}T23:59:59`);
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
        email: "",
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

  // Fetch users with a specific role
  const fetchUsersWithRole = async (role: AppRole) => {
    try {
      setViewUsersLoading(true);
      
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("id, user_id, role, created_at")
        .eq("role", role);
      
      if (rolesError) throw rolesError;
      
      if (userRoles && userRoles.length > 0) {
        const userIds = userRoles.map(r => r.user_id);
        
        const { data: profiles } = await supabase
          .from("user_profiles")
          .select("id, full_name")
          .in("id", userIds);
        
        const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);
        
        const usersWithRoleData: UserWithRole[] = userRoles.map(ur => ({
          id: ur.id,
          user_id: ur.user_id,
          role: ur.role as AppRole,
          full_name: profileMap.get(ur.user_id) || "Unknown User",
          created_at: ur.created_at || "",
        }));
        
        setUsersWithRole(usersWithRoleData);
      } else {
        setUsersWithRole([]);
      }
    } catch (error) {
      console.error("Error fetching users with role:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setViewUsersLoading(false);
    }
  };

  // Check if action would remove the last owner
  const isLastOwner = (userId: string, currentRole: AppRole): boolean => {
    return currentRole === "owner" && ownerCount <= 1;
  };

  // Check if this is a self-demotion
  const isSelfDemotion = (userId: string, newRole: AppRole): boolean => {
    if (userId !== currentUserId) return false;
    if (!currentUserRole) return false;
    
    const roleHierarchy: AppRole[] = ["owner", "admin", "moderator", "user"];
    const currentIndex = roleHierarchy.indexOf(currentUserRole);
    const newIndex = roleHierarchy.indexOf(newRole);
    
    return newIndex > currentIndex;
  };

  // Handle role change with safety checks
  const handleRoleChangeWithChecks = async (userId: string, newRole: AppRole, currentRole: AppRole | null) => {
    // Check last owner protection
    if (currentRole === "owner" && newRole !== "owner" && isLastOwner(userId, currentRole)) {
      toast({
        title: "Cannot Change Role",
        description: "You cannot demote the last owner. Promote another user to owner first.",
        variant: "destructive",
      });
      return false;
    }
    
    // Check self-demotion
    if (isSelfDemotion(userId, newRole)) {
      setPendingSelfDemotion({ userId, newRole });
      setShowSelfDemotionWarning(true);
      return false;
    }
    
    return true;
  };

  // Confirm self-demotion
  const confirmSelfDemotion = async () => {
    if (!pendingSelfDemotion) return;
    
    const { userId, newRole } = pendingSelfDemotion;
    
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
      
      if (error) throw error;
      
      const { data: userData } = await supabase.auth.getUser();
      await supabase.from("activity_logs").insert({
        user_id: userData.user?.id,
        action: "self_demoted",
        entity_type: "role",
        entity_id: userId,
        metadata: { from_role: currentUserRole, to_role: newRole },
      });
      
      toast({
        title: "Role Changed",
        description: `Your role has been changed to ${newRole}.`,
      });
      
      setCurrentUserRole(newRole);
      fetchRoleCounts();
      fetchActivityLogs();
      fetchUsersForAssignment();
    } catch (error) {
      console.error("Error changing role:", error);
      toast({
        title: "Error",
        description: "Failed to change role",
        variant: "destructive",
      });
    } finally {
      setShowSelfDemotionWarning(false);
      setPendingSelfDemotion(null);
    }
  };

  // Assign role to user
  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedRole) return;
    
    const targetUser = usersForAssignment.find(u => u.id === selectedUserId);
    const canProceed = await handleRoleChangeWithChecks(selectedUserId, selectedRole, targetUser?.current_role || null);
    if (!canProceed) return;
    
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

  // Bulk assign role to multiple users
  const handleBulkAssignRole = async () => {
    if (selectedUserIds.length === 0 || !selectedRole) return;
    
    // Check for last owner in bulk selection
    for (const userId of selectedUserIds) {
      const user = usersForAssignment.find(u => u.id === userId);
      if (user?.current_role === "owner" && selectedRole !== "owner" && isLastOwner(userId, "owner")) {
        toast({
          title: "Cannot Change Role",
          description: "Cannot demote the last owner in bulk operation.",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Check for self-demotion in bulk
    if (currentUserId && selectedUserIds.includes(currentUserId) && isSelfDemotion(currentUserId, selectedRole)) {
      toast({
        title: "Warning",
        description: "Remove yourself from selection to demote your own role, or do it separately.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setAssignmentLoading(true);
      
      const { data: userData } = await supabase.auth.getUser();
      
      for (const userId of selectedUserIds) {
        const { data: existingRole } = await supabase
          .from("user_roles")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();
        
        if (existingRole) {
          await supabase
            .from("user_roles")
            .update({ role: selectedRole, updated_at: new Date().toISOString() })
            .eq("user_id", userId);
        } else {
          await supabase
            .from("user_roles")
            .insert({ user_id: userId, role: selectedRole });
        }
        
        // Log each assignment
        await supabase.from("activity_logs").insert({
          user_id: userData.user?.id,
          action: "bulk_role_assigned",
          entity_type: "role",
          entity_id: userId,
          metadata: { role: selectedRole, target_user_id: userId },
        });
      }
      
      toast({
        title: "Bulk Assignment Complete",
        description: `Role "${selectedRole}" assigned to ${selectedUserIds.length} users.`,
      });
      
      setSelectedUserIds([]);
      setIsBulkMode(false);
      setIsAssignDialogOpen(false);
      
      fetchRoleCounts();
      fetchActivityLogs();
      fetchUsersForAssignment();
    } catch (error) {
      console.error("Error bulk assigning roles:", error);
      toast({
        title: "Error",
        description: "Failed to bulk assign roles",
        variant: "destructive",
      });
    } finally {
      setAssignmentLoading(false);
    }
  };

  // Remove role from user
  const handleRemoveRole = async (userId: string, roleName: string) => {
    // Check last owner protection
    if (roleName === "owner" && isLastOwner(userId, "owner")) {
      toast({
        title: "Cannot Remove Role",
        description: "You cannot remove the last owner. Promote another user to owner first.",
        variant: "destructive",
      });
      return;
    }
    
    // Check self-removal warning
    if (userId === currentUserId) {
      toast({
        title: "Warning",
        description: "You are about to remove your own role. You may lose access to this page.",
        variant: "destructive",
      });
    }
    
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);
      
      if (error) throw error;
      
      // Log the activity
      const { data: userData } = await supabase.auth.getUser();
      await supabase.from("activity_logs").insert({
        user_id: userData.user?.id,
        action: "role_removed",
        entity_type: "role",
        entity_id: userId,
        metadata: { removed_role: roleName, target_user_id: userId },
      });
      
      toast({
        title: "Role Removed",
        description: "User's role has been removed successfully.",
      });
      
      // Refresh data
      fetchRoleCounts();
      fetchActivityLogs();
      if (selectedRoleForView) {
        fetchUsersWithRole(selectedRoleForView);
      }
      fetchUsersForAssignment();
    } catch (error) {
      console.error("Error removing role:", error);
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive",
      });
    }
  };

  // Downgrade user role
  const handleDowngradeRole = async (userId: string, currentRole: AppRole) => {
    const roleHierarchy: AppRole[] = ["owner", "admin", "moderator", "user"];
    const currentIndex = roleHierarchy.indexOf(currentRole);
    
    if (currentIndex === roleHierarchy.length - 1) {
      toast({
        title: "Cannot Downgrade",
        description: "User already has the lowest role.",
        variant: "destructive",
      });
      return;
    }
    
    const newRole = roleHierarchy[currentIndex + 1];
    
    // Check last owner protection
    if (currentRole === "owner" && isLastOwner(userId, currentRole)) {
      toast({
        title: "Cannot Downgrade",
        description: "You cannot downgrade the last owner. Promote another user to owner first.",
        variant: "destructive",
      });
      return;
    }
    
    // Check self-demotion
    if (userId === currentUserId) {
      setPendingSelfDemotion({ userId, newRole });
      setShowSelfDemotionWarning(true);
      return;
    }
    
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
      
      if (error) throw error;
      
      const { data: userData } = await supabase.auth.getUser();
      await supabase.from("activity_logs").insert({
        user_id: userData.user?.id,
        action: "role_downgraded",
        entity_type: "role",
        entity_id: userId,
        metadata: { from_role: currentRole, to_role: newRole, target_user_id: userId },
      });
      
      toast({
        title: "Role Downgraded",
        description: `User downgraded from ${currentRole} to ${newRole}.`,
      });
      
      fetchRoleCounts();
      fetchActivityLogs();
      if (selectedRoleForView) {
        fetchUsersWithRole(selectedRoleForView);
      }
      fetchUsersForAssignment();
    } catch (error) {
      console.error("Error downgrading role:", error);
      toast({
        title: "Error",
        description: "Failed to downgrade role",
        variant: "destructive",
      });
    }
  };

  // Quick search for users
  const handleQuickSearch = async (query: string) => {
    setQuickSearchQuery(query);
    
    if (query.length < 2) {
      setQuickSearchResults([]);
      return;
    }
    
    try {
      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("id, full_name")
        .ilike("full_name", `%${query}%`)
        .limit(10);
      
      if (profiles) {
        const { data: userRoles } = await supabase
          .from("user_roles")
          .select("user_id, role")
          .in("user_id", profiles.map(p => p.id));
        
        const roleMap = new Map(userRoles?.map(r => [r.user_id, r.role as AppRole]) || []);
        
        const results: UserForAssignment[] = profiles.map(p => ({
          id: p.id,
          email: "",
          full_name: p.full_name,
          current_role: roleMap.get(p.id) || null,
        }));
        
        setQuickSearchResults(results);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  // Handle quick role change
  const handleQuickRoleChange = async () => {
    if (!selectedQuickUser) return;
    
    const canProceed = await handleRoleChangeWithChecks(
      selectedQuickUser.id, 
      quickRoleChange, 
      selectedQuickUser.current_role
    );
    if (!canProceed) return;
    
    try {
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", selectedQuickUser.id)
        .maybeSingle();
      
      if (existingRole) {
        await supabase
          .from("user_roles")
          .update({ role: quickRoleChange, updated_at: new Date().toISOString() })
          .eq("user_id", selectedQuickUser.id);
      } else {
        await supabase
          .from("user_roles")
          .insert({ user_id: selectedQuickUser.id, role: quickRoleChange });
      }
      
      const { data: userData } = await supabase.auth.getUser();
      await supabase.from("activity_logs").insert({
        user_id: userData.user?.id,
        action: "quick_role_change",
        entity_type: "role",
        entity_id: selectedQuickUser.id,
        metadata: { 
          from_role: selectedQuickUser.current_role, 
          to_role: quickRoleChange,
          target_user_id: selectedQuickUser.id 
        },
      });
      
      toast({
        title: "Role Updated",
        description: `${selectedQuickUser.full_name}'s role changed to ${quickRoleChange}.`,
      });
      
      setSelectedQuickUser(null);
      setQuickSearchQuery("");
      setQuickSearchResults([]);
      setIsQuickSearchOpen(false);
      
      fetchRoleCounts();
      fetchActivityLogs();
    } catch (error) {
      console.error("Error changing role:", error);
      toast({
        title: "Error",
        description: "Failed to change role",
        variant: "destructive",
      });
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

  // Chart data for role distribution
  const pieChartData = useMemo(() => {
    return roles.map(role => ({
      name: role.displayName,
      value: role.userCount,
      color: ROLE_COLORS[role.name],
    }));
  }, [roles]);

  const barChartData = useMemo(() => {
    return roles.map(role => ({
      name: role.displayName,
      users: role.userCount,
      fill: ROLE_COLORS[role.name],
    }));
  }, [roles]);

  // Toggle user selection for bulk assignment
  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Select all users
  const selectAllUsers = () => {
    if (selectedUserIds.length === filteredUsersForAssignment.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsersForAssignment.map(u => u.id));
    }
  };

  // Pagination
  const totalPages = Math.ceil(totalActivities / activitiesPerPage);

  // Clear date filters
  const clearDateFilters = () => {
    setDateFrom("");
    setDateTo("");
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchRoleCounts();
    fetchActivityLogs();
  }, []);

  useEffect(() => {
    fetchActivityLogs();
  }, [activityPage, activityFilter, dateFrom, dateTo]);

  useEffect(() => {
    if (isAssignDialogOpen) {
      fetchUsersForAssignment();
    }
  }, [isAssignDialogOpen]);

  useEffect(() => {
    if (selectedRoleForView) {
      fetchUsersWithRole(selectedRoleForView);
    }
  }, [selectedRoleForView]);

  const handleRoleCardClick = (role: AppRole) => {
    setSelectedRoleForView(role);
    setIsViewUsersDialogOpen(true);
  };

  return (
    <div className="h-full bg-neutral-800 p-6 overflow-y-auto">
      {/* Self-Demotion Warning Dialog */}
      <AlertDialog open={showSelfDemotionWarning} onOpenChange={setShowSelfDemotionWarning}>
        <AlertDialogContent className="bg-neutral-800 border-neutral-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Warning: Self-Demotion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              You are about to demote yourself to <strong>{pendingSelfDemotion?.newRole}</strong>. 
              This action will reduce your permissions and you may lose access to this admin page.
              <br /><br />
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setShowSelfDemotionWarning(false);
                setPendingSelfDemotion(null);
              }}
              className="border-neutral-600 text-white hover:bg-neutral-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSelfDemotion}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Yes, Demote Myself
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            {/* Quick User Lookup */}
            <Dialog open={isQuickSearchOpen} onOpenChange={setIsQuickSearchOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-neutral-700 border-neutral-600 text-neutral-400 hover:bg-neutral-600 hover:text-neutral-300">
                  <Search className="w-4 h-4 mr-2" />
                  Quick Lookup
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-neutral-800 border-neutral-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Quick User Lookup</DialogTitle>
                  <DialogDescription className="text-white/70">
                    Search for a user and quickly change their role
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      value={quickSearchQuery}
                      onChange={(e) => handleQuickSearch(e.target.value)}
                      placeholder="Search by name..."
                      className="pl-9 bg-neutral-900 border-neutral-600 text-white"
                    />
                  </div>
                  
                  {quickSearchResults.length > 0 && !selectedQuickUser && (
                    <div className="border border-neutral-600 rounded-md max-h-48 overflow-y-auto">
                      {quickSearchResults.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => {
                            setSelectedQuickUser(user);
                            setQuickRoleChange(user.current_role || "user");
                          }}
                          className="p-3 hover:bg-neutral-700 cursor-pointer flex items-center justify-between"
                        >
                          <span className="text-white">{user.full_name || "Unnamed User"}</span>
                          {user.current_role ? (
                            <Badge 
                              variant="outline" 
                              style={{ 
                                borderColor: ROLE_COLORS[user.current_role],
                                color: ROLE_COLORS[user.current_role]
                              }}
                            >
                              {user.current_role}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-neutral-400">No Role</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedQuickUser && (
                    <div className="space-y-4 p-4 bg-neutral-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{selectedQuickUser.full_name}</p>
                          <p className="text-sm text-white/70">
                            Current: {selectedQuickUser.current_role || "No Role"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedQuickUser(null)}
                          className="text-white/70 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {selectedQuickUser.current_role === "owner" && ownerCount <= 1 && (
                        <div className="flex items-center gap-2 p-2 bg-red-500/20 rounded text-red-400 text-sm">
                          <Shield className="w-4 h-4" />
                          This is the last owner - cannot change role
                        </div>
                      )}
                      
                      {selectedQuickUser.id === currentUserId && (
                        <div className="flex items-center gap-2 p-2 bg-yellow-500/20 rounded text-yellow-400 text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          This is your account
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label className="text-white">Change Role To</Label>
                        <Select 
                          value={quickRoleChange} 
                          onValueChange={(v) => setQuickRoleChange(v as AppRole)}
                          disabled={selectedQuickUser.current_role === "owner" && ownerCount <= 1}
                        >
                          <SelectTrigger className="bg-neutral-900 border-neutral-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-neutral-800 border-neutral-600">
                            {Object.values(ROLE_DEFINITIONS).map((role) => (
                              <SelectItem 
                                key={role.name} 
                                value={role.name}
                                className="text-white hover:bg-neutral-700"
                              >
                                {role.displayName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button
                        onClick={handleQuickRoleChange}
                        disabled={
                          quickRoleChange === selectedQuickUser.current_role ||
                          (selectedQuickUser.current_role === "owner" && ownerCount <= 1)
                        }
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        Update Role
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg bg-neutral-800 border-neutral-700">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {isBulkMode ? "Bulk Assign Roles" : "Assign Role to User"}
                  </DialogTitle>
                  <DialogDescription className="text-white/70">
                    {isBulkMode 
                      ? `Select multiple users to assign the same role (${selectedUserIds.length} selected)`
                      : "Select a user and assign them a role"
                    }
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* Bulk Mode Toggle */}
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Bulk Assignment Mode</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsBulkMode(!isBulkMode);
                        setSelectedUserIds([]);
                        setSelectedUserId("");
                      }}
                      className="border-neutral-600 text-white hover:bg-neutral-700"
                    >
                      {isBulkMode ? "Single Mode" : "Bulk Mode"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Search User</Label>
                    <Input
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder="Search by name..."
                      className="bg-neutral-900 border-neutral-600 text-white"
                    />
                  </div>
                  
                  {isBulkMode ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-white">Select Users</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={selectAllUsers}
                          className="text-white/70 hover:text-white"
                        >
                          {selectedUserIds.length === filteredUsersForAssignment.length 
                            ? "Deselect All" 
                            : "Select All"
                          }
                        </Button>
                      </div>
                      <div className="max-h-48 overflow-y-auto border border-neutral-600 rounded-md p-2 space-y-1">
                        {filteredUsersForAssignment.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-2 p-2 rounded hover:bg-neutral-700 cursor-pointer"
                            onClick={() => toggleUserSelection(user.id)}
                          >
                            <Checkbox
                              checked={selectedUserIds.includes(user.id)}
                              className="border-neutral-500"
                            />
                            <span className="text-white">{user.full_name || "Unnamed User"}</span>
                            {user.current_role && (
                              <Badge variant="outline" className="text-xs ml-auto">
                                {user.current_role}
                              </Badge>
                            )}
                            {user.id === currentUserId && (
                              <span className="text-xs text-yellow-400">(You)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
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
                                {user.id === currentUserId && (
                                  <span className="text-xs text-yellow-400">(You)</span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

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
                    onClick={() => {
                      setIsAssignDialogOpen(false);
                      setSelectedUserIds([]);
                      setIsBulkMode(false);
                    }}
                    className="border-neutral-600 text-white hover:bg-neutral-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={isBulkMode ? handleBulkAssignRole : handleAssignRole}
                    disabled={(isBulkMode ? selectedUserIds.length === 0 : !selectedUserId) || assignmentLoading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {assignmentLoading 
                      ? "Assigning..." 
                      : isBulkMode 
                        ? `Assign to ${selectedUserIds.length} Users` 
                        : "Assign Role"
                    }
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* View Users by Role Dialog */}
      <Dialog open={isViewUsersDialogOpen} onOpenChange={setIsViewUsersDialogOpen}>
        <DialogContent className="max-w-2xl bg-neutral-800 border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Users with {selectedRoleForView && ROLE_DEFINITIONS[selectedRoleForView].displayName} Role
              {selectedRoleForView === "owner" && ownerCount <= 1 && (
                <Badge className="bg-red-500/20 text-red-400 border-red-500">
                  <Shield className="w-3 h-3 mr-1" />
                  Protected
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Manage users assigned to this role
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {viewUsersLoading ? (
              <div className="text-center py-8 text-white/70">Loading users...</div>
            ) : usersWithRole.length === 0 ? (
              <div className="text-center py-8 text-white/70">No users with this role</div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-neutral-600">
                      <TableHead className="text-white/70">User</TableHead>
                      <TableHead className="text-white/70">Assigned</TableHead>
                      <TableHead className="text-white/70 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersWithRole.map((user) => {
                      const isCurrentUser = user.user_id === currentUserId;
                      const isProtectedOwner = user.role === "owner" && ownerCount <= 1;
                      
                      return (
                        <TableRow key={user.id} className="border-neutral-600">
                          <TableCell className="text-white font-medium">
                            <div className="flex items-center gap-2">
                              {user.full_name || "Unknown User"}
                              {isCurrentUser && (
                                <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">You</Badge>
                              )}
                              {isProtectedOwner && (
                                <Badge className="bg-red-500/20 text-red-400 text-xs">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Last Owner
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-white/70">
                            {user.created_at ? format(new Date(user.created_at), "MMM dd, yyyy") : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {selectedRoleForView !== "user" && !isProtectedOwner && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDowngradeRole(user.user_id, user.role)}
                                  className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/20"
                                >
                                  <ChevronLeft className="w-3 h-3 mr-1" />
                                  Downgrade
                                </Button>
                              )}
                              {!isProtectedOwner && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemoveRole(user.user_id, user.role)}
                                  className="border-red-600 text-red-400 hover:bg-red-600/20"
                                >
                                  <UserMinus className="w-3 h-3 mr-1" />
                                  Remove
                                </Button>
                              )}
                              {isProtectedOwner && (
                                <span className="text-xs text-neutral-500">Protected</span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsViewUsersDialogOpen(false)}
              className="border-neutral-600 text-white hover:bg-neutral-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              value="statistics" 
              className="text-white data-[state=active]:bg-neutral-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Statistics
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
                    onClick={() => handleRoleCardClick(role.name)}
                    className="rounded-lg border p-5 bg-neutral-700 border-neutral-600 cursor-pointer hover:border-neutral-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">
                            {role.displayName}
                          </h3>
                          {role.name === "owner" && role.userCount <= 1 && (
                            <Badge className="bg-red-500/20 text-red-400 text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Protected
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm mt-1 text-white/70">
                          {role.description}
                        </p>
                      </div>
                      <div 
                        className="flex items-center gap-2 px-3 py-1 rounded-full"
                        style={{ backgroundColor: `${ROLE_COLORS[role.name]}20` }}
                      >
                        <Users className="w-4 h-4" style={{ color: ROLE_COLORS[role.name] }} />
                        <span className="font-medium" style={{ color: ROLE_COLORS[role.name] }}>
                          {role.userCount}
                        </span>
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
                    
                    <div className="mt-3 text-xs text-white/50">
                      Click to view users with this role
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="statistics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="rounded-lg border p-6 bg-neutral-700 border-neutral-600">
                <h3 className="text-lg font-semibold text-white mb-4">Role Distribution</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData.filter(d => d.value > 0)}
                        cx="50%"
                        cy="45%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={false}
                      >
                        {pieChartData.filter(d => d.value > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#404040', 
                          border: '1px solid #525252',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(value: number, name: string) => [`${value} users`, name]}
                      />
                      <Legend 
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value: string) => {
                          const item = pieChartData.find(d => d.name === value);
                          return `${value}: ${item?.value || 0}`;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="rounded-lg border p-6 bg-neutral-700 border-neutral-600">
                <h3 className="text-lg font-semibold text-white mb-4">Users per Role</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#a3a3a3' }}
                        axisLine={{ stroke: '#525252' }}
                      />
                      <YAxis 
                        tick={{ fill: '#a3a3a3' }}
                        axisLine={{ stroke: '#525252' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#404040', 
                          border: '1px solid #525252',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="lg:col-span-2 rounded-lg border p-6 bg-neutral-700 border-neutral-600">
                <h3 className="text-lg font-semibold text-white mb-4">Role Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {roles.map((role) => (
                    <div 
                      key={role.name}
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: `${ROLE_COLORS[role.name]}15` }}
                    >
                      <div 
                        className="text-3xl font-bold"
                        style={{ color: ROLE_COLORS[role.name] }}
                      >
                        {role.userCount}
                      </div>
                      <div className="text-white/70 text-sm mt-1">{role.displayName}s</div>
                      <div className="text-white/50 text-xs mt-1">
                        {roles.reduce((sum, r) => sum + r.userCount, 0) > 0
                          ? `${Math.round((role.userCount / roles.reduce((sum, r) => sum + r.userCount, 0)) * 100)}%`
                          : "0%"
                        } of total
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
              <div className="flex items-center gap-4 flex-1 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    value={activitySearch}
                    onChange={(e) => setActivitySearch(e.target.value)}
                    placeholder="Search activity logs..."
                    className="pl-9 bg-neutral-600 border-neutral-500 text-white placeholder:text-neutral-300"
                  />
                </div>
                <Select value={activityFilter} onValueChange={setActivityFilter}>
                  <SelectTrigger className="w-40 bg-neutral-600 border-neutral-500 text-white">
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
                
                {/* Date Range Filter */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-36 bg-neutral-600 border-neutral-500 text-white"
                    placeholder="From"
                  />
                  <span className="text-white/50">to</span>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-36 bg-neutral-600 border-neutral-500 text-white"
                    placeholder="To"
                  />
                  {(dateFrom || dateTo) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearDateFilters}
                      className="text-white/70 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
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
                              activity.action.includes("delete") || activity.action.includes("remove") ? "text-red-400 border-red-400" :
                              activity.action.includes("create") || activity.action.includes("assign") ? "text-green-400 border-green-400" :
                              activity.action.includes("downgrade") || activity.action.includes("self_demoted") ? "text-yellow-400 border-yellow-400" :
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
