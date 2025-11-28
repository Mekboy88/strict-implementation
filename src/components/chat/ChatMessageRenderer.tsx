import { useState, useMemo } from "react";
import { FileBuildingAnimation } from "./FileBuildingAnimation";
import { CodeBlock } from "./CodeBlock";
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
        <p className="text-lg whitespace-pre-wrap">
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
  
  // Show file building animation during streaming if files are being created
  if (isStreaming && content.includes('src/')) {
    return (
      <div className="space-y-4">
        <FileBuildingAnimation content={content} isStreaming={isStreaming} />
      </div>
    );
  }
  
  // For subsequent messages, parse and render code blocks
  const codeBlockRegex = /```(?:typescript|tsx|ts|jsx|javascript|js)?\s*(?:\/\/\s*(.+?))?\n([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let hasCode = false;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    hasCode = true;
    // Add text before code block
    if (match.index > lastIndex) {
      const text = content.substring(lastIndex, match.index).trim();
      if (text) {
        parts.push(
          <div key={`text-${lastIndex}`} className="text-base text-blue-50 leading-relaxed">
            {text.split('\n\n').map((paragraph, i) => (
              <p key={i} className={i > 0 ? 'mt-3' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
        );
      }
    }

    // Add code block (only React/TypeScript, skip HTML)
    const code = match[2].trim();
    if (!code.includes('<!DOCTYPE') && !code.includes('<html>')) {
      const filePath = match[1]?.trim();
      const language = match[0].match(/```(\w+)/)?.[1] || 'typescript';
      parts.push(
        <CodeBlock 
          key={`code-${match.index}`}
          code={code}
          language={language}
          filePath={filePath}
        />
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const text = content.substring(lastIndex).trim();
    if (text) {
      parts.push(
        <div key={`text-${lastIndex}`} className="text-base text-blue-50 leading-relaxed">
          {text.split('\n\n').map((paragraph, i) => (
            <p key={i} className={i > 0 ? 'mt-3' : ''}>
              {paragraph}
            </p>
          ))}
        </div>
      );
    }
  }

  // If no code blocks found, show plain text
  if (!hasCode) {
    return (
      <div className="space-y-4">
        <div className="text-base text-blue-50 leading-relaxed">
          {content.split('\n\n').map((paragraph, i) => (
            <p key={i} className={i > 0 ? 'mt-3' : ''}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return <div className="space-y-4">{parts}</div>;
};
