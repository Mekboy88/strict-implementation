import { Brain, Search, Zap, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface StreamingBuildIndicatorProps {
  phase: 'idle' | 'reasoning' | 'analyzing' | 'generating' | 'applying' | 'complete' | 'error';
  elapsedTime: number;
  filesCount: number;
}

const phaseConfig = {
  reasoning: {
    icon: Brain,
    label: 'Reasoning',
    color: 'from-sky-500/30 to-violet-500/30',
    textColor: 'text-sky-400',
    borderColor: 'border-sky-500/30',
  },
  analyzing: {
    icon: Search,
    label: 'Analyzing',
    color: 'from-violet-500/30 to-purple-500/30',
    textColor: 'text-violet-400',
    borderColor: 'border-violet-500/30',
  },
  generating: {
    icon: Zap,
    label: 'Generating Code',
    color: 'from-amber-500/30 to-orange-500/30',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
  },
  applying: {
    icon: Sparkles,
    label: 'Applying Changes',
    color: 'from-emerald-500/30 to-green-500/30',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
  },
  complete: {
    icon: CheckCircle2,
    label: 'Complete',
    color: 'from-green-500/30 to-emerald-500/30',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/30',
  },
  error: {
    icon: AlertCircle,
    label: 'Error',
    color: 'from-red-500/30 to-rose-500/30',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
  },
  idle: {
    icon: Brain,
    label: 'Idle',
    color: 'from-slate-500/30 to-slate-500/30',
    textColor: 'text-slate-400',
    borderColor: 'border-slate-500/30',
  },
};

export const StreamingBuildIndicator = ({ phase, elapsedTime, filesCount }: StreamingBuildIndicatorProps) => {
  const [progress, setProgress] = useState(0);
  const config = phaseConfig[phase];
  const Icon = config.icon;

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (phase === 'complete') return 100;
        if (prev >= 90) return prev;
        return prev + Math.random() * 5;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase === 'complete') {
      setProgress(100);
    }
  }, [phase]);

  return (
    <div className={`rounded-xl border ${config.borderColor} bg-gradient-to-r ${config.color} p-4 backdrop-blur-sm animate-fade-in`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.textColor} animate-pulse`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className={`font-semibold ${config.textColor}`}>{config.label}</h3>
            <p className="text-xs text-slate-400">
              {filesCount > 0 ? `${filesCount} file${filesCount !== 1 ? 's' : ''}` : 'Processing'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">{elapsedTime}s</p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${config.color} transition-all duration-500 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
