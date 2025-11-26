import { useState } from "react";
import { BarChart3, TrendingUp, Users, DollarSign, Zap, Download, FileText, LayoutDashboard, FolderOpen, UserCog, Settings, Shield, Activity, MessageSquare, Zap as ZapIcon } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState<"users" | "revenue" | "features" | "export">("users");

  // Mock user analytics data
  const userGrowthData = [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 185 },
    { month: "Mar", users: 240 },
    { month: "Apr", users: 310 },
    { month: "May", users: 395 },
    { month: "Jun", users: 480 },
  ];

  const engagementData = [
    { metric: "Daily Active", value: 245, percentage: 51 },
    { metric: "Weekly Active", value: 380, percentage: 79 },
    { metric: "Monthly Active", value: 450, percentage: 94 },
  ];

  const retentionData = [
    { cohort: "Week 1", retention: 100 },
    { cohort: "Week 2", retention: 78 },
    { cohort: "Week 3", retention: 65 },
    { cohort: "Week 4", retention: 58 },
    { cohort: "Week 5", retention: 54 },
    { cohort: "Week 6", retention: 52 },
  ];

  // Mock revenue analytics data
  const revenueData = [
    { month: "Jan", revenue: 4200 },
    { month: "Feb", revenue: 5800 },
    { month: "Mar", revenue: 6500 },
    { month: "Apr", revenue: 7200 },
    { month: "May", revenue: 8900 },
    { month: "Jun", revenue: 10400 },
  ];

  const subscriptionBreakdown = [
    { name: "Free", value: 245, color: "#8FA3B7" },
    { name: "Pro", value: 178, color: "#4CB3FF" },
    { name: "Business", value: 52, color: "#7B68EE" },
    { name: "Enterprise", value: 5, color: "#10b981" },
  ];

  const paymentMetrics = {
    successRate: 97.8,
    failedPayments: 12,
    churnRate: 4.2,
    averageRevenue: 48.5,
  };

  // Mock feature usage data
  const featureUsageData = [
    { feature: "Project Creation", usage: 1245, percentage: 92 },
    { feature: "AI Chat", usage: 2890, percentage: 98 },
    { feature: "Code Editor", usage: 1980, percentage: 87 },
    { feature: "Preview", usage: 2340, percentage: 95 },
    { feature: "Export", usage: 780, percentage: 56 },
  ];

  const aiModelUsage = [
    { model: "gpt-4o", usage: 15420, percentage: 68 },
    { model: "gpt-4o-mini", usage: 5240, percentage: 23 },
    { model: "other", usage: 2040, percentage: 9 },
  ];

  const handleExport = (format: "csv" | "pdf") => {
    console.log(`Exporting analytics as ${format.toUpperCase()}`);
    // Placeholder for export functionality
  };

  const COLORS = ["#4CB3FF", "#7B68EE", "#10b981", "#f59e0b"];

  return (
    <div className="min-h-screen bg-neutral-800 p-6">
      {/* Main Content */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-50 mb-2">Analytics & Reports</h1>
        <p className="text-neutral-400">Comprehensive platform insights and metrics</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-neutral-700">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === "users"
              ? "border-b-2 border-blue-400 text-blue-400"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          User Analytics
        </button>
        <button
          onClick={() => setActiveTab("revenue")}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === "revenue"
              ? "border-b-2 border-blue-400 text-blue-400"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Revenue Analytics
        </button>
        <button
          onClick={() => setActiveTab("features")}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === "features"
              ? "border-b-2 border-blue-400 text-blue-400"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Feature Usage
        </button>
        <button
          onClick={() => setActiveTab("export")}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === "export"
              ? "border-b-2 border-blue-400 text-blue-400"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Export Reports
        </button>
      </div>

        {/* User Analytics Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* User Growth Chart */}
            <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-[#4CB3FF]" />
                <h3 className="text-xl font-semibold">User Growth Over Time</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#8FA3B7" />
                  <YAxis stroke="#8FA3B7" />
                  <Tooltip
                    contentStyle={{ background: "#0A0F17", border: "1px solid #ffffff20", borderRadius: "8px" }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#4CB3FF" strokeWidth={3} dot={{ fill: "#4CB3FF" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Engagement Metrics */}
            <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-[#4CB3FF]" />
                <h3 className="text-xl font-semibold">User Engagement Metrics</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {engagementData.map((item) => (
                  <div key={item.metric} className="bg-black/20 rounded-lg p-5 border border-white/5">
                    <p className="text-sm text-gray-400 mb-2">{item.metric}</p>
                    <p className="text-3xl font-bold text-white mb-2">{item.value}</p>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#4CB3FF] to-[#7B68EE] h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{item.percentage}% of total users</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Retention Rate Chart */}
            <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-[#4CB3FF]" />
                <h3 className="text-xl font-semibold">User Retention Rate</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={retentionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="cohort" stroke="#8FA3B7" />
                  <YAxis stroke="#8FA3B7" />
                  <Tooltip
                    contentStyle={{ background: "#0A0F17", border: "1px solid #ffffff20", borderRadius: "8px" }}
                  />
                  <Bar dataKey="retention" fill="#4CB3FF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Revenue Analytics Tab */}
        {activeTab === "revenue" && (
          <div className="space-y-6">
            {/* Revenue Chart */}
            <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-6 h-6 text-[#4CB3FF]" />
                <h3 className="text-xl font-semibold">Subscription Revenue Over Time</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#8FA3B7" />
                  <YAxis stroke="#8FA3B7" />
                  <Tooltip
                    contentStyle={{ background: "#0A0F17", border: "1px solid #ffffff20", borderRadius: "8px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-5">
                <p className="text-sm text-gray-400 mb-2">Payment Success Rate</p>
                <p className="text-3xl font-bold text-green-400">{paymentMetrics.successRate}%</p>
              </div>
              <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-5">
                <p className="text-sm text-gray-400 mb-2">Failed Payments</p>
                <p className="text-3xl font-bold text-red-400">{paymentMetrics.failedPayments}</p>
              </div>
              <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-5">
                <p className="text-sm text-gray-400 mb-2">Churn Rate</p>
                <p className="text-3xl font-bold text-yellow-400">{paymentMetrics.churnRate}%</p>
              </div>
              <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-5">
                <p className="text-sm text-gray-400 mb-2">Avg Revenue/User</p>
                <p className="text-3xl font-bold text-[#4CB3FF]">${paymentMetrics.averageRevenue}</p>
              </div>
            </div>

            {/* Subscription Breakdown */}
            <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-[#4CB3FF]" />
                <h3 className="text-xl font-semibold">Subscription Plan Distribution</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={subscriptionBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {subscriptionBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#0A0F17", border: "1px solid #ffffff20", borderRadius: "8px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col justify-center space-y-4">
                  {subscriptionBreakdown.map((plan) => (
                    <div key={plan.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ background: plan.color }} />
                        <span className="text-white">{plan.name}</span>
                      </div>
                      <span className="text-gray-400 font-semibold">{plan.value} users</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Usage Tab */}
        {activeTab === "features" && (
          <div className="space-y-6">
            {/* Most Used Features */}
            <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-[#4CB3FF]" />
                <h3 className="text-xl font-semibold">Most Used Features</h3>
              </div>
              <div className="space-y-4">
                {featureUsageData.map((feature) => (
                  <div key={feature.feature} className="bg-black/20 rounded-lg p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{feature.feature}</span>
                      <span className="text-gray-400">{feature.usage} uses</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#4CB3FF] to-[#7B68EE] h-2 rounded-full"
                        style={{ width: `${feature.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{feature.percentage}% adoption rate</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Model Usage Breakdown */}
            <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-[#4CB3FF]" />
                <h3 className="text-xl font-semibold">AI Model Usage Breakdown</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aiModelUsage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis type="number" stroke="#8FA3B7" />
                  <YAxis type="category" dataKey="model" stroke="#8FA3B7" />
                  <Tooltip
                    contentStyle={{ background: "#0A0F17", border: "1px solid #ffffff20", borderRadius: "8px" }}
                  />
                  <Bar dataKey="usage" fill="#4CB3FF" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {aiModelUsage.map((model, idx) => (
                  <div key={model.model} className="bg-black/20 rounded-lg p-4 border border-white/5">
                    <p className="text-sm text-gray-400 mb-1">{model.model}</p>
                    <p className="text-2xl font-bold" style={{ color: COLORS[idx % COLORS.length] }}>
                      {model.usage.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{model.percentage}% of total</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Export Reports Tab */}
        {activeTab === "export" && (
          <div className="space-y-6">
            <div className="bg-[#0A0F17]/60 backdrop-blur-xl border border-white/10 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Download className="w-6 h-6 text-[#4CB3FF]" />
                <h3 className="text-xl font-semibold">Export All Analytics Data</h3>
              </div>
              <p className="text-gray-400 mb-8">
                Download comprehensive reports of all platform analytics including user data, revenue metrics, and
                feature usage statistics.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CSV Export */}
                <div className="bg-black/20 rounded-lg p-6 border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-8 h-8 text-[#4CB3FF]" />
                    <div>
                      <h4 className="text-lg font-semibold text-white">CSV Export</h4>
                      <p className="text-sm text-gray-400">Spreadsheet-compatible format</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Export all data in CSV format for analysis in Excel, Google Sheets, or other spreadsheet
                    applications.
                  </p>
                  <button
                    onClick={() => handleExport("csv")}
                    className="w-full px-4 py-3 rounded-lg bg-[#4CB3FF]/10 hover:bg-[#4CB3FF]/20 text-[#4CB3FF] border border-[#4CB3FF]/30 transition-all font-medium"
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Export as CSV
                  </button>
                </div>

                {/* PDF Export */}
                <div className="bg-black/20 rounded-lg p-6 border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-8 h-8 text-[#7B68EE]" />
                    <div>
                      <h4 className="text-lg font-semibold text-white">PDF Export</h4>
                      <p className="text-sm text-gray-400">Professional report format</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Generate a formatted PDF report with charts, graphs, and comprehensive analytics summary.
                  </p>
                  <button
                    onClick={() => handleExport("pdf")}
                    className="w-full px-4 py-3 rounded-lg bg-[#7B68EE]/10 hover:bg-[#7B68EE]/20 text-[#7B68EE] border border-[#7B68EE]/30 transition-all font-medium"
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Export as PDF
                  </button>
                </div>
              </div>

              {/* Export Options */}
              <div className="mt-8 bg-black/20 rounded-lg p-6 border border-white/5">
                <h4 className="text-lg font-semibold text-white mb-4">Export Options</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded accent-[#4CB3FF]" defaultChecked />
                    <span>Include user analytics data</span>
                  </label>
                  <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded accent-[#4CB3FF]" defaultChecked />
                    <span>Include revenue analytics data</span>
                  </label>
                  <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded accent-[#4CB3FF]" defaultChecked />
                    <span>Include feature usage data</span>
                  </label>
                  <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded accent-[#4CB3FF]" defaultChecked />
                    <span>Include AI model breakdown</span>
                  </label>
                  <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded accent-[#4CB3FF]" />
                    <span>Include raw event logs</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
