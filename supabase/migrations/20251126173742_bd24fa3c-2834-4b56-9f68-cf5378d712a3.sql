-- Add is_archived column to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS is_archived boolean NOT NULL DEFAULT false;

-- Add index for better query performance on archived status
CREATE INDEX IF NOT EXISTS idx_projects_is_archived ON public.projects(is_archived);