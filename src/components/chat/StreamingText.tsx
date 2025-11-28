import { useEffect, useState } from "react";
import { parseMarkdown } from "@/utils/chat/markdownParser";

interface StreamingTextProps {
  content: string;
  isStreaming: boolean;
}

export const StreamingText = ({ content, isStreaming }: StreamingTextProps) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    // If not streaming, show all content immediately
    if (!isStreaming) {
      setDisplayCount(content.length);
      return;
    }

    // Reset counter when content changes significantly (new message)
    if (displayCount > content.length) {
      setDisplayCount(0);
    }

    // Single interval that increments like Pygame's num_chars
    const interval = setInterval(() => {
      setDisplayCount((prev) => {
        if (prev < content.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 15); // 15ms per character = ~67 characters per second

    return () => clearInterval(interval);
  }, [content.length, isStreaming, displayCount, content]);

  // Get the text to display (slice from beginning like Pygame)
  const displayText = content.slice(0, displayCount);

  return (
    <div className="streaming-text-container">
      <div className="chat-prose text-base text-blue-50 leading-relaxed">
        {isStreaming ? (
          // During streaming: show raw text without markdown parsing
          <span className="whitespace-pre-wrap">{displayText}</span>
        ) : (
          // After streaming: parse and format markdown
          parseMarkdown(content)
        )}
        {isStreaming && displayCount < content.length && (
          <span className="streaming-cursor inline-block w-1 h-4 bg-primary ml-0.5" />
        )}
      </div>
    </div>
  );
};
