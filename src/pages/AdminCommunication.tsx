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
        <h1 className="text-3xl font-bold text-white">
          Content & Communication
        </h1>
        <p className="text-sm mt-2 text-white">
          Manage announcements, emails, notifications, and support tickets
        </p>
      </div>

      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="mb-6 bg-neutral-700 border border-neutral-600">
          <TabsTrigger value="announcements" className="text-white data-[state=active]:bg-neutral-600">
            <Megaphone className="w-4 h-4 mr-2" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="text-white data-[state=active]:bg-neutral-600">
            <Send className="w-4 h-4 mr-2" />
            Email Campaigns
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-neutral-600">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="tickets" className="text-white data-[state=active]:bg-neutral-600">
            <Ticket className="w-4 h-4 mr-2" />
            Support Tickets
          </TabsTrigger>
        </TabsList>

        {/* Announcements Tab */}
        <TabsContent value="announcements">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Platform Announcements</h2>
                <p className="text-sm mt-1 text-white">Create and manage platform-wide announcements</p>
              </div>
              <Dialog open={isAnnouncementDialogOpen} onOpenChange={setIsAnnouncementDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-700 border-neutral-600">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create Announcement</DialogTitle>
                    <DialogDescription className="text-white">
                      Broadcast an announcement to all users
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Title</Label>
                      <Input
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                        placeholder="Important Update"
                        className="bg-neutral-600 border-neutral-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Content</Label>
                      <Textarea
                        value={announcementContent}
                        onChange={(e) => setAnnouncementContent(e.target.value)}
                        placeholder="Enter announcement content..."
                        rows={4}
                        className="bg-neutral-600 border-neutral-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Type</Label>
                      <Select value={announcementType} onValueChange={(value: any) => setAnnouncementType(value)}>
                        <SelectTrigger className="bg-neutral-600 border-neutral-500 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-700 border-neutral-600">
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Active</Label>
                      <Switch
                        checked={announcementActive}
                        onCheckedChange={setAnnouncementActive}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAnnouncementDialogOpen(false)} className="border-neutral-500 text-white hover:bg-neutral-600">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAnnouncement} className="bg-blue-500 hover:bg-blue-600 text-white">
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-lg border border-neutral-600 bg-neutral-700">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-600">
                    <TableHead className="text-white">Title</TableHead>
                    <TableHead className="text-white">Type</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Created</TableHead>
                    <TableHead className="text-white">Expires</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcements.map((announcement) => (
                    <TableRow key={announcement.id} className="border-neutral-600">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{announcement.title}</p>
                          <p className="text-xs text-white">{announcement.content}</p>
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
                      <TableCell className="text-white">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-white">
                        {announcement.expires_at ? new Date(announcement.expires_at).toLocaleDateString() : 'No expiry'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-neutral-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-neutral-600">
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
                <h2 className="text-xl font-semibold text-white">Email Campaigns</h2>
                <p className="text-sm mt-1 text-white">Create and manage email campaigns</p>
              </div>
              <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-700 border-neutral-600">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create Email Campaign</DialogTitle>
                    <DialogDescription className="text-white">
                      Send mass emails to your users
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Campaign Name</Label>
                      <Input
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="Monthly Newsletter"
                        className="bg-neutral-600 border-neutral-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Email Subject</Label>
                      <Input
                        value={campaignSubject}
                        onChange={(e) => setCampaignSubject(e.target.value)}
                        placeholder="What's New This Month"
                        className="bg-neutral-600 border-neutral-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Email Content</Label>
                      <Textarea
                        value={campaignContent}
                        onChange={(e) => setCampaignContent(e.target.value)}
                        placeholder="Enter email content..."
                        rows={6}
                        className="bg-neutral-600 border-neutral-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Recipients</Label>
                      <Select value={campaignFilter} onValueChange={setCampaignFilter}>
                        <SelectTrigger className="bg-neutral-600 border-neutral-500 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-700 border-neutral-600">
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="premium">Premium Users</SelectItem>
                          <SelectItem value="free">Free Users</SelectItem>
                          <SelectItem value="inactive">Inactive Users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCampaignDialogOpen(false)} className="border-neutral-500 text-white hover:bg-neutral-600">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCampaign} className="bg-blue-500 hover:bg-blue-600 text-white">
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-lg border border-neutral-600 bg-neutral-700">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-600">
                    <TableHead className="text-white">Campaign</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Recipients</TableHead>
                    <TableHead className="text-white">Opened</TableHead>
                    <TableHead className="text-white">Clicked</TableHead>
                    <TableHead className="text-white">Date</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id} className="border-neutral-600">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{campaign.name}</p>
                          <p className="text-xs text-white">{campaign.subject}</p>
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
                      <TableCell className="text-white">{campaign.recipients}</TableCell>
                      <TableCell className="text-white">
                        {campaign.recipients > 0 ? `${campaign.opened} (${Math.round((campaign.opened / campaign.recipients) * 100)}%)` : '-'}
                      </TableCell>
                      <TableCell className="text-white">
                        {campaign.recipients > 0 ? `${campaign.clicked} (${Math.round((campaign.clicked / campaign.recipients) * 100)}%)` : '-'}
                      </TableCell>
                      <TableCell className="text-white">
                        {campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString() : 
                         campaign.scheduled_at ? new Date(campaign.scheduled_at).toLocaleDateString() : 'Draft'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-neutral-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-neutral-600">
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
                <h2 className="text-xl font-semibold text-white">In-App Notifications</h2>
                <p className="text-sm mt-1 text-white">Send notifications to users</p>
              </div>
              <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Send Notification
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-700 border-neutral-600">
                  <DialogHeader>
                    <DialogTitle className="text-white">Send Notification</DialogTitle>
                    <DialogDescription className="text-white">
                      Push a notification to selected users
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Title</Label>
                      <Input
                        value={notificationTitle}
                        onChange={(e) => setNotificationTitle(e.target.value)}
                        placeholder="Notification title"
                        className="bg-neutral-600 border-neutral-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Message</Label>
                      <Textarea
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)}
                        placeholder="Enter notification message..."
                        rows={3}
                        className="bg-neutral-600 border-neutral-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Type</Label>
                      <Select value={notificationType} onValueChange={(value: any) => setNotificationType(value)}>
                        <SelectTrigger className="bg-neutral-600 border-neutral-500 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-700 border-neutral-600">
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Recipients</Label>
                      <Select value={notificationRecipients} onValueChange={setNotificationRecipients}>
                        <SelectTrigger className="bg-neutral-600 border-neutral-500 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-700 border-neutral-600">
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="premium">Premium Users</SelectItem>
                          <SelectItem value="free">Free Users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNotificationDialogOpen(false)} className="border-neutral-500 text-white hover:bg-neutral-600">
                      Cancel
                    </Button>
                    <Button onClick={handleSendNotification} className="bg-blue-500 hover:bg-blue-600 text-white">
                      Send
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-lg border border-neutral-600 bg-neutral-700">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-600">
                    <TableHead className="text-white">Title</TableHead>
                    <TableHead className="text-white">Type</TableHead>
                    <TableHead className="text-white">Recipients</TableHead>
                    <TableHead className="text-white">Read Rate</TableHead>
                    <TableHead className="text-white">Sent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.id} className="border-neutral-600">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{notification.title}</p>
                          <p className="text-xs text-white">{notification.message}</p>
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
                      <TableCell className="text-white">{notification.recipients}</TableCell>
                      <TableCell className="text-white">
                        {notification.total_count > 0 
                          ? `${notification.read_count}/${notification.total_count} (${Math.round((notification.read_count / notification.total_count) * 100)}%)`
                          : '-'}
                      </TableCell>
                      <TableCell className="text-white">
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
                <h2 className="text-xl font-semibold text-white">Support Tickets</h2>
                <p className="text-sm mt-1 text-white">Manage user support requests</p>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-600 bg-neutral-700">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-600">
                    <TableHead className="text-white">User</TableHead>
                    <TableHead className="text-white">Subject</TableHead>
                    <TableHead className="text-white">Priority</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Created</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id} className="border-neutral-600">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{ticket.user_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{ticket.subject}</p>
                          <p className="text-xs text-white">{ticket.message.substring(0, 60)}...</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          ticket.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                          ticket.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {ticket.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          ticket.status === 'open' ? 'bg-blue-500/20 text-blue-400' :
                          ticket.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                          ticket.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="text-white">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-neutral-600">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-neutral-600">
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
