import { AnimationState, FileMetadata } from '@/types/chat';
import { eventBus } from '@/core/EventBus';

/**
 * Controls animation timing and synchronization
 */
export class AnimationController {
  private state: AnimationState = {
    isTyping: false,
    currentFileIndex: -1,
    visibleSections: new Set(),
    showFileCreation: false,
    showDropdown: false
  };

  private fileTimers: NodeJS.Timeout[] = [];

  /**
   * Starts the animation sequence for file creation
   */
  startFileAnimation(files: FileMetadata[], streamProgress: number = 0): void {
    this.cleanup();
    
    files.forEach((file, index) => {
      const delay = index * 500; // 500ms between each file
      
      const timer = setTimeout(() => {
        this.state.currentFileIndex = index;
        eventBus.emit('animation:fileStart', { file, index });
        
        // Mark file as creating
        file.status = 'creating';
        
        // After 400ms, mark as done and move to next
        setTimeout(() => {
          file.status = 'done';
          file.endTime = Date.now();
          eventBus.emit('animation:fileComplete', { file, index });
        }, 400);
      }, delay);
      
      this.fileTimers.push(timer);
    });
  }

  /**
   * Synchronizes file index with stream progress
   */
  syncWithStream(files: FileMetadata[], progress: number): number {
    const estimatedDuration = 500; // ms per file
    const calculatedIndex = Math.floor(progress / estimatedDuration);
    const newIndex = Math.min(calculatedIndex, files.length - 1);
    
    if (newIndex !== this.state.currentFileIndex && newIndex >= 0) {
      this.state.currentFileIndex = newIndex;
      eventBus.emit('animation:indexChange', { index: newIndex });
    }
    
    return newIndex;
  }

  /**
   * Completes the animation and shows final state
   */
  complete(): void {
    this.cleanup();
    this.state.showFileCreation = false;
    this.state.showDropdown = true;
    eventBus.emit('animation:complete', this.state);
  }

  /**
   * Gets the current animation state
   */
  getState(): AnimationState {
    return { ...this.state };
  }

  /**
   * Updates visibility of a section
   */
  showSection(section: string): void {
    this.state.visibleSections.add(section);
    eventBus.emit('animation:sectionVisible', { section });
  }

  /**
   * Cleans up timers and resets state
   */
  cleanup(): void {
    this.fileTimers.forEach(timer => clearTimeout(timer));
    this.fileTimers = [];
  }

  /**
   * Resets the controller state
   */
  reset(): void {
    this.cleanup();
    this.state = {
      isTyping: false,
      currentFileIndex: -1,
      visibleSections: new Set(),
      showFileCreation: false,
      showDropdown: false
    };
  }
}

// Singleton instance
export const animationController = new AnimationController();
