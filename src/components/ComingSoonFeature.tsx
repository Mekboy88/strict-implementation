import { LucideIcon } from "lucide-react";

interface ComingSoonFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  color: string;
  status?: string;
}

const ComingSoonFeature = ({ 
  icon: Icon, 
  title, 
  description, 
  features, 
  color,
  status = "Coming Soon"
}: ComingSoonFeatureProps) => {
  return (
    <div className="h-full flex items-center justify-center bg-ide-editor p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className={`inline-flex p-6 rounded-2xl ${color} mb-6 animate-pulse`}>
            <Icon className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">{title}</h1>
          <p className="text-lg text-muted-foreground mb-4">{description}</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ide-active/10 border border-ide-active/30 rounded-full">
            <div className="w-2 h-2 rounded-full bg-ide-active/70 animate-pulse" />
            <span className="text-sm font-semibold text-ide-active/90">{status}</span>
          </div>
        </div>

        <div className="bg-ide-panel border border-ide-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Planned Features</h3>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-ide-active/10 border border-ide-active/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-ide-active/70" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 p-4 bg-ide-panel/50 border border-ide-border rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            This feature requires backend integration and will be enabled in a future update. 
            The UI is ready and waiting for server-side functionality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonFeature;
