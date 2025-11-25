import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectVariantType } from "@/services/projects/supabaseProjectService";

interface ProjectVariantSwitcherProps {
  activeVariant: ProjectVariantType;
  onVariantChange: (variant: ProjectVariantType) => void;
  webProjectName?: string;
  mobileProjectName?: string;
  hasWebProject?: boolean;
  hasMobileProject?: boolean;
  className?: string;
}

export function ProjectVariantSwitcher({
  activeVariant,
  onVariantChange,
  webProjectName,
  mobileProjectName,
  hasWebProject = true,
  hasMobileProject = true,
  className,
}: ProjectVariantSwitcherProps) {
  return (
    <div className={cn("flex items-center gap-1 rounded-lg bg-white/5 p-1", className)}>
      <button
        type="button"
        onClick={() => hasWebProject && onVariantChange('web')}
        disabled={!hasWebProject}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-1.5 text-[11px] font-medium transition-all",
          activeVariant === 'web'
            ? "bg-white/10 text-white"
            : "text-slate-400 hover:text-white hover:bg-white/5",
          !hasWebProject && "opacity-40 cursor-not-allowed"
        )}
        title={webProjectName || "Web Version"}
      >
        <Monitor className="h-3.5 w-3.5" />
        <span>Web</span>
      </button>
      
      <button
        type="button"
        onClick={() => hasMobileProject && onVariantChange('mobile')}
        disabled={!hasMobileProject}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-1.5 text-[11px] font-medium transition-all",
          activeVariant === 'mobile'
            ? "bg-white/10 text-white"
            : "text-slate-400 hover:text-white hover:bg-white/5",
          !hasMobileProject && "opacity-40 cursor-not-allowed"
        )}
        title={mobileProjectName || "Mobile Version"}
      >
        <Smartphone className="h-3.5 w-3.5" />
        <span>Mobile</span>
      </button>
    </div>
  );
}
