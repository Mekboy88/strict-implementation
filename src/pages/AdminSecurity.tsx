import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, Download, AlertTriangle, Save, Ban, Activity, Bell } from "lucide-react";
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

interface SecurityAudit {
  id: string;
  created_at: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  ip_address: string | null;
  changes: any;
}

interface SecurityEvent {
  id: string;
  created_at: string;
  user_id: string | null;
  event_type: string;
  ip_address: string | null;
  user_agent: string | null;
  metadata: any;
}

interface SecurityBlock {
  id: string;
  created_at: string;
  user_id: string | null;
  ip_address: string | null;
  block_type: string;
  reason: string;
  expires_at: string | null;
}

interface AdminAlert {
  id: string;
  created_at: string;
  alert_type: string;
  severity: string;
  message: string;
  is_resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
}

const AdminSecurity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Real data from database
  const [auditLogs, setAuditLogs] = useState<SecurityAudit[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [securityBlocks, setSecurityBlocks] = useState<SecurityBlock[]>([]);
  const [adminAlerts, setAdminAlerts] = useState<AdminAlert[]>([]);

  // Settings
  const [rateLimitPerMinute, setRateLimitPerMinute] = useState(100);
  const [rateLimitPerHour, setRateLimitPerHour] = useState(1000);
  const [dataRetentionDays, setDataRetentionDays] = useState(90);
  const [autoDeleteInactive, setAutoDeleteInactive] = useState(false);

  // Block form
  const [blockType, setBlockType] = useState<'ip' | 'user'>('ip');
  const [blockTarget, setBlockTarget] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [blockDuration, setBlockDuration] = useState<number | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/admin/login");
        return;
      }

      // Check admin role from database
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .in('role', ['owner', 'admin'])
        .single();

      if (!roleData) {
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await loadSecurityData();
      setLoading(false);
    };

    checkAccess();
  }, [navigate]);

  const loadSecurityData = async () => {
    // Load activity logs (using activity_logs table which has the actual data)
    const { data: activities } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    // Map activity_logs to security audit format
    if (activities) {
      const mappedAudits = activities.map(activity => ({
        id: activity.id,
        created_at: activity.created_at,
        user_id: activity.user_id || '',
        action: activity.action,
        resource_type: activity.entity_type,
        resource_id: activity.entity_id,
        ip_address: activity.ip_address,
        changes: activity.metadata
      }));
      setAuditLogs(mappedAudits);
    }

    // Load security events
    const { data: events } = await supabase
      .from('security_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (events) setSecurityEvents(events);

    // Load security blocks
    const { data: blocks } = await supabase
      .from('security_blocks')
      .select('*')
      .order('created_at', { ascending: false });
    if (blocks) setSecurityBlocks(blocks);

    // Load admin alerts
    const { data: alerts } = await supabase
      .from('admin_alerts')
      .select('*')
      .eq('is_resolved', false)
      .order('created_at', { ascending: false });
    if (alerts) setAdminAlerts(alerts);

    // Load platform settings
    const { data: settings } = await supabase
      .from('platform_settings')
      .select('*')
      .in('setting_key', ['rate_limit_per_minute', 'rate_limit_per_hour', 'data_retention_days', 'auto_delete_inactive']);
    
    if (settings) {
      settings.forEach(setting => {
        if (setting.setting_key === 'rate_limit_per_minute') setRateLimitPerMinute(setting.setting_value as number);
        if (setting.setting_key === 'rate_limit_per_hour') setRateLimitPerHour(setting.setting_value as number);
        if (setting.setting_key === 'data_retention_days') setDataRetentionDays(setting.setting_value as number);
        if (setting.setting_key === 'auto_delete_inactive') setAutoDeleteInactive(setting.setting_value as boolean);
      });
    }
  };

  const handleSaveSettings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const settings = [
      { setting_key: 'rate_limit_per_minute', setting_value: rateLimitPerMinute },
      { setting_key: 'rate_limit_per_hour', setting_value: rateLimitPerHour },
      { setting_key: 'data_retention_days', setting_value: dataRetentionDays },
      { setting_key: 'auto_delete_inactive', setting_value: autoDeleteInactive },
    ];

    for (const setting of settings) {
      await supabase
        .from('platform_settings')
        .upsert({
          setting_key: setting.setting_key,
          setting_value: setting.setting_value,
          updated_by: session.user.id,
        }, { onConflict: 'setting_key' });
    }

    toast({
      title: "Settings Saved",
      description: "Security settings have been updated successfully.",
    });
  };

  const handleAddBlock = async () => {
    if (!blockTarget || !blockReason) {
      toast({
        title: "Missing Information",
        description: "Please provide target and reason for the block.",
        variant: "destructive",
      });
      return;
    }

    const expiresAt = blockDuration ? new Date(Date.now() + blockDuration * 24 * 60 * 60 * 1000).toISOString() : null;

    const { error } = await supabase
      .from('security_blocks')
      .insert({
        block_type: blockType,
        [blockType === 'ip' ? 'ip_address' : 'user_id']: blockTarget,
        reason: blockReason,
        expires_at: expiresAt,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add security block.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Block Added",
      description: `${blockType === 'ip' ? 'IP address' : 'User'} has been blocked.`,
    });

    setBlockTarget('');
    setBlockReason('');
    setBlockDuration(null);
    await loadSecurityData();
  };

  const handleRemoveBlock = async (blockId: string) => {
    const { error } = await supabase
      .from('security_blocks')
      .delete()
      .eq('id', blockId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove block.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Block Removed",
      description: "Security block has been removed.",
    });

    await loadSecurityData();
  };

  const handleResolveAlert = async (alertId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('admin_alerts')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by: session.user.id,
      })
      .eq('id', alertId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to resolve alert.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Alert Resolved",
      description: "The alert has been marked as resolved.",
    });

    await loadSecurityData();
  };

  const handleExportLogs = () => {
    const csvContent = auditLogs.map(log => 
      `${log.created_at},${log.user_id},${log.action},${log.resource_type},${log.ip_address || ''}`
    ).join('\n');

    const blob = new Blob([`Timestamp,User ID,Action,Resource,IP\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-audit-${new Date().toISOString()}.csv`;
    a.click();

    toast({
      title: "Export Complete",
      description: "Security audit logs have been exported.",
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
    <div className="h-full bg-neutral-800 p-6 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">
          Security & Compliance
        </h1>
        <p className="text-sm mt-2 text-white">
          Manage security settings, audit logs, and compliance features
        </p>
      </div>

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="mb-6 bg-neutral-700 border-neutral-600">
          <TabsTrigger value="alerts" className="text-white data-[state=active]:bg-neutral-600">
            <Bell className="w-4 h-4 mr-2" />
            Alerts {adminAlerts.length > 0 && `(${adminAlerts.length})`}
          </TabsTrigger>
          <TabsTrigger value="audit" className="text-white data-[state=active]:bg-neutral-600">Audit Logs</TabsTrigger>
          <TabsTrigger value="events" className="text-white data-[state=active]:bg-neutral-600">Security Events</TabsTrigger>
          <TabsTrigger value="blocks" className="text-white data-[state=active]:bg-neutral-600">Security Blocks</TabsTrigger>
          <TabsTrigger value="settings" className="text-white data-[state=active]:bg-neutral-600">Settings</TabsTrigger>
        </TabsList>

        {/* Admin Alerts Tab */}
        <TabsContent value="alerts">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Active Security Alerts</h2>
                <p className="text-sm mt-1 text-white">Critical security issues requiring attention</p>
              </div>
            </div>

            {adminAlerts.length === 0 ? (
              <div className="rounded-lg border bg-neutral-700 border-neutral-600 p-8 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <p className="text-white font-semibold mb-2">No active security alerts</p>
                <p className="text-sm text-neutral-400">All systems secure. Alerts will appear here when critical security issues are detected.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {adminAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-lg border p-4 ${
                      alert.severity === 'critical' ? 'bg-red-500/10 border-red-500' :
                      alert.severity === 'high' ? 'bg-orange-500/10 border-orange-500' :
                      alert.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500' :
                      'bg-blue-500/10 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className={`w-5 h-5 ${
                            alert.severity === 'critical' ? 'text-red-400' :
                            alert.severity === 'high' ? 'text-orange-400' :
                            alert.severity === 'medium' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`} />
                          <span className="font-semibold text-white">{alert.alert_type}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-white mb-2">{alert.message}</p>
                        <p className="text-sm text-white">{new Date(alert.created_at).toLocaleString()}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolveAlert(alert.id)}
                        className="border-neutral-600 text-white hover:bg-neutral-600"
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Security Audit Log</h2>
                <p className="text-sm mt-1 text-white">Complete record of all administrative actions</p>
              </div>
              <Button variant="outline" onClick={handleExportLogs} className="border-neutral-600 text-white hover:bg-neutral-700">
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
            </div>

            {auditLogs.length === 0 ? (
              <div className="rounded-lg border bg-neutral-700 border-neutral-600 p-8 text-center">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-white font-semibold mb-2">No audit logs found</p>
                <p className="text-sm text-neutral-400">Administrative actions will be logged here for security tracking.</p>
              </div>
            ) : (
              <div className="rounded-lg border bg-neutral-700 border-neutral-600">
                <Table>
                  <TableHeader>
                    <TableRow className="border-neutral-600">
                      <TableHead className="text-white">Timestamp</TableHead>
                      <TableHead className="text-white">User ID</TableHead>
                      <TableHead className="text-white">Action</TableHead>
                      <TableHead className="text-white">Resource</TableHead>
                      <TableHead className="text-white">IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id} className="border-neutral-600">
                        <TableCell className="text-white">{new Date(log.created_at).toLocaleString()}</TableCell>
                        <TableCell className="text-white font-mono text-xs">{log.user_id.substring(0, 8)}...</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                            {log.action}
                          </span>
                        </TableCell>
                        <TableCell className="text-white">{log.resource_type}</TableCell>
                        <TableCell className="text-white">{log.ip_address || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Security Events Tab */}
        <TabsContent value="events">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Security Events</h2>
              <p className="text-sm mt-1 text-white">Login attempts, suspicious activity, and security incidents</p>
            </div>

            {securityEvents.length === 0 ? (
              <div className="rounded-lg border bg-neutral-700 border-neutral-600 p-8 text-center">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-white font-semibold mb-2">No security events recorded</p>
                <p className="text-sm text-neutral-400">Login attempts, failed authentications, and suspicious activities will appear here when they occur.</p>
              </div>
            ) : (
              <div className="rounded-lg border bg-neutral-700 border-neutral-600">
                <Table>
                  <TableHeader>
                    <TableRow className="border-neutral-600">
                      <TableHead className="text-white">Timestamp</TableHead>
                      <TableHead className="text-white">Event Type</TableHead>
                      <TableHead className="text-white">User ID</TableHead>
                      <TableHead className="text-white">IP Address</TableHead>
                      <TableHead className="text-white">User Agent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityEvents.map((event) => (
                      <TableRow key={event.id} className="border-neutral-600">
                        <TableCell className="text-white">{new Date(event.created_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            event.event_type.includes('failed') || event.event_type.includes('suspicious') 
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {event.event_type}
                          </span>
                        </TableCell>
                        <TableCell className="text-white font-mono text-xs">
                          {event.user_id ? event.user_id.substring(0, 8) + '...' : '-'}
                        </TableCell>
                        <TableCell className="text-white">{event.ip_address || '-'}</TableCell>
                        <TableCell className="text-white text-xs truncate max-w-[200px]">
                          {event.user_agent || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Security Blocks Tab */}
        <TabsContent value="blocks">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Security Blocks</h2>
              <p className="text-sm mt-1 text-white">Manage IP and user blocks</p>
            </div>

            {/* Add Block Form */}
            <div className="rounded-lg border p-6 space-y-4 bg-neutral-700 border-neutral-600">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Ban className="w-5 h-5" />
                Add New Block
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Block Type</Label>
                  <select
                    value={blockType}
                    onChange={(e) => setBlockType(e.target.value as 'ip' | 'user')}
                    className="w-full h-10 px-3 rounded-lg bg-neutral-800 border border-neutral-600 text-white"
                  >
                    <option value="ip">IP Address</option>
                    <option value="user">User ID</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">{blockType === 'ip' ? 'IP Address' : 'User ID'}</Label>
                  <Input
                    value={blockTarget}
                    onChange={(e) => setBlockTarget(e.target.value)}
                    placeholder={blockType === 'ip' ? '192.168.1.1' : 'User UUID'}
                    className="bg-neutral-800 border-neutral-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Reason</Label>
                <Textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Enter reason for blocking..."
                  className="bg-neutral-800 border-neutral-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Duration (days, leave empty for permanent)</Label>
                <Input
                  type="number"
                  value={blockDuration || ''}
                  onChange={(e) => setBlockDuration(e.target.value ? Number(e.target.value) : null)}
                  placeholder="Leave empty for permanent block"
                  className="bg-neutral-800 border-neutral-600 text-white"
                />
              </div>

              <Button onClick={handleAddBlock} className="bg-red-500 hover:bg-red-600 text-white">
                <Ban className="w-4 h-4 mr-2" />
                Add Block
              </Button>
            </div>

            {/* Active Blocks */}
            {securityBlocks.length === 0 ? (
              <div className="rounded-lg border bg-neutral-700 border-neutral-600 p-8 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <p className="text-white font-semibold mb-2">No active security blocks</p>
                <p className="text-sm text-neutral-400">IPs and users you block will appear here. Use the form above to add blocks.</p>
              </div>
            ) : (
              <div className="rounded-lg border bg-neutral-700 border-neutral-600">
                <Table>
                  <TableHeader>
                    <TableRow className="border-neutral-600">
                      <TableHead className="text-white">Type</TableHead>
                      <TableHead className="text-white">Target</TableHead>
                      <TableHead className="text-white">Reason</TableHead>
                      <TableHead className="text-white">Created</TableHead>
                      <TableHead className="text-white">Expires</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityBlocks.map((block) => (
                      <TableRow key={block.id} className="border-neutral-600">
                        <TableCell>
                          <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">
                            {block.block_type}
                          </span>
                        </TableCell>
                        <TableCell className="text-white font-mono text-xs">
                          {block.ip_address || (block.user_id ? block.user_id.substring(0, 8) + '...' : '-')}
                        </TableCell>
                        <TableCell className="text-white">{block.reason}</TableCell>
                        <TableCell className="text-white">{new Date(block.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-white">
                          {block.expires_at ? new Date(block.expires_at).toLocaleDateString() : 'Permanent'}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveBlock(block.id)}
                            className="border-neutral-600 text-white hover:bg-neutral-600"
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Security Settings</h2>
              <p className="text-sm mt-1 text-white">Configure rate limits and data retention policies</p>
            </div>

            <div className="rounded-lg border p-6 space-y-6 bg-neutral-700 border-neutral-600">
              {/* Rate Limiting */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Rate Limiting</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Requests per Minute</Label>
                    <Input
                      type="number"
                      value={rateLimitPerMinute}
                      onChange={(e) => setRateLimitPerMinute(Number(e.target.value))}
                      className="bg-neutral-800 border-neutral-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Requests per Hour</Label>
                    <Input
                      type="number"
                      value={rateLimitPerHour}
                      onChange={(e) => setRateLimitPerHour(Number(e.target.value))}
                      className="bg-neutral-800 border-neutral-600 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Data Retention */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Data Retention</h3>
                
                <div className="space-y-2">
                  <Label className="text-white">Retention Period (days)</Label>
                  <Input
                    type="number"
                    value={dataRetentionDays}
                    onChange={(e) => setDataRetentionDays(Number(e.target.value))}
                    className="bg-neutral-800 border-neutral-600 text-white"
                  />
                  <p className="text-sm text-neutral-400">
                    Security logs older than this will be automatically deleted
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Auto-delete Inactive Users</Label>
                    <p className="text-sm text-neutral-400">
                      Automatically delete users inactive for retention period
                    </p>
                  </div>
                  <Switch
                    checked={autoDeleteInactive}
                    onCheckedChange={setAutoDeleteInactive}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSettings} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default AdminSecurity;