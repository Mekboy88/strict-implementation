-- Create system_metrics table for real-time system monitoring
CREATE TABLE IF NOT EXISTS public.system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metric_type TEXT NOT NULL, -- 'cpu', 'memory', 'latency', 'requests'
  value NUMERIC NOT NULL,
  metadata JSONB,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read system metrics
CREATE POLICY "Admins can read system metrics"
  ON public.system_metrics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- Policy: System can insert metrics (for edge function)
CREATE POLICY "Service role can insert metrics"
  ON public.system_metrics
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_system_metrics_type_time 
  ON public.system_metrics(metric_type, recorded_at DESC);

-- Create index for recent metrics
CREATE INDEX IF NOT EXISTS idx_system_metrics_recent 
  ON public.system_metrics(recorded_at DESC);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_metrics;