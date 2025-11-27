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
  ChevronDown,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotesPanel } from "@/components/admin/NotesPanel";

const MENU_ITEMS = [
  { id: "dashboard", path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", path: "/admin/users", label: "Users", icon: Users },
  { id: "projects", path: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { id: "support", path: "/admin/support", label: "Support", icon: MessageCircle },
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

      // For now, treat any authenticated user with admin session as admin.
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
      <div className="h-screen flex items-center justify-center bg-neutral-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-400"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const currentPath = location.pathname;

  return (
    <div className="h-screen flex flex-col bg-neutral-800 overflow-hidden">
      {/* Fixed Top Bar */}
      <header className="h-14 border-b border-neutral-700 bg-neutral-800 flex items-center justify-between px-4 md:px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg bg-neutral-700 text-white hover:bg-neutral-600"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-neutral-700">
            <LayoutDashboard className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">UR-DEV Admin Panel</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NotesPanel />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all hover:bg-neutral-700">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium bg-neutral-700 text-white">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline text-sm text-white">{userEmail}</span>
                <ChevronDown className="h-4 w-4 text-white hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-neutral-700 border-neutral-600">
              <DropdownMenuLabel className="text-white">
                <div className="flex flex-col">
                  <span className="font-medium">My Account</span>
                  <span className="text-xs text-white/70 font-normal">{userEmail}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-neutral-600" />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-red-400 hover:text-red-300 hover:bg-neutral-600 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out border-r border-neutral-700 bg-neutral-800 pt-14 md:pt-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          {/* Navigation */}
          <nav className="py-3 text-[14px] overflow-y-auto h-full">
            <div className="px-5 text-[12px] font-medium uppercase tracking-[0.14em] text-white/50 mb-1">
              Navigation
            </div>
            <ul>
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path || (item.path === "/admin/dashboard" && currentPath === "/admin");
                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                        isActive
                          ? "bg-neutral-700 text-white"
                          : "text-white/70 hover:bg-neutral-700/70 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content - scrollable area */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-neutral-800">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
