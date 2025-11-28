import { useEffect, useState, useRef } from "react";
import { parseMarkdown } from "@/utils/chat/markdownParser";

interface StreamingTextProps {
  content: string;
  isStreaming: boolean;
}

export const StreamingText = ({ content, isStreaming }: StreamingTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const previousContentRef = useRef("");
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // If streaming stopped, show full text immediately
    if (!isStreaming) {
      setDisplayedText(content);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    // Only process new characters that were added
    if (content.length > previousContentRef.current.length) {
      const newChars = content.slice(previousContentRef.current.length);
      previousContentRef.current = content;

      let charIndex = 0;
      
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Add characters progressively
      intervalRef.current = window.setInterval(() => {
        if (charIndex < newChars.length) {
          setDisplayedText(prev => prev + newChars[charIndex]);
          charIndex++;
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }, 20); // 20ms per character for smooth typing effect
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [content, isStreaming]);

  return (
    <div className="streaming-text-container">
      <div className="chat-prose text-base text-blue-50 leading-relaxed">
        {parseMarkdown(displayedText || content)}
        {isStreaming && (
          <span className="streaming-cursor inline-block w-1 h-4 bg-primary ml-0.5 animate-pulse" />
        )}
      </div>
    </div>
  );
};