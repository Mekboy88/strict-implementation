/**
 * Editor Streaming Service
 * 
 * Handles real-time code streaming to the Monaco editor with visual
 * line-by-line animation effects for enhanced user experience.
 * 
 * @module services/editor/editorStreamService
 */

import { useEditorStore } from "@/stores/useEditorStore";

/**
 * Streams code content into the editor with line-by-line animation
 * 
 * Creates a visual "typing" effect by incrementally adding lines to the editor
 * at 30ms intervals, providing real-time feedback during code generation.
 * 
 * @param {string} filePath - Path of file to open and stream into
 * @param {string} fullContent - Complete code content to stream
 * @param {React.MutableRefObject<NodeJS.Timeout | null>} activeStreamRef - Ref to track active stream
 * @param {Function} [onComplete] - Optional callback when streaming completes
 * @returns {NodeJS.Timeout} The interval timer for the stream
 * 
 * @example
 * ```typescript
 * const streamRef = useRef<NodeJS.Timeout | null>(null);
 * streamCodeToEditor(
 *   'src/components/Button.tsx',
 *   buttonCode,
 *   streamRef,
 *   () => console.log('Streaming complete!')
 * );
 * ```
 */
export const streamCodeToEditor = (
  filePath: string,
  fullContent: string,
  activeStreamRef: React.MutableRefObject<NodeJS.Timeout | null>,
  onComplete?: () => void
): NodeJS.Timeout => {
  const { setActiveFile, updateFileContent } = useEditorStore.getState();

  console.log(`🎬 Starting stream for: ${filePath} (${fullContent.length} chars)`);

  // Clear any existing stream to prevent doubling
  if (activeStreamRef.current) {
    clearInterval(activeStreamRef.current);
    activeStreamRef.current = null;
  }

  // Open file with empty content first
  setActiveFile(filePath, '');
  console.log(`📂 Opened ${filePath} in editor (empty initially)`);

  // Split content into lines for streaming
  const lines = fullContent.split('\n');
  let currentLineIndex = 0;
  let builtContent = '';

  const streamInterval = setInterval(() => {
    if (currentLineIndex < lines.length) {
      // Add next line with proper line break handling
      builtContent += (currentLineIndex > 0 ? '\n' : '') + lines[currentLineIndex];
      updateFileContent(filePath, builtContent);
      currentLineIndex++;
    } else {
      // Streaming complete - cleanup and callback
      clearInterval(streamInterval);
      activeStreamRef.current = null;
      console.log(`✅ Streaming complete for ${filePath}`);
      if (onComplete) onComplete();
    }
  }, 30); // 30ms per line = smooth but fast streaming

  // Store ref to allow cleanup
  activeStreamRef.current = streamInterval;

  return streamInterval;
};

/**
 * Cleans up any active streaming interval
 * 
 * Should be called on component unmount or before starting a new stream
 * to prevent memory leaks and duplicate animations.
 * 
 * @param {React.MutableRefObject<NodeJS.Timeout | null>} activeStreamRef - Ref to active stream
 * 
 * @example
 * ```typescript
 * useEffect(() => {
 *   return () => cleanupStreamingInterval(activeStreamRef);
 * }, []);
 * ```
 */
export const cleanupStreamingInterval = (
  activeStreamRef: React.MutableRefObject<NodeJS.Timeout | null>
) => {
  if (activeStreamRef.current) {
    clearInterval(activeStreamRef.current);
    activeStreamRef.current = null;
  }
};
