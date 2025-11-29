export const AI_CHEAT_SHEET = `
# AI Quick Reference - Common Patterns

## CRITICAL FILE PATH RULES
✅ ALWAYS use full paths: src/components/MyComponent.tsx
✅ ALWAYS check existing file structure first
❌ NEVER use relative paths: components/MyComponent.tsx
❌ NEVER create placeholder paths

## BUILD PATTERNS

"build a login page" → Complete auth page with email, password, social login options, error handling, loading states
"create a dashboard" → Stats cards, charts, tables, sidebar navigation, responsive layout
"make a profile page" → Avatar, bio, activity feed, edit mode, settings tabs
"build a feed" → Posts grid/list, likes, comments, infinite scroll, loading skeleton
"create a navbar" → Logo, links, mobile hamburger menu, user dropdown, responsive
"make a hero section" → Large heading, description, CTA buttons, background image/gradient
"build a pricing page" → Pricing cards (3 tiers), feature lists, call-to-action, toggle annual/monthly
"create a footer" → Links sections, social icons, newsletter signup, copyright
"make a contact form" → Name, email, message fields, validation, submit with loading
"build a product card" → Image, title, price, add to cart button, hover effects

## UI COMPONENTS

"add a button" → Import Button component, use appropriate variant (default/secondary/outline/destructive)
"create a card" → Use Card, CardHeader, CardTitle, CardContent, CardFooter
"make a form" → Use react-hook-form with zod validation, Form components
"add a modal" → Use Dialog component, trigger button, content, actions
"create a table" → Use Table components, map data to rows, add sorting if requested
"add a dropdown" → Use DropdownMenu component with trigger and items
"make tabs" → Use Tabs, TabsList, TabsTrigger, TabsContent
"add alerts" → Use Alert component or toast notifications
"create progress bar" → Use Progress component with value prop
"add skeleton" → Use Skeleton component for loading states

## EDITING PATTERNS

"change button color" → Update variant or className with semantic tokens
"add section below X" → Insert new component after specified element
"remove the sidebar" → Delete sidebar component and adjust layout grid
"make it bigger" → Increase text size classes (text-xl, text-2xl, etc)
"center the content" → Add flex/grid centering classes
"add spacing" → Use Tailwind spacing (space-y-4, gap-4, p-4, etc)
"change font" → Update font family in tailwind.config.ts
"add animation" → Use Tailwind animate classes or framer-motion
"make responsive" → Add md: lg: xl: breakpoint classes
"add hover effect" → Add hover: classes or transitions

## BUG FIXES

"blank screen" → Check: Missing return, syntax errors, import errors, console errors
"button not working" → Check: onClick handler, disabled state, event propagation
"styles not applying" → Check: Class spelling, cn() usage, semantic tokens
"form not submitting" → Check: e.preventDefault(), button type="submit"
"undefined error" → Add: Optional chaining (?.), null checks, loading states
"infinite loop" → Check: useEffect dependencies, setState in render
"state not updating" → Check: Immutable updates, functional setState
"element type invalid" → Check: Import statements, named vs default exports

## DATA PATTERNS

"fetch data from API" → useEffect with fetch/supabase, loading + error states
"add search" → useState for search term, filter data array
"add pagination" → Track page number, slice data array, page controls
"add sorting" → Sort state, sort function, clickable headers
"add filters" → Filter state, filter functions, filter UI
"save to localStorage" → useEffect to save, useState initializer to load
"integrate Supabase" → Import client, use supabase.from('table')
"add authentication" → Use supabase.auth methods, protected routes
"upload files" → Use input type="file", supabase.storage.upload
"real-time updates" → Use supabase.channel().on('postgres_changes')

## STYLING PATTERNS

"use design system" → ALWAYS use semantic tokens (bg-background, text-foreground, etc)
"add gradient" → Use CSS variables from tailwind.config.ts
"dark mode" → Use semantic tokens (they auto-switch)
"add shadow" → Use shadow-sm, shadow-md, shadow-lg
"rounded corners" → Use rounded, rounded-md, rounded-lg
"add border" → Use border, border-2, border-primary
"glassmorphism" → bg-background/80 backdrop-blur-sm
"card elevation" → Combine shadow and border classes
"smooth transitions" → transition-all duration-300
"loading shimmer" → Use skeleton or custom shimmer animation

## PERFORMANCE

"lazy load images" → Use loading="lazy" attribute
"code splitting" → Use React.lazy() and Suspense
"memoize component" → Use React.memo()
"optimize re-renders" → Use useCallback, useMemo
"debounce input" → Custom debounce hook or lodash
"optimize images" → Use appropriate formats, sizes
"reduce bundle" → Check imports, remove unused code
"cache data" → Use React Query or SWR
"virtualize lists" → Use react-window for large lists
"prefetch data" → Load data before navigation

## COMMON MISTAKES TO AVOID

❌ Don't use relative imports without @
❌ Don't mutate state directly
❌ Don't forget e.preventDefault() in forms
❌ Don't use inline styles when Tailwind works
❌ Don't forget loading and error states
❌ Don't skip TypeScript types
❌ Don't use direct colors (use semantic tokens)
❌ Don't forget mobile responsiveness
❌ Don't skip accessibility (ARIA labels)
❌ Don't forget error boundaries

## BEST PRACTICES

✅ Always use TypeScript
✅ Always add loading states
✅ Always handle errors gracefully
✅ Always use semantic tokens for colors
✅ Always make responsive (mobile-first)
✅ Always add proper types/interfaces
✅ Always use Shadcn UI components
✅ Always follow existing patterns
✅ Always add proper comments
✅ Always test edge cases

## FILE ORGANIZATION

src/
  components/     → Reusable UI components
    ui/          → Shadcn components
  pages/         → Route pages
  hooks/         → Custom hooks
  lib/           → Utilities
  stores/        → State management
  config/        → Configuration files
  utils/         → Helper functions
  integrations/  → External integrations

## IMPORT PATTERNS

import { Component } from '@/components/ui/component';  // Shadcn
import { useState, useEffect } from 'react';           // React
import { useNavigate } from 'react-router-dom';         // Router
import { supabase } from '@/integrations/supabase/client';  // Supabase
import { cn } from '@/lib/utils';                       // Utils
import { useToast } from '@/hooks/use-toast';          // Toast
`;
