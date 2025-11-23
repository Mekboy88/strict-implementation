/**
 * E-commerce & Marketplace Business Blueprint
 */

export const ecommerceBlueprint = {
  businessType: 'E-commerce & Marketplace',
  
  requiredPages: [
    // Public Pages
    'Home', 'Shop', 'Product Listing', 'Product Details', 'Categories', 'Brands',
    'Search Results', 'Special Offers', 'New Arrivals', 'Best Sellers', 'About Us',
    'Contact', 'Blog', 'FAQ', 'Shipping Info', 'Returns Policy',
    
    // Customer Portal
    'My Account', 'Order History', 'Track Order', 'Wishlist', 'Shopping Cart',
    'Saved Addresses', 'Payment Methods', 'Product Reviews', 'Loyalty Points',
    'Referral Program',
    
    // Checkout Flow
    'Shopping Cart', 'Checkout', 'Shipping Details', 'Payment', 'Order Review',
    'Order Confirmation', 'Order Tracking',
    
    // Seller Dashboard (for Marketplace)
    'Seller Dashboard', 'My Products', 'Add Product', 'Orders', 'Sales Analytics',
    'Payments & Payouts', 'Store Settings', 'Inventory', 'Customer Messages',
    
    // Admin Panel
    'Admin Dashboard', 'Product Management', 'Order Management', 'Customer Management',
    'Seller Management (Marketplace)', 'Inventory Management', 'Analytics & Reports',
    'Marketing Tools', 'Settings', 'Shipping Management', 'Returns Management',
    
    // Legal
    'Terms of Service', 'Privacy Policy', 'Return & Refund Policy', 'Shipping Policy',
    'Cookie Policy', 'Seller Agreement (Marketplace)'
  ],
  
  requiredModules: [
    'Product Catalog Management', 'Shopping Cart System', 'Checkout System',
    'Payment Gateway Integration', 'Inventory Management', 'Order Management System',
    'Shipping Integration', 'Order Tracking', 'Product Search & Filters',
    'Product Recommendations', 'Wishlist System', 'Review & Rating System',
    'Coupon & Discount System', 'Loyalty Program', 'Email Marketing',
    'Abandoned Cart Recovery', 'Multi-vendor Support (Marketplace)',
    'Commission System (Marketplace)', 'Analytics Dashboard', 'Customer Support Chat'
  ],
  
  recommendedFlows: [
    'Browse Products → Filter/Search → Product Details → Add to Cart → Continue Shopping → Cart Review → Checkout → Shipping Info → Payment → Confirmation → Order Processing → Shipped → Delivered → Review',
    'Product Page → Add to Wishlist → Later → Wishlist → Move to Cart → Checkout',
    'Abandoned Cart → Email Reminder → Return → Apply Discount → Complete Purchase',
    'Order Placed → Seller Notified → Seller Confirms → Packs → Ships → Tracking → Delivered → Payment Released to Seller'
  ],
  
  industrySpecificFeatures: [
    'Advanced product search with filters (price, brand, size, color, rating)',
    'Product variants (size, color, material)',
    'Bulk pricing and quantity discounts',
    'Related products and recommendations',
    'Product comparison tool',
    'Recently viewed products',
    'Stock availability indicators',
    'Product image zoom and gallery',
    'Customer reviews with photos',
    'Q&A section per product',
    'Wishlist with share functionality',
    'Gift wrapping options',
    'Product bundles and kits',
    'Pre-order functionality',
    'Back-in-stock notifications',
    'Size guides and charts',
    'Multi-currency and multi-language',
    'Tax calculation by location',
    'Shipping rate calculation',
    'Express shipping options'
  ],
  
  adminRequirements: [
    'Product catalog management', 'Inventory tracking', 'Order processing',
    'Customer database', 'Seller management (Marketplace)', 'Commission tracking',
    'Revenue reports', 'Sales analytics', 'Popular products tracking',
    'Low stock alerts', 'Return request management', 'Refund processing',
    'Marketing campaign management', 'Coupon code management'
  ],
  
  legalRequirements: [
    'Terms of Service', 'Privacy Policy', 'Return & Refund Policy',
    'Shipping & Delivery Policy', 'Cookie Policy', 'Consumer Rights',
    'Seller Terms (Marketplace)', 'Commission Structure (Marketplace)'
  ],
  
  paymentRequirements: {
    methods: ['Credit Card', 'Debit Card', 'PayPal', 'Apple Pay', 'Google Pay',
              'Buy Now Pay Later (Klarna, Afterpay)', 'Bank Transfer', 'Cash on Delivery'],
    features: ['Save payment methods', 'Refund processing', 'Partial refunds',
               'Invoice generation', 'Payment plans', 'Multi-currency support',
               'Tax calculation', 'Escrow for marketplace']
  },
  
  notificationRequirements: [
    'Order confirmation', 'Payment receipt', 'Order shipped', 'Out for delivery',
    'Delivered', 'Review request', 'Wishlist price drop', 'Back in stock alert',
    'Abandoned cart reminder', 'Special offers', 'New arrivals',
    'Order status updates', 'Return approved', 'Refund processed'
  ],
  
  databaseSchema: {
    tables: ['products', 'categories', 'brands', 'variants', 'inventory', 'orders',
             'order_items', 'customers', 'addresses', 'payments', 'reviews',
             'wishlists', 'carts', 'coupons', 'sellers', 'commissions', 'shipments']
  }
};
