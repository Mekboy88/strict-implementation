export const PAGE_BUILDING_TASKS = {
  landing: {
    patterns: [
      'create landing page', 'build landing page', 'home page',
      'hero section', 'features section', 'testimonials', 'pricing section',
      'call to action', 'CTA', 'footer section'
    ],
    instructions: `Use shadcn components to build landing pages with hero sections, feature grids, pricing cards, and testimonials.`,
    examples: ['SaaS landing page', 'Product landing', 'Portfolio landing', 'Event landing']
  },

  auth: {
    patterns: [
      'create login page', 'build auth page', 'sign in page',
      'registration page', 'signup page', 'forgot password',
      'reset password', 'email verification'
    ],
    instructions: `Build authentication pages with Supabase auth, form validation, and error handling.`,
    examples: ['Email/password login', 'Social auth login', 'Multi-step registration', 'Password reset flow']
  },

  dashboard: {
    patterns: [
      'create dashboard', 'build dashboard page', 'admin dashboard',
      'analytics dashboard', 'user dashboard', 'overview page',
      'stats page', 'metrics page'
    ],
    instructions: `Create dashboard layouts with stat cards, charts, tables, and responsive grids.`,
    examples: ['Admin dashboard', 'Analytics dashboard', 'User dashboard', 'Sales dashboard']
  },

  profile: {
    patterns: [
      'create profile page', 'user profile', 'account page',
      'edit profile', 'profile settings', 'account settings',
      'user settings page'
    ],
    instructions: `Build profile pages with avatars, bio sections, activity feeds, and tabbed navigation.`,
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
