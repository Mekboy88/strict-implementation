import { LayoutGrid, Code, Bug, FileEdit, MessageSquare, Check } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Workspace {
  id: string;
  name: string;
  description: string;
  icon: any;
  layout: {
    explorer: boolean;
    assistant: boolean;
    minimap: boolean;
  };
  color: string;
}

const workspaces: Workspace[] = [
  {
    id: "default",
    name: "Default",
    description: "Standard coding layout with all panels",
    icon: LayoutGrid,
    layout: { explorer: true, assistant: true, minimap: true },
    color: "text-blue-400 bg-blue-950/30 border-blue-500/30",
  },
  {
    id: "debug",
    name: "Debug",
    description: "Optimized for debugging with explorer",
    icon: Bug,
    layout: { explorer: true, assistant: false, minimap: false },
    color: "text-red-400 bg-red-950/30 border-red-500/30",
  },
  {
    id: "writing",
    name: "Writing",
    description: "Distraction-free with just code editor",
    icon: FileEdit,
    layout: { explorer: false, assistant: false, minimap: true },
    color: "text-purple-400 bg-purple-950/30 border-purple-500/30",
  },
  {
    id: "ai-chat",
    name: "AI Chat",
    description: "Focus on AI assistant collaboration",
    icon: MessageSquare,
    layout: { explorer: false, assistant: true, minimap: false },
    color: "text-emerald-400 bg-emerald-950/30 border-emerald-500/30",
  },
];

const WorkspaceSelector = () => {
  const [activeWorkspace, setActiveWorkspace] = useState("default");
  const [open, setOpen] = useState(false);

  const currentWorkspace = workspaces.find(w => w.id === activeWorkspace) || workspaces[0];
  const CurrentIcon = currentWorkspace.icon;

  const handleWorkspaceChange = (workspace: Workspace) => {
    setActiveWorkspace(workspace.id);
    console.log(`Switching to ${workspace.name} layout:`, workspace.layout);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-all hover:bg-ide-hover border border-transparent hover:border-emerald-500/30"
        >
          <CurrentIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-foreground font-medium">{currentWorkspace.name}</span>
          <span className="text-muted-foreground text-xs">Workspace</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-ide-panel border-ide-border p-0 shadow-xl">
        <div className="p-3 border-b border-ide-border">
          <h4 className="text-sm font-semibold text-foreground">Select Workspace</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Choose a workspace layout that suits your workflow
          </p>
        </div>
        <div className="p-2 space-y-1">
          {workspaces.map((workspace) => {
            const Icon = workspace.icon;
            const isActive = workspace.id === activeWorkspace;
            
            return (
              <button
                key={workspace.id}
                onClick={() => handleWorkspaceChange(workspace)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all ${
                  isActive 
                    ? `${workspace.color} border-current` 
                    : 'border-transparent hover:bg-ide-hover'
                }`}
              >
                <div className={`p-2 rounded-lg ${workspace.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{workspace.name}</span>
                    {isActive && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{workspace.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WorkspaceSelector;
