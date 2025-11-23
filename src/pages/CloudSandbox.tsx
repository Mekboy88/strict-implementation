import { Server } from "lucide-react";
import ComingSoonFeature from "@/components/ComingSoonFeature";

const CloudSandbox = () => {
  return (
    <ComingSoonFeature
      icon={Server}
      title="Cloud Sandbox Environments"
      description="Isolated development environments in the cloud"
      color="bg-orange-950/40 border-2 border-orange-500/30"
      features={[
        "Instant environment provisioning",
        "Custom runtime configurations",
        "Resource scaling on demand",
        "Environment templates and presets",
        "Secure isolation and sandboxing",
        "Network and port management",
        "Environment sharing and cloning",
      ]}
    />
  );
};

export default CloudSandbox;
