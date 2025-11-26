-- Create a table to store blacklisted users (deleted accounts)
CREATE TABLE public.deleted_user_blacklist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  original_user_id UUID,
  full_name TEXT,
  deletion_reason TEXT NOT NULL,
  deleted_by UUID,
  deleted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.deleted_user_blacklist ENABLE ROW LEVEL SECURITY;

-- Only admins can view and manage the blacklist
CREATE POLICY "Admins can manage blacklist"
ON public.deleted_user_blacklist
FOR ALL
USING (is_admin(auth.uid()));

-- Create index for faster email lookups (for registration checks)
CREATE INDEX idx_blacklist_email ON public.deleted_user_blacklist(email);