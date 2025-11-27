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
 * THE 18 CORE FILES THAT MUST ALWAYS EXIST
 * This prevents ANY preview failures
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Welcome to UR-DEV</h1>
          <p className="text-lg text-gray-600">
            Your AI-powered development environment is ready!
          </p>
        </div>
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700 mb-2">
            <strong>👋 Start building:</strong>
          </p>
          <p className="text-sm text-gray-600">
            Use the AI chat to create pages, components, and features.
            Everything renders here automatically!
          </p>
        </div>
      </div>
    </main>
  )
}`
  },

  // 2. APP WRAPPER
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

  // 3. GLOBAL STYLES
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

  // 4. DEFAULT FALLBACK PAGE
  {
    id: 'default-page',
    name: 'default-page.tsx',
    path: 'src/app/default-page.tsx',
    language: 'tsx',
    required: true,
    content: `import React from 'react'

export default function DefaultPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">UR-DEV Preview</h1>
        <p className="text-gray-600">
          This is the fallback page. Use the AI chat to build your application!
        </p>
      </div>
    </div>
  )
}`
  },

  // 5. EMERGENCY FALLBACK
  {
    id: 'fallback-page',
    name: 'page.tsx',
    path: 'src/app/_fallback/page.tsx',
    language: 'tsx',
    required: true,
    content: `import React from 'react'

export default function FallbackPage() {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center border-2 border-red-200">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Emergency Fallback</h1>
        <p className="text-sm text-gray-600">
          The main page failed to load. Please use the AI to regenerate your application.
        </p>
      </div>
    </div>
  )
}`
  },

  // 6. APP ROOT WRAPPER
  {
    id: 'app-root',
    name: 'AppRoot.tsx',
    path: 'src/components/AppRoot.tsx',
    language: 'tsx',
    required: true,
    content: `import React from 'react'
import { ErrorBoundary } from './ErrorBoundary'

interface AppRootProps {
  children: React.ReactNode
}

export function AppRoot({ children }: AppRootProps) {
  return (
    <ErrorBoundary>
      <div className="app-root min-h-screen">
        {children}
      </div>
    </ErrorBoundary>
  )
}`
  },

  // 7. ERROR BOUNDARY
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
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg">
            <div className="text-4xl mb-4">💥</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
  },

  // 8. SYSTEM TOAST
  {
    id: 'system-toast',
    name: 'SystemToast.tsx',
    path: 'src/components/SystemToast.tsx',
    language: 'tsx',
    required: false,
    content: `import React from 'react'

interface SystemToastProps {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
}

export function SystemToast({ message, type = 'info' }: SystemToastProps) {
  const colors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  }

  return (
    <div className={\`fixed bottom-4 right-4 \${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50\`}>
      {message}
    </div>
  )
}`
  },

  // 9. SAFE RENDER UTILITY
  {
    id: 'safe-render',
    name: 'safeRender.ts',
    path: 'src/utils/safeRender.ts',
    language: 'typescript',
    required: false,
    content: `/**
 * Safe render utilities to prevent preview crashes
 */

export function safeRender<T>(
  renderFn: () => T,
  fallback: T
): T {
  try {
    return renderFn()
  } catch (error) {
    console.error('Safe render caught error:', error)
    return fallback
  }
}

export function safeParse<T>(
  json: string,
  fallback: T
): T {
  try {
    return JSON.parse(json)
  } catch (error) {
    console.error('Safe parse caught error:', error)
    return fallback
  }
}

export function safeStringify(
  obj: any,
  fallback: string = '{}'
): string {
  try {
    return JSON.stringify(obj, null, 2)
  } catch (error) {
    console.error('Safe stringify caught error:', error)
    return fallback
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
