import { create } from 'zustand';

interface PreviewStore {
  previewUrl: string | null;
  isLoading: boolean;
  setPreviewUrl: (url: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const usePreviewStore = create<PreviewStore>((set) => ({
  previewUrl: null,
  isLoading: false,
  setPreviewUrl: (previewUrl) => set({ previewUrl }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
