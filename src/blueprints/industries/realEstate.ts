/**
 * Real Estate Platform Business Blueprint
 */

export const realEstateBlueprint = {
  businessType: 'Real Estate Platform',
  
  requiredPages: [
    // Public Pages
    'Home', 'Search Properties', 'Property Listings', 'Property Details',
    'Advanced Search', 'Map View', 'Featured Properties', 'New Listings',
    'About Us', 'How It Works', 'Blog', 'Market Insights', 'Agents', 'Contact',
    
    // Buyer/Renter Portal
    'My Account', 'Saved Properties', 'Search History', 'Saved Searches',
    'Property Alerts', 'Viewing Schedule', 'Mortgage Calculator', 'My Profile',
    'Messages with Agents', 'Application Status', 'Favorites',
    
    // Property Pages
    'Property Details', 'Photo Gallery', 'Virtual Tour', 'Floor Plans',
    'Neighborhood Info', 'Schools & Amenities', 'Price History', 'Similar Properties',
    'Schedule Viewing', 'Contact Agent', 'Make Offer',
    
    // Agent Portal
    'Agent Dashboard', 'My Listings', 'Add Property', 'Manage Listings',
    'Leads & Inquiries', 'Client Management', 'Viewing Appointments',
    'Analytics', 'Messages', 'Agent Profile', 'Earnings',
    
    // Seller Portal (For Sale by Owner)
    'Seller Dashboard', 'List Your Property', 'My Listings', 'Listing Analytics',
    'Inquiries', 'Viewing Requests', 'Offers Received', 'Documents',
    
    // Transaction Management
    'Offer Management', 'Document Signing', 'Transaction Timeline',
    'Payment Escrow', 'Inspection Reports', 'Contract Management',
    
    // Tools & Resources
    'Mortgage Calculator', 'Affordability Calculator', 'Property Valuation Tool',
    'Rent vs Buy Calculator', 'Moving Checklist', 'First-Time Buyer Guide',
    
    // Admin Panel
    'Admin Dashboard', 'Property Management', 'Agent Management', 'User Management',
    'Listing Approvals', 'Featured Listings', 'Analytics & Reports',
    'Commission Management', 'Settings', 'Content Management',
    
    // Legal
    'Terms of Service', 'Privacy Policy', 'Fair Housing Policy', 'Cookie Policy',
    'Agent Agreement', 'Seller Agreement', 'Buyer Agreement'
  ],
  
  requiredModules: [
    'Property Listing Management', 'Advanced Search & Filters', 'Map Integration',
    'Photo Gallery & Virtual Tours', 'Viewing Scheduling System', 'Lead Management',
    'Agent-Client Messaging', 'Property Alerts & Notifications', 'Saved Searches',
    'Mortgage Calculator', 'Property Valuation Tool', 'Comparison Tool',
    'Document Management', 'E-signature Integration', 'Offer Management System',
    'MLS Integration (Multiple Listing Service)', 'IDX Integration',
    'Payment Processing', 'Commission Tracking', 'CRM for Agents',
    'Email & SMS Notifications', 'Analytics Dashboard', 'Mobile App',
    'Neighborhood Data Integration', 'School Ratings', 'Crime Statistics'
  ],
  
  recommendedFlows: [
    'Search Properties → Filter Results → View on Map → Property Details → View Photos → Virtual Tour → Save Property → Contact Agent → Schedule Viewing → Attend Viewing → Make Offer → Negotiation → Accept Offer → Document Signing → Closing',
    'Agent Lists Property → Upload Photos → Add Details → Set Price → Submit for Approval → Approved → Goes Live → Buyer Inquires → Agent Responds → Schedule Viewing → Lead Nurturing → Offer Received → Closing',
    'Save Search Criteria → Receive Alerts → New Match → Email Notification → View Property → Add to Favorites → Compare Properties → Schedule Multiple Viewings → Decide',
    'Seller Signs Up → List Property (FSBO) → Upload Details → Pricing Recommendations → Goes Live → Manage Inquiries → Schedule Viewings → Receive Offers → Accept → Transaction Management'
  ],
  
  industrySpecificFeatures: [
    'Advanced search filters (price, beds, baths, sqft, property type, location)',
    'Map-based property search with cluster markers',
    'Draw search area on map',
    'Property comparison tool (side-by-side)',
    'Save searches with email alerts for new matches',
    'Virtual tours and 3D walkthroughs',
    'High-quality photo galleries',
    'Drone footage and aerial views',
    'Floor plans and blueprints',
    'Property history (price changes, days on market)',
    'Neighborhood information (schools, crime, transit, amenities)',
    'School district ratings and boundaries',
    'Walk score and transit score',
    'Price per square foot calculator',
    'Mortgage calculator with taxes and insurance',
    'Affordability calculator',
    'Property valuation estimate (Zestimate-like)',
    'Open house schedule',
    'Viewing appointment booking',
    'Direct messaging with listing agent',
    'Offer submission system',
    'Document upload and e-signature',
    'Transaction timeline and milestones',
    'Inspection report uploads',
    'Earnest money deposit tracking',
    'Closing date countdown',
    'Agent profile with reviews and past sales',
    'Recently sold properties in area',
    'Price drop alerts',
    'New listing alerts matching saved criteria',
    'Favorites list with notes'
  ],
  
  adminRequirements: [
    'Property listing approval', 'Agent verification and management',
    'User management', 'Featured listings management',
    'MLS/IDX integration settings', 'Commission structure management',
    'Transaction monitoring', 'Analytics and reporting',
    'Lead distribution rules', 'Payment processing',
    'Content management (blog, guides)', 'SEO optimization tools'
  ],
  
  legalRequirements: [
    'Terms of Service', 'Privacy Policy', 'Fair Housing Act Compliance',
    'Equal Opportunity Housing Statement', 'Cookie Policy',
    'Agent License Verification Requirements', 'Seller Agreement',
    'Buyer Agreement', 'MLS Terms of Use', 'Data Privacy (GDPR, CCPA)'
  ],
  
  paymentRequirements: {
    methods: ['Credit Card', 'Debit Card', 'Bank Transfer', 'Escrow Services'],
    features: ['Agent commission payments', 'Subscription fees for premium listings',
               'Featured listing fees', 'Lead generation payments',
               'Earnest money deposit escrow', 'Transaction fee processing',
               'Refund handling']
  },
  
  notificationRequirements: [
    'New property matches your saved search', 'Price drop on saved property',
    'Open house reminder', 'Viewing appointment confirmation',
    'Viewing appointment reminder (1 day before)', 'New message from agent',
    'Offer status update', 'Document ready for signature',
    'Inspection scheduled', 'Closing date approaching', 'Property sold',
    'New listing in your favorite neighborhood', 'Agent responded to inquiry',
    'Property you viewed got an offer', 'Market report for your area'
  ],
  
  databaseSchema: {
    tables: ['properties', 'agents', 'users', 'saved_searches', 'favorites',
             'viewings', 'messages', 'offers', 'documents', 'transactions',
             'neighborhoods', 'schools', 'amenities', 'property_photos',
             'agent_reviews', 'property_history', 'commissions', 'leads']
  }
};
