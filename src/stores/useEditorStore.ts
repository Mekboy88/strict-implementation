import { create } from 'zustand';
import { editorSystem } from '@/core/EditorSystem';
import { eventBus } from '@/core/EventBus';

interface EditorState {
  activeFile: string | null;
  fileContent: string;
  errors: any[];
  setActiveFile: (filePath: string, content: string) => void;
  updateFileContent: (filePath: string, content: string) => void;
  clearEditor: () => void;
  getErrors: () => any[];
}

export const useEditorStore = create<EditorState>((set, get) => {
  // Listen to system events
  eventBus.on('editor:change', (data) => {
    set((state) => {
      if (state.activeFile === data.filePath) {
        return { fileContent: data.content, errors: data.errors || [] };
      }
      return state;
    });
  });

  eventBus.on('editor:errors', (data) => {
    set({ errors: data.errors });
  });

  return {
    activeFile: null,
    fileContent: '',
    errors: [],
    
    setActiveFile: (filePath: string, content: string) => {
      editorSystem.setActiveFile(filePath, content);
      set({ activeFile: filePath, fileContent: content });
    },
    
    updateFileContent: (filePath: string, content: string) => {
      editorSystem.updateFile(filePath, content);
      set((state) => {
        if (state.activeFile === filePath) {
          return { fileContent: content };
        }
        return state;
      });
    },
    
    clearEditor: () => {
      set({ activeFile: null, fileContent: '', errors: [] });
    },

    getErrors: () => {
      return get().errors;
    }
  };
});
