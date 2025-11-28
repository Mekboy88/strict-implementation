import { useState, useMemo } from "react";
import { BuildingResponse } from "./BuildingResponse";

interface ChatMessageRendererProps {
  content: string;
  role: 'user' | 'assistant';
  isStreaming: boolean;
  isFirstMessage?: boolean;
}

export const ChatMessageRenderer = ({ content, role, isStreaming, isFirstMessage = false }: ChatMessageRendererProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LINES = 15;

  // Calculate if content needs truncation
  const { needsTruncation, truncatedContent } = useMemo(() => {
    if (role !== 'user') return { needsTruncation: false, truncatedContent: content };
    
    const lines = content.split('\n');
    if (lines.length <= MAX_LINES) {
      return { needsTruncation: false, truncatedContent: content };
    }
    
    return {
      needsTruncation: true,
      truncatedContent: lines.slice(0, MAX_LINES).join('\n')
    };
  }, [content, role]);

  // If user message, show with see more/less functionality
  if (role === 'user') {
    return (
      <div className="max-w-[85%] bg-neutral-800/50 text-slate-50 rounded-2xl px-4 py-3">
        <p className="text-sm whitespace-pre-wrap">
          {needsTruncation && !isExpanded ? truncatedContent : content}
        </p>
        {needsTruncation && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-xs text-white hover:text-white/80 transition-colors font-bold"
          >
            {isExpanded ? "See less" : "See more"}
          </button>
        )}
      </div>
    );
  }
  
  // Check if this is a building response (has code blocks)
  const hasCodeBlocks = content.includes("```");
  
  if (hasCodeBlocks) {
    return <BuildingResponse content={content} isStreaming={isStreaming} isFirstProject={isFirstMessage} />;
  }
  
  // Plain text response
  return (
    <div className="text-sm text-slate-200 leading-relaxed typing-animation">
      {content}
    </div>
  );
};
