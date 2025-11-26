import { useState } from "react";
import { Activity, AlertTriangle, Bell, Clock, Cpu, Database, HardDrive, Zap, MessageSquare, Users, Settings, Shield, LayoutDashboard, FolderOpen, UserCog, BarChart3, Zap as ZapIcon, Info, ChevronDown, ChevronUp, Lightbulb, Wrench } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-[#06080D] via-[#0B111A] to-[#06080D] text-white">
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-[#0A0F17]/80 backdrop-blur-xl border-r border-white/5 p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#4CB3FF] to-[#7B68EE] bg-clip-text text-transparent">
            Admin Panel
          </h2>
          <p className="text-sm text-gray-400 mt-1">System Control Center</p>
        </div>

        <nav className="space-y-2">
          <a
            href="/admin"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 transition-all"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </a>
          <a
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 transition-all"
          >
            <Users className="w-5 h-5" />
            <span>Users</span>
          </a>
          <a
            href="/admin/projects"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 transition-all"
          >
            <FolderOpen className="w-5 h-5" />
            <span>Projects</span>
          </a>
          <a
            href="/admin/roles"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 transition-all"
          >
            <UserCog className="w-5 h-5" />
            <span>Roles & Permissions</span>
          </a>
          <a
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 transition-all"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a>
          <a
            href="/admin/security"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 transition-all"
          >
            <Shield className="w-5 h-5" />
            <span>Security</span>
          </a>
          <a
            href="/admin/monitoring"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#4CB3FF]/10 border border-[#4CB3FF]/30 text-[#4CB3FF] transition-all"
          >
            <Activity className="w-5 h-5" />
            <span>Monitoring</span>
          </a>
          <a
            href="/admin/communication"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Communication</span>
          </a>
          <a
            href="/admin/analytics"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 transition-all"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </a>
          <a
            href="/admin/advanced"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 transition-all"
          >
            <Zap className="w-5 h-5" />
            <span>Advanced</span>
          </a>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-all text-sm"
          >
            ← Back to Platform
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">System Monitoring 🖥️</h1>
          <p className="text-gray-400">Real-time system health and performance monitoring</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab("errors")}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === "errors"
                ? "border-b-2 border-[#4CB3FF] text-[#4CB3FF]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Error Logs
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === "performance"
                ? "border-b-2 border-[#4CB3FF] text-[#4CB3FF]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Performance Metrics
          </button>
          <button
            onClick={() => setActiveTab("uptime")}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === "uptime"
                ? "border-b-2 border-[#4CB3FF] text-[#4CB3FF]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Uptime Monitor
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === "alerts"
                ? "border-b-2 border-[#4CB3FF] text-[#4CB3FF]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Alert Configuration
          </button>
        </div>

        {/* Error Logs Tab */}
        {activeTab === "errors" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Real-Time Error Tracking</h2>
              <button className="px-4 py-2 rounded-lg bg-[#4CB3FF]/10 text-[#4CB3FF] hover:bg-[#4CB3FF]/20 transition-all text-sm">
                Clear All Logs
              </button>
            </div>

            {errorLogs.map((log) => (
              <div
                key={log.id}
                className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-[#4CB3FF]/30 transition-all"
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
                    <span className="text-sm text-gray-500">{log.timestamp}</span>
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
                        ? "bg-[#4CB3FF] text-white"
                        : "bg-[#4CB3FF]/10 text-[#4CB3FF] hover:bg-[#4CB3FF]/20"
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
                <h3 className="text-white font-medium mb-2">{log.message}</h3>
                <div className="bg-black/40 rounded-lg p-3 font-mono text-xs text-gray-400 whitespace-pre-wrap">
                  {log.stackTrace}
                </div>

                {/* Explanation Panel */}
                {expandedExplanation === log.id && (
                  <div className="mt-4 p-4 bg-gradient-to-br from-[#4CB3FF]/10 to-[#7B68EE]/10 border border-[#4CB3FF]/30 rounded-xl space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {/* Cause */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-[#4CB3FF]" />
                        <h4 className="text-sm font-semibold text-[#4CB3FF]">Root Cause</h4>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{log.explanation.cause}</p>
                    </div>

                    {/* Impact */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <h4 className="text-sm font-semibold text-yellow-400">Impact</h4>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{log.explanation.impact}</p>
                    </div>

                    {/* Resolution Steps */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Wrench className="w-4 h-4 text-green-400" />
                        <h4 className="text-sm font-semibold text-green-400">How to Resolve</h4>
                      </div>
                      <ul className="space-y-2">
                        {log.explanation.resolution.map((step, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Prevention */}
                    <div className="pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-[#7B68EE]" />
                        <h4 className="text-sm font-semibold text-[#7B68EE]">Prevention</h4>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{log.explanation.prevention}</p>
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
            <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-[#4CB3FF]" />
                <h3 className="text-lg font-semibold">API Latency</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Current</span>
                    <span className="text-white font-semibold">{performanceMetrics.apiLatency.current}ms</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-[#4CB3FF] h-2 rounded-full"
                      style={{ width: `${(performanceMetrics.apiLatency.current / 300) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
                  <div>
                    <p className="text-xs text-gray-500">Average</p>
                    <p className="text-white font-semibold">{performanceMetrics.apiLatency.average}ms</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Peak</p>
                    <p className="text-white font-semibold">{performanceMetrics.apiLatency.peak}ms</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Database Query Performance */}
            <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-[#4CB3FF]" />
                <h3 className="text-lg font-semibold">Database Query Time</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Current</span>
                    <span className="text-white font-semibold">{performanceMetrics.dbQueryTime.current}ms</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-[#4CB3FF] h-2 rounded-full"
                      style={{ width: `${(performanceMetrics.dbQueryTime.current / 100) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
                  <div>
                    <p className="text-xs text-gray-500">Average</p>
                    <p className="text-white font-semibold">{performanceMetrics.dbQueryTime.average}ms</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Peak</p>
                    <p className="text-white font-semibold">{performanceMetrics.dbQueryTime.peak}ms</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <HardDrive className="w-6 h-6 text-[#4CB3FF]" />
                <h3 className="text-lg font-semibold">Memory Usage</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Current Usage</span>
                    <span className="text-white font-semibold">
                      {performanceMetrics.memoryUsage.current}GB / {performanceMetrics.memoryUsage.total}GB
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        performanceMetrics.memoryUsage.current / performanceMetrics.memoryUsage.total > 0.8
                          ? "bg-gradient-to-r from-red-500 to-orange-500"
                          : "bg-gradient-to-r from-green-500 to-[#4CB3FF]"
                      }`}
                      style={{
                        width: `${
                          (performanceMetrics.memoryUsage.current / performanceMetrics.memoryUsage.total) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="pt-3 border-t border-white/5">
                  <p className="text-xs text-gray-500">Percentage</p>
                  <p className="text-white font-semibold text-2xl">
                    {Math.round(
                      (performanceMetrics.memoryUsage.current / performanceMetrics.memoryUsage.total) * 100
                    )}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* CPU Usage */}
            <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-6 h-6 text-[#4CB3FF]" />
                <h3 className="text-lg font-semibold">CPU Usage</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Current Usage</span>
                    <span className="text-white font-semibold">{performanceMetrics.cpuUsage.current}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        performanceMetrics.cpuUsage.current > 80
                          ? "bg-gradient-to-r from-red-500 to-orange-500"
                          : "bg-gradient-to-r from-green-500 to-[#4CB3FF]"
                      }`}
                      style={{ width: `${performanceMetrics.cpuUsage.current}%` }}
                    />
                  </div>
                </div>
                <div className="pt-3 border-t border-white/5">
                  <p className="text-xs text-gray-500">CPU Cores</p>
                  <p className="text-white font-semibold text-2xl">{performanceMetrics.cpuUsage.cores}</p>
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
              <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-semibold">Current Uptime</h3>
                </div>
                <p className="text-4xl font-bold text-green-400">{uptimeData.current}%</p>
                <p className="text-sm text-gray-400 mt-2">Service availability</p>
              </div>

              <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="w-6 h-6 text-[#4CB3FF]" />
                  <h3 className="text-lg font-semibold">Last 30 Days</h3>
                </div>
                <p className="text-4xl font-bold text-[#4CB3FF]">{uptimeData.lastMonth}%</p>
                <p className="text-sm text-gray-400 mt-2">Monthly average</p>
              </div>

              <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-semibold">Last 24 Hours</h3>
                </div>
                <p className="text-4xl font-bold text-yellow-400">{uptimeData.last24h}%</p>
                <p className="text-sm text-gray-400 mt-2">Perfect uptime</p>
              </div>
            </div>

            {/* Incident History */}
            <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Incidents</h3>
              <div className="space-y-3">
                {uptimeData.incidents.map((incident, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-lg hover:bg-white/10 transition-all overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <div>
                          <p className="text-white font-medium">{incident.reason}</p>
                          <p className="text-sm text-gray-400">{incident.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Duration: {incident.duration}</span>
                        <button
                          onClick={() => setExpandedIncident(expandedIncident === index ? null : index)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            expandedIncident === index
                              ? "bg-[#4CB3FF] text-white"
                              : "bg-[#4CB3FF]/10 text-[#4CB3FF] hover:bg-[#4CB3FF]/20"
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
                        <div className="p-4 bg-gradient-to-br from-[#4CB3FF]/10 to-[#7B68EE]/10 border border-[#4CB3FF]/30 rounded-xl space-y-4 animate-in slide-in-from-top-2 duration-200">
                          {/* Cause */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Info className="w-4 h-4 text-[#4CB3FF]" />
                              <h4 className="text-sm font-semibold text-[#4CB3FF]">What Happened</h4>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">{incident.explanation.cause}</p>
                          </div>

                          {/* Impact */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                              <h4 className="text-sm font-semibold text-yellow-400">Impact</h4>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">{incident.explanation.impact}</p>
                          </div>

                          {/* Resolution */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Wrench className="w-4 h-4 text-green-400" />
                              <h4 className="text-sm font-semibold text-green-400">Resolution</h4>
                            </div>
                            <ul className="space-y-2">
                              {incident.explanation.resolution.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-medium">
                                    ✓
                                  </span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Prevention */}
                          <div className="pt-3 border-t border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-4 h-4 text-[#7B68EE]" />
                              <h4 className="text-sm font-semibold text-[#7B68EE]">Prevention</h4>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">{incident.explanation.prevention}</p>
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
              <h2 className="text-xl font-semibold">Email Alert Rules</h2>
              <button className="px-4 py-2 rounded-lg bg-[#4CB3FF] hover:bg-[#3DA0E8] text-white transition-all text-sm">
                + Add New Alert
              </button>
            </div>

            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-[#4CB3FF]/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Bell className={`w-5 h-5 ${alert.enabled ? "text-[#4CB3FF]" : "text-gray-500"}`} />
                    <div>
                      <h3 className="text-white font-medium">{alert.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{alert.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Email Alerts:</span>
                      <span
                        className={`text-sm font-medium ${alert.email ? "text-green-400" : "text-gray-500"}`}
                      >
                        {alert.email ? "ON" : "OFF"}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`px-4 py-2 rounded-lg transition-all text-sm ${
                        alert.enabled
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
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
