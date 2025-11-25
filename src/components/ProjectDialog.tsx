import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { 
  FolderPlus, 
  Folder, 
  Trash2, 
  Loader2, 
  Clock,
  FileCode2,
  Monitor,
  Smartphone,
  Link2
} from "lucide-react";
import type { Project, ProjectVariantType } from "@/services/projects/supabaseProjectService";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  isLoading: boolean;
  onCreateProject: (name: string, description?: string, variantType?: ProjectVariantType, createPaired?: boolean) => Promise<any>;
  onLoadProject: (projectId: string) => Promise<any>;
  onDeleteProject: (projectId: string) => Promise<boolean>;
  currentProjectId?: string;
}

export function ProjectDialog({
  open,
  onOpenChange,
  projects,
  isLoading,
  onCreateProject,
  onLoadProject,
  onDeleteProject,
  currentProjectId,
}: ProjectDialogProps) {
  const [view, setView] = useState<"list" | "create">("list");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [createBothVariants, setCreateBothVariants] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!newProjectName.trim()) return;
    
    setIsCreating(true);
    const project = await onCreateProject(
      newProjectName.trim(), 
      newProjectDesc.trim() || undefined,
      'web',
      createBothVariants
    );
    setIsCreating(false);
    
    if (project) {
      setNewProjectName("");
      setNewProjectDesc("");
      setCreateBothVariants(true);
      setView("list");
      onOpenChange(false);
    }
  };

  const handleLoad = async (projectId: string) => {
    await onLoadProject(projectId);
    onOpenChange(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Group projects by their base name (paired projects together)
  const groupedProjects = projects.reduce((acc, project) => {
    const baseName = project.name.replace(/\s*\((Web|Mobile)\)\s*$/, '');
    if (!acc[baseName]) {
      acc[baseName] = { web: null, mobile: null, standalone: null };
    }
    
    if (project.paired_project_id) {
      if (project.variant_type === 'web') {
        acc[baseName].web = project;
      } else {
        acc[baseName].mobile = project;
      }
    } else {
      // Standalone project
      if (acc[baseName].standalone) {
        // Multiple standalone with same base name, use full name
        acc[project.name] = { web: null, mobile: null, standalone: project };
      } else {
        acc[baseName].standalone = project;
      }
    }
    
    return acc;
  }, {} as Record<string, { web: Project | null; mobile: Project | null; standalone: Project | null }>);

  const getVariantIcon = (type: ProjectVariantType | undefined) => {
    if (type === 'mobile') return <Smartphone className="w-4 h-4 text-purple-400" />;
    return <Monitor className="w-4 h-4 text-sky-400" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-neutral-900 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-slate-100">
            {view === "list" ? "Your Projects" : "New Project"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {view === "list" 
              ? "Open an existing project or create a new one"
              : "Create a project with web and mobile versions"}
          </DialogDescription>
        </DialogHeader>

        {view === "list" ? (
          <div className="space-y-4">
            <Button
              onClick={() => setView("create")}
              className="w-full bg-white text-neutral-900 hover:bg-white/90"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Project
            </Button>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No projects yet</p>
                <p className="text-sm">Create your first project to get started</p>
              </div>
            ) : (
              <ScrollArea className="h-72">
                <div className="space-y-2">
                  {Object.entries(groupedProjects).map(([baseName, group]) => {
                    const hasPair = group.web && group.mobile;
                    const project = group.standalone || group.web || group.mobile;
                    
                    if (!project) return null;

                    return (
                      <div
                        key={baseName}
                        className={`rounded-lg border transition-colors ${
                          currentProjectId === project.id || 
                          currentProjectId === group.web?.id || 
                          currentProjectId === group.mobile?.id
                            ? "bg-white/5 border-white/20"
                            : "bg-neutral-800 border-neutral-700 hover:border-neutral-600"
                        }`}
                      >
                        {/* Project Header */}
                        <div className="flex items-center justify-between p-3 border-b border-neutral-700/50">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <FileCode2 className="w-5 h-5 text-white/70 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-100 truncate">
                                {baseName}
                              </p>
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(project.updated_at)}
                                {hasPair && (
                                  <span className="ml-2 flex items-center gap-1 text-emerald-400">
                                    <Link2 className="w-3 h-3" />
                                    Paired
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Delete both if paired
                              if (group.web) onDeleteProject(group.web.id);
                              if (group.mobile) onDeleteProject(group.mobile.id);
                              if (group.standalone) onDeleteProject(group.standalone.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Variant Buttons */}
                        <div className="flex gap-2 p-2">
                          {(group.web || group.standalone?.variant_type === 'web' || !group.standalone?.variant_type) && (
                            <button
                              onClick={() => handleLoad((group.web || group.standalone)!.id)}
                              className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${
                                currentProjectId === (group.web || group.standalone)?.id
                                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                  : "bg-neutral-700/50 text-slate-300 hover:bg-neutral-700 border border-transparent"
                              }`}
                            >
                              <Monitor className="w-4 h-4" />
                              <span>Web</span>
                            </button>
                          )}
                          
                          {(group.mobile || group.standalone?.variant_type === 'mobile') && (
                            <button
                              onClick={() => handleLoad((group.mobile || group.standalone)!.id)}
                              className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${
                                currentProjectId === (group.mobile || group.standalone)?.id
                                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                  : "bg-neutral-700/50 text-slate-300 hover:bg-neutral-700 border border-transparent"
                              }`}
                            >
                              <Smartphone className="w-4 h-4" />
                              <span>Mobile</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-slate-200">
                Project Name
              </Label>
              <Input
                id="projectName"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="My Awesome Project"
                className="bg-neutral-800 border-neutral-700 text-slate-100"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDesc" className="text-slate-200">
                Description (optional)
              </Label>
              <Textarea
                id="projectDesc"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                placeholder="A brief description of your project"
                className="bg-neutral-800 border-neutral-700 text-slate-100 resize-none"
                rows={3}
              />
            </div>

            {/* Create Both Variants Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Monitor className="w-4 h-4 text-sky-400" />
                  <span className="text-slate-500">+</span>
                  <Smartphone className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Create Web & Mobile
                  </p>
                  <p className="text-xs text-slate-500">
                    Both versions will be linked together
                  </p>
                </div>
              </div>
              <Switch
                checked={createBothVariants}
                onCheckedChange={setCreateBothVariants}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-neutral-700 text-slate-300 hover:bg-neutral-800"
                onClick={() => setView("list")}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-white text-neutral-900 hover:bg-white/90"
                onClick={handleCreate}
                disabled={!newProjectName.trim() || isCreating}
              >
                {isCreating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Create Project"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
