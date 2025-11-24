import React, { useState } from "react";
import {
  Settings,
  Globe2,
  Smartphone,
  Monitor,
  Database,
  Github,
  Cloud,
  Shield,
  Trash2,
  ChevronRight,
  Users,
  Layers,
  Activity,
  Edit3,
} from "lucide-react";

type NavItemId =
  | "project-settings"
  | "domains"
  | "knowledge"
  | "memory"
  | "workspace-main"
  | "people"
  | "plans-credits"
  | "cloud-ai-balance"
  | "privacy-security"
  | "account-main"
  | "labs"
  | "integrations-main"
  | "supabase"
  | "github";

interface NavItem {
  id: NavItemId;
  label: string;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Project",
    items: [
      { id: "project-settings", label: "Project settings" },
      { id: "domains", label: "Domains" },
      { id: "knowledge", label: "Knowledge" },
      { id: "memory", label: "Memory" },
    ],
  },
  {
    label: "Workspace",
    items: [
      { id: "workspace-main", label: "Andi's UR-DEV" },
      { id: "people", label: "People" },
      { id: "plans-credits", label: "Plans & credits" },
      { id: "cloud-ai-balance", label: "Cloud & AI balance" },
      { id: "privacy-security", label: "Privacy & security" },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "account-main", label: "Andi" },
      { id: "labs", label: "Labs" },
    ],
  },
  {
    label: "Integrations",
    items: [
      { id: "integrations-main", label: "Integrations" },
      { id: "supabase", label: "Supabase" },
      { id: "github", label: "GitHub" },
    ],
  },
];

const ProjectSettingsPage: React.FC = () => {
  const [activeItem, setActiveItem] = useState<NavItemId>("project-settings");
  const [visibility, setVisibility] = useState<"private" | "workspace" | "public">("workspace");
  const [targets, setTargets] = useState({
    web: true,
    ios: true,
    android: true,
    desktop: false,
  });
  const [hideBadge, setHideBadge] = useState(false);

  // Project name + rename modal state
  const [projectName, setProjectName] = useState("Strict Implementation");
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [draftName, setDraftName] = useState(projectName);

  const toggleTarget = (key: keyof typeof targets) => {
    setTargets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openRenameModal = () => {
    setDraftName(projectName);
    setIsRenameOpen(true);
  };

  const closeRenameModal = () => {
    setIsRenameOpen(false);
  };

  const handleSaveRename = () => {
    const trimmed = draftName.trim();
    if (!trimmed) return;
    setProjectName(trimmed);
    setIsRenameOpen(false);
  };

  return (
    <>
    <div className="w-full h-full rounded-2xl border border-neutral-700 bg-neutral-950 shadow-[0_0_120px_rgba(15,23,42,0.85)] flex overflow-hidden">
          {/* Left sidebar */}
          <aside className="w-72 border-r border-neutral-800 bg-neutral-950/95">
            <nav className="py-3 text-[14px] overflow-y-auto h-full">
              {NAV_GROUPS.map((group) => (
                <div key={group.label} className="mt-2">
                  <div className="px-5 text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-500">
                    {group.label}
                  </div>
                  <ul className="mt-1">
                    {group.items.map((item) => {
                      const active = item.id === activeItem;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => setActiveItem(item.id)}
                            className={`group flex w-full items-center justify-between px-5 py-2.5 text-left ${
                              active
                                ? "bg-neutral-900 text-neutral-50"
                                : "text-neutral-300 hover:bg-neutral-900/70 hover:text-neutral-50"
                            }`}
                          >
                            <span>{item.label}</span>
                            <span className="flex items-center gap-2">
                              {item.badge && (
                                <span className="rounded-full bg-neutral-800 px-2 py-[2px] text-[10px] text-neutral-300">
                                  {item.badge}
                                </span>
                              )}
                              <ChevronRight className="h-3 w-3 text-neutral-500 group-hover:text-neutral-300" />
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Right content */}
          <main className="flex-1 bg-neutral-950 px-8 py-6 overflow-y-auto">
            {/* Top header */}
            <header className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
              <div>
                <h1 className="text-xl font-semibold text-neutral-50">Project settings</h1>
                <p className="mt-1 text-xs text-neutral-400">
                  Manage your project details, visibility, and preferences.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-neutral-400">
                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-2 py-1 border border-neutral-700">
                  <Activity className="h-3 w-3 text-emerald-400" />
                  Live workspace
                </span>
              </div>
            </header>

            {/* Main sections */}
            <div className="space-y-6 text-[14px] pb-4">
              {/* Overview */}
              <section className="rounded-xl border border-neutral-800 bg-neutral-900">
                <div className="border-b border-neutral-800 px-5 py-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-neutral-100">Overview</h2>
                    <p className="text-[12px] text-neutral-400">
                      Core project details that appear in URLs, previews, and dashboards.
                    </p>
                  </div>
                </div>
                <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-[12px] text-neutral-400">Display name</div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-neutral-100">{projectName}</span>
                      <button
                        type="button"
                        onClick={openRenameModal}
                        className="inline-flex items-center justify-center rounded-full border border-neutral-700 bg-neutral-950 p-1.5 hover:bg-neutral-800 hover:border-neutral-500 text-neutral-300"
                        aria-label="Rename project"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[12px] text-neutral-400">URL subdomain</div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-neutral-100">strict-as-is-protocol</span>
                      <button className="text-[12px] text-sky-400 hover:text-sky-300">Copy</button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[12px] text-neutral-400">Owner</div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-neutral-400" />
                      <span className="text-sm text-neutral-100">Andi</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[12px] text-neutral-400">Created at</div>
                    <div className="text-sm text-neutral-100">2025-11-23 08:11:22</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[12px] text-neutral-400">Messages count</div>
                    <div className="text-sm text-neutral-100">195</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[12px] text-neutral-400">AI edits count</div>
                    <div className="text-sm text-neutral-100">163</div>
                  </div>
                </div>
              </section>

              {/* Visibility & workspace */}
              <section className="rounded-xl border border-neutral-800 bg-neutral-900">
                <div className="border-b border-neutral-800 px-5 py-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-neutral-100">Project visibility</h2>
                    <p className="text-[12px] text-neutral-400">
                      Keep your project hidden and prevent others from remixing it.
                    </p>
                  </div>
                </div>
                <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Visibility options */}
                  <div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-[13px]">
                        <input
                          type="radio"
                          className="h-3 w-3 accent-sky-500"
                          checked={visibility === "private"}
                          onChange={() => setVisibility("private")}
                        />
                        <div>
                          <div className="text-neutral-100">Private</div>
                          <div className="text-[12px] text-neutral-400">Only you can open this project.</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-[13px]">
                        <input
                          type="radio"
                          className="h-3 w-3 accent-sky-500"
                          checked={visibility === "workspace"}
                          onChange={() => setVisibility("workspace")}
                        />
                        <div>
                          <div className="text-neutral-100">Workspace</div>
                          <div className="text-[12px] text-neutral-400">Visible to members of this workspace.</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-[13px]">
                        <input
                          type="radio"
                          className="h-3 w-3 accent-sky-500"
                          checked={visibility === "public"}
                          onChange={() => setVisibility("public")}
                        />
                        <div>
                          <div className="flex items-center gap-1 text-neutral-100">
                            <Globe2 className="h-3 w-3" />
                            <span>Public</span>
                          </div>
                          <div className="text-[12px] text-neutral-400">
                            Anyone with the link can view your published app.
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Workspace + category + badge */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-[12px] text-neutral-400">Workspace</div>
                      <button className="flex items-center justify-between w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-[13px] text-neutral-100">
                        <span>Andi&apos;s UR-DEV workspace</span>
                        <ChevronRight className="h-3 w-3 text-neutral-500" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[12px] text-neutral-400">Project category</div>
                      <button className="flex items-center justify-between w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-[13px] text-neutral-100">
                        <span>Select category</span>
                        <ChevronRight className="h-3 w-3 text-neutral-500" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-neutral-100 text-[14px]">Hide &quot;UR-DEV&quot; badge</div>
                        <div className="text-[12px] text-neutral-400">
                          Remove the &quot;Edit with UR-DEV&quot; badge from your published work.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHideBadge((v) => !v)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
                          hideBadge ? "bg-sky-500 border-sky-400" : "bg-neutral-900 border-neutral-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            hideBadge ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Build targets */}
              <section className="rounded-xl border border-neutral-800 bg-neutral-900">
                <div className="border-b border-neutral-800 px-5 py-3">
                  <h2 className="text-sm font-semibold text-neutral-100">Build targets</h2>
                  <p className="text-[12px] text-neutral-400">
                    Choose which platforms this project should generate: web, mobile, or desktop.
                  </p>
                </div>
                <div className="px-5 py-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => toggleTarget("web")}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] ${
                        targets.web
                          ? "border-sky-500 bg-neutral-900 text-sky-100"
                          : "border-neutral-700 bg-neutral-950 text-neutral-300"
                      }`}
                    >
                      <Monitor className="h-3.5 w-3.5" />
                      <span>Web app</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleTarget("ios")}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] ${
                        targets.ios
                          ? "border-sky-500 bg-neutral-900 text-sky-100"
                          : "border-neutral-700 bg-neutral-950 text-neutral-300"
                      }`}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      <span>iOS app</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleTarget("android")}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] ${
                        targets.android
                          ? "border-sky-500 bg-neutral-900 text-sky-100"
                          : "border-neutral-700 bg-neutral-950 text-neutral-300"
                      }`}
                    >
                      <Smartphone className="h-3.5 w-3.5 rotate-180" />
                      <span>Android app</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleTarget("desktop")}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] ${
                        targets.desktop
                          ? "border-sky-500 bg-neutral-900 text-sky-100"
                          : "border-neutral-700 bg-neutral-950 text-neutral-300"
                      }`}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>Desktop shell</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Connected services */}
              <section className="rounded-xl border border-neutral-800 bg-neutral-900">
                <div className="border-b border-neutral-800 px-5 py-3">
                  <h2 className="text-sm font-semibold text-neutral-100">Connected services</h2>
                  <p className="text-[12px] text-neutral-400">
                    Manage databases, auth, and code hosting linked to this project.
                  </p>
                </div>
                <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-[13px]">
                  <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-emerald-400" />
                      <div>
                        <div className="text-neutral-100">Primary database</div>
                        <div className="text-[12px] text-neutral-400">Supabase · eu-central-1</div>
                      </div>
                    </div>
                    <button className="text-[12px] text-sky-400 hover:text-sky-300">Manage</button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4 text-neutral-100" />
                      <div>
                        <div className="text-neutral-100">Source control</div>
                        <div className="text-[12px] text-neutral-400">Connected to GitHub</div>
                      </div>
                    </div>
                    <button className="text-[12px] text-sky-400 hover:text-sky-300">View repo</button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-sky-400" />
                      <div>
                        <div className="text-neutral-100">Deploy targets</div>
                        <div className="text-[12px] text-neutral-400">Preview &amp; production environments</div>
                      </div>
                    </div>
                    <button className="text-[12px] text-sky-400 hover:text-sky-300">Configure</button>
                  </div>
                </div>
              </section>

              {/* Project actions */}
              <section className="rounded-xl border border-neutral-800 bg-neutral-900">
                <div className="border-b border-neutral-800 px-5 py-3">
                  <h2 className="text-sm font-semibold text-neutral-100">Project actions</h2>
                </div>
                <div className="px-5 py-4 space-y-3 text-[13px]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-neutral-100">Rename project</div>
                      <div className="text-[12px] text-neutral-400">
                        Update how this project appears in your workspace.
                      </div>
                    </div>
                    <button
                      className="rounded-md border border-neutral-700 px-3 py-1.5 text-[12px] text-neutral-100 hover:bg-neutral-900"
                      type="button"
                      onClick={openRenameModal}
                    >
                      Rename
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-neutral-100">Remix project</div>
                      <div className="text-[12px] text-neutral-400">Duplicate this app in a new project.</div>
                    </div>
                    <button className="rounded-md border border-neutral-700 px-3 py-1.5 text-[12px] text-neutral-100 hover:bg-neutral-900">
                      Remix
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-neutral-100">Transfer</div>
                      <div className="text-[12px] text-neutral-400">Move this project to a different workspace.</div>
                    </div>
                    <button className="rounded-md border border-neutral-700 px-3 py-1.5 text-[12px] text-neutral-100 hover:bg-neutral-900">
                      Transfer
                    </button>
                  </div>
                </div>
              </section>

              {/* Danger zone */}
              <section className="rounded-xl border border-neutral-800 bg-neutral-900">
                <div className="border-b border-neutral-800 px-5 py-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-400" />
                  <h2 className="text-sm font-semibold text-neutral-100">Danger zone</h2>
                </div>
                <div className="px-5 py-4 space-y-3 text-[13px]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-neutral-100">Disable analytics</div>
                      <div className="text-[12px] text-neutral-400">
                        Disable collecting analytics data for this project.
                      </div>
                    </div>
                    <button className="rounded-md border border-neutral-700 px-3 py-1.5 text-[12px] text-neutral-100 hover:bg-neutral-900">
                      Disable
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-neutral-100">Unpublish project</div>
                      <div className="text-[12px] text-neutral-400">Remove public access to this project.</div>
                    </div>
                    <button className="rounded-md border border-amber-500/70 px-3 py-1.5 text-[12px] text-amber-300 hover:bg-amber-500/10">
                      Unpublish
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-red-400">
                        <Trash2 className="h-4 w-4" />
                        <span>Delete project</span>
                      </div>
                      <div className="text-[12px] text-neutral-400">Permanently delete this project.</div>
                    </div>
                    <button className="rounded-md border border-red-500 px-3 py-1.5 text-[12px] text-red-400 hover:bg-red-500/10">
                      Delete
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>

      {/* Rename project modal */}
      {isRenameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl border border-neutral-700 bg-neutral-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3">
              <div>
                <h2 className="text-sm font-semibold text-neutral-50">Rename project</h2>
                <p className="text-[12px] text-neutral-400">Update the name shown in your UR-DEV workspace.</p>
              </div>
              <button
                type="button"
                onClick={closeRenameModal}
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
                aria-label="Close rename dialog"
              >
                ✕
              </button>
            </div>
            <div className="px-5 pt-4 pb-3 space-y-3">
              <div className="space-y-1">
                <label htmlFor="project-name-input" className="text-[12px] text-neutral-400">
                  Project name
                </label>
                <input
                  id="project-name-input"
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  maxLength={100}
                  autoFocus
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-neutral-800 px-5 py-3">
              <button
                type="button"
                onClick={closeRenameModal}
                className="rounded-md border border-neutral-700 px-3 py-1.5 text-[12px] text-neutral-200 hover:bg-neutral-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRename}
                disabled={!draftName.trim()}
                className={`rounded-md px-3 py-1.5 text-[12px] font-medium ${
                  draftName.trim()
                    ? "bg-sky-500 text-white hover:bg-sky-400"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectSettingsPage;
