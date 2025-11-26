import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, Mail, Shield, Calendar, Clock, CreditCard, Building2, 
  FolderOpen, Activity, CheckCircle, XCircle, Globe, Key,
  HardDrive, Cpu, GitBranch, AlertTriangle, LogIn, Smartphone,
  Copy, RefreshCw
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    user_id: string;
    email?: string;
    role: string;
    created_at: string;
    last_sign_in_at?: string;
    email_confirmed_at?: string;
    banned_until?: string;
    subscription_status?: string;
    team_count?: number;
    projectCount?: number;
  } | null;
}

interface ProjectData {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  github_repo_url: string | null;
}

interface TeamData {
  id: string;
  team_id: string;
  role: string;
  joined_at: string;
  teams: {
    name: string;
    description: string | null;
  };
}

interface ActivityData {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  created_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

interface SubscriptionData {
  id: string;
  status: string;
  billing_cycle: string;
  current_period_start: string;
  current_period_end: string | null;
  trial_start: string | null;
  trial_end: string | null;
  cancel_at_period_end: boolean;
  plan_id: string | null;
}

interface SecurityEventData {
  id: string;
  event_type: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  metadata: any;
}

interface ApiKeyData {
  id: string;
  key_name: string;
  key_prefix: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
}

interface GithubConnectionData {
  id: string;
  github_username: string;
  connected_at: string;
}

interface StorageUsageData {
  bytes_used: number;
  file_count: number;
}

interface AiUsageData {
  total_tokens: number;
  total_requests: number;
  total_cost: number;
}

export const UserDetailsDialog = ({ open, onOpenChange, user }: UserDetailsDialogProps) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEventData[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([]);
  const [githubConnection, setGithubConnection] = useState<GithubConnectionData | null>(null);
  const [storageUsage, setStorageUsage] = useState<StorageUsageData | null>(null);
  const [aiUsage, setAiUsage] = useState<AiUsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && user) {
      fetchUserDetails();
    }
  }, [open, user]);

  const fetchUserDetails = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const [
        projectsRes, teamsRes, activityRes, subRes, securityRes,
        apiKeysRes, githubRes, storageRes, aiUsageRes
      ] = await Promise.all([
        supabase.from("projects").select("id, name, description, created_at, updated_at, github_repo_url")
          .eq("user_id", user.user_id).order("created_at", { ascending: false }).limit(20),
        supabase.from("team_members").select("id, team_id, role, joined_at, teams(name, description)")
          .eq("user_id", user.user_id),
        supabase.from("activity_logs").select("id, action, entity_type, entity_id, created_at, ip_address, user_agent")
          .eq("user_id", user.user_id).order("created_at", { ascending: false }).limit(20),
        supabase.from("user_subscriptions").select("*").eq("user_id", user.user_id).maybeSingle(),
        supabase.from("security_events").select("id, event_type, ip_address, user_agent, created_at, metadata")
          .eq("user_id", user.user_id).order("created_at", { ascending: false }).limit(20),
        supabase.from("api_keys").select("id, key_name, key_prefix, is_active, created_at, last_used_at, expires_at")
          .eq("user_id", user.user_id).order("created_at", { ascending: false }),
        supabase.from("github_connections").select("id, github_username, connected_at")
          .eq("user_id", user.user_id).maybeSingle(),
        supabase.from("storage_usage").select("bytes_used, file_count")
          .eq("user_id", user.user_id).maybeSingle(),
        supabase.from("ai_usage").select("tokens_used, request_cost").eq("user_id", user.user_id)
      ]);

      setProjects(projectsRes.data || []);
      setTeams((teamsRes.data as any) || []);
      setActivities(activityRes.data || []);
      setSubscription(subRes.data);
      setSecurityEvents(securityRes.data || []);
      setApiKeys(apiKeysRes.data || []);
      setGithubConnection(githubRes.data);
      setStorageUsage(storageRes.data);
      
      if (aiUsageRes.data && aiUsageRes.data.length > 0) {
        const totalTokens = aiUsageRes.data.reduce((sum, item) => sum + (item.tokens_used || 0), 0);
        const totalCost = aiUsageRes.data.reduce((sum, item) => sum + Number(item.request_cost || 0), 0);
        setAiUsage({ total_tokens: totalTokens, total_requests: aiUsageRes.data.length, total_cost: totalCost });
      } else {
        setAiUsage(null);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: `${label} copied to clipboard` });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner": return "bg-purple-500/30 text-purple-400 border-purple-500/50";
      case "admin": return "bg-blue-500/30 text-blue-400 border-blue-500/50";
      case "moderator": return "bg-yellow-500/30 text-yellow-400 border-yellow-500/50";
      default: return "bg-neutral-500/30 text-neutral-300 border-neutral-500/50";
    }
  };

  const getStatusBadge = () => {
    if (user?.banned_until && new Date(user.banned_until) > new Date()) {
      return <Badge className="bg-red-500/30 text-red-400 border-red-500/50">Suspended</Badge>;
    }
    if (user?.email_confirmed_at) {
      return <Badge className="bg-green-500/30 text-green-400 border-green-500/50">Active</Badge>;
    }
    return <Badge className="bg-yellow-500/30 text-yellow-400 border-yellow-500/50">Pending Verification</Badge>;
  };

  const formatDate = (date: string | undefined | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case "login": return <LogIn className="w-4 h-4 text-green-400" />;
      case "logout": return <LogIn className="w-4 h-4 text-neutral-400" />;
      case "password_change": return <Key className="w-4 h-4 text-yellow-400" />;
      case "failed_login": return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  const parseUserAgent = (ua: string | null) => {
    if (!ua) return "Unknown Device";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Mobile")) return "Mobile";
    return "Desktop";
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-800 border-neutral-700 max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              User Details
            </div>
            <Button variant="ghost" size="sm" onClick={fetchUserDetails} disabled={loading} className="text-neutral-400 hover:text-white">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          {/* User Header Card */}
          <div className="bg-gradient-to-r from-neutral-700/50 to-neutral-700/30 rounded-lg p-5 mb-4 border border-neutral-600/50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold text-lg">{user.email || "No Email"}</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-neutral-400 hover:text-white" onClick={() => copyToClipboard(user.email || "", "Email")}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <span>ID: {user.user_id}</span>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-neutral-400 hover:text-white" onClick={() => copyToClipboard(user.user_id, "User ID")}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`${getRoleBadgeColor(user.role)} border`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                    {getStatusBadge()}
                  </div>
                </div>
              </div>
              <div className="text-right text-sm">
                <p className="text-neutral-400">Member since</p>
                <p className="text-white font-medium">{formatDate(user.created_at)}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-neutral-700 border-neutral-600 w-full grid grid-cols-6 mb-4">
              <TabsTrigger value="overview" className="data-[state=active]:bg-neutral-600 text-white text-xs">Overview</TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-neutral-600 text-white text-xs">Projects</TabsTrigger>
              <TabsTrigger value="teams" className="data-[state=active]:bg-neutral-600 text-white text-xs">Teams</TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-neutral-600 text-white text-xs">Security</TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-neutral-600 text-white text-xs">Billing</TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-neutral-600 text-white text-xs">Activity</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-neutral-700/30 rounded-lg p-4 border border-neutral-600/30">
                  <div className="flex items-center gap-2 mb-2"><FolderOpen className="w-4 h-4 text-blue-400" /><span className="text-neutral-400 text-sm">Projects</span></div>
                  <p className="text-2xl font-bold text-white">{projects.length}</p>
                </div>
                <div className="bg-neutral-700/30 rounded-lg p-4 border border-neutral-600/30">
                  <div className="flex items-center gap-2 mb-2"><Building2 className="w-4 h-4 text-green-400" /><span className="text-neutral-400 text-sm">Teams</span></div>
                  <p className="text-2xl font-bold text-white">{teams.length}</p>
                </div>
                <div className="bg-neutral-700/30 rounded-lg p-4 border border-neutral-600/30">
                  <div className="flex items-center gap-2 mb-2"><Key className="w-4 h-4 text-yellow-400" /><span className="text-neutral-400 text-sm">API Keys</span></div>
                  <p className="text-2xl font-bold text-white">{apiKeys.filter(k => k.is_active).length}</p>
                </div>
                <div className="bg-neutral-700/30 rounded-lg p-4 border border-neutral-600/30">
                  <div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-purple-400" /><span className="text-neutral-400 text-sm">Activities</span></div>
                  <p className="text-2xl font-bold text-white">{activities.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-700/30 rounded-lg p-4 border border-neutral-600/30">
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2"><User className="w-4 h-4" />Account Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-neutral-400">Email Verified</span>
                      <span className="text-white flex items-center gap-1">{user.email_confirmed_at ? <><CheckCircle className="w-4 h-4 text-green-400" /> Verified</> : <><XCircle className="w-4 h-4 text-red-400" /> Not Verified</>}</span>
                    </div>
                    <div className="flex justify-between"><span className="text-neutral-400">Last Sign In</span><span className="text-white">{formatDate(user.last_sign_in_at)}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">Account Created</span><span className="text-white">{formatDate(user.created_at)}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">Suspension Status</span>
                      <span className="text-white">{user.banned_until && new Date(user.banned_until) > new Date() ? `Until ${formatDate(user.banned_until)}` : "Not Suspended"}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-700/30 rounded-lg p-4 border border-neutral-600/30">
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2"><Globe className="w-4 h-4" />Integrations</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 flex items-center gap-2"><GitBranch className="w-4 h-4" /> GitHub</span>
                      {githubConnection ? <span className="text-green-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> @{githubConnection.github_username}</span> : <span className="text-neutral-500">Not Connected</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-700/30 rounded-lg p-4 border border-neutral-600/30">
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2"><HardDrive className="w-4 h-4" />Storage Usage</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-neutral-400">Total Used</span><span className="text-white">{storageUsage ? formatBytes(storageUsage.bytes_used) : "0 Bytes"}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">Files Count</span><span className="text-white">{storageUsage?.file_count || 0} files</span></div>
                  </div>
                </div>
                <div className="bg-neutral-700/30 rounded-lg p-4 border border-neutral-600/30">
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2"><Cpu className="w-4 h-4" />AI Usage</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-neutral-400">Total Tokens</span><span className="text-white">{aiUsage?.total_tokens?.toLocaleString() || 0}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">Total Requests</span><span className="text-white">{aiUsage?.total_requests || 0}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">Total Cost</span><span className="text-white">${aiUsage?.total_cost?.toFixed(4) || "0.00"}</span></div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="mt-0">
              <div className="bg-neutral-700/30 rounded-lg p-4 border border-neutral-600/30">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2"><FolderOpen className="w-4 h-4" />User Projects ({projects.length})</h3>
                {loading ? <p className="text-neutral-400 text-sm">Loading...</p> : projects.length > 0 ? (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {projects.map((project) => (
                      <div key={project.id} className="bg-neutral-700/50 rounded p-3 border border-neutral-600/30">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-white font-medium">{project.name}</p>
                            {project.description && <p className="text-neutral-400 text-xs mt-1 line-clamp-1">{project.description}</p>}
                            <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                              <span>Created: {formatDate(project.created_at)}</span>
                              <span>Updated: {formatDate(project.updated_at)}</span>
                            </div>
                          </div>
                          {project.github_repo_url && <a href={project.github_repo_url} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white"><GitBranch className="w-4 h-4" /></a>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-neutral-400 text-sm">No projects found</p>}
              </div>
            </TabsContent>

            {/* Teams Tab */}
            <TabsContent value="teams" className="mt-0">
              <div className="bg-neutral-700/30 rounded-lg p-4 border border-neutral-600/30">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2"><Building2 className="w-4 h-4" />Team Memberships ({teams.length})</h3>
                {loading ? <p className="text-neutral-400 text-sm">Loading...</p> : teams.length > 0 ? (
                  <div className="space-y-2">
                    {teams.map((team) => (
                      <div key={team.id} className="bg-neutral-700/50 rounded p-3 border border-neutral-600/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{team.teams?.name || "Unknown Team"}</p>
                            {team.teams?.description && <p className="text-neutral-400 text-xs mt-1">{team.teams.description}</p>}
                            <p className="text-neutral-500 text-xs mt-1">Joined: {formatDate(team.joined_at)}</p>
                          </div>
                          <Badge className={`${getRoleBadgeColor(team.role)} border text-xs`}>{team.role}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-neutral-400 text-sm">Not a member of any teams</p>}
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-0 space-y-4">
              <div className="bg-neutral-700/30 rounded-lg p-4 border border-neutral-600/30">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2"><Key className="w-4 h-4" />API Keys ({apiKeys.length})</h3>
                {apiKeys.length > 0 ? (
                  <div className="space-y-2">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="bg-neutral-700/50 rounded p-3 border border-neutral-600/30 flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{key.key_name}</p>
                          <p className="text-neutral-400 text-xs font-mono">{key.key_prefix}...</p>
                          <p className="text-neutral-500 text-xs mt-1">Created: {formatDate(key.created_at)}{key.last_used_at && ` • Last used: ${formatDate(key.last_used_at)}`}</p>
                        </div>
                        <Badge className={key.is_active ? "bg-green-500/30 text-green-400" : "bg-red-500/30 text-red-400"}>{key.is_active ? "Active" : "Inactive"}</Badge>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-neutral-400 text-sm">No API keys created</p>}
              </div>

              <div className="bg-neutral-700/30 rounded-lg p-4 border border-neutral-600/30">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2"><Shield className="w-4 h-4" />Security Events</h3>
                {securityEvents.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {securityEvents.map((event) => (
                      <div key={event.id} className="bg-neutral-700/50 rounded p-3 border border-neutral-600/30">
                        <div className="flex items-start gap-3">
                          {getEventTypeIcon(event.event_type)}
                          <div className="flex-1">
                            <p className="text-white text-sm capitalize">{event.event_type.replace(/_/g, " ")}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                              <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" />{parseUserAgent(event.user_agent)}</span>
                              {event.ip_address && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{event.ip_address}</span>}
                            </div>
                            <p className="text-neutral-500 text-xs mt-1">{formatDate(event.created_at)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-neutral-400 text-sm">No security events recorded</p>}
              </div>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="mt-0 space-y-4">
              <div className="bg-neutral-700/30 rounded-lg p-4 border border-neutral-600/30">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4" />Subscription Details</h3>
                {subscription ? (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-neutral-400">Status</span>
                      <Badge className={subscription.status === "active" ? "bg-green-500/30 text-green-400" : subscription.status === "trialing" ? "bg-blue-500/30 text-blue-400" : "bg-neutral-500/30 text-neutral-400"}>{subscription.status}</Badge>
                    </div>
                    <div className="flex justify-between"><span className="text-neutral-400">Billing Cycle</span><span className="text-white capitalize">{subscription.billing_cycle}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">Current Period Start</span><span className="text-white">{formatDate(subscription.current_period_start)}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">Current Period End</span><span className="text-white">{formatDate(subscription.current_period_end)}</span></div>
                    {subscription.trial_start && (
                      <>
                        <div className="flex justify-between"><span className="text-neutral-400">Trial Start</span><span className="text-white">{formatDate(subscription.trial_start)}</span></div>
                        <div className="flex justify-between"><span className="text-neutral-400">Trial End</span><span className="text-white">{formatDate(subscription.trial_end)}</span></div>
                      </>
                    )}
                    <div className="flex justify-between"><span className="text-neutral-400">Cancel at Period End</span><span className="text-white">{subscription.cancel_at_period_end ? <span className="text-yellow-400">Yes</span> : "No"}</span></div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-neutral-400 text-sm">No active subscription</p>
                    <p className="text-neutral-500 text-xs mt-1">User is on free tier</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-0">
              <div className="bg-neutral-700/30 rounded-lg p-4 border border-neutral-600/30">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2"><Activity className="w-4 h-4" />Recent Activity</h3>
                {loading ? <p className="text-neutral-400 text-sm">Loading...</p> : activities.length > 0 ? (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {activities.map((activity) => (
                      <div key={activity.id} className="bg-neutral-700/50 rounded p-3 border border-neutral-600/30">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-white text-sm"><span className="font-medium">{activity.action}</span><span className="text-neutral-400"> on </span><span className="text-blue-400">{activity.entity_type}</span></p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                              <span>{formatDate(activity.created_at)}</span>
                              {activity.ip_address && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{activity.ip_address}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-neutral-400 text-sm">No recent activity</p>}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};