import { useEffect, useState } from 'react';
import { useFileSystemStore } from '@/stores/useFileSystemStore';
import { projectService } from '@/services/projects/projectService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to initialize a default project for the user
 * Auto-creates a project with all base files on first load
 */
export const useProjectInit = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { setCurrentProject, initializeProject, currentProjectId } = useFileSystemStore();

  useEffect(() => {
    const initProject = async () => {
      if (isInitializing || isReady || currentProjectId) return;

      setIsInitializing(true);

      try {
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('User not authenticated, skipping project init');
          setIsReady(true);
          setIsInitializing(false);
          return;
        }

        // Get user's projects
        const projects = await projectService.getUserProjects();

        if (projects.length > 0) {
          // Load the most recent project
          const latestProject = projects[0];
          await setCurrentProject(latestProject.id);
          console.log('Loaded existing project:', latestProject.name);
        } else {
          // Create a new default project
          const newProject = await projectService.createProject(
            'My First Project',
            'Created with UR-DEV AI'
          );
          
          await setCurrentProject(newProject.id);
          await initializeProject();
          
          console.log('Created new project with all base files:', newProject.name);
        }

        setIsReady(true);
      } catch (error) {
        console.error('Error initializing project:', error);
        setIsReady(true);
      } finally {
        setIsInitializing(false);
      }
    };

    initProject();
  }, []);

  return { isInitializing, isReady };
};
