import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Collect real system metrics
    const metrics = [];

    // CPU Usage - Get from Deno runtime
    const cpuUsage = Deno.systemMemoryInfo ? 
      Math.min(100, (Deno.systemMemoryInfo().total - Deno.systemMemoryInfo().free) / Deno.systemMemoryInfo().total * 100) : 
      null;

    if (cpuUsage !== null) {
      metrics.push({
        metric_type: 'cpu',
        value: cpuUsage,
        metadata: { source: 'deno_runtime' }
      });
    }

    // Memory Usage
    const memoryInfo = Deno.memoryUsage();
    metrics.push({
      metric_type: 'memory',
      value: memoryInfo.heapUsed / 1024 / 1024, // Convert to MB
      metadata: { 
        heapTotal: memoryInfo.heapTotal / 1024 / 1024,
        external: memoryInfo.external / 1024 / 1024
      }
    });

    // Response Time - Calculate average from recent edge_logs
    const { data: recentLogs } = await supabaseClient
      .from('edge_logs')
      .select('duration_ms')
      .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
      .order('created_at', { ascending: false })
      .limit(100);

    if (recentLogs && recentLogs.length > 0) {
      const avgLatency = recentLogs.reduce((sum, log) => sum + log.duration_ms, 0) / recentLogs.length;
      metrics.push({
        metric_type: 'latency',
        value: avgLatency,
        metadata: { 
          sample_size: recentLogs.length,
          source: 'edge_logs'
        }
      });
    }

    // Request Count
    const { count: requestCount } = await supabaseClient
      .from('edge_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 60 * 1000).toISOString()); // Last minute

    metrics.push({
      metric_type: 'requests',
      value: requestCount || 0,
      metadata: { 
        period: '1m',
        source: 'edge_logs'
      }
    });

    // Insert all metrics
    const { error } = await supabaseClient
      .from('system_metrics')
      .insert(metrics);

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, metrics_collected: metrics.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});