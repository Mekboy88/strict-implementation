/**
 * Restaurant & Food Delivery Business Blueprint
 */

export const restaurantBlueprint = {
  businessType: 'Restaurant & Food Delivery',
  
  requiredPages: [
    // Public Pages
    'Home', 'Menu', 'Special Offers', 'About Us', 'Our Story', 'Chef Profile',
    'Gallery', 'Reviews', 'Location', 'Contact', 'Reservations', 'Catering',
    
    // Customer Portal
    'My Orders', 'Order History', 'My Profile', 'Saved Addresses', 'Payment Methods',
    'Favorites', 'Loyalty Points', 'Preferences & Allergies',
    
    // Ordering Flow
    'Browse Menu', 'Item Details', 'Customize Order', 'Cart', 'Checkout',
    'Delivery Details', 'Payment', 'Order Confirmation', 'Track Order',
    
    // Kitchen Dashboard
    'Kitchen Dashboard', 'Active Orders', 'Pending Orders', 'Order Queue',
    'Order Details', 'Prep Time Management', 'Inventory Alerts',
    
    // Delivery Dashboard
    'Delivery Dashboard', 'Assigned Deliveries', 'Delivery Map', 'Delivery History',
    'Earnings', 'Navigation to Customer',
    
    // Admin Panel
    'Admin Dashboard', 'Menu Management', 'Order Management', 'Customer Management',
    'Staff Management', 'Delivery Fleet', 'Analytics & Reports', 'Inventory Management',
    'Settings', 'Marketing Campaigns', 'Revenue Reports',
    
    // Legal
    'Terms of Service', 'Privacy Policy', 'Refund Policy', 'Food Safety Policy'
  ],
  
  requiredModules: [
    'Menu Management System', 'Real-time Order Tracking', 'Kitchen Display System',
    'Delivery Management', 'Payment Processing', 'Table Reservation System',
    'Loyalty Program', 'Push Notifications', 'SMS Order Updates', 'Email Receipts',
    'Map Integration for Delivery', 'Delivery Time Estimation', 'Driver Assignment',
    'Inventory Management', 'Recipe Management', 'Multi-location Support',
    'Order Analytics', 'Customer Feedback System', 'Promo Code System',
    'Peak Hours Management', 'Dynamic Delivery Fees'
  ],
  
  recommendedFlows: [
    'Browse Menu → Select Items → Customize → Add to Cart → Checkout → Delivery Details → Payment → Confirmation → Kitchen Receives → Prepare → Ready → Assign Driver → Pickup → Delivery → Complete → Review',
    'Make Reservation → Confirmation → Reminder → Arrival → Seat → Order → Serve → Payment → Feedback',
    'Order Created → Kitchen Notified → Prep Started → Ready → Driver Assigned → Picked Up → In Transit → Delivered → Customer Rates'
  ],
  
  industrySpecificFeatures: [
    'Interactive menu with images and descriptions',
    'Dietary filters (Vegan, Vegetarian, Gluten-free, Halal)',
    'Allergen information per dish',
    'Customization options (spice level, toppings, sides)',
    'Combo meals and bundles',
    'Real-time kitchen order queue',
    'Prep time estimates per dish',
    'Table reservation with time slots',
    'Waitlist management',
    'QR code menu for dine-in',
    'Split bill functionality',
    'Tip calculation and collection',
    'Delivery zone management',
    'Peak hours surge pricing',
    'Group ordering for offices',
    'Scheduled orders for future delivery'
  ],
  
  adminRequirements: [
    'Menu item management (add/edit/remove)', 'Category management',
    'Pricing and availability control', 'Order queue management',
    'Kitchen staff assignments', 'Delivery driver management',
    'Customer database', 'Order history and analytics',
    'Revenue reports', 'Popular items analytics', 'Peak hours analysis',
    'Inventory tracking', 'Supplier management', 'Waste tracking'
  ],
  
  legalRequirements: [
    'Terms of Service', 'Privacy Policy', 'Refund & Cancellation Policy',
    'Food Safety & Hygiene Policy', 'Allergen Disclosure', 'Cookie Policy'
  ],
  
  paymentRequirements: {
    methods: ['Credit Card', 'Debit Card', 'PayPal', 'Apple Pay', 'Google Pay', 
              'Cash on Delivery', 'Wallet Balance'],
    features: ['Tip addition', 'Split payment', 'Refund processing', 'Invoice generation',
               'Loyalty points redemption', 'Promo code application']
  },
  
  notificationRequirements: [
    'Order confirmation', 'Order accepted by restaurant', 'Preparation started',
    'Order ready for pickup', 'Driver assigned', 'Driver picked up order',
    'Delivery in progress', 'Delivered successfully', 'Payment receipt',
    'Review request', 'Special offers', 'Loyalty rewards'
  ],
  
  databaseSchema: {
    tables: ['menu_items', 'categories', 'orders', 'order_items', 'customers', 
             'addresses', 'payments', 'reviews', 'delivery_drivers', 'reservations',
             'tables', 'ingredients', 'inventory', 'loyalty_points', 'promo_codes']
  }
};
