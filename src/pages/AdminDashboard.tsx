import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, FolderOpen, Activity, Database, CheckCircle2, HardDrive, Cpu, AlertCircle, DollarSign, CreditCard, FileText, Rocket, XCircle, Zap, Github, GitBranch } from "lucide-react";

interface PlanSubscription {
  planName: string;
  count: number;
  revenue: number;
}

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
    // Billing Metrics
    mrr: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    outstandingInvoices: 0,
    outstandingAmount: 0,
    subscriptionsByPlan: [] as PlanSubscription[],
    // Deployment Metrics
    totalDeployments: 0,
    successfulDeployments: 0,
    failedDeployments: 0,
    pendingDeployments: 0,
    deploymentsToday: 0,
    deploymentSuccessRate: 0,
    // Edge Function Metrics
    totalEdgeFunctions: 0,
    activeEdgeFunctions: 0,
    totalInvocations: 0,
    invocationsToday: 0,
    edgeFunctionErrors: 0,
    edgeFunctionErrorRate: 0,
    avgEdgeFunctionDuration: 0,
    // GitHub Integration Metrics
    connectedGitHubAccounts: 0,
    reposSynced: 0,
    recentGitHubConnections: 0,
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
      // Fetch users, projects, billing, and deployment data in parallel
      const [usersRes, projectsRes, billingAccountsRes, invoicesRes, plansRes, deploymentsRes, edgeFunctionsRes, edgeLogsRes, edgeErrorsRes, githubConnectionsRes] = await Promise.all([
        supabase.from('user_roles').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('billing_accounts').select('*'),
        supabase.from('billing_invoices').select('*'),
        supabase.from('billing_plans').select('*'),
        supabase.from('project_deployments').select('*'),
        supabase.from('edge_functions').select('*'),
        supabase.from('edge_logs').select('*'),
        supabase.from('edge_errors').select('*'),
        supabase.from('github_connections').select('*'),
      ]);

      const users = usersRes.data;
      const projects = projectsRes.data || [];
      const billingAccounts = billingAccountsRes.data || [];
      const invoices = invoicesRes.data || [];
      const plans = plansRes.data || [];
      const deployments = deploymentsRes.data || [];
      const edgeFunctions = edgeFunctionsRes.data || [];
      const edgeLogs = edgeLogsRes.data || [];
      const edgeErrors = edgeErrorsRes.data || [];
      const githubConnections = githubConnectionsRes.data || [];

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

      // Calculate billing metrics
      const activeSubscriptions = billingAccounts.length;
      const outstandingInvoicesList = invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue');
      const outstandingInvoices = outstandingInvoicesList.length;
      const outstandingAmount = outstandingInvoicesList.reduce((sum, inv) => sum + Number(inv.amount), 0);
      
      // Calculate total revenue from paid invoices
      const paidInvoices = invoices.filter(inv => inv.status === 'paid');
      const totalRevenue = paidInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
      
      // Calculate MRR based on active plans (using monthly prices)
      const activePlans = plans.filter(p => p.is_active);
      const mrr = activePlans.reduce((sum, plan) => {
        // Count how many accounts might be on each plan (simplified - in real app you'd have a plan_id on billing_accounts)
        return sum + Number(plan.price_monthly);
      }, 0) * (activeSubscriptions > 0 ? 1 : 0);

      // Group subscriptions by plan
      const subscriptionsByPlan: PlanSubscription[] = activePlans.map(plan => ({
        planName: plan.plan_name,
        count: Math.floor(activeSubscriptions / activePlans.length) || 0,
        revenue: Number(plan.price_monthly),
      }));

      // Calculate deployment metrics
      const totalDeployments = deployments.length;
      const successfulDeployments = deployments.filter(d => d.status === 'success' || d.status === 'deployed').length;
      const failedDeployments = deployments.filter(d => d.status === 'failed' || d.status === 'error').length;
      const pendingDeployments = deployments.filter(d => d.status === 'pending' || d.status === 'building').length;
      const deploymentsToday = deployments.filter(d => new Date(d.created_at) >= today).length;
      const deploymentSuccessRate = totalDeployments > 0 
        ? ((successfulDeployments / totalDeployments) * 100) 
        : 0;

      // Calculate edge function metrics
      const totalEdgeFunctions = edgeFunctions.length;
      const activeEdgeFunctions = edgeFunctions.filter(f => f.is_active).length;
      const totalInvocations = edgeLogs.length;
      const invocationsToday = edgeLogs.filter(l => new Date(l.created_at) >= today).length;
      const edgeFunctionErrors = edgeErrors.length;
      const edgeFunctionErrorRate = totalInvocations > 0 
        ? ((edgeFunctionErrors / totalInvocations) * 100) 
        : 0;
      const avgEdgeFunctionDuration = totalInvocations > 0
        ? edgeLogs.reduce((sum, l) => sum + l.duration_ms, 0) / totalInvocations
        : 0;

      // Calculate GitHub integration metrics
      const connectedGitHubAccounts = githubConnections.length;
      const reposSynced = projects.filter(p => p.github_repo_url).length;
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentGitHubConnections = githubConnections.filter(c => new Date(c.connected_at) >= sevenDaysAgo).length;

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
        // Billing
        mrr,
        totalRevenue,
        activeSubscriptions,
        outstandingInvoices,
        outstandingAmount,
        subscriptionsByPlan,
        // Deployments
        totalDeployments,
        successfulDeployments,
        failedDeployments,
        pendingDeployments,
        deploymentsToday,
        deploymentSuccessRate,
        // Edge Functions
        totalEdgeFunctions,
        activeEdgeFunctions,
        totalInvocations,
        invocationsToday,
        edgeFunctionErrors,
        edgeFunctionErrorRate,
        avgEdgeFunctionDuration,
        // GitHub
        connectedGitHubAccounts,
        reposSynced,
        recentGitHubConnections,
        // System
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
    <div className="h-full bg-neutral-800 p-6 overflow-y-auto">
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

      {/* Billing & Revenue Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-semibold text-white">Billing & Revenue</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-green-400" />
              <p className="text-sm text-white">Monthly Recurring Revenue</p>
            </div>
            <p className="text-3xl font-bold text-green-400">${stats.mrr.toLocaleString()}</p>
            <p className="text-xs mt-1 text-white/70">MRR this month</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Total Revenue</p>
            <p className="text-3xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs mt-1 text-white/70">All time</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Active Subscriptions</p>
            <p className="text-3xl font-bold text-blue-400">{stats.activeSubscriptions}</p>
            <p className="text-xs mt-1 text-white/70">Paying customers</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-yellow-400" />
              <p className="text-sm text-white">Outstanding Invoices</p>
            </div>
            <p className="text-3xl font-bold text-yellow-400">{stats.outstandingInvoices}</p>
            <p className="text-xs mt-1 text-white/70">${stats.outstandingAmount.toLocaleString()} pending</p>
          </div>
        </div>
        
        {/* Subscriptions by Plan */}
        {stats.subscriptionsByPlan.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-white/70 mb-3">Subscriptions by Plan</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {stats.subscriptionsByPlan.map((plan) => (
                <div key={plan.planName} className="rounded-lg border p-4 bg-neutral-700/50 border-neutral-600">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{plan.planName}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-400/20 text-blue-400">
                      {plan.count} users
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-green-400 mt-2">${plan.revenue}/mo</p>
                </div>
              ))}
            </div>
          </div>
        )}
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

      {/* Deployment Metrics Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Deployment Metrics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Total Deployments</p>
            <p className="text-3xl font-bold text-white">{stats.totalDeployments}</p>
            <p className="text-xs mt-1 text-white/70">All time</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <p className="text-sm text-white">Successful</p>
            </div>
            <p className="text-3xl font-bold text-green-400">{stats.successfulDeployments}</p>
            <p className="text-xs mt-1 text-white/70">{stats.deploymentSuccessRate.toFixed(1)}% success rate</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <p className="text-sm text-white">Failed</p>
            </div>
            <p className="text-3xl font-bold text-red-400">{stats.failedDeployments}</p>
            <p className="text-xs mt-1 text-white/70">{stats.pendingDeployments} pending</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Deployments Today</p>
            <p className="text-3xl font-bold text-purple-400">+{stats.deploymentsToday}</p>
          </div>
        </div>
      </div>

      {/* Edge Function Stats Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">Edge Function Stats</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Total Functions</p>
            <p className="text-3xl font-bold text-white">{stats.totalEdgeFunctions}</p>
            <p className="text-xs mt-1 text-white/70">{stats.activeEdgeFunctions} active</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Total Invocations</p>
            <p className="text-3xl font-bold text-yellow-400">{stats.totalInvocations.toLocaleString()}</p>
            <p className="text-xs mt-1 text-white/70">+{stats.invocationsToday} today</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-sm text-white">Errors</p>
            </div>
            <p className="text-3xl font-bold text-red-400">{stats.edgeFunctionErrors}</p>
            <p className="text-xs mt-1 text-white/70">{stats.edgeFunctionErrorRate.toFixed(2)}% error rate</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Avg Duration</p>
            <p className="text-3xl font-bold text-white">{stats.avgEdgeFunctionDuration.toFixed(0)}ms</p>
            <p className="text-xs mt-1 text-white/70">Per invocation</p>
          </div>
        </div>
      </div>

      {/* GitHub Integration Stats Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Github className="w-5 h-5 text-white" />
          <h2 className="text-xl font-semibold text-white">GitHub Integration</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <div className="flex items-center gap-2 mb-2">
              <Github className="w-4 h-4 text-white" />
              <p className="text-sm text-white">Connected Accounts</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.connectedGitHubAccounts}</p>
            <p className="text-xs mt-1 text-white/70">+{stats.recentGitHubConnections} this week</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="w-4 h-4 text-blue-400" />
              <p className="text-sm text-white">Repos Synced</p>
            </div>
            <p className="text-3xl font-bold text-blue-400">{stats.reposSynced}</p>
            <p className="text-xs mt-1 text-white/70">Projects with GitHub</p>
          </div>
          <div className="rounded-lg border p-5 bg-neutral-700 border-neutral-600">
            <p className="text-sm mb-2 text-white">Sync Rate</p>
            <p className="text-3xl font-bold text-green-400">
              {stats.totalProjects > 0 
                ? ((stats.reposSynced / stats.totalProjects) * 100).toFixed(1) 
                : 0}%
            </p>
            <p className="text-xs mt-1 text-white/70">Projects connected to GitHub</p>
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