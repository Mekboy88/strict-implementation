/**
 * Chat message types and interfaces
 */

export type MessageType = 'first-build' | 'build' | 'chat' | 'error';

export type FileStatus = 'pending' | 'creating' | 'done';

export interface FileMetadata {
  path: string;
  status: FileStatus;
  startTime: number;
  endTime?: number;
}

export interface BuildMetadata {
  projectName?: string;
  files: FileMetadata[];
  currentFileIndex: number;
  designVision?: string;
  features?: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  isStreaming: boolean;
  messageType: MessageType;
  buildMetadata?: BuildMetadata;
  createdAt: number;
}

export interface AnimationState {
  isTyping: boolean;
  currentFileIndex: number;
  visibleSections: Set<string>;
  showFileCreation: boolean;
  showDropdown: boolean;
}
