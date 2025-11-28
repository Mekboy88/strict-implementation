import { useState, useMemo } from "react";
import { BuildingResponse } from "./BuildingResponse";
import { Copy, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatMessageRendererProps {
  content: string;
  role: 'user' | 'assistant';
  isStreaming: boolean;
  isFirstMessage?: boolean;
}

export const ChatMessageRenderer = ({ content, role, isStreaming, isFirstMessage = false }: ChatMessageRendererProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // If user message, show with see more/less functionality
  if (role === 'user') {
    return (
      <div className="relative max-w-[85%] bg-neutral-800/50 text-slate-50 rounded-2xl px-4 py-3 pr-10">
        <p className="text-sm whitespace-pre-wrap">
          {needsTruncation && !isExpanded ? truncatedContent : content}
        </p>
        {needsTruncation && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-xs text-white/70 hover:text-white/50 transition-colors font-bold"
          >
            {isExpanded ? "See less" : "See more"}
          </button>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleCopy}
                className="absolute bottom-2 right-2 p-1.5 rounded hover:bg-white/10 transition-all duration-300"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-white/70" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/70" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">{isCopied ? "Copied!" : "Copy"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
  
  // Check if this is a building response (has code blocks)
  const hasCodeBlocks = content.includes("```");
  
  // CRITICAL: Always use BuildingResponse during streaming or if content has code blocks
  // This prevents component tree switching which causes TypewriterText to remount and restart
  if (isStreaming || hasCodeBlocks) {
    return <BuildingResponse content={content} isStreaming={isStreaming} isFirstProject={isFirstMessage} />;
  }
  
  // Plain text response - regular chat
  return (
    <div className="space-y-4">
      <div className="text-base text-slate-200 leading-relaxed">
        {content.split('\n\n').map((paragraph, i) => (
          <p key={i} className={i > 0 ? 'mt-3' : ''}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};
