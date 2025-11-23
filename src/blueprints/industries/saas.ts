/**
 * SaaS Product Business Blueprint
 */

export const saasBlueprint = {
  businessType: 'SaaS Product',
  
  requiredPages: [
    // Public Marketing Pages
    'Home', 'Features', 'Pricing', 'Use Cases', 'Customer Stories', 'Resources',
    'Blog', 'Documentation', 'API Docs', 'About Us', 'Contact', 'Demo Request',
    'Free Trial Signup', 'Comparison Pages', 'Security & Compliance',
    
    // Authentication
    'Sign Up', 'Login', '2FA Setup', 'Forgot Password', 'Reset Password',
    'Email Verification', 'SSO Login',
    
    // Main Application
    'Dashboard', 'Analytics Overview', 'Projects/Workspaces', 'Settings',
    'User Management', 'Team Management', 'Billing & Subscription',
    'Usage & Limits', 'Integrations', 'API Keys', 'Webhooks', 'Notifications',
    
    // Onboarding
    'Welcome Tutorial', 'Quick Start Guide', 'Setup Wizard', 'First Project',
    
    // Account Management
    'Account Settings', 'Profile', 'Security', 'Notifications Preferences',
    'Billing History', 'Invoices', 'Payment Methods', 'Plan Management',
    'Usage Statistics', 'Audit Logs', 'Connected Apps',
    
    // Team & Collaboration
    'Team Members', 'Invite Users', 'Roles & Permissions', 'Team Settings',
    'Workspaces', 'Shared Resources',
    
    // Support
    'Help Center', 'Knowledge Base', 'Video Tutorials', 'Support Tickets',
    'Live Chat', 'Community Forum', 'Status Page', 'Changelog',
    
    // Admin Panel
    'Admin Dashboard', 'All Users', 'All Organizations', 'Subscription Management',
    'Revenue Analytics', 'Churn Analysis', 'Feature Usage', 'System Health',
    'Support Tickets', 'Settings',
    
    // Legal
    'Terms of Service', 'Privacy Policy', 'Cookie Policy', 'SLA Agreement',
    'Data Processing Agreement', 'Acceptable Use Policy', 'Security Policy'
  ],
  
  requiredModules: [
    'User Authentication & Authorization', 'Multi-tenant Architecture',
    'Role-Based Access Control (RBAC)', 'Team & Organization Management',
    'Subscription & Billing System', 'Usage Tracking & Metering',
    'API Management', 'Webhooks System', 'Email Notifications',
    'In-app Notifications', 'Analytics Dashboard', 'User Activity Tracking',
    'Audit Logging', 'Integration Marketplace', 'SSO (SAML, OAuth)',
    'Two-Factor Authentication', 'API Rate Limiting', 'Data Export',
    'Backup & Restore', 'Help Center & Documentation', 'Support Ticket System',
    'Live Chat Support', 'Onboarding Flows', 'Feature Flags',
    'A/B Testing Framework', 'Customer Success Dashboard'
  ],
  
  recommendedFlows: [
    'Sign Up → Email Verification → Onboarding Tutorial → Create First Project → Invite Team → Setup Integration → Start Using Product',
    'Free Trial → Use Product → Upgrade Prompt → Select Plan → Enter Payment → Confirm → Full Access',
    'User Invited → Accept Invitation → Set Password → Join Team → Assigned Role → Access Workspace',
    'Reach Usage Limit → Notification → View Plans → Upgrade → Increased Limits',
    'Create API Key → Copy Key → Integrate → Test → Production Use → Monitor Usage',
    'Support Request → Submit Ticket → Auto-response → Agent Assignment → Resolution → Feedback'
  ],
  
  industrySpecificFeatures: [
    'Multi-workspace/organization support',
    'Role-based permissions (Owner, Admin, Member, Viewer)',
    'Usage-based billing and metering',
    'Plan limits and quotas enforcement',
    'Subscription management (upgrade, downgrade, cancel)',
    'Invoice generation and payment history',
    'Team member invitations and management',
    'SSO integration for enterprises',
    'API keys and secret management',
    'Webhook configuration and testing',
    'Real-time collaboration features',
    'Activity feed and audit logs',
    'Data export functionality',
    'Integration marketplace',
    'OAuth app creation for API access',
    'Rate limiting and throttling',
    'Custom domain support',
    'White-labeling options',
    'Status page for system health',
    'Changelog and release notes',
    'Feature voting board',
    'Customer health scores',
    'Churn prediction',
    'NPS surveys',
    'Product analytics',
    'Funnel analysis',
    'Cohort analysis',
    'A/B testing',
    'Feature flags for gradual rollouts',
    'Data residency options (EU, US, etc.)'
  ],
  
  adminRequirements: [
    'Customer management', 'Subscription analytics', 'Revenue tracking',
    'Churn analysis', 'Feature adoption metrics', 'User activity monitoring',
    'Support ticket management', 'System health monitoring',
    'Usage analytics by customer', 'Payment failure tracking',
    'Trial conversion rates', 'Feature flag management',
    'A/B test results', 'API usage analytics'
  ],
  
  legalRequirements: [
    'Terms of Service', 'Privacy Policy', 'Cookie Policy',
    'Service Level Agreement (SLA)', 'Data Processing Agreement (DPA)',
    'Acceptable Use Policy', 'Security & Compliance Documentation',
    'GDPR Compliance Statement', 'SOC 2 Compliance', 'HIPAA Compliance (if applicable)'
  ],
  
  paymentRequirements: {
    methods: ['Credit Card', 'Debit Card', 'ACH Transfer', 'Wire Transfer', 
              'Purchase Order (Enterprise)'],
    features: ['Subscription billing', 'Usage-based billing', 'Annual vs Monthly plans',
               'Pro-rated upgrades/downgrades', 'Invoice generation', 'Payment retries',
               'Dunning management', 'Tax calculation by region', 'Multi-currency support',
               'Enterprise contract management']
  },
  
  notificationRequirements: [
    'Welcome email', 'Email verification', 'Trial ending soon (7 days, 3 days, 1 day)',
    'Trial expired', 'Payment successful', 'Payment failed', 'Subscription renewed',
    'Subscription cancelled', 'Team member invited', 'New team member joined',
    'Usage limit approaching', 'Usage limit reached', 'New feature announcement',
    'Scheduled maintenance', 'Security alert', 'API key regenerated',
    'Export ready for download', 'Support ticket response'
  ],
  
  databaseSchema: {
    tables: ['users', 'organizations', 'teams', 'team_members', 'subscriptions',
             'plans', 'invoices', 'payments', 'api_keys', 'webhooks', 'integrations',
             'audit_logs', 'notifications', 'support_tickets', 'usage_records',
             'feature_flags', 'experiments']
  }
};
