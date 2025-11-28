import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { projectService } from '@/services/projects/projectService';
import { CORE_PROJECT_FILES } from '@/utils/projectInitializer';
import { editorSystem } from '@/core/EditorSystem';
import { eventBus } from '@/core/EventBus';

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  children?: string[];
  createdAt: number;
  updatedAt: number;
}

interface FileSystemState {
  files: Map<string, FileNode>;
  expandedFolders: Set<string>;
  currentProjectId: string | null;
  
  // Project operations
  setCurrentProject: (projectId: string) => Promise<void>;
  loadProjectFiles: (projectId: string) => Promise<void>;
  
  // File operations
  createFile: (path: string, content: string) => Promise<void>;
  updateFile: (path: string, content: string) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
  createFolder: (path: string) => void;
  getFileContent: (path: string) => string | undefined;
  getFilesByPath: (parentPath: string) => FileNode[];
  getAllFiles: () => FileNode[];
  
  // Folder operations
  toggleFolder: (path: string) => void;
  isExpanded: (path: string) => boolean;
  
  // Utility
  fileExists: (path: string) => boolean;
  initializeProject: () => Promise<void>;
  resetProject: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const getParentPath = (path: string): string => {
  const parts = path.split('/');
  parts.pop();
  return parts.join('/') || '/';
};

export const useFileSystemStore = create<FileSystemState>()(
  persist(
    (set, get) => ({
      files: new Map<string, FileNode>(),
      expandedFolders: new Set<string>([
        'src', 'public', 'src/components', 'src/pages', 'src/hooks', 'src/lib',
        'mobile', 'mobile/src', 'mobile/src/components', 'mobile/src/pages', 'mobile/public'
      ]),
      currentProjectId: null,

      setCurrentProject: async (projectId: string) => {
        set({ currentProjectId: projectId });
        await get().loadProjectFiles(projectId);
      },

      loadProjectFiles: async (projectId: string) => {
        try {
          const dbFiles = await projectService.getProjectFiles(projectId);
          const newFiles = new Map<string, FileNode>();
          
          // Convert database files to FileNode structure
          dbFiles.forEach(dbFile => {
            const parts = dbFile.file_path.split('/');
            const name = parts[parts.length - 1];
            
            // Determine if it's a folder marker (.gitkeep files)
            const isFolder = name === '.gitkeep';
            const actualPath = isFolder ? dbFile.file_path.replace('/.gitkeep', '') : dbFile.file_path;
            
            if (isFolder) {
              // Create folder node
              const folder: FileNode = {
                id: dbFile.id,
                name: parts[parts.length - 2],
                path: actualPath,
                type: 'folder',
                children: [],
                createdAt: new Date(dbFile.created_at).getTime(),
                updatedAt: new Date(dbFile.updated_at).getTime(),
              };
              newFiles.set(actualPath, folder);
            } else {
              // Create file node
              const file: FileNode = {
                id: dbFile.id,
                name,
                path: dbFile.file_path,
                type: 'file',
                content: dbFile.file_content,
                createdAt: new Date(dbFile.created_at).getTime(),
                updatedAt: new Date(dbFile.updated_at).getTime(),
              };
              newFiles.set(dbFile.file_path, file);
            }
          });

          // Build folder hierarchy
          newFiles.forEach((node, path) => {
            if (node.type === 'file') {
              const parentPath = getParentPath(path);
              if (parentPath && parentPath !== '/') {
                let parent = newFiles.get(parentPath);
                if (!parent) {
                  // Create missing parent folder
                  parent = {
                    id: generateId(),
                    name: parentPath.split('/').pop() || '',
                    path: parentPath,
                    type: 'folder',
                    children: [],
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                  };
                  newFiles.set(parentPath, parent);
                }
                if (parent.children && !parent.children.includes(path)) {
                  parent.children.push(path);
                }
              }
            }
          });

          set({ files: newFiles });
        } catch (error) {
          console.error('Error loading project files:', error);
        }
      },

      createFile: async (path: string, content: string = '') => {
        const { currentProjectId } = get();
        
        // Sync with EditorSystem
        editorSystem.createFile(path, content);
        
        // Save to database if project is loaded
        if (currentProjectId) {
          try {
            await projectService.saveFile(currentProjectId, path, content);
          } catch (error) {
            console.error('Error saving file to database:', error);
          }
        }

        set((state) => {
          const newFiles = new Map(state.files);
          const id = generateId();
          const name = path.split('/').pop() || '';
          const parentPath = getParentPath(path);
          
          const file: FileNode = {
            id,
            name,
            path,
            type: 'file',
            content,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          
          newFiles.set(path, file);
          
          // Update parent folder's children
          if (parentPath && parentPath !== '/') {
            const parent = newFiles.get(parentPath);
            if (parent && parent.type === 'folder') {
              parent.children = [...(parent.children || []), path];
              parent.updatedAt = Date.now();
            }
          }
          
          return { files: newFiles };
        });
      },

      updateFile: async (path: string, content: string) => {
        const { currentProjectId } = get();
        
        // Sync with EditorSystem
        editorSystem.updateFile(path, content);
        
        // Save to database if project is loaded
        if (currentProjectId) {
          try {
            await projectService.saveFile(currentProjectId, path, content);
          } catch (error) {
            console.error('Error updating file in database:', error);
          }
        }

        set((state) => {
          const newFiles = new Map(state.files);
          const file = newFiles.get(path);
          
          if (file && file.type === 'file') {
            file.content = content;
            file.updatedAt = Date.now();
          }
          
          return { files: newFiles };
        });
      },

      deleteFile: async (path: string) => {
        const { currentProjectId } = get();
        
        // Sync with EditorSystem
        editorSystem.deleteFile(path);
        
        // Delete from database if project is loaded
        if (currentProjectId) {
          try {
            await projectService.deleteFile(currentProjectId, path);
          } catch (error) {
            console.error('Error deleting file from database:', error);
          }
        }

        set((state) => {
          const newFiles = new Map(state.files);
          const file = newFiles.get(path);
          
          if (!file) return state;
          
          // Remove from parent's children
          const parentPath = getParentPath(path);
          if (parentPath && parentPath !== '/') {
            const parent = newFiles.get(parentPath);
            if (parent && parent.type === 'folder') {
              parent.children = (parent.children || []).filter(child => child !== path);
              parent.updatedAt = Date.now();
            }
          }
          
          // Delete file/folder and its children recursively
          if (file.type === 'folder' && file.children) {
            file.children.forEach(childPath => {
              get().deleteFile(childPath);
            });
          }
          
          newFiles.delete(path);
          
          return { files: newFiles };
        });
      },

      createFolder: (path: string) => {
        set((state) => {
          const newFiles = new Map(state.files);
          const id = generateId();
          const name = path.split('/').pop() || '';
          const parentPath = getParentPath(path);
          
          const folder: FileNode = {
            id,
            name,
            path,
            type: 'folder',
            children: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          
          newFiles.set(path, folder);
          
          // Update parent folder's children
          if (parentPath && parentPath !== '/') {
            const parent = newFiles.get(parentPath);
            if (parent && parent.type === 'folder') {
              parent.children = [...(parent.children || []), path];
              parent.updatedAt = Date.now();
            }
          }
          
          return { files: newFiles };
        });
      },

      getFileContent: (path: string) => {
        return get().files.get(path)?.content;
      },

      getFilesByPath: (parentPath: string) => {
        const files = Array.from(get().files.values());
        
        if (parentPath === '/') {
          return files.filter(file => {
            const parts = file.path.split('/').filter(Boolean);
            return parts.length === 1;
          }).sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'folder' ? -1 : 1;
          });
        }
        
        const parent = get().files.get(parentPath);
        if (!parent || parent.type !== 'folder') return [];
        
        return (parent.children || [])
          .map(childPath => get().files.get(childPath))
          .filter((file): file is FileNode => file !== undefined)
          .sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'folder' ? -1 : 1;
          });
      },

      getAllFiles: () => {
        return Array.from(get().files.values());
      },

      toggleFolder: (path: string) => {
        set((state) => {
          const newExpanded = new Set(state.expandedFolders);
          if (newExpanded.has(path)) {
            newExpanded.delete(path);
          } else {
            newExpanded.add(path);
          }
          return { expandedFolders: newExpanded };
        });
      },

      isExpanded: (path: string) => {
        return get().expandedFolders.has(path);
      },

      fileExists: (path: string) => {
        return get().files.has(path);
      },

      initializeProject: async () => {
        const { currentProjectId, loadProjectFiles, createFolder, createFile, files } = get();
        
        console.log('[FileSystem] Initializing project, files count:', files.size);
        
        // If we have a project ID, use database
        if (currentProjectId) {
          console.log('[FileSystem] Using database for project:', currentProjectId);
          try {
            await projectService.initializeProjectFiles(currentProjectId);
            await loadProjectFiles(currentProjectId);
            console.log('[FileSystem] Project loaded from database');
            return;
          } catch (error) {
            console.error('[FileSystem] Error initializing from database:', error);
          }
        }

        // Initialize in-memory (for non-authenticated users or when database fails)
        console.log('[FileSystem] Initializing in-memory project');
        
        // Always create core structure if files are empty
        if (files.size === 0) {
          console.log('[FileSystem] Creating all core files and folders from CORE_PROJECT_FILES');
          
          // Extract all unique folder paths from CORE_PROJECT_FILES
          const folderSet = new Set<string>();
          CORE_PROJECT_FILES.forEach(coreFile => {
            const parts = coreFile.path.split('/');
            for (let i = 1; i < parts.length; i++) {
              folderSet.add(parts.slice(0, i).join('/'));
            }
          });
          
          // Create folders in order (parent before child)
          const folders = Array.from(folderSet).sort();
          folders.forEach(folder => {
            if (folder && !files.has(folder)) {
              createFolder(folder);
              console.log('[FileSystem] Created folder:', folder);
            }
          });
          
          // Create ALL core files (including mobile files)
          for (const coreFile of CORE_PROJECT_FILES) {
            await createFile(coreFile.path, coreFile.content);
            console.log('[FileSystem] Created file:', coreFile.path);
          }
          
          console.log('[FileSystem] Project initialization complete');
        } else {
          console.log('[FileSystem] Files already exist, skipping initialization');
        }
      },

      resetProject: () => {
        set({
          files: new Map(),
          expandedFolders: new Set(['src', 'src/app', 'public', 'src/components', 'src/pages']),
          currentProjectId: null,
        });
      },
    }),
    {
      name: 'file-system-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          return {
            state: {
              files: new Map(data.state.files || []),
              expandedFolders: new Set(data.state.expandedFolders || ['src', 'public', 'src/components', 'src/pages', 'src/hooks', 'src/lib', 'mobile', 'mobile/src', 'mobile/src/components', 'mobile/src/pages', 'mobile/public', 'mobile/ios', 'mobile/android']),
              currentProjectId: data.state.currentProjectId || null,
            },
          };
        },
        setItem: (name, value) => {
          const str = JSON.stringify({
            state: {
              files: Array.from(value.state.files.entries()),
              currentProjectId: value.state.currentProjectId,
              expandedFolders: Array.from(value.state.expandedFolders),
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
