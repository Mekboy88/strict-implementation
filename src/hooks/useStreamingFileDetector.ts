import { useState, useEffect, useRef } from 'react';
import { FileMetadata } from '@/types/chat';

interface UseStreamingFileDetectorOptions {
  content: string;
  isStreaming: boolean;
}

/**
 * Detects files being created/edited in real-time from streaming content
 */
export function useStreamingFileDetector({ content, isStreaming }: UseStreamingFileDetectorOptions) {
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [detectedFiles, setDetectedFiles] = useState<FileMetadata[]>([]);
  const lastContentLengthRef = useRef(0);
  const detectedPathsRef = useRef(new Set<string>());

  useEffect(() => {
    if (!isStreaming) {
      // When streaming completes, clear current file
      setCurrentFile(null);
      return;
    }

    // Only parse new content that was added
    const newContent = content.slice(lastContentLengthRef.current);
    lastContentLengthRef.current = content.length;

    // Pattern 1: Code blocks with file paths - ```typescript:src/App.tsx or ```tsx:src/components/Button.tsx
    const codeBlockPattern = /```(?:typescript|tsx|jsx|javascript|js|css|html|json)?:([^\s\n]+)/g;
    
    // Pattern 2: File paths in comments - // src/App.tsx or /* src/components/Button.tsx */
    const commentPattern = /(?:\/\/|\/\*)\s*((?:src|public)\/[^\s\n*]+)/g;
    
    // Pattern 3: Explicit "Creating/Editing" mentions
    const editingPattern = /(?:Creating|Editing|Updating)\s+`?([^\s`\n]+\.(?:tsx?|jsx?|css|html|json))`?/gi;

    let match;
    const newPaths: string[] = [];

    // Check all patterns
    while ((match = codeBlockPattern.exec(newContent)) !== null) {
      newPaths.push(match[1]);
    }
    while ((match = commentPattern.exec(newContent)) !== null) {
      newPaths.push(match[1]);
    }
    while ((match = editingPattern.exec(newContent)) !== null) {
      newPaths.push(match[1]);
    }

    // Process newly detected paths
    newPaths.forEach(path => {
      if (!detectedPathsRef.current.has(path)) {
        detectedPathsRef.current.add(path);
        
        const fileMetadata: FileMetadata = {
          path,
          status: 'creating',
          startTime: Date.now(),
        };

        setDetectedFiles(prev => [...prev, fileMetadata]);
        setCurrentFile(path);
      }
    });
  }, [content, isStreaming]);

  // Reset when new stream starts
  useEffect(() => {
    if (isStreaming) {
      lastContentLengthRef.current = 0;
      detectedPathsRef.current.clear();
      setDetectedFiles([]);
      setCurrentFile(null);
    }
  }, [isStreaming]);

  return {
    currentFile,
    detectedFiles,
  };
}
