import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  createProject,
  getProjects,
  getProjectWithFiles,
  saveProjectFiles,
  deleteProject,
  Project,
} from "@/services/projects/supabaseProjectService";
import { toast } from "@/hooks/use-toast";

interface FileItem {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string[];
}

export function useProjectPersistence() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load projects when user logs in
  useEffect(() => {
    if (user) {
      loadProjects();
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
  }, [user]);

  const loadProjects = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createNewProject = useCallback(async (name: string, description?: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save projects",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      const project = await createProject(name, description);
      setProjects(prev => [project, ...prev]);
      setCurrentProject(project);
      toast({
        title: "Project Created",
        description: `"${name}" has been created`,
      });
      return project;
    } catch (error) {
      console.error("Failed to create project:", error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const loadProject = useCallback(async (projectId: string) => {
    setIsLoading(true);
    try {
      const project = await getProjectWithFiles(projectId);
      if (project) {
        setCurrentProject(project);
        toast({
          title: "Project Loaded",
          description: `"${project.name}" loaded successfully`,
        });
        return project;
      }
      return null;
    } catch (error) {
      console.error("Failed to load project:", error);
      toast({
        title: "Error",
        description: "Failed to load project",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveCurrentProject = useCallback(async (
    projectId: string,
    files: FileItem[],
    fileContents: Record<string, string>
  ) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save projects",
        variant: "destructive",
      });
      return false;
    }

    setIsSaving(true);
    try {
      const filesToSave = files.map(file => ({
        path: file.path,
        content: fileContents[file.id] || file.content.join("\n"),
        type: file.language,
      }));

      await saveProjectFiles(projectId, filesToSave);
      
      toast({
        title: "Project Saved",
        description: `${filesToSave.length} file(s) saved successfully`,
      });
      return true;
    } catch (error) {
      console.error("Failed to save project:", error);
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user]);

  const removeProject = useCallback(async (projectId: string) => {
    try {
      await deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
      toast({
        title: "Project Deleted",
        description: "Project has been deleted",
      });
      return true;
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
      return false;
    }
  }, [currentProject]);

  const convertProjectFilesToEditor = useCallback((project: Project): FileItem[] => {
    if (!project.files) return [];
    
    return project.files.map(file => ({
      id: file.file_path.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase(),
      name: file.file_path.split("/").pop() || file.file_path,
      path: file.file_path,
      language: file.file_type || "typescript",
      content: file.file_content.split("\n"),
    }));
  }, []);

  return {
    user,
    currentProject,
    projects,
    isLoading,
    isSaving,
    loadProjects,
    createNewProject,
    loadProject,
    saveCurrentProject,
    removeProject,
    convertProjectFilesToEditor,
    setCurrentProject,
  };
}
