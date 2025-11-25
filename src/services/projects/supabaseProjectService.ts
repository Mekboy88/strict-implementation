import { supabase } from "@/integrations/supabase/client";

export type ProjectVariantType = 'web' | 'mobile';

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
  variant_type: ProjectVariantType;
  paired_project_id: string | null;
  files?: ProjectFile[];
}

export interface ProjectPair {
  web: Project | null;
  mobile: Project | null;
}

// Helper to cast Supabase response to Project type
function toProject(data: any): Project {
  return {
    ...data,
    variant_type: (data.variant_type || 'web') as ProjectVariantType,
  };
}

function toProjects(data: any[]): Project[] {
  return data.map(toProject);
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
 * Create a new project with optional paired variant
 */
export async function createProject(
  name: string, 
  description?: string,
  variantType: ProjectVariantType = 'web',
  createPairedVariant: boolean = false
): Promise<ProjectPair> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Must be logged in to create a project");

  // Create the primary project
  const { data: primaryProject, error: primaryError } = await supabase
    .from("projects")
    .insert({
      name: createPairedVariant ? `${name} (${variantType === 'web' ? 'Web' : 'Mobile'})` : name,
      description: description || null,
      user_id: user.id,
      variant_type: variantType,
    })
    .select()
    .single();

  if (primaryError) throw primaryError;

  let pairedProject: Project | null = null;

  // Create paired variant if requested
  if (createPairedVariant) {
    const pairedVariantType: ProjectVariantType = variantType === 'web' ? 'mobile' : 'web';
    
    const { data: paired, error: pairedError } = await supabase
      .from("projects")
      .insert({
        name: `${name} (${pairedVariantType === 'web' ? 'Web' : 'Mobile'})`,
        description: description || null,
        user_id: user.id,
        variant_type: pairedVariantType,
        paired_project_id: primaryProject.id,
      })
      .select()
      .single();

    if (pairedError) throw pairedError;
    pairedProject = toProject(paired);

    // Update primary project with paired reference
    await supabase
      .from("projects")
      .update({ paired_project_id: pairedProject.id })
      .eq("id", primaryProject.id);

    primaryProject.paired_project_id = pairedProject.id;
  }

  const primary = toProject(primaryProject);
  return {
    web: variantType === 'web' ? primary : pairedProject,
    mobile: variantType === 'mobile' ? primary : pairedProject,
  };
}

/**
 * Create a single project (simple version)
 */
export async function createSingleProject(
  name: string, 
  description?: string,
  variantType: ProjectVariantType = 'web'
): Promise<Project> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Must be logged in to create a project");

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name,
      description: description || null,
      user_id: user.id,
      variant_type: variantType,
    })
    .select()
    .single();

  if (error) throw error;
  return toProject(data);
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
  return toProjects(data || []);
}

/**
 * Get grouped projects (web + mobile pairs)
 */
export async function getGroupedProjects(): Promise<Map<string, ProjectPair>> {
  const projects = await getProjects();
  const grouped = new Map<string, ProjectPair>();
  const processed = new Set<string>();

  for (const project of projects) {
    if (processed.has(project.id)) continue;

    // Find base name (remove (Web) or (Mobile) suffix)
    const baseName = project.name.replace(/\s*\((Web|Mobile)\)\s*$/, '');
    
    if (!grouped.has(baseName)) {
      grouped.set(baseName, { web: null, mobile: null });
    }

    const pair = grouped.get(baseName)!;
    
    if (project.variant_type === 'web') {
      pair.web = project;
    } else {
      pair.mobile = project;
    }

    processed.add(project.id);

    // Also check for paired project
    if (project.paired_project_id) {
      const paired = projects.find(p => p.id === project.paired_project_id);
      if (paired && !processed.has(paired.id)) {
        if (paired.variant_type === 'web') {
          pair.web = paired;
        } else {
          pair.mobile = paired;
        }
        processed.add(paired.id);
      }
    }
  }

  return grouped;
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

  return toProject({
    ...project,
    files: files || [],
  });
}

/**
 * Get paired project
 */
export async function getPairedProject(projectId: string): Promise<Project | null> {
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle();

  if (error) throw error;
  if (!project || !project.paired_project_id) return null;

  const { data: paired, error: pairedError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", project.paired_project_id)
    .maybeSingle();

  if (pairedError) throw pairedError;
  return paired ? toProject(paired) : null;
}

/**
 * Link two existing projects as web/mobile pair
 */
export async function linkProjects(webProjectId: string, mobileProjectId: string): Promise<void> {
  const { error: webError } = await supabase
    .from("projects")
    .update({ 
      paired_project_id: mobileProjectId,
      variant_type: 'web'
    })
    .eq("id", webProjectId);

  if (webError) throw webError;

  const { error: mobileError } = await supabase
    .from("projects")
    .update({ 
      paired_project_id: webProjectId,
      variant_type: 'mobile'
    })
    .eq("id", mobileProjectId);

  if (mobileError) throw mobileError;
}

/**
 * Unlink paired projects
 */
export async function unlinkProjects(projectId: string): Promise<void> {
  const { data: project } = await supabase
    .from("projects")
    .select("paired_project_id")
    .eq("id", projectId)
    .maybeSingle();

  if (project?.paired_project_id) {
    // Remove link from paired project
    await supabase
      .from("projects")
      .update({ paired_project_id: null })
      .eq("id", project.paired_project_id);
  }

  // Remove link from this project
  await supabase
    .from("projects")
    .update({ paired_project_id: null })
    .eq("id", projectId);
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
  // First unlink from paired project
  await unlinkProjects(projectId);

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
  updates: { name?: string; description?: string; variant_type?: ProjectVariantType }
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
  return toProject(data);
}
