import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminProjects from "./pages/AdminProjects";
import AdminRoles from "./pages/AdminRoles";
import AdminSettings from "./pages/AdminSettings";
import AdminSecurity from "./pages/AdminSecurity";
import AdminSystemMonitoring from "./pages/AdminSystemMonitoring";
import AdminCommunication from "./pages/AdminCommunication";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminAdvanced from "./pages/AdminAdvanced";
import Index from "./pages/Index";
import { GitHubCallback } from "./pages/GitHubCallback";
import NotFound from "./pages/NotFound";
import LiveCollaboration from "./pages/LiveCollaboration";
import RealTerminal from "./pages/RealTerminal";
import BuildTools from "./pages/BuildTools";
import DatabaseManagement from "./pages/DatabaseManagement";
import RemoteSync from "./pages/RemoteSync";
import TeamChat from "./pages/TeamChat";
import CloudSandbox from "./pages/CloudSandbox";
import AccountSettings from "./pages/AccountSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="security" element={<AdminSecurity />} />
            <Route path="system-monitoring" element={<AdminSystemMonitoring />} />
            <Route path="communication" element={<AdminCommunication />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="advanced" element={<AdminAdvanced />} />
          </Route>
          <Route path="/editor" element={<Index />} />
          <Route path="/live-collaboration" element={<LiveCollaboration />} />
          <Route path="/terminal" element={<RealTerminal />} />
          <Route path="/build-tools" element={<BuildTools />} />
          <Route path="/database" element={<DatabaseManagement />} />
          <Route path="/remote-sync" element={<RemoteSync />} />
          <Route path="/team-chat" element={<TeamChat />} />
          <Route path="/cloud-sandbox" element={<CloudSandbox />} />
          <Route path="/settings" element={<AccountSettings />} />
          <Route path="/auth/callback/github" element={<GitHubCallback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
