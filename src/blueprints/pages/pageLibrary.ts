/**
 * Complete Page Library
 * 
 * Comprehensive collection of all standard pages needed for modern applications.
 * Organized by category for easy discovery and implementation.
 */

export const pageLibrary = {
  // ========== PUBLIC / MARKETING PAGES ==========
  public: {
    'Home': 'Main landing page with hero section, features, and CTAs',
    'About Us': 'Company information, mission, vision, team',
    'Contact': 'Contact form, email, phone, address, map',
    'Pricing': 'Pricing plans, feature comparison, FAQs',
    'Features': 'Detailed product features and benefits',
    'How It Works': 'Step-by-step explanation of product/service',
    'Use Cases': 'Different use case scenarios and examples',
    'Customer Stories': 'Customer testimonials and success stories',
    'Case Studies': 'Detailed client case studies with metrics',
    'Testimonials': 'Customer reviews and feedback',
    'Blog': 'Blog listing page with categories and search',
    'Blog Post': 'Individual blog post page',
    'Resources': 'Resource library (guides, ebooks, templates)',
    'FAQ': 'Frequently asked questions',
    'Careers': 'Job listings and company culture',
    'Press': 'Press releases and media kit',
    'Partners': 'Partner program information',
    'Comparison': 'Product comparison with competitors',
    'Demo Request': 'Request demo form',
    'Free Trial': 'Free trial signup page',
  },
  
  // ========== AUTHENTICATION PAGES ==========
  auth: {
    'Sign Up': 'Registration form with email/password',
    'Login': 'Login form with remember me',
    'Forgot Password': 'Password reset request form',
    'Reset Password': 'New password entry form',
    'Email Verification': 'Verify email address page',
    'Two-Factor Authentication': '2FA code entry',
    '2FA Setup': 'Enable 2FA with QR code',
    'Social Login': 'OAuth login options (Google, GitHub, etc.)',
    'SSO Login': 'Single sign-on for enterprises',
    'Account Locked': 'Account locked notification',
    'Session Expired': 'Session timeout page',
  },
  
  // ========== USER ACCOUNT PAGES ==========
  user: {
    'Dashboard': 'Main user dashboard with overview',
    'Profile': 'User profile view',
    'Edit Profile': 'Edit user information',
    'Account Settings': 'Account preferences and settings',
    'Security Settings': 'Password, 2FA, security options',
    'Notification Settings': 'Email, push, SMS preferences',
    'Privacy Settings': 'Privacy and data preferences',
    'Billing': 'Billing history and payment methods',
    'Subscription': 'Subscription plan and usage',
    'Invoices': 'Invoice history and downloads',
    'Payment Methods': 'Manage payment methods',
    'Activity Log': 'User activity history',
    'Connected Apps': 'Third-party app connections',
    'API Keys': 'Manage API keys and tokens',
    'Webhooks': 'Webhook configuration',
    'Export Data': 'Download user data',
    'Delete Account': 'Account deletion page',
    'Notifications': 'Notification center',
    'Messages': 'User messaging inbox',
    'Favorites': 'Saved/favorited items',
    'Wishlist': 'User wishlist',
    'History': 'Activity/order/view history',
  },
  
  // ========== ADMIN & MANAGEMENT PAGES ==========
  admin: {
    'Admin Dashboard': 'Administrator overview dashboard',
    'Analytics': 'Platform analytics and insights',
    'User Management': 'Manage all users',
    'Content Management': 'Manage content (posts, pages, etc.)',
    'Settings': 'Platform settings and configuration',
    'Roles & Permissions': 'Role-based access control',
    'Team Management': 'Manage team members',
    'Audit Logs': 'System audit logs',
    'System Health': 'Platform health monitoring',
    'Reports': 'Generate and view reports',
    'Moderation Queue': 'Content moderation',
    'Flagged Content': 'Review reported content',
    'Banned Users': 'Manage banned/suspended users',
    'Feature Flags': 'Feature flag management',
    'A/B Tests': 'A/B test configuration',
    'Email Templates': 'Manage email templates',
    'Notifications Management': 'System notification settings',
  },
  
  // ========== TRANSACTION & COMMERCE PAGES ==========
  transaction: {
    'Shopping Cart': 'View cart and items',
    'Checkout': 'Checkout process',
    'Payment': 'Payment information entry',
    'Order Confirmation': 'Order confirmation page',
    'Order History': 'View past orders',
    'Order Details': 'Individual order details',
    'Track Order': 'Order tracking page',
    'Returns & Refunds': 'Return request page',
    'Invoice': 'Invoice view and download',
    'Receipt': 'Payment receipt',
    'Refund Status': 'Refund processing status',
  },
  
  // ========== LEGAL & COMPLIANCE PAGES ==========
  legal: {
    'Terms of Service': 'Terms and conditions',
    'Privacy Policy': 'Privacy policy and data handling',
    'Cookie Policy': 'Cookie usage policy',
    'GDPR Compliance': 'GDPR compliance information',
    'CCPA Compliance': 'CCPA compliance information',
    'Acceptable Use Policy': 'Acceptable use guidelines',
    'Refund Policy': 'Refund and cancellation policy',
    'Shipping Policy': 'Shipping terms and conditions',
    'Copyright Policy': 'Copyright and DMCA policy',
    'Data Processing Agreement': 'DPA for enterprise clients',
    'Service Level Agreement': 'SLA terms',
    'Security Policy': 'Security practices and compliance',
    'Accessibility Statement': 'Accessibility commitment',
  },
  
  // ========== SUPPORT & HELP PAGES ==========
  support: {
    'Help Center': 'Main help center page',
    'Knowledge Base': 'Searchable knowledge base',
    'FAQs': 'Frequently asked questions',
    'Support Tickets': 'Support ticket system',
    'Submit Ticket': 'Create new support ticket',
    'Ticket Status': 'View ticket status',
    'Live Chat': 'Live chat support interface',
    'Contact Support': 'Contact support form',
    'Community Forum': 'User community forum',
    'Documentation': 'Product documentation',
    'API Documentation': 'API reference docs',
    'Video Tutorials': 'Video tutorial library',
    'Guides': 'Step-by-step guides',
    'Status Page': 'System status and uptime',
    'Changelog': 'Product updates and changes',
    'Roadmap': 'Product roadmap',
  },
  
  // ========== MARKETING & CONVERSION PAGES ==========
  marketing: {
    'Landing Page': 'Targeted landing page',
    'Product Page': 'Individual product details',
    'Service Page': 'Service offering details',
    'Pricing Comparison': 'Pricing tier comparison',
    'Free Trial Landing': 'Free trial conversion page',
    'Demo Booking': 'Schedule demo page',
    'Webinar Registration': 'Webinar signup',
    'Event Registration': 'Event signup page',
    'Newsletter Signup': 'Newsletter subscription',
    'Download Resource': 'Resource download page',
    'Thank You': 'Post-conversion thank you page',
    'Coming Soon': 'Product launch teaser',
    'Waitlist': 'Join waitlist page',
  },
  
  // ========== ONBOARDING PAGES ==========
  onboarding: {
    'Welcome': 'Welcome new users',
    'Onboarding Tutorial': 'Interactive tutorial',
    'Setup Wizard': 'Multi-step setup wizard',
    'Profile Completion': 'Complete user profile',
    'Preferences Setup': 'Set user preferences',
    'First Project': 'Create first project guide',
    'Quick Start Guide': 'Getting started guide',
    'Feature Tour': 'Product feature walkthrough',
  },
  
  // ========== ERROR & STATUS PAGES ==========
  error: {
    '404 Not Found': 'Page not found',
    '500 Server Error': 'Internal server error',
    '403 Forbidden': 'Access denied',
    '401 Unauthorized': 'Authentication required',
    'Maintenance': 'Site maintenance page',
    'Offline': 'Offline mode page',
    'Rate Limited': 'Rate limit exceeded',
    'Suspended Account': 'Account suspended notice',
    'Expired Session': 'Session expired',
    'Payment Failed': 'Payment failure page',
    'Service Unavailable': '503 Service unavailable',
  }
};

/**
 * Get all pages for a specific category
 */
export const getPagesByCategory = (category: keyof typeof pageLibrary): Record<string, string> => {
  return pageLibrary[category];
};

/**
 * Get all page names across all categories
 */
export const getAllPageNames = (): string[] => {
  const allPages: string[] = [];
  Object.values(pageLibrary).forEach(category => {
    allPages.push(...Object.keys(category));
  });
  return allPages;
};

/**
 * Search for pages by keyword
 */
export const searchPages = (keyword: string): Array<{category: string, page: string, description: string}> => {
  const results: Array<{category: string, page: string, description: string}> = [];
  const lowerKeyword = keyword.toLowerCase();
  
  Object.entries(pageLibrary).forEach(([category, pages]) => {
    Object.entries(pages).forEach(([pageName, description]) => {
      if (
        pageName.toLowerCase().includes(lowerKeyword) ||
        description.toLowerCase().includes(lowerKeyword)
      ) {
        results.push({ category, page: pageName, description });
      }
    });
  });
  
  return results;
};
