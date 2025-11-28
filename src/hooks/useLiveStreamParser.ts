import { useMemo } from 'react';

interface ParsedStream {
  hasCodeBlocks: boolean;
  isBuildResponse: boolean;
  textContent: string;
}

/**
 * Parses streaming content in real-time to determine response type
 */
export function useLiveStreamParser(content: string, isStreaming: boolean): ParsedStream {
  return useMemo(() => {
    // Check if content contains code blocks
    const hasCodeBlocks = /```[\s\S]*?```/.test(content) || content.includes('```');

    // Detect if this is a build response (has code or file mentions)
    const hasBuildKeywords = /(?:creating|editing|updating|adding|file|component|src\/|\.tsx|\.jsx|\.css)/gi.test(content);
    const isBuildResponse = hasCodeBlocks || hasBuildKeywords;

    // Extract text content (everything outside code blocks for now)
    const textContent = content;

    return {
      hasCodeBlocks,
      isBuildResponse,
      textContent,
    };
  }, [content, isStreaming]);
}
