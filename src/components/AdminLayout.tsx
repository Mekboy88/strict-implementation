import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  LogOut,
  LayoutDashboard,
  FolderOpen,
  UserCog,
  Activity,
  MessageSquare,
  BarChart3,
  Zap,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import yrDevLogo from "@/assets/yr-dev-logo.png";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const adminAuth = sessionStorage.getItem("admin_authenticated");
        if (adminAuth !== "true") {
          navigate("/admin/login");
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          sessionStorage.removeItem("admin_authenticated");
          navigate("/admin/login");
          return;
        }

        const { data: roleData, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .in("role", ["owner", "admin"])
          .maybeSingle();

        if (error || !roleData) {
          sessionStorage.removeItem("admin_authenticated");
          navigate("/admin/login");
          return;
        }

        setUserRole(roleData.role);
        setUserEmail(session.user.email || "");
      } catch (error: any) {
        sessionStorage.removeItem("admin_authenticated");
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("admin_authenticated");
    navigate("/admin/login");
    toast({
      title: "Logged out successfully",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-2xl font-bold">Loading...</div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Users", url: "/admin/users", icon: UserCog },
    { title: "Projects", url: "/admin/projects", icon: FolderOpen },
    { title: "Roles", url: "/admin/roles", icon: Shield },
    { title: "Security", url: "/admin/security", icon: Shield },
    { title: "System", url: "/admin/system-monitoring", icon: Activity },
    { title: "Communication", url: "/admin/communication", icon: MessageSquare },
    { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
    { title: "Advanced", url: "/admin/advanced", icon: Zap },
    { title: "Settings", url: "/admin/settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r border-ide-border">
          <div className="p-4 border-b border-ide-border">
            <img src={yrDevLogo} alt="UR-DEV" className="h-8" />
            <p className="text-xs text-muted-foreground mt-2">Admin Panel</p>
          </div>

          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <div className="mt-auto p-4 border-t border-ide-border">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="font-medium">{userEmail}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between px-6 border-b border-ide-border bg-background">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Admin Panel</span>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
