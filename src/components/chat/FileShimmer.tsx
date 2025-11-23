export const FileShimmer = ({ filename }: { filename: string }) => (
  <div className="flex items-center gap-3 animate-pulse bg-gray-700/20 rounded-xl px-4 py-3 mt-3 mb-1">
    <div className="h-4 w-4 bg-gray-600/30 rounded"></div>
    <div className="w-32 h-3 bg-gray-600/30 rounded"></div>
    <span className="text-xs text-gray-400 ml-2">{filename}</span>
  </div>
);
