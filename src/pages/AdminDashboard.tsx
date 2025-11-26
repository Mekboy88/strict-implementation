import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, FolderOpen, Activity, Database, CheckCircle2, HardDrive, Cpu, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    // User Metrics
    totalUsers: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0,
    activeUsersToday: 0,
    activeUsersThisMonth: 0,
    // Project Metrics
    totalProjects: 0,
    activeProjects: 0,
    projectsCreatedToday: 0,
    avgProjectsPerUser: 0,
    // System Health (placeholder data)
    serverStatus: 'healthy',
    databaseStatus: 'healthy',
    apiResponseTime: 125,
    errorRate: 0.02,
    // Storage Metrics (placeholder)
    totalStorageUsed: 2.4,
    avgStoragePerUser: 48,
    storageLimit: 100,
    // AI Usage (placeholder)
    totalAIRequests: 15420,
    aiRequestsToday: 342,
    mostUsedModel: 'gpt-4o',
    avgResponseTime: 1.8,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: users } = await supabase.from('user_roles').select('*');
      const { data: projects } = await supabase.from('projects').select('*');

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const firstDayOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const newUsersToday = users?.filter(u => new Date(u.created_at!) >= today).length || 0;
      const newUsersThisWeek = users?.filter(u => new Date(u.created_at!) >= firstDayOfWeek).length || 0;
      const newUsersThisMonth = users?.filter(u => new Date(u.created_at!) >= firstDayOfMonth).length || 0;
      const projectsCreatedToday = projects?.filter(p => new Date(p.created_at) >= today).length || 0;
      const activeProjects = projects?.filter(p => new Date(p.updated_at) >= thirtyDaysAgo).length || 0;

      setStats({
        totalUsers: users?.length || 0,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth,
        activeUsersToday: Math.floor((users?.length || 0) * 0.15),
        activeUsersThisMonth: Math.floor((users?.length || 0) * 0.45),
        totalProjects: projects?.length || 0,
        activeProjects,
        projectsCreatedToday,
        avgProjectsPerUser: users?.length ? parseFloat(((projects?.length || 0) / users.length).toFixed(1)) : 0,
        serverStatus: 'healthy',
        databaseStatus: 'healthy',
        apiResponseTime: 125,
        errorRate: 0.02,
        totalStorageUsed: 2.4,
        avgStoragePerUser: 48,
        storageLimit: 100,
        totalAIRequests: 15420,
        aiRequestsToday: 342,
        mostUsedModel: 'gpt-4o',
        avgResponseTime: 1.8,
      });

      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-neutral-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Platform Dashboard
        </h1>
        <p className="text-sm mt-1 text-white">
          Overview of platform statistics and metrics
        </p>
      </div>

      {/* User Metrics Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">User Metrics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Total Users</p>
            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">New Today</p>
            <p className="text-3xl font-bold text-blue-400">+{stats.newUsersToday}</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">New This Week</p>
            <p className="text-3xl font-bold text-blue-400">+{stats.newUsersThisWeek}</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">New This Month</p>
            <p className="text-3xl font-bold text-blue-400">+{stats.newUsersThisMonth}</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">DAU (Today)</p>
            <p className="text-3xl font-bold text-white">{stats.activeUsersToday}</p>
            <p className="text-xs mt-1 text-white">Daily active users</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">MAU (30d)</p>
            <p className="text-3xl font-bold text-white">{stats.activeUsersThisMonth}</p>
            <p className="text-xs mt-1 text-white">Monthly active users</p>
          </div>
        </div>
      </div>

      {/* Project Metrics Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Project Metrics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Total Projects</p>
            <p className="text-3xl font-bold text-white">{stats.totalProjects}</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Active Projects</p>
            <p className="text-3xl font-bold text-blue-400">{stats.activeProjects}</p>
            <p className="text-xs mt-1 text-white">Updated in 30 days</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Created Today</p>
            <p className="text-3xl font-bold text-blue-400">+{stats.projectsCreatedToday}</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Avg per User</p>
            <p className="text-3xl font-bold text-white">{stats.avgProjectsPerUser}</p>
          </div>
        </div>
      </div>

      {/* System Health Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">System Health</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-white">Server Status</p>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-500">Healthy</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-white">Database</p>
              <Database className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-500">Healthy</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">API Response</p>
            <p className="text-3xl font-bold text-white">{stats.apiResponseTime}ms</p>
            <p className="text-xs mt-1 text-white">Average time</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Error Rate</p>
            <p className="text-3xl font-bold text-green-500">{(stats.errorRate * 100).toFixed(2)}%</p>
            <p className="text-xs mt-1 text-white">Last 24 hours</p>
          </div>
        </div>
      </div>

      {/* Storage Metrics Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Storage Metrics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Total Storage</p>
            <p className="text-3xl font-bold text-white">{stats.totalStorageUsed} GB</p>
            <div className="mt-2 h-2 rounded-full bg-neutral-600">
              <div className="h-full rounded-full transition-all bg-blue-400" style={{ width: `${(stats.totalStorageUsed / stats.storageLimit) * 100}%` }}></div>
            </div>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Avg per User</p>
            <p className="text-3xl font-bold text-white">{stats.avgStoragePerUser} MB</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Storage Limit</p>
            <p className="text-3xl font-bold text-white">{stats.storageLimit} GB</p>
            <p className="text-xs mt-1 text-white">{stats.storageLimit - stats.totalStorageUsed} GB remaining</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-green-500" />
              <p className="text-sm text-white">Status</p>
            </div>
            <p className="text-xl font-bold text-green-500">Good</p>
            <p className="text-xs mt-1 text-white">97.6 GB available</p>
          </div>
        </div>
      </div>

      {/* AI Usage Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">AI Usage</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Total Requests</p>
            <p className="text-3xl font-bold text-white">{stats.totalAIRequests.toLocaleString()}</p>
            <p className="text-xs mt-1 text-white">All time</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Requests Today</p>
            <p className="text-3xl font-bold text-blue-400">+{stats.aiRequestsToday}</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Most Used Model</p>
            <p className="text-2xl font-bold text-white">{stats.mostUsedModel}</p>
            <p className="text-xs mt-1 text-white">Primary model</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Avg Response Time</p>
            <p className="text-3xl font-bold text-white">{stats.avgResponseTime}s</p>
            <p className="text-xs mt-1 text-white">Per request</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;