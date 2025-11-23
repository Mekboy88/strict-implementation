import { Code, FolderTree, Monitor, Smartphone, Database, Eye, Search, Lightbulb, ChevronDown, Bug, Layers, Wand2, Palette, Settings, Sparkles, Keyboard, Info, Rocket, Home } from "lucide-react";
import supabaseLogo from "@/assets/supabase-logo-icon.svg";
import githubLogo from "@/assets/github-mark.svg";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FileTree from "@/components/FileTree";
import EditorPanel from "@/components/EditorPanel";
import AssistantPanel from "@/components/AssistantPanel";
import EditorTabs from "@/components/EditorTabs";
import CommandPalette from "@/components/CommandPalette";
import UnifiedMenuDropdown from "@/components/UnifiedMenuDropdown";
import MobilePreview from "@/components/MobilePreview";
import PremiumSettingsDropup from "@/components/PremiumSettingsDropup";
import { GitHubIntegration } from "@/components/GitHubIntegration";
import { CloudIntegration } from "@/components/CloudIntegration";
import { BuildingLoadingScreen } from "@/components/BuildingLoadingScreen";
import { useProjectInit } from "@/hooks/useProjectInit";
import { Button } from "@/components/ui/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePreviewStore } from "@/stores/usePreviewStore";
import { useFileSystemStore } from "@/stores/useFileSystemStore";

const Index = () => {
  const navigate = useNavigate();
  const { isInitializing, isReady } = useProjectInit();
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [activePlatform, setActivePlatform] = useState<"web" | "mobile">("web");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeDeviceView, setActiveDeviceView] = useState<'desktop' | 'mobile' | 'preview'>('desktop');
  const [githubPopupOpen, setGithubPopupOpen] = useState(false);
  const [cloudPopupOpen, setCloudPopupOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
  const githubButtonRef = useRef<HTMLButtonElement>(null);
  const cloudButtonRef = useRef<HTMLButtonElement>(null);
  const githubPopupRef = useRef<HTMLDivElement>(null);
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);
  const [showBuildingScreen, setShowBuildingScreen] = useState(false);
  const { setDesktopPreview, setMobilePreview } = usePreviewStore();
  const { getFileContent } = useFileSystemStore();

  // Extract prompt and type from URL or location state on mount
  useEffect(() => {
    const locationState = window.history.state?.usr;
    
    if (locationState?.showBuildingAnimation) {
      setShowBuildingScreen(true);
    }
    
    if (locationState?.initialPrompt) {
      setInitialPrompt(locationState.initialPrompt);
    }
    
    if (locationState?.detectedType === 'mobile') {
      setActivePlatform('mobile');
      setActiveDeviceView('mobile');
    } else if (locationState?.detectedType === 'web') {
      setActivePlatform('web');
      setActiveDeviceView('desktop');
    }
    
    const searchParams = new URLSearchParams(window.location.search);
    const prompt = searchParams.get('prompt');
    const type = searchParams.get('type');
    
    if (prompt) {
      setInitialPrompt(prompt);
    }
    
    if (type === 'mobile') {
      setActivePlatform('mobile');
      setActiveDeviceView('mobile');
    } else if (type === 'web') {
      setActivePlatform('web');
      setActiveDeviceView('desktop');
    }
    
    // Clear the URL parameters after extracting them
    if (prompt || type) {
      window.history.replaceState({}, '', '/ide');
    }
  }, []);

  // Sync device view with platform changes
  useEffect(() => {
    if (activePlatform === 'mobile') {
      setActiveDeviceView('mobile');
      const mobileHtml = getFileContent('mobile/public/preview.html') || getFileContent('mobile/index.html');
      if (mobileHtml) {
        setMobilePreview(mobileHtml);
      }
    } else if (activePlatform === 'web') {
      setActiveDeviceView('desktop');
      const desktopHtml = getFileContent('public/preview.html');
      if (desktopHtml) {
        setDesktopPreview(desktopHtml);
      }
    }
  }, [activePlatform, getFileContent, setDesktopPreview, setMobilePreview]);
  
  const [supabasePopupOpen, setSupabasePopupOpen] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [showProjectList, setShowProjectList] = useState(false);
  const supabaseButtonRef = useRef<HTMLButtonElement>(null);
  const supabasePopupRef = useRef<HTMLDivElement>(null);
  
  // Mock projects data
  const supabaseProjects = [
    { id: '1', name: 'Production App', org: 'Main Organization' },
    { id: '2', name: 'Staging Environment', org: 'Main Organization' },
    { id: '3', name: 'Dev Workspace', org: 'Testing Team' },
  ];

  const themes = [
    { name: "Dark", gradient: "from-zinc-900 to-black" },
    { name: "Deep Blue", gradient: "from-blue-950 to-slate-900" },
    { name: "Midnight", gradient: "from-indigo-950 to-slate-950" },
    { name: "Hacker Green", gradient: "from-green-950 to-emerald-950" },
  ];

  const toggleExplorer = () => {
    setExplorerOpen(prev => !prev);
  };

  // Close GitHub popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        githubPopupOpen &&
        githubPopupRef.current &&
        !githubPopupRef.current.contains(event.target as Node) &&
        githubButtonRef.current &&
        !githubButtonRef.current.contains(event.target as Node)
      ) {
        setGithubPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [githubPopupOpen]);

  // Close Supabase popup when clicking outside or ESC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        supabasePopupOpen &&
        supabasePopupRef.current &&
        !supabasePopupRef.current.contains(event.target as Node) &&
        supabaseButtonRef.current &&
        !supabaseButtonRef.current.contains(event.target as Node)
      ) {
        setSupabasePopupOpen(false);
        setShowProjectList(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && supabasePopupOpen) {
        setSupabasePopupOpen(false);
        setShowProjectList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [supabasePopupOpen]);

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Command Palette */}
      <CommandPalette />
      
      {/* Top Bar */}
      <header className="h-12 bg-ide-panel border-b border-ide-border flex items-center px-3 flex-shrink-0 relative">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1 hover:bg-white/5 hover:backdrop-blur-md rounded transition-colors">
              <Code className="w-5 h-5 text-ide-active" />
              <h1 className="text-sm font-semibold text-foreground">
                Codient
              </h1>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              align="start" 
              className="w-64 bg-ide-panel border-ide-border shadow-xl z-50"
              sideOffset={8}
            >
              <DropdownMenuItem 
                onClick={() => navigate('/')}
                className="flex items-center gap-3 cursor-pointer hover:bg-blue-500/10 hover:backdrop-blur-md transition-all"
              >
                <Home className="w-4 h-4 text-gray-400" />
                <span>Back to Home</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-ide-border" />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center gap-3 hover:bg-blue-500/10 hover:backdrop-blur-md transition-all">
                  <Wand2 className="w-4 h-4 text-purple-400" />
                  <span>AI Tools</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-ide-panel border-ide-border z-50">
                  <DropdownMenuItem className="flex items-center gap-3 cursor-pointer hover:bg-blue-500/10 hover:backdrop-blur-md transition-all">
                    <Bug className="w-4 h-4 text-red-400" />
                    <span>Debug</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-3 cursor-pointer hover:bg-blue-500/10 hover:backdrop-blur-md transition-all">
                    <Wand2 className="w-4 h-4 text-green-400" />
                    <span>Fix Code</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center gap-3 hover:bg-blue-500/10 hover:backdrop-blur-md transition-all">
                  <Palette className="w-4 h-4 text-pink-400" />
                  <span>Themes</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-ide-panel border-ide-border z-50">
                  {themes.map((theme) => (
                    <DropdownMenuItem 
                      key={theme.name}
                      className="flex items-center gap-3 cursor-pointer hover:bg-blue-500/10 hover:backdrop-blur-md transition-all"
                    >
                      <div className={`w-4 h-4 rounded bg-gradient-to-br ${theme.gradient}`} />
                      <span>{theme.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem 
                onClick={() => setSettingsOpen(true)}
                className="flex items-center gap-3 cursor-pointer hover:bg-blue-500/10 hover:backdrop-blur-md transition-all"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ChevronDown className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Untitled</span>
        </div>

        <div className="flex-1 flex items-center justify-center gap-0">
          <div className="flex items-center gap-0 border border-ide-border rounded-full px-1 py-1 backdrop-blur-md bg-ide-panel/30">
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-4 py-1.5 text-sm rounded-full transition-colors backdrop-blur-sm ${
                viewMode === 'preview' 
                  ? 'bg-blue-500/10 text-blue-400 font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Preview
            </button>
            <button 
              className="px-4 py-1.5 text-sm rounded-full text-muted-foreground hover:text-foreground transition-colors backdrop-blur-sm hover:bg-white/5"
            >
              Design
            </button>
            <button 
              onClick={() => setViewMode('code')}
              className={`px-4 py-1.5 text-sm rounded-full transition-colors backdrop-blur-sm ${
                viewMode === 'code'
                  ? 'bg-blue-500/10 text-blue-400 font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Code
            </button>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            <span className="text-sm font-medium text-gray-300">A</span>
          </div>

          <Button className="bg-blue-500/10 hover:bg-blue-500/15 text-blue-400 h-8 px-4 text-sm font-medium rounded-full backdrop-blur-md border border-blue-500/20">
            Invite
          </Button>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Icon Sidebar - Very narrow with just icons */}
        <div className="w-12 bg-[#1a1a1a] border-r border-ide-border flex flex-col items-center py-3 gap-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleExplorer}
                  className={`w-12 h-10 flex items-center justify-center transition-colors relative ${
                    explorerOpen
                      ? 'text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <FolderTree className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Explorer</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-12 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Search</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-12 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Layers className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Source Control</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-12 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Bug className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Debug</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setSupabasePopupOpen(!supabasePopupOpen)}
                  ref={supabaseButtonRef}
                  className="w-12 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors relative"
                >
                  <img src={supabaseLogo} alt="Supabase" className="w-5 h-5" />
                  {supabaseConnected && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Supabase</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => {
                    console.log("GitHub button clicked, current state:", githubPopupOpen);
                    setGithubPopupOpen(!githubPopupOpen);
                  }}
                  ref={githubButtonRef}
                  className="w-12 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <img src={githubLogo} alt="GitHub" className="w-5 h-5 brightness-[3] invert" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>GitHub</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setCloudPopupOpen(!cloudPopupOpen)}
                  ref={cloudButtonRef}
                  className="w-12 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 56 56" xmlSpace="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path style={{fill:"#545E73"}} d="M49.455,8L49.455,8C48.724,3.538,38.281,0,25.5,0S2.276,3.538,1.545,8l0,0H1.5v0.5V20v0.5V21v11 v0.5V33v12h0.045c0.731,4.461,11.175,8,23.955,8s23.224-3.539,23.955-8H49.5V33v-0.5V32V21v-0.5V20V8.5V8H49.455z"></path> <g> <path style={{fill:"#38454F"}} d="M25.5,41c-13.255,0-24-3.806-24-8.5V45h0.045c0.731,4.461,11.175,8,23.955,8 s23.224-3.539,23.955-8H49.5V32.5C49.5,37.194,38.755,41,25.5,41z"></path> <path style={{fill:"#38454F"}} d="M1.5,32v0.5c0-0.168,0.018-0.334,0.045-0.5H1.5z"></path> <path style={{fill:"#38454F"}} d="M49.455,32c0.027,0.166,0.045,0.332,0.045,0.5V32H49.455z"></path> </g> <g> <path style={{fill:"#556080"}} d="M25.5,29c-13.255,0-24-3.806-24-8.5V33h0.045c0.731,4.461,11.175,8,23.955,8 s23.224-3.539,23.955-8H49.5V20.5C49.5,25.194,38.755,29,25.5,29z"></path> <path style={{fill:"#556080"}} d="M1.5,20v0.5c0-0.168,0.018-0.334,0.045-0.5H1.5z"></path> <path style={{fill:"#556080"}} d="M49.455,20c0.027,0.166,0.045,0.332,0.045,0.5V20H49.455z"></path> </g> <ellipse style={{fill:"#91BAE1"}} cx="25.5" cy="8.5" rx="24" ry="8.5"></ellipse> <g> <path style={{fill:"#8697CB"}} d="M25.5,17c-13.255,0-24-3.806-24-8.5V21h0.045c0.731,4.461,11.175,8,23.955,8 s23.224-3.539,23.955-8H49.5V8.5C49.5,13.194,38.755,17,25.5,17z"></path> <path style={{fill:"#8697CB"}} d="M1.5,8v0.5c0-0.168,0.018-0.334,0.045-0.5H1.5z"></path> <path style={{fill:"#8697CB"}} d="M49.455,8C49.482,8.166,49.5,8.332,49.5,8.5V8H49.455z"></path> </g> </g> <g> <g> <path style={{fill:"#48A0DC"}} d="M49.545,45.111C49.494,41.175,46.382,38,42.546,38c-2.568,0-4.806,1.426-6.025,3.546 c-0.421-0.141-0.87-0.22-1.337-0.22c-2.063,0-3.785,1.492-4.208,3.484C29.221,45.675,28,47.516,28,49.641 C28,52.589,30.343,55,33.208,55h10.775c0.061,0,0.119-0.007,0.18-0.009c0.06,0.002,0.119,0.009,0.18,0.009h4.31 c2.667,0,4.849-2.245,4.849-4.989C53.5,47.581,51.788,45.546,49.545,45.111z"></path> <path style={{fill:"#B1D3EF"}} d="M48.651,56h-4.31c-0.063,0-0.126-0.004-0.188-0.008C44.106,55.996,44.045,56,43.982,56H33.208 C29.785,56,27,53.147,27,49.642c0-2.262,1.209-4.372,3.116-5.503c0.686-2.235,2.746-3.813,5.066-3.813 c0.296,0,0.592,0.025,0.884,0.076C37.562,38.286,39.98,37,42.546,37c4.102,0,7.524,3.225,7.954,7.332 c2.358,0.806,4,3.079,4,5.679C54.5,53.313,51.876,56,48.651,56z M44.114,53.991l0.186,0.006L48.651,54 c2.122,0,3.849-1.79,3.849-3.989c0-1.917-1.323-3.564-3.146-3.919l-0.799-0.155l-0.011-0.813C48.501,41.747,45.811,39,42.546,39 c-2.135,0-4.063,1.139-5.158,3.045l-0.409,0.711l-0.777-0.261c-0.332-0.112-0.675-0.169-1.019-0.169 c-1.54,0-2.898,1.133-3.229,2.692l-0.102,0.475l-0.435,0.214C29.948,46.432,29,47.976,29,49.642C29,52.045,30.888,54,33.208,54 L44.114,53.991z"></path> </g> </g> </g> </g></svg>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>UR-DEV Cloud</p>
              </TooltipContent>
            </Tooltip>

            <div className="flex-1" />

            {/* Device selector buttons at bottom of sidebar */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveDeviceView('desktop')}
                  className={`w-12 h-10 flex items-center justify-center transition-colors relative ${
                    activeDeviceView === 'desktop'
                      ? 'text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Monitor className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Desktop View</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveDeviceView('mobile')}
                  className={`w-12 h-10 flex items-center justify-center transition-colors relative ${
                    activeDeviceView === 'mobile'
                      ? 'text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Mobile View</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-12 h-10 flex items-center justify-center text-yellow-400 hover:text-yellow-300 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Premium</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="w-12 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Explorer Panel - Toggleable */}
          {explorerOpen && (
            <>
              <ResizablePanel defaultSize={18} minSize={15} maxSize={30}>
                <FileTree activePlatform={activePlatform} onPlatformChange={setActivePlatform} />
              </ResizablePanel>
              <ResizableHandle withHandle className="w-px bg-ide-border hover:bg-ide-active transition-colors" />
            </>
          )}

          {/* Center area - Editor with tabs */}
          <ResizablePanel defaultSize={explorerOpen ? 52 : 70} minSize={30}>
            <div className="h-full flex flex-col">
              {/* Editor Tabs */}
              {viewMode === 'code' && <EditorTabs viewMode={viewMode} />}
              {/* Editor Content */}
              <div className="flex-1 min-h-0">
                {activeDeviceView === 'mobile' && viewMode === 'preview' ? (
                  <MobilePreview />
                ) : (
                  <EditorPanel viewMode={viewMode} />
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="w-px bg-ide-border hover:bg-ide-active transition-colors" />

          {/* Right Panel - AI Assistance */}
          <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
            <AssistantPanel 
              explorerOpen={explorerOpen} 
              onToggleExplorer={toggleExplorer} 
              onOpenSettings={() => setSettingsOpen(true)}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              initialPrompt={initialPrompt}
              activePlatform={activePlatform}
              onBuildComplete={() => setShowBuildingScreen(false)}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Premium Settings Drop-up */}
      <PremiumSettingsDropup isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* GitHub Integration Popup */}
      <GitHubIntegration 
        isOpen={githubPopupOpen} 
        onClose={() => {
          console.log("Closing GitHub popup");
          setGithubPopupOpen(false);
        }} 
        buttonRef={githubButtonRef}
      />

      {/* Cloud Integration Popup */}
      <CloudIntegration 
        isOpen={cloudPopupOpen} 
        onClose={() => setCloudPopupOpen(false)} 
        buttonRef={cloudButtonRef}
      />

      {/* Building Loading Screen - Shows when building from landing page */}
      {showBuildingScreen && <BuildingLoadingScreen />}
    </div>
  );
};

export default Index;
