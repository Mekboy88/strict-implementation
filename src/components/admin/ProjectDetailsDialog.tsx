import { useState, useEffect, useRef } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  FolderOpen, User, Calendar, HardDrive, FileCode, 
  Users, GitBranch, Globe, Clock, Bot, Send, X, Eye 
} from "lucide-react";
import Editor from "@monaco-editor/react";

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

interface AIMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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
  
  // Code viewer state
  const [selectedFile, setSelectedFile] = useState<{ path: string; content: string } | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);
  
  // AI Diagnose state
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && project) {
      fetchProjectDetails();
      setAiMessages([]);
      setSelectedFile(null);
    }
  }, [open, project]);

  const fetchFileContent = async (filePath: string) => {
    if (!project) return;
    setLoadingFile(true);
    
    const { data, error } = await supabase
      .from("project_files")
      .select("file_content")
      .eq("project_id", project.id)
      .eq("file_path", filePath)
      .single();
    
    if (error) {
      toast.error("Failed to load file content");
      setLoadingFile(false);
      return;
    }
    
    setSelectedFile({ path: filePath, content: data.file_content });
    setLoadingFile(false);
  };

  const getLanguageFromPath = (filePath: string): string => {
    const ext = filePath.split(".").pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      ts: "typescript",
      tsx: "typescript",
      js: "javascript",
      jsx: "javascript",
      json: "json",
      css: "css",
      html: "html",
      md: "markdown",
      sql: "sql",
      py: "python",
      toml: "toml",
      yaml: "yaml",
      yml: "yaml",
    };
    return languageMap[ext || ""] || "plaintext";
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

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

  const sendAIMessage = async () => {
    if (!aiInput.trim() || !project) return;

    const userMessage: AIMessage = {
      role: "user",
      content: aiInput,
      timestamp: new Date(),
    };
    setAiMessages((prev) => [...prev, userMessage]);
    setAiInput("");
    setAiLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-diagnose", {
        body: {
          projectId: project.id,
          message: aiInput,
        },
      });

      if (error) throw error;

      const assistantMessage: AIMessage = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      setAiMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI error:", error);
      toast.error("Failed to get AI response");
    } finally {
      setAiLoading(false);
    }
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
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] bg-neutral-800 border-neutral-600 text-white">
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
            <TabsTrigger value="ai-diagnose" className="data-[state=active]:bg-neutral-600 text-white flex items-center gap-1">
              <Bot className="w-4 h-4" />
              AI Diagnose
            </TabsTrigger>
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
            {selectedFile ? (
              <div className="h-[350px] flex flex-col">
                <div className="flex items-center justify-between mb-2 p-2 bg-neutral-700 rounded">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-sm font-mono">{selectedFile.path}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    className="text-neutral-400 hover:text-white hover:bg-neutral-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 rounded overflow-hidden border border-neutral-600">
                  <Editor
                    height="100%"
                    language={getLanguageFromPath(selectedFile.path)}
                    value={selectedFile.content}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 12,
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                    }}
                  />
                </div>
              </div>
            ) : (
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
                      <div 
                        key={file.id} 
                        className="flex items-center justify-between p-2 bg-neutral-700 rounded hover:bg-neutral-600 cursor-pointer transition-colors"
                        onClick={() => fetchFileContent(file.file_path)}
                      >
                        <div className="flex items-center gap-2">
                          <FileCode className="w-4 h-4 text-blue-400" />
                          <span className="text-white text-sm font-mono">{file.file_path}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-400 text-xs">{formatDate(file.updated_at)}</span>
                          <Eye className="w-4 h-4 text-neutral-400" />
                        </div>
                      </div>
                    ))}
                    {loadingFile && (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                        <span className="text-neutral-400 text-sm ml-2">Loading file...</span>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            )}
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

          <TabsContent value="ai-diagnose" className="mt-4">
            <div className="flex flex-col h-[350px]">
              <ScrollArea className="flex-1 mb-3">
                {aiMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                    <p className="text-neutral-400">Ask the AI to help diagnose issues with this project.</p>
                    <p className="text-neutral-500 text-sm mt-1">
                      The AI has access to project files, deployments, and error logs.
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600"
                        onClick={() => setAiInput("What are the recent errors in this project?")}
                      >
                        Check recent errors
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600"
                        onClick={() => setAiInput("Analyze the project structure and suggest improvements")}
                      >
                        Analyze structure
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600"
                        onClick={() => setAiInput("Why might deployments be failing?")}
                      >
                        Deployment issues
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 pr-2">
                    {aiMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-lg ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-neutral-700 text-white"
                          }`}
                        >
                          {msg.role === "assistant" && (
                            <div className="flex items-center gap-2 mb-2 text-blue-400">
                              <Bot className="w-4 h-4" />
                              <span className="text-xs font-medium">AI Assistant</span>
                            </div>
                          )}
                          <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {aiLoading && (
                      <div className="flex justify-start">
                        <div className="bg-neutral-700 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                            <span className="text-neutral-400 text-sm">Analyzing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Ask AI about this project..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendAIMessage()}
                  className="flex-1 bg-neutral-700 border-neutral-600 text-white"
                  disabled={aiLoading}
                />
                <Button
                  onClick={sendAIMessage}
                  disabled={aiLoading || !aiInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
