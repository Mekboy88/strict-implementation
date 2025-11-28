import { BuildingResponse } from "./BuildingResponse";

interface ChatMessageRendererProps {
  content: string;
  role: 'user' | 'assistant';
  isStreaming: boolean;
}

export const ChatMessageRenderer = ({ content, role, isStreaming }: ChatMessageRendererProps) => {
  // If user message, show as-is
  if (role === 'user') {
    return (
      <div className="max-w-[85%] bg-neutral-800/50 text-slate-50 rounded-2xl px-4 py-3">
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
    );
  }
  
  // Check if this is a building response (has code blocks)
  const hasCodeBlocks = content.includes("```");
  
  if (hasCodeBlocks) {
    return <BuildingResponse content={content} isStreaming={isStreaming} />;
  }
  
  // Plain text response
  return (
    <div className="text-sm text-slate-200 leading-relaxed">
      {content}
    </div>
  );
};
