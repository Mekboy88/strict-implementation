import { useState, useMemo } from "react";
import { FileBuildingAnimation } from "./FileBuildingAnimation";
import { StreamingText } from "./StreamingText";
import { CodeBlock } from "./CodeBlock";
import { Copy, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { parseMarkdown } from "@/utils/chat/markdownParser";

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
  
  // During streaming, show text first with typing effect, then files below
  if (isStreaming) {
    const hasFiles = content.includes('src/');
    const hasCodeBlocks = content.includes('```');
    
    // Split content at first code block
    const firstCodeBlockIndex = content.indexOf('```');
    const textContent = firstCodeBlockIndex !== -1 
      ? content.substring(0, firstCodeBlockIndex).trim()
      : content.trim();
    
    // Extract streaming code if present
    let streamingCode = '';
    let codeLanguage = 'typescript';
    if (hasCodeBlocks) {
      const codeMatch = /```(?:typescript|tsx|ts|jsx|javascript|js)?\s*\n([\s\S]*?)(?:```|$)/.exec(content);
      if (codeMatch) {
        streamingCode = codeMatch[1];
        codeLanguage = content.match(/```(\w+)/)?.[1] || 'typescript';
      }
    }
    
    return (
      <div className="w-full max-w-full overflow-hidden space-y-4">
        {textContent && (
          <StreamingText content={textContent} isStreaming={true} />
        )}
        {streamingCode && (
          <CodeBlock 
            code={streamingCode}
            language={codeLanguage}
            isStreaming={true}
          />
        )}
        {hasFiles && !hasCodeBlocks && (
          <div className="file-animation-container">
            <FileBuildingAnimation content={content} isStreaming={isStreaming} />
          </div>
        )}
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
          <div key={`text-${lastIndex}`} className="chat-prose text-base text-blue-50 leading-relaxed">
            {parseMarkdown(text)}
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
        <div key={`text-${lastIndex}`} className="chat-prose text-base text-blue-50 leading-relaxed">
          {parseMarkdown(text)}
        </div>
      );
    }
  }

  // If no code blocks found, show formatted markdown text
  if (!hasCode) {
    return (
      <div className="w-full max-w-full overflow-hidden space-y-4">
        <div className="chat-prose text-base text-blue-50 leading-relaxed">
          {parseMarkdown(content)}
        </div>
      </div>
    );
  }

  return <div className="w-full max-w-full overflow-hidden space-y-4">{parts}</div>;
};
