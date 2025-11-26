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
        return 'bg-blue-500/30 text-blue-400 border-blue-500/50';
      case 'admin':
        return 'bg-green-500/30 text-green-400 border-green-500/50';
      case 'moderator':
        return 'bg-yellow-500/30 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-neutral-500/30 text-white border-neutral-500/50';
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
    <div className="h-full bg-neutral-800 p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          User Management
        </h1>
        <p className="text-sm mt-1 text-white">
          Manage all registered users and their roles
        </p>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg border p-4 bg-neutral-700 border-neutral-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Total Users</p>
                <p className="text-2xl font-bold mt-1 text-white">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4 bg-neutral-700 border-neutral-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Owners</p>
                <p className="text-2xl font-bold mt-1 text-white">
                  {stats.owners}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4 bg-neutral-700 border-neutral-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Admins</p>
                <p className="text-2xl font-bold mt-1 text-white">
                  {stats.admins}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-500/20">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4 bg-neutral-700 border-neutral-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Regular Users</p>
                <p className="text-2xl font-bold mt-1 text-white">
                  {stats.regular}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-neutral-500/20">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border h-9 text-sm bg-neutral-700 border-neutral-600 text-white"
          />
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden bg-neutral-700 border-neutral-600">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-600">
              <TableHead className="text-white">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
              </TableHead>
              <TableHead className="text-white">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Role
                </div>
              </TableHead>
              <TableHead className="text-white">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Status
                </div>
              </TableHead>
              <TableHead className="text-white">Projects</TableHead>
              <TableHead className="text-white">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Last Active
                </div>
              </TableHead>
              <TableHead className="text-white">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined
                </div>
              </TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => {
              const isActive = user.email_confirmed_at;
              const lastActive = user.last_sign_in_at 
                ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'Never';
              
              return (
                <TableRow key={user.id} className="border-neutral-600 hover:bg-neutral-600/50">
                  <TableCell className="text-white font-medium">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-neutral-500'}`}
                      />
                      <span className={`text-sm ${isActive ? 'text-green-400' : 'text-white'}`}>
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    {user.projectCount}
                  </TableCell>
                  <TableCell className="text-white text-sm">
                    {lastActive}
                  </TableCell>
                  <TableCell className="text-white text-sm">
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
                          className="hover:bg-neutral-600 text-white"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border z-50 bg-neutral-700 border-neutral-600"
                      >
                        <DropdownMenuItem
                          className="hover:bg-neutral-600 cursor-pointer text-white"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-neutral-600 cursor-pointer text-yellow-400"
                        >
                          <Ban className="w-4 h-4 mr-2" />
                          Suspend User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-neutral-600 cursor-pointer text-red-400"
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
            <Users className="w-12 h-12 mx-auto mb-4 text-white" />
            <p className="text-white">
              {searchQuery ? "No users found matching your search" : "No users found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;