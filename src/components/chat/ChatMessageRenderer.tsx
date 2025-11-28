import { FileCode2 } from "lucide-react";
import { parseMessageContent } from "@/utils/chat/messageContentParser";

interface ChatMessageRendererProps {
  content: string;
  role: 'user' | 'assistant';
  isStreaming: boolean;
}

export const ChatMessageRenderer = ({ content, role, isStreaming }: ChatMessageRendererProps) => {
  // Parse content to separate explanation from code
  const { explanation, codeBlocks } = parseMessageContent(content);
  
  // If user message, show as-is
  if (role === 'user') {
    return (
      <div className="max-w-[85%] bg-neutral-800/50 text-slate-50 rounded-2xl px-4 py-3">
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
    );
  }
  
  return (
    <div className="w-full space-y-3">
      {/* Show academic explanation */}
      {explanation && (
        <div className="text-sm text-slate-200 leading-relaxed bg-neutral-800/30 rounded-xl px-4 py-3 border border-white/5">
          {explanation}
        </div>
      )}
      
      {/* Show file cards instead of raw code */}
      {codeBlocks.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-slate-400 font-medium px-1">
            📁 Files {isStreaming ? 'being created' : 'created'}:
          </div>
          {codeBlocks.map((block, i) => (
            <div 
              key={i} 
              className="flex items-center gap-3 bg-neutral-800/50 rounded-lg px-3 py-2 border border-white/5 hover:border-sky-500/30 transition-colors"
            >
              <FileCode2 className="h-4 w-4 text-sky-400 flex-shrink-0" />
              <span className="text-sm text-slate-200 flex-1 truncate">{block.filename}</span>
              <span className="text-xs text-slate-500 uppercase">
                {block.language}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
