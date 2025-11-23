import { create } from 'zustand';

interface EditorStore {
  content: string;
  language: string;
  activeFile: string | null;
  setContent: (content: string) => void;
  setLanguage: (language: string) => void;
  setActiveFile: (file: string | null) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  content: '',
  language: 'typescript',
  activeFile: null,
  setContent: (content) => set({ content }),
  setLanguage: (language) => set({ language }),
  setActiveFile: (activeFile) => set({ activeFile }),
}));
