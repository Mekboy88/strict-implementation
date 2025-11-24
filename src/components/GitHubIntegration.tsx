import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import UrDevGithubModal from "./UrDevGithubModal";

interface GitHubIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export const GitHubIntegration = ({ isOpen, onClose }: GitHubIntegrationProps) => {
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkConnection();
      console.log("GitHub popup opened");
    }
  }, [isOpen]);

  const checkConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("github_connections")
        .select("github_username, github_token")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setConnected(true);
        setUsername(data.github_username);
        
        // Fetch GitHub user details for avatar
        try {
          const response = await fetch(`https://api.github.com/user`, {
            headers: {
              Authorization: `Bearer ${data.github_token}`,
              Accept: 'application/vnd.github.v3+json',
            },
          });
          
          if (response.ok) {
            const githubUser = await response.json();
            setAvatarUrl(githubUser.avatar_url);
          }
        } catch (err) {
          console.error("Error fetching GitHub user details:", err);
        }
      }
    } catch (error) {
      console.error("Error checking GitHub connection:", error);
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      const redirectUri = `${window.location.origin}/auth/callback/github`;
      const scope = "repo user";
      
      // Call edge function to get GitHub client ID
      const { data: configData, error: configError } = await supabase.functions.invoke('github-config');
      
      if (configError) {
        toast.error("Failed to initialize GitHub connection");
        setLoading(false);
        return;
      }
      
      const clientId = configData.clientId;
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
      
      const popup = window.open(githubAuthUrl, 'github-oauth', 'width=600,height=700,left=200,top=100');
      
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'github-oauth-success') {
          console.log('GitHub OAuth completed successfully');
          setConnected(true);
          setUsername(event.data.username);
          window.removeEventListener('message', handleMessage);
          toast.success(`Connected to GitHub as ${event.data.username}`);
          setLoading(false);
        } else if (event.data.type === 'github-oauth-error') {
          toast.error(event.data.message || "Failed to connect to GitHub");
          setLoading(false);
        }
      };
      
      window.addEventListener('message', handleMessage);
      
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          setLoading(false);
        }
      }, 1000);
    } catch (error) {
      console.error("Error connecting to GitHub:", error);
      toast.error("Failed to connect to GitHub");
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("github_connections")
        .delete()
        .eq("user_id", user.id);

      setConnected(false);
      setUsername(null);
      toast.success("Disconnected from GitHub");
    } catch (error) {
      console.error("Error disconnecting GitHub:", error);
      toast.error("Failed to disconnect");
    }
  };

  return (
    <UrDevGithubModal
      isOpen={isOpen}
      onClose={onClose}
      connectedAccount={
        connected && username
          ? { username, avatarUrl }
          : undefined
      }
      connectedRepo={undefined}
      onConnect={handleConnect}
    />
  );
};
