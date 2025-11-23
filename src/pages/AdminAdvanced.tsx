import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Zap, Flag, Key, Webhook, Puzzle, Copy, Trash2, Plus, RefreshCw, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  enabled: boolean;
  rollout_percentage: number;
  environment: 'production' | 'staging' | 'development';
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used: string;
  requests_count: number;
  rate_limit: number;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
  last_triggered: string;
}

interface Integration {
  id: string;
  name: string;
  service: string;
  status: 'connected' | 'disconnected' | 'error';
  api_key?: string;
  config: Record<string, any>;
  last_sync: string;
}

const AdminAdvanced = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Maintenance Mode State
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("We're currently performing scheduled maintenance. We'll be back shortly!");
  const [maintenanceEstimatedEnd, setMaintenanceEstimatedEnd] = useState("");

  // Feature Flags State
  const [isFeatureFlagDialogOpen, setIsFeatureFlagDialogOpen] = useState(false);
  const [featureFlagName, setFeatureFlagName] = useState("");
  const [featureFlagKey, setFeatureFlagKey] = useState("");
  const [featureFlagDescription, setFeatureFlagDescription] = useState("");
  const [featureFlagEnabled, setFeatureFlagEnabled] = useState(false);
  const [featureFlagRollout, setFeatureFlagRollout] = useState(100);

  const [featureFlags] = useState<FeatureFlag[]>([
    {
      id: "1",
      name: "AI Chat Beta",
      key: "ai_chat_beta",
      description: "Enable beta version of AI chat with enhanced features",
      enabled: true,
      rollout_percentage: 50,
      environment: "staging"
    },
    {
      id: "2",
      name: "Real-time Collaboration",
      key: "realtime_collab",
      description: "Live collaboration features for project editing",
      enabled: false,
      rollout_percentage: 0,
      environment: "development"
    },
    {
      id: "3",
      name: "Advanced Analytics",
      key: "advanced_analytics",
      description: "Enhanced analytics dashboard with detailed insights",
      enabled: true,
      rollout_percentage: 100,
      environment: "production"
    }
  ]);

  // API Keys State
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [apiKeyName, setApiKeyName] = useState("");
  const [apiKeyRateLimit, setApiKeyRateLimit] = useState(1000);

  const [apiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production API",
      key: "pk_live_abc123xyz789",
      created_at: "2025-11-01 10:30:00",
      last_used: "2025-11-22 07:45:12",
      requests_count: 45230,
      rate_limit: 10000
    },
    {
      id: "2",
      name: "Development API",
      key: "pk_test_def456uvw012",
      created_at: "2025-10-15 14:20:00",
      last_used: "2025-11-22 06:22:30",
      requests_count: 12450,
      rate_limit: 5000
    }
  ]);

  // Webhooks State
  const [isWebhookDialogOpen, setIsWebhookDialogOpen] = useState(false);
  const [webhookName, setWebhookName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvents, setWebhookEvents] = useState<string[]>([]);

  const [webhooks] = useState<Webhook[]>([
    {
      id: "1",
      name: "User Signup Webhook",
      url: "https://api.example.com/webhooks/user-signup",
      events: ["user.created", "user.verified"],
      secret: "whsec_abc123xyz789",
      enabled: true,
      last_triggered: "2025-11-22 08:15:30"
    },
    {
      id: "2",
      name: "Payment Webhook",
      url: "https://api.example.com/webhooks/payment",
      events: ["payment.succeeded", "payment.failed"],
      secret: "whsec_def456uvw012",
      enabled: true,
      last_triggered: "2025-11-22 07:42:15"
    }
  ]);

  // Integrations State
  const [integrations] = useState<Integration[]>([
    {
      id: "1",
      name: "Stripe",
      service: "payment",
      status: "connected",
      api_key: "sk_test_****xyz789",
      config: { webhook_enabled: true },
      last_sync: "2025-11-22 08:00:00"
    },
    {
      id: "2",
      name: "SendGrid",
      service: "email",
      status: "connected",
      api_key: "SG.****abc123",
      config: { domain_verified: true },
      last_sync: "2025-11-22 07:30:00"
    },
    {
      id: "3",
      name: "Slack",
      service: "notifications",
      status: "disconnected",
      config: {},
      last_sync: "2025-11-20 15:20:00"
    }
  ]);

  useEffect(() => {
    const checkAccess = async () => {
      const adminAuth = sessionStorage.getItem('admin_authenticated');
      if (adminAuth !== 'true') {
        navigate("/admin/login");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        sessionStorage.removeItem('admin_authenticated');
        navigate("/admin/login");
        return;
      }

      setLoading(false);
    };

    checkAccess();
  }, [navigate]);

  const handleToggleMaintenance = () => {
    setMaintenanceEnabled(!maintenanceEnabled);
    toast({
      title: maintenanceEnabled ? "Maintenance Mode Disabled" : "Maintenance Mode Enabled",
      description: maintenanceEnabled ? "Platform is now accessible to all users." : "Platform is now in maintenance mode.",
      variant: maintenanceEnabled ? "default" : "destructive"
    });
  };

  const handleCreateFeatureFlag = () => {
    toast({
      title: "Feature Flag Created",
      description: `"${featureFlagName}" has been created successfully.`,
    });
    setIsFeatureFlagDialogOpen(false);
    resetFeatureFlagForm();
  };

  const handleCreateApiKey = () => {
    toast({
      title: "API Key Generated",
      description: `API key for "${apiKeyName}" has been created. Make sure to save it securely.`,
    });
    setIsApiKeyDialogOpen(false);
    resetApiKeyForm();
  };

  const handleCreateWebhook = () => {
    toast({
      title: "Webhook Created",
      description: `Webhook "${webhookName}" has been configured successfully.`,
    });
    setIsWebhookDialogOpen(false);
    resetWebhookForm();
  };

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied",
      description: "API key copied to clipboard.",
    });
  };

  const handleTestWebhook = (name: string) => {
    toast({
      title: "Webhook Test Sent",
      description: `Test event sent to "${name}".`,
    });
  };

  const handleConnectIntegration = (name: string) => {
    toast({
      title: "Integration Connected",
      description: `Successfully connected to ${name}.`,
    });
  };

  const resetFeatureFlagForm = () => {
    setFeatureFlagName("");
    setFeatureFlagKey("");
    setFeatureFlagDescription("");
    setFeatureFlagEnabled(false);
    setFeatureFlagRollout(100);
  };

  const resetApiKeyForm = () => {
    setApiKeyName("");
    setApiKeyRateLimit(1000);
  };

  const resetWebhookForm = () => {
    setWebhookName("");
    setWebhookUrl("");
    setWebhookEvents([]);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'connected':
        return { bg: '#10B98130', text: '#10B981', border: '#10B98150' };
      case 'disconnected':
        return { bg: '#6B728030', text: '#9CA3AF', border: '#6B728050' };
      case 'error':
        return { bg: '#EF444430', text: '#EF4444', border: '#EF444450' };
      default:
        return { bg: '#6B728030', text: '#9CA3AF', border: '#6B728050' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #06080D, #0B111A)" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: "#4CB3FF" }}></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "#D6E4F0" }}>
          Advanced Features ⚡
        </h1>
        <p className="text-sm mt-2" style={{ color: "#8FA3B7" }}>
          Feature flags, maintenance mode, API management, and integrations
        </p>
      </div>
            <Tabs defaultValue="flags" className="w-full">
              <TabsList className="mb-6" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
                <TabsTrigger value="flags" style={{ color: "#D6E4F0" }}>Feature Flags</TabsTrigger>
                <TabsTrigger value="maintenance" style={{ color: "#D6E4F0" }}>Maintenance Mode</TabsTrigger>
                <TabsTrigger value="api" style={{ color: "#D6E4F0" }}>API Management</TabsTrigger>
                <TabsTrigger value="webhooks" style={{ color: "#D6E4F0" }}>Webhooks</TabsTrigger>
                <TabsTrigger value="integrations" style={{ color: "#D6E4F0" }}>Integrations</TabsTrigger>
              </TabsList>

              {/* Feature Flags Tab */}
              <TabsContent value="flags">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold" style={{ color: "#D6E4F0" }}>Feature Flags</h2>
                      <p className="text-sm mt-1" style={{ color: "#8FA3B7" }}>Control feature rollout and beta testing</p>
                    </div>
                    <Dialog open={isFeatureFlagDialogOpen} onOpenChange={setIsFeatureFlagDialogOpen}>
                      <DialogTrigger asChild>
                        <Button style={{ background: "#4CB3FF", color: "#ffffff" }}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Flag
                        </Button>
                      </DialogTrigger>
                      <DialogContent style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
                        <DialogHeader>
                          <DialogTitle style={{ color: "#D6E4F0" }}>Create Feature Flag</DialogTitle>
                          <DialogDescription style={{ color: "#8FA3B7" }}>
                            Add a new feature flag to control feature rollout
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label style={{ color: "#D6E4F0" }}>Flag Name</Label>
                            <Input
                              value={featureFlagName}
                              onChange={(e) => setFeatureFlagName(e.target.value)}
                              placeholder="Advanced Analytics"
                              style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label style={{ color: "#D6E4F0" }}>Flag Key</Label>
                            <Input
                              value={featureFlagKey}
                              onChange={(e) => setFeatureFlagKey(e.target.value)}
                              placeholder="advanced_analytics"
                              style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label style={{ color: "#D6E4F0" }}>Description</Label>
                            <Textarea
                              value={featureFlagDescription}
                              onChange={(e) => setFeatureFlagDescription(e.target.value)}
                              placeholder="Describe what this flag controls..."
                              rows={3}
                              style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label style={{ color: "#D6E4F0" }}>Enabled</Label>
                            <Switch
                              checked={featureFlagEnabled}
                              onCheckedChange={setFeatureFlagEnabled}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label style={{ color: "#D6E4F0" }}>Rollout Percentage: {featureFlagRollout}%</Label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={featureFlagRollout}
                              onChange={(e) => setFeatureFlagRollout(Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsFeatureFlagDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateFeatureFlag} style={{ background: "#4CB3FF", color: "#ffffff" }}>
                            Create Flag
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="rounded-lg border" style={{ borderColor: "#ffffff15", background: "#0B111A" }}>
                    <Table>
                      <TableHeader>
                        <TableRow style={{ borderColor: "#ffffff15" }}>
                          <TableHead style={{ color: "#8FA3B7" }}>Flag Name</TableHead>
                          <TableHead style={{ color: "#8FA3B7" }}>Key</TableHead>
                          <TableHead style={{ color: "#8FA3B7" }}>Environment</TableHead>
                          <TableHead style={{ color: "#8FA3B7" }}>Rollout</TableHead>
                          <TableHead style={{ color: "#8FA3B7" }}>Status</TableHead>
                          <TableHead style={{ color: "#8FA3B7" }}>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {featureFlags.map((flag) => (
                          <TableRow key={flag.id} style={{ borderColor: "#ffffff15" }}>
                            <TableCell>
                              <div>
                                <p className="font-medium" style={{ color: "#D6E4F0" }}>{flag.name}</p>
                                <p className="text-xs" style={{ color: "#8FA3B7" }}>{flag.description}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="px-2 py-1 rounded text-xs" style={{ background: "#0A0F17", color: "#4CB3FF" }}>
                                {flag.key}
                              </code>
                            </TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded text-xs" style={{ background: "#ffffff10", color: "#D6E4F0" }}>
                                {flag.environment}
                              </span>
                            </TableCell>
                            <TableCell style={{ color: "#D6E4F0" }}>{flag.rollout_percentage}%</TableCell>
                            <TableCell>
                              <Switch checked={flag.enabled} />
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" style={{ color: "#EF4444" }}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Maintenance Mode Tab */}
              <TabsContent value="maintenance">
                <div className="rounded-lg border p-6 space-y-6" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
                  <div className="flex items-start gap-4 p-4 rounded-lg" style={{ background: maintenanceEnabled ? "#EF444420" : "#4CB3FF20", borderColor: maintenanceEnabled ? "#EF4444" : "#4CB3FF", borderWidth: "1px" }}>
                    <AlertTriangle className="w-6 h-6 mt-0.5" style={{ color: maintenanceEnabled ? "#EF4444" : "#4CB3FF" }} />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1" style={{ color: "#D6E4F0" }}>
                        {maintenanceEnabled ? "Maintenance Mode Active" : "Maintenance Mode Inactive"}
                      </h3>
                      <p className="text-sm" style={{ color: "#8FA3B7" }}>
                        {maintenanceEnabled
                          ? "The platform is currently in maintenance mode. Users cannot access the site."
                          : "The platform is fully operational and accessible to all users."}
                      </p>
                    </div>
                    <Switch
                      checked={maintenanceEnabled}
                      onCheckedChange={handleToggleMaintenance}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label style={{ color: "#D6E4F0" }}>Maintenance Message</Label>
                      <Textarea
                        value={maintenanceMessage}
                        onChange={(e) => setMaintenanceMessage(e.target.value)}
                        rows={4}
                        placeholder="Enter the message users will see during maintenance..."
                        style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label style={{ color: "#D6E4F0" }}>Estimated End Time</Label>
                      <Input
                        type="datetime-local"
                        value={maintenanceEstimatedEnd}
                        onChange={(e) => setMaintenanceEstimatedEnd(e.target.value)}
                        style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                      />
                    </div>

                    <Button style={{ background: "#4CB3FF", color: "#ffffff" }}>
                      Save Maintenance Settings
                    </Button>
                  </div>

                  <div className="pt-6 border-t" style={{ borderColor: "#ffffff15" }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: "#D6E4F0" }}>Preview</h3>
                    <div className="rounded-lg border p-8 text-center" style={{ background: "#0A0F17", borderColor: "#ffffff15" }}>
                      <AlertTriangle className="w-16 h-16 mx-auto mb-4" style={{ color: "#F59E0B" }} />
                      <h2 className="text-2xl font-bold mb-2" style={{ color: "#D6E4F0" }}>Maintenance Mode</h2>
                      <p className="mb-4" style={{ color: "#8FA3B7" }}>{maintenanceMessage}</p>
                      {maintenanceEstimatedEnd && (
                        <p className="text-sm" style={{ color: "#8FA3B7" }}>
                          Expected to be back: {new Date(maintenanceEstimatedEnd).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* API Management Tab */}
              <TabsContent value="api">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold" style={{ color: "#D6E4F0" }}>API Keys</h2>
                      <p className="text-sm mt-1" style={{ color: "#8FA3B7" }}>Manage API keys and rate limits</p>
                    </div>
                    <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
                      <DialogTrigger asChild>
                        <Button style={{ background: "#4CB3FF", color: "#ffffff" }}>
                          <Plus className="w-4 h-4 mr-2" />
                          Generate API Key
                        </Button>
                      </DialogTrigger>
                      <DialogContent style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
                        <DialogHeader>
                          <DialogTitle style={{ color: "#D6E4F0" }}>Generate API Key</DialogTitle>
                          <DialogDescription style={{ color: "#8FA3B7" }}>
                            Create a new API key for external integrations
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label style={{ color: "#D6E4F0" }}>Key Name</Label>
                            <Input
                              value={apiKeyName}
                              onChange={(e) => setApiKeyName(e.target.value)}
                              placeholder="Production API"
                              style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label style={{ color: "#D6E4F0" }}>Rate Limit (requests/hour)</Label>
                            <Input
                              type="number"
                              value={apiKeyRateLimit}
                              onChange={(e) => setApiKeyRateLimit(Number(e.target.value))}
                              style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsApiKeyDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateApiKey} style={{ background: "#4CB3FF", color: "#ffffff" }}>
                            Generate Key
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="rounded-lg border" style={{ borderColor: "#ffffff15", background: "#0B111A" }}>
                    <Table>
                      <TableHeader>
                        <TableRow style={{ borderColor: "#ffffff15" }}>
                          <TableHead style={{ color: "#8FA3B7" }}>Name</TableHead>
                          <TableHead style={{ color: "#8FA3B7" }}>API Key</TableHead>
                          <TableHead style={{ color: "#8FA3B7" }}>Usage</TableHead>
                          <TableHead style={{ color: "#8FA3B7" }}>Rate Limit</TableHead>
                          <TableHead style={{ color: "#8FA3B7" }}>Last Used</TableHead>
                          <TableHead style={{ color: "#8FA3B7" }}>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {apiKeys.map((key) => (
                          <TableRow key={key.id} style={{ borderColor: "#ffffff15" }}>
                            <TableCell style={{ color: "#D6E4F0" }}>{key.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <code className="px-2 py-1 rounded text-xs" style={{ background: "#0A0F17", color: "#4CB3FF" }}>
                                  {key.key}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyApiKey(key.key)}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell style={{ color: "#D6E4F0" }}>{key.requests_count.toLocaleString()}</TableCell>
                            <TableCell style={{ color: "#D6E4F0" }}>{key.rate_limit.toLocaleString()}/hr</TableCell>
                            <TableCell style={{ color: "#8FA3B7", fontSize: "0.75rem" }}>{key.last_used}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" style={{ color: "#EF4444" }}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Webhooks Tab */}
              <TabsContent value="webhooks">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold" style={{ color: "#D6E4F0" }}>Webhooks</h2>
                      <p className="text-sm mt-1" style={{ color: "#8FA3B7" }}>Configure webhooks for platform events</p>
                    </div>
                    <Dialog open={isWebhookDialogOpen} onOpenChange={setIsWebhookDialogOpen}>
                      <DialogTrigger asChild>
                        <Button style={{ background: "#4CB3FF", color: "#ffffff" }}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Webhook
                        </Button>
                      </DialogTrigger>
                      <DialogContent style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
                        <DialogHeader>
                          <DialogTitle style={{ color: "#D6E4F0" }}>Create Webhook</DialogTitle>
                          <DialogDescription style={{ color: "#8FA3B7" }}>
                            Configure a new webhook endpoint
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label style={{ color: "#D6E4F0" }}>Webhook Name</Label>
                            <Input
                              value={webhookName}
                              onChange={(e) => setWebhookName(e.target.value)}
                              placeholder="User Signup Webhook"
                              style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label style={{ color: "#D6E4F0" }}>Endpoint URL</Label>
                            <Input
                              value={webhookUrl}
                              onChange={(e) => setWebhookUrl(e.target.value)}
                              placeholder="https://api.example.com/webhooks/events"
                              style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label style={{ color: "#D6E4F0" }}>Events</Label>
                            <Select>
                              <SelectTrigger style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}>
                                <SelectValue placeholder="Select events to trigger..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user.created">User Created</SelectItem>
                                <SelectItem value="user.verified">User Verified</SelectItem>
                                <SelectItem value="project.created">Project Created</SelectItem>
                                <SelectItem value="payment.succeeded">Payment Succeeded</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsWebhookDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateWebhook} style={{ background: "#4CB3FF", color: "#ffffff" }}>
                            Create Webhook
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="rounded-lg border" style={{ borderColor: "#ffffff15", background: "#0B111A" }}>
                    <Table>
                      <TableHeader>
                        <TableRow style={{ borderColor: "#ffffff15" }}>
                          <TableHead style={{ color: "#8FA3B7" }}>Name</TableHead>
                          <TableHead style={{ color: "#8FA3B7" }}>URL</TableHead>
                          <TableHead style={{ color: "#8FA3B7" }}>Events</TableHead>
                          <TableHead style={{ color: "#8FA3B7" }}>Last Triggered</TableHead>
                          <TableHead style={{ color: "#8FA3B7" }}>Status</TableHead>
                          <TableHead style={{ color: "#8FA3B7" }}>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {webhooks.map((webhook) => (
                          <TableRow key={webhook.id} style={{ borderColor: "#ffffff15" }}>
                            <TableCell style={{ color: "#D6E4F0" }}>{webhook.name}</TableCell>
                            <TableCell>
                              <code className="text-xs" style={{ color: "#4CB3FF" }}>{webhook.url}</code>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {webhook.events.map((event, idx) => (
                                  <span key={idx} className="px-2 py-0.5 rounded text-xs" style={{ background: "#ffffff10", color: "#D6E4F0" }}>
                                    {event}
                                  </span>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell style={{ color: "#8FA3B7", fontSize: "0.75rem" }}>{webhook.last_triggered}</TableCell>
                            <TableCell>
                              <Switch checked={webhook.enabled} />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleTestWebhook(webhook.name)}
                                  style={{ color: "#4CB3FF" }}
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" style={{ color: "#EF4444" }}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Integrations Tab */}
              <TabsContent value="integrations">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold" style={{ color: "#D6E4F0" }}>Third-Party Integrations</h2>
                    <p className="text-sm mt-1" style={{ color: "#8FA3B7" }}>Manage connections to external services</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {integrations.map((integration) => {
                      const statusColor = getStatusBadgeColor(integration.status);
                      return (
                        <div
                          key={integration.id}
                          className="rounded-lg border p-6"
                          style={{ background: "#0B111A", borderColor: "#ffffff15" }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#4CB3FF20" }}>
                                <Puzzle className="w-5 h-5" style={{ color: "#4CB3FF" }} />
                              </div>
                              <div>
                                <h3 className="font-semibold" style={{ color: "#D6E4F0" }}>{integration.name}</h3>
                                <p className="text-xs" style={{ color: "#8FA3B7" }}>{integration.service}</p>
                              </div>
                            </div>
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                background: statusColor.bg,
                                color: statusColor.text,
                                border: `1px solid ${statusColor.border}`
                              }}
                            >
                              {integration.status}
                            </span>
                          </div>

                          {integration.api_key && (
                            <div className="mb-4">
                              <p className="text-xs mb-1" style={{ color: "#8FA3B7" }}>API Key</p>
                              <code className="text-xs px-2 py-1 rounded block" style={{ background: "#0A0F17", color: "#4CB3FF" }}>
                                {integration.api_key}
                              </code>
                            </div>
                          )}

                          <div className="mb-4">
                            <p className="text-xs mb-1" style={{ color: "#8FA3B7" }}>Last Sync</p>
                            <p className="text-sm" style={{ color: "#D6E4F0" }}>{integration.last_sync}</p>
                          </div>

                          {integration.status === 'connected' ? (
                            <div className="flex gap-2">
                              <Button variant="outline" className="flex-1" style={{ borderColor: "#ffffff25" }}>
                                Configure
                              </Button>
                              <Button variant="outline" style={{ borderColor: "#EF4444", color: "#EF4444" }}>
                                Disconnect
                              </Button>
                            </div>
                          ) : (
                            <Button
                              className="w-full"
                              onClick={() => handleConnectIntegration(integration.name)}
                              style={{ background: "#4CB3FF", color: "#ffffff" }}
                            >
                              Connect
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAdvanced;
