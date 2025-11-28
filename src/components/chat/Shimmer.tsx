export const Shimmer = () => (
  <div className="animate-pulse bg-gray-700/30 rounded-xl h-12 w-full mt-2 mb-4"></div>
);

export const ReasoningShimmer = () => (
  <div className="space-y-3 animate-fade-in">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500/30 to-violet-500/30 animate-pulse flex items-center justify-center">
        <span className="text-lg">🧠</span>
      </div>
      <div className="flex-1">
        <div className="h-3 bg-slate-700/50 rounded animate-pulse w-3/4 mb-2" />
        <div className="h-2 bg-slate-700/30 rounded animate-pulse w-1/2" />
      </div>
    </div>
    <div className="h-1 w-full bg-gradient-to-r from-sky-500/20 via-violet-500/40 to-sky-500/20 rounded animate-pulse" />
  </div>
);

export const CodeGeneratingShimmer = () => (
  <div className="space-y-2">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex items-center gap-2 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
        <div className="w-4 h-4 rounded bg-violet-500/30" />
        <div className="h-2.5 bg-slate-700/40 rounded flex-1" />
      </div>
    ))}
  </div>
);
