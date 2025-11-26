import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FolderOpen, Search, MoreVertical, Eye, Trash2, UserPlus, Download, TrendingUp, HardDrive, Clock } from "lucide-react";
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
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
}

const AdminProjects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalStorage: 0,
    recentlyModified: 0,
  });

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
        return;
      }

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

      const projectsWithOwners = await Promise.all(
        (projectsData || []).map(async (project) => {
          const { data: { user } } = await supabase.auth.admin.getUserById(project.user_id);
          return {
            ...project,
            ownerEmail: user?.email || 'N/A',
            fileCount: fileCounts[project.id] || 0,
            storageSize: storageSizes[project.id] || 0,
          };
        })
      );

      setProjects(projectsWithOwners);

      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      setStats({
        totalProjects: projectsWithOwners.length,
        activeProjects: projectsWithOwners.filter(p => new Date(p.updated_at) >= thirtyDaysAgo).length,
        totalStorage: Object.values(storageSizes).reduce((sum, size) => sum + size, 0),
        recentlyModified: projectsWithOwners.filter(p => new Date(p.updated_at) >= sevenDaysAgo).length,
      });

      setLoading(false);
    };

    checkAccess();
  }, [navigate, toast]);

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!confirm(`Are you sure you want to delete project "${projectName}"? This action cannot be undone.`)) {
      return;
    }

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

  const handleExportProject = (projectId: string, projectName: string) => {
    toast({
      title: "Export Started",
      description: `Exporting project "${projectName}"...`,
    });
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.ownerEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
    <div className="min-h-screen bg-neutral-800 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-50">
          Project Management
        </h1>
        <p className="text-sm mt-1 text-neutral-400">
          Manage all projects across the platform
        </p>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg border p-4" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: "#4CB3FF20" }}>
                <FolderOpen className="w-5 h-5" style={{ color: "#4CB3FF" }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: "#8FA3B7" }}>Total Projects</p>
                <p className="text-2xl font-bold" style={{ color: "#D6E4F0" }}>{stats.totalProjects}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: "#4CB3FF20" }}>
                <TrendingUp className="w-5 h-5" style={{ color: "#4CB3FF" }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: "#8FA3B7" }}>Active (30d)</p>
                <p className="text-2xl font-bold" style={{ color: "#4CB3FF" }}>{stats.activeProjects}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: "#4CB3FF20" }}>
                <HardDrive className="w-5 h-5" style={{ color: "#4CB3FF" }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: "#8FA3B7" }}>Total Storage</p>
                <p className="text-2xl font-bold" style={{ color: "#D6E4F0" }}>{formatStorage(stats.totalStorage)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: "#4CB3FF20" }}>
                <Clock className="w-5 h-5" style={{ color: "#4CB3FF" }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: "#8FA3B7" }}>Recent (7d)</p>
                <p className="text-2xl font-bold" style={{ color: "#4CB3FF" }}>{stats.recentlyModified}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "#8FA3B7" }} />
          <Input
            type="text"
            placeholder="Search projects or owners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
            style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
          />
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden" style={{ borderColor: "#ffffff15" }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "#ffffff15" }}>
              <TableHead style={{ color: "#8FA3B7" }}>Project Name</TableHead>
              <TableHead style={{ color: "#8FA3B7" }}>Owner</TableHead>
              <TableHead style={{ color: "#8FA3B7" }}>Files</TableHead>
              <TableHead style={{ color: "#8FA3B7" }}>Storage</TableHead>
              <TableHead style={{ color: "#8FA3B7" }}>Created</TableHead>
              <TableHead style={{ color: "#8FA3B7" }}>Last Modified</TableHead>
              <TableHead style={{ color: "#8FA3B7", textAlign: "right" }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow 
                key={project.id}
                className="hover:bg-[#ffffff05]"
                style={{ borderColor: "#ffffff15" }}
              >
                <TableCell style={{ color: "#D6E4F0" }}>
                  <div>
                    <p className="font-medium">{project.name}</p>
                    {project.description && (
                      <p className="text-xs" style={{ color: "#8FA3B7" }}>{project.description}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell style={{ color: "#8FA3B7" }}>{project.ownerEmail}</TableCell>
                <TableCell style={{ color: "#D6E4F0" }}>{project.fileCount}</TableCell>
                <TableCell style={{ color: "#D6E4F0" }}>{formatStorage(project.storageSize || 0)}</TableCell>
                <TableCell style={{ color: "#8FA3B7" }}>{formatDate(project.created_at)}</TableCell>
                <TableCell style={{ color: "#8FA3B7" }}>{formatDate(project.updated_at)}</TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" style={{ color: "#8FA3B7" }} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
                      <DropdownMenuItem style={{ color: "#D6E4F0" }}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Project
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleExportProject(project.id, project.name)}
                        style={{ color: "#D6E4F0" }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export Project
                      </DropdownMenuItem>
                      <DropdownMenuItem style={{ color: "#D6E4F0" }}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Transfer Ownership
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteProject(project.id, project.name)}
                        style={{ color: "#ef4444" }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminProjects;
