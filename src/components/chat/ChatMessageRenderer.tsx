import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { BuildingResponse } from "./BuildingResponse";
import { StreamingText } from "./StreamingText";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatMessageRendererProps {
  content: string;
  role: 'user' | 'assistant';
  isStreaming: boolean;
  isFirstMessage?: boolean;
}

export const ChatMessageRenderer: React.FC<ChatMessageRendererProps> = ({
  content,
  role,
  isStreaming,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LINES = 15;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // User message rendering
  if (role === "user") {
    const lines = content.split('\n');
    const needsTruncation = lines.length > MAX_LINES;
    const displayContent = needsTruncation && !isExpanded 
      ? lines.slice(0, MAX_LINES).join('\n') + '...'
      : content;

    return (
      <div className="relative max-w-[85%] bg-neutral-800/50 text-slate-50 rounded-2xl px-4 py-3 pr-10">
        <p className="text-sm whitespace-pre-wrap">
          {displayContent}
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

  // Assistant message rendering
  // Check if this looks like a build response (has code blocks)
  const isBuildResponse = /```/.test(content);

  if (isBuildResponse) {
    return (
      <BuildingResponse
        content={content}
        isStreaming={isStreaming}
      />
    );
  }

  // Plain text chat response (no code filtering needed)
  return (
    <div className="text-sm text-slate-200 leading-relaxed">
      <StreamingText content={content} isComplete={!isStreaming} />
    </div>
  );
};
