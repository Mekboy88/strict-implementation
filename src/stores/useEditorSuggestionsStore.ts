import { create } from 'zustand';

interface EditorSuggestionsStore {
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
}

export const useEditorSuggestionsStore = create<EditorSuggestionsStore>((set) => ({
  showSuggestions: false,
  setShowSuggestions: (show) => set({ showSuggestions: show }),
}));
