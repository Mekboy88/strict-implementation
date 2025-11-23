import { 
  Users, 
  Terminal, 
  Package, 
  Database, 
  Cloud, 
  MessageCircle, 
  Server,
  Zap
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  route: string;
}

const features: Feature[] = [
  {
    id: "collab",
    name: "Live Collaboration",
    description: "Real-time collaborative coding",
    icon: Users,
    color: "text-blue-400 bg-blue-950/30",
    route: "/live-collaboration",
  },
  {
    id: "terminal",
    name: "Real Terminal",
    description: "Execute commands in sandbox",
    icon: Terminal,
    color: "text-ide-active/90 bg-ide-active/10",
    route: "/terminal",
  },
  {
    id: "build",
    name: "Build Tools",
    description: "Project packaging & deployment",
    icon: Package,
    color: "text-purple-400 bg-purple-950/30",
    route: "/build-tools",
  },
  {
    id: "database",
    name: "Supabase",
    description: "Backend & database integration",
    icon: Database,
    color: "text-ide-active/90 bg-ide-active/10",
    route: "/database",
  },
  {
    id: "sync",
    name: "Remote Sync",
    description: "Cloud synchronization",
    icon: Cloud,
    color: "text-cyan-400 bg-cyan-950/30",
    route: "/remote-sync",
  },
  {
    id: "chat",
    name: "Team Chat",
    description: "Chat with AI assistance",
    icon: MessageCircle,
    color: "text-pink-400 bg-pink-950/30",
    route: "/team-chat",
  },
  {
    id: "sandbox",
    name: "Cloud Sandbox",
    description: "Isolated dev environments",
    icon: Server,
    color: "text-orange-400 bg-orange-950/30",
    route: "/cloud-sandbox",
  },
];

const FutureFeatures = () => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors hover:bg-ide-hover border border-transparent hover:border-ide-active/30 group">
          <Zap className="w-4 h-4 text-muted-foreground group-hover:text-ide-active transition-colors" />
          <span className="text-muted-foreground group-hover:text-foreground">Future</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-96 bg-ide-panel border-ide-border overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-ide-active" />
            Future Features
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Exciting features coming soon to UR-DEV
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => navigate(feature.route)}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border border-ide-border hover:border-ide-active/30 transition-all ${feature.color}`}
              >
                <div className="p-2 rounded-lg bg-ide-panel">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-foreground">{feature.name}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FutureFeatures;
