import { create } from 'zustand';
import { ChatMessage, MessageType } from '@/types/chat';

interface ChatStateStore {
  messages: ChatMessage[];
  isFirstProject: boolean;
  currentProjectName?: string;
  
  // Actions
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  setFirstProject: (isFirst: boolean) => void;
  setProjectName: (name: string) => void;
  clearMessages: () => void;
}

export const useChatStateStore = create<ChatStateStore>((set) => ({
  messages: [],
  isFirstProject: true,
  currentProjectName: undefined,

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
    set({ messages: [], isFirstProject: true, currentProjectName: undefined })
}));
