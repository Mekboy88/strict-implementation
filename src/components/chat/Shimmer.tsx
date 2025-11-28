export const Shimmer = () => (
  <div className="animate-pulse bg-gray-700/30 rounded-xl h-12 w-full mt-2 mb-4"></div>
);

export const ReasoningShimmer = () => (
  <div className="flex items-center gap-3 animate-pulse bg-gradient-to-r from-sky-500/20 to-transparent rounded-xl px-4 py-3 border border-sky-500/20">
    <div className="w-2 h-2 bg-sky-400 rounded-full animate-ping" />
    <div className="h-3 w-24 bg-sky-400/30 rounded" />
    <span className="text-xs text-sky-400 ml-2">Reasoning...</span>
  </div>
);
