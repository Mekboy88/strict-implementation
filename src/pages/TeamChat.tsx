import { MessageCircle } from "lucide-react";
import ComingSoonFeature from "@/components/ComingSoonFeature";

const TeamChat = () => {
  return (
    <ComingSoonFeature
      icon={MessageCircle}
      title="Team Chat with AI"
      description="Integrated communication with AI-powered assistance"
      color="bg-pink-950/40 border-2 border-pink-500/30"
      features={[
        "Real-time team messaging",
        "AI assistant in every conversation",
        "Code snippet sharing and highlighting",
        "Thread-based discussions",
        "File and screenshot sharing",
        "Voice/video call integration",
        "Smart notifications and mentions",
      ]}
    />
  );
};

export default TeamChat;
