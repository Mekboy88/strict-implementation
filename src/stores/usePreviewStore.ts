import { create } from 'zustand';

interface PreviewStore {
  previewUrl: string | null;
  isLoading: boolean;
  mobilePreviewHtml: string | null;
  setPreviewUrl: (url: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setMobilePreviewHtml: (html: string | null) => void;
}

export const usePreviewStore = create<PreviewStore>((set) => ({
  previewUrl: null,
  isLoading: false,
  mobilePreviewHtml: null,
  setPreviewUrl: (previewUrl) => set({ previewUrl }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setMobilePreviewHtml: (mobilePreviewHtml) => set({ mobilePreviewHtml }),
}));
