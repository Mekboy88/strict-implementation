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
  expandedFolders: Set<string>;
  currentProjectId: string | null;
  addFile: (file: FileNode) => void;
  updateFile: (path: string, content: string) => void;
  deleteFile: (path: string) => void;
  createFile: (path: string, type: 'file' | 'folder', content?: string) => void;
  toggleFolder: (path: string) => void;
  isExpanded: (path: string) => boolean;
  getFilesByPath: (path: string) => FileNode[];
  initializeProject: () => void;
  getAllFiles: () => FileNode[];
  setCurrentProject: (projectId: string) => Promise<void>;
  getFileContent: (path: string) => string | undefined;
}

export const useFileSystemStore = create<FileSystemStore>((set, get) => ({
  files: [],
  expandedFolders: new Set<string>(),
  currentProjectId: null,
  
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  
  updateFile: (path, content) => set((state) => ({
    files: state.files.map((f) => f.path === path ? { ...f, content } : f)
  })),
  
  deleteFile: (path) => set((state) => ({
    files: state.files.filter((f) => f.path !== path)
  })),
  
  createFile: (path, type, content = '') => set((state) => {
    const name = path.split('/').pop() || '';
    const newFile: FileNode = { name, type, path, content };
    return { files: [...state.files, newFile] };
  }),
  
  toggleFolder: (path) => set((state) => {
    const newExpanded = new Set(state.expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    return { expandedFolders: newExpanded };
  }),
  
  isExpanded: (path) => {
    return get().expandedFolders.has(path);
  },
  
  getFilesByPath: (parentPath: string) => {
    const files = get().files;
    return files.filter(f => {
      const pathParts = f.path.split('/');
      const parentParts = parentPath.split('/');
      return pathParts.length === parentParts.length + 1 && 
             f.path.startsWith(parentPath + '/');
    });
  },
  
  initializeProject: () => set({
    files: [
      { name: 'src', type: 'folder', path: 'src' },
      { name: 'components', type: 'folder', path: 'src/components' },
      { name: 'banner.tsx', type: 'file', path: 'src/components/banner.tsx', content: '// Banner component' },
      { name: 'product.js', type: 'file', path: 'src/components/product.js', content: '// Product component' },
      { name: 'package.json', type: 'file', path: 'package.json', content: '{}' },
      { name: 'index.html', type: 'file', path: 'index.html', content: '<!DOCTYPE html>' },
    ],
    expandedFolders: new Set(['src', 'src/components'])
  }),
  
  getAllFiles: () => {
    return get().files;
  },

  setCurrentProject: async (projectId: string) => {
    set({ currentProjectId: projectId });
  },

  getFileContent: (path: string) => {
    const file = get().files.find(f => f.path === path);
    return file?.content;
  },
}));
