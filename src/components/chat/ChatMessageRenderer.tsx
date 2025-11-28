import { FileCode2 } from "lucide-react";
import { parseMessageContent, detectBuildPhase, extractFilesBeingCreated } from "@/utils/chat/messageContentParser";
import { StreamingBuildIndicator } from "./StreamingBuildIndicator";
import { BuildSummaryCard } from "./BuildSummaryCard";
import { useState, useEffect } from "react";

interface ChatMessageRendererProps {
  content: string;
  role: 'user' | 'assistant';
  isStreaming: boolean;
}

export const ChatMessageRenderer = ({ content, role, isStreaming }: ChatMessageRendererProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!isStreaming) return;
    
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isStreaming, startTime]);

  // Parse content to separate explanation from code
  const { explanation, codeBlocks } = parseMessageContent(content);
  const buildPhase = detectBuildPhase(content);
  const filesBeingCreated = extractFilesBeingCreated(content);
  
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
      {/* Show streaming build indicator while building */}
      {isStreaming && codeBlocks.length > 0 && (
        <StreamingBuildIndicator 
          phase={buildPhase}
          elapsedTime={elapsedTime}
          filesCount={filesBeingCreated.length}
        />
      )}

      {/* Show build summary after completion */}
      {!isStreaming && codeBlocks.length > 0 && (
        <BuildSummaryCard 
          explanation={explanation}
          files={codeBlocks}
        />
      )}

      {/* Show explanation only if no code blocks */}
      {!isStreaming && codeBlocks.length === 0 && explanation && (
        <div className="text-sm text-slate-200 leading-relaxed bg-neutral-800/30 rounded-xl px-4 py-3 border border-white/5">
          {explanation}
        </div>
      )}
    </div>
  );
};
