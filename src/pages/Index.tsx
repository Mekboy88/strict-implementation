import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AccountSettings from "@/pages/AccountSettings";
import {
  Folder,
  FileCode2,
  Search,
  Settings2,
  Paperclip,
  HelpCircle,
  WalletCards,
  ShoppingBag,
  MessageCircle,
  ChevronDown,
  ArrowLeft,
  Database,
  X,
} from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SupabaseIcon from "@/assets/supabase-logo-icon-2.svg";
import { GitHubIntegration } from "@/components/GitHubIntegration";

const initialFiles = [
  {
    id: "banner",
    name: "banner.tsx",
    path: "src/components/banner.tsx",
    language: "tsx",
    content: [
      "import React from 'react'",
      "",
      "export function Banner() {",
      "  return (",
      '    <section className="px-8 py-10 bg-card/60 border-b border-border">',
      '      <h1 className="text-2xl font-semibold text-foreground">UR-DEV Banner</h1>',
      '      <p className="mt-2 text-sm text-muted-foreground max-w-xl">',
      "        This is a demo banner component rendered inside the editor preview.",
      "      </p>",
      "    </section>",
      "  )",
      "}",
    ],
  },
  {
    id: "layout",
    name: "layout.tsx",
    path: "src/app/layout.tsx",
    language: "tsx",
    content: [
      "import React from 'react'",
      "",
      "export default function RootLayout({ children }) {",
      "  return (",
      '    <html lang="en">',
      '      <body className="bg-background text-foreground">{children}</body>',
      "    </html>",
      "  )",
      "}",
    ],
  },
  {
    id: "page",
    name: "page.tsx",
    path: "src/app/page.tsx",
    language: "tsx",
    content: [
      "import React from 'react'",
      "import { Banner } from '../components/banner'",
      "",
      "export default function Page() {",
      "  return (",
      '    <main className="min-h-screen bg-background">',
      "      <Banner />",
      "    </main>",
      "  )",
      "}",
    ],
  },
];

function buildInitialContents() {
  const map: Record<string, string> = {};
  for (const file of initialFiles) {
    map[file.id] = file.content.join(`
`);
  }
  return map;
}

function UrDevPreviewFrame() {
  return (
    <div className="h-full w-full rounded-2xl border border-border bg-background overflow-hidden shadow-2xl">
      <div className="h-full overflow-auto bg-gradient-to-b from-background via-card to-muted">
        <main className="min-h-[540px] px-10 py-10">
          <section className="mx-auto max-w-4xl rounded-2xl border border-border/80 bg-card/80 px-10 py-10 shadow-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              UR-DEV · LIVE PREVIEW
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
              UR-DEV Banner preview
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              This area simulates how your <span className="font-mono text-primary">banner.tsx</span>{" "}
              component will render inside the app shell. When you switch back to{" "}
              <span className="font-semibold text-foreground">Code</span>, you can continue editing the
              component line by line.
            </p>
            <div className="mt-8 rounded-xl border border-border bg-muted/70 px-7 py-6">
              <h2 className="text-xl font-semibold text-foreground">UR-DEV Banner</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                This is a demo banner component rendered inside the editor preview. You can adapt the
                structure to match your real project once the full compiler integration is wired in.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-[11px]">
                <span className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-primary">
                  • React component
                </span>
                <span className="inline-flex items-center rounded-full bg-success/15 px-3 py-1 text-success">
                  • Tailwind styles
                </span>
                <span className="inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-accent">
                  • UR-DEV layout frame
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function UrDevEditorPage() {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeFileId, setActiveFileId] = useState("banner");
  const [fileContents, setFileContents] = useState<Record<string, string>>(() =>
    buildInitialContents()
  );
  const [savedContents, setSavedContents] = useState<Record<string, string>>(() =>
    buildInitialContents()
  );
  const [showReasoning, setShowReasoning] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [showEditNotification, setShowEditNotification] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [assistantInput, setAssistantInput] = useState("");
  const [showDatabasePopup, setShowDatabasePopup] = useState(false);
  const [dbState, setDbState] = useState<"idle" | "creating">("idle");
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const githubButtonRef = useRef<HTMLButtonElement>(null);

  const handleConnectDatabase = () => {
    setDbState("creating");
    // Simulate database creation process
    setTimeout(() => {
      setShowDatabasePopup(false);
      setDbState("idle");
      navigate('/database');
    }, 4500); // Navigate after 4.5 seconds of animation
  };

  const handleCloseDatabasePopup = () => {
    setShowDatabasePopup(false);
    setDbState("idle");
  };
  
  const lineNumbersRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const assistantInputRef = React.useRef<HTMLTextAreaElement>(null);
  const editorContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isEditingEnabled) {
      setShowEditNotification(true);
      const timer = setTimeout(() => {
        setShowEditNotification(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isEditingEnabled]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isEditingEnabled &&
        editorContainerRef.current &&
        !editorContainerRef.current.contains(event.target as Node)
      ) {
        setIsEditingEnabled(false);
      }
    }

    if (isEditingEnabled) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isEditingEnabled]);

  const activeFile = initialFiles.find((file) => file.id === activeFileId) || initialFiles[0];
  const currentContent = fileContents[activeFileId] || activeFile.content.join(`
`);
  const currentLines = currentContent.split(`
`);
  const originalLines = activeFile.content;

  function handleChangeContent(value: string) {
    setFileContents((prev) => ({ ...prev, [activeFileId]: value }));
  }

  async function handleCopyFile() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentContent);
      }
    } catch {
      // ignore clipboard failures
    }
  }

  function handleSaveFile() {
    // Mark current content as saved
    setSavedContents((prev) => ({ ...prev, [activeFileId]: currentContent }));
  }

  function isLineChanged(index: number, line: string) {
    return line !== (originalLines[index] || "");
  }
  
  function handleScroll() {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }

  function autoResizeAssistantInput(el: HTMLTextAreaElement | null) {
    if (!el) return;
    el.style.height = "auto";
    const maxHeight = 480; // approx 20 lines at text-base size
    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
  }

  const hasFileChanges = currentContent !== (savedContents[activeFileId] || activeFile.content.join(`
`));

  return (
    <div className="min-h-screen bg-neutral-900 text-foreground flex flex-col">
      {/* TOP BAR */}
      <header className="flex items-center justify-between border-b border-white/10 bg-neutral-900 pl-1 pr-4 py-3 sm:pl-2 sm:pr-6 lg:pl-2 lg:pr-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-400/70 text-xs font-semibold text-cyan-200">
            UR
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">UR-DEV IDE</div>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:bg-neutral-800 rounded px-1 transition-colors outline-none">
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  YOU ARE THE DEVELOPER
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-neutral-900 border-neutral-700">
                <DropdownMenuItem 
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 cursor-pointer text-slate-200 focus:bg-neutral-800 focus:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-1 py-1 text-[11px]">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className={`rounded-full px-3 py-1 ${
              showPreview ? "bg-sky-500 text-black font-semibold" : "text-slate-300 hover:text-white"
            }`}
          >
            Preview
          </button>
          <button className="rounded-full px-3 py-1 text-slate-300 hover:text-white">Design</button>
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className={`rounded-full px-3 py-1 ${
              !showPreview
                ? "bg-sky-500 text-black font-semibold shadow-[0_0_18px_rgba(56,189,248,0.6)]"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Code
          </button>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <button className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-4 py-1.5 text-[11px] font-semibold text-black shadow-[0_0_22px_rgba(56,189,248,0.8)] hover:bg-sky-400">
            <span>Preview</span>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/20 text-[10px]">
              ↗
            </span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* FAR LEFT ACTIVITY RAIL */}
        <aside className="hidden lg:flex w-12 flex-col items-center justify-between border-r border-white/10 bg-neutral-900 py-3">
          <div className="flex flex-col items-center gap-3">
            <button 
              onClick={() => setShowFileExplorer(!showFileExplorer)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-200 hover:bg-white/10 transition-all hover:scale-110"
            >
              <svg viewBox="0 0 36 36" className="h-4 w-4" fill="currentColor">
                <path fill="#269" d="M0 29a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4V12a4 4 0 0 0-4-4h-9c-3.562 0-3-5-8.438-5H4a4 4 0 0 0-4 4v22z"></path>
                <path fill="#55ACEE" d="M30 10h-6.562C18 10 18.562 15 15 15H6a4 4 0 0 0-4 4v10a1 1 0 1 1-2 0a4 4 0 0 0 4 4h26a4 4 0 0 0 4-4V14a4 4 0 0 0-4-4z"></path>
              </svg>
            </button>
            <svg 
              height="16px" 
              width="16px" 
              version="1.1" 
              viewBox="0 0 56 56" 
              fill="currentColor" 
              className="transition-transform hover:scale-110 cursor-pointer"
              onClick={() => setShowDatabasePopup(true)}
            >
              <g>
                <g>
                  <path style={{fill: '#545E73'}} d="M49.455,8L49.455,8C48.724,3.538,38.281,0,25.5,0S2.276,3.538,1.545,8l0,0H1.5v0.5V20v0.5V21v11 v0.5V33v12h0.045c0.731,4.461,11.175,8,23.955,8s23.224-3.539,23.955-8H49.5V33v-0.5V32V21v-0.5V20V8.5V8H49.455z"></path>
                  <g>
                    <path style={{fill: '#38454F'}} d="M25.5,41c-13.255,0-24-3.806-24-8.5V45h0.045c0.731,4.461,11.175,8,23.955,8 s23.224-3.539,23.955-8H49.5V32.5C49.5,37.194,38.755,41,25.5,41z"></path>
                    <path style={{fill: '#38454F'}} d="M1.5,32v0.5c0-0.168,0.018-0.334,0.045-0.5H1.5z"></path>
                    <path style={{fill: '#38454F'}} d="M49.455,32c0.027,0.166,0.045,0.332,0.045,0.5V32H49.455z"></path>
                  </g>
                  <g>
                    <path style={{fill: '#556080'}} d="M25.5,29c-13.255,0-24-3.806-24-8.5V33h0.045c0.731,4.461,11.175,8,23.955,8 s23.224-3.539,23.955-8H49.5V20.5C49.5,25.194,38.755,29,25.5,29z"></path>
                    <path style={{fill: '#556080'}} d="M1.5,20v0.5c0-0.168,0.018-0.334,0.045-0.5H1.5z"></path>
                    <path style={{fill: '#556080'}} d="M49.455,20c0.027,0.166,0.045,0.332,0.045,0.5V20H49.455z"></path>
                  </g>
                  <ellipse style={{fill: '#91BAE1'}} cx="25.5" cy="8.5" rx="24" ry="8.5"></ellipse>
                  <g>
                    <path style={{fill: '#8697CB'}} d="M25.5,17c-13.255,0-24-3.806-24-8.5V21h0.045c0.731,4.461,11.175,8,23.955,8 s23.224-3.539,23.955-8H49.5V8.5C49.5,13.194,38.755,17,25.5,17z"></path>
                    <path style={{fill: '#8697CB'}} d="M1.5,8v0.5c0-0.168,0.018-0.334,0.045-0.5H1.5z"></path>
                    <path style={{fill: '#8697CB'}} d="M49.455,8C49.482,8.166,49.5,8.332,49.5,8.5V8H49.455z"></path>
                  </g>
                </g>
                <g>
                  <g>
                    <path style={{fill: '#48A0DC'}} d="M49.545,45.111C49.494,41.175,46.382,38,42.546,38c-2.568,0-4.806,1.426-6.025,3.546 c-0.421-0.141-0.87-0.22-1.337-0.22c-2.063,0-3.785,1.492-4.208,3.484C29.221,45.675,28,47.516,28,49.641 C28,52.589,30.343,55,33.208,55h10.775c0.061,0,0.119-0.007,0.18-0.009c0.06,0.002,0.119,0.009,0.18,0.009h4.31 c2.667,0,4.849-2.245,4.849-4.989C53.5,47.581,51.788,45.546,49.545,45.111z"></path>
                    <path style={{fill: '#B1D3EF'}} d="M48.651,56h-4.31c-0.063,0-0.126-0.004-0.188-0.008C44.106,55.996,44.045,56,43.982,56H33.208 C29.785,56,27,53.147,27,49.642c0-2.262,1.209-4.372,3.116-5.503c0.686-2.235,2.746-3.813,5.066-3.813 c0.296,0,0.592,0.025,0.884,0.076C37.562,38.286,39.98,37,42.546,37c4.102,0,7.524,3.225,7.954,7.332 c2.358,0.806,4,3.079,4,5.679C54.5,53.313,51.876,56,48.651,56z M44.114,53.991l0.186,0.006L48.651,54 c2.122,0,3.849-1.79,3.849-3.989c0-1.917-1.323-3.564-3.146-3.919l-0.799-0.155l-0.011-0.813C48.501,41.747,45.811,39,42.546,39 c-2.135,0-4.063,1.139-5.158,3.045l-0.409,0.711l-0.777-0.261c-0.332-0.112-0.675-0.169-1.019-0.169 c-1.54,0-2.898,1.133-3.229,2.692l-0.102,0.475l-0.435,0.214C29.948,46.432,29,47.976,29,49.642C29,52.045,30.888,54,33.208,54 L44.114,53.991z"></path>
                  </g>
                </g>
              </g>
            </svg>
            <img src={SupabaseIcon} alt="" className="h-4 w-4 transition-transform hover:scale-110 cursor-pointer" />
            <button
              ref={githubButtonRef}
              onClick={() => setShowGitHubModal(true)}
              className="inline-flex items-center justify-center transition-transform hover:scale-110 cursor-pointer bg-transparent border-none p-0"
            >
              <svg fill="currentColor" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M1873.256 674.212c0-122.468-35.728-230.622-106.325-321.88 15.712-57.683 32.5-171.972-20.77-313.703-5.596-15.066-17.864-26.796-33.146-32.07-19.155-6.564-122.144-30.347-328.552 110.953-84.157-22.169-172.94-33.576-264.844-34.114-91.582.538-180.366 11.945-264.306 34.114C648.689-23.68 545.7-.005 526.437 6.56c-15.282 5.165-27.55 17.003-33.146 32.177-53.162 141.623-36.374 255.912-20.555 313.594-70.704 91.582-106.54 199.629-106.54 321.88 0 422.826 221.905 557.131 432.188 605.666-46.49 50.903-95.24 125.158-105.68 219.537-71.78 26.044-257.633 78.13-325.109-44.015-3.013-5.596-73.394-137.641-215.017-148.08-25.075 1.184-84.587 4.305-101.052 54.346-18.51 55.961 39.495 97.716 67.906 117.41.538.323 55.745 31.962 93.841 132.045.969 4.628 23.783 114.72 134.951 181.55 87.492 52.731 202.319 63.493 341.252 32.284 0 23.46-.323 48.212-.43 63.386l-.324 31.101H796.34l.215-29.81c1.937-161.532 2.045-164.653-30.778-181.656-12.484-6.457-27.012-7.964-40.356-3.659-136.243 41.002-246.98 40.033-320.052-2.798-70.488-41.54-85.985-108.908-88.89-119.67-3.875-10.653-8.072-20.662-12.269-30.24 126.987 145.713 372.138 77.161 463.289 33.792 18.833-8.825 30.778-27.765 30.778-48.535 0-149.372 148.295-244.182 149.802-245.15 19.371-12.16 28.949-35.19 23.998-57.36-4.95-22.276-23.352-39.065-46.06-41.755-223.626-26.796-452.204-109.338-452.204-518.388 0-106.325 33.577-198.983 99.76-275.175 12.915-15.067 16.681-36.052 9.579-54.562-9.793-25.397-36.482-112.782-.323-234.819 35.729 4.09 110.845 24.321 231.16 110.307 13.344 9.578 30.455 12.376 46.383 7.856 80.497-23.568 170.356-36.267 259.248-36.805 89.321.538 179.073 13.237 259.786 36.805 15.927 4.52 32.93 1.722 46.382-7.856 121.176-86.631 196.4-106.433 230.73-110.63 36.482 122.145 9.793 209.745 0 235.142-7.21 18.51-3.444 39.603 9.578 54.562 66.076 75.977 99.545 168.527 99.545 275.175 0 409.157-229.115 491.161-453.173 517.527-20.985 2.475-38.634 16.896-44.984 37.02-6.456 20.017-.538 42.078 15.067 56.284 6.35 5.703 14.958 12.483 25.074 20.231 51.333 39.28 137.211 105.034 137.211 259.571 0 85.448-1.399 354.273-1.399 354.273l107.617.539s1.399-269.257 1.399-354.812c0-141.838-56.499-229.976-110.845-285.937 210.39-48.427 431.65-182.517 431.65-604.696" fillRule="evenodd"></path>
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('desktop')}
              className={`transition-colors ${viewMode === 'desktop' ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
              title="Desktop files"
            >
              <svg fill="currentColor" height="16px" width="16px" version="1.1" viewBox="0 0 511.999 511.999" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <g>
                    <path d="M386.455,198.212l-53.811-53.811c-3.253-3.254-8.528-3.255-11.784,0c-3.254,3.253-3.254,8.529,0,11.783l47.92,47.92 l-47.92,47.919c-3.254,3.253-3.254,8.529,0,11.783c1.628,1.628,3.76,2.441,5.892,2.441c2.132,0,4.265-0.814,5.891-2.44 l53.811-53.811C389.709,206.742,389.709,201.466,386.455,198.212z"></path>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M143.223,204.102l47.919-47.92c3.254-3.253,3.254-8.529,0-11.783c-3.253-3.254-8.529-3.254-11.783,0l-53.811,53.811 c-3.254,3.253-3.254,8.529,0,11.783l53.811,53.811c1.626,1.628,3.759,2.441,5.891,2.441s4.265-0.814,5.891-2.442 c3.254-3.253,3.254-8.529,0-11.783L143.223,204.102z"></path>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M283.22,118.176c-4.386-1.39-9.07,1.041-10.458,5.427L223.356,279.57c-1.39,4.387,1.04,9.07,5.427,10.46 c0.838,0.266,1.685,0.391,2.519,0.391c3.535,0,6.816-2.269,7.941-5.818l49.404-155.967 C290.037,124.248,287.607,119.565,283.22,118.176z"></path>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M471.246,24.766H40.754C18.283,24.766,0,43.049,0,65.52v59.227c0,4.602,3.731,8.332,8.332,8.332 c4.601,0,8.332-3.731,8.332-8.332V65.52c0-13.284,10.807-24.09,24.09-24.09h430.492c13.284,0,24.09,10.807,24.09,24.09v284.411 h-52.21c-4.602,0-8.332,3.731-8.332,8.332s3.731,8.332,8.332,8.332h52.21v15.273c0,13.284-10.807,24.09-24.09,24.09h-155.41 H196.164H40.754c-13.284,0-24.09-10.807-24.09-24.09v-15.273h398.688c4.602,0,8.332-3.731,8.332-8.332s-3.731-8.332-8.332-8.332 H16.664V152.522c0-4.602-3.731-8.332-8.332-8.332c-4.601,0-8.332,3.73-8.332,8.332V381.87c0,22.472,18.283,40.754,40.754,40.754 H183.54l-20.494,47.945h-40.034c-4.602,0-8.332,3.731-8.332,8.332s3.731,8.332,8.332,8.332h265.975 c4.602,0,8.332-3.731,8.332-8.332s-3.731-8.332-8.332-8.332h-40.034l-20.494-47.945h142.786c22.472,0,40.754-18.282,40.754-40.754 V65.52C512,43.049,493.717,24.766,471.246,24.766z M330.83,470.568H181.17l14.238-33.31h121.185L330.83,470.568z"></path>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M262.924,379.679c-1.914-2.906-5.583-4.299-8.952-3.457c-3.517,0.879-6.116,4.048-6.291,7.67 c-0.364,7.534,9.106,11.629,14.33,6.172C264.674,387.282,265.089,382.887,262.924,379.679z"></path>
                  </g>
                </g>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('mobile')}
              className={`transition-colors ${viewMode === 'mobile' ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
              title="Mobile files"
            >
              <svg version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="16px" width="16px">
                <path d="M19,8c0.6,0,1-0.4,1-1V5c0-1.7-1.3-3-3-3H7C5.3,2,4,3.3,4,5v22c0,1.7,1.3,3,3,3h10c1.7,0,3-1.3,3-3v-4c0-0.6-0.4-1-1-1H6V8 H19z M11,25h2c0.6,0,1,0.4,1,1s-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1S10.4,25,11,25z"></path>
                <g>
                  <path d="M14,19c-0.3,0-0.5-0.1-0.7-0.3l-3-3c-0.4-0.4-0.4-1,0-1.4l3-3c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4L12.4,15l2.3,2.3 c0.4,0.4,0.4,1,0,1.4C14.5,18.9,14.3,19,14,19z"></path>
                </g>
                <g>
                  <path d="M24,19c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l2.3-2.3l-2.3-2.3c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l3,3 c0.4,0.4,0.4,1,0,1.4l-3,3C24.5,18.9,24.3,19,24,19z"></path>
                </g>
                <g>
                  <path d="M17,20c-0.1,0-0.3,0-0.4-0.1c-0.5-0.2-0.7-0.8-0.4-1.3l4-8c0.2-0.5,0.8-0.7,1.3-0.4c0.5,0.2,0.7,0.8,0.4,1.3l-4,8 C17.7,19.8,17.4,20,17,20z"></path>
                </g>
              </svg>
            </button>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.5094 8.25078C19.0094 8.25078 19.4094 7.85078 19.4094 7.35078V2.70078C19.4094 2.20078 19.0094 1.80078 18.5094 1.80078C18.0094 1.80078 17.6094 2.20078 17.6094 2.70078V7.35078C17.6094 7.84078 18.0194 8.25078 18.5094 8.25078Z" fill="currentColor"></path>
              <path d="M11.9996 15.75C11.4996 15.75 11.0996 16.15 11.0996 16.65V21.3C11.0996 21.8 11.4996 22.2 11.9996 22.2C12.4996 22.2 12.8996 21.8 12.8996 21.3V16.65C12.8996 16.16 12.4996 15.75 11.9996 15.75Z" fill="currentColor"></path>
              <path d="M5.48984 8.25078C5.98984 8.25078 6.38984 7.85078 6.38984 7.35078V2.70078C6.38984 2.20078 5.98984 1.80078 5.48984 1.80078C4.98984 1.80078 4.58984 2.20078 4.58984 2.70078V7.35078C4.58984 7.84078 4.98984 8.25078 5.48984 8.25078Z" fill="currentColor"></path>
              <path d="M7.35047 10.1719H3.63047C3.13047 10.1719 2.73047 10.5719 2.73047 11.0719C2.73047 11.5719 3.13047 11.9719 3.63047 11.9719H4.59047V21.3019C4.59047 21.8019 4.99047 22.2019 5.49047 22.2019C5.99047 22.2019 6.39047 21.8019 6.39047 21.3019V11.9719H7.35047C7.85047 11.9719 8.25047 11.5719 8.25047 11.0719C8.25047 10.5719 7.84047 10.1719 7.35047 10.1719Z" fill="currentColor"></path>
              <path d="M20.37 10.1719H16.65C16.15 10.1719 15.75 10.5719 15.75 11.0719C15.75 11.5719 16.15 11.9719 16.65 11.9719H17.61V21.3019C17.61 21.8019 18.01 22.2019 18.51 22.2019C19.01 22.2019 19.41 21.8019 19.41 21.3019V11.9719H20.37C20.87 11.9719 21.27 11.5719 21.27 11.0719C21.27 10.5719 20.87 10.1719 20.37 10.1719Z" fill="currentColor"></path>
              <path d="M13.8602 12.0308H12.9002V2.70078C12.9002 2.20078 12.5002 1.80078 12.0002 1.80078C11.5002 1.80078 11.1002 2.20078 11.1002 2.70078V12.0308H10.1402C9.64023 12.0308 9.24023 12.4308 9.24023 12.9308C9.24023 13.4308 9.64023 13.8308 10.1402 13.8308H13.8602C14.3602 13.8308 14.7602 13.4308 14.7602 12.9308C14.7602 12.4308 14.3602 12.0308 13.8602 12.0308Z" fill="currentColor"></path>
            </svg>
          </button>
        </aside>

        {/* LEFT SIDEBAR (EXPLORER) */}
        {showFileExplorer && (
          <aside className="hidden lg:flex w-72 flex-col border-r border-white/10 bg-neutral-900">
          <div className="px-3 py-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-100">
                <span className="text-xs font-semibold text-slate-100">Explorer</span>
                <button
                  type="button"
                  onClick={() => setViewMode('desktop')}
                  className={`transition-colors ${viewMode === 'desktop' ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
                  title="Desktop files"
                >
                  <svg fill="currentColor" height="14px" width="14px" version="1.1" viewBox="0 0 511.999 511.999" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <g>
                        <path d="M386.455,198.212l-53.811-53.811c-3.253-3.254-8.528-3.255-11.784,0c-3.254,3.253-3.254,8.529,0,11.783l47.92,47.92 l-47.92,47.919c-3.254,3.253-3.254,8.529,0,11.783c1.628,1.628,3.76,2.441,5.892,2.441c2.132,0,4.265-0.814,5.891-2.44 l53.811-53.811C389.709,206.742,389.709,201.466,386.455,198.212z"></path>
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M143.223,204.102l47.919-47.92c3.254-3.253,3.254-8.529,0-11.783c-3.253-3.254-8.529-3.254-11.783,0l-53.811,53.811 c-3.254,3.253-3.254,8.529,0,11.783l53.811,53.811c1.626,1.628,3.759,2.441,5.891,2.441s4.265-0.814,5.891-2.442 c3.254-3.253,3.254-8.529,0-11.783L143.223,204.102z"></path>
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M283.22,118.176c-4.386-1.39-9.07,1.041-10.458,5.427L223.356,279.57c-1.39,4.387,1.04,9.07,5.427,10.46 c0.838,0.266,1.685,0.391,2.519,0.391c3.535,0,6.816-2.269,7.941-5.818l49.404-155.967 C290.037,124.248,287.607,119.565,283.22,118.176z"></path>
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M471.246,24.766H40.754C18.283,24.766,0,43.049,0,65.52v59.227c0,4.602,3.731,8.332,8.332,8.332 c4.601,0,8.332-3.731,8.332-8.332V65.52c0-13.284,10.807-24.09,24.09-24.09h430.492c13.284,0,24.09,10.807,24.09,24.09v284.411 h-52.21c-4.602,0-8.332,3.731-8.332,8.332s3.731,8.332,8.332,8.332h52.21v15.273c0,13.284-10.807,24.09-24.09,24.09h-155.41 H196.164H40.754c-13.284,0-24.09-10.807-24.09-24.09v-15.273h398.688c4.602,0,8.332-3.731,8.332-8.332s-3.731-8.332-8.332-8.332 H16.664V152.522c0-4.602-3.731-8.332-8.332-8.332c-4.601,0-8.332,3.73-8.332,8.332V381.87c0,22.472,18.283,40.754,40.754,40.754 H183.54l-20.494,47.945h-40.034c-4.602,0-8.332,3.731-8.332,8.332s3.731,8.332,8.332,8.332h265.975 c4.602,0,8.332-3.731,8.332-8.332s-3.731-8.332-8.332-8.332h-40.034l-20.494-47.945h142.786c22.472,0,40.754-18.282,40.754-40.754 V65.52C512,43.049,493.717,24.766,471.246,24.766z M330.83,470.568H181.17l14.238-33.31h121.185L330.83,470.568z"></path>
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M262.924,379.679c-1.914-2.906-5.583-4.299-8.952-3.457c-3.517,0.879-6.116,4.048-6.291,7.67 c-0.364,7.534,9.106,11.629,14.33,6.172C264.674,387.282,265.089,382.887,262.924,379.679z"></path>
                      </g>
                    </g>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('mobile')}
                  className={`transition-colors ${viewMode === 'mobile' ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
                  title="Mobile files"
                >
                  <svg version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="14px" width="14px">
                    <path d="M19,8c0.6,0,1-0.4,1-1V5c0-1.7-1.3-3-3-3H7C5.3,2,4,3.3,4,5v22c0,1.7,1.3,3,3,3h10c1.7,0,3-1.3,3-3v-4c0-0.6-0.4-1-1-1H6V8 H19z M11,25h2c0.6,0,1,0.4,1,1s-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1S10.4,25,11,25z"></path>
                    <g>
                      <path d="M14,19c-0.3,0-0.5-0.1-0.7-0.3l-3-3c-0.4-0.4-0.4-1,0-1.4l3-3c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4L12.4,15l2.3,2.3 c0.4,0.4,0.4,1,0,1.4C14.5,18.9,14.3,19,14,19z"></path>
                    </g>
                    <g>
                      <path d="M24,19c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l2.3-2.3l-2.3-2.3c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l3,3 c0.4,0.4,0.4,1,0,1.4l-3,3C24.5,18.9,24.3,19,24,19z"></path>
                    </g>
                    <g>
                      <path d="M17,20c-0.1,0-0.3,0-0.4-0.1c-0.5-0.2-0.7-0.8-0.4-1.3l4-8c0.2-0.5,0.8-0.7,1.3-0.4c0.5,0.2,0.7,0.8,0.4,1.3l-4,8 C17.7,19.8,17.4,20,17,20z"></path>
                    </g>
                  </svg>
                </button>
              </div>
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-200 transition-colors"
                onClick={() => setShowSearchBar(!showSearchBar)}
              >
                <path fillRule="evenodd" clipRule="evenodd" d="M1 5C1 3.34315 2.34315 2 4 2H8.43845C9.81505 2 11.015 2.93689 11.3489 4.27239L11.7808 6H13.5H20C21.6569 6 23 7.34315 23 9V11C23 11.5523 22.5523 12 22 12C21.4477 12 21 11.5523 21 11V9C21 8.44772 20.5523 8 20 8H13.5H11.7808H4C3.44772 8 3 8.44772 3 9V10V19C3 19.5523 3.44772 20 4 20H9C9.55228 20 10 20.4477 10 21C10 21.5523 9.55228 22 9 22H4C2.34315 22 1 20.6569 1 19V10V9V5ZM3 6.17071C3.31278 6.06015 3.64936 6 4 6H9.71922L9.40859 4.75746C9.2973 4.3123 8.89732 4 8.43845 4H4C3.44772 4 3 4.44772 3 5V6.17071ZM20.1716 18.7574C20.6951 17.967 21 17.0191 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21C17.0191 21 17.967 20.6951 18.7574 20.1716L21.2929 22.7071C21.6834 23.0976 22.3166 23.0976 22.7071 22.7071C23.0976 22.3166 23.0976 21.6834 22.7071 21.2929L20.1716 18.7574ZM13 16C13 14.3431 14.3431 13 16 13C17.6569 13 19 14.3431 19 16C19 17.6569 17.6569 19 16 19C14.3431 19 13 17.6569 13 16Z" fill="currentColor"/>
              </svg>
            </div>
            {showSearchBar && (
              <div className="mt-3 flex items-center gap-2 rounded-md bg-neutral-900 px-2 py-1 text-[11px] text-slate-300 border border-neutral-700">
                <Search className="h-3 w-3 text-slate-500" />
                <input
                  className="flex-1 bg-transparent outline-none placeholder:text-slate-600"
                  placeholder="Search files..."
                />
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 text-[11px] text-slate-300">
            <div className="mb-2 px-2 text-slate-500 uppercase tracking-[0.16em] text-[10px]">
              {viewMode === 'desktop' ? 'DESKTOP PROJECT' : 'MOBILE PROJECT'}
            </div>
            
            {viewMode === 'desktop' ? (
              <div className="space-y-1">
                <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-slate-400 hover:bg-white/5 min-w-0">
                  <Folder className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">node_modules</span>
                </button>
                <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-slate-400 hover:bg-white/5 min-w-0">
                  <Folder className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">public</span>
                </button>
                <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-slate-200 hover:bg-white/5 min-w-0">
                  <Folder className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">src</span>
                </button>

                <div className="ml-5 space-y-1 min-w-0">
                  <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-slate-300 hover:bg-white/5 min-w-0">
                    <Folder className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">components</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFileId("banner")}
                    className={`ml-4 flex items-center justify-between rounded-md px-2 py-1 text-left min-w-0 mr-2 ${
                      activeFileId === "banner"
                        ? "bg-sky-500/25 text-sky-100"
                        : "hover:bg-white/5 hover:text-sky-100"
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0 flex-1">
                      <FileCode2 className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">banner.tsx</span>
                    </span>
                    <span className="text-[9px] text-slate-400 flex-shrink-0 ml-2">TSX</span>
                  </button>
                </div>

                <div className="ml-5 space-y-1 min-w-0">
                  <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-slate-300 hover:bg-white/5 min-w-0">
                    <Folder className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">app</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFileId("layout")}
                    className={`ml-4 flex items-center justify-between rounded-md px-2 py-1 text-left min-w-0 mr-2 ${
                      activeFileId === "layout"
                        ? "bg-sky-500/25 text-sky-100"
                        : "hover:bg-white/5 hover:text-sky-100"
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0 flex-1">
                      <FileCode2 className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">layout.tsx</span>
                    </span>
                    <span className="text-[9px] text-slate-400 flex-shrink-0 ml-2">TSX</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFileId("page")}
                    className={`ml-4 flex items-center justify-between rounded-md px-2 py-1 text-left min-w-0 mr-2 ${
                      activeFileId === "page"
                        ? "bg-sky-500/25 text-sky-100"
                        : "hover:bg-white/5 hover:text-sky-100"
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0 flex-1">
                      <FileCode2 className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">page.tsx</span>
                    </span>
                    <span className="text-[9px] text-slate-400 flex-shrink-0 ml-2">TSX</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-slate-400 hover:bg-white/5 min-w-0">
                  <Folder className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">mobile</span>
                </button>
                <div className="ml-5 space-y-1 min-w-0">
                  <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-slate-400 hover:bg-white/5 min-w-0">
                    <Folder className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">public</span>
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-slate-200 hover:bg-white/5 min-w-0">
                    <Folder className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">src</span>
                  </button>
                  <div className="ml-5 space-y-1 min-w-0">
                    <button className="flex items-center justify-between rounded-md px-2 py-1 text-left min-w-0 mr-2 hover:bg-white/5">
                      <span className="flex items-center gap-2 min-w-0 flex-1">
                        <FileCode2 className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">MobileApp.tsx</span>
                      </span>
                      <span className="text-[9px] text-slate-400 flex-shrink-0 ml-2">TSX</span>
                    </button>
                    <button className="flex items-center justify-between rounded-md px-2 py-1 text-left min-w-0 mr-2 hover:bg-white/5">
                      <span className="flex items-center gap-2 min-w-0 flex-1">
                        <FileCode2 className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">main.tsx</span>
                      </span>
                      <span className="text-[9px] text-slate-400 flex-shrink-0 ml-2">TSX</span>
                    </button>
                    <button className="flex items-center justify-between rounded-md px-2 py-1 text-left min-w-0 mr-2 hover:bg-white/5">
                      <span className="flex items-center gap-2 min-w-0 flex-1">
                        <FileCode2 className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">router.ts</span>
                      </span>
                      <span className="text-[9px] text-slate-400 flex-shrink-0 ml-2">TS</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 px-4 py-3 text-[10px] text-slate-500 flex items-center justify-between">
            <button className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[10px] text-slate-200 hover:bg-white/10">
              <Settings2 className="h-3 w-3" />
              <span>Project settings</span>
            </button>
            <span className="text-[9px] text-slate-600">UR-DEV workspace</span>
          </div>
        </aside>
        )}

        {/* CENTER: EDITOR OR PREVIEW */}
        <main className="flex-1 flex overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={70} minSize={50}>
              <section className="flex-1 flex flex-col bg-neutral-900 h-full">
            {showPreview ? (
              <div className="flex-1 overflow-auto">
                <UrDevPreviewFrame />
              </div>
            ) : (
              <>
                {/* File tabs + copy */}
                <div className="flex items-center justify-between border-b border-white/10 bg-neutral-900 px-4 py-2.5 text-[11px]">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {initialFiles.map((file) => {
                      const isActive = file.id === activeFileId;
                      return (
                        <button
                          key={file.id}
                          type="button"
                          onClick={() => setActiveFileId(file.id)}
                          className={`inline-flex items-center gap-2 rounded-t-md px-3 py-1 ${
                            isActive
                              ? "bg-black text-sky-100"
                              : "text-slate-400 hover:text-slate-100"
                          }`}
                        >
                          <span>{file.name}</span>
                          <span className="text-slate-500">|</span>
                          <span className="text-[9px] uppercase text-slate-500">
                            {file.language}
                          </span>
                          {file.id === activeFileId && hasFileChanges && (
                            <span className="ml-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] text-amber-300">
                              Modified
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <button
                      type="button"
                      onClick={handleCopyFile}
                      className="inline-flex items-center justify-center hover:text-sky-400 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor">
                        <g>
                          <path d="M23.71 10.29l-4-4C19.52 6.1 19.26 6 19 6h-7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V11c0-.26-.1-.52-.29-.71zM19 8.42L21.58 11H19.5c-.28 0-.5-.22-.5-.5V8.42zm3 13.08c0 .28-.22.5-.5.5h-9c-.28 0-.5-.22-.5-.5v-13c0-.28.22-.5.5-.5h4c.28 0 .5.22.5.5V10h-2c-.55 0-1 .45-1 1s.45 1 1 1h2.27c.35.6.99 1 1.73 1h2.5c.28 0 .5.22.5.5v8z"></path>
                          <path d="M13 2v1c0 .55-.45 1-1 1s-1-.45-1-1v-.5c0-.28-.22-.5-.5-.5h-.51H2.5c-.28 0-.5.22-.5.5v13c0 .28.22.5.5.5h4.52c.54.01.98.46.98 1s-.44.99-.98 1H2.01C.9 18 0 17.1 0 16V2C0 .9.9 0 2.01 0h8.98C12.1 0 13 .9 13 2zM19 20h-4c-.553 0-1-.447-1-1s.447-1 1-1h4c.553 0 1 .447 1 1s-.447 1-1 1zM19 16h-4c-.553 0-1-.447-1-1s.447-1 1-1h4c.553 0 1 .447 1 1s-.447 1-1 1z"></path>
                          <path d="M7 6H5c-.553 0-1-.447-1-1s.447-1 1-1h2c.553 0 1 .447 1 1s-.447 1-1 1zM7 14H5c-.553 0-1-.447-1-1s.447-1 1-1h2c.553 0 1 .447 1 1s-.447 1-1 1zM7 10H5c-.553 0-1-.447-1-1s.447-1 1-1h2c.553 0 1 .447 1 1s-.447 1-1 1z"></path>
                        </g>
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingEnabled(!isEditingEnabled)}
                      className={`inline-flex items-center justify-center transition-colors ${
                        isEditingEnabled
                          ? "text-sky-400"
                          : "text-slate-400 hover:text-sky-400"
                      }`}
                    >
                      <svg fill="currentColor" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                        <g>
                          <path d="M24.8452,25.3957a6.0129,6.0129,0,0,0-8.4487.7617L1.3974,44.1563a5.9844,5.9844,0,0,0,0,7.687L16.3965,69.8422a5.9983,5.9983,0,1,0,9.21-7.687L13.8068,48l11.8-14.1554A6,6,0,0,0,24.8452,25.3957Z"></path>
                          <path d="M55.1714,12.1192A6.0558,6.0558,0,0,0,48.1172,16.83L36.1179,76.8262A5.9847,5.9847,0,0,0,40.8286,83.88a5.7059,5.7059,0,0,0,1.1835.1172A5.9949,5.9949,0,0,0,47.8828,79.17L59.8821,19.1735A5.9848,5.9848,0,0,0,55.1714,12.1192Z"></path>
                          <path d="M94.6026,44.1563,79.6035,26.1574a5.9983,5.9983,0,1,0-9.21,7.687L82.1932,48l-11.8,14.1554a5.9983,5.9983,0,1,0,9.21,7.687L94.6026,51.8433A5.9844,5.9844,0,0,0,94.6026,44.1563Z"></path>
                        </g>
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveFile}
                      disabled={!hasFileChanges}
                      className={`hidden sm:inline rounded-full px-4 py-1.5 text-xs transition-all ${
                        hasFileChanges
                          ? "bg-sky-500/20 text-sky-200 cursor-pointer hover:bg-sky-500/30"
                          : "bg-sky-500/10 text-sky-300/60 cursor-default"
                      }`}
                    >
                      {hasFileChanges ? "Save" : "Saved"}
                    </button>
                  </div>
                </div>

                {/* Editor surface */}
                <div ref={editorContainerRef} className="flex-1 overflow-hidden flex flex-col">
                  <div className="flex-1 relative rounded-none border-0 bg-transparent shadow-none overflow-hidden">
                    {showEditNotification && (
                      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
                        <div className="text-6xl font-bold text-white">
                          Edit Mode
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 flex text-[13px] font-mono leading-relaxed">
                      <div ref={lineNumbersRef} className="select-none border-r border-white/5 bg-neutral-900 px-3 py-3 text-right text-slate-500 min-w-[46px] overflow-y-auto text-[13px] leading-relaxed scrollbar-hide">
                        {currentLines.map((line, index) => (
                          <div
                            key={index}
                            className={
                              isLineChanged(index, line)
                                ? "bg-amber-500/10 text-amber-300 -mx-1 px-1 rounded-sm"
                                : ""
                            }
                          >
                            {index + 1}
                          </div>
                        ))}
                      </div>
                      <textarea
                        ref={textareaRef}
                        value={currentContent}
                        onChange={(e) => handleChangeContent(e.target.value)}
                        onScroll={handleScroll}
                        spellCheck={false}
                        readOnly={!isEditingEnabled}
                        className={`flex-1 resize-none bg-neutral-900 px-4 py-3 text-[13px] text-emerald-200 outline-none whitespace-pre overflow-auto leading-relaxed ${
                          !isEditingEnabled ? "cursor-default" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
              </section>
            </ResizablePanel>

            <ResizableHandle withHandle className="hidden xl:flex" />

            <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="hidden xl:block">
              <aside className="flex h-full flex-col border-l border-white/10 bg-neutral-900">
            <div className="border-b border-white/10 px-4 py-3 text-[11px] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-100">UR-DEV Assistant</div>
              </div>
              <button className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] text-slate-200 hover:border-cyan-400/70 hover:text-cyan-100 transition-colors">
                <span className="text-xs">▶</span>
                <span>Run checks</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-[11px]">
              <div className="rounded-2xl border border-white/10 bg-neutral-900 p-3">
                <button
                  type="button"
                  onClick={() => setShowReasoning((v) => !v)}
                  className="flex w-full items-center justify-between rounded-lg bg-white/5 px-3 py-1 text-[11px] text-slate-200"
                >
                  <span>Reasoning</span>
                  <span className="text-xs">{showReasoning ? "▾" : "▸"}</span>
                </button>
                {showReasoning && (
                  <div className="mt-2 rounded-lg bg-neutral-800 animate-pulse px-3 py-2 text-[11px] text-slate-200">
                    The assistant analyses the current file, identifies structural issues, and
                    proposes a clear, maintainable revision plan before suggesting any code edits.
                  </div>
                )}
                <div className="mt-3 space-y-2 text-slate-100">
                  <p>
                    I have examined the active component and identified opportunities to simplify its
                    layout, improve naming, and separate visual concerns from logic. The next step is
                    to introduce small, focused helpers while preserving the original behaviour.
                  </p>
                  <p className="text-slate-300">
                    All suggestions are conservative, emphasising readability, long-term
                    maintainability, and type safety.
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-black hover:bg-emerald-400">
                    Error fixing
                  </button>
                  <button className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-black hover:bg-emerald-400">
                    Find logic bugs
                  </button>
                  <button className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] text-slate-100 hover:border-sky-400/80 hover:text-sky-100">
                    Suggest refactor
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-neutral-900 p-3">
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  Recent analysis
                </div>
                <ul className="mt-2 space-y-1 text-slate-300">
                  <li>• Verified props and state usage are coherent.</li>
                  <li>• No unreachable branches detected in this file.</li>
                  <li>• Recommended extracting layout into smaller sections.</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 px-4 py-3">
              <div className="rounded-2xl border border-white/10 space-y-3">
                {showQuickActions && (
                  <div className="rounded-2xl bg-neutral-800 px-3 py-3">
                    <div className="grid grid-cols-3 gap-3 text-[11px] text-slate-100">
                      <button className="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-3 py-2 hover:bg-white/10">
                        <Paperclip className="h-4 w-4" />
                        <span>Attach File</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-3 py-2 hover:bg-white/10">
                        <Settings2 className="h-4 w-4" />
                        <span>Settings</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-3 py-2 hover:bg-white/10">
                        <WalletCards className="h-4 w-4" />
                        <span>Wallet</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-3 py-2 hover:bg-white/10">
                        <HelpCircle className="h-4 w-4" />
                        <span>Help</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-3 py-2 hover:bg-white/10">
                        <ShoppingBag className="h-4 w-4" />
                        <span>Market</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-3 py-2 hover:bg-white/10">
                        <MessageCircle className="h-4 w-4" />
                        <span>Community</span>
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-2 rounded-2xl bg-neutral-800 px-3 py-3">
                  <textarea
                    ref={assistantInputRef}
                    value={assistantInput}
                    onChange={(e) => {
                      setAssistantInput(e.target.value);
                      autoResizeAssistantInput(e.target);
                    }}
                    onFocus={(e) => {
                      autoResizeAssistantInput(e.target);
                    }}
                    spellCheck={true}
                    className="flex-1 bg-transparent text-base text-slate-100 placeholder:text-slate-500 outline-none resize-none px-0 py-1 transition-all duration-200 selection:bg-blue-500/60 selection:text-white overflow-y-auto"
                    placeholder="Type your message here..."
                    rows={1}
                  />
                  <div className="flex items-center gap-2 justify-between">
                  <button
                    type="button"
                    onClick={() => setShowQuickActions((v) => !v)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-100 hover:bg-white/10"
                  >
                    <Settings2 className="h-4 w-4" />
                  </button>
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-6 w-6 transition-colors ${
                      assistantInput.trim() 
                        ? "text-sky-500 cursor-pointer hover:text-sky-400" 
                        : "text-slate-600 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM8.47 8.98L11.47 5.98C11.54 5.91 11.62 5.86 11.71 5.82C11.89 5.74 12.1 5.74 12.28 5.82C12.37 5.86 12.45 5.91 12.52 5.98L15.52 8.98C15.81 9.27 15.81 9.75 15.52 10.04C15.37 10.19 15.18 10.26 14.99 10.26C14.8 10.26 14.61 10.19 14.46 10.04L12.74 8.32V14.51C12.74 14.92 12.4 15.26 11.99 15.26C11.58 15.26 11.24 14.92 11.24 14.51V8.32L9.52 10.04C9.23 10.33 8.75 10.33 8.46 10.04C8.17 9.75 8.18 9.28 8.47 8.98ZM18.24 17.22C16.23 17.89 14.12 18.23 12 18.23C9.88 18.23 7.77 17.89 5.76 17.22C5.37 17.09 5.16 16.66 5.29 16.27C5.42 15.88 5.85 15.66 6.24 15.8C9.96 17.04 14.05 17.04 17.77 15.8C18.16 15.67 18.59 15.88 18.72 16.27C18.84 16.67 18.63 17.09 18.24 17.22Z" fill="currentColor"/>
                  </svg>
                  </div>
                </div>
              </div>
            </div>
              </aside>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>

      {/* Database Setup Popup */}
      {showDatabasePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-neutral-900 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 border border-sky-400/70">
                  <Database className="h-4 w-4 text-sky-300" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-50">UR-DEV Database</div>
                  <div className="text-[11px] text-slate-400">
                    Create a stable connection for your web &amp; mobile apps.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseDatabasePopup}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-300 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {dbState === "idle" && (
                <>
                  <p className="text-sm text-slate-200">
                    UR-DEV will provision a dedicated database workspace, wire it into your project,
                    and prepare migrations so you keep full control over your schema.
                  </p>
                  <ul className="mt-4 space-y-1 text-[12px] text-slate-300">
                    <li>• Creates or connects a Supabase Postgres instance.</li>
                    <li>• Stores credentials securely inside UR-DEV secrets.</li>
                    <li>• Prepares default tables for auth, profiles, and projects.</li>
                  </ul>

                  <button
                    type="button"
                    onClick={handleConnectDatabase}
                    className="mt-6 flex w-full items-center justify-center rounded-lg bg-sky-500 px-4 py-3 text-sm font-semibold text-black shadow-[0_0_26px_rgba(56,189,248,0.9)] hover:bg-sky-400"
                  >
                    Connect to Database
                  </button>

                  <p className="mt-3 text-[11px] text-slate-500">
                    This will establish a secure connection between your UR-DEV workspace and the
                    underlying database. No changes are applied until you confirm migrations.
                  </p>
                </>
              )}

              {dbState === "creating" && (
                <>
                  <div className="rounded-xl border border-sky-500/40 bg-sky-950/40 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-sky-100">
                      <span className="relative inline-flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400/70 opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-400" />
                      </span>
                      <span>Creating UR-DEV database…</span>
                    </div>
                    <p className="mt-2 text-[11px] text-sky-100/80">
                      Provisioning Postgres instance, applying base schema, and syncing credentials
                      with your workspace.
                    </p>

                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                      <div className="h-full w-1/3 animate-pulse bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300" />
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-300">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" />
                      <span>Step 1 · Reserving database workspace…</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-400/50" />
                      <span>Step 2 · Preparing auth &amp; profile tables…</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-500/60" />
                      <span>Step 3 · Wiring UR-DEV editor to schema…</span>
                    </div>
                  </div>

                  <p className="mt-4 text-[11px] text-slate-500">
                    You can keep working in the editor while UR-DEV finishes this step. Once ready,
                    database tables will appear in your workspace sidebar.
                  </p>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleCloseDatabasePopup}
                      className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] text-slate-100 hover:bg-white/10"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GitHub Integration Modal */}
      <GitHubIntegration
        isOpen={showGitHubModal}
        onClose={() => setShowGitHubModal(false)}
        buttonRef={githubButtonRef}
      />

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-[95vw] w-[1600px] h-[90vh] p-0 border-0 bg-transparent shadow-none">
          <AccountSettings />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UrDevEditorPage;
