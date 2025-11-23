import { create } from 'zustand';

interface EditorStore {
  content: string;
  language: string;
  activeFile: string | null;
  fileContent: string;
  setContent: (content: string) => void;
  setLanguage: (language: string) => void;
  setActiveFile: (file: string, content?: string) => void;
  updateFileContent: (file: string, content: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  content: '',
  language: 'typescript',
  activeFile: null,
  fileContent: '',
  setContent: (content) => set({ content }),
  setLanguage: (language) => set({ language }),
  setActiveFile: (file, content = '') => set({ activeFile: file, fileContent: content }),
  updateFileContent: (file, content) => set({ fileContent: content }),
}));
