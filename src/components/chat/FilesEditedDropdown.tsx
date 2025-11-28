import { useState } from "react";
import { ChevronDown, FileCode, Image, FileJson, File } from "lucide-react";

interface FileItem {
  path: string;
  type: string;
}

interface FilesEditedDropdownProps {
  files: FileItem[];
}

const getFileIcon = (path: string) => {
  if (path.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
    return <Image className="w-4 h-4" />;
  }
  if (path.match(/\.(tsx?|jsx?|css|scss)$/i)) {
    return <FileCode className="w-4 h-4" />;
  }
  if (path.match(/\.json$/i)) {
    return <FileJson className="w-4 h-4" />;
  }
  return <File className="w-4 h-4" />;
};

export const FilesEditedDropdown = ({ files }: FilesEditedDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white/70 hover:text-white/90 text-sm transition-colors ml-auto"
      >
        <span>Files Edited</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="mt-2 space-y-1 animate-accordion-down">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-1.5 text-[10px]">
              <span className="text-white/30 scale-75">{getFileIcon(file.path)}</span>
              <span className="text-white/40">Created</span>
              <span className="font-mono truncate bg-white/5 backdrop-blur-sm px-2 py-0.5 rounded text-white/50">{file.path}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
