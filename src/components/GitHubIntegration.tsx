import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Github, Check, X } from "lucide-react";

interface GitHubIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export const GitHubIntegration = ({ isOpen, onClose, buttonRef }: GitHubIntegrationProps) => {
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        ref={popupRef}
        className="w-[420px] bg-[#0B0B0C] border border-white/10 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.7)] p-6 animate-in fade-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <Github className="w-6 h-6" />
          <h3 className="text-lg font-semibold text-white">GitHub Integration</h3>
        </div>

        {connected ? (
          <>
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg mb-6">
              <Check className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm font-medium text-white">Connected as {username}</p>
                <p className="text-xs text-gray-400">Your GitHub account is linked</p>
              </div>
            </div>
            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10"
            >
              <X className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-6">
              Connect your GitHub account to sync repositories and enable version control.
            </p>
            <Button
              onClick={handleConnect}
              disabled={loading}
              className="w-full bg-white text-black hover:bg-gray-100"
            >
              <Github className="w-4 h-4 mr-2" />
              {loading ? "Connecting..." : "Connect GitHub"}
            </Button>
          </>
        )}

        <Button
          onClick={onClose}
          variant="ghost"
          className="w-full mt-3 text-gray-400 hover:text-white hover:bg-white/5"
        >
          Close
        </Button>
      </div>
    </div>
  );
};
