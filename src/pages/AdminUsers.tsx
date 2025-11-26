import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Shield, Mail, Calendar, Search, MoreVertical, Edit, Trash2, Ban, Activity, Clock } from "lucide-react";
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
} from "@/components/ui/dropdown-menu";

interface UserData {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  email?: string;
  projectCount?: number;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    admins: 0,
    owners: 0,
    regular: 0,
  });

  useEffect(() => {
    const checkAccess = async () => {
      const adminAuth = sessionStorage.getItem('admin_authenticated');
      if (adminAuth !== 'true') {
        navigate("/admin/login");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        sessionStorage.removeItem('admin_authenticated');
        navigate("/admin/login");
        return;
      }

      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { data: projects } = await supabase
        .from('projects')
        .select('user_id');

      const projectCounts = projects?.reduce((acc, project) => {
        acc[project.user_id] = (acc[project.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const usersWithEmails = await Promise.all(
        (userRoles || []).map(async (userRole) => {
          const { data: { user } } = await supabase.auth.admin.getUserById(userRole.user_id);
          return {
            ...userRole,
            email: user?.email || 'N/A',
            projectCount: projectCounts[userRole.user_id] || 0,
            last_sign_in_at: user?.last_sign_in_at,
            email_confirmed_at: user?.email_confirmed_at,
          };
        })
      );

      setUsers(usersWithEmails);

      setStats({
        totalUsers: usersWithEmails.length,
        admins: usersWithEmails.filter(u => u.role === 'admin').length,
        owners: usersWithEmails.filter(u => u.role === 'owner').length,
        regular: usersWithEmails.filter(u => u.role === 'user').length,
      });

      setLoading(false);
    };

    checkAccess();
  }, [navigate, toast]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return { bg: '#4CB3FF30', text: '#4CB3FF', border: '#4CB3FF50' };
      case 'admin':
        return { bg: '#10B98130', text: '#10B981', border: '#10B98150' };
      case 'moderator':
        return { bg: '#F59E0B30', text: '#F59E0B', border: '#F59E0B50' };
      default:
        return { bg: '#6B728030', text: '#9CA3AF', border: '#6B728050' };
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-neutral-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-800 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-50">
          User Management
        </h1>
        <p className="text-sm mt-1 text-neutral-400">
          Manage all registered users and their roles
        </p>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg border p-4" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "#8FA3B7" }}>Total Users</p>
                <p className="text-2xl font-bold mt-1" style={{ color: "#D6E4F0" }}>
                  {stats.totalUsers}
                </p>
              </div>
              <div className="p-2 rounded-lg" style={{ background: "#4CB3FF20" }}>
                <Users className="w-5 h-5" style={{ color: "#4CB3FF" }} />
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "#8FA3B7" }}>Owners</p>
                <p className="text-2xl font-bold mt-1" style={{ color: "#D6E4F0" }}>
                  {stats.owners}
                </p>
              </div>
              <div className="p-2 rounded-lg" style={{ background: "#4CB3FF20" }}>
                <Shield className="w-5 h-5" style={{ color: "#4CB3FF" }} />
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "#8FA3B7" }}>Admins</p>
                <p className="text-2xl font-bold mt-1" style={{ color: "#D6E4F0" }}>
                  {stats.admins}
                </p>
              </div>
              <div className="p-2 rounded-lg" style={{ background: "#10B98120" }}>
                <Shield className="w-5 h-5" style={{ color: "#10B981" }} />
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "#8FA3B7" }}>Regular Users</p>
                <p className="text-2xl font-bold mt-1" style={{ color: "#D6E4F0" }}>
                  {stats.regular}
                </p>
              </div>
              <div className="p-2 rounded-lg" style={{ background: "#6B728020" }}>
                <Users className="w-5 h-5" style={{ color: "#9CA3AF" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "#8FA3B7" }} />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border h-9 text-sm"
            style={{ background: "#0B111A", borderColor: "#ffffff15", color: "#D6E4F0" }}
          />
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "#ffffff15" }}>
              <TableHead style={{ color: "#8FA3B7" }}>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
              </TableHead>
              <TableHead style={{ color: "#8FA3B7" }}>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Role
                </div>
              </TableHead>
              <TableHead style={{ color: "#8FA3B7" }}>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Status
                </div>
              </TableHead>
              <TableHead style={{ color: "#8FA3B7" }}>Projects</TableHead>
              <TableHead style={{ color: "#8FA3B7" }}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Last Active
                </div>
              </TableHead>
              <TableHead style={{ color: "#8FA3B7" }}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined
                </div>
              </TableHead>
              <TableHead style={{ color: "#8FA3B7" }} className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => {
              const roleColors = getRoleBadgeColor(user.role);
              const isActive = user.email_confirmed_at;
              const lastActive = user.last_sign_in_at 
                ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'Never';
              
              return (
                <TableRow key={user.id} style={{ borderColor: "#ffffff15" }} className="hover:bg-[#ffffff05]">
                  <TableCell style={{ color: "#D6E4F0" }} className="font-medium">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium border"
                      style={{
                        background: roleColors.bg,
                        color: roleColors.text,
                        borderColor: roleColors.border,
                      }}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ background: isActive ? "#10B981" : "#6B7280" }}
                      />
                      <span style={{ color: isActive ? "#10B981" : "#6B7280" }} className="text-sm">
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell style={{ color: "#8FA3B7" }}>
                    {user.projectCount}
                  </TableCell>
                  <TableCell style={{ color: "#8FA3B7" }} className="text-sm">
                    {lastActive}
                  </TableCell>
                  <TableCell style={{ color: "#8FA3B7" }} className="text-sm">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-[#ffffff10]"
                          style={{ color: "#D6E4F0" }}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border z-50"
                        style={{ background: "#0B111A", borderColor: "#ffffff15" }}
                      >
                        <DropdownMenuItem
                          className="hover:bg-[#ffffff10] cursor-pointer"
                          style={{ color: "#D6E4F0" }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-[#ffffff10] cursor-pointer"
                          style={{ color: "#F59E0B" }}
                        >
                          <Ban className="w-4 h-4 mr-2" />
                          Suspend User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-[#ffffff10] cursor-pointer"
                          style={{ color: "#EF4444" }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4" style={{ color: "#8FA3B7" }} />
            <p style={{ color: "#8FA3B7" }}>
              {searchQuery ? "No users found matching your search" : "No users found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
