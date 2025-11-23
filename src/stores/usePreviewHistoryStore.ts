import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PreviewHistoryItem {
  id: string;
  timestamp: number;
  description: string;
  previewUrl: string;
}

interface PreviewHistoryStore {
  items: PreviewHistoryItem[];
  addItem: (item: Omit<PreviewHistoryItem, 'id' | 'timestamp'>) => void;
  removeItem: (id: string) => void;
  restoreItem: (id: string) => void;
  clearHistory: () => void;
}

export const usePreviewHistoryStore = create<PreviewHistoryStore>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: "1",
          timestamp: Date.now() - 3600000,
          description: "Added unified menu dropdown to top navigation",
          previewUrl: "#",
        },
        {
          id: "2",
          timestamp: Date.now() - 7200000,
          description: "Implemented customizable workspace presets",
          previewUrl: "#",
        },
        {
          id: "3",
          timestamp: Date.now() - 10800000,
          description: "Created diff mode for file comparison",
          previewUrl: "#",
        },
        {
          id: "4",
          timestamp: Date.now() - 14400000,
          description: "Added AI snippets library feature",
          previewUrl: "#",
        },
        {
          id: "5",
          timestamp: Date.now() - 18000000,
          description: "Enhanced terminal with typing animation",
          previewUrl: "#",
        },
      ],
      
      addItem: (item) => {
        const newItem: PreviewHistoryItem = {
          ...item,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        };
        set((state) => ({
          items: [newItem, ...state.items],
        }));
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      
      restoreItem: (id) => {
        const item = get().items.find((item) => item.id === id);
        if (item) {
          console.log('Restoring preview:', item);
          // UI only - no actual restore
        }
      },
      
      clearHistory: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'preview-history-storage',
    }
  )
);
