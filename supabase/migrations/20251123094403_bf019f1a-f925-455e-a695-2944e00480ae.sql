-- Ensure complete uniqueness and isolation for user projects

-- Add unique constraint: Each user can only have one project with a specific name
ALTER TABLE public.projects 
ADD CONSTRAINT unique_project_name_per_user UNIQUE (user_id, name);

-- Add unique constraint: Each user can only have one project_metadata entry per project
ALTER TABLE public.project_metadata 
ADD CONSTRAINT unique_project_metadata_per_user UNIQUE (user_id, project_name);

-- Add unique constraint: File paths must be unique within each project
ALTER TABLE public.project_files 
ADD CONSTRAINT unique_file_path_per_project UNIQUE (project_id, file_path);

-- Add unique constraint: Environment variable keys must be unique per project
ALTER TABLE public.project_env_vars 
ADD CONSTRAINT unique_env_key_per_project UNIQUE (project_id, key);

-- Add unique constraint: Each user can only be a member of a project once
ALTER TABLE public.project_members 
ADD CONSTRAINT unique_user_per_project UNIQUE (project_id, user_id);

-- Add unique constraint: Snapshot names must be unique per project
ALTER TABLE public.project_snapshots 
ADD CONSTRAINT unique_snapshot_name_per_project UNIQUE (project_id, snapshot_name);

-- Add index for better performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON public.project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_metadata_user_id ON public.project_metadata(user_id);

-- Verify RLS is enabled on all project-related tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_env_vars ENABLE ROW LEVEL SECURITY;