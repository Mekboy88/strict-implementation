import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Bell, Megaphone, Ticket, Plus, Edit, Trash2, Check, Clock, AlertCircle } from "lucide-react";
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

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  active: boolean;
  created_at: string;
  expires_at?: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  recipients: number;
  opened: number;
  clicked: number;
  scheduled_at?: string;
  sent_at?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  recipients: string;
  sent_at: string;
  read_count: number;
  total_count: number;
}

interface SupportTicket {
  id: string;
  user_email: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
}

const AdminCommunication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);

  // Announcement State
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcementType, setAnnouncementType] = useState<'info' | 'warning' | 'success' | 'error'>('info');
  const [announcementActive, setAnnouncementActive] = useState(true);

  // Email Campaign State
  const [campaignName, setCampaignName] = useState("");
  const [campaignSubject, setCampaignSubject] = useState("");
  const [campaignContent, setCampaignContent] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("all");

  // Notification State
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [notificationRecipients, setNotificationRecipients] = useState("all");

  // Mock Data
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Platform Maintenance Scheduled',
      content: 'The platform will undergo scheduled maintenance on Sunday, 2:00 AM - 4:00 AM UTC.',
      type: 'info',
      active: true,
      created_at: '2025-11-20T10:00:00Z',
      expires_at: '2025-11-24T00:00:00Z',
    },
    {
      id: '2',
      title: 'New Features Released',
      content: 'We have released several new features including real-time collaboration and advanced analytics.',
      type: 'success',
      active: true,
      created_at: '2025-11-19T14:30:00Z',
    },
    {
      id: '3',
      title: 'Security Update Required',
      content: 'All users are required to update their passwords following our recent security audit.',
      type: 'warning',
      active: false,
      created_at: '2025-11-18T09:15:00Z',
    },
  ]);

  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([
    {
      id: '1',
      name: 'November Newsletter',
      subject: 'What is New in November - Feature Updates & Tips',
      content: 'Check out all the new features and improvements we have shipped this month...',
      status: 'sent',
      recipients: 1543,
      opened: 1205,
      clicked: 432,
      sent_at: '2025-11-15T10:00:00Z',
    },
    {
      id: '2',
      name: 'Welcome Campaign',
      subject: 'Welcome to UR-DEV - Get Started in Minutes',
      content: 'Welcome to our platform! Here is a quick guide to help you get started...',
      status: 'scheduled',
      recipients: 245,
      opened: 0,
      clicked: 0,
      scheduled_at: '2025-11-25T09:00:00Z',
    },
    {
      id: '3',
      name: 'Black Friday Promotion',
      subject: 'Exclusive Black Friday Offer - 50% Off Premium',
      content: 'Limited time offer for our valued users...',
      status: 'draft',
      recipients: 0,
      opened: 0,
      clicked: 0,
    },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'System Upgrade Complete',
      message: 'The system has been successfully upgraded to version 2.5.0',
      type: 'success',
      recipients: 'All Users',
      sent_at: '2025-11-22T08:00:00Z',
      read_count: 1342,
      total_count: 1897,
    },
    {
      id: '2',
      title: 'New Project Limit Increased',
      message: 'Your project limit has been increased to 50 projects',
      type: 'info',
      recipients: 'Premium Users',
      sent_at: '2025-11-21T15:30:00Z',
      read_count: 234,
      total_count: 456,
    },
    {
      id: '3',
      title: 'Payment Failed',
      message: 'Your recent payment attempt has failed. Please update your payment method.',
      type: 'error',
      recipients: 'Selected Users',
      sent_at: '2025-11-20T12:00:00Z',
      read_count: 12,
      total_count: 23,
    },
  ]);

  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: '1',
      user_email: 'john.doe@example.com',
      subject: 'Cannot deploy my project',
      message: 'I am getting an error when trying to deploy my project to production...',
      status: 'open',
      priority: 'high',
      created_at: '2025-11-22T14:30:00Z',
      updated_at: '2025-11-22T14:30:00Z',
    },
    {
      id: '2',
      user_email: 'sarah.smith@example.com',
      subject: 'Feature request: Dark mode',
      message: 'It would be great to have a dark mode option in the editor...',
      status: 'in_progress',
      priority: 'medium',
      created_at: '2025-11-21T09:15:00Z',
      updated_at: '2025-11-22T10:00:00Z',
    },
    {
      id: '3',
      user_email: 'mike.wilson@example.com',
      subject: 'Billing question',
      message: 'I was charged twice for my subscription this month...',
      status: 'resolved',
      priority: 'urgent',
      created_at: '2025-11-20T16:45:00Z',
      updated_at: '2025-11-21T11:20:00Z',
    },
  ]);

  useEffect(() => {
    const checkAdminAuth = async () => {
      const adminSession = sessionStorage.getItem('admin_authenticated');
      if (adminSession !== 'true') {
        navigate('/admin/login');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        sessionStorage.removeItem('admin_authenticated');
        navigate('/admin/login');
        return;
      }

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .in('role', ['owner', 'admin'])
        .maybeSingle();

      if (!data) {
        sessionStorage.removeItem('admin_authenticated');
        navigate('/admin/login');
        return;
      }

      setLoading(false);
    };

    checkAdminAuth();
  }, [navigate]);

  const handleCreateAnnouncement = () => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: announcementTitle,
      content: announcementContent,
      type: announcementType,
      active: announcementActive,
      created_at: new Date().toISOString(),
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setIsAnnouncementDialogOpen(false);
    setAnnouncementTitle("");
    setAnnouncementContent("");
    setAnnouncementType('info');
    setAnnouncementActive(true);

    toast({
      title: "Announcement created",
      description: "The announcement has been published successfully.",
    });
  };

  const handleCreateCampaign = () => {
    const newCampaign: EmailCampaign = {
      id: Date.now().toString(),
      name: campaignName,
      subject: campaignSubject,
      content: campaignContent,
      status: 'draft',
      recipients: 0,
      opened: 0,
      clicked: 0,
    };

    setCampaigns([newCampaign, ...campaigns]);
    setIsCampaignDialogOpen(false);
    setCampaignName("");
    setCampaignSubject("");
    setCampaignContent("");

    toast({
      title: "Campaign created",
      description: "The email campaign has been saved as draft.",
    });
  };

  const handleSendNotification = () => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: notificationTitle,
      message: notificationMessage,
      type: notificationType,
      recipients: notificationRecipients === 'all' ? 'All Users' : 'Selected Users',
      sent_at: new Date().toISOString(),
      read_count: 0,
      total_count: 0,
    };

    setNotifications([newNotification, ...notifications]);
    setIsNotificationDialogOpen(false);
    setNotificationTitle("");
    setNotificationMessage("");
    setNotificationType('info');
    setNotificationRecipients("all");

    toast({
      title: "Notification sent",
      description: "The notification has been sent to selected users.",
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
        <h1 className="text-3xl font-bold text-neutral-50">
          Content & Communication
        </h1>
        <p className="text-sm mt-2 text-neutral-400">
          Manage announcements, emails, notifications, and support tickets
        </p>
      </div>

      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="mb-6" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
          <TabsTrigger value="announcements" style={{ color: "#D6E4F0" }}>
            <Megaphone className="w-4 h-4 mr-2" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="campaigns" style={{ color: "#D6E4F0" }}>
            <Send className="w-4 h-4 mr-2" />
            Email Campaigns
          </TabsTrigger>
          <TabsTrigger value="notifications" style={{ color: "#D6E4F0" }}>
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="tickets" style={{ color: "#D6E4F0" }}>
            <Ticket className="w-4 h-4 mr-2" />
            Support Tickets
          </TabsTrigger>
        </TabsList>

        {/* Announcements Tab */}
        <TabsContent value="announcements">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold" style={{ color: "#D6E4F0" }}>Platform Announcements</h2>
                <p className="text-sm mt-1" style={{ color: "#8FA3B7" }}>Create and manage platform-wide announcements</p>
              </div>
              <Dialog open={isAnnouncementDialogOpen} onOpenChange={setIsAnnouncementDialogOpen}>
                <DialogTrigger asChild>
                  <Button style={{ background: "#4CB3FF", color: "#ffffff" }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
                  <DialogHeader>
                    <DialogTitle style={{ color: "#D6E4F0" }}>Create Announcement</DialogTitle>
                    <DialogDescription style={{ color: "#8FA3B7" }}>
                      Broadcast an announcement to all users
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label style={{ color: "#D6E4F0" }}>Title</Label>
                      <Input
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                        placeholder="Important Update"
                        style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label style={{ color: "#D6E4F0" }}>Content</Label>
                      <Textarea
                        value={announcementContent}
                        onChange={(e) => setAnnouncementContent(e.target.value)}
                        placeholder="Enter announcement content..."
                        rows={4}
                        style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label style={{ color: "#D6E4F0" }}>Type</Label>
                      <Select value={announcementType} onValueChange={(value: any) => setAnnouncementType(value)}>
                        <SelectTrigger style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label style={{ color: "#D6E4F0" }}>Active</Label>
                      <Switch
                        checked={announcementActive}
                        onCheckedChange={setAnnouncementActive}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAnnouncementDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAnnouncement} style={{ background: "#4CB3FF", color: "#ffffff" }}>
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-lg border" style={{ borderColor: "#ffffff15", background: "#0B111A" }}>
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: "#ffffff15" }}>
                    <TableHead style={{ color: "#8FA3B7" }}>Title</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Type</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Status</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Created</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Expires</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcements.map((announcement) => (
                    <TableRow key={announcement.id} style={{ borderColor: "#ffffff15" }}>
                      <TableCell>
                        <div>
                          <p className="font-medium" style={{ color: "#D6E4F0" }}>{announcement.title}</p>
                          <p className="text-xs" style={{ color: "#8FA3B7" }}>{announcement.content}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          announcement.type === 'info' ? 'bg-blue-500/20 text-blue-400' :
                          announcement.type === 'success' ? 'bg-green-500/20 text-green-400' :
                          announcement.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {announcement.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Switch checked={announcement.active} />
                      </TableCell>
                      <TableCell style={{ color: "#D6E4F0" }}>
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell style={{ color: "#D6E4F0" }}>
                        {announcement.expires_at ? new Date(announcement.expires_at).toLocaleDateString() : 'No expiry'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" style={{ color: "#4CB3FF" }}>
                            <Edit className="w-4 h-4" />
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

        {/* Email Campaigns Tab */}
        <TabsContent value="campaigns">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold" style={{ color: "#D6E4F0" }}>Email Campaigns</h2>
                <p className="text-sm mt-1" style={{ color: "#8FA3B7" }}>Create and manage email campaigns</p>
              </div>
              <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
                <DialogTrigger asChild>
                  <Button style={{ background: "#4CB3FF", color: "#ffffff" }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
                  <DialogHeader>
                    <DialogTitle style={{ color: "#D6E4F0" }}>Create Email Campaign</DialogTitle>
                    <DialogDescription style={{ color: "#8FA3B7" }}>
                      Send mass emails to your users
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label style={{ color: "#D6E4F0" }}>Campaign Name</Label>
                      <Input
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="Monthly Newsletter"
                        style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label style={{ color: "#D6E4F0" }}>Email Subject</Label>
                      <Input
                        value={campaignSubject}
                        onChange={(e) => setCampaignSubject(e.target.value)}
                        placeholder="What's New This Month"
                        style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label style={{ color: "#D6E4F0" }}>Email Content</Label>
                      <Textarea
                        value={campaignContent}
                        onChange={(e) => setCampaignContent(e.target.value)}
                        placeholder="Enter email content..."
                        rows={6}
                        style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label style={{ color: "#D6E4F0" }}>Recipients</Label>
                      <Select value={campaignFilter} onValueChange={setCampaignFilter}>
                        <SelectTrigger style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="premium">Premium Users</SelectItem>
                          <SelectItem value="free">Free Users</SelectItem>
                          <SelectItem value="inactive">Inactive Users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCampaignDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCampaign} style={{ background: "#4CB3FF", color: "#ffffff" }}>
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-lg border" style={{ borderColor: "#ffffff15", background: "#0B111A" }}>
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: "#ffffff15" }}>
                    <TableHead style={{ color: "#8FA3B7" }}>Campaign</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Status</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Recipients</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Opened</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Clicked</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Date</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id} style={{ borderColor: "#ffffff15" }}>
                      <TableCell>
                        <div>
                          <p className="font-medium" style={{ color: "#D6E4F0" }}>{campaign.name}</p>
                          <p className="text-xs" style={{ color: "#8FA3B7" }}>{campaign.subject}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          campaign.status === 'sent' ? 'bg-green-500/20 text-green-400' :
                          campaign.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {campaign.status}
                        </span>
                      </TableCell>
                      <TableCell style={{ color: "#D6E4F0" }}>{campaign.recipients}</TableCell>
                      <TableCell style={{ color: "#D6E4F0" }}>
                        {campaign.recipients > 0 ? `${campaign.opened} (${Math.round((campaign.opened / campaign.recipients) * 100)}%)` : '-'}
                      </TableCell>
                      <TableCell style={{ color: "#D6E4F0" }}>
                        {campaign.recipients > 0 ? `${campaign.clicked} (${Math.round((campaign.clicked / campaign.recipients) * 100)}%)` : '-'}
                      </TableCell>
                      <TableCell style={{ color: "#D6E4F0" }}>
                        {campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString() : 
                         campaign.scheduled_at ? new Date(campaign.scheduled_at).toLocaleDateString() : 'Draft'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" style={{ color: "#4CB3FF" }}>
                            <Edit className="w-4 h-4" />
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

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold" style={{ color: "#D6E4F0" }}>In-App Notifications</h2>
                <p className="text-sm mt-1" style={{ color: "#8FA3B7" }}>Send notifications to users</p>
              </div>
              <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
                <DialogTrigger asChild>
                  <Button style={{ background: "#4CB3FF", color: "#ffffff" }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Send Notification
                  </Button>
                </DialogTrigger>
                <DialogContent style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
                  <DialogHeader>
                    <DialogTitle style={{ color: "#D6E4F0" }}>Send Notification</DialogTitle>
                    <DialogDescription style={{ color: "#8FA3B7" }}>
                      Push a notification to selected users
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label style={{ color: "#D6E4F0" }}>Title</Label>
                      <Input
                        value={notificationTitle}
                        onChange={(e) => setNotificationTitle(e.target.value)}
                        placeholder="Notification title"
                        style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label style={{ color: "#D6E4F0" }}>Message</Label>
                      <Textarea
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)}
                        placeholder="Enter notification message..."
                        rows={3}
                        style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label style={{ color: "#D6E4F0" }}>Type</Label>
                      <Select value={notificationType} onValueChange={(value: any) => setNotificationType(value)}>
                        <SelectTrigger style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label style={{ color: "#D6E4F0" }}>Recipients</Label>
                      <Select value={notificationRecipients} onValueChange={setNotificationRecipients}>
                        <SelectTrigger style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="premium">Premium Users</SelectItem>
                          <SelectItem value="free">Free Users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSendNotification} style={{ background: "#4CB3FF", color: "#ffffff" }}>
                      Send
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-lg border" style={{ borderColor: "#ffffff15", background: "#0B111A" }}>
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: "#ffffff15" }}>
                    <TableHead style={{ color: "#8FA3B7" }}>Title</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Type</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Recipients</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Read Rate</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Sent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.id} style={{ borderColor: "#ffffff15" }}>
                      <TableCell>
                        <div>
                          <p className="font-medium" style={{ color: "#D6E4F0" }}>{notification.title}</p>
                          <p className="text-xs" style={{ color: "#8FA3B7" }}>{notification.message}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          notification.type === 'info' ? 'bg-blue-500/20 text-blue-400' :
                          notification.type === 'success' ? 'bg-green-500/20 text-green-400' :
                          notification.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {notification.type}
                        </span>
                      </TableCell>
                      <TableCell style={{ color: "#D6E4F0" }}>{notification.recipients}</TableCell>
                      <TableCell style={{ color: "#D6E4F0" }}>
                        {notification.total_count > 0 
                          ? `${notification.read_count}/${notification.total_count} (${Math.round((notification.read_count / notification.total_count) * 100)}%)`
                          : '-'}
                      </TableCell>
                      <TableCell style={{ color: "#D6E4F0" }}>
                        {new Date(notification.sent_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Support Tickets Tab */}
        <TabsContent value="tickets">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold" style={{ color: "#D6E4F0" }}>Support Tickets</h2>
                <p className="text-sm mt-1" style={{ color: "#8FA3B7" }}>Manage user support requests</p>
              </div>
            </div>

            <div className="rounded-lg border" style={{ borderColor: "#ffffff15", background: "#0B111A" }}>
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: "#ffffff15" }}>
                    <TableHead style={{ color: "#8FA3B7" }}>User</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Subject</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Priority</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Status</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Created</TableHead>
                    <TableHead style={{ color: "#8FA3B7" }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id} style={{ borderColor: "#ffffff15" }}>
                      <TableCell>
                        <div>
                          <p className="font-medium" style={{ color: "#D6E4F0" }}>{ticket.user_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium" style={{ color: "#D6E4F0" }}>{ticket.subject}</p>
                          <p className="text-xs" style={{ color: "#8FA3B7" }}>{ticket.message.substring(0, 60)}...</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          ticket.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                          ticket.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {ticket.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          ticket.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                          ticket.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                          ticket.status === 'closed' ? 'bg-gray-500/20 text-gray-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {ticket.status === 'in_progress' ? 'In Progress' : ticket.status}
                        </span>
                      </TableCell>
                      <TableCell style={{ color: "#D6E4F0" }}>
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" style={{ color: "#4CB3FF" }}>
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" style={{ color: "#10B981" }}>
                            <Check className="w-4 h-4" />
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
      </Tabs>
    </div>
  );
};

export default AdminCommunication;
