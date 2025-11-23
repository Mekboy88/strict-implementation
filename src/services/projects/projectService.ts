import { supabase } from '@/integrations/supabase/client';

export const projectService = {
  async getUserProjects() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createProject(name: string, description?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getProjectFiles(projectId: string) {
    const { data, error } = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', projectId);

    if (error) throw error;
    return data || [];
  },

  async saveProjectFile(projectId: string, filePath: string, content: string, fileType: string) {
    const { data, error } = await supabase
      .from('project_files')
      .upsert({
        project_id: projectId,
        file_path: filePath,
        file_content: content,
        file_type: fileType,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
