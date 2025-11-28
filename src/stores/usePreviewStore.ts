import { create } from 'zustand';
import { editorSystem } from '@/core/EditorSystem';
import { eventBus } from '@/core/EventBus';

interface PreviewState {
  desktopPreviewHtml: string;
  mobilePreviewHtml: string;
  consoleLog: any[];
  setDesktopPreview: (html: string) => void;
  setMobilePreview: (html: string) => void;
  clearDesktopPreview: () => void;
  clearMobilePreview: () => void;
  addConsoleLog: (log: any) => void;
  clearConsoleLogs: () => void;
}

export const usePreviewStore = create<PreviewState>((set) => {
  // Listen to system events
  eventBus.on('preview:htmlUpdated', (data) => {
    set({ desktopPreviewHtml: data.html });
  });

  eventBus.on('preview:consoleLog', (log) => {
    set((state) => ({
      consoleLog: [...state.consoleLog, log]
    }));
  });

  return {
    desktopPreviewHtml: '',
    mobilePreviewHtml: '',
    consoleLog: [],
    
    setDesktopPreview: (html: string) => {
      editorSystem.setPreviewHtml(html);
      set({ desktopPreviewHtml: html });
    },
    
    setMobilePreview: (html: string) => {
      set({ mobilePreviewHtml: html });
    },
    
    clearDesktopPreview: () => {
      set({ desktopPreviewHtml: '' });
    },
    
    clearMobilePreview: () => {
      set({ mobilePreviewHtml: '' });
    },

    addConsoleLog: (log: any) => {
      set((state) => ({
        consoleLog: [...state.consoleLog, log]
      }));
    },

    clearConsoleLogs: () => {
      set({ consoleLog: [] });
    }
  };
});
