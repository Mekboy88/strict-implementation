import { Database, Settings, Shield, HardDrive, ArrowLeft, LayoutDashboard, Users, Zap, Brain, Key, ScrollText, Table, Plus, FileDown, Loader2, Search, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table as TableComponent,
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
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TableData {
  name: string;
  records: number;
  icon: any;
}

const DatabaseManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("Database");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tables, setTables] = useState<TableData[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterColumn, setFilterColumn] = useState<string>("");
  const [filterOperator, setFilterOperator] = useState<string>("=");
  const [filterValue, setFilterValue] = useState<string>("");
  const [appliedFilters, setAppliedFilters] = useState<Array<{column: string, operator: string, value: string}>>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRowData, setNewRowData] = useState<Record<string, any>>({});

  const menuItems = [
    { title: "Overview", icon: LayoutDashboard },
    { title: "Database", icon: Database },
    { title: "Users", icon: Users },
    { title: "Storage", icon: HardDrive },
    { title: "Edge Functions", icon: Zap },
    { title: "AI", icon: Brain },
    { title: "Secrets", icon: Key },
    { title: "Logs", icon: ScrollText },
  ];

  // Table schemas with correct column definitions for all 45 tables
  const tableSchemas: Record<string, string[]> = {
    // Authentication Tables (5)
    auth_users: ['id', 'email', 'encrypted_password', 'email_confirmed_at', 'phone', 'phone_confirmed_at', 'last_sign_in_at', 'is_super_admin', 'raw_user_meta_data', 'created_at', 'updated_at'],
    auth_sessions: ['id', 'user_id', 'token', 'ip_address', 'user_agent', 'last_active_at', 'expires_at', 'created_at'],
    auth_providers: ['id', 'user_id', 'provider', 'provider_user_id', 'access_token', 'refresh_token', 'expires_at', 'created_at', 'updated_at'],
    auth_mfa: ['id', 'user_id', 'secret', 'is_enabled', 'recovery_codes', 'last_used_at', 'created_at'],
    auth_verification_codes: ['id', 'user_id', 'code', 'type', 'expires_at', 'used_at', 'created_at'],
    
    // User Profile System (4)
    user_profiles: ['id', 'username', 'full_name', 'avatar_url', 'bio', 'website', 'country', 'created_at', 'updated_at'],
    user_settings: ['id', 'user_id', 'theme', 'language', 'editor_font_size', 'preferences', 'created_at', 'updated_at'],
    user_connections: ['id', 'user_id', 'provider', 'provider_user_id', 'access_token', 'refresh_token', 'expires_at', 'connected_at', 'updated_at'],
    user_roles: ['id', 'user_id', 'role', 'created_at', 'updated_at'],
    
    // Project Management (6)
    projects: ['id', 'user_id', 'name', 'description', 'status', 'github_repo_url', 'github_repo_id', 'created_at', 'updated_at'],
    project_files: ['id', 'project_id', 'file_path', 'file_type', 'file_content', 'created_at', 'updated_at'],
    project_snapshots: ['id', 'project_id', 'snapshot_name', 'snapshot_data', 'created_at'],
    project_env_vars: ['id', 'project_id', 'key', 'value', 'is_secret', 'created_at', 'updated_at'],
    project_members: ['id', 'project_id', 'user_id', 'role', 'invited_by', 'joined_at'],
    project_deployments: ['id', 'project_id', 'status', 'deployment_url', 'build_log', 'deployed_at', 'created_at'],
    
    // Platform Settings (4)
    platform_settings: ['id', 'setting_key', 'setting_value', 'updated_by', 'updated_at'],
    platform_logs: ['id', 'level', 'message', 'metadata', 'user_id', 'created_at'],
    platform_errors: ['id', 'error_message', 'error_code', 'stack_trace', 'user_id', 'project_id', 'created_at'],
    platform_limits: ['id', 'limit_type', 'limit_value', 'description', 'updated_at'],
    
    // Storage System (4)
    storage_buckets: ['id', 'name', 'owner_id', 'public', 'file_size_limit', 'allowed_mime_types', 'created_at', 'updated_at'],
    storage_objects: ['id', 'bucket_id', 'name', 'owner_id', 'path', 'size', 'mime_type', 'metadata', 'created_at', 'updated_at'],
    storage_permissions: ['id', 'bucket_id', 'user_id', 'permission', 'created_at'],
    storage_usage: ['id', 'user_id', 'project_id', 'bytes_used', 'file_count', 'calculated_at'],
    
    // AI Configuration (3)
    ai_config: ['id', 'user_id', 'model_id', 'temperature', 'max_tokens', 'rate_limit', 'created_at', 'updated_at'],
    ai_usage: ['id', 'user_id', 'project_id', 'model_id', 'tokens_used', 'request_cost', 'created_at'],
    ai_logs: ['id', 'user_id', 'project_id', 'model_id', 'prompt', 'response', 'tokens_used', 'duration_ms', 'created_at'],
    
    // Edge Functions (3)
    edge_functions: ['id', 'user_id', 'project_id', 'function_name', 'function_path', 'is_active', 'created_at', 'updated_at'],
    edge_logs: ['id', 'function_id', 'request_body', 'response_body', 'status_code', 'duration_ms', 'created_at'],
    edge_errors: ['id', 'function_id', 'error_message', 'stack_trace', 'created_at'],
    
    // Billing & Payments (4)
    billing_accounts: ['id', 'user_id', 'stripe_customer_id', 'payment_method_id', 'billing_email', 'created_at', 'updated_at'],
    billing_invoices: ['id', 'billing_account_id', 'invoice_number', 'amount', 'status', 'invoice_url', 'due_date', 'paid_at', 'created_at'],
    billing_usage: ['id', 'user_id', 'usage_type', 'quantity', 'unit_cost', 'total_cost', 'billing_period_start', 'billing_period_end', 'created_at'],
    billing_plans: ['id', 'plan_name', 'price_monthly', 'price_yearly', 'features', 'limits', 'is_active', 'created_at'],
    
    // Notifications (3)
    notifications: ['id', 'user_id', 'type', 'title', 'message', 'action_url', 'is_read', 'created_at'],
    notification_preferences: ['id', 'user_id', 'email_enabled', 'push_enabled', 'project_updates', 'billing_alerts', 'security_alerts', 'updated_at'],
    admin_alerts: ['id', 'alert_type', 'severity', 'message', 'metadata', 'is_resolved', 'resolved_by', 'resolved_at', 'created_at'],
    
    // Security System (3)
    security_events: ['id', 'user_id', 'event_type', 'ip_address', 'user_agent', 'metadata', 'created_at'],
    security_blocks: ['id', 'user_id', 'ip_address', 'block_type', 'reason', 'expires_at', 'created_at'],
    security_audit: ['id', 'user_id', 'action', 'resource_type', 'resource_id', 'changes', 'ip_address', 'created_at'],
    
    // API Access (3)
    api_keys: ['id', 'user_id', 'key_name', 'key_prefix', 'key_hash', 'is_active', 'expires_at', 'last_used_at', 'created_at'],
    api_access: ['id', 'api_key_id', 'permission', 'resource_type', 'created_at'],
    api_requests: ['id', 'api_key_id', 'endpoint', 'method', 'status_code', 'duration_ms', 'ip_address', 'created_at'],
    
    // Integrations (3)
    integrations_supabase: ['id', 'user_id', 'project_id', 'supabase_url', 'supabase_anon_key', 'is_active', 'connected_at'],
    integrations_github: ['id', 'user_id', 'project_id', 'github_username', 'github_token', 'is_active', 'connected_at', 'updated_at'],
    integrations_stripe: ['id', 'user_id', 'stripe_publishable_key', 'stripe_secret_key', 'webhook_secret', 'is_active', 'connected_at'],
  };

  const tableIconMap: Record<string, any> = {
    auth_users: Users,
    auth_sessions: Shield,
    auth_providers: Database,
    auth_mfa: Shield,
    auth_verification_codes: Key,
    user_profiles: Users,
    user_settings: Settings,
    user_connections: Database,
    user_roles: Shield,
    projects: Database,
    project_files: Table,
    project_snapshots: Database,
    project_env_vars: Key,
    project_members: Users,
    project_deployments: Zap,
    platform_settings: Settings,
    platform_logs: ScrollText,
    platform_errors: Shield,
    platform_limits: Settings,
    storage_buckets: HardDrive,
    storage_objects: HardDrive,
    storage_permissions: Key,
    storage_usage: HardDrive,
    ai_config: Brain,
    ai_usage: Brain,
    ai_logs: ScrollText,
    edge_functions: Zap,
    edge_logs: ScrollText,
    edge_errors: Shield,
    billing_accounts: Database,
    billing_invoices: Table,
    billing_usage: Database,
    billing_plans: Settings,
    notifications: Database,
    notification_preferences: Settings,
    admin_alerts: Shield,
    security_events: Shield,
    security_blocks: Shield,
    security_audit: ScrollText,
    api_keys: Key,
    api_access: Key,
    api_requests: ScrollText,
    integrations_supabase: Database,
    integrations_github: Database,
    integrations_stripe: Database,
  };

  const getCurrentTableColumns = () => {
    if (!selectedTable) return [];
    return tableSchemas[selectedTable] || ['id', 'created_at', 'updated_at'];
  };

  // Check admin authentication
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access database management",
          variant: "destructive",
        });
        navigate("/admin/login");
        return;
      }

      // Check if user has admin role
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .in('role', ['owner', 'admin'])
        .maybeSingle();

      if (error || !roleData) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    };

    checkAdminStatus();
  }, [navigate, toast]);

  // Fetch row counts for all tables
  useEffect(() => {
    if (!isAdmin) return;

    const fetchTableCounts = async () => {
      setLoading(true);
      const tableList = Object.keys(tableSchemas);
      const countsPromises = tableList.map(async (tableName) => {
        try {
          const { count, error } = await supabase
            .from(tableName as any)
            .select('*', { count: 'exact', head: true });
          
          return {
            name: tableName,
            records: count || 0,
            icon: tableIconMap[tableName] || Database,
          };
        } catch (err) {
          return {
            name: tableName,
            records: 0,
            icon: tableIconMap[tableName] || Database,
          };
        }
      });

      const results = await Promise.all(countsPromises);
      setTables(results);
      setLoading(false);
    };

    fetchTableCounts();
  }, [isAdmin]);

  // Fetch table data when a table is selected
  useEffect(() => {
    if (!selectedTable || !isAdmin) return;

    const fetchTableData = async () => {
      setDataLoading(true);
      try {
        let query = supabase
          .from(selectedTable as any)
          .select('*');

        // Apply filters
        if (appliedFilters.length > 0) {
          appliedFilters.forEach(filter => {
            const { column, operator, value } = filter;
            
            switch (operator) {
              case '=':
                query = query.eq(column, value);
                break;
              case '!=':
                query = query.neq(column, value);
                break;
              case '>':
                query = query.gt(column, value);
                break;
              case '<':
                query = query.lt(column, value);
                break;
              case '>=':
                query = query.gte(column, value);
                break;
              case '<=':
                query = query.lte(column, value);
                break;
              case 'contains':
                query = query.ilike(column, `%${value}%`);
                break;
              case 'starts_with':
                query = query.ilike(column, `${value}%`);
                break;
              case 'ends_with':
                query = query.ilike(column, `%${value}`);
                break;
              case 'is_null':
                query = query.is(column, null);
                break;
              case 'is_not_null':
                query = query.not(column, 'is', null);
                break;
            }
          });
        }

        const { data, error } = await query.limit(50);

        if (error) throw error;
        setTableData(data || []);
      } catch (err: any) {
        toast({
          title: "Error Loading Data",
          description: err.message || "Failed to load table data",
          variant: "destructive",
        });
        setTableData([]);
      } finally {
        setDataLoading(false);
      }
    };

    fetchTableData();
  }, [selectedTable, isAdmin, toast, appliedFilters]);

  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return String(value);
  };

  const getColumnType = (tableName: string, columnName: string): string => {
    const colLower = columnName.toLowerCase();
    
    // UUID fields
    if (colLower.includes('_id') || colLower === 'id') return 'uuid';
    
    // Boolean fields
    if (colLower.startsWith('is_') || colLower.startsWith('has_') || colLower.includes('enabled')) return 'boolean';
    
    // JSON fields
    if (colLower.includes('metadata') || colLower.includes('settings') || colLower.includes('preferences') || 
        colLower.includes('features') || colLower.includes('limits') || colLower.includes('changes')) return 'json';
    
    // Timestamp fields
    if (colLower.includes('_at') || colLower.includes('date')) return 'datetime';
    
    // Numeric fields
    if (colLower.includes('count') || colLower.includes('size') || colLower.includes('limit') || 
        colLower.includes('tokens') || colLower.includes('duration') || colLower.includes('cost') ||
        colLower.includes('amount') || colLower.includes('price') || colLower.includes('quantity') ||
        colLower.includes('bytes')) return 'number';
    
    // Email fields
    if (colLower.includes('email')) return 'email';
    
    // URL fields
    if (colLower.includes('url')) return 'url';
    
    // Long text fields
    if (colLower.includes('description') || colLower.includes('bio') || colLower.includes('message') ||
        colLower.includes('content') || colLower.includes('prompt') || colLower.includes('response') ||
        colLower.includes('log') || colLower.includes('trace')) return 'textarea';
    
    return 'text';
  };

  const isColumnNullable = (tableName: string, columnName: string): boolean => {
    // Auto-generated fields are typically not user-fillable
    if (columnName === 'id' || columnName === 'created_at' || columnName === 'updated_at') return true;
    
    // Most foreign keys and status fields are required
    if (columnName.endsWith('_id') || columnName === 'status') return false;
    
    // Email and name fields in user tables are typically required
    if ((tableName.includes('user') || tableName.includes('auth')) && 
        (columnName === 'email' || columnName === 'username')) return false;
    
    // Default to nullable for flexibility
    return true;
  };

  const handleAddFilter = () => {
    if (!filterColumn || !filterValue) {
      toast({
        title: "Invalid Filter",
        description: "Please select a column and enter a value",
        variant: "destructive",
      });
      return;
    }

    setAppliedFilters([...appliedFilters, {
      column: filterColumn,
      operator: filterOperator,
      value: filterValue
    }]);

    // Reset filter inputs
    setFilterColumn("");
    setFilterOperator("=");
    setFilterValue("");
  };

  const handleRemoveFilter = (index: number) => {
    setAppliedFilters(appliedFilters.filter((_, i) => i !== index));
  };

  const handleOpenAddDialog = () => {
    if (!selectedTable) {
      toast({
        title: "No Table Selected",
        description: "Please select a table first",
        variant: "destructive",
      });
      return;
    }
    setNewRowData({});
    setShowAddDialog(true);
  };

  const handleAddRow = async () => {
    if (!selectedTable) return;

    try {
      // Process the data based on types
      const processedData: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(newRowData)) {
        if (value === '' || value === null || value === undefined) {
          if (isColumnNullable(selectedTable, key)) {
            processedData[key] = null;
          }
          continue;
        }
        
        const colType = getColumnType(selectedTable, key);
        
        if (colType === 'number') {
          processedData[key] = Number(value);
        } else if (colType === 'boolean') {
          processedData[key] = value === 'true' || value === true;
        } else if (colType === 'json') {
          try {
            processedData[key] = JSON.parse(value as string);
          } catch {
            processedData[key] = value;
          }
        } else {
          processedData[key] = value;
        }
      }

      const { error } = await supabase
        .from(selectedTable as any)
        .insert([processedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Row added successfully",
      });

      setShowAddDialog(false);
      setNewRowData({});
      
      // Refresh table data
      const { data, error: fetchError } = await supabase
        .from(selectedTable as any)
        .select('*')
        .limit(50);

      if (!fetchError && data) {
        setTableData(data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add row",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Left Sidebar */}
        <Sidebar className="border-r border-border">
          <SidebarContent className="p-4">
            {/* Go Back Button */}
            <button
              onClick={() => navigate("/editor")}
              className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-3 mt-8">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        className={`rounded-full h-12 px-4 hover:bg-primary/10 ${
                          activeSection === item.title ? 'bg-primary/20' : ''
                        }`}
                        onClick={() => setActiveSection(item.title)}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <item.icon className="w-4 h-4 text-primary" />
                        </div>
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Right Content Area */}
        <main className="flex-1 overflow-auto p-8 min-h-screen">
          <div className="max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-2">{activeSection}</h1>
              <p className="text-muted-foreground">
                {activeSection === "Database" && "Manage your database tables and schemas"}
                {activeSection === "Overview" && "Database statistics and health overview"}
                {activeSection === "Users" && "Manage database users and permissions"}
                {activeSection === "Storage" && "Manage file storage and media"}
                {activeSection === "Edge Functions" && "Serverless functions for backend logic"}
                {activeSection === "AI" && "AI model configuration and usage"}
                {activeSection === "Secrets" && "Manage API keys and environment variables"}
                {activeSection === "Logs" && "View system logs and audit trails"}
              </p>
            </div>

            {/* Database Section Content */}
            {activeSection === "Database" && (
              <div className="space-y-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : !selectedTable ? (
                  /* Tables Grid - Initial View */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {tables.map((table) => (
                      <Card 
                        key={table.name} 
                        className="bg-card border-border p-6 hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedTable(table.name)}
                      >
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <table.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-1">{table.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {table.records} {table.records === 1 ? 'row' : 'rows'}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  /* Table View */
                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span>‹</span>
                        <button 
                          onClick={() => setSelectedTable(null)}
                          className="hover:text-foreground"
                        >
                          Database
                        </button>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-semibold text-foreground">
                          Viewing table {selectedTable}
                        </h2>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Shield className="w-4 h-4" />
                          RLS Policies
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Viewing records in the {selectedTable} table.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setShowFilter(!showFilter)}
                          className={showFilter ? "bg-primary/10" : ""}
                        >
                          <span>Filter</span>
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2" onClick={handleOpenAddDialog}>
                          <Plus className="w-4 h-4" />
                          Add Row
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <FileDown className="w-4 h-4" />
                          Export CSV
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-2"
                          onClick={() => {
                            setAppliedFilters([]);
                            setFilterColumn("");
                            setFilterOperator("=");
                            setFilterValue("");
                          }}
                        >
                          <ArrowLeft className="w-4 h-4 rotate-90" />
                          Refresh
                        </Button>
                      </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilter && (
                      <Card className="bg-card border-border p-4">
                        <div className="space-y-3">
                          {/* Filter Builder */}
                          <div className="grid grid-cols-12 gap-2 items-end">
                            <div className="col-span-4">
                              <Select
                                value={filterColumn || undefined}
                                onValueChange={(value) => setFilterColumn(value)}
                              >
                                <SelectTrigger className="w-full h-9 px-3 rounded-md bg-background border border-border text-foreground text-sm focus:outline-none hover-scale">
                                  <SelectValue placeholder="Select column" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border border-border z-50 animate-scale-in">
                                  {getCurrentTableColumns().map((col) => (
                                    <SelectItem key={col} value={col} className="text-sm">
                                      {col}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-3">
                              <Select
                                value={filterOperator}
                                onValueChange={(value) => setFilterOperator(value)}
                              >
                                <SelectTrigger className="w-full h-9 px-3 rounded-md bg-background border border-border text-foreground text-sm focus:outline-none hover-scale">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-background border border-border z-50 animate-scale-in">
                                  <SelectItem value="=" className="text-sm">equals</SelectItem>
                                  <SelectItem value="!=" className="text-sm">not equals</SelectItem>
                                  <SelectItem value=">" className="text-sm">greater than</SelectItem>
                                  <SelectItem value="<" className="text-sm">less than</SelectItem>
                                  <SelectItem value=">=" className="text-sm">greater or equal</SelectItem>
                                  <SelectItem value="<=" className="text-sm">less or equal</SelectItem>
                                  <SelectItem value="contains" className="text-sm">contains</SelectItem>
                                  <SelectItem value="starts_with" className="text-sm">starts with</SelectItem>
                                  <SelectItem value="ends_with" className="text-sm">ends with</SelectItem>
                                  <SelectItem value="is_null" className="text-sm">is null</SelectItem>
                                  <SelectItem value="is_not_null" className="text-sm">is not null</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-3">
                              <Input
                                type="text"
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                                placeholder="Enter value..."
                                className="h-9 bg-background border-border focus:outline-none focus:ring-0 focus:border-border"
                                disabled={filterOperator === 'is_null' || filterOperator === 'is_not_null'}
                              />
                            </div>
                            <div className="col-span-2">
                              <Button 
                                size="sm" 
                                onClick={handleAddFilter}
                                className="w-full h-9 hover-scale"
                              >
                                Add Filter
                              </Button>
                            </div>
                          </div>

                          {/* Applied Filters */}
                          {appliedFilters.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                              {appliedFilters.map((filter, index) => (
                                <div 
                                  key={index}
                                  className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-md text-sm"
                                >
                                  <span className="font-medium text-foreground">{filter.column}</span>
                                  <span className="text-muted-foreground">{filter.operator}</span>
                                  <span className="text-foreground">"{filter.value}"</span>
                                  <button
                                    onClick={() => handleRemoveFilter(index)}
                                    className="ml-1 text-muted-foreground hover:text-foreground"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    )}

                    {/* Table */}
                    <Card className="bg-card border-border">
                      {dataLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                      ) : (
                        <TableComponent>
                          <TableHeader className="bg-muted/30">
                            <TableRow className="border-b border-border hover:bg-transparent">
                              <TableHead className="w-12 border-r border-border/40">
                                <input type="checkbox" className="rounded" />
                              </TableHead>
                              {getCurrentTableColumns().map((column, index) => (
                                <TableHead key={column} className={index < getCurrentTableColumns().length - 1 ? "border-r border-border/40" : ""}>
                                  <div className="flex items-center gap-1">
                                    {column}
                                    <ArrowLeft className="w-3 h-3 -rotate-90 text-muted-foreground" />
                                  </div>
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tableData.length === 0 ? (
                              <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={getCurrentTableColumns().length + 1} className="h-96 text-center">
                                  <div className="flex flex-col items-center justify-center">
                                    <p className="text-muted-foreground">No results</p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              tableData.map((row, rowIndex) => (
                                <TableRow key={rowIndex} className="border-b border-border hover:bg-muted/50 cursor-pointer">
                                  <TableCell className="border-r border-border/40">
                                    <input type="checkbox" className="rounded" />
                                  </TableCell>
                                  {getCurrentTableColumns().map((column, idx) => (
                                    <TableCell 
                                      key={column} 
                                      className={cn(
                                        idx === 0 ? "font-mono text-xs" : "text-sm", 
                                        idx < getCurrentTableColumns().length - 1 ? "border-r border-border/40" : ""
                                      )}
                                    >
                                      {formatCellValue(row[column])}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </TableComponent>
                      )}
                    </Card>

                    {/* Pagination Footer */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Rows per page</span>
                        <select className="border border-border bg-background rounded px-2 py-1">
                          <option>50</option>
                          <option>100</option>
                          <option>200</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-muted-foreground">
                          {tableData.length} records found
                        </span>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" disabled className="h-8">
                            <ArrowLeft className="w-4 h-4" />
                          </Button>
                          <span className="text-muted-foreground">Page 1</span>
                          <Button size="sm" variant="outline" disabled className="h-8">
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Placeholder for other sections */}
            {activeSection !== "Database" && (
              <Card className="bg-card border-border p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {menuItems.find(item => item.title === activeSection)?.icon && (
                      <div className="w-6 h-6 text-primary">
                        {(() => {
                          const Icon = menuItems.find(item => item.title === activeSection)?.icon;
                          return Icon ? <Icon className="w-6 h-6" /> : null;
                        })()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{activeSection} Management</h3>
                    <p className="text-sm text-muted-foreground">
                      This section is coming soon. Stay tuned for {activeSection.toLowerCase()} management features.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Add Row Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Row to {selectedTable}</DialogTitle>
            <DialogDescription>
              Fill in the fields below to add a new row. Leave fields empty for default values.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {selectedTable && getCurrentTableColumns()
              .filter(col => col !== 'id' && col !== 'created_at' && col !== 'updated_at')
              .map((column) => {
                const colType = getColumnType(selectedTable, column);
                const nullable = isColumnNullable(selectedTable, column);
                
                return (
                  <div key={column} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={column} className="text-right text-sm">
                      {column}
                      {!nullable && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    <div className="col-span-3">
                      {colType === 'boolean' ? (
                        <select
                          id={column}
                          value={newRowData[column] || ''}
                          onChange={(e) => setNewRowData(prev => ({
                            ...prev,
                            [column]: e.target.value
                          }))}
                          className="w-full h-10 px-3 rounded-md bg-background border border-border text-foreground"
                        >
                          <option value="">Select...</option>
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </select>
                      ) : colType === 'json' ? (
                        <textarea
                          id={column}
                          value={newRowData[column] || ''}
                          onChange={(e) => setNewRowData(prev => ({
                            ...prev,
                            [column]: e.target.value
                          }))}
                          className="w-full min-h-[80px] px-3 py-2 rounded-md bg-background border border-border text-foreground resize-y"
                          placeholder={`{"key": "value"}`}
                        />
                      ) : (
                        <Input
                          id={column}
                          type={colType === 'number' ? 'number' : colType === 'email' ? 'email' : colType === 'url' ? 'url' : colType === 'datetime' ? 'datetime-local' : 'text'}
                          value={newRowData[column] || ''}
                          onChange={(e) => setNewRowData(prev => ({
                            ...prev,
                            [column]: e.target.value
                          }))}
                          className="bg-background border-border"
                          placeholder={colType === 'uuid' ? 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' : `Enter ${column}`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRow}>
              Add Row
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default DatabaseManagement;
