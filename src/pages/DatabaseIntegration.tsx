import { Database } from "lucide-react";
import ComingSoonFeature from "@/components/ComingSoonFeature";

const DatabaseIntegration = () => {
  return (
    <ComingSoonFeature
      icon={Database}
      title="Supabase Integration"
      description="Powerful backend with database, auth, and storage"
      color="bg-green-950/40 border-2 border-green-500/30"
      features={[
        "PostgreSQL database with GUI editor",
        "Row Level Security (RLS) policy management",
        "Built-in authentication system",
        "File storage and CDN",
        "Real-time subscriptions",
        "Edge functions deployment",
        "Database migrations and backups",
      ]}
    />
  );
};

export default DatabaseIntegration;
