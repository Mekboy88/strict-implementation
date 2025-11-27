/**
 * UR-DEV Project Initializer
 * Ensures ALL critical files exist to prevent preview failures
 */

export interface CoreFile {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
  required: boolean;
}

/**
 * THE CORE FILES THAT MUST ALWAYS EXIST
 * Minimal set to prevent preview failures
 */
export const CORE_PROJECT_FILES: CoreFile[] = [
  // 1. MAIN ENTRY (CRITICAL)
  {
    id: 'page',
    name: 'page.tsx',
    path: 'src/app/page.tsx',
    language: 'tsx',
    required: true,
    content: `import React from 'react'

export default function Page() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          UR-DEV Project
        </h1>
        <p className="text-lg text-muted-foreground">
          Start building by chatting with the AI below
        </p>
      </div>
    </main>
  )
}`
  },

  // 2. APP WRAPPER (REQUIRED)
  {
    id: 'layout',
    name: 'layout.tsx',
    path: 'src/app/layout.tsx',
    language: 'tsx',
    required: true,
    content: `import React from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  )
}`
  },

  // 3. GLOBAL STYLES (REQUIRED)
  {
    id: 'globals',
    name: 'globals.css',
    path: 'src/app/globals.css',
    language: 'css',
    required: true,
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`
  },

  // 4. ERROR BOUNDARY (REQUIRED for stability)
  {
    id: 'error-boundary',
    name: 'ErrorBoundary.tsx',
    path: 'src/components/ErrorBoundary.tsx',
    language: 'tsx',
    required: true,
    content: `import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="max-w-lg">
            <h1 className="text-2xl font-bold text-foreground mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}`
  }
];

/**
 * Check which core files are missing
 */
export function getMissingCoreFiles(
  existingFiles: Array<{ path: string }>
): CoreFile[] {
  const existingPaths = new Set(existingFiles.map(f => f.path));
  return CORE_PROJECT_FILES.filter(coreFile => 
    coreFile.required && !existingPaths.has(coreFile.path)
  );
}

/**
 * Initialize project with all core files
 */
export function initializeProjectFiles(): CoreFile[] {
  return CORE_PROJECT_FILES;
}

/**
 * Get a default page content when page.tsx is missing
 */
export function getDefaultPageContent(): string {
  const pageFile = CORE_PROJECT_FILES.find(f => f.path === 'src/app/page.tsx');
  return pageFile?.content || '';
}

/**
 * Check if a file is a core required file
 */
export function isCoreRequiredFile(path: string): boolean {
  return CORE_PROJECT_FILES.some(f => f.path === path && f.required);
}
