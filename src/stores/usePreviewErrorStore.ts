import { create } from 'zustand';

interface PreviewError {
  message: string;
  stack?: string;
  line?: number;
  column?: number;
  timestamp: number;
}

interface PreviewErrorStore {
  currentError: PreviewError | null;
  isFixing: boolean;
  fixProgress: string;
  
  setError: (error: PreviewError) => void;
  clearError: () => void;
  setFixing: (isFixing: boolean, progress?: string) => void;
}

export const usePreviewErrorStore = create<PreviewErrorStore>((set) => ({
  currentError: null,
  isFixing: false,
  fixProgress: '',
  
  setError: (error) => set({ currentError: error }),
  clearError: () => set({ currentError: null, isFixing: false, fixProgress: '' }),
  setFixing: (isFixing, progress = '') => set({ isFixing, fixProgress: progress }),
}));
