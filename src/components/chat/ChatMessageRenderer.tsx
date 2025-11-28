import { useState, useMemo } from "react";
import { BuildingResponse } from "./BuildingResponse";
import { Copy, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatMessageRendererProps {
  content: string;
  role: "user" | "assistant";
  isStreaming: boolean;
  isFirstMessage?: boolean;
}

export const ChatMessageRenderer = ({
  content,
  role,
  isStreaming,
  isFirstMessage = false,
}: ChatMessageRendererProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const MAX_LINES = 15;

  // --- USER MESSAGE HANDLING (truncate long messages) ---
  const { needsTruncation, truncatedContent } = useMemo(() => {
    if (role !== "user") return { needsTruncation: false, truncatedContent: content };

    const lines = content.split("\n");
    if (lines.length <= MAX_LINES) return { needsTruncation: false, truncatedContent: content };

    return {
      needsTruncation: true,
      truncatedContent: lines.slice(0, MAX_LINES).join("\n"),
    };
  }, [content, role]);

  // --- COPY BUTTON ---
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // ============================
  //    USER BUBBLE RENDERING
  // ============================
  if (role === "user") {
    return (
      <div className="relative max-w-[85%] bg-neutral-800/60 text-white rounded-2xl px-4 py-3 pr-10 fade-in-soft">
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {needsTruncation && !isExpanded ? truncatedContent : content}
        </p>

        {needsTruncation && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-xs text-white/60 hover:text-white/80 transition-colors font-semibold"
          >
            {isExpanded ? "See less" : "See more"}
          </button>
        )}

        {/* COPY BUTTON */}
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

  // ============================
  //   BUILDING RESPONSE HANDLER
  // ============================
  const hasCodeBlocks = content.includes("```");

  if (hasCodeBlocks) {
    return <BuildingResponse content={content} isStreaming={isStreaming} isFirstProject={isFirstMessage} />;
  }

  // ============================
  //    ASSISTANT MESSAGE
  // ============================
  return (
    <div
      className={`
        max-w-[85%]
        text-slate-200 
        text-base 
        whitespace-pre-wrap 
        leading-relaxed
        typewriter-line
      `}
    >
      {content}
    </div>
  );
};
