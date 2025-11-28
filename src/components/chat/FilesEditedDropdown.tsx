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
        className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-all duration-300 ml-auto bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-lg hover:bg-white/15"
      >
        <span>{isOpen ? 'Close' : 'Edited'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="mt-3 space-y-2 animate-fade-in">
          {files.map((file, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 animate-fade-in bg-white/5 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-white/70">{getFileIcon(file.path)}</span>
              <span className="text-white/60 text-sm font-medium">Created</span>
              <span className="font-mono truncate bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-white/80 text-xs">{file.path}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
