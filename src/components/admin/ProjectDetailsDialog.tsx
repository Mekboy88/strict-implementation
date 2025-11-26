import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { 
  FolderOpen, User, Calendar, HardDrive, FileCode, 
  Users, GitBranch, Globe, Clock 
} from "lucide-react";

interface ProjectDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
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
  } | null;
}

interface ProjectMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

interface ProjectDeployment {
  id: string;
  status: string;
  deployment_url?: string;
  created_at: string;
  deployed_at?: string;
}

interface ProjectFile {
  id: string;
  file_path: string;
  file_type?: string;
  updated_at: string;
}

export function ProjectDetailsDialog({
  open,
  onOpenChange,
  project,
}: ProjectDetailsDialogProps) {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [deployments, setDeployments] = useState<ProjectDeployment[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && project) {
      fetchProjectDetails();
    }
  }, [open, project]);

  const fetchProjectDetails = async () => {
    if (!project) return;
    setLoading(true);

    // Fetch members
    const { data: membersData } = await supabase
      .from("project_members")
      .select("*")
      .eq("project_id", project.id);
    setMembers(membersData || []);

    // Fetch deployments
    const { data: deploymentsData } = await supabase
      .from("project_deployments")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false })
      .limit(5);
    setDeployments(deploymentsData || []);

    // Fetch files (limited)
    const { data: filesData } = await supabase
      .from("project_files")
      .select("id, file_path, file_type, updated_at")
      .eq("project_id", project.id)
      .order("updated_at", { ascending: false })
      .limit(20);
    setFiles(filesData || []);

    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStorage = (sizeKB: number) => {
    if (sizeKB < 1024) return `${sizeKB.toFixed(1)} KB`;
    return `${(sizeKB / 1024).toFixed(1)} MB`;
  };

  const isActive = project ? 
    new Date(project.updated_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : false;

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] bg-neutral-800 border-neutral-600 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <FolderOpen className="h-5 w-5 text-blue-400" />
            {project.name}
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            {project.description || "No description"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-neutral-700 border-neutral-600">
            <TabsTrigger value="overview" className="data-[state=active]:bg-neutral-600 text-white">Overview</TabsTrigger>
            <TabsTrigger value="files" className="data-[state=active]:bg-neutral-600 text-white">Files</TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-neutral-600 text-white">Members</TabsTrigger>
            <TabsTrigger value="deployments" className="data-[state=active]:bg-neutral-600 text-white">Deployments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-neutral-700 rounded-lg">
                <div className="flex items-center gap-2 text-neutral-400 text-sm mb-1">
                  <User className="w-4 h-4" />
                  Owner
                </div>
                <p className="text-white">{project.ownerEmail}</p>
              </div>
              <div className="p-3 bg-neutral-700 rounded-lg">
                <div className="flex items-center gap-2 text-neutral-400 text-sm mb-1">
                  <HardDrive className="w-4 h-4" />
                  Storage
                </div>
                <p className="text-white">{formatStorage(project.storageSize || 0)}</p>
              </div>
              <div className="p-3 bg-neutral-700 rounded-lg">
                <div className="flex items-center gap-2 text-neutral-400 text-sm mb-1">
                  <FileCode className="w-4 h-4" />
                  Files
                </div>
                <p className="text-white">{project.fileCount || 0} files</p>
              </div>
              <div className="p-3 bg-neutral-700 rounded-lg">
                <div className="flex items-center gap-2 text-neutral-400 text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  Status
                </div>
                <Badge className={isActive ? "bg-green-500/20 text-green-400" : "bg-neutral-500/20 text-neutral-400"}>
                  {isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="p-3 bg-neutral-700 rounded-lg">
                <div className="flex items-center gap-2 text-neutral-400 text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  Created
                </div>
                <p className="text-white text-sm">{formatDate(project.created_at)}</p>
              </div>
              <div className="p-3 bg-neutral-700 rounded-lg">
                <div className="flex items-center gap-2 text-neutral-400 text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  Last Modified
                </div>
                <p className="text-white text-sm">{formatDate(project.updated_at)}</p>
              </div>
              {project.github_repo_url && (
                <div className="col-span-2 p-3 bg-neutral-700 rounded-lg">
                  <div className="flex items-center gap-2 text-neutral-400 text-sm mb-1">
                    <GitBranch className="w-4 h-4" />
                    GitHub Repository
                  </div>
                  <a 
                    href={project.github_repo_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline text-sm"
                  >
                    {project.github_repo_url}
                  </a>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-4">
            <ScrollArea className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                </div>
              ) : files.length === 0 ? (
                <p className="text-neutral-400 text-center py-8">No files found</p>
              ) : (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-neutral-700 rounded">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm font-mono">{file.file_path}</span>
                      </div>
                      <span className="text-neutral-400 text-xs">{formatDate(file.updated_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="members" className="mt-4">
            <ScrollArea className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                </div>
              ) : members.length === 0 ? (
                <p className="text-neutral-400 text-center py-8">No team members</p>
              ) : (
                <div className="space-y-2">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 bg-neutral-700 rounded">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm">{member.user_id}</span>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400">{member.role}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="deployments" className="mt-4">
            <ScrollArea className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                </div>
              ) : deployments.length === 0 ? (
                <p className="text-neutral-400 text-center py-8">No deployments found</p>
              ) : (
                <div className="space-y-2">
                  {deployments.map((deployment) => (
                    <div key={deployment.id} className="p-3 bg-neutral-700 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={
                          deployment.status === "deployed" ? "bg-green-500/20 text-green-400" :
                          deployment.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                        }>
                          {deployment.status}
                        </Badge>
                        <span className="text-neutral-400 text-xs">{formatDate(deployment.created_at)}</span>
                      </div>
                      {deployment.deployment_url && (
                        <a 
                          href={deployment.deployment_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:underline text-sm"
                        >
                          <Globe className="w-3 h-3" />
                          {deployment.deployment_url}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
