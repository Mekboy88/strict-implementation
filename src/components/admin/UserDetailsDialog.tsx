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
import { supabase } from "@/integrations/supabase/client";
import { 
  User, Mail, Shield, Calendar, Clock, CreditCard, Building2, 
  FolderOpen, Activity, CheckCircle, XCircle, AlertTriangle
} from "lucide-react";

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
  created_at: string;
}

interface TeamData {
  id: string;
  team_id: string;
  role: string;
  teams: {
    name: string;
  };
}

interface ActivityData {
  id: string;
  action: string;
  entity_type: string;
  created_at: string;
}

interface SubscriptionData {
  id: string;
  status: string;
  billing_cycle: string;
  current_period_start: string;
  current_period_end: string | null;
  trial_start: string | null;
  trial_end: string | null;
}

export const UserDetailsDialog = ({ open, onOpenChange, user }: UserDetailsDialogProps) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
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
      // Fetch user's projects
      const { data: projectsData } = await supabase
        .from("projects")
        .select("id, name, created_at")
        .eq("user_id", user.user_id)
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch user's team memberships
      const { data: teamsData } = await supabase
        .from("team_members")
        .select("id, team_id, role, teams(name)")
        .eq("user_id", user.user_id);

      // Fetch user's recent activity
      const { data: activityData } = await supabase
        .from("activity_logs")
        .select("id, action, entity_type, created_at")
        .eq("user_id", user.user_id)
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch user's subscription
      const { data: subData } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.user_id)
        .maybeSingle();

      setProjects(projectsData || []);
      setTeams((teamsData as any) || []);
      setActivities(activityData || []);
      setSubscription(subData);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner": return "bg-blue-500/30 text-blue-400 border-blue-500/50";
      case "admin": return "bg-green-500/30 text-green-400 border-green-500/50";
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
    return <Badge className="bg-neutral-500/30 text-neutral-400 border-neutral-500/50">Inactive</Badge>;
  };

  const formatDate = (date: string | undefined | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-800 border-neutral-700 max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            User Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          {/* User Header */}
          <div className="bg-neutral-700/50 rounded-lg p-4 mb-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <span className="text-white font-medium">{user.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <span>ID: {user.user_id.slice(0, 8)}...</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={`${getRoleBadgeColor(user.role)} border`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                {getStatusBadge()}
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-neutral-700 border-neutral-600 w-full grid grid-cols-4">
              <TabsTrigger value="overview" className="data-[state=active]:bg-neutral-600 text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-neutral-600 text-white">
                Projects
              </TabsTrigger>
              <TabsTrigger value="teams" className="data-[state=active]:bg-neutral-600 text-white">
                Teams
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-neutral-600 text-white">
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-4 space-y-4">
              {/* Account Information */}
              <div className="bg-neutral-700/30 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Account Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-400">Email Verified</p>
                    <p className="text-white flex items-center gap-1">
                      {user.email_confirmed_at ? (
                        <><CheckCircle className="w-4 h-4 text-green-400" /> Yes</>
                      ) : (
                        <><XCircle className="w-4 h-4 text-red-400" /> No</>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-400">Account Status</p>
                    <p className="text-white">
                      {user.banned_until && new Date(user.banned_until) > new Date() 
                        ? "Suspended" 
                        : user.email_confirmed_at ? "Active" : "Pending"}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-400">Created</p>
                    <p className="text-white">{formatDate(user.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-neutral-400">Last Sign In</p>
                    <p className="text-white">{formatDate(user.last_sign_in_at)}</p>
                  </div>
                </div>
              </div>

              {/* Subscription Information */}
              <div className="bg-neutral-700/30 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Subscription
                </h3>
                {loading ? (
                  <p className="text-neutral-400 text-sm">Loading...</p>
                ) : subscription ? (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-neutral-400">Status</p>
                      <p className="text-white capitalize">{subscription.status}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400">Billing Cycle</p>
                      <p className="text-white capitalize">{subscription.billing_cycle}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400">Period Start</p>
                      <p className="text-white">{formatDate(subscription.current_period_start)}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400">Period End</p>
                      <p className="text-white">{formatDate(subscription.current_period_end)}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-neutral-400 text-sm">No active subscription</p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-neutral-700/30 rounded-lg p-4 text-center">
                  <FolderOpen className="w-5 h-5 mx-auto mb-2 text-blue-400" />
                  <p className="text-2xl font-bold text-white">{user.projectCount || 0}</p>
                  <p className="text-xs text-neutral-400">Projects</p>
                </div>
                <div className="bg-neutral-700/30 rounded-lg p-4 text-center">
                  <Building2 className="w-5 h-5 mx-auto mb-2 text-green-400" />
                  <p className="text-2xl font-bold text-white">{user.team_count || 0}</p>
                  <p className="text-xs text-neutral-400">Teams</p>
                </div>
                <div className="bg-neutral-700/30 rounded-lg p-4 text-center">
                  <Activity className="w-5 h-5 mx-auto mb-2 text-yellow-400" />
                  <p className="text-2xl font-bold text-white">{activities.length}</p>
                  <p className="text-xs text-neutral-400">Activities</p>
                </div>
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="mt-4">
              <div className="bg-neutral-700/30 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  User Projects ({projects.length})
                </h3>
                {loading ? (
                  <p className="text-neutral-400 text-sm">Loading...</p>
                ) : projects.length > 0 ? (
                  <div className="space-y-2">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between bg-neutral-700/50 rounded p-3">
                        <div>
                          <p className="text-white font-medium">{project.name}</p>
                          <p className="text-neutral-400 text-xs">
                            Created: {formatDate(project.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-400 text-sm">No projects found</p>
                )}
              </div>
            </TabsContent>

            {/* Teams Tab */}
            <TabsContent value="teams" className="mt-4">
              <div className="bg-neutral-700/30 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Team Memberships ({teams.length})
                </h3>
                {loading ? (
                  <p className="text-neutral-400 text-sm">Loading...</p>
                ) : teams.length > 0 ? (
                  <div className="space-y-2">
                    {teams.map((team) => (
                      <div key={team.id} className="flex items-center justify-between bg-neutral-700/50 rounded p-3">
                        <div>
                          <p className="text-white font-medium">{team.teams?.name || "Unknown Team"}</p>
                          <p className="text-neutral-400 text-xs capitalize">Role: {team.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-400 text-sm">Not a member of any teams</p>
                )}
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-4">
              <div className="bg-neutral-700/30 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Recent Activity
                </h3>
                {loading ? (
                  <p className="text-neutral-400 text-sm">Loading...</p>
                ) : activities.length > 0 ? (
                  <div className="space-y-2">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between bg-neutral-700/50 rounded p-3">
                        <div>
                          <p className="text-white text-sm">
                            <span className="font-medium">{activity.action}</span>
                            <span className="text-neutral-400"> on </span>
                            <span className="text-blue-400">{activity.entity_type}</span>
                          </p>
                          <p className="text-neutral-400 text-xs">
                            {formatDate(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-400 text-sm">No recent activity</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
