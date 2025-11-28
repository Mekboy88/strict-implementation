import { useState, useEffect } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

interface CompletionCardProps {
  projectName: string;
}

export const CompletionCard = ({ projectName }: CompletionCardProps) => {
  const [stage, setStage] = useState<'initial' | 'saving' | 'complete'>('initial');

  useEffect(() => {
    // Start in grey (initial)
    const savingTimer = setTimeout(() => {
      setStage('saving');
    }, 800);

    // Then transition to blue (complete)
    const completeTimer = setTimeout(() => {
      setStage('complete');
    }, 2500);

    return () => {
      clearTimeout(savingTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  const borderColor = stage === 'complete' ? 'border-blue-400/30' : 'border-gray-500/20';
  const bgGradient = stage === 'complete' 
    ? 'from-blue-500/[0.08] via-blue-400/[0.05] to-blue-900/[0.03]' 
    : 'from-gray-500/[0.05] via-gray-400/[0.03] to-gray-800/[0.02]';
  const dotBg = stage === 'complete' ? 'bg-blue-400/60' : 'bg-gray-400/60';
  const textColor = stage === 'complete' ? 'text-blue-50' : 'text-gray-300';
  const subtextColor = stage === 'complete' ? 'text-blue-100/70' : 'text-gray-400/60';

  return (
    <div className={`inline-flex items-start gap-3 rounded-2xl px-6 py-3 border ${borderColor} bg-gradient-to-br ${bgGradient} backdrop-blur-sm transition-all duration-700`}>
      <div className={`w-2 h-2 rounded-full ${dotBg} mt-1.5 transition-all duration-700 flex items-center justify-center`}>
        {stage === 'saving' && <Loader2 className="w-2 h-2 text-white animate-spin" />}
        {stage === 'complete' && <CheckCircle2 className="w-2 h-2 text-white opacity-0" />}
      </div>
      <div>
        <p className={`text-sm ${textColor} font-medium transition-colors duration-700`}>{projectName}</p>
        <p className={`text-xs ${subtextColor} mt-0.5 transition-colors duration-700`}>
          {stage === 'saving' ? 'Saving changes...' : 'Here is your Latest version'}
        </p>
      </div>
    </div>
  );
};
