import { FileCode } from "lucide-react";
import { useMemo, useState } from "react";
import { EditingFilesDropdown } from "./EditingFilesDropdown";

interface InlineFileEditingIndicatorProps {
  content: string;
  isStreaming: boolean;
}

const getCurrentEditingFile = (content: string): string | null => {
  // Improved file path detection - handles multiple formats
  const fileRegex = /(?:```(?:typescript|tsx|ts|jsx|javascript|js|css|html)?\s*(?:\/\/\s*|filename="|path=")?([a-zA-Z0-9_\-\/]+\.(tsx?|jsx?|css|html|json)))/gi;
  const matches = [...content.matchAll(fileRegex)];
  if (matches.length > 0) {
    return matches[matches.length - 1][1].trim();
  }
  return null;
};

const getAllEditingFiles = (content: string): string[] => {
  // Improved file path detection - handles multiple formats
  const fileRegex = /(?:```(?:typescript|tsx|ts|jsx|javascript|js|css|html)?\s*(?:\/\/\s*|filename="|path=")?([a-zA-Z0-9_\-\/]+\.(tsx?|jsx?|css|html|json)))/gi;
  const matches = [...content.matchAll(fileRegex)];
  const files = matches.map(m => m[1].trim());
  return [...new Set(files)];
};

export const InlineFileEditingIndicator = ({ content, isStreaming }: InlineFileEditingIndicatorProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentFile = useMemo(() => getCurrentEditingFile(content), [content]);
  const allFiles = useMemo(() => getAllEditingFiles(content), [content]);

  if (!currentFile) return null;

  const hasMultipleFiles = allFiles.length > 1;

  return (
    <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-blue-950/30 border border-blue-900/30 mb-2 animate-fade-in">
      <FileCode className="w-4 h-4 text-blue-400 flex-shrink-0" />
      <span className="text-blue-200/70 text-sm">Editing</span>
      <span className={`font-mono text-sm ${isStreaming ? 'text-shimmer' : 'text-blue-100'}`}>
        {currentFile}
      </span>
      
      {hasMultipleFiles && (
        <EditingFilesDropdown 
          files={allFiles}
          currentFile={currentFile}
          isOpen={isDropdownOpen}
          onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
        />
      )}
    </div>
  );
};
