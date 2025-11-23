import { Terminal } from "lucide-react";
import ComingSoonFeature from "@/components/ComingSoonFeature";

const RealTerminal = () => {
  return (
    <ComingSoonFeature
      icon={Terminal}
      title="Real Terminal Execution"
      description="Execute commands in a real sandboxed environment"
      color="bg-emerald-950/40 border-2 border-emerald-500/30"
      features={[
        "Full terminal access with bash/zsh support",
        "Package manager integration (npm, yarn, pip)",
        "Git operations and version control",
        "Environment variable management",
        "Process monitoring and logs",
        "Secure sandboxed execution",
        "Terminal session persistence",
      ]}
    />
  );
};

export default RealTerminal;
