/**
 * Fitness & Health App Business Blueprint
 */

export const fitnessBlueprint = {
  businessType: 'Fitness & Health App',
  
  requiredPages: [
    // Public Pages
    'Home', 'Features', 'Workout Programs', 'Trainers', 'Nutrition Plans',
    'Success Stories', 'Pricing', 'Blog', 'About Us', 'Contact', 'FAQ',
    
    // User Portal
    'Dashboard', 'My Workouts', 'Workout Calendar', 'Today\'s Workout',
    'Exercise Library', 'Workout History', 'Progress Tracking', 'Body Measurements',
    'Weight Tracking', 'Progress Photos', 'Achievements & Badges', 'My Profile',
    'Goals', 'Nutrition Plan', 'Meal Tracker', 'Calorie Counter', 'Water Intake',
    'Sleep Tracking', 'Activity Feed', 'Challenges', 'Leaderboards',
    
    // Workout Experience
    'Workout Player', 'Exercise Instructions', 'Video Demonstrations',
    'Rest Timer', 'Set & Rep Tracker', 'Workout Completion', 'Workout Summary',
    
    // Social Features
    'Community Feed', 'Friends', 'Challenges with Friends', 'Group Challenges',
    'Messages', 'Trainer Chat',
    
    // Trainer Portal
    'Trainer Dashboard', 'My Clients', 'Create Workout Plan', 'Assign Workouts',
    'Client Progress', 'Client Messages', 'Earnings', 'Schedule',
    
    // Premium Features
    'Personal Training', 'Live Classes', 'On-Demand Videos', 'Nutrition Coaching',
    'Meal Plans', 'Recipe Library', 'Shopping Lists',
    
    // Settings & Account
    'Account Settings', 'Profile', 'Subscription', 'Payment Methods',
    'Notification Settings', 'Privacy Settings', 'Connected Devices',
    'Wearable Integration',
    
    // Admin Panel
    'Admin Dashboard', 'User Management', 'Trainer Management', 'Content Management',
    'Workout Library', 'Exercise Database', 'Subscription Management',
    'Analytics & Reports', 'Settings',
    
    // Legal
    'Terms of Service', 'Privacy Policy', 'Health Disclaimer', 'Cookie Policy',
    'Trainer Agreement', 'Refund Policy'
  ],
  
  requiredModules: [
    'Workout Tracking System', 'Exercise Library with Videos', 'Progress Tracking',
    'Body Measurements & Photos', 'Weight & Body Composition Tracking',
    'Calendar & Scheduling', 'Nutrition Tracking', 'Calorie Counter',
    'Meal Planning', 'Recipe Database', 'Water Intake Tracker', 'Sleep Tracking',
    'Wearable Device Integration (Apple Health, Google Fit, Fitbit)',
    'Video Player for Workouts', 'Rest Timer', 'Rep & Set Counter',
    'Achievement & Badge System', 'Challenge System', 'Leaderboards',
    'Social Feed & Activity Sharing', 'Friend System', 'Messaging System',
    'Live Streaming for Classes', 'On-Demand Video Library',
    'Personal Trainer Matching', 'Trainer-Client Communication',
    'Subscription Management', 'Payment Processing', 'Push Notifications',
    'Reminder Notifications', 'Analytics Dashboard'
  ],
  
  recommendedFlows: [
    'Sign Up → Set Goals → Body Assessment → Select Program → Start First Workout → Track Progress → Complete Workouts → Achieve Goal → Celebrate → Set New Goal',
    'View Today\'s Workout → Start Workout → Follow Video → Track Reps & Sets → Rest Timer → Complete Exercise → Move to Next → Finish Workout → Log Stats → Share Achievement',
    'Track Meal → Search Food → Log Portions → View Calories → Check Daily Progress → Adjust Plan',
    'Join Challenge → Invite Friends → Complete Workouts → Earn Points → Check Leaderboard → Win Badge',
    'Book Trainer → Schedule Session → Video Call → Get Feedback → Assign Workout Plan → Follow Plan'
  ],
  
  industrySpecificFeatures: [
    'Personalized workout plans based on goals (weight loss, muscle gain, endurance)',
    'Exercise video library with form demonstrations',
    'Workout timer with rest intervals',
    'Rep and set tracking with progression',
    'Body measurement tracking (weight, body fat %, muscle mass)',
    'Progress photos with before/after comparison',
    'Workout calendar with scheduled sessions',
    'Reminder notifications for workouts',
    'Streak tracking for consistency',
    'Achievement badges and milestones',
    'Custom workout builder',
    'Exercise substitution based on equipment',
    'Difficulty levels (Beginner, Intermediate, Advanced)',
    'Workout duration filters (15min, 30min, 45min, 60min)',
    'Muscle group targeting',
    'Calorie and macro tracking',
    'Barcode scanner for food logging',
    'Meal plan generator based on calories and preferences',
    'Recipe library with nutrition info',
    'Water intake reminders',
    'Sleep quality tracking',
    'Integration with wearables (heart rate, steps, calories burned)',
    'Social challenges and competitions',
    'Friend activity feed',
    'Private messaging with trainers',
    'Live class schedule',
    'On-demand workout videos',
    'Personal training booking',
    'Virtual coaching sessions',
    'Form check video submissions to trainer'
  ],
  
  adminRequirements: [
    'User management', 'Trainer management and verification',
    'Workout program creation', 'Exercise database management',
    'Video content library', 'Nutrition database management',
    'Subscription analytics', 'User engagement metrics',
    'Workout completion rates', 'Challenge management',
    'Content moderation', 'Payment processing'
  ],
  
  legalRequirements: [
    'Terms of Service', 'Privacy Policy', 'Health & Fitness Disclaimer',
    'Medical Advice Disclaimer', 'Cookie Policy', 'Trainer Agreement',
    'User Generated Content Policy', 'Refund Policy'
  ],
  
  paymentRequirements: {
    methods: ['Credit Card', 'Debit Card', 'PayPal', 'Apple Pay', 'Google Pay',
              'In-app Purchase (iOS/Android)'],
    features: ['Subscription plans (Monthly, Quarterly, Annual)',
               'Personal training session booking and payment',
               'One-time program purchases', 'Free trial period',
               'Family plan pricing', 'Corporate wellness packages',
               'Refund processing']
  },
  
  notificationRequirements: [
    'Workout reminder (scheduled time)', 'Streak reminder (didn\'t workout today)',
    'Water intake reminder', 'Meal logging reminder', 'Progress milestone achieved',
    'New badge earned', 'Challenge invitation', 'Friend completed workout',
    'Challenge leaderboard update', 'New workout available', 'Trainer message',
    'Live class starting soon', 'Weekly progress summary', 'Monthly report'
  ],
  
  databaseSchema: {
    tables: ['users', 'profiles', 'goals', 'workouts', 'exercises', 'workout_logs',
             'exercise_logs', 'body_measurements', 'progress_photos', 'meals',
             'foods', 'nutrition_logs', 'water_logs', 'sleep_logs', 'achievements',
             'badges', 'challenges', 'challenge_participants', 'friendships',
             'trainers', 'training_sessions', 'subscriptions', 'payments']
  }
};
