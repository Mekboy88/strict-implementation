export interface PageBuildingTask {
  patterns: string[];
  instructions: string;
  examples: string[];
}

export const PAGE_BUILDING_TASKS: Record<string, PageBuildingTask> = {
  landing: {
    patterns: [
      'create landing page', 'build landing page', 'home page',
      'hero section', 'features section', 'testimonials', 'pricing section',
      'call to action', 'CTA', 'footer section'
    ],
    instructions: `Create a complete landing page with:
- Hero section with headline, subheadline, and CTA button
- Features section with 3-6 feature cards with icons
- Testimonials section with customer quotes and avatars
- Pricing section with 2-3 pricing tiers
- Footer with links and social media icons
Use shadcn components for consistent styling.`,
    examples: ['SaaS landing page', 'Product landing', 'Portfolio landing', 'Event landing']
  },

  auth: {
    patterns: [
      'create login page', 'build auth page', 'sign in page',
      'registration page', 'signup page', 'forgot password',
      'reset password', 'email verification'
    ],
    instructions: `Create authentication pages with:
- Centered card with form fields
- Email and password inputs with validation
- Social login buttons (Google, GitHub)
- "Remember me" checkbox and "Forgot password" link
- Sign up link for new users
- Form validation and error states
Use Supabase auth integration when available.`,
    examples: ['Email/password login', 'Social auth login', 'Multi-step registration', 'Password reset flow']
  },

  dashboard: {
    patterns: [
      'create dashboard', 'build dashboard page', 'admin dashboard',
      'analytics dashboard', 'user dashboard', 'overview page',
      'stats page', 'metrics page'
    ],
    instructions: `Create a dashboard layout with:
- Sidebar navigation with menu items
- Top header with search and user menu
- Stat cards showing key metrics (4-6 cards)
- Charts for data visualization
- Recent activity table
- Responsive mobile layout with hamburger menu
Use recharts for charts and shadcn for UI components.`,
    examples: ['Admin dashboard', 'Analytics dashboard', 'User dashboard', 'Sales dashboard']
  },

  profile: {
    patterns: [
      'create profile page', 'user profile', 'account page',
      'edit profile', 'profile settings', 'account settings',
      'user settings page'
    ],
    instructions: `Create profile pages with:
- User avatar with upload functionality
- Bio and personal information display
- Tabbed sections (Overview, Activity, Settings)
- Edit mode with form fields
- Social links and connections
- Activity feed or timeline
- Responsive mobile layout
Use shadcn tabs and form components.`,
    examples: ['User profile view', 'Profile edit page', 'Account settings', 'Profile with tabs']
  },

  ecommerce: {
    patterns: [
      'create product page', 'product listing', 'product grid',
      'product detail page', 'shopping cart', 'checkout page',
      'order confirmation', 'product catalog'
    ],
    instructions: `Create e-commerce pages with product grids, detail views, shopping carts, and checkout flows.`,
    examples: ['Product catalog', 'Product details', 'Shopping cart', 'Checkout flow']
  }
};
