import { Loader2 } from 'lucide-react';

interface LiveFileStatusProps {
  currentFile: string | null;
}

export const LiveFileStatus = ({ currentFile }: LiveFileStatusProps) => {
  if (!currentFile) return null;

  return (
    <div className="flex items-center gap-2 text-white/70 text-sm py-2 animate-fade-in">
      <Loader2 className="w-4 h-4 animate-spin text-primary" />
      <span>Editing <span className="font-mono text-white/90">{currentFile}</span></span>
    </div>
  );
};
