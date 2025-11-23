import { Users } from "lucide-react";
import ComingSoonFeature from "@/components/ComingSoonFeature";

const LiveCollaboration = () => {
  return (
    <ComingSoonFeature
      icon={Users}
      title="Live Collaboration"
      description="Real-time collaborative coding with your team"
      color="bg-blue-950/40 border-2 border-blue-500/30"
      features={[
        "Real-time cursor tracking and presence indicators",
        "Live code editing with conflict resolution",
        "Voice and video chat integration",
        "Collaborative debugging sessions",
        "Shared terminal access",
        "Comment and annotation system",
        "Project permission management",
      ]}
    />
  );
};

export default LiveCollaboration;
