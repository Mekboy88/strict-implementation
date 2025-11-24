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
        .select("github_username")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setConnected(true);
        setUsername(data.github_username);
      }
    } catch (error) {
      console.error("Error checking GitHub connection:", error);
    }
  };

  const handleConnect = () => {
    const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback/github`;
    const scope = "repo user";
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}`;
    
    const popup = window.open(githubAuthUrl, 'github-oauth', 'width=600,height=700,left=200,top=100');
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'github-oauth-success') {
        console.log('GitHub OAuth completed successfully');
        setConnected(true);
        setUsername(event.data.username);
        window.removeEventListener('message', handleMessage);
        toast.success(`Connected to GitHub as ${event.data.username}`);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
      }
    }, 1000);
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
          ? { username, avatarUrl: undefined }
          : undefined
      }
      connectedRepo={undefined}
    />
  );
};
