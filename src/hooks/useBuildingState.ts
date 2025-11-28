import { useState, useCallback } from 'react';

export type BuildPhase = 'idle' | 'reasoning' | 'analyzing' | 'generating' | 'applying' | 'complete' | 'error';

export interface FileProgress {
  name: string;
  status: 'pending' | 'processing' | 'done';
}

interface BuildingState {
  isBuilding: boolean;
  phase: BuildPhase;
  files: FileProgress[];
  explanation: string;
  startTime: number | null;
  error: string | null;
  elapsedTime: number;
}

export function useBuildingState() {
  const [state, setState] = useState<Omit<BuildingState, 'elapsedTime'>>({
    isBuilding: false,
    phase: 'idle',
    files: [],
    explanation: '',
    startTime: null,
    error: null,
  });

  const startBuild = useCallback(() => {
    setState(s => ({ 
      ...s, 
      isBuilding: true, 
      phase: 'reasoning', 
      startTime: Date.now(),
      error: null,
      files: [],
      explanation: '',
    }));
  }, []);

  const updatePhase = useCallback((phase: BuildPhase) => {
    setState(s => ({ ...s, phase }));
  }, []);

  const addFile = useCallback((file: FileProgress) => {
    setState(s => {
      const existingIndex = s.files.findIndex(f => f.name === file.name);
      if (existingIndex >= 0) {
        const newFiles = [...s.files];
        newFiles[existingIndex] = file;
        return { ...s, files: newFiles };
      }
      return { ...s, files: [...s.files, file] };
    });
  }, []);

  const updateFiles = useCallback((files: FileProgress[]) => {
    setState(s => ({ ...s, files }));
  }, []);

  const setExplanation = useCallback((explanation: string) => {
    setState(s => ({ ...s, explanation }));
  }, []);

  const completeBuild = useCallback(() => {
    setState(s => ({ 
      ...s, 
      isBuilding: false, 
      phase: 'complete',
      files: s.files.map(f => ({ ...f, status: 'done' as const })),
    }));
    
    // Reset after 3 seconds
    setTimeout(() => {
      setState(s => ({ ...s, phase: 'idle' }));
    }, 3000);
  }, []);

  const setError = useCallback((error: string) => {
    setState(s => ({ ...s, error, isBuilding: false, phase: 'error' }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isBuilding: false,
      phase: 'idle',
      files: [],
      explanation: '',
      startTime: null,
      error: null,
    });
  }, []);

  const elapsedTime = state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0;

  return {
    ...state,
    elapsedTime,
    startBuild,
    updatePhase,
    addFile,
    updateFiles,
    setExplanation,
    completeBuild,
    setError,
    reset,
  };
}
