import React from 'react';
import { StreamingText } from './StreamingText';
import { LiveFileStatus } from './LiveFileStatus';
import { FilesEditedDropdown } from './FilesEditedDropdown';
import { CompletionCard } from './CompletionCard';
import { useStreamingFileDetector } from '@/hooks/useStreamingFileDetector';
import { useLiveStreamParser } from '@/hooks/useLiveStreamParser';

interface BuildingResponseProps {
  content: string;
  isStreaming: boolean;
}

export const BuildingResponse: React.FC<BuildingResponseProps> = ({
  content,
  isStreaming,
}) => {
  // Detect files in real-time from streaming content
  const { currentFile, detectedFiles } = useStreamingFileDetector({
    content,
    isStreaming,
  });

  // Parse stream to understand response type
  const { isBuildResponse } = useLiveStreamParser(content, isStreaming);

  return (
    <div className="space-y-3">
      {/* Streaming text - shows AI's actual response */}
      <StreamingText content={content} isComplete={!isStreaming} />

      {/* Live file status - shows current file being edited */}
      {isStreaming && isBuildResponse && (
        <LiveFileStatus currentFile={currentFile} />
      )}

      {/* Files dropdown - appears after streaming completes */}
      {!isStreaming && detectedFiles.length > 0 && (
        <div className="animate-fade-in mt-4">
          <FilesEditedDropdown
            files={detectedFiles.map(f => ({ path: f.path, type: 'file' }))}
          />
        </div>
      )}

      {/* Completion card */}
      {!isStreaming && isBuildResponse && (
        <div className="mt-4">
          <CompletionCard />
        </div>
      )}
    </div>
  );
};
