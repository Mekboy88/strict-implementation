import { create } from 'zustand';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  children?: FileNode[];
}

interface FileSystemStore {
  files: FileNode[];
  addFile: (file: FileNode) => void;
  updateFile: (path: string, content: string) => void;
  deleteFile: (path: string) => void;
}

export const useFileSystemStore = create<FileSystemStore>((set) => ({
  files: [],
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  updateFile: (path, content) => set((state) => ({
    files: state.files.map((f) => f.path === path ? { ...f, content } : f)
  })),
  deleteFile: (path) => set((state) => ({
    files: state.files.filter((f) => f.path !== path)
  })),
}));
