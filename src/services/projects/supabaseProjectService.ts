import { supabase } from "@/integrations/supabase/client";

export interface ProjectFile {
  id?: string;
  file_path: string;
  file_content: string;
  file_type: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  files?: ProjectFile[];
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

/**
 * Create a new project
 */
export async function createProject(name: string, description?: string): Promise<Project> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Must be logged in to create a project");

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name,
      description: description || null,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all projects for current user
 */
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get a single project with its files
 */
export async function getProjectWithFiles(projectId: string): Promise<Project | null> {
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle();

  if (projectError) throw projectError;
  if (!project) return null;

  const { data: files, error: filesError } = await supabase
    .from("project_files")
    .select("*")
    .eq("project_id", projectId);

  if (filesError) throw filesError;

  return {
    ...project,
    files: files || [],
  };
}

/**
 * Save files to a project (upsert)
 */
export async function saveProjectFiles(
  projectId: string,
  files: { path: string; content: string; type: string }[]
): Promise<void> {
  // First, get existing files
  const { data: existingFiles } = await supabase
    .from("project_files")
    .select("id, file_path")
    .eq("project_id", projectId);

  const existingPaths = new Map(
    (existingFiles || []).map(f => [f.file_path, f.id])
  );

  // Separate into updates and inserts
  const updates: { id: string; file_content: string; file_type: string }[] = [];
  const inserts: { project_id: string; file_path: string; file_content: string; file_type: string }[] = [];

  for (const file of files) {
    const existingId = existingPaths.get(file.path);
    if (existingId) {
      updates.push({
        id: existingId,
        file_content: file.content,
        file_type: file.type,
      });
    } else {
      inserts.push({
        project_id: projectId,
        file_path: file.path,
        file_content: file.content,
        file_type: file.type,
      });
    }
  }

  // Perform updates
  for (const update of updates) {
    const { error } = await supabase
      .from("project_files")
      .update({ file_content: update.file_content, file_type: update.file_type })
      .eq("id", update.id);
    if (error) throw error;
  }

  // Perform inserts
  if (inserts.length > 0) {
    const { error } = await supabase
      .from("project_files")
      .insert(inserts);
    if (error) throw error;
  }

  // Update project timestamp
  await supabase
    .from("projects")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", projectId);
}

/**
 * Delete a project and all its files
 */
export async function deleteProject(projectId: string): Promise<void> {
  // Files are deleted via cascade or manually
  const { error: filesError } = await supabase
    .from("project_files")
    .delete()
    .eq("project_id", projectId);

  if (filesError) throw filesError;

  const { error: projectError } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (projectError) throw projectError;
}

/**
 * Update project name/description
 */
export async function updateProject(
  projectId: string,
  updates: { name?: string; description?: string }
): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
