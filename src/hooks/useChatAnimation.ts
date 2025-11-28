import { useState, useEffect, useCallback } from 'react';
import { eventBus } from '@/core/EventBus';
import { AnimationState, FileMetadata } from '@/types/chat';
import { animationController } from '@/services/chat/animationController';

/**
 * Hook for managing chat animations
 */
export function useChatAnimation(
  files: FileMetadata[],
  isStreaming: boolean
) {
  const [currentFileIndex, setCurrentFileIndex] = useState(-1);
  const [animationState, setAnimationState] = useState<AnimationState>(
    animationController.getState()
  );

  // Subscribe to animation events
  useEffect(() => {
    const unsubscribeIndexChange = eventBus.on('animation:indexChange', (data: any) => {
      setCurrentFileIndex(data.index);
    });

    const unsubscribeComplete = eventBus.on('animation:complete', (state: any) => {
      setAnimationState(state);
    });

    const unsubscribeFileStart = eventBus.on('animation:fileStart', (data: any) => {
      setCurrentFileIndex(data.index);
    });

    return () => {
      unsubscribeIndexChange();
      unsubscribeComplete();
      unsubscribeFileStart();
    };
  }, []);

  // Start animation when streaming starts
  useEffect(() => {
    if (isStreaming && files.length > 0) {
      animationController.startFileAnimation(files);
    }
  }, [isStreaming, files.length]);

  // Complete animation when streaming ends
  useEffect(() => {
    if (!isStreaming && files.length > 0) {
      animationController.complete();
    }
  }, [isStreaming, files.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      animationController.cleanup();
    };
  }, []);

  const syncWithProgress = useCallback((progress: number) => {
    return animationController.syncWithStream(files, progress);
  }, [files]);

  return {
    currentFileIndex,
    animationState,
    syncWithProgress
  };
}
