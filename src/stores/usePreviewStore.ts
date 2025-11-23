import { create } from 'zustand';

interface PreviewState {
  desktopPreviewHtml: string;
  mobilePreviewHtml: string;
  setDesktopPreview: (html: string) => void;
  setMobilePreview: (html: string) => void;
  clearDesktopPreview: () => void;
  clearMobilePreview: () => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
  desktopPreviewHtml: '',
  mobilePreviewHtml: '',
  
  setDesktopPreview: (html: string) => {
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
}));
