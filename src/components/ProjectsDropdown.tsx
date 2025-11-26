import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Monitor, Smartphone, LayoutDashboard, Plus, ExternalLink } from "lucide-react";

export interface Project {
  id: string;
  name: string;
  type: "website" | "mobile" | "dashboard";
  description?: string;
  createdAt: Date;
  previewUrl?: string;
}

interface ProjectsDropdownProps {
  projects: Project[];
  onNewProject: () => void;
  onSelectProject: (project: Project) => void;
}

const ProjectCard: React.FC<{ project: Project; onSelect: () => void }> = ({ project, onSelect }) => {
  const getTypeIcon = () => {
    switch (project.type) {
      case "mobile":
        return <Smartphone className="h-3 w-3" />;
      case "dashboard":
        return <LayoutDashboard className="h-3 w-3" />;
      default:
        return <Monitor className="h-3 w-3" />;
    }
  };

  const getTypeBadge = () => {
    switch (project.type) {
      case "mobile":
        return "Mobile";
      case "dashboard":
        return "Dashboard";
      default:
        return "Website";
    }
  };

  const getTypeColor = () => {
    switch (project.type) {
      case "mobile":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "dashboard":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      default:
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
    }
  };

  return (
    <button
      onClick={onSelect}
      className="group relative flex flex-col rounded-xl border border-white/10 bg-neutral-800/50 hover:bg-neutral-800 hover:border-white/20 transition-all overflow-hidden"
    >
      {/* Preview Frame */}
      <div className="relative aspect-[16/10] bg-neutral-900 overflow-hidden">
        {project.type === "mobile" ? (
          // Mobile frame
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <div className="relative h-full aspect-[9/16] max-h-full bg-black rounded-[12px] border-2 border-neutral-700 overflow-hidden shadow-xl">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-neutral-800 rounded-b-lg z-10"></div>
              {/* Screen content */}
              <div className="h-full w-full bg-gradient-to-b from-neutral-800 to-neutral-900 flex items-center justify-center">
                <div className="text-[8px] text-neutral-500 text-center px-1">
                  <Smartphone className="h-4 w-4 mx-auto mb-1 opacity-50" />
                  {project.name}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Web/Dashboard frame
          <div className="absolute inset-0 p-2">
            <div className="h-full w-full rounded-lg border border-neutral-700 bg-black overflow-hidden shadow-xl">
              {/* Browser chrome */}
              <div className="h-4 bg-neutral-800 border-b border-neutral-700 flex items-center px-2 gap-1">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/60"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/60"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/60"></div>
                </div>
                <div className="flex-1 mx-2">
                  <div className="h-2 bg-neutral-700 rounded-sm max-w-[60px]"></div>
                </div>
              </div>
              {/* Page content */}
              <div className="h-[calc(100%-1rem)] bg-gradient-to-b from-neutral-800 to-neutral-900 flex items-center justify-center">
                <div className="text-[8px] text-neutral-500 text-center px-1">
                  <Monitor className="h-4 w-4 mx-auto mb-1 opacity-50" />
                  {project.name}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="flex items-center gap-1 text-[10px] text-white/80">
            <ExternalLink className="h-3 w-3" /> Open
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5 text-left">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="text-xs font-medium text-white truncate">{project.name}</h4>
          <span className={`flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full border ${getTypeColor()}`}>
            {getTypeIcon()}
            {getTypeBadge()}
          </span>
        </div>
        {project.description && (
          <p className="text-[10px] text-neutral-400 truncate">{project.description}</p>
        )}
      </div>
    </button>
  );
};

export const ProjectsDropdown: React.FC<ProjectsDropdownProps> = ({
  projects,
  onNewProject,
  onSelectProject,
}) => {
  if (projects.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 text-xs text-gray-300 hover:text-white transition focus:outline-none">
          Your Projects
          <span className="flex items-center justify-center h-4 w-4 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-medium">
            {projects.length}
          </span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-[420px] bg-neutral-900 border-neutral-700 z-50 p-4 rounded-xl"
        align="start"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Your Projects</h3>
            <p className="text-[10px] text-neutral-400 mt-0.5">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium transition"
          >
            <Plus className="h-3 w-3" />
            New Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={() => onSelectProject(project)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-neutral-800">
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-neutral-800 text-xs text-neutral-400 hover:text-white transition">
            View all projects
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
