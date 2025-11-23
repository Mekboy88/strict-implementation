-- User Profile System
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  country text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL,
  provider_user_id text NOT NULL,
  access_token text,
  refresh_token text,
  expires_at timestamp with time zone,
  connected_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Project Management System
CREATE TABLE IF NOT EXISTS public.project_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  snapshot_name text NOT NULL,
  snapshot_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_env_vars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  is_secret boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(project_id, key)
);

CREATE TABLE IF NOT EXISTS public.project_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL DEFAULT 'viewer',
  invited_by uuid REFERENCES auth.users(id),
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.project_deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  deployment_url text,
  build_log text,
  deployed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Platform System
CREATE TABLE IF NOT EXISTS public.platform_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL DEFAULT 'info',
  message text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.platform_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message text NOT NULL,
  error_code text,
  stack_trace text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.platform_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  limit_type text NOT NULL UNIQUE,
  limit_value integer NOT NULL,
  description text,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Storage System
CREATE TABLE IF NOT EXISTS public.storage_buckets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  public boolean NOT NULL DEFAULT false,
  file_size_limit bigint,
  allowed_mime_types text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.storage_objects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id uuid REFERENCES public.storage_buckets(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  path text NOT NULL,
  size bigint NOT NULL,
  mime_type text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.storage_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id uuid REFERENCES public.storage_buckets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permission text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(bucket_id, user_id, permission)
);

CREATE TABLE IF NOT EXISTS public.storage_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  bytes_used bigint NOT NULL DEFAULT 0,
  file_count integer NOT NULL DEFAULT 0,
  calculated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI Configuration System
CREATE TABLE IF NOT EXISTS public.ai_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  model_id text NOT NULL,
  temperature numeric(3,2) DEFAULT 0.7,
  max_tokens integer DEFAULT 1000,
  rate_limit integer DEFAULT 100,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  model_id text NOT NULL,
  tokens_used integer NOT NULL,
  request_cost numeric(10,6) NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  model_id text NOT NULL,
  prompt text NOT NULL,
  response text,
  tokens_used integer NOT NULL DEFAULT 0,
  duration_ms integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Edge Functions System
CREATE TABLE IF NOT EXISTS public.edge_functions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  function_name text NOT NULL,
  function_path text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(project_id, function_name)
);

CREATE TABLE IF NOT EXISTS public.edge_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  function_id uuid REFERENCES public.edge_functions(id) ON DELETE CASCADE NOT NULL,
  request_body jsonb DEFAULT '{}'::jsonb,
  response_body jsonb DEFAULT '{}'::jsonb,
  status_code integer NOT NULL,
  duration_ms integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.edge_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  function_id uuid REFERENCES public.edge_functions(id) ON DELETE CASCADE NOT NULL,
  error_message text NOT NULL,
  stack_trace text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Billing System
CREATE TABLE IF NOT EXISTS public.billing_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_customer_id text UNIQUE,
  payment_method_id text,
  billing_email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.billing_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_account_id uuid REFERENCES public.billing_accounts(id) ON DELETE CASCADE NOT NULL,
  invoice_number text NOT NULL UNIQUE,
  amount numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  invoice_url text,
  due_date timestamp with time zone NOT NULL,
  paid_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.billing_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  usage_type text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  unit_cost numeric(10,6) NOT NULL DEFAULT 0,
  total_cost numeric(10,2) NOT NULL DEFAULT 0,
  billing_period_start timestamp with time zone NOT NULL,
  billing_period_end timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.billing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name text NOT NULL UNIQUE,
  price_monthly numeric(10,2) NOT NULL,
  price_yearly numeric(10,2) NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  limits jsonb DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Notifications System
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  action_url text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email_enabled boolean NOT NULL DEFAULT true,
  push_enabled boolean NOT NULL DEFAULT true,
  project_updates boolean NOT NULL DEFAULT true,
  billing_alerts boolean NOT NULL DEFAULT true,
  security_alerts boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text NOT NULL,
  severity text NOT NULL DEFAULT 'info',
  message text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  is_resolved boolean NOT NULL DEFAULT false,
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Security System
CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.security_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address text,
  block_type text NOT NULL,
  reason text NOT NULL,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.security_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  changes jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- API Access System
CREATE TABLE IF NOT EXISTS public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  key_name text NOT NULL,
  key_prefix text NOT NULL,
  key_hash text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamp with time zone,
  last_used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.api_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid REFERENCES public.api_keys(id) ON DELETE CASCADE NOT NULL,
  permission text NOT NULL,
  resource_type text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.api_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid REFERENCES public.api_keys(id) ON DELETE CASCADE NOT NULL,
  endpoint text NOT NULL,
  method text NOT NULL,
  status_code integer NOT NULL,
  duration_ms integer NOT NULL DEFAULT 0,
  ip_address text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Integrations System
CREATE TABLE IF NOT EXISTS public.integrations_supabase (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  supabase_url text NOT NULL,
  supabase_anon_key text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  connected_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(project_id)
);

CREATE TABLE IF NOT EXISTS public.integrations_stripe (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_publishable_key text NOT NULL,
  stripe_secret_key text NOT NULL,
  webhook_secret text,
  is_active boolean NOT NULL DEFAULT true,
  connected_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_env_vars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edge_functions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edge_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edge_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations_supabase ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations_stripe ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_connections
CREATE POLICY "Users can manage own connections" ON public.user_connections FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for project_snapshots
CREATE POLICY "Users can view own project snapshots" ON public.project_snapshots FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_snapshots.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can create own project snapshots" ON public.project_snapshots FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_snapshots.project_id AND projects.user_id = auth.uid())
);

-- RLS Policies for project_env_vars
CREATE POLICY "Users can manage own project env vars" ON public.project_env_vars FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_env_vars.project_id AND projects.user_id = auth.uid())
);

-- RLS Policies for project_members
CREATE POLICY "Users can view project members" ON public.project_members FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_members.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Project owners can manage members" ON public.project_members FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_members.project_id AND projects.user_id = auth.uid())
);

-- RLS Policies for project_deployments
CREATE POLICY "Users can view own project deployments" ON public.project_deployments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_deployments.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can create own project deployments" ON public.project_deployments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_deployments.project_id AND projects.user_id = auth.uid())
);

-- RLS Policies for platform_logs (admin only)
CREATE POLICY "Admins can view platform logs" ON public.platform_logs FOR SELECT USING (is_admin(auth.uid()));

-- RLS Policies for platform_errors (admin only)
CREATE POLICY "Admins can view platform errors" ON public.platform_errors FOR SELECT USING (is_admin(auth.uid()));

-- RLS Policies for platform_limits (admin only)
CREATE POLICY "Admins can manage platform limits" ON public.platform_limits FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for storage_buckets
CREATE POLICY "Users can view own buckets" ON public.storage_buckets FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can manage own buckets" ON public.storage_buckets FOR ALL USING (auth.uid() = owner_id);

-- RLS Policies for storage_objects
CREATE POLICY "Users can view own objects" ON public.storage_objects FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can manage own objects" ON public.storage_objects FOR ALL USING (auth.uid() = owner_id);

-- RLS Policies for storage_permissions
CREATE POLICY "Users can view own permissions" ON public.storage_permissions FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for storage_usage
CREATE POLICY "Users can view own usage" ON public.storage_usage FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for ai_config
CREATE POLICY "Users can manage own AI config" ON public.ai_config FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for ai_usage
CREATE POLICY "Users can view own AI usage" ON public.ai_usage FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for ai_logs
CREATE POLICY "Users can view own AI logs" ON public.ai_logs FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for edge_functions
CREATE POLICY "Users can manage own edge functions" ON public.edge_functions FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for edge_logs
CREATE POLICY "Users can view own function logs" ON public.edge_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.edge_functions WHERE edge_functions.id = edge_logs.function_id AND edge_functions.user_id = auth.uid())
);

-- RLS Policies for edge_errors
CREATE POLICY "Users can view own function errors" ON public.edge_errors FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.edge_functions WHERE edge_functions.id = edge_errors.function_id AND edge_functions.user_id = auth.uid())
);

-- RLS Policies for billing_accounts
CREATE POLICY "Users can manage own billing account" ON public.billing_accounts FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for billing_invoices
CREATE POLICY "Users can view own invoices" ON public.billing_invoices FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.billing_accounts WHERE billing_accounts.id = billing_invoices.billing_account_id AND billing_accounts.user_id = auth.uid())
);

-- RLS Policies for billing_usage
CREATE POLICY "Users can view own usage" ON public.billing_usage FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for billing_plans
CREATE POLICY "Everyone can view active plans" ON public.billing_plans FOR SELECT USING (is_active = true);

-- RLS Policies for notifications
CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for notification_preferences
CREATE POLICY "Users can manage own preferences" ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for admin_alerts (admin only)
CREATE POLICY "Admins can manage alerts" ON public.admin_alerts FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for security_events
CREATE POLICY "Users can view own security events" ON public.security_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all security events" ON public.security_events FOR SELECT USING (is_admin(auth.uid()));

-- RLS Policies for security_blocks
CREATE POLICY "Admins can manage security blocks" ON public.security_blocks FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for security_audit
CREATE POLICY "Users can view own audit log" ON public.security_audit FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all audit logs" ON public.security_audit FOR SELECT USING (is_admin(auth.uid()));

-- RLS Policies for api_keys
CREATE POLICY "Users can manage own API keys" ON public.api_keys FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for api_access
CREATE POLICY "Users can view own API access" ON public.api_access FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.api_keys WHERE api_keys.id = api_access.api_key_id AND api_keys.user_id = auth.uid())
);

-- RLS Policies for api_requests
CREATE POLICY "Users can view own API requests" ON public.api_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.api_keys WHERE api_keys.id = api_requests.api_key_id AND api_keys.user_id = auth.uid())
);

-- RLS Policies for integrations_supabase
CREATE POLICY "Users can manage own Supabase integrations" ON public.integrations_supabase FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for integrations_stripe
CREATE POLICY "Users can manage own Stripe integration" ON public.integrations_stripe FOR ALL USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_connections_updated_at BEFORE UPDATE ON public.user_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_env_vars_updated_at BEFORE UPDATE ON public.project_env_vars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_storage_buckets_updated_at BEFORE UPDATE ON public.storage_buckets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_storage_objects_updated_at BEFORE UPDATE ON public.storage_objects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_config_updated_at BEFORE UPDATE ON public.ai_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_edge_functions_updated_at BEFORE UPDATE ON public.edge_functions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billing_accounts_updated_at BEFORE UPDATE ON public.billing_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_platform_limits_updated_at BEFORE UPDATE ON public.platform_limits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();