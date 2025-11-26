import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Search,
  Plus,
  MessageSquare,
  Clock,
  User,
  FolderOpen,
  MoreVertical,
  Send,
  Bot,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Filter,
} from "lucide-react";

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  type: string;
  project_id: string | null;
  user_id: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  projectName?: string;
  userEmail?: string;
}

interface AIMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AdminSupport = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    message: "",
    priority: "medium",
    type: "support",
    project_id: "",
  });
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  
  // AI Chat state
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTickets();
    fetchProjects();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  const fetchTickets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch support tickets");
      console.error(error);
    } else {
      // Fetch project names and user emails
      const ticketsWithDetails = await Promise.all(
        (data || []).map(async (ticket) => {
          let projectName = "";
          let userEmail = "";
          
          if (ticket.project_id) {
            const { data: project } = await supabase
              .from("projects")
              .select("name")
              .eq("id", ticket.project_id)
              .single();
            projectName = project?.name || "";
          }
          
          return { ...ticket, projectName, userEmail };
        })
      );
      setTickets(ticketsWithDetails);
    }
    setLoading(false);
  };

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("id, name").limit(100);
    setProjects(data || []);
  };

  const createTicket = async () => {
    if (!newTicket.subject || !newTicket.message) {
      toast.error("Subject and message are required");
      return;
    }

    const { error } = await supabase.from("feedback").insert({
      subject: newTicket.subject,
      message: newTicket.message,
      priority: newTicket.priority,
      type: newTicket.type,
      project_id: newTicket.project_id || null,
      status: "open",
    });

    if (error) {
      toast.error("Failed to create ticket");
    } else {
      toast.success("Ticket created successfully");
      setCreateDialogOpen(false);
      setNewTicket({ subject: "", message: "", priority: "medium", type: "support", project_id: "" });
      fetchTickets();
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    const updates: Record<string, any> = { status };
    if (status === "resolved") {
      updates.resolved_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("feedback")
      .update(updates)
      .eq("id", ticketId);

    if (error) {
      toast.error("Failed to update ticket");
    } else {
      toast.success("Ticket updated");
      fetchTickets();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status, resolved_at: updates.resolved_at });
      }
    }
  };

  const sendAIMessage = async () => {
    if (!aiInput.trim() || !selectedTicket) return;

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
          projectId: selectedTicket.project_id,
          message: `Ticket: ${selectedTicket.subject}\n\nOriginal Issue: ${selectedTicket.message}\n\nAdmin Question: ${aiInput}`,
          projectContext: {
            ticketInfo: {
              subject: selectedTicket.subject,
              message: selectedTicket.message,
              priority: selectedTicket.priority,
              type: selectedTicket.type,
            },
          },
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

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-400" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "closed":
        return <XCircle className="w-4 h-4 text-neutral-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400";
      case "low":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-neutral-500/20 text-neutral-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full flex flex-col bg-neutral-800">
      {/* Header */}
      <div className="p-6 border-b border-neutral-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Support & Issues</h1>
            <p className="text-neutral-400 text-sm">Manage support tickets with AI assistance</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchTickets}
              variant="outline"
              size="sm"
              className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-neutral-700 border-neutral-600 text-white"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-neutral-700 border-neutral-600 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-700 border-neutral-600">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px] bg-neutral-700 border-neutral-600 text-white">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-700 border-neutral-600">
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tickets List */}
        <div className="w-1/3 border-r border-neutral-700 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">No tickets found</div>
            ) : (
              <div className="divide-y divide-neutral-700">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setAiMessages([]);
                    }}
                    className={`p-4 cursor-pointer transition-colors hover:bg-neutral-700/50 ${
                      selectedTicket?.id === ticket.id ? "bg-neutral-700" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(ticket.status)}
                        <span className="text-white font-medium truncate max-w-[180px]">
                          {ticket.subject}
                        </span>
                      </div>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <p className="text-neutral-400 text-sm line-clamp-2 mb-2">
                      {ticket.message}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      {ticket.projectName && (
                        <span className="flex items-center gap-1">
                          <FolderOpen className="w-3 h-3" />
                          {ticket.projectName}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(ticket.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Ticket Detail & AI Chat */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Ticket Header */}
              <div className="p-4 border-b border-neutral-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">
                      {selectedTicket.subject}
                    </h2>
                    <div className="flex items-center gap-3">
                      <Badge className={getPriorityColor(selectedTicket.priority)}>
                        {selectedTicket.priority}
                      </Badge>
                      <Badge
                        className={
                          selectedTicket.status === "open"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : selectedTicket.status === "resolved"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-blue-500/20 text-blue-400"
                        }
                      >
                        {selectedTicket.status}
                      </Badge>
                      {selectedTicket.projectName && (
                        <span className="text-neutral-400 text-sm flex items-center gap-1">
                          <FolderOpen className="w-3 h-3" />
                          {selectedTicket.projectName}
                        </span>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-neutral-700 border-neutral-600">
                      <DropdownMenuItem
                        onClick={() => updateTicketStatus(selectedTicket.id, "in_progress")}
                        className="text-white hover:bg-neutral-600"
                      >
                        Mark In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateTicketStatus(selectedTicket.id, "resolved")}
                        className="text-green-400 hover:bg-neutral-600"
                      >
                        Mark Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateTicketStatus(selectedTicket.id, "closed")}
                        className="text-neutral-400 hover:bg-neutral-600"
                      >
                        Close Ticket
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Original Message */}
              <div className="p-4 border-b border-neutral-700 bg-neutral-750">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-400 text-sm">Original Issue</span>
                </div>
                <p className="text-white whitespace-pre-wrap">{selectedTicket.message}</p>
              </div>

              {/* AI Chat Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-3 border-b border-neutral-700 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">AI Assistant</span>
                  <span className="text-neutral-400 text-sm">- Ask for help diagnosing this issue</span>
                </div>

                <ScrollArea className="flex-1 p-4">
                  {aiMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <Bot className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                      <p className="text-neutral-400">
                        Ask the AI assistant for help with this ticket.
                      </p>
                      <p className="text-neutral-500 text-sm mt-1">
                        The AI has context about the project and recent errors.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {aiMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
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
                              <span className="text-neutral-400 text-sm">Thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* AI Input */}
                <div className="p-4 border-t border-neutral-700">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask AI for help with this issue..."
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
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-400">Select a ticket to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="bg-neutral-800 border-neutral-600 text-white">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Create a new support ticket for tracking
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-neutral-400 mb-1 block">Subject</label>
              <Input
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="bg-neutral-700 border-neutral-600 text-white"
                placeholder="Brief description of the issue"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 mb-1 block">Message</label>
              <Textarea
                value={newTicket.message}
                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                className="bg-neutral-700 border-neutral-600 text-white min-h-[100px]"
                placeholder="Detailed description..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Priority</label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(v) => setNewTicket({ ...newTicket, priority: v })}
                >
                  <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-700 border-neutral-600">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Type</label>
                <Select
                  value={newTicket.type}
                  onValueChange={(v) => setNewTicket({ ...newTicket, type: v })}
                >
                  <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-700 border-neutral-600">
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm text-neutral-400 mb-1 block">Related Project (optional)</label>
              <Select
                value={newTicket.project_id}
                onValueChange={(v) => setNewTicket({ ...newTicket, project_id: v === "none" ? "" : v })}
              >
                <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-700 border-neutral-600">
                  <SelectItem value="none">None</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600"
            >
              Cancel
            </Button>
            <Button onClick={createTicket} className="bg-blue-600 hover:bg-blue-700">
              Create Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSupport;
