import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  Shield,
  Cog,
  MessageCircle,
  Activity,
  Layers,
  SlidersHorizontal,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const MENU_ITEMS = [
  { id: "dashboard", path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", path: "/admin/users", label: "Users", icon: Users },
  { id: "projects", path: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { id: "roles", path: "/admin/roles", label: "Roles", icon: Layers },
  { id: "security", path: "/admin/security", label: "Security", icon: Shield },
  { id: "system", path: "/admin/system-monitoring", label: "System", icon: Activity },
  { id: "communication", path: "/admin/communication", label: "Communication", icon: MessageCircle },
  { id: "analytics", path: "/admin/analytics", label: "Analytics", icon: Activity },
  { id: "advanced", path: "/admin/advanced", label: "Advanced", icon: SlidersHorizontal },
  { id: "settings", path: "/admin/settings", label: "Settings", icon: Cog },
];

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = sessionStorage.getItem("admin_authenticated");
      if (!isAuthenticated) {
        navigate("/admin/login");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (!roleData || !["owner", "admin"].includes(roleData.role)) {
        navigate("/admin/login");
        return;
      }

      setUserEmail(session.user.email || "");
      setIsAdmin(true);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("admin_authenticated");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0f18" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: "#4CB3FF" }}></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0f18" }}>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{ background: "#1a2332", color: "#D6E4F0" }}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{ background: "#0d1421", borderRight: "1px solid #ffffff10" }}
      >
        {/* Header */}
        <div className="h-16 flex items-center gap-3 px-4" style={{ borderBottom: "1px solid #ffffff10" }}>
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ background: "#4CB3FF20" }}
          >
            <LayoutDashboard className="h-5 w-5" style={{ color: "#4CB3FF" }} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs tracking-wider" style={{ color: "#8FA3B7" }}>ADMIN</span>
            <span className="text-sm font-semibold" style={{ color: "#D6E4F0" }}>UR-DEV Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path === "/admin/dashboard" && currentPath === "/admin");
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all`}
                style={{
                  background: isActive ? "#4CB3FF15" : "transparent",
                  color: isActive ? "#4CB3FF" : "#8FA3B7",
                }}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4" style={{ borderTop: "1px solid #ffffff10" }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium"
              style={{ background: "#4CB3FF20", color: "#4CB3FF" }}
            >
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs truncate" style={{ color: "#D6E4F0" }}>{userEmail}</p>
              <p className="text-xs" style={{ color: "#8FA3B7" }}>Admin</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
            style={{ background: "#ffffff08", color: "#8FA3B7" }}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
