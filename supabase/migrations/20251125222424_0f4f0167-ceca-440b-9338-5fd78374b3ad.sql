-- Add variant_type and paired_project_id to projects table
ALTER TABLE public.projects 
ADD COLUMN variant_type TEXT DEFAULT 'web' CHECK (variant_type IN ('web', 'mobile')),
ADD COLUMN paired_project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;

-- Create an index for faster lookups
CREATE INDEX idx_projects_paired_project_id ON public.projects(paired_project_id);
CREATE INDEX idx_projects_variant_type ON public.projects(variant_type);

-- Add a comment explaining the relationship
COMMENT ON COLUMN public.projects.variant_type IS 'Type of project variant: web or mobile';
COMMENT ON COLUMN public.projects.paired_project_id IS 'Links to the paired project (web links to mobile, mobile links to web)';