import { useState } from "react";
import { BarChart3, TrendingUp, Users, DollarSign, Zap, Download, FileText } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
    { name: "Free", value: 245, color: "#6B7280" },
    { name: "Pro", value: 178, color: "#3B82F6" },
    { name: "Business", value: 52, color: "#8B5CF6" },
    { name: "Enterprise", value: 5, color: "#10B981" },
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
  };

  const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"];

  return (
    <div className="min-h-screen bg-neutral-800 p-6">
      {/* Main Content */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics & Reports</h1>
        <p className="text-white">Comprehensive platform insights and metrics</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-neutral-700">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === "users"
              ? "border-b-2 border-blue-400 text-blue-400"
              : "text-white hover:text-blue-400"
          }`}
        >
          User Analytics
        </button>
        <button
          onClick={() => setActiveTab("revenue")}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === "revenue"
              ? "border-b-2 border-blue-400 text-blue-400"
              : "text-white hover:text-blue-400"
          }`}
        >
          Revenue Analytics
        </button>
        <button
          onClick={() => setActiveTab("features")}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === "features"
              ? "border-b-2 border-blue-400 text-blue-400"
              : "text-white hover:text-blue-400"
          }`}
        >
          Feature Usage
        </button>
        <button
          onClick={() => setActiveTab("export")}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === "export"
              ? "border-b-2 border-blue-400 text-blue-400"
              : "text-white hover:text-blue-400"
          }`}
        >
          Export Reports
        </button>
      </div>

      {/* User Analytics Tab */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* User Growth Chart */}
          <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">User Growth Over Time</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#525252" />
                <XAxis dataKey="month" stroke="#FFFFFF" />
                <YAxis stroke="#FFFFFF" />
                <Tooltip
                  contentStyle={{ background: "#404040", border: "1px solid #525252", borderRadius: "8px", color: "#FFFFFF" }}
                />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={3} dot={{ fill: "#3B82F6" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement Metrics */}
          <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">User Engagement Metrics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {engagementData.map((item) => (
                <div key={item.metric} className="bg-neutral-800 rounded-lg p-5 border border-neutral-600">
                  <p className="text-sm text-white mb-2">{item.metric}</p>
                  <p className="text-3xl font-bold text-white mb-2">{item.value}</p>
                  <div className="w-full bg-neutral-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-white mt-2">{item.percentage}% of total users</p>
                </div>
              ))}
            </div>
          </div>

          {/* Retention Rate Chart */}
          <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">User Retention Rate</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#525252" />
                <XAxis dataKey="cohort" stroke="#FFFFFF" />
                <YAxis stroke="#FFFFFF" />
                <Tooltip
                  contentStyle={{ background: "#404040", border: "1px solid #525252", borderRadius: "8px", color: "#FFFFFF" }}
                />
                <Bar dataKey="retention" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Revenue Analytics Tab */}
      {activeTab === "revenue" && (
        <div className="space-y-6">
          {/* Revenue Chart */}
          <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Subscription Revenue Over Time</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#525252" />
                <XAxis dataKey="month" stroke="#FFFFFF" />
                <YAxis stroke="#FFFFFF" />
                <Tooltip
                  contentStyle={{ background: "#404040", border: "1px solid #525252", borderRadius: "8px", color: "#FFFFFF" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-5">
              <p className="text-sm text-white mb-2">Payment Success Rate</p>
              <p className="text-3xl font-bold text-green-400">{paymentMetrics.successRate}%</p>
            </div>
            <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-5">
              <p className="text-sm text-white mb-2">Failed Payments</p>
              <p className="text-3xl font-bold text-red-400">{paymentMetrics.failedPayments}</p>
            </div>
            <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-5">
              <p className="text-sm text-white mb-2">Churn Rate</p>
              <p className="text-3xl font-bold text-yellow-400">{paymentMetrics.churnRate}%</p>
            </div>
            <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-5">
              <p className="text-sm text-white mb-2">Avg Revenue/User</p>
              <p className="text-3xl font-bold text-blue-400">${paymentMetrics.averageRevenue}</p>
            </div>
          </div>

          {/* Subscription Breakdown */}
          <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Subscription Plan Distribution</h3>
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
                    contentStyle={{ background: "#404040", border: "1px solid #525252", borderRadius: "8px", color: "#FFFFFF" }}
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
                    <span className="text-white font-semibold">{plan.value} users</span>
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
          <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Most Used Features</h3>
            </div>
            <div className="space-y-4">
              {featureUsageData.map((feature) => (
                <div key={feature.feature} className="bg-neutral-800 rounded-lg p-4 border border-neutral-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{feature.feature}</span>
                    <span className="text-white">{feature.usage} uses</span>
                  </div>
                  <div className="w-full bg-neutral-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${feature.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-white mt-1">{feature.percentage}% adoption rate</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Model Usage Breakdown */}
          <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">AI Model Usage Breakdown</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={aiModelUsage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#525252" />
                <XAxis type="number" stroke="#FFFFFF" />
                <YAxis type="category" dataKey="model" stroke="#FFFFFF" />
                <Tooltip
                  contentStyle={{ background: "#404040", border: "1px solid #525252", borderRadius: "8px", color: "#FFFFFF" }}
                />
                <Bar dataKey="usage" fill="#3B82F6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {aiModelUsage.map((model, idx) => (
                <div key={model.model} className="bg-neutral-800 rounded-lg p-4 border border-neutral-600">
                  <p className="text-sm text-white mb-1">{model.model}</p>
                  <p className="text-2xl font-bold" style={{ color: COLORS[idx % COLORS.length] }}>
                    {model.usage.toLocaleString()}
                  </p>
                  <p className="text-xs text-white mt-1">{model.percentage}% of total</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Export Reports Tab */}
      {activeTab === "export" && (
        <div className="space-y-6">
          <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Download className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Export All Analytics Data</h3>
            </div>
            <p className="text-white mb-8">
              Download comprehensive reports of all platform analytics including user data, revenue metrics, and
              feature usage statistics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CSV Export */}
              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-600">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <div>
                    <h4 className="text-lg font-semibold text-white">CSV Export</h4>
                    <p className="text-sm text-white">Spreadsheet-compatible format</p>
                  </div>
                </div>
                <p className="text-sm text-white mb-4">
                  Export all data in CSV format for analysis in Excel, Google Sheets, or other spreadsheet
                  applications.
                </p>
                <button
                  onClick={() => handleExport("csv")}
                  className="w-full px-4 py-3 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 transition-all font-medium"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Export as CSV
                </button>
              </div>

              {/* PDF Export */}
              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-600">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-8 h-8 text-purple-400" />
                  <div>
                    <h4 className="text-lg font-semibold text-white">PDF Export</h4>
                    <p className="text-sm text-white">Presentation-ready format</p>
                  </div>
                </div>
                <p className="text-sm text-white mb-4">
                  Export all data as a formatted PDF report with charts and visualizations for presentations.
                </p>
                <button
                  onClick={() => handleExport("pdf")}
                  className="w-full px-4 py-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/50 transition-all font-medium"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Export as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}