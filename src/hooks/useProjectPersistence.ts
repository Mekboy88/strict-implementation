import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  createProject,
  createSingleProject,
  getProjects,
  getProjectWithFiles,
  saveProjectFiles,
  deleteProject,
  getPairedProject,
  Project,
  ProjectVariantType,
  ProjectPair,
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
  const [pairedProject, setPairedProject] = useState<Project | null>(null);
  const [activeVariant, setActiveVariant] = useState<ProjectVariantType>('web');
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
      setPairedProject(null);
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

  const createNewProject = useCallback(async (
    name: string, 
    description?: string,
    variantType: ProjectVariantType = 'web',
    createPairedVariant: boolean = false
  ) => {
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
      let projectPair: ProjectPair;
      
      if (createPairedVariant) {
        projectPair = await createProject(name, description, variantType, true);
      } else {
        const single = await createSingleProject(name, description, variantType);
        projectPair = {
          web: variantType === 'web' ? single : null,
          mobile: variantType === 'mobile' ? single : null,
        };
      }

      // Refresh projects list
      await loadProjects();

      // Set current project based on variant type
      const primaryProject = variantType === 'web' ? projectPair.web : projectPair.mobile;
      const secondaryProject = variantType === 'web' ? projectPair.mobile : projectPair.web;

      if (primaryProject) {
        setCurrentProject(primaryProject);
        setPairedProject(secondaryProject);
        setActiveVariant(variantType);
      }

      toast({
        title: "Project Created",
        description: createPairedVariant 
          ? `"${name}" (Web & Mobile) has been created`
          : `"${name}" has been created`,
      });

      return projectPair;
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
  }, [user, loadProjects]);

  const loadProject = useCallback(async (projectId: string) => {
    setIsLoading(true);
    try {
      const project = await getProjectWithFiles(projectId);
      if (project) {
        setCurrentProject(project);
        setActiveVariant(project.variant_type || 'web');

        // Load paired project if exists
        if (project.paired_project_id) {
          const paired = await getPairedProject(projectId);
          setPairedProject(paired);
        } else {
          setPairedProject(null);
        }

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

  const switchVariant = useCallback(async (variant: ProjectVariantType) => {
    if (variant === activeVariant) return;

    // If we have a paired project, switch to it
    if (pairedProject && pairedProject.variant_type === variant) {
      const temp = currentProject;
      setCurrentProject(pairedProject);
      setPairedProject(temp);
      setActiveVariant(variant);

      toast({
        title: "Switched Version",
        description: `Now editing ${variant === 'web' ? 'Web' : 'Mobile'} version`,
      });
    } else if (currentProject?.variant_type === variant) {
      setActiveVariant(variant);
    }
  }, [activeVariant, currentProject, pairedProject]);

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
        setPairedProject(null);
      } else if (pairedProject?.id === projectId) {
        setPairedProject(null);
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
  }, [currentProject, pairedProject]);

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
    pairedProject,
    activeVariant,
    projects,
    isLoading,
    isSaving,
    loadProjects,
    createNewProject,
    loadProject,
    switchVariant,
    saveCurrentProject,
    removeProject,
    convertProjectFilesToEditor,
    setCurrentProject,
  };
}
