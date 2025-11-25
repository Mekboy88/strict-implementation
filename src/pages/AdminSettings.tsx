import React from "react";
import {
  Settings,
  LayoutDashboard,
  Users,
  FolderGit2,
  Shield,
  Cog,
  MessageCircle,
  Activity,
  Layers,
  SlidersHorizontal,
  Sun,
  Moon,
} from "lucide-react";

// EXTREMELY CLEAN PURE GREY THEME — NO BLUE, NO BLACK, NO COLOR
// EVERYTHING IS PURE GREY SHADES ONLY
// Sidebar + Top Bar + Main Area all grey
// Theme toggle switches between LIGHT GREY and DARK GREY (no colors)

const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "roles", label: "Roles", icon: Layers },
  { id: "security", label: "Security", icon: Shield },
  { id: "system", label: "System", icon: Activity },
  { id: "communication", label: "Communication", icon: MessageCircle },
  { id: "analytics", label: "Analytics", icon: Activity },
  { id: "advanced", label: "Advanced", icon: SlidersHorizontal },
  { id: "settings", label: "Settings", icon: Cog },
];

const AdminSettingsPage: React.FC = () => {
  const [active, setActive] = React.useState<string>("dashboard");
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  const activeItem = MENU_ITEMS.find((item) => item.id === active) ?? MENU_ITEMS[0];
  const isDark = theme === "dark";

  // PURE GREY SHADES ONLY
  const grey = {
    lightBg: "bg-[#f2f2f2] text-[#000000]", // light grey
    darkBg: "bg-[#3a3a3a] text-[#f2f2f2]", // dark grey
    sidebarLight: "bg-[#ffffff] text-[#1a1a1a] border-[#e8e8e8]",
    sidebarDark: "bg-[#2a2a2a] text-[#f2f2f2] border-[#555]",
    cardLight: "bg-[#f8f8f8] border-[#c7c7c7]",
    cardDark: "bg-[#4a4a4a] border-[#606060]",
  };

  return (
    <div className={`min-h-screen w-full flex ${isDark ? grey.darkBg : grey.lightBg}`}>
      {/* SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col w-64 border-r
          ${isDark ? grey.sidebarDark : grey.sidebarLight}
        `}
      >
        {/* HEADER */}
        <div className="h-14 flex items-center gap-2 px-4 border-b border-inherit/60">
          <div className="h-8 w-8 rounded-lg bg-[#ffffff20] flex items-center justify-center">
            <Settings className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs tracking-widest opacity-60">ADMIN</span>
            <span className="text-sm font-semibold">Settings Panel</span>
          </div>
        </div>

        {/* SIDEBAR BUTTONS */}
        <nav className="flex-1 py-3 px-2 flex flex-col gap-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all
                  ${
                    isActive
                      ? isDark
                        ? "bg-[#ffffff20] text-[#f2f2f2] shadow-none"
                        : "bg-[#f5f5f5] text-[#000000] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
                      : isDark
                        ? "opacity-80 hover:opacity-100"
                        : "opacity-80 hover:bg-[#f3f3f3]"
                  }
                `}
              >
                <span className={`w-7 h-7 flex items-center justify-center rounded-md border border-[#a0a0a0]`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="h-12 border-t border-inherit/60 flex items-center justify-between px-4 text-xs opacity-70">
          <span>UR-DEV Admin</span>
          <span>v1.0</span>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR */}
        <header
          className={`h-14 flex items-center justify-between px-4 md:px-6 border-b
            ${isDark ? "bg-[#2f2f2f] border-[#555]" : "bg-[#ffffff] border-[#e8e8e8]"}
          `}
        >
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold">Admin Settings</h1>
          </div>

          {/* THEME BUTTON */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 border text-xs transition-all
              ${
                isDark
                  ? "bg-[#3f3f3f] border-[#6a6a6a] text-[#f2f2f2] hover:bg-[#4a4a4a]"
                  : "bg-[#f6f6f6] border-[#d5d5d5] text-[#000000] hover:bg-[#ebebeb]"
              }
            `}
          >
            {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
            {isDark ? "Dark Grey" : "Light Grey"}
          </button>
        </header>

        {/* CONTENT */}
        <section className="flex-1 flex items-center justify-center px-4 md:px-8 py-6">
          <div
            className={`w-full max-w-2xl rounded-xl border shadow-inner
              ${isDark ? grey.cardDark : grey.cardLight}
            `}
          >
            <div className="p-8 flex flex-col items-center text-center gap-3">
              <span className="text-xs opacity-60">{activeItem.label} page</span>
              <h2 className="text-lg font-semibold">Empty {activeItem.label} page</h2>
              <p className="text-xs opacity-60 max-w-md">
                Grey-only theme. No colors. No blue. No black. Everything is pure multi‑tone grey for a clean
                professional UI.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminSettingsPage;
