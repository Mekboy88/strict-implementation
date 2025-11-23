import { Package } from "lucide-react";
import ComingSoonFeature from "@/components/ComingSoonFeature";

const BuildTools = () => {
  return (
    <ComingSoonFeature
      icon={Package}
      title="Project Packaging & Build"
      description="Professional build pipelines and deployment tools"
      color="bg-purple-950/40 border-2 border-purple-500/30"
      features={[
        "Automated build pipeline configuration",
        "Docker container generation",
        "Production optimization and minification",
        "Environment-specific builds",
        "Custom build scripts and hooks",
        "Asset bundling and compression",
        "CI/CD integration ready",
      ]}
    />
  );
};

export default BuildTools;
