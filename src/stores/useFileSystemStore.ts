import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { projectService } from '@/services/projects/projectService';

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
        const { currentProjectId, loadProjectFiles, fileExists, createFolder, createFile } = get();
        
        // If we have a project ID, use database
        if (currentProjectId) {
          try {
            await projectService.initializeProjectFiles(currentProjectId);
            await loadProjectFiles(currentProjectId);
            return;
          } catch (error) {
            console.error('Error initializing project from database:', error);
          }
        }

        // Fallback: Initialize in-memory without database (for non-authenticated users)
        console.log('Initializing project in local memory (no authentication)');
        
        if (!fileExists('src')) {
          // Create web/desktop folders
          createFolder('src');
          createFolder('src/components');
          createFolder('src/pages');
          createFolder('src/hooks');
          createFolder('src/lib');
          createFolder('public');
          
          // Desktop/Web files
          await createFile('src/App.tsx', `import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to UR-DEV</h1>
      <p className="text-gray-400">Start building with AI assistance.</p>
    </div>
  );
}

export default App;`);
          
          await createFile('src/main.tsx', `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`);

          await createFile('src/index.css', `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
}`);

          await createFile('package.json', `{
  "name": "ur-dev-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.6.3",
    "vite": "^5.4.11"
  }
}`);

          await createFile('README.md', `# UR-DEV Project

Built with UR-DEV AI Assistant.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`
`);

          await createFile('index.html', `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>UR-DEV Project</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);

          await createFile('public/robots.txt', `User-agent: *
Allow: /`);
        }

          // Ensure mobile structure exists even for existing projects
          if (!fileExists('mobile')) {
            // Create mobile folders
            createFolder('mobile');
            createFolder('mobile/src');
            createFolder('mobile/src/components');
            createFolder('mobile/src/pages');
            createFolder('mobile/public');
            createFolder('mobile/ios');
            createFolder('mobile/android');
            
            // Create mobile/public/preview.html placeholder
            await createFile('mobile/public/preview.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <title>Mobile Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white min-h-screen">
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="text-center space-y-4">
      <div class="text-6xl">📱</div>
      <h1 class="text-3xl font-bold">Mobile App Ready</h1>
      <p class="text-gray-300">Ask the AI to build your first mobile screen</p>
    </div>
  </div>
</body>
</html>`);

          // Mobile app files
          await createFile('mobile/src/MobileApp.tsx', `import React from 'react';

function MobileApp() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Mobile App</h1>
      <p className="text-gray-400">Start building your mobile app with AI assistance.</p>
    </div>
  );
}

export default MobileApp;`);
          
          await createFile('mobile/src/main.tsx', `import React from 'react';
import ReactDOM from 'react-dom/client';
import MobileApp from './MobileApp';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MobileApp />
  </React.StrictMode>
);`);

          await createFile('mobile/src/index.css', `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
}`);

          // Capacitor configuration
          await createFile('mobile/capacitor.config.ts', `import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.urdev.mobile',
  appName: 'UR-DEV Mobile',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  }
};

export default config;`);

          await createFile('mobile/package.json', `{
  "name": "ur-dev-mobile",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@capacitor/core": "^6.0.0",
    "@capacitor/ios": "^6.0.0",
    "@capacitor/android": "^6.0.0"
  },
  "devDependencies": {
    "@capacitor/cli": "^6.0.0",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.6.3",
    "vite": "^5.4.11"
  }
}`);

          await createFile('mobile/vite.config.ts', `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})`);

          await createFile('mobile/tsconfig.json', `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`);

          await createFile('mobile/tsconfig.node.json', `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`);

          await createFile('mobile/index.html', `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <title>UR-DEV Mobile App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);

          await createFile('mobile/README.md', `# UR-DEV Native Mobile App (Capacitor)

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
cd mobile
npm install
\`\`\`

### 2. Build Web App
\`\`\`bash
npm run build
\`\`\`

### 3. Add Native Platforms
\`\`\`bash
# Add iOS (requires macOS with Xcode)
npx cap add ios

# Add Android (requires Android Studio)
npx cap add android
\`\`\`

### 4. Sync Changes
After modifying code, sync to native platforms:
\`\`\`bash
npm run build
npx cap sync
\`\`\`

### 5. Open Native IDE
\`\`\`bash
# Open iOS in Xcode
npx cap open ios

# Open Android in Android Studio
npx cap open android
\`\`\`

## File Structure

- **src/** - React/TypeScript source code
- **dist/** - Built web app (auto-generated)
- **ios/** - iOS native project (created by \`npx cap add ios\`)
- **android/** - Android native project (created by \`npx cap add android\`)
- **capacitor.config.ts** - Capacitor configuration

## Important Notes

- The ios/ and android/ folders are NOT included initially
- Run \`npx cap add ios\` and \`npx cap add android\` to generate them
- Always run \`npm run build\` before \`npx cap sync\`
- You need Xcode (Mac) for iOS and Android Studio for Android
`);

          // Platform placeholders
          await createFile('mobile/ios/README.md', `# iOS Platform

This folder will be created when you run:

\`\`\`bash
npx cap add ios
\`\`\`

Requirements:
- macOS with Xcode installed
- iOS development certificates

After running the command above, this folder will contain your full Xcode project.
`);

          await createFile('mobile/android/README.md', `# Android Platform

This folder will be created when you run:

\`\`\`bash
npx cap add android
\`\`\`

Requirements:
- Android Studio installed
- Android SDK configured

After running the command above, this folder will contain your full Android Studio project.
`);
        }
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
