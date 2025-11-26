import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, Download, AlertTriangle, RefreshCw, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  ip: string;
}

const AdminSecurity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Security Settings
  const [ipWhitelist, setIpWhitelist] = useState("");
  const [ipBlacklist, setIpBlacklist] = useState("");
  const [rateLimitPerMinute, setRateLimitPerMinute] = useState(100);
  const [rateLimitPerHour, setRateLimitPerHour] = useState(1000);
  const [corsOrigins, setCorsOrigins] = useState("*");
  const [enableApiKeyAuth, setEnableApiKeyAuth] = useState(true);

  // Data Privacy
  const [enableGDPR, setEnableGDPR] = useState(true);
  const [dataRetentionDays, setDataRetentionDays] = useState(90);
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState("https://youaredev.dev/privacy");
  const [enableCookieConsent, setEnableCookieConsent] = useState(true);
  const [autoDeleteInactive, setAutoDeleteInactive] = useState(false);

  // Backup Management
  const [backupSchedule, setBackupSchedule] = useState("daily");
  const [backupRetention, setBackupRetention] = useState(30);
  const [lastBackup, setLastBackup] = useState("2025-11-22 06:30:00");

  // Audit Logs (Mock Data)
  const [auditLogs] = useState<AuditLog[]>([
    {
      id: "1",
      timestamp: "2025-11-22 07:15:23",
      user: "admin@youaredev.dev",
      action: "User Role Changed",
      details: "Changed user role from 'user' to 'admin'",
      ip: "151.228.33.198"
    },
    {
      id: "2",
      timestamp: "2025-11-22 06:45:12",
      user: "admin@youaredev.dev",
      action: "Login Success",
      details: "Admin login successful",
      ip: "151.228.33.198"
    },
    {
      id: "3",
      timestamp: "2025-11-22 06:30:05",
      user: "system",
      action: "Database Backup",
      details: "Automated database backup completed",
      ip: "127.0.0.1"
    },
    {
      id: "4",
      timestamp: "2025-11-22 05:22:41",
      user: "user@example.com",
      action: "Login Failed",
      details: "Failed login attempt - invalid password",
      ip: "192.168.1.100"
    },
    {
      id: "5",
      timestamp: "2025-11-22 04:15:30",
      user: "admin@youaredev.dev",
      action: "Settings Changed",
      details: "Updated platform configuration",
      ip: "151.228.33.198"
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

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "All platform data is being exported. You will receive a download link shortly.",
    });
  };

  const handleBackupNow = () => {
    toast({
      title: "Backup Initiated",
      description: "Manual database backup has been started.",
    });
  };

  const handleRestoreBackup = () => {
    toast({
      title: "Restore Warning",
      description: "This will restore the database from the selected backup. This action cannot be undone.",
      variant: "destructive",
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Security Settings Saved",
      description: "All security and compliance settings have been updated.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-800 p-6 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">
          Security & Compliance
        </h1>
        <p className="text-sm mt-2 text-white">
          Manage security settings, audit logs, and compliance features
        </p>
      </div>

      <Tabs defaultValue="audit" className="w-full">
        <TabsList className="mb-6 bg-neutral-700 border-neutral-600">
          <TabsTrigger value="audit" className="text-white data-[state=active]:bg-neutral-600">Audit Logs</TabsTrigger>
          <TabsTrigger value="settings" className="text-white data-[state=active]:bg-neutral-600">Security Settings</TabsTrigger>
          <TabsTrigger value="privacy" className="text-white data-[state=active]:bg-neutral-600">Data Privacy</TabsTrigger>
          <TabsTrigger value="backup" className="text-white data-[state=active]:bg-neutral-600">Backup Management</TabsTrigger>
        </TabsList>

        {/* Audit Logs Tab */}
        <TabsContent value="audit">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Complete Activity Log</h2>
                <p className="text-sm mt-1 text-white">View all administrative and user actions</p>
              </div>
              <Button variant="outline" onClick={handleExportData} className="border-neutral-600 text-white hover:bg-neutral-700">
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
            </div>

            <div className="rounded-lg border bg-neutral-700 border-neutral-600">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-600">
                    <TableHead className="text-white">Timestamp</TableHead>
                    <TableHead className="text-white">User</TableHead>
                    <TableHead className="text-white">Action</TableHead>
                    <TableHead className="text-white">Details</TableHead>
                    <TableHead className="text-white">IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id} className="border-neutral-600">
                      <TableCell className="text-white">{log.timestamp}</TableCell>
                      <TableCell className="text-white">{log.user}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          log.action.includes('Failed') ? 'bg-red-500/20 text-red-400' :
                          log.action.includes('Success') ? 'bg-green-500/20 text-green-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell className="text-white">{log.details}</TableCell>
                      <TableCell className="text-white">{log.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="settings">
          <div className="rounded-lg border p-6 space-y-6 bg-neutral-700 border-neutral-600">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-500/20 border border-blue-500">
              <Shield className="w-6 h-6 mt-0.5 text-blue-400" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-white">
                  Security Configuration
                </h3>
                <p className="text-sm text-white">
                  Configure IP restrictions, rate limiting, CORS, and API authentication
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">IP Whitelist</Label>
                <Textarea
                  value={ipWhitelist}
                  onChange={(e) => setIpWhitelist(e.target.value)}
                  rows={3}
                  placeholder="Enter IP addresses (one per line)..."
                  className="bg-neutral-800 border-neutral-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">IP Blacklist</Label>
                <Textarea
                  value={ipBlacklist}
                  onChange={(e) => setIpBlacklist(e.target.value)}
                  rows={3}
                  placeholder="Enter blocked IP addresses (one per line)..."
                  className="bg-neutral-800 border-neutral-600 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Rate Limit (Per Minute)</Label>
                  <Input
                    type="number"
                    value={rateLimitPerMinute}
                    onChange={(e) => setRateLimitPerMinute(Number(e.target.value))}
                    className="bg-neutral-800 border-neutral-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Rate Limit (Per Hour)</Label>
                  <Input
                    type="number"
                    value={rateLimitPerHour}
                    onChange={(e) => setRateLimitPerHour(Number(e.target.value))}
                    className="bg-neutral-800 border-neutral-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">CORS Allowed Origins</Label>
                <Input
                  value={corsOrigins}
                  onChange={(e) => setCorsOrigins(e.target.value)}
                  placeholder="*"
                  className="bg-neutral-800 border-neutral-600 text-white"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-800">
                <div>
                  <Label className="text-white">Enable API Key Authentication</Label>
                  <p className="text-sm text-white">Require API keys for external requests</p>
                </div>
                <Switch
                  checked={enableApiKeyAuth}
                  onCheckedChange={setEnableApiKeyAuth}
                />
              </div>

              <Button onClick={handleSaveSettings} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Data Privacy Tab */}
        <TabsContent value="privacy">
          <div className="rounded-lg border p-6 space-y-6 bg-neutral-700 border-neutral-600">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-500/20 border border-blue-500">
              <AlertTriangle className="w-6 h-6 mt-0.5 text-blue-400" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-white">
                  GDPR & Privacy Compliance
                </h3>
                <p className="text-sm text-white">
                  Configure data protection and privacy settings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-800">
                <div>
                  <Label className="text-white">Enable GDPR Compliance</Label>
                  <p className="text-sm text-white">Enforce GDPR data protection rules</p>
                </div>
                <Switch
                  checked={enableGDPR}
                  onCheckedChange={setEnableGDPR}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Data Retention (Days)</Label>
                <Input
                  type="number"
                  value={dataRetentionDays}
                  onChange={(e) => setDataRetentionDays(Number(e.target.value))}
                  className="bg-neutral-800 border-neutral-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Privacy Policy URL</Label>
                <Input
                  value={privacyPolicyUrl}
                  onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
                  placeholder="https://youaredev.dev/privacy"
                  className="bg-neutral-800 border-neutral-600 text-white"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-800">
                <div>
                  <Label className="text-white">Enable Cookie Consent Banner</Label>
                  <p className="text-sm text-white">Show cookie consent popup to users</p>
                </div>
                <Switch
                  checked={enableCookieConsent}
                  onCheckedChange={setEnableCookieConsent}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-800">
                <div>
                  <Label className="text-white">Auto-Delete Inactive Accounts</Label>
                  <p className="text-sm text-white">Remove accounts inactive for 1+ year</p>
                </div>
                <Switch
                  checked={autoDeleteInactive}
                  onCheckedChange={setAutoDeleteInactive}
                />
              </div>

              <Button onClick={handleExportData} variant="outline" className="border-neutral-600 text-white hover:bg-neutral-600">
                <Download className="w-4 h-4 mr-2" />
                Export User Data (GDPR Request)
              </Button>

              <Button onClick={handleSaveSettings} className="bg-blue-500 hover:bg-blue-600 text-white">
                Save Privacy Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Backup Management Tab */}
        <TabsContent value="backup">
          <div className="rounded-lg border p-6 space-y-6 bg-neutral-700 border-neutral-600">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-500/20 border border-blue-500">
              <RefreshCw className="w-6 h-6 mt-0.5 text-blue-400" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-white">
                  Database Backup & Restore
                </h3>
                <p className="text-sm text-white">
                  Configure automated backups and restoration
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-neutral-800">
                <Label className="text-white">Last Backup</Label>
                <p className="text-2xl font-semibold mt-2 text-blue-400">{lastBackup}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Backup Schedule</Label>
                <select
                  value={backupSchedule}
                  onChange={(e) => setBackupSchedule(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-800 border border-neutral-600 text-white"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Backup Retention (Days)</Label>
                <Input
                  type="number"
                  value={backupRetention}
                  onChange={(e) => setBackupRetention(Number(e.target.value))}
                  className="bg-neutral-800 border-neutral-600 text-white"
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={handleBackupNow} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Backup Now
                </Button>
                <Button onClick={handleRestoreBackup} variant="outline" className="border-neutral-600 text-white hover:bg-neutral-600">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Restore from Backup
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSecurity;