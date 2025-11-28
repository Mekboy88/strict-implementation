interface CompletionCardProps {
  projectName: string;
}

export const CompletionCard = ({ projectName }: CompletionCardProps) => {
  return (
    <div className="inline-flex items-start gap-3 rounded-2xl px-6 py-3 border border-white/10 bg-gradient-to-br from-white/[0.02] via-red-500/[0.01] to-black/[0.02] backdrop-blur-sm">
      <div className="w-2 h-2 rounded-full bg-white/40 mt-1.5" />
      <div>
        <p className="text-sm text-white/90 font-medium">{projectName}</p>
        <p className="text-xs text-white/50 mt-0.5">Here is your Latest version</p>
      </div>
    </div>
  );
};
