import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const GitHubCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Processing GitHub connection...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (!code) {
          throw new Error("No authorization code received");
        }

        setStatus("Exchanging authorization code...");

        // Call edge function to exchange code for token
        const { data, error } = await supabase.functions.invoke("github-oauth-callback", {
          body: { code },
        });

        if (error) throw error;

        if (data.success) {
          setStatus("Connected successfully!");
          
          // Send message to parent window if this is a popup
          if (window.opener) {
            window.opener.postMessage({
              type: 'github-oauth-success',
              username: data.username
            }, window.location.origin);
            
            // Close popup after short delay
            setTimeout(() => {
              window.close();
            }, 1000);
          } else {
            // If not a popup, navigate normally
            toast.success(`Connected to GitHub as ${data.username}`);
            navigate("/editor");
          }
        } else {
          throw new Error("Failed to connect to GitHub");
        }
      } catch (error) {
        console.error("GitHub callback error:", error);
        toast.error("Failed to connect to GitHub");
        
        if (window.opener) {
          setTimeout(() => {
            window.close();
          }, 2000);
        } else {
          navigate("/editor");
        }
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
      <p className="text-lg text-foreground">{status}</p>
      <p className="text-sm text-muted-foreground mt-2">Please wait...</p>
    </div>
  );
};