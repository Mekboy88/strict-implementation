import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  FolderOpen, Search, MoreVertical, Eye, Trash2, UserPlus, Download, 
  TrendingUp, HardDrive, Clock, RefreshCw, ArrowUpDown, ChevronLeft, 
  ChevronRight, Archive, ArchiveRestore, GitBranch, Globe, FileCode
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ProjectDetailsDialog } from "@/components/admin/ProjectDetailsDialog";
import { TransferOwnershipDialog } from "@/components/admin/TransferOwnershipDialog";
import { ProjectBulkActionsDialog } from "@/components/admin/ProjectBulkActionsDialog";
import { ExportProjectDialog } from "@/components/admin/ExportProjectDialog";
import { DeleteProjectDialog } from "@/components/admin/DeleteProjectDialog";

interface ProjectData {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  ownerEmail?: string;
  fileCount?: number;
  storageSize?: number;
  github_repo_url?: string;
  variant_type?: string;
  isArchived?: boolean;
  deploymentUrl?: string;
  deploymentStatus?: string;
}

type SortField = "name" | "ownerEmail" | "fileCount" | "storageSize" | "created_at" | "updated_at";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "active" | "inactive" | "archived";

const AdminProjects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("updated_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Selection states
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<"delete" | "archive" | "export" | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalStorage: 0,
    recentlyModified: 0,
    withGithub: 0,
    deployed: 0,
  });

  const [uniqueOwners, setUniqueOwners] = useState<string[]>([]);

  const fetchProjects = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        sessionStorage.removeItem('admin_authenticated');
        navigate("/admin/login");
        return;
      }

      const { data: projectsData, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        });
        setLoading(false);
        setIsRefreshing(false);
        return;
      }

      // Fetch files info
      const { data: files } = await supabase
        .from('project_files')
        .select('project_id, file_content');

      const fileCounts: Record<string, number> = {};
      const storageSizes: Record<string, number> = {};
      
      files?.forEach(file => {
        fileCounts[file.project_id] = (fileCounts[file.project_id] || 0) + 1;
        const sizeKB = new Blob([file.file_content]).size / 1024;
        storageSizes[file.project_id] = (storageSizes[file.project_id] || 0) + sizeKB;
      });

      // Fetch deployments
      const { data: deployments } = await supabase
        .from('project_deployments')
        .select('project_id, status, deployment_url')
        .order('created_at', { ascending: false });

      const deploymentMap: Record<string, { url?: string; status: string }> = {};
      deployments?.forEach(d => {
        if (!deploymentMap[d.project_id]) {
          deploymentMap[d.project_id] = { url: d.deployment_url || undefined, status: d.status };
        }
      });

      // Fetch owners via edge function
      const { data: authUsersData } = await supabase.functions.invoke("admin-get-users", {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const authUsers = authUsersData?.users || [];

      const projectsWithDetails = (projectsData || []).map((project) => {
        const owner = authUsers.find((u: any) => u.id === project.user_id);
        return {
          ...project,
          ownerEmail: owner?.email || 'N/A',
          fileCount: fileCounts[project.id] || 0,
          storageSize: storageSizes[project.id] || 0,
          deploymentUrl: deploymentMap[project.id]?.url,
          deploymentStatus: deploymentMap[project.id]?.status,
          isArchived: false, // Could add an archived field to DB
        };
      });

      setProjects(projectsWithDetails);

      // Get unique owners for filter
      const owners = [...new Set(projectsWithDetails.map(p => p.ownerEmail).filter(Boolean))];
      setUniqueOwners(owners as string[]);

      // Calculate stats
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      setStats({
        totalProjects: projectsWithDetails.length,
        activeProjects: projectsWithDetails.filter(p => new Date(p.updated_at) >= thirtyDaysAgo).length,
        totalStorage: Object.values(storageSizes).reduce((sum, size) => sum + size, 0),
        recentlyModified: projectsWithDetails.filter(p => new Date(p.updated_at) >= sevenDaysAgo).length,
        withGithub: projectsWithDetails.filter(p => p.github_repo_url).length,
        deployed: projectsWithDetails.filter(p => p.deploymentStatus === 'deployed').length,
      });

      setLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [navigate, toast]);

  useEffect(() => {
    const checkAccess = async () => {
      const adminAuth = sessionStorage.getItem('admin_authenticated');
      if (adminAuth !== 'true') {
        navigate("/admin/login");
        return;
      }
      await fetchProjects();
    };

    checkAccess();
  }, [navigate, fetchProjects]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.ownerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesOwner = ownerFilter === "all" || project.ownerEmail === ownerFilter;
      
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const isActive = new Date(project.updated_at) >= thirtyDaysAgo;
      
      let matchesStatus = true;
      if (statusFilter === "active") matchesStatus = isActive && !project.isArchived;
      else if (statusFilter === "inactive") matchesStatus = !isActive && !project.isArchived;
      else if (statusFilter === "archived") matchesStatus = !!project.isArchived;
      
      return matchesSearch && matchesOwner && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "name" || sortField === "ownerEmail") {
        aVal = aVal?.toLowerCase() || "";
        bVal = bVal?.toLowerCase() || "";
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [projects, searchQuery, ownerFilter, statusFilter, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProjects.length / itemsPerPage);
  const paginatedProjects = filteredAndSortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Selection handlers
  const handleSelectProject = (projectId: string, checked: boolean) => {
    const newSelected = new Set(selectedProjects);
    if (checked) newSelected.add(projectId);
    else newSelected.delete(projectId);
    setSelectedProjects(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedProjects(new Set(paginatedProjects.map(p => p.id)));
    } else {
      setSelectedProjects(new Set());
    }
  };

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Project Deleted",
      description: `Project "${projectName}" has been deleted successfully.`,
    });

    setProjects(projects.filter(p => p.id !== projectId));
  };

  const handleTransferOwnership = async (projectId: string, newOwnerEmail: string) => {
    // Find user by email
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: usersData } = await supabase.functions.invoke("admin-get-users", {
      headers: { Authorization: `Bearer ${session.access_token}` }
    });

    const newOwner = usersData?.users?.find((u: any) => u.email === newOwnerEmail);
    if (!newOwner) {
      toast({
        title: "Error",
        description: "User not found with that email",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('projects')
      .update({ user_id: newOwner.id })
      .eq('id', projectId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to transfer ownership",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Ownership Transferred",
      description: `Project transferred to ${newOwnerEmail}`,
    });

    fetchProjects();
  };

  const handleExportProject = async (projectId: string, projectName: string) => {
    // Fetch all project files
    const { data: files, error } = await supabase
      .from('project_files')
      .select('file_path, file_content')
      .eq('project_id', projectId);

    if (error || !files) {
      toast({
        title: "Error",
        description: "Failed to export project",
        variant: "destructive",
      });
      return;
    }

    // Create a simple JSON export
    const exportData = {
      projectName,
      exportedAt: new Date().toISOString(),
      files: files.map(f => ({ path: f.file_path, content: f.file_content }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/[^a-z0-9]/gi, '_')}-export.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Project "${projectName}" exported successfully.`,
    });
  };

  // Bulk actions
  const handleBulkAction = async (reason?: string) => {
    const selectedIds = Array.from(selectedProjects);
    let successCount = 0;

    if (bulkAction === "delete") {
      for (const id of selectedIds) {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (!error) successCount++;
      }
      setProjects(projects.filter(p => !selectedIds.includes(p.id)));
    } else if (bulkAction === "export") {
      for (const id of selectedIds) {
        const project = projects.find(p => p.id === id);
        if (project) {
          await handleExportProject(id, project.name);
          successCount++;
        }
      }
    }

    setSelectedProjects(new Set());
    setSelectAll(false);

    toast({
      title: "Bulk Action Completed",
      description: `${successCount} project(s) ${bulkAction === "delete" ? "deleted" : "exported"}`,
    });
  };

  // Export projects list to CSV
  const exportToCSV = () => {
    const headers = ["Name", "Owner", "Files", "Storage (KB)", "GitHub", "Deployment", "Created", "Last Modified"];
    const rows = filteredAndSortedProjects.map(project => [
      project.name,
      project.ownerEmail || "N/A",
      project.fileCount || 0,
      (project.storageSize || 0).toFixed(1),
      project.github_repo_url ? "Yes" : "No",
      project.deploymentStatus || "None",
      new Date(project.created_at).toLocaleDateString(),
      new Date(project.updated_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `projects-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: "Export Complete", description: `Exported ${filteredAndSortedProjects.length} projects to CSV` });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatStorage = (sizeKB: number) => {
    if (sizeKB < 1024) return `${sizeKB.toFixed(1)} KB`;
    return `${(sizeKB / 1024).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-neutral-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-neutral-800 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Project Management</h1>
          <p className="text-sm mt-1 text-neutral-400">
            Manage all projects across the platform
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => fetchProjects(true)}
          disabled={isRefreshing}
          className="border-neutral-600 bg-neutral-700 text-white hover:bg-neutral-600"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="rounded-lg border p-4 bg-neutral-700 border-neutral-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">Total Projects</p>
              <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/20">
              <FolderOpen className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-neutral-700 border-neutral-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">Active (30d)</p>
              <p className="text-2xl font-bold text-green-400">{stats.activeProjects}</p>
            </div>
            <div className="p-2 rounded-lg bg-green-500/20">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-neutral-700 border-neutral-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">Recent (7d)</p>
              <p className="text-2xl font-bold text-blue-400">{stats.recentlyModified}</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-neutral-700 border-neutral-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">Total Storage</p>
              <p className="text-2xl font-bold text-white">{formatStorage(stats.totalStorage)}</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/20">
              <HardDrive className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-neutral-700 border-neutral-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">With GitHub</p>
              <p className="text-2xl font-bold text-white">{stats.withGithub}</p>
            </div>
            <div className="p-2 rounded-lg bg-neutral-500/20">
              <GitBranch className="w-5 h-5 text-neutral-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-neutral-700 border-neutral-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">Deployed</p>
              <p className="text-2xl font-bold text-green-400">{stats.deployed}</p>
            </div>
            <div className="p-2 rounded-lg bg-green-500/20">
              <Globe className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border h-9 text-sm bg-neutral-700 border-neutral-600 text-white"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-36 bg-neutral-700 border-neutral-600 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-700 border-neutral-600 z-50">
              <SelectItem value="all" className="text-white hover:bg-neutral-600">All Status</SelectItem>
              <SelectItem value="active" className="text-white hover:bg-neutral-600">Active</SelectItem>
              <SelectItem value="inactive" className="text-white hover:bg-neutral-600">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ownerFilter} onValueChange={setOwnerFilter}>
            <SelectTrigger className="w-48 bg-neutral-700 border-neutral-600 text-white">
              <SelectValue placeholder="Filter by owner" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-700 border-neutral-600 z-50 max-h-60">
              <SelectItem value="all" className="text-white hover:bg-neutral-600">All Owners</SelectItem>
              {uniqueOwners.map(owner => (
                <SelectItem key={owner} value={owner} className="text-white hover:bg-neutral-600">
                  {owner}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {selectedProjects.size > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-neutral-600 bg-neutral-700 text-white hover:bg-neutral-600">
                  Bulk Actions ({selectedProjects.size})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-neutral-700 border-neutral-600">
                <DropdownMenuItem 
                  className="text-blue-400 hover:bg-neutral-600 cursor-pointer"
                  onClick={() => { setBulkAction("export"); setBulkActionDialogOpen(true); }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Selected
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-400 hover:bg-neutral-600 cursor-pointer"
                  onClick={() => { setBulkAction("delete"); setBulkActionDialogOpen(true); }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToCSV}
            className="border-neutral-600 bg-neutral-700 text-white hover:bg-neutral-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden bg-neutral-700 border-neutral-600">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-600">
              <TableHead className="w-12 text-white">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  className="border-neutral-500"
                />
              </TableHead>
              <TableHead 
                className="text-white cursor-pointer hover:bg-neutral-600"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  Project
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead 
                className="text-white cursor-pointer hover:bg-neutral-600"
                onClick={() => handleSort("ownerEmail")}
              >
                <div className="flex items-center gap-2">
                  Owner
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead 
                className="text-white cursor-pointer hover:bg-neutral-600"
                onClick={() => handleSort("fileCount")}
              >
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  Files
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead 
                className="text-white cursor-pointer hover:bg-neutral-600"
                onClick={() => handleSort("storageSize")}
              >
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  Storage
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Integrations</TableHead>
              <TableHead 
                className="text-white cursor-pointer hover:bg-neutral-600"
                onClick={() => handleSort("updated_at")}
              >
                <div className="flex items-center gap-2">
                  Last Modified
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProjects.map((project) => {
              const isActive = new Date(project.updated_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
              
              return (
                <TableRow key={project.id} className="border-neutral-600 hover:bg-neutral-600/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedProjects.has(project.id)}
                      onCheckedChange={(checked) => handleSelectProject(project.id, !!checked)}
                      className="border-neutral-500"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-white">{project.name}</p>
                      {project.description && (
                        <p className="text-xs text-neutral-400 truncate max-w-[200px]">{project.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-neutral-300">{project.ownerEmail}</TableCell>
                  <TableCell className="text-white">{project.fileCount}</TableCell>
                  <TableCell className="text-white">{formatStorage(project.storageSize || 0)}</TableCell>
                  <TableCell>
                    <Badge className={isActive ? "bg-green-500/20 text-green-400" : "bg-neutral-500/20 text-neutral-400"}>
                      {isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {project.github_repo_url && (
                        <Badge className="bg-neutral-500/20 text-neutral-300">
                          <GitBranch className="w-3 h-3 mr-1" />
                          GitHub
                        </Badge>
                      )}
                      {project.deploymentStatus === "deployed" && (
                        <Badge className="bg-green-500/20 text-green-400">
                          <Globe className="w-3 h-3 mr-1" />
                          Live
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-neutral-400 text-sm">{formatDate(project.updated_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="hover:bg-neutral-600 text-white">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-neutral-700 border-neutral-600 min-w-[180px] z-50">
                        <DropdownMenuLabel className="text-neutral-400 text-xs">Project Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-neutral-600" />
                        <DropdownMenuItem
                          className="text-white hover:bg-neutral-600 cursor-pointer"
                          onClick={() => {
                            setSelectedProject(project);
                            setDetailsDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-white hover:bg-neutral-600 cursor-pointer"
                          onClick={() => {
                            setSelectedProject(project);
                            setExportDialogOpen(true);
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export Project
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-amber-400 hover:bg-neutral-600 cursor-pointer"
                          onClick={() => {
                            setSelectedProject(project);
                            setTransferDialogOpen(true);
                          }}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Transfer Ownership
                        </DropdownMenuItem>
                        {project.deploymentUrl && (
                          <DropdownMenuItem
                            className="text-blue-400 hover:bg-neutral-600 cursor-pointer"
                            onClick={() => window.open(project.deploymentUrl, '_blank')}
                          >
                            <Globe className="w-4 h-4 mr-2" />
                            View Deployment
                          </DropdownMenuItem>
                        )}
                        {project.github_repo_url && (
                          <DropdownMenuItem
                            className="text-neutral-300 hover:bg-neutral-600 cursor-pointer"
                            onClick={() => window.open(project.github_repo_url, '_blank')}
                          >
                            <GitBranch className="w-4 h-4 mr-2" />
                            View GitHub
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-neutral-600" />
                        <DropdownMenuItem
                          className="text-red-400 hover:bg-neutral-600 cursor-pointer"
                          onClick={() => {
                            setSelectedProject(project);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {paginatedProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-neutral-500" />
            <p className="text-neutral-400">
              {searchQuery || statusFilter !== "all" || ownerFilter !== "all"
                ? "No projects found matching your filters"
                : "No projects found"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-neutral-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedProjects.length)} of{" "}
            {filteredAndSortedProjects.length} projects
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-neutral-600 text-white hover:bg-neutral-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-white text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-neutral-600 text-white hover:bg-neutral-700"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <ProjectDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        project={selectedProject}
      />
      <TransferOwnershipDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        project={selectedProject}
        onTransfer={handleTransferOwnership}
      />
      <ProjectBulkActionsDialog
        open={bulkActionDialogOpen}
        onOpenChange={setBulkActionDialogOpen}
        action={bulkAction}
        selectedCount={selectedProjects.size}
        onConfirm={handleBulkAction}
      />
      <ExportProjectDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        project={selectedProject}
      />
      <DeleteProjectDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        project={selectedProject}
        onConfirm={handleDeleteProject}
      />
    </div>
  );
};

export default AdminProjects;
