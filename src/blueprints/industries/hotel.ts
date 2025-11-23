/**
 * Hotel & Hospitality Business Blueprint
 */

export const hotelBlueprint = {
  businessType: 'Hotel & Hospitality',
  
  requiredPages: [
    // Public Pages
    'Home', 'Rooms & Suites', 'Gallery', 'Location & Map', 'Reviews & Testimonials',
    'Amenities & Services', 'Dining & Restaurants', 'Special Offers', 'Contact Us',
    'About Us', 'FAQ', 'Blog',
    
    // Customer Portal
    'My Bookings', 'Booking History', 'Customer Profile', 'Payment Methods',
    'Saved Rooms', 'Messages with Hotel', 'Loyalty Program', 'Preferences',
    
    // Booking Flow
    'Search & Availability', 'Room Details', 'Booking Form', 'Guest Details',
    'Payment & Checkout', 'Booking Confirmation', 'Booking Management',
    
    // Staff Dashboard
    'Staff Dashboard', 'Today\'s Check-ins', 'Today\'s Check-outs', 'Room Status',
    'Current Guests', 'Housekeeping Tasks', 'Maintenance Requests', 'Guest Messages',
    
    // Admin Panel
    'Admin Dashboard', 'Room Inventory Management', 'Booking Management',
    'Guest Management', 'Staff Management', 'Rate & Pricing', 'Analytics & Reports',
    'Settings', 'Revenue Management', 'Channel Manager',
    
    // Legal & Compliance
    'Terms of Service', 'Privacy Policy', 'Cancellation Policy', 'Cookie Policy',
    'Refund Policy', 'Guest Rights'
  ],
  
  requiredModules: [
    'Real-time Availability System', 'Room Calendar Management', 'Dynamic Pricing Engine',
    'Payment Processing (Stripe/PayPal)', 'Booking Engine', 'Email Confirmations',
    'SMS Notifications', 'Push Notifications', 'Review System', 'Photo Gallery',
    'Map Integration', 'Multi-currency Support', 'Multi-language Support',
    'Channel Management Integration', 'Housekeeping Management', 'Maintenance Tracking',
    'Guest Communication System', 'Loyalty Program', 'Seasonal Pricing',
    'Group Bookings', 'Corporate Accounts', 'Analytics Dashboard'
  ],
  
  recommendedFlows: [
    'Search → Select Room → View Details → Check Availability → Guest Details → Payment → Confirmation → Email → Check-in → Stay → Check-out → Review',
    'Browse Rooms → Save Favorites → Compare Rooms → Book → Manage Booking → Modify/Cancel',
    'Guest Message → Staff Notification → Response → Guest Email',
    'Check-in → Room Assignment → Housekeeping Alert → Room Ready → Guest Welcome',
    'Check-out → Final Bill → Payment → Receipt → Review Request'
  ],
  
  industrySpecificFeatures: [
    'Real-time room availability calendar',
    'Season-based dynamic pricing',
    'Room category management (Standard, Deluxe, Suite)',
    'Amenities per room (WiFi, TV, Mini-bar, View)',
    'Bed type selection (King, Queen, Twin)',
    'Early check-in / Late check-out options',
    'Add-on services (Breakfast, Parking, Spa)',
    'Special requests handling',
    'Group booking discounts',
    'Corporate rate programs',
    'Guest history tracking',
    'Housekeeping schedule automation',
    'Maintenance request system',
    'Front desk operations dashboard',
    'Revenue per available room (RevPAR) analytics'
  ],
  
  adminRequirements: [
    'Room inventory management', 'Rate management', 'Booking calendar view',
    'Guest database', 'Staff management', 'Housekeeping assignments',
    'Maintenance logs', 'Financial reports', 'Occupancy analytics',
    'Revenue reports', 'Channel manager settings', 'Seasonal rates configuration'
  ],
  
  legalRequirements: [
    'Terms of Service (booking policies)', 'Privacy Policy (guest data)',
    'Cancellation & Refund Policy', 'Cookie Policy', 'Payment Security Notice',
    'Guest Rights & Responsibilities', 'Liability Disclaimers'
  ],
  
  paymentRequirements: {
    methods: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Cash on Arrival'],
    features: ['Deposit payment', 'Full payment', 'Refund processing', 'Invoice generation',
               'Payment scheduling', 'Multi-currency', 'Tax calculation']
  },
  
  notificationRequirements: [
    'Booking confirmation email', 'Payment receipt email', 'Check-in reminder (24h before)',
    'Check-in instructions email', 'Check-out reminder', 'Review request email',
    'Booking modification confirmation', 'Cancellation confirmation',
    'Special offer notifications', 'Loyalty rewards notifications'
  ],
  
  databaseSchema: {
    tables: ['rooms', 'bookings', 'guests', 'staff', 'payments', 'reviews', 
             'amenities', 'room_types', 'availability_calendar', 'rates', 
             'housekeeping_tasks', 'maintenance_requests', 'messages']
  }
};
