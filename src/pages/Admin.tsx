import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, LayoutDashboard, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalOwners: 0,
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Check admin authentication flag
        const adminAuth = sessionStorage.getItem('admin_authenticated');
        if (adminAuth !== 'true') {
          toast({
            title: "Access Denied",
            description: "Please authenticate through admin login.",
            variant: "destructive",
          });
          navigate("/admin/login");
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          sessionStorage.removeItem('admin_authenticated');
          toast({
            title: "Session Expired",
            description: "Please log in again.",
            variant: "destructive",
          });
          navigate("/admin/login");
          return;
        }

        // Check if user has admin or owner role
        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .in('role', ['owner', 'admin'])
          .maybeSingle();

        if (error || !roleData) {
          sessionStorage.removeItem('admin_authenticated');
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
          navigate("/admin/login");
          return;
        }

        setIsAdmin(true);
        setUserRole(roleData.role);
        setUserEmail(session.user.email || "");

        // Fetch statistics
        const { data: users } = await supabase
          .from('user_roles')
          .select('role');

        if (users) {
          setStats({
            totalUsers: users.length,
            totalAdmins: users.filter(u => u.role === 'admin').length,
            totalOwners: users.filter(u => u.role === 'owner').length,
          });
        }
      } catch (error: any) {
        sessionStorage.removeItem('admin_authenticated');
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleSignOut = async () => {
    try {
      sessionStorage.removeItem('admin_authenticated');
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of the admin panel.",
      });
      navigate("/admin/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getInitial = () => {
    if (!userEmail) return "A";
    return userEmail.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #06080D, #0B111A)" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: "#4CB3FF" }}></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex" style={{ background: "linear-gradient(180deg, #06080D, #0B111A)" }}>
        {/* Left Sidebar */}
        <Sidebar collapsible="icon" className="border-r" style={{ borderColor: "#ffffff15", background: "#06080D" }}>
          <SidebarContent className="pt-4">
            <div className="px-3 mb-4">
              <SidebarTrigger className="hover:bg-[#ffffff10] transition-colors" />
            </div>
            
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate('/admin/dashboard')}
                  className="hover:bg-[#ffffff10] transition-colors"
                  style={{ color: "#D6E4F0" }}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate('/admin/users')}
                  className="hover:bg-[#ffffff10] transition-colors"
                  style={{ color: "#D6E4F0" }}
                >
                  <Users className="w-5 h-5" />
                  <span>User Management</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b" style={{ borderColor: "#ffffff15" }}>
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: "#D6E4F0" }}>
                    Admin Dashboard
                  </h1>
                  <p className="text-sm mt-1" style={{ color: "#8FA3B7" }}>
                    Platform Administration & Settings
                  </p>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 hover:opacity-80"
                    style={{ background: "#4CB3FF", color: "#ffffff" }}
                  >
                    {getInitial()}
                  </button>

                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 rounded-lg border shadow-lg z-50"
                      style={{ background: "#0B111A", borderColor: "#ffffff15" }}
                    >
                      <div className="p-3 border-b" style={{ borderColor: "#ffffff15" }}>
                        <p className="text-xs" style={{ color: "#8FA3B7" }}>Signed in as</p>
                        <p className="text-sm font-medium truncate" style={{ color: "#D6E4F0" }}>
                          {userEmail}
                        </p>
                        <div className="flex items-center gap-2 mt-1 px-2 py-1 rounded" style={{ background: "#4CB3FF20" }}>
                          <Shield className="w-3 h-3" style={{ color: "#4CB3FF" }} />
                          <span className="text-xs" style={{ color: "#4CB3FF" }}>
                            {userRole === 'owner' ? 'Platform Owner' : 'Administrator'}
                          </span>
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-[#ffffff10]"
                          style={{ color: "#D6E4F0" }}
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 px-6 py-12">
            {/* Admin dashboard content area */}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
