/**
 * Common Sense Build Templates
 * 
 * Defines standard features for common page types to ensure
 * complete, functional builds even with minimal user details.
 * 
 * @module utils/templates/commonSenseTemplates
 */

export interface PageTemplate {
  type: string;
  standardFeatures: string[];
  requiredComponents: string[];
}

/**
 * Standard features for common page types
 */
export const commonSenseTemplates: Record<string, PageTemplate> = {
  'feed': {
    type: 'feed',
    standardFeatures: [
      'Navigation bar with logo and menu',
      'Feed cards with profile pictures and posts',
      'Like and comment buttons',
      'Share functionality',
      'Profile mini section',
      'Sidebar with trending topics',
      'Infinite scroll placeholder',
      'Mobile responsive layout',
      'Real-looking sample posts (not lorem ipsum)',
    ],
    requiredComponents: ['navbar', 'feed-card', 'sidebar', 'profile-widget'],
  },
  
  'login': {
    type: 'login',
    standardFeatures: [
      'Email and password input fields',
      'Remember me checkbox',
      'Forgot password link',
      'Social login buttons (Google, GitHub)',
      'Sign up link for new users',
      'Form validation styling',
      'Beautiful gradient or image background',
      'Mobile responsive',
      'Loading states for submit button',
    ],
    requiredComponents: ['login-form', 'social-buttons'],
  },
  
  'register': {
    type: 'register',
    standardFeatures: [
      'Full name, email, password fields',
      'Password confirmation',
      'Terms and conditions checkbox',
      'Social registration options',
      'Password strength indicator',
      'Already have account? Sign in link',
      'Form validation with error messages',
      'Beautiful design matching login page',
      'Mobile responsive',
    ],
    requiredComponents: ['register-form', 'password-strength', 'social-buttons'],
  },
  
  'dashboard': {
    type: 'dashboard',
    standardFeatures: [
      'Sidebar navigation with menu items',
      'Header with user profile dropdown',
      'Stats cards showing key metrics',
      'Charts and graphs section',
      'Recent activity/transactions table',
      'Quick action buttons',
      'Search functionality',
      'Notifications indicator',
      'Dark/light theme compatible',
      'Fully responsive with mobile hamburger menu',
    ],
    requiredComponents: ['sidebar', 'header', 'stat-cards', 'charts', 'activity-table'],
  },
  
  'profile': {
    type: 'profile',
    standardFeatures: [
      'Large profile picture/avatar',
      'Cover photo section',
      'User bio and details',
      'Stats (followers, following, posts)',
      'Edit profile button',
      'Posts/activity feed',
      'About section with info',
      'Social media links',
      'Settings menu',
      'Mobile responsive layout',
    ],
    requiredComponents: ['profile-header', 'stats-widget', 'posts-grid', 'bio-section'],
  },
  
  'landing': {
    type: 'landing',
    standardFeatures: [
      'Hero section with headline and CTA',
      'Features section with icons',
      'Pricing cards/tiers',
      'Testimonials section',
      'FAQ accordion',
      'Footer with links and social',
      'Navigation with Sign in/Sign up',
      'Smooth scrolling between sections',
      'Mobile responsive',
      'Beautiful gradients and animations',
    ],
    requiredComponents: ['hero', 'features', 'pricing', 'testimonials', 'faq', 'footer'],
  },
  
  'settings': {
    type: 'settings',
    standardFeatures: [
      'Tabbed or sidebar navigation for sections',
      'Profile settings (name, email, avatar)',
      'Password change section',
      'Notification preferences',
      'Privacy settings',
      'Theme selection (dark/light)',
      'Delete account option',
      'Save changes button with confirmation',
      'Mobile responsive',
    ],
    requiredComponents: ['settings-tabs', 'profile-form', 'preferences', 'danger-zone'],
  },
};

/**
 * Gets standard features for a page type
 * 
 * @param {string} pageType - Type of page (feed, login, dashboard, etc.)
 * @returns {string[]} Array of standard features
 */
export const getStandardFeatures = (pageType: string): string[] => {
  const template = commonSenseTemplates[pageType.toLowerCase()];
  return template?.standardFeatures || [];
};

/**
 * Checks if page type has a common sense template
 * 
 * @param {string} pageType - Type of page
 * @returns {boolean} True if template exists
 */
export const hasCommonSenseTemplate = (pageType: string): boolean => {
  return pageType.toLowerCase() in commonSenseTemplates;
};

/**
 * Generates common sense build instructions for prompt
 * 
 * @param {string} pageType - Type of page being built
 * @returns {string} Instructions to include in AI prompt
 */
export const generateCommonSenseBuildInstructions = (pageType: string): string => {
  const template = commonSenseTemplates[pageType.toLowerCase()];
  
  if (!template) {
    return `Build a complete, functional ${pageType} page with all standard features that type of page would normally have.`;
  }
  
  return `Build a complete ${pageType} page including these REQUIRED features:

${template.standardFeatures.map((feature, i) => `${i + 1}. ${feature}`).join('\n')}

Make it production-ready with working UI, proper styling, and full mobile responsiveness.`;
};
