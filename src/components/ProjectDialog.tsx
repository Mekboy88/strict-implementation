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
import { 
  FolderPlus, 
  Folder, 
  Trash2, 
  Loader2, 
  Clock,
  FileCode2 
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  isLoading: boolean;
  onCreateProject: (name: string, description?: string) => Promise<any>;
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
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!newProjectName.trim()) return;
    
    setIsCreating(true);
    const project = await onCreateProject(newProjectName.trim(), newProjectDesc.trim() || undefined);
    setIsCreating(false);
    
    if (project) {
      setNewProjectName("");
      setNewProjectDesc("");
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-neutral-900 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-slate-100">
            {view === "list" ? "Your Projects" : "New Project"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {view === "list" 
              ? "Open an existing project or create a new one"
              : "Give your project a name to get started"}
          </DialogDescription>
        </DialogHeader>

        {view === "list" ? (
          <div className="space-y-4">
            <Button
              onClick={() => setView("create")}
              className="w-full bg-sky-500 hover:bg-sky-400 text-black"
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
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                        currentProjectId === project.id
                          ? "bg-sky-500/10 border-sky-500/50"
                          : "bg-neutral-800 border-neutral-700 hover:border-neutral-600"
                      }`}
                      onClick={() => handleLoad(project.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <FileCode2 className="w-5 h-5 text-sky-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-100 truncate">
                            {project.name}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(project.updated_at)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
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

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-neutral-700 text-slate-300 hover:bg-neutral-800"
                onClick={() => setView("list")}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-sky-500 hover:bg-sky-400 text-black"
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
