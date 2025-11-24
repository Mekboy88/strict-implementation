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
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-100">{projectName}</span>
                      <button
                        type="button"
                        onClick={openRenameModal}
                        className="inline-flex items-center justify-center p-0.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-300"
                        aria-label="Rename project"
                      >
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 503.322 503.322" xmlns="http://www.w3.org/2000/svg">
                          <path d="M130.169,483.029h-17.356c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C138.847,486.908,134.968,483.029,130.169,483.029z"></path>
                          <path d="M182.237,483.029h-17.356c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C190.915,486.908,187.036,483.029,182.237,483.029z"></path>
                          <path d="M78.102,483.029H60.746c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C86.78,486.908,82.901,483.029,78.102,483.029z"></path>
                          <path d="M26.034,483.029H8.678c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C34.712,486.908,30.833,483.029,26.034,483.029z"></path>
                          <path d="M442.576,483.029H425.22c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C451.254,486.908,447.375,483.029,442.576,483.029z"></path>
                          <path d="M494.644,483.029h-17.356c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C503.322,486.908,499.443,483.029,494.644,483.029z"></path>
                          <path d="M390.508,483.029h-17.356c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C399.186,486.908,395.307,483.029,390.508,483.029z"></path>
                          <path d="M338.441,483.029h-17.356c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C347.119,486.908,343.24,483.029,338.441,483.029z"></path>
                          <path d="M286.373,483.029h-17.356c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C295.051,486.908,291.172,483.029,286.373,483.029z"></path>
                          <path d="M234.305,483.029h-17.356c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C242.983,486.908,239.104,483.029,234.305,483.029z"></path>
                          <path d="M446.763,23.707c-26.745-26.719-70.821-27.822-96.273-2.36l-13.781,13.781l98.174,98.174l13.798-13.789 c11.924-11.915,18.892-28.663,19.144-45.932c0.252-18.319-6.916-35.719-20.159-48.97L446.763,23.707z"></path>
                          <path d="M324.436,47.398l-0.633,0.633l0.043,0.035l-13.043,13.225l9.19,9.19c1.388,0.391,2.725,0.998,3.81,2.091l73.641,73.633 c1.085,1.093,1.701,2.421,2.083,3.81l9.346,9.346l13.746-13.781L324.436,47.398z"></path>
                          <path d="M10.859,469.691c1.198,0,2.412-0.252,3.558-0.764l154.025-69.354c0.903-0.408,1.675-0.989,2.378-1.649 c0.061-0.061,0.148-0.078,0.208-0.139L396.62,171.646l-24.585-24.576l-29.826,29.818c-1.692,1.692-3.914,2.543-6.135,2.543 c-2.222,0-4.434-0.85-6.135-2.543c-3.384-3.393-3.384-8.886,0-12.271l29.826-29.826l-24.55-24.55L237.9,207.564 c-1.701,1.692-3.914,2.543-6.135,2.543c-2.222,0-4.443-0.85-6.135-2.543c-3.393-3.393-3.393-8.886,0-12.271l97.315-97.323 l-24.333-24.324L71.96,303.378c-0.061,0.052-0.069,0.13-0.122,0.182c-0.66,0.703-1.232,1.475-1.631,2.386L2.927,457.49 c-1.458,3.298-0.738,7.142,1.814,9.676C6.398,468.814,8.611,469.691,10.859,469.691z M299.262,195.294l6.135-6.135 c3.393-3.393,8.886-3.393,12.271,0c3.393,3.384,3.393,8.878,0,12.271l-6.135,6.135L170.394,348.703 c-1.692,1.692-3.914,2.534-6.135,2.534c-2.213,0-4.434-0.842-6.135-2.534c-3.384-3.393-3.384-8.886,0-12.279L299.262,195.294z M176.53,244.385l24.559-24.541c3.384-3.393,8.878-3.393,12.271,0c3.384,3.384,3.384,8.878,0,12.271l-6.135,6.127v0.009 l-18.415,18.406c-1.701,1.692-3.922,2.543-6.135,2.543c-2.222,0-4.443-0.85-6.144-2.543 C173.145,253.262,173.145,247.778,176.53,244.385z M121.147,303.508l32.534-34.408c3.28-3.497,8.782-3.636,12.271-0.339 c3.471,3.289,3.636,8.782,0.338,12.271l-32.534,34.408c-1.71,1.805-4.001,2.708-6.309,2.708c-2.143,0-4.287-0.79-5.962-2.369 C118.006,312.481,117.849,306.988,121.147,303.508z M83.78,318.148h32.516l-9.225,36.413c-0.764,3.02,0.139,6.205,2.369,8.366 c2.23,2.152,5.424,2.968,8.435,2.109l38.331-10.96v31.97l-82.935,37.341l-25.079-25.079L83.78,318.148z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[12px] text-neutral-400">URL subdomain</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-100">strict-as-is-protocol</span>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center p-0.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-300"
                        aria-label="Edit subdomain"
                      >
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 503.322 503.322" xmlns="http://www.w3.org/2000/svg">
                          <path d="M130.169,483.029h-17.356c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C138.847,486.908,134.968,483.029,130.169,483.029z"></path>
                          <path d="M182.237,483.029h-17.356c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C190.915,486.908,187.036,483.029,182.237,483.029z"></path>
                          <path d="M78.102,483.029H60.746c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C86.78,486.908,82.901,483.029,78.102,483.029z"></path>
                          <path d="M26.034,483.029H8.678c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C34.712,486.908,30.833,483.029,26.034,483.029z"></path>
                          <path d="M442.576,483.029H425.22c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C451.254,486.908,447.375,483.029,442.576,483.029z"></path>
                          <path d="M494.644,483.029h-17.356c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C503.322,486.908,499.443,483.029,494.644,483.029z"></path>
                          <path d="M390.508,483.029h-17.356c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C399.186,486.908,395.307,483.029,390.508,483.029z"></path>
                          <path d="M338.441,483.029h-17.356c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C347.119,486.908,343.24,483.029,338.441,483.029z"></path>
                          <path d="M286.373,483.029h-17.356c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C295.051,486.908,291.172,483.029,286.373,483.029z"></path>
                          <path d="M234.305,483.029h-17.356c-4.799,0-8.678,3.879-8.678,8.678c0,4.799,3.879,8.678,8.678,8.678h17.356 c4.799,0,8.678-3.879,8.678-8.678C242.983,486.908,239.104,483.029,234.305,483.029z"></path>
                          <path d="M446.763,23.707c-26.745-26.719-70.821-27.822-96.273-2.36l-13.781,13.781l98.174,98.174l13.798-13.789 c11.924-11.915,18.892-28.663,19.144-45.932c0.252-18.319-6.916-35.719-20.159-48.97L446.763,23.707z"></path>
                          <path d="M324.436,47.398l-0.633,0.633l0.043,0.035l-13.043,13.225l9.19,9.19c1.388,0.391,2.725,0.998,3.81,2.091l73.641,73.633 c1.085,1.093,1.701,2.421,2.083,3.81l9.346,9.346l13.746-13.781L324.436,47.398z"></path>
                          <path d="M10.859,469.691c1.198,0,2.412-0.252,3.558-0.764l154.025-69.354c0.903-0.408,1.675-0.989,2.378-1.649 c0.061-0.061,0.148-0.078,0.208-0.139L396.62,171.646l-24.585-24.576l-29.826,29.818c-1.692,1.692-3.914,2.543-6.135,2.543 c-2.222,0-4.434-0.85-6.135-2.543c-3.384-3.393-3.384-8.886,0-12.271l29.826-29.826l-24.55-24.55L237.9,207.564 c-1.701,1.692-3.914,2.543-6.135,2.543c-2.222,0-4.443-0.85-6.135-2.543c-3.393-3.393-3.393-8.886,0-12.271l97.315-97.323 l-24.333-24.324L71.96,303.378c-0.061,0.052-0.069,0.13-0.122,0.182c-0.66,0.703-1.232,1.475-1.631,2.386L2.927,457.49 c-1.458,3.298-0.738,7.142,1.814,9.676C6.398,468.814,8.611,469.691,10.859,469.691z M299.262,195.294l6.135-6.135 c3.393-3.393,8.886-3.393,12.271,0c3.393,3.384,3.393,8.878,0,12.271l-6.135,6.135L170.394,348.703 c-1.692,1.692-3.914,2.534-6.135,2.534c-2.213,0-4.434-0.842-6.135-2.534c-3.384-3.393-3.384-8.886,0-12.279L299.262,195.294z M176.53,244.385l24.559-24.541c3.384-3.393,8.878-3.393,12.271,0c3.384,3.384,3.384,8.878,0,12.271l-6.135,6.127v0.009 l-18.415,18.406c-1.701,1.692-3.922,2.543-6.135,2.543c-2.222,0-4.443-0.85-6.144-2.543 C173.145,253.262,173.145,247.778,176.53,244.385z M121.147,303.508l32.534-34.408c3.28-3.497,8.782-3.636,12.271-0.339 c3.471,3.289,3.636,8.782,0.338,12.271l-32.534,34.408c-1.71,1.805-4.001,2.708-6.309,2.708c-2.143,0-4.287-0.79-5.962-2.369 C118.006,312.481,117.849,306.988,121.147,303.508z M83.78,318.148h32.516l-9.225,36.413c-0.764,3.02,0.139,6.205,2.369,8.366 c2.23,2.152,5.424,2.968,8.435,2.109l38.331-10.96v31.97l-82.935,37.341l-25.079-25.079L83.78,318.148z"></path>
                        </svg>
                      </button>
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
