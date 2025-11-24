import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Bell, Lock, Palette, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AccountSettings = () => {
  const navigate = useNavigate();
  
  // Profile Settings
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [username, setUsername] = useState("johndoe");
  const [bio, setBio] = useState("");

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  // Appearance Settings
  const [darkMode, setDarkMode] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/editor")}
              className="text-slate-300 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Account Settings</h1>
              <p className="text-sm text-slate-400">Manage your account preferences</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-white/10">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-primary">
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-primary">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-slate-950/50 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-950/50 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-slate-950/50 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    className="bg-slate-950/50 border-white/10"
                  />
                </div>
                <Separator className="bg-white/10" />
                <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-slate-400">Receive notifications via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-slate-400">Receive push notifications in browser</p>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Project Updates</Label>
                    <p className="text-sm text-slate-400">Get notified about project changes</p>
                  </div>
                  <Switch checked={projectUpdates} onCheckedChange={setProjectUpdates} />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-slate-400">Important security notifications</p>
                  </div>
                  <Switch checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    className="bg-slate-950/50 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="bg-slate-950/50 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="bg-slate-950/50 border-white/10"
                  />
                </div>
                <Separator className="bg-white/10" />
                <Button className="bg-primary hover:bg-primary/90">Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the editor looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-slate-400">Use dark theme across the platform</p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-slate-400">Reduce spacing for more content</p>
                  </div>
                  <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>Manage your subscription and payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-slate-950/50 border border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">Free Plan</h3>
                      <p className="text-sm text-slate-400">Limited features and usage</p>
                    </div>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                      Upgrade Plan
                    </Button>
                  </div>
                </div>
                <Separator className="bg-white/10" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Payment Methods</h3>
                  <p className="text-sm text-slate-400">No payment methods added yet</p>
                  <Button variant="outline" className="mt-4 border-white/10">
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AccountSettings;
