import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Project = Tables<"projects">;
export type ProjectFile = Tables<"project_files">;

/**
 * Project Service
 * Manages project CRUD operations with Supabase backend
 */

export const projectService = {
  /**
   * Get all projects for the current user
   */
  async getUserProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get a single project by ID
   */
  async getProject(projectId: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error) {
      console.error("Error fetching project:", error);
      throw error;
    }

    return data;
  },

  /**
   * Create a new project
   */
  async createProject(name: string, description?: string): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const projectData: TablesInsert<"projects"> = {
      name,
      description: description || null,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from("projects")
      .insert(projectData)
      .select()
      .single();

    if (error) {
      console.error("Error creating project:", error);
      throw error;
    }

    return data;
  },

  /**
   * Update project details
   */
  async updateProject(projectId: string, updates: { name?: string; description?: string }): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", projectId)
      .select()
      .single();

    if (error) {
      console.error("Error updating project:", error);
      throw error;
    }

    return data;
  },

  /**
   * Delete a project and all its files
   */
  async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  /**
   * Get all files for a project
   */
  async getProjectFiles(projectId: string): Promise<ProjectFile[]> {
    const { data, error } = await supabase
      .from("project_files")
      .select("*")
      .eq("project_id", projectId)
      .order("file_path", { ascending: true });

    if (error) {
      console.error("Error fetching project files:", error);
      throw error;
    }

    return data || [];
  },

  /**
   * Create or update a file in a project
   */
  async saveFile(projectId: string, filePath: string, content: string): Promise<ProjectFile> {
    const fileType = filePath.split('.').pop() || 'txt';

    // Check if file already exists
    const { data: existing } = await supabase
      .from("project_files")
      .select("*")
      .eq("project_id", projectId)
      .eq("file_path", filePath)
      .single();

    if (existing) {
      // Update existing file
      const { data, error } = await supabase
        .from("project_files")
        .update({ file_content: content })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating file:", error);
        throw error;
      }

      return data;
    } else {
      // Create new file
      const fileData: TablesInsert<"project_files"> = {
        project_id: projectId,
        file_path: filePath,
        file_content: content,
        file_type: fileType,
      };

      const { data, error } = await supabase
        .from("project_files")
        .insert(fileData)
        .select()
        .single();

      if (error) {
        console.error("Error creating file:", error);
        throw error;
      }

      return data;
    }
  },

  /**
   * Delete a file from a project
   */
  async deleteFile(projectId: string, filePath: string): Promise<void> {
    const { error } = await supabase
      .from("project_files")
      .delete()
      .eq("project_id", projectId)
      .eq("file_path", filePath);

    if (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  },

  async initializeProjectFiles(projectId: string): Promise<void> {
    // First, ensure core web/desktop base files exist
    const baseFiles = [
      // Root config files
      {
        path: "package.json",
        content: `{
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
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.15",
    "typescript": "^5.6.3",
    "vite": "^5.4.11"
  }
}`
      },
      {
        path: "tsconfig.json",
        content: `{
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
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`
      },
      {
        path: "tsconfig.node.json",
        content: `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`
      },
      {
        path: "vite.config.ts",
        content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});`
      },
      {
        path: "tailwind.config.ts",
        content: `import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;`
      },
      {
        path: "postcss.config.js",
        content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`
      },
      {
        path: "index.html",
        content: `<!DOCTYPE html>
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
</html>`
      },
      {
        path: "README.md",
        content: `# UR-DEV Project

Built with UR-DEV AI Assistant.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`
`
      },
      // Source files
      {
        path: "src/main.tsx",
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
      },
      {
        path: "src/App.tsx",
        content: `import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to UR-DEV</h1>
      <p className="text-gray-400">Start building with AI assistance.</p>
    </div>
  );
}

export default App;`
      },
      {
        path: "src/index.css",
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`
      },
      {
        path: "src/App.css",
        content: `/* Add your custom styles here */`
      },
      {
        path: "src/vite-env.d.ts",
        content: `/// <reference types="vite/client" />`
      },
      // Public folder
      {
        path: "public/robots.txt",
        content: `User-agent: *
Allow: /`
      },
      // Folders structure markers (empty placeholder files)
      {
        path: "src/components/.gitkeep",
        content: ""
      },
      {
        path: "src/pages/.gitkeep",
        content: ""
      },
      {
        path: "src/hooks/.gitkeep",
        content: ""
      },
      {
        path: "src/lib/.gitkeep",
        content: ""
      },
    ];

    // Create all base web files (idempotent via saveFile)
    for (const file of baseFiles) {
      await this.saveFile(projectId, file.path, file.content);
    }

    // === Ensure mobile/Capacitor scaffold exists as well ===
    const { data: existingMobileFiles, error: mobileError } = await supabase
      .from("project_files")
      .select("id")
      .eq("project_id", projectId)
      .like("file_path", "mobile/%");

    if (mobileError) {
      console.error("Error checking mobile files:", mobileError);
      return;
    }

    if (existingMobileFiles && existingMobileFiles.length > 0) {
      // Mobile scaffold already exists; do not overwrite user files
      return;
    }

    const mobileFiles = [
      {
        path: "mobile/src/MobileApp.tsx",
        content: `import React from 'react';

function MobileApp() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Mobile App</h1>
      <p className="text-gray-400">Start building your mobile app with AI assistance.</p>
    </div>
  );
}

export default MobileApp;`
      },
      {
        path: "mobile/src/main.tsx",
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import MobileApp from './MobileApp';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MobileApp />
  </React.StrictMode>
);`
      },
      {
        path: "mobile/src/index.css",
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
}`
      },
      {
        path: "mobile/capacitor.config.ts",
        content: `import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.urdev.mobile',
  appName: 'UR-DEV Mobile',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
};

export default config;`
      },
      {
        path: "mobile/package.json",
        content: `{
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
}`
      },
      {
        path: "mobile/vite.config.ts",
        content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})`
      },
      {
        path: "mobile/tsconfig.json",
        content: `{
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
}`
      },
      {
        path: "mobile/tsconfig.node.json",
        content: `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`
      },
      {
        path: "mobile/index.html",
        content: `<!DOCTYPE html>
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
</html>`
      },
      {
        path: "mobile/README.md",
        content: `# UR-DEV Native Mobile App (Capacitor)

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
`
      },
      {
        path: "mobile/ios/.gitkeep",
        content: "",
      },
      {
        path: "mobile/android/.gitkeep",
        content: "",
      },
    ];

    for (const file of mobileFiles) {
      await this.saveFile(projectId, file.path, file.content);
    }
  },
};
