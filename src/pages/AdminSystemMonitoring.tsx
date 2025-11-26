import { useState } from "react";
import { Activity, AlertTriangle, Bell, Clock, Cpu, Database, HardDrive, Zap, Info, ChevronDown, ChevronUp, Lightbulb, Wrench, Shield, RefreshCw, Download, Search } from "lucide-react";

export default function AdminSystemMonitoring() {
  const [activeTab, setActiveTab] = useState<"errors" | "performance" | "uptime" | "alerts">("errors");
  const [expandedExplanation, setExpandedExplanation] = useState<number | null>(null);
  const [expandedIncident, setExpandedIncident] = useState<number | null>(null);

  // Mock error logs data with explanations
  const errorLogs = [
    {
      id: 1,
      timestamp: "2025-11-22 08:15:32",
      level: "ERROR",
      message: "Database connection timeout",
      stackTrace: "Error: Connection timeout\n  at Database.connect (db.ts:45)\n  at Server.initialize (server.ts:12)",
      count: 3,
      explanation: {
        cause: "The database server is not responding within the expected time frame. This can occur due to network latency, high database load, or the database server being temporarily unavailable.",
        impact: "Users may experience slow page loads or failed data operations. Repeated timeouts can lead to degraded application performance.",
        resolution: [
          "Check database server status and resource usage (CPU, memory, connections)",
          "Verify network connectivity between app server and database",
          "Review and optimize slow database queries",
          "Consider increasing connection timeout settings if appropriate",
          "Implement connection pooling to manage database connections efficiently"
        ],
        prevention: "Set up database monitoring alerts, implement connection retry logic with exponential backoff, and regularly review query performance."
      }
    },
    {
      id: 2,
      timestamp: "2025-11-22 08:10:15",
      level: "WARNING",
      message: "High memory usage detected",
      stackTrace: "Warning: Memory usage at 87%\n  at Monitor.check (monitor.ts:89)",
      count: 1,
      explanation: {
        cause: "The application is consuming more memory than expected. This could be due to memory leaks, large data processing, or insufficient memory allocation for current workload.",
        impact: "If memory usage continues to increase, it may cause application crashes, slower performance, or trigger Out of Memory (OOM) errors.",
        resolution: [
          "Identify and fix memory leaks using profiling tools",
          "Review recent code changes that may have introduced memory issues",
          "Restart the application to free up memory temporarily",
          "Scale up server memory if consistently hitting limits",
          "Implement pagination for large data sets"
        ],
        prevention: "Regular memory profiling, implement proper cleanup in components, use streaming for large data operations, and set up automated scaling."
      }
    },
    {
      id: 3,
      timestamp: "2025-11-22 07:55:44",
      level: "ERROR",
      message: "API rate limit exceeded",
      stackTrace: "Error: Rate limit exceeded\n  at RateLimiter.check (limiter.ts:34)\n  at API.handler (api.ts:78)",
      count: 12,
      explanation: {
        cause: "Too many API requests have been made in a short time period, exceeding the configured rate limits. This could indicate a traffic spike, misconfigured client, or potential abuse.",
        impact: "Legitimate requests may be blocked, causing service disruption for users. Repeated violations could lead to IP bans or service restrictions.",
        resolution: [
          "Identify the source of excessive requests (IP, user, or endpoint)",
          "Review and adjust rate limits if they are too restrictive",
          "Implement request queuing or throttling on the client side",
          "Add caching to reduce redundant API calls",
          "Consider implementing user-specific rate limits"
        ],
        prevention: "Implement progressive rate limiting, add request deduplication, use webhooks instead of polling where possible, and monitor API usage patterns."
      }
    },
  ];

  // Mock performance metrics
  const performanceMetrics = {
    apiLatency: { current: 145, average: 132, peak: 287 },
    dbQueryTime: { current: 23, average: 18, peak: 54 },
    memoryUsage: { current: 67, total: 100 },
    cpuUsage: { current: 45, cores: 8 },
  };

  // Mock uptime data with explanations
  const uptimeData = {
    current: 99.97,
    lastMonth: 99.94,
    last24h: 100.0,
    incidents: [
      { 
        date: "2025-11-20", 
        duration: "12 min", 
        reason: "Database maintenance",
        explanation: {
          cause: "Scheduled database maintenance was performed to apply security patches and optimize performance.",
          impact: "Brief service interruption during maintenance window. All data remained intact.",
          resolution: ["Maintenance completed successfully", "Database performance improved by 15%", "Security vulnerabilities patched"],
          prevention: "Schedule maintenance during low-traffic hours and implement zero-downtime deployment strategies."
        }
      },
      { 
        date: "2025-11-15", 
        duration: "8 min", 
        reason: "API server restart",
        explanation: {
          cause: "API server required a restart to apply critical configuration updates and clear accumulated memory.",
          impact: "API requests failed during restart. Client applications showed temporary errors.",
          resolution: ["Server restarted successfully", "Memory usage normalized", "Configuration updates applied"],
          prevention: "Implement rolling restarts with load balancer health checks to achieve zero-downtime updates."
        }
      },
    ],
  };

  // Mock alert configuration
  const [alerts, setAlerts] = useState([
    { id: 1, name: "High Error Rate", condition: "Error rate > 5/min", enabled: true, email: true },
    { id: 2, name: "API Latency", condition: "Latency > 500ms", enabled: true, email: true },
    { id: 3, name: "Memory Critical", condition: "Memory > 90%", enabled: true, email: true },
    { id: 4, name: "Database Down", condition: "DB connection failed", enabled: true, email: true },
    { id: 5, name: "CPU High", condition: "CPU > 80%", enabled: false, email: false },
  ]);

  const toggleAlert = (id: number) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, enabled: !alert.enabled } : alert)));
  };

  return (
    <div className="min-h-screen bg-neutral-800">
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
              className="h-9 w-64 rounded-lg pl-9 pr-4 text-sm outline-none bg-neutral-700 border border-neutral-600 text-neutral-100 placeholder:text-neutral-500"
            />
          </div>
          
          {/* Refresh Button */}
          <button className="h-9 px-3 rounded-lg flex items-center gap-2 text-sm transition-all bg-neutral-700 border border-neutral-600 text-neutral-300 hover:bg-neutral-600">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          
          {/* Export Button */}
          <button className="h-9 px-3 rounded-lg flex items-center gap-2 text-sm transition-all bg-neutral-700 text-neutral-300 hover:bg-neutral-600">
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
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-red-500/20">
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </div>
              <span className="text-sm text-neutral-400">Active Errors</span>
            </div>
            <p className="text-2xl font-bold text-red-400">3</p>
          </div>
          <div className="rounded-xl p-4 bg-neutral-800 border border-neutral-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-yellow-500/20">
                <Clock className="h-4 w-4 text-yellow-400" />
              </div>
              <span className="text-sm text-neutral-400">Avg Latency</span>
            </div>
            <p className="text-2xl font-bold text-neutral-100">145ms</p>
          </div>
          <div className="rounded-xl p-4 bg-neutral-800 border border-neutral-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-emerald-500/20">
                <Activity className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-sm text-neutral-400">Uptime</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">99.97%</p>
          </div>
          <div className="rounded-xl p-4 bg-neutral-800 border border-neutral-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-neutral-700">
                <Cpu className="h-4 w-4 text-neutral-300" />
              </div>
              <span className="text-sm text-neutral-400">CPU Usage</span>
            </div>
            <p className="text-2xl font-bold text-neutral-100">45%</p>
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
            Error Logs
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
            onClick={() => setActiveTab("uptime")}
            className={`px-6 py-3 font-medium transition-all border-b-2 ${
              activeTab === "uptime"
                ? "border-neutral-300 text-neutral-50"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Uptime Monitor
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`px-6 py-3 font-medium transition-all border-b-2 ${
              activeTab === "alerts"
                ? "border-neutral-300 text-neutral-50"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Alert Configuration
          </button>
        </div>

        {/* Error Logs Tab */}
        {activeTab === "errors" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-neutral-100">Real-Time Error Tracking</h2>
              <button className="px-4 py-2 rounded-lg text-sm transition-all bg-neutral-700 text-neutral-300 hover:bg-neutral-600">
                Clear All Logs
              </button>
            </div>

            {errorLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-xl p-6 transition-all bg-neutral-800 border border-neutral-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        log.level === "ERROR" ? "bg-red-500" : "bg-yellow-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold ${
                        log.level === "ERROR" ? "text-red-400" : "text-yellow-400"
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-sm text-neutral-500">{log.timestamp}</span>
                    {log.count > 1 && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">
                        {log.count}x
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
                <h3 className="font-medium mb-2 text-neutral-100">{log.message}</h3>
                <div className="rounded-lg p-3 font-mono text-xs whitespace-pre-wrap bg-neutral-900 text-neutral-400">
                  {log.stackTrace}
                </div>

                {/* Explanation Panel */}
                {expandedExplanation === log.id && (
                  <div className="mt-4 p-4 rounded-xl space-y-4 animate-in slide-in-from-top-2 duration-200 bg-neutral-700 border border-neutral-600">
                    {/* Cause */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-neutral-300" />
                        <h4 className="text-sm font-semibold text-neutral-300">Root Cause</h4>
                      </div>
                      <p className="text-sm leading-relaxed text-neutral-100">{log.explanation.cause}</p>
                    </div>

                    {/* Impact */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <h4 className="text-sm font-semibold text-yellow-400">Impact</h4>
                      </div>
                      <p className="text-sm leading-relaxed text-neutral-100">{log.explanation.impact}</p>
                    </div>

                    {/* Resolution Steps */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Wrench className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-sm font-semibold text-emerald-400">How to Resolve</h4>
                      </div>
                      <ul className="space-y-2">
                        {log.explanation.resolution.map((step, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-neutral-100">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Prevention */}
                    <div className="pt-3 border-t border-neutral-600">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-neutral-300" />
                        <h4 className="text-sm font-semibold text-neutral-300">Prevention</h4>
                      </div>
                      <p className="text-sm leading-relaxed text-neutral-100">{log.explanation.prevention}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Performance Metrics Tab */}
        {activeTab === "performance" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* API Latency */}
            <div className="rounded-xl p-6 bg-neutral-800 border border-neutral-700">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-neutral-300" />
                <h3 className="text-lg font-semibold text-neutral-100">API Latency</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-400">Current</span>
                    <span className="font-semibold text-neutral-100">{performanceMetrics.apiLatency.current}ms</span>
                  </div>
                  <div className="w-full rounded-full h-2 bg-neutral-700">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-neutral-400"
                      style={{ width: `${(performanceMetrics.apiLatency.current / 300) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-700">
                  <div>
                    <p className="text-xs text-neutral-500">Average</p>
                    <p className="font-semibold text-neutral-100">{performanceMetrics.apiLatency.average}ms</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Peak</p>
                    <p className="font-semibold text-neutral-100">{performanceMetrics.apiLatency.peak}ms</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Database Query Performance */}
            <div className="rounded-xl p-6 bg-neutral-800 border border-neutral-700">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-neutral-300" />
                <h3 className="text-lg font-semibold text-neutral-100">Database Query Time</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-400">Current</span>
                    <span className="font-semibold text-neutral-100">{performanceMetrics.dbQueryTime.current}ms</span>
                  </div>
                  <div className="w-full rounded-full h-2 bg-neutral-700">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-neutral-400"
                      style={{ width: `${(performanceMetrics.dbQueryTime.current / 100) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-700">
                  <div>
                    <p className="text-xs text-neutral-500">Average</p>
                    <p className="font-semibold text-neutral-100">{performanceMetrics.dbQueryTime.average}ms</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Peak</p>
                    <p className="font-semibold text-neutral-100">{performanceMetrics.dbQueryTime.peak}ms</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="rounded-xl p-6 bg-neutral-800 border border-neutral-700">
              <div className="flex items-center gap-3 mb-4">
                <HardDrive className="w-6 h-6 text-neutral-300" />
                <h3 className="text-lg font-semibold text-neutral-100">Memory Usage</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-400">Current Usage</span>
                    <span className="font-semibold text-neutral-100">
                      {performanceMetrics.memoryUsage.current}GB / {performanceMetrics.memoryUsage.total}GB
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2 bg-neutral-700">
                    <div
                      className={`h-2 rounded-full ${
                        performanceMetrics.memoryUsage.current / performanceMetrics.memoryUsage.total > 0.8
                          ? "bg-gradient-to-r from-red-500 to-orange-500"
                          : "bg-gradient-to-r from-emerald-500 to-neutral-400"
                      }`}
                      style={{ width: `${(performanceMetrics.memoryUsage.current / performanceMetrics.memoryUsage.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="pt-3 border-t border-neutral-700">
                  <p className="text-xs text-neutral-500">Percentage</p>
                  <p className="font-semibold text-2xl text-neutral-100">
                    {Math.round((performanceMetrics.memoryUsage.current / performanceMetrics.memoryUsage.total) * 100)}%
                  </p>
                </div>
              </div>
            </div>

            {/* CPU Usage */}
            <div className="rounded-xl p-6 bg-neutral-800 border border-neutral-700">
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-6 h-6 text-neutral-300" />
                <h3 className="text-lg font-semibold text-neutral-100">CPU Usage</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-400">Current Usage</span>
                    <span className="font-semibold text-neutral-100">{performanceMetrics.cpuUsage.current}%</span>
                  </div>
                  <div className="w-full rounded-full h-2 bg-neutral-700">
                    <div
                      className={`h-2 rounded-full ${
                        performanceMetrics.cpuUsage.current > 80
                          ? "bg-gradient-to-r from-red-500 to-orange-500"
                          : "bg-gradient-to-r from-emerald-500 to-neutral-400"
                      }`}
                      style={{ width: `${performanceMetrics.cpuUsage.current}%` }}
                    />
                  </div>
                </div>
                <div className="pt-3 border-t border-neutral-700">
                  <p className="text-xs text-neutral-500">CPU Cores</p>
                  <p className="font-semibold text-2xl text-neutral-100">{performanceMetrics.cpuUsage.cores}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Uptime Monitor Tab */}
        {activeTab === "uptime" && (
          <div className="space-y-6">
            {/* Current Uptime Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl p-6 bg-neutral-800 border border-neutral-700">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-neutral-100">Current Uptime</h3>
                </div>
                <p className="text-4xl font-bold text-emerald-400">{uptimeData.current}%</p>
                <p className="text-sm mt-2 text-neutral-400">Service availability</p>
              </div>

              <div className="rounded-xl p-6 bg-neutral-800 border border-neutral-700">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="w-6 h-6 text-neutral-300" />
                  <h3 className="text-lg font-semibold text-neutral-100">Last 30 Days</h3>
                </div>
                <p className="text-4xl font-bold text-neutral-100">{uptimeData.lastMonth}%</p>
                <p className="text-sm mt-2 text-neutral-400">Monthly average</p>
              </div>

              <div className="rounded-xl p-6 bg-neutral-800 border border-neutral-700">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-neutral-100">Last 24 Hours</h3>
                </div>
                <p className="text-4xl font-bold text-yellow-400">{uptimeData.last24h}%</p>
                <p className="text-sm mt-2 text-neutral-400">Perfect uptime</p>
              </div>
            </div>

            {/* Incident History */}
            <div className="rounded-xl p-6 bg-neutral-800 border border-neutral-700">
              <h3 className="text-xl font-semibold mb-4 text-neutral-100">Recent Incidents</h3>
              <div className="space-y-3">
                {uptimeData.incidents.map((incident, index) => (
                  <div
                    key={index}
                    className="rounded-lg transition-all overflow-hidden bg-neutral-700"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <div>
                          <p className="font-medium text-neutral-100">{incident.reason}</p>
                          <p className="text-sm text-neutral-400">{incident.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-neutral-400">Duration: {incident.duration}</span>
                        <button
                          onClick={() => setExpandedIncident(expandedIncident === index ? null : index)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            expandedIncident === index
                              ? "bg-neutral-500 text-white"
                              : "bg-neutral-600 text-neutral-300 hover:bg-neutral-500"
                          }`}
                        >
                          <Lightbulb className="w-4 h-4" />
                          Explain Issue
                          {expandedIncident === index ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Incident Explanation */}
                    {expandedIncident === index && (
                      <div className="px-4 pb-4">
                        <div className="p-4 rounded-xl space-y-4 animate-in slide-in-from-top-2 duration-200 bg-neutral-800 border border-neutral-600">
                          {/* Cause */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Info className="w-4 h-4 text-neutral-300" />
                              <h4 className="text-sm font-semibold text-neutral-300">What Happened</h4>
                            </div>
                            <p className="text-sm leading-relaxed text-neutral-100">{incident.explanation.cause}</p>
                          </div>

                          {/* Impact */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                              <h4 className="text-sm font-semibold text-yellow-400">Impact</h4>
                            </div>
                            <p className="text-sm leading-relaxed text-neutral-100">{incident.explanation.impact}</p>
                          </div>

                          {/* Resolution */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Wrench className="w-4 h-4 text-emerald-400" />
                              <h4 className="text-sm font-semibold text-emerald-400">Resolution</h4>
                            </div>
                            <ul className="space-y-2">
                              {incident.explanation.resolution.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-neutral-100">
                                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-medium">
                                    ✓
                                  </span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Prevention */}
                          <div className="pt-3 border-t border-neutral-600">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-4 h-4 text-neutral-300" />
                              <h4 className="text-sm font-semibold text-neutral-300">Prevention</h4>
                            </div>
                            <p className="text-sm leading-relaxed text-neutral-100">{incident.explanation.prevention}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alert Configuration Tab */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-neutral-100">Email Alert Rules</h2>
              <button className="px-4 py-2 rounded-lg text-sm transition-all bg-neutral-600 text-neutral-100 hover:bg-neutral-500">
                + Add New Alert
              </button>
            </div>

            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-xl p-6 transition-all bg-neutral-800 border border-neutral-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Bell className={`w-5 h-5 ${alert.enabled ? "text-neutral-300" : "text-neutral-500"}`} />
                    <div>
                      <h3 className="font-medium text-neutral-100">{alert.name}</h3>
                      <p className="text-sm mt-1 text-neutral-400">{alert.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-400">Email Alerts:</span>
                      <span className={`text-sm font-medium ${alert.email ? "text-emerald-400" : "text-neutral-500"}`}>
                        {alert.email ? "ON" : "OFF"}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`px-4 py-2 rounded-lg transition-all text-sm ${
                        alert.enabled
                          ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                          : "bg-neutral-700 text-neutral-400 hover:bg-neutral-600"
                      }`}
                    >
                      {alert.enabled ? "Enabled" : "Disabled"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}