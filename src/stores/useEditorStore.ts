import { create } from 'zustand';

interface EditorState {
  activeFile: string | null;
  fileContent: string;
  setActiveFile: (filePath: string, content: string) => void;
  updateFileContent: (filePath: string, content: string) => void;
  clearEditor: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  activeFile: null,
  fileContent: '',
  
  setActiveFile: (filePath: string, content: string) => {
    set({ activeFile: filePath, fileContent: content });
  },
  
  updateFileContent: (filePath: string, content: string) => {
    set((state) => {
      if (state.activeFile === filePath) {
        return { fileContent: content };
      }
      return state;
    });
  },
  
  clearEditor: () => {
    set({ activeFile: null, fileContent: '' });
  },
}));
