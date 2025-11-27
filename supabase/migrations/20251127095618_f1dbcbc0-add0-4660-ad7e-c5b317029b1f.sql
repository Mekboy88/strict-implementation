-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;

-- The correct policy "Admins can view all roles" already exists and uses is_admin() security definer function
-- No need to recreate it