/**
 * UR-DEV Project Initializer
 * Complete starter template - auto-creates all files for a production-ready app
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
 * COMPLETE STARTER PROJECT FILES
 * All files needed for a working Lovable-style project
 */
export const CORE_PROJECT_FILES: CoreFile[] = [
  // ========== MAIN PAGES ==========
  {
    id: 'index-page',
    name: 'Index.tsx',
    path: 'src/pages/Index.tsx',
    language: 'tsx',
    required: true,
    content: `import { Hero } from "@/components/Hero";
import { Header } from "@/components/ui/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
    </div>
  );
};

export default Index;`
  },
  {
    id: 'app-page',
    name: 'page.tsx',
    path: 'src/app/page.tsx',
    language: 'tsx',
    required: true,
    content: `import { Hero } from "@/components/Hero";
import { Header } from "@/components/ui/Header";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
    </div>
  );
}`
  },
  {
    id: 'not-found',
    name: 'NotFound.tsx',
    path: 'src/pages/NotFound.tsx',
    language: 'tsx',
    required: true,
    content: `import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;`
  },

  // ========== COMPONENTS ==========
  {
    id: 'hero',
    name: 'Hero.tsx',
    path: 'src/components/Hero.tsx',
    language: 'tsx',
    required: true,
    content: `export const Hero = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
          Build Your Dream App
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start creating beautiful, responsive web applications with our AI-powered platform.
        </p>
        <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors">
          Get Started
        </button>
      </div>
    </section>
  );
};`
  },

  {
    id: 'header',
    name: 'Header.tsx',
    path: 'src/components/ui/Header.tsx',
    language: 'tsx',
    required: true,
    content: `import { NavLink } from "./NavLink";

export const Header = () => {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-foreground">UR-DEV</div>
        <nav className="flex gap-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>
      </div>
    </header>
  );
};`
  },

  {
    id: 'navlink',
    name: 'NavLink.tsx',
    path: 'src/components/ui/NavLink.tsx',
    language: 'tsx',
    required: true,
    content: `import { Link } from "react-router-dom";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export const NavLink = ({ href, children }: NavLinkProps) => {
  return (
    <Link
      to={href}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  );
};`
  },

  {
    id: 'product-card',
    name: 'ProductCard.tsx',
    path: 'src/components/ui/ProductCard.tsx',
    language: 'tsx',
    required: true,
    content: `interface ProductCardProps {
  title: string;
  description: string;
  image?: string;
}

export const ProductCard = ({ title, description, image }: ProductCardProps) => {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow">
      {image && (
        <img src={image} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-card-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};`
  },

  // ========== HOOKS ==========
  {
    id: 'use-mobile',
    name: 'use-mobile.tsx',
    path: 'src/hooks/use-mobile.tsx',
    language: 'tsx',
    required: true,
    content: `import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(\`(max-width: \${MOBILE_BREAKPOINT - 1}px)\`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}`
  },

  {
    id: 'use-toast',
    name: 'use-toast.ts',
    path: 'src/hooks/use-toast.ts',
    language: 'typescript',
    required: true,
    content: `import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, title, description, variant };
    setToasts((prev) => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
    
    return { id };
  }, []);

  return { toast, toasts };
}`
  },

  // ========== LIB ==========
  {
    id: 'utils',
    name: 'utils.ts',
    path: 'src/lib/utils.ts',
    language: 'typescript',
    required: true,
    content: `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`
  },

  // ========== ROOT FILES ==========
  {
    id: 'app-tsx',
    name: 'App.tsx',
    path: 'src/App.tsx',
    language: 'tsx',
    required: true,
    content: `import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;`
  },

  {
    id: 'main-tsx',
    name: 'main.tsx',
    path: 'src/main.tsx',
    language: 'tsx',
    required: true,
    content: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`
  },

  {
    id: 'app-css',
    name: 'App.css',
    path: 'src/App.css',
    language: 'css',
    required: true,
    content: ``
  },

  {
    id: 'index-css',
    name: 'index.css',
    path: 'src/index.css',
    language: 'css',
    required: true,
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`
  },

  {
    id: 'vite-env',
    name: 'vite-env.d.ts',
    path: 'src/vite-env.d.ts',
    language: 'typescript',
    required: true,
    content: `/// <reference types="vite/client" />`
  },

  // ========== PUBLIC FILES ==========
  {
    id: 'robots',
    name: 'robots.txt',
    path: 'public/robots.txt',
    language: 'text',
    required: true,
    content: `User-agent: *
Allow: /`
  },

  // ========== ROOT CONFIG FILES ==========
  {
    id: 'index-html',
    name: 'index.html',
    path: 'index.html',
    language: 'html',
    required: true,
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>UR-DEV App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
  },

  {
    id: 'package-json',
    name: 'package.json',
    path: 'package.json',
    language: 'json',
    required: true,
    content: `{
  "name": "ur-dev-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}`
  },

  {
    id: 'tailwind-config',
    name: 'tailwind.config.ts',
    path: 'tailwind.config.ts',
    language: 'typescript',
    required: true,
    content: `import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;`
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
