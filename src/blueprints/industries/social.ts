/**
 * Social Media Platform Business Blueprint
 */

export const socialBlueprint = {
  businessType: 'Social Media Platform',
  
  requiredPages: [
    // Public Pages
    'Landing Page', 'About', 'Features', 'Privacy Center', 'Community Guidelines',
    'Help Center', 'Blog', 'Careers',
    
    // Main App Pages
    'Feed', 'Stories', 'Reels/Videos', 'Explore', 'Search', 'Notifications',
    'Messages/Chat', 'Profile', 'Edit Profile', 'Settings', 'Friends/Followers',
    'Groups', 'Pages', 'Events', 'Marketplace', 'Gaming', 'Watch',
    
    // Creation & Publishing
    'Create Post', 'Upload Photo/Video', 'Create Story', 'Create Reel',
    'Go Live', 'Create Poll', 'Create Event', 'Create Group',
    
    // Content Pages
    'Post Details', 'Photo Viewer', 'Video Player', 'Story Viewer',
    'Profile Timeline', 'Group Feed', 'Page Feed', 'Event Details',
    
    // Social Features
    'Friend Requests', 'Suggested Friends', 'People You May Know',
    'Followers/Following Lists', 'Blocked Users', 'Saved Posts',
    'Your Activity', 'Memories',
    
    // Messaging
    'Message Inbox', 'Chat Conversation', 'Group Chats', 'Message Requests',
    'Voice/Video Call',
    
    // Admin & Moderation
    'Admin Dashboard', 'Content Moderation', 'User Reports', 'Banned Users',
    'Analytics Dashboard', 'Trending Topics', 'Platform Health',
    
    // Legal & Safety
    'Terms of Service', 'Privacy Policy', 'Community Guidelines', 'Cookie Policy',
    'Copyright Policy', 'Report Abuse', 'Safety Center'
  ],
  
  requiredModules: [
    'User Authentication & Authorization', 'Profile Management', 'Post Creation & Feed',
    'Photo & Video Upload', 'Stories System', 'Reels/Short Videos',
    'Live Streaming', 'Real-time Messaging', 'Notifications System',
    'Friend/Follow System', 'Like, Comment, Share System', 'Hashtag System',
    'Search & Discovery', 'Groups & Communities', 'Pages Management',
    'Events System', 'Content Recommendation Algorithm', 'Trending Topics',
    'Content Moderation AI', 'Report & Block System', 'Privacy Controls',
    'Activity Tracking', 'Analytics Dashboard', 'Push Notifications',
    'Email Notifications', 'Media CDN Integration'
  ],
  
  recommendedFlows: [
    'Sign Up → Profile Setup → Find Friends → Follow Suggestions → First Post → Engage with Feed',
    'Create Post → Add Photo/Video → Add Caption → Tag Friends → Select Audience → Publish → Notify Followers → Appear in Feed',
    'View Post → Like → Comment → Reply → Share → Save',
    'Friend Request → Notification → Accept/Decline → Add to Friends → Share Posts',
    'Report Content → Moderation Queue → Review → Action (Remove/Warn/Ban) → Notify Reporter',
    'Send Message → Real-time Delivery → Read Receipt → Reply → Conversation History',
    'Upload Story → 24h Visibility → View Count → Reactions → Expires'
  ],
  
  industrySpecificFeatures: [
    'News feed with algorithmic ranking',
    'Story carousel with 24h expiry',
    'Reels/short-form video feed',
    'Live streaming with comments',
    'Real-time messaging with typing indicators',
    'Voice and video calling',
    'Emoji reactions (Like, Love, Wow, Sad, Angry)',
    'Comment threads and replies',
    'Tagging people in posts and photos',
    'Location tagging',
    'Hashtag discovery',
    'Trending topics section',
    'Friend suggestions algorithm',
    'Content recommendation engine',
    'Privacy settings (Public, Friends, Only Me, Custom)',
    'Story highlights',
    'Post scheduling',
    'Multiple account management',
    'Dark mode',
    'Activity status (Online, Active, Last seen)',
    'Read receipts',
    'Message reactions',
    'Group chats with admin controls',
    'Poll creation in posts',
    'GIF and sticker library',
    'Photo/video filters and editing',
    'Content archiving',
    'Download your data',
    'Account deactivation/deletion'
  ],
  
  adminRequirements: [
    'User management', 'Content moderation queue', 'Report handling',
    'Ban/suspend users', 'Platform analytics', 'User growth metrics',
    'Engagement metrics', 'Content metrics', 'Trending content tracking',
    'Spam detection', 'Abuse detection', 'Community guidelines enforcement',
    'Feature flags', 'A/B testing tools'
  ],
  
  legalRequirements: [
    'Terms of Service', 'Privacy Policy', 'Community Guidelines',
    'Copyright Policy (DMCA)', 'Cookie Policy', 'Data Protection (GDPR)',
    'Content Policy', 'Advertising Policies', 'Safety Center'
  ],
  
  paymentRequirements: {
    methods: ['In-app Purchases', 'Ad Revenue', 'Premium Subscriptions'],
    features: ['Ad-free experience', 'Premium features', 'Creator monetization',
               'Tipping system', 'Paid subscriptions to creators']
  },
  
  notificationRequirements: [
    'New follower', 'Friend request', 'Post like', 'Post comment',
    'Comment reply', 'Tag in post', 'Tag in photo', 'New message',
    'Message reaction', 'Group invitation', 'Event invitation',
    'Live video from friend', 'Mentioned in comment', 'Birthday reminder',
    'Memory from this day', 'Trending in your network', 'Suggested content'
  ],
  
  databaseSchema: {
    tables: ['users', 'profiles', 'posts', 'comments', 'likes', 'shares',
             'friendships', 'follows', 'messages', 'conversations', 'stories',
             'reels', 'groups', 'group_members', 'pages', 'events', 'notifications',
             'reports', 'blocks', 'saved_posts', 'hashtags', 'media_files']
  }
};
