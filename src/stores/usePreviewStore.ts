import { create } from 'zustand';

interface PreviewStore {
  previewUrl: string | null;
  isLoading: boolean;
  mobilePreviewHtml: string | null;
  desktopPreviewHtml: string | null;
  setPreviewUrl: (url: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setMobilePreviewHtml: (html: string | null) => void;
  setDesktopPreviewHtml: (html: string | null) => void;
  setMobilePreview: (html: string | null) => void;
  setDesktopPreview: (html: string | null) => void;
}

export const usePreviewStore = create<PreviewStore>((set) => ({
  previewUrl: null,
  isLoading: false,
  mobilePreviewHtml: null,
  desktopPreviewHtml: null,
  setPreviewUrl: (previewUrl) => set({ previewUrl }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setMobilePreviewHtml: (mobilePreviewHtml) => set({ mobilePreviewHtml }),
  setDesktopPreviewHtml: (desktopPreviewHtml) => set({ desktopPreviewHtml }),
  setMobilePreview: (html) => set({ mobilePreviewHtml: html }),
  setDesktopPreview: (html) => set({ desktopPreviewHtml: html }),
}));
