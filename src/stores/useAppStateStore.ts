import { create } from 'zustand';

interface AppState {
  isBuilding: boolean;
  isBuildComplete: boolean;
  isPreviewDisplayed: boolean;
  hasError: boolean;
  currentError: string | null;
  autoFixInProgress: boolean;
  setBuilding: (building: boolean) => void;
  setBuildComplete: (complete: boolean) => void;
  setPreviewDisplayed: (displayed: boolean) => void;
  setError: (error: string | null) => void;
  setAutoFixInProgress: (inProgress: boolean) => void;
  reset: () => void;
}

export const useAppStateStore = create<AppState>((set) => ({
  isBuilding: false,
  isBuildComplete: false,
  isPreviewDisplayed: false,
  hasError: false,
  currentError: null,
  autoFixInProgress: false,
  setBuilding: (building) => set({ isBuilding: building }),
  setBuildComplete: (complete) => set({ isBuildComplete: complete }),
  setPreviewDisplayed: (displayed) => set({ isPreviewDisplayed: displayed }),
  setError: (error) => set({ hasError: !!error, currentError: error }),
  setAutoFixInProgress: (inProgress) => set({ autoFixInProgress: inProgress }),
  reset: () => set({
    isBuilding: false,
    isBuildComplete: false,
    isPreviewDisplayed: false,
    hasError: false,
    currentError: null,
    autoFixInProgress: false,
  }),
}));
