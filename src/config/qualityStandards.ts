/**
 * Professional Quality Standards for AI Code Generation
 * Defines explicit quality tiers and requirements for generated code
 */

export const qualityTiers = {
  basic: {
    name: 'Basic',
    description: 'Minimal functional code',
    uiRequirements: ['Basic styling', 'Simple layout'],
    animationRequirements: ['None required'],
    dataRichness: ['Minimal sample data'],
    componentDepth: ['Single level components']
  },
  
  professional: {
    name: 'Professional',
    description: 'Production-ready with polish',
    uiRequirements: [
      'Glass-morphism effects (backdrop-blur)',
      'Subtle gradients (bg-gradient-to-r)',
      'Soft shadows (shadow-lg, shadow-xl)',
      'Rounded corners (rounded-xl, rounded-2xl)',
      'Consistent spacing (p-6, gap-4)',
      'Border accents (border border-white/20)'
    ],
    animationRequirements: [
      'Hover effects (hover:scale-105, hover:shadow-2xl)',
      'Entry animations (animate-fade-in, animate-slide-in)',
      'Transition classes (transition-all duration-300)',
      'Loading states (animate-pulse)',
      'Active states (active:scale-95)'
    ],
    dataRichness: [
      'Minimum 5-8 items in lists/grids',
      'Realistic names and descriptions',
      'Proper dates and timestamps',
      'Avatar images (ui-avatars.com)',
      'Product/content images (Unsplash API)',
      'Real-looking prices and metrics'
    ],
    componentDepth: [
      'Nested component structure',
      'State management (useState, useEffect)',
      'Props with TypeScript types',
      'Event handlers with proper typing',
      'Conditional rendering',
      'Error boundaries'
    ]
  },
  
  premium: {
    name: 'Premium',
    description: 'High-end with all bells and whistles',
    uiRequirements: [
      'All Professional requirements',
      'Advanced glass-morphism (backdrop-blur-2xl)',
      'Multi-layer gradients',
      'Dynamic shadows (shadow-2xl with color)',
      'Micro-interactions on hover',
      'Skeleton loading screens',
      'Empty state illustrations',
      'Error state designs'
    ],
    animationRequirements: [
      'All Professional requirements',
      'Staggered entry animations',
      'Complex keyframe animations',
      'Spring animations (framer-motion style)',
      'Parallax effects',
      'Scroll-triggered animations',
      'Modal/drawer slide animations',
      'Ripple effects on buttons'
    ],
    dataRichness: [
      'All Professional requirements',
      '10+ items minimum',
      'Rich metadata (tags, categories, status)',
      'User reviews and ratings',
      'Timestamps with relative dates',
      'Progress indicators',
      'Statistics and metrics',
      'Charts with data visualization'
    ],
    componentDepth: [
      'All Professional requirements',
      'Complex state management',
      'Custom hooks',
      'Context providers',
      'Optimistic updates',
      'Real-time features',
      'Advanced TypeScript generics',
      'Performance optimizations'
    ]
  }
};

export const mandatoryFeatures = {
  responsive: {
    breakpoints: ['mobile (375px)', 'tablet (768px)', 'desktop (1440px)'],
    requirements: [
      'Mobile-first approach',
      'Fluid typography (text-sm to text-4xl)',
      'Flexible grids (grid-cols-1 md:grid-cols-3)',
      'Collapsible navigation on mobile',
      'Touch-friendly buttons (min 44px height)',
      'No horizontal scroll on any device'
    ]
  },
  
  darkMode: {
    requirements: [
      'CSS variables for theming',
      'Dark mode variants (dark:bg-gray-900)',
      'Proper contrast ratios',
      'Icon color adjustments',
      'Border visibility in both modes'
    ]
  },
  
  accessibility: {
    requirements: [
      'Semantic HTML (header, main, nav, footer)',
      'ARIA labels on interactive elements',
      'Keyboard navigation support',
      'Focus visible states (focus:ring-2)',
      'Alt text on all images',
      'Color contrast WCAG AA minimum'
    ]
  },
  
  states: {
    loading: [
      'Skeleton screens (animate-pulse)',
      'Spinner components',
      'Progress bars',
      'Disabled button states'
    ],
    empty: [
      'Helpful illustrations',
      'Clear messaging',
      'Call-to-action buttons',
      'Suggestions for next steps'
    ],
    error: [
      'Error boundaries',
      'Error messages',
      'Retry buttons',
      'Fallback UI'
    ]
  }
};

export const visualChecklist = [
  '✓ Every card has shadow, border, and hover effect',
  '✓ Every button has hover, active, and disabled states',
  '✓ Every list has at least 5 realistic items',
  '✓ Page has smooth entry animations',
  '✓ Loading states are defined and visible',
  '✓ Empty states are designed',
  '✓ Smooth transitions on all interactive elements',
  '✓ Mobile responsive (tested at 375px)',
  '✓ Desktop optimized (tested at 1440px)',
  '✓ Images use proper aspect ratios',
  '✓ Text content is realistic and complete',
  '✓ No placeholder text or lorem ipsum',
  '✓ Dark mode support included',
  '✓ Icons are properly sized and colored',
  '✓ Forms have validation states'
];
