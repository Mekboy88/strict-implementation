/**
 * Education & Learning Platform Business Blueprint
 */

export const educationBlueprint = {
  businessType: 'Education & Learning Platform',
  
  requiredPages: [
    // Public Pages
    'Home', 'Courses', 'Course Catalog', 'Categories', 'Instructors', 'About Us',
    'How It Works', 'Pricing Plans', 'Free Courses', 'Blog', 'Success Stories',
    'Corporate Training', 'Contact', 'FAQ',
    
    // Student Portal
    'My Courses', 'Course Dashboard', 'Video Lessons', 'Course Materials',
    'Assignments', 'Quizzes', 'Progress Tracking', 'Certificates', 'My Profile',
    'Learning Goals', 'Bookmarks', 'Notes', 'Discussion Forums', 'Live Classes Schedule',
    
    // Course Experience
    'Course Overview', 'Curriculum', 'Course Preview', 'Lesson Player',
    'Quiz Interface', 'Assignment Submission', 'Live Class Room', 'Discussion Board',
    'Course Reviews', 'Certificate View',
    
    // Instructor Portal
    'Instructor Dashboard', 'Create Course', 'Manage Courses', 'Course Analytics',
    'Student Management', 'Earnings & Payouts', 'Messages', 'Reviews Management',
    'Live Class Setup',
    
    // Admin Panel
    'Admin Dashboard', 'Course Management', 'User Management', 'Instructor Approvals',
    'Content Moderation', 'Analytics & Reports', 'Revenue Reports',
    'Marketing Tools', 'Settings', 'Category Management', 'Certificate Templates',
    
    // Legal
    'Terms of Service', 'Privacy Policy', 'Refund Policy', 'Cookie Policy',
    'Instructor Agreement', 'Student Code of Conduct'
  ],
  
  requiredModules: [
    'Course Management System', 'Video Hosting & Player', 'Quiz & Assessment System',
    'Assignment Submission & Grading', 'Progress Tracking', 'Certificate Generation',
    'Live Class Integration (Zoom/WebRTC)', 'Discussion Forums', 'Student Messaging',
    'Payment Processing', 'Enrollment System', 'Course Reviews & Ratings',
    'Search & Filter Courses', 'Recommendation Engine', 'Learning Path Builder',
    'Mobile App Support', 'Offline Download', 'Bookmark & Note-taking',
    'Instructor Analytics', 'Student Analytics', 'Gamification (Badges, Streaks)',
    'Email Notifications', 'Push Notifications', 'Calendar Integration',
    'Multi-language Support', 'Accessibility Features'
  ],
  
  recommendedFlows: [
    'Browse Courses → Filter by Category → Course Preview → Enroll → Payment → Access Course → Watch Lessons → Complete Quizzes → Submit Assignments → Complete Course → Receive Certificate → Review Course',
    'Student Signs Up → Browse Catalog → Add to Wishlist → Enroll in Course → Attend Live Class → Download Materials → Participate in Forum → Complete Assessment → Track Progress',
    'Instructor Applies → Admin Reviews → Approval → Create Course → Upload Videos → Create Quizzes → Set Pricing → Publish → Students Enroll → Teach → Receive Payouts'
  ],
  
  industrySpecificFeatures: [
    'Video lessons with playback speed control',
    'Interactive quizzes with instant feedback',
    'Assignment upload and grading system',
    'Progress bar and completion percentage',
    'Certificate of completion with verification',
    'Course curriculum with locked/unlocked lessons',
    'Live class scheduling and reminders',
    'Discussion forums per course',
    'Q&A section with instructor responses',
    'Downloadable course materials (PDFs, slides)',
    'Note-taking during video lessons',
    'Bookmark favorite sections',
    'Course rating and reviews',
    'Instructor profile with credentials',
    'Course preview (first 2 lessons free)',
    'Learning paths and bundles',
    'Student dashboard with all courses',
    'Progress tracking and analytics',
    'Reminder notifications for incomplete courses',
    'Mobile app for on-the-go learning',
    'Offline video download',
    'Subtitle support for videos',
    'Course completion badges',
    'Leaderboards for top students',
    'Course recommendations based on interests',
    'Gift course functionality',
    'Group enrollments for companies',
    'Course expiry date management',
    '30-day money-back guarantee'
  ],
  
  adminRequirements: [
    'Course approval and publishing', 'Instructor management and approvals',
    'Student database', 'Content quality control', 'Revenue and payout management',
    'Course analytics (enrollment, completion, ratings)', 'Refund processing',
    'Category and tag management', 'Certificate template management',
    'Marketing campaign tools', 'Coupon and discount management'
  ],
  
  legalRequirements: [
    'Terms of Service', 'Privacy Policy', 'Refund Policy', 'Cookie Policy',
    'Instructor Terms & Revenue Share Agreement', 'Student Code of Conduct',
    'Copyright and Content Policy', 'Accessibility Statement'
  ],
  
  paymentRequirements: {
    methods: ['Credit Card', 'Debit Card', 'PayPal', 'Apple Pay', 'Google Pay',
              'Bank Transfer', 'Installment Plans'],
    features: ['One-time course purchase', 'Subscription plans', 'Bundle pricing',
               'Coupon codes', 'Gift courses', 'Instructor revenue share',
               'Corporate billing', 'Refund processing', 'Invoice generation']
  },
  
  notificationRequirements: [
    'Course enrollment confirmation', 'New lesson available', 'Live class reminder (1 hour before)',
    'Assignment due reminder', 'Quiz available', 'Instructor response to Q&A',
    'New discussion reply', 'Course completion congratulations', 'Certificate ready',
    'New course from favorite instructor', 'Course recommendations', 'Special offers',
    'Progress milestone (50%, 75%, 100%)', 'Streak reminders'
  ],
  
  databaseSchema: {
    tables: ['users', 'instructors', 'courses', 'lessons', 'quizzes', 'questions',
             'assignments', 'enrollments', 'progress', 'certificates', 'reviews',
             'discussions', 'messages', 'payments', 'categories', 'tags',
             'live_classes', 'course_materials', 'notes', 'bookmarks']
  }
};
