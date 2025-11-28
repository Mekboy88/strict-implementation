import { create } from 'zustand';
import { ChatMessage, MessageType, FileMetadata } from '@/types/chat';

interface ChatStateStore {
  messages: ChatMessage[];
  isFirstProject: boolean;
  currentProjectName?: string;
  
  // Streaming state
  isStreaming: boolean;
  currentStreamContent: string;
  currentlyEditingFile: string | null;
  detectedFiles: FileMetadata[];
  
  // Actions
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  setFirstProject: (isFirst: boolean) => void;
  setProjectName: (name: string) => void;
  clearMessages: () => void;
  
  // Streaming actions
  setStreaming: (isStreaming: boolean) => void;
  setStreamContent: (content: string) => void;
  setCurrentlyEditingFile: (file: string | null) => void;
  setDetectedFiles: (files: FileMetadata[]) => void;
}

export const useChatStateStore = create<ChatStateStore>((set) => ({
  messages: [],
  isFirstProject: true,
  currentProjectName: undefined,
  
  // Streaming state
  isStreaming: false,
  currentStreamContent: '',
  currentlyEditingFile: null,
  detectedFiles: [],

  addMessage: (message) => 
    set((state) => ({
      messages: [...state.messages, message]
    })),

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map(msg => 
        msg.id === id ? { ...msg, ...updates } : msg
      )
    })),

  setFirstProject: (isFirst) =>
    set({ isFirstProject: isFirst }),

  setProjectName: (name) =>
    set({ currentProjectName: name }),

  clearMessages: () =>
    set({ messages: [], isFirstProject: true, currentProjectName: undefined }),
  
  // Streaming actions
  setStreaming: (isStreaming) =>
    set({ isStreaming }),
  
  setStreamContent: (content) =>
    set({ currentStreamContent: content }),
  
  setCurrentlyEditingFile: (file) =>
    set({ currentlyEditingFile: file }),
  
  setDetectedFiles: (files) =>
    set({ detectedFiles: files }),
}));
