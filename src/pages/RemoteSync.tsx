import { Cloud } from "lucide-react";
import ComingSoonFeature from "@/components/ComingSoonFeature";

const RemoteSync = () => {
  return (
    <ComingSoonFeature
      icon={Cloud}
      title="Remote Project Sync"
      description="Seamless synchronization across devices and teams"
      color="bg-cyan-950/40 border-2 border-cyan-500/30"
      features={[
        "Automatic project backup to cloud",
        "Multi-device synchronization",
        "Version history and rollback",
        "Conflict resolution system",
        "Offline mode with auto-sync",
        "GitHub/GitLab integration",
        "Team workspace sharing",
      ]}
    />
  );
};

export default RemoteSync;
