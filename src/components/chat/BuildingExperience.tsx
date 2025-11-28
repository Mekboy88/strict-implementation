import { Loader2, Check, FileCode2 } from "lucide-react";

interface BuildingExperienceProps {
  isBuilding: boolean;
  currentPhase: 'reasoning' | 'analyzing' | 'generating' | 'applying';
  files?: { name: string; status: 'pending' | 'processing' | 'done' }[];
  explanation?: string;
}

export const BuildingExperience = ({ 
  isBuilding, 
  currentPhase, 
  files = [], 
  explanation 
}: BuildingExperienceProps) => {
  if (!isBuilding) return null;
  
  const phaseConfig = {
    reasoning: { icon: '🧠', label: 'Reasoning...', color: 'sky' },
    analyzing: { icon: '🔍', label: 'Analyzing codebase...', color: 'sky' },
    generating: { icon: '⚡', label: 'Generating code...', color: 'violet' },
    applying: { icon: '✨', label: 'Applying changes...', color: 'emerald' }
  };
  
  const phase = phaseConfig[currentPhase];
  
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Reasoning Shimmer */}
      <div className={`flex items-center gap-3 bg-gradient-to-r from-${phase.color}-500/10 to-transparent rounded-xl px-4 py-3 border border-${phase.color}-500/20`}>
        <div className={`w-2 h-2 bg-${phase.color}-400 rounded-full animate-pulse`} />
        <span className={`text-sm text-${phase.color}-300 font-medium`}>
          {phase.icon} {phase.label}
        </span>
      </div>
      
      {/* Academic Explanation */}
      {explanation && (
        <div className="bg-neutral-800/50 rounded-xl p-4 border border-white/5">
          <p className="text-sm text-slate-300 leading-relaxed">{explanation}</p>
        </div>
      )}
      
      {/* File Processing Animations */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div 
              key={i} 
              className={`
                flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300
                ${file.status === 'processing' ? 'bg-sky-500/10 animate-pulse border border-sky-500/20' : 
                  file.status === 'done' ? 'bg-emerald-500/10 border border-emerald-500/20' : 
                  'bg-neutral-800/30 border border-white/5'}
              `}
            >
              <FileCode2 className={`h-4 w-4 ${
                file.status === 'done' ? 'text-emerald-400' : 
                file.status === 'processing' ? 'text-sky-400' : 'text-slate-400'
              }`} />
              <span className="text-sm text-slate-200 flex-1">{file.name}</span>
              {file.status === 'processing' && (
                <Loader2 className="h-3 w-3 text-sky-400 animate-spin ml-auto" />
              )}
              {file.status === 'done' && (
                <Check className="h-3 w-3 text-emerald-400 ml-auto" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
