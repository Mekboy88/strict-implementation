import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Activity, AlertTriangle, Clock, Cpu, ChevronDown, ChevronUp, Lightbulb, Wrench, Shield, RefreshCw, Download, Search, Info, Zap, Database, HardDrive } from "lucide-react";

interface ErrorLog {
  id: string;
  created_at: string;
  error_message: string;
  error_code: string | null;
  stack_trace: string | null;
  user_id: string | null;
  project_id: string | null;
}

interface AdminAlert {
  id: string;
  alert_type: string;
  severity: string;
  message: string;
  is_resolved: boolean;
  created_at: string;
  metadata: any;
}

export default function AdminSystemMonitoring() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"errors" | "performance" | "uptime" | "alerts">("errors");
  const [expandedExplanation, setExpandedExplanation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Real data from database
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [adminAlerts, setAdminAlerts] = useState<AdminAlert[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    errorCount: 0,
    avgLatency: null as number | null,
    uptime: 99.9,
    cpuUsage: null as number | null
  });

  // Check admin access
  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/admin/login");
        return;
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .in('role', ['owner', 'admin'])
        .single();

      if (!roleData) {
        navigate("/");
        return;
      }

      await loadAllData();
      setLoading(false);
    };

    checkAccess();
  }, [navigate]);

  // Real-time subscriptions
  useEffect(() => {
    const errorsChannel = supabase
      .channel('platform_errors_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'platform_errors'
        },
        () => {
          loadErrorLogs();
          loadPerformanceMetrics();
        }
      )
      .subscribe();

    const alertsChannel = supabase
      .channel('admin_alerts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_alerts'
        },
        () => loadAlerts()
      )
      .subscribe();

    const metricsChannel = supabase
      .channel('system_metrics_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_metrics'
        },
        () => loadPerformanceMetrics()
      )
      .subscribe();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      loadAllData();
    }, 10000);

    return () => {
      supabase.removeChannel(errorsChannel);
      supabase.removeChannel(alertsChannel);
      supabase.removeChannel(metricsChannel);
      clearInterval(interval);
    };
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      loadErrorLogs(),
      loadAlerts(),
      loadPerformanceMetrics()
    ]);
  };

  const loadErrorLogs = async () => {
    const { data } = await supabase
      .from('platform_errors')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (data) setErrorLogs(data);
  };

  const loadAlerts = async () => {
    const { data } = await supabase
      .from('admin_alerts')
      .select('*')
      .eq('is_resolved', false)
      .order('created_at', { ascending: false });
    
    if (data) setAdminAlerts(data);
  };

  const loadPerformanceMetrics = async () => {
    // Get error count from platform_errors (last 24 hours)
    const { count: errorCount } = await supabase
      .from("platform_errors")
      .select("*", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    // Calculate uptime from activity_logs
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const { data: activityData } = await supabase
      .from("activity_logs")
      .select("created_at")
      .gte("created_at", oneDayAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(1000);

    // Calculate uptime based on activity
    let uptime = 99.9;
    if (activityData && activityData.length > 0) {
      const totalMinutes = 24 * 60;
      const activeMinutes = new Set(
        activityData.map(log => 
          Math.floor(new Date(log.created_at).getTime() / (60 * 1000))
        )
      ).size;
      uptime = (activeMinutes / totalMinutes) * 100;
    }

    // Get real metrics from system_metrics table (last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: latencyMetrics } = await supabase
      .from("system_metrics")
      .select("value")
      .eq("metric_type", "latency")
      .gte("recorded_at", fiveMinutesAgo)
      .order("recorded_at", { ascending: false })
      .limit(10);

    const { data: cpuMetrics } = await supabase
      .from("system_metrics")
      .select("value")
      .eq("metric_type", "cpu")
      .gte("recorded_at", fiveMinutesAgo)
      .order("recorded_at", { ascending: false })
      .limit(10);

    const avgLatency = latencyMetrics && latencyMetrics.length > 0
      ? latencyMetrics.reduce((sum, m) => sum + Number(m.value), 0) / latencyMetrics.length
      : null;

    const avgCpu = cpuMetrics && cpuMetrics.length > 0
      ? cpuMetrics.reduce((sum, m) => sum + Number(m.value), 0) / cpuMetrics.length
      : null;

    setPerformanceMetrics({
      errorCount: errorCount || 0,
      avgLatency: avgLatency,
      uptime: Number(uptime.toFixed(2)),
      cpuUsage: avgCpu,
    });
  };

  const handleRefresh = async () => {
    toast({
      title: "Refreshing...",
      description: "Loading latest monitoring data"
    });
    await loadAllData();
    toast({
      title: "Refreshed",
      description: "Monitoring data updated successfully"
    });
  };

  const handleExport = () => {
    const data = activeTab === "errors" ? errorLogs : adminAlerts;
    if (data.length === 0) {
      toast({
        title: "No Data",
        description: "No data available to export",
        variant: "destructive"
      });
      return;
    }

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => JSON.stringify(v)).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-${new Date().toISOString()}.csv`;
    a.click();

    toast({
      title: "Export Complete",
      description: `${activeTab} data exported successfully`
    });
  };

  const handleResolveAlert = async (alertId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('admin_alerts')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by: session.user.id
      })
      .eq('id', alertId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to resolve alert",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Alert Resolved",
      description: "The alert has been marked as resolved"
    });

    await loadAlerts();
  };

  const filteredErrorLogs = errorLogs.filter(log =>
    log.error_message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (log.error_code?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getErrorExplanation = (errorMessage: string) => {
    if (errorMessage.toLowerCase().includes('timeout') || errorMessage.toLowerCase().includes('connection')) {
      return {
        cause: "The database or service is not responding within the expected time frame. This can occur due to network latency, high server load, or the service being temporarily unavailable.",
        impact: "Users may experience slow page loads or failed operations. Repeated timeouts can lead to degraded application performance.",
        resolution: [
          "Check server status and resource usage (CPU, memory, connections)",
          "Verify network connectivity between services",
          "Review and optimize slow queries or operations",
          "Consider increasing timeout settings if appropriate",
          "Implement retry logic with exponential backoff"
        ],
        prevention: "Set up monitoring alerts, implement connection retry logic, and regularly review performance metrics."
      };
    }

    if (errorMessage.toLowerCase().includes('memory') || errorMessage.toLowerCase().includes('oom')) {
      return {
        cause: "The application is consuming more memory than expected. This could be due to memory leaks, large data processing, or insufficient memory allocation.",
        impact: "If memory usage continues to increase, it may cause application crashes, slower performance, or Out of Memory errors.",
        resolution: [
          "Identify and fix memory leaks using profiling tools",
          "Review recent code changes that may have introduced issues",
          "Restart the application to free up memory temporarily",
          "Scale up server memory if consistently hitting limits",
          "Implement pagination for large data sets"
        ],
        prevention: "Regular memory profiling, implement proper cleanup, use streaming for large data, and set up automated scaling."
      };
    }

    if (errorMessage.toLowerCase().includes('rate limit') || errorMessage.toLowerCase().includes('too many requests')) {
      return {
        cause: "Too many requests have been made in a short time period, exceeding configured rate limits. This could indicate a traffic spike, misconfigured client, or potential abuse.",
        impact: "Legitimate requests may be blocked, causing service disruption. Repeated violations could lead to IP bans or service restrictions.",
        resolution: [
          "Identify the source of excessive requests (IP, user, or endpoint)",
          "Review and adjust rate limits if too restrictive",
          "Implement request queuing or throttling on client side",
          "Add caching to reduce redundant API calls",
          "Consider implementing user-specific rate limits"
        ],
        prevention: "Implement progressive rate limiting, add request deduplication, use webhooks instead of polling, and monitor usage patterns."
      };
    }

    return {
      cause: "An error occurred in the system. Check the error message and stack trace for specific details.",
      impact: "This error may affect application functionality or user experience depending on its severity.",
      resolution: [
        "Review the error message and stack trace for details",
        "Check application logs for additional context",
        "Verify system resources are adequate",
        "Test the affected functionality",
        "Contact support if the issue persists"
      ],
      prevention: "Implement comprehensive error handling, monitoring, and logging throughout the application."
    };
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-neutral-800 overflow-y-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 h-16 flex items-center justify-between px-6 bg-neutral-800 border-b border-neutral-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-neutral-700">
              <Activity className="h-5 w-5 text-neutral-300" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-neutral-50">System Monitoring</h1>
              <p className="text-xs text-neutral-400">Real-time health & performance</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-64 rounded-lg pl-9 pr-4 text-sm outline-none bg-neutral-700 border border-neutral-600 text-neutral-100 placeholder:text-neutral-500"
            />
          </div>
          
          {/* Refresh Button */}
          <button 
            onClick={handleRefresh}
            className="h-9 px-3 rounded-lg flex items-center gap-2 text-sm transition-all bg-neutral-700 border border-neutral-600 text-neutral-300 hover:bg-neutral-600"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          
          {/* Export Button */}
          <button 
            onClick={handleExport}
            className="h-9 px-3 rounded-lg flex items-center gap-2 text-sm transition-all bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl p-4 bg-neutral-800 border border-neutral-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-red-500/20">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </div>
                <span className="text-sm text-neutral-400">Active Errors</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                Real-time
              </span>
            </div>
            <p className="text-2xl font-bold text-red-400">{performanceMetrics.errorCount}</p>
          </div>
          <div className="rounded-xl p-4 bg-neutral-800 border border-neutral-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-yellow-500/20">
                  <Clock className="h-4 w-4 text-yellow-400" />
                </div>
                <span className="text-sm text-neutral-400">Avg Latency</span>
              </div>
              {performanceMetrics.avgLatency !== null ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                  Real-time
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  No Data
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-neutral-100">
              {performanceMetrics.avgLatency !== null 
                ? `${performanceMetrics.avgLatency.toFixed(0)}ms`
                : 'N/A'
              }
            </p>
          </div>
          <div className="rounded-xl p-4 bg-neutral-800 border border-neutral-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-emerald-500/20">
                  <Activity className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-sm text-neutral-400">Uptime</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                Real-time
              </span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">{performanceMetrics.uptime.toFixed(2)}%</p>
          </div>
          <div className="rounded-xl p-4 bg-neutral-800 border border-neutral-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-neutral-700">
                  <Cpu className="h-4 w-4 text-neutral-300" />
                </div>
                <span className="text-sm text-neutral-400">CPU Usage</span>
              </div>
              {performanceMetrics.cpuUsage !== null ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                  Real-time
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  No Data
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-neutral-100">
              {performanceMetrics.cpuUsage !== null
                ? `${performanceMetrics.cpuUsage.toFixed(1)}%`
                : 'N/A'
              }
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-neutral-700">
          <button
            onClick={() => setActiveTab("errors")}
            className={`px-6 py-3 font-medium transition-all border-b-2 ${
              activeTab === "errors"
                ? "border-neutral-300 text-neutral-50"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Error Logs ({filteredErrorLogs.length})
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`px-6 py-3 font-medium transition-all border-b-2 ${
              activeTab === "performance"
                ? "border-neutral-300 text-neutral-50"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Performance Metrics
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`px-6 py-3 font-medium transition-all border-b-2 ${
              activeTab === "alerts"
                ? "border-neutral-300 text-neutral-50"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Active Alerts ({adminAlerts.length})
          </button>
        </div>

        {/* Error Logs Tab */}
        {activeTab === "errors" && (
          <div className="space-y-4">
            {filteredErrorLogs.length === 0 ? (
              <div className="rounded-lg border bg-neutral-700 border-neutral-600 p-8 text-center">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-white font-semibold mb-2">No error logs found</p>
                <p className="text-sm text-neutral-400">System errors will appear here when they occur</p>
              </div>
            ) : (
              filteredErrorLogs.map((log) => {
                const explanation = getErrorExplanation(log.error_message);
                return (
                  <div
                    key={log.id}
                    className="rounded-xl p-6 transition-all bg-neutral-800 border border-neutral-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-sm font-semibold text-red-400">ERROR</span>
                        <span className="text-sm text-neutral-500">{new Date(log.created_at).toLocaleString()}</span>
                        {log.error_code && (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">
                            {log.error_code}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setExpandedExplanation(expandedExplanation === log.id ? null : log.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          expandedExplanation === log.id
                            ? "bg-neutral-500 text-white"
                            : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                        }`}
                      >
                        <Lightbulb className="w-4 h-4" />
                        Explain Issue
                        {expandedExplanation === log.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <h3 className="font-medium mb-2 text-neutral-100">{log.error_message}</h3>
                    {log.stack_trace && (
                      <div className="rounded-lg p-3 font-mono text-xs whitespace-pre-wrap bg-neutral-900 text-neutral-400">
                        {log.stack_trace}
                      </div>
                    )}

                    {/* Explanation Panel */}
                    {expandedExplanation === log.id && (
                      <div className="mt-4 p-4 rounded-xl space-y-4 animate-in slide-in-from-top-2 duration-200 bg-neutral-700 border border-neutral-600">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Info className="w-4 h-4 text-neutral-300" />
                            <h4 className="text-sm font-semibold text-neutral-300">Root Cause</h4>
                          </div>
                          <p className="text-sm leading-relaxed text-neutral-100">{explanation.cause}</p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            <h4 className="text-sm font-semibold text-yellow-400">Impact</h4>
                          </div>
                          <p className="text-sm leading-relaxed text-neutral-100">{explanation.impact}</p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Wrench className="w-4 h-4 text-emerald-400" />
                            <h4 className="text-sm font-semibold text-emerald-400">How to Resolve</h4>
                          </div>
                          <ul className="space-y-2">
                            {explanation.resolution.map((step: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-neutral-100">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-medium">
                                  {index + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-3 border-t border-neutral-600">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-neutral-300" />
                            <h4 className="text-sm font-semibold text-neutral-300">Prevention</h4>
                          </div>
                          <p className="text-sm leading-relaxed text-neutral-100">{explanation.prevention}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Performance Metrics Tab */}
        {activeTab === "performance" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl p-6 bg-neutral-800 border border-neutral-700">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-neutral-300" />
                <h3 className="text-lg font-semibold text-neutral-100">API Latency</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-neutral-400">Current</span>
                    <span className="text-sm font-semibold text-neutral-100">{performanceMetrics.avgLatency}ms</span>
                  </div>
                  <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: `${Math.min(performanceMetrics.avgLatency / 5, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-6 bg-neutral-800 border border-neutral-700">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-neutral-300" />
                <h3 className="text-lg font-semibold text-neutral-100">Database Performance</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-neutral-400">Query Time</span>
                    <span className="text-sm font-semibold text-neutral-100">18ms avg</span>
                  </div>
                  <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '36%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-6 bg-neutral-800 border border-neutral-700">
              <div className="flex items-center gap-3 mb-4">
                <HardDrive className="w-6 h-6 text-neutral-300" />
                <h3 className="text-lg font-semibold text-neutral-100">Memory Usage</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-neutral-400">Current Usage</span>
                    <span className="text-sm font-semibold text-neutral-100">67%</span>
                  </div>
                  <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '67%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-6 bg-neutral-800 border border-neutral-700">
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-6 h-6 text-neutral-300" />
                <h3 className="text-lg font-semibold text-neutral-100">CPU Usage</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-neutral-400">Current Usage</span>
                    <span className="text-sm font-semibold text-neutral-100">{performanceMetrics.cpuUsage}%</span>
                  </div>
                  <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${performanceMetrics.cpuUsage}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            {adminAlerts.length === 0 ? (
              <div className="rounded-lg border bg-neutral-700 border-neutral-600 p-8 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <p className="text-white font-semibold mb-2">No active alerts</p>
                <p className="text-sm text-neutral-400">All systems secure. Alerts will appear here when issues are detected.</p>
              </div>
            ) : (
              adminAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-xl p-6 border ${
                    alert.severity === 'critical' ? 'bg-red-500/10 border-red-500' :
                    alert.severity === 'high' ? 'bg-orange-500/10 border-orange-500' :
                    alert.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500' :
                    'bg-blue-500/10 border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className={`w-5 h-5 ${
                          alert.severity === 'critical' ? 'text-red-400' :
                          alert.severity === 'high' ? 'text-orange-400' :
                          alert.severity === 'medium' ? 'text-yellow-400' :
                          'text-blue-400'
                        }`} />
                        <span className="font-semibold text-white">{alert.alert_type}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-white mb-2">{alert.message}</p>
                      <p className="text-sm text-white">{new Date(alert.created_at).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-neutral-700 text-white hover:bg-neutral-600"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
