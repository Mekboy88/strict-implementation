import { ChevronDown, Bug, Layers, Wand2, Palette, Settings, Sparkles, Keyboard, Info } from "lucide-react";
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

interface UnifiedMenuDropdownProps {
  onDebugClick?: () => void;
  onWorkspaceClick?: () => void;
  onThemeChange?: (theme: string) => void;
  onSettingsClick?: () => void;
  onFutureFeaturesClick?: () => void;
}

const UnifiedMenuDropdown = ({
  onDebugClick,
  onWorkspaceClick,
  onThemeChange,
  onSettingsClick,
  onFutureFeaturesClick,
}: UnifiedMenuDropdownProps) => {
  const aiTools = [
    { icon: Bug, label: "Debug", color: "text-red-400" },
    { icon: Wand2, label: "Fix Code", color: "text-green-400" },
  ];

  const themes = [
    { name: "Dark", gradient: "from-zinc-900 to-black" },
    { name: "Deep Blue", gradient: "from-blue-950 to-slate-900" },
    { name: "Midnight", gradient: "from-indigo-950 to-slate-950" },
    { name: "Hacker Green", gradient: "from-green-950 to-emerald-950" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-1.5 text-sm rounded-md bg-gradient-to-r from-ide-panel to-ide-hover border border-ide-border hover:from-ide-hover hover:to-ide-active transition-all shadow-sm text-foreground">
        <span className="font-medium">Menu</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        className="w-56 bg-ide-panel border-ide-border shadow-xl"
      >
        <DropdownMenuLabel className="text-muted-foreground text-xs uppercase tracking-wider">
          Navigation
        </DropdownMenuLabel>
        
        <DropdownMenuItem 
          onClick={onDebugClick}
          className="flex items-center gap-3 cursor-pointer hover:bg-ide-hover"
        >
          <Bug className="w-4 h-4 text-red-400" />
          <span>Debug</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={onWorkspaceClick}
          className="flex items-center gap-3 cursor-pointer hover:bg-ide-hover"
        >
          <Layers className="w-4 h-4 text-blue-400" />
          <span>Workspace</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-ide-border" />

        <DropdownMenuLabel className="text-muted-foreground text-xs uppercase tracking-wider">
          Tools
        </DropdownMenuLabel>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-3 cursor-pointer hover:bg-ide-hover">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Tools</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-ide-panel border-ide-border">
            {aiTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <DropdownMenuItem 
                  key={tool.label}
                  className="flex items-center gap-3 cursor-pointer hover:bg-ide-hover"
                >
                  <Icon className={`w-4 h-4 ${tool.color}`} />
                  <span>{tool.label}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-3 cursor-pointer hover:bg-ide-hover">
            <Palette className="w-4 h-4 text-pink-400" />
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-ide-panel border-ide-border">
            {themes.map((theme) => (
              <DropdownMenuItem 
                key={theme.name}
                onClick={() => onThemeChange?.(theme.name)}
                className="flex items-center gap-3 cursor-pointer hover:bg-ide-hover"
              >
                <div className={`w-4 h-4 rounded bg-gradient-to-br ${theme.gradient}`} />
                <span>{theme.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator className="bg-ide-border" />

        <DropdownMenuItem 
          onClick={onSettingsClick}
          className="flex items-center gap-3 cursor-pointer hover:bg-ide-hover"
        >
          <Settings className="w-4 h-4 text-gray-400" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          className="flex items-center gap-3 cursor-pointer hover:bg-ide-hover"
        >
          <Keyboard className="w-4 h-4 text-yellow-400" />
          <span>Shortcuts</span>
          <kbd className="ml-auto text-xs bg-ide-panel px-1.5 py-0.5 rounded">Ctrl+K K</kbd>
        </DropdownMenuItem>

        <DropdownMenuItem 
          className="flex items-center gap-3 cursor-pointer hover:bg-ide-hover"
        >
          <Info className="w-4 h-4 text-cyan-400" />
          <span>About</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UnifiedMenuDropdown;
