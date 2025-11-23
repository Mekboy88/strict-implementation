/**
 * Healthcare & Telemedicine Platform Business Blueprint
 */

export const healthcareBlueprint = {
  businessType: 'Healthcare & Telemedicine Platform',
  
  requiredPages: [
    // Public Pages
    'Home', 'How It Works', 'Find a Doctor', 'Specialties', 'Services',
    'Telemedicine', 'In-Person Care', 'Pricing', 'Insurance Coverage',
    'About Us', 'Blog', 'Health Library', 'FAQ', 'Contact', 'Careers',
    
    // Patient Portal
    'Patient Dashboard', 'My Appointments', 'Book Appointment', 'Doctor Search',
    'My Doctors', 'Medical Records', 'Prescriptions', 'Lab Results',
    'Billing & Payments', 'Insurance Info', 'My Profile', 'Health Tracker',
    'Messages with Doctors', 'Prescription Refill Requests', 'Family Members',
    
    // Appointment Experience
    'Book Appointment', 'Appointment Confirmation', 'Pre-Visit Questionnaire',
    'Virtual Waiting Room', 'Video Consultation', 'Visit Summary', 'Follow-up Care',
    
    // Doctor Portal
    'Doctor Dashboard', 'My Schedule', 'Today\'s Appointments', 'Patient Queue',
    'Patient Records', 'Write Prescription', 'Order Lab Tests', 'Visit Notes',
    'Billing & Claims', 'Messages', 'Doctor Profile', 'Availability Settings',
    
    // Video Consultation
    'Waiting Room', 'Video Call Interface', 'Screen Sharing', 'Document Sharing',
    'Prescription Pad', 'Visit Notes', 'End Call Summary',
    
    // Medical Records
    'Health History', 'Diagnoses', 'Medications', 'Allergies', 'Immunizations',
    'Lab Results', 'Imaging', 'Visit History', 'Family History',
    
    // Admin Panel
    'Admin Dashboard', 'Doctor Management', 'Patient Management',
    'Appointment Management', 'Billing Management', 'Insurance Management',
    'Analytics & Reports', 'Compliance Monitoring', 'Settings',
    'Telemedicine Platform Settings', 'Prescription Management',
    
    // Legal & Compliance
    'Terms of Service', 'Privacy Policy (HIPAA Compliant)', 'Notice of Privacy Practices',
    'Patient Rights', 'Cookie Policy', 'Consent Forms', 'Telehealth Consent',
    'Doctor Agreement', 'Insurance Policy'
  ],
  
  requiredModules: [
    'Appointment Scheduling System', 'Doctor Search & Filter', 'Video Consultation Platform',
    'Electronic Health Records (EHR)', 'Prescription Management System (e-Prescribing)',
    'Lab Results Integration', 'Billing & Payment Processing', 'Insurance Verification',
    'Patient-Doctor Messaging', 'Medical Record Sharing', 'Consent Management',
    'HIPAA-Compliant Data Storage', 'Audit Logging', 'Prescription Refill System',
    'Appointment Reminders', 'Telemedicine Platform', 'Waiting Room System',
    'Health Tracker (Vitals, Symptoms)', 'Family Account Management',
    'Document Upload & Sharing', 'Visit Notes & Summaries', 'Referral System',
    'Calendar Integration', 'Multi-language Support', 'Accessibility Features'
  ],
  
  recommendedFlows: [
    'Search Doctors → Filter by Specialty → View Doctor Profile → Check Availability → Book Appointment → Fill Pre-Visit Form → Receive Confirmation → Reminder Notification → Join Virtual Waiting Room → Video Consultation → Receive Prescription → View Visit Summary → Pay Bill → Follow-up Care',
    'Patient Signs Up → Complete Health Profile → Add Insurance Info → Search Doctor → Book First Appointment → Telemedicine Consultation → Receive Prescription → Pharmacy Delivers → Rate Doctor',
    'Doctor Reviews Schedule → Sees New Patient → Reviews Medical History → Conducts Consultation → Writes Prescription → Orders Lab Tests → Completes Visit Notes → Schedules Follow-up',
    'Request Prescription Refill → Doctor Reviews → Approves → Pharmacy Notified → Patient Picks Up',
    'Lab Results Ready → Doctor Reviews → Patient Notified → Patient Views Results → Message Doctor with Questions'
  ],
  
  industrySpecificFeatures: [
    'HIPAA-compliant video consultations',
    'Secure messaging between patient and doctor',
    'Electronic prescriptions sent directly to pharmacy',
    'Digital health records access',
    'Lab result viewing and interpretation',
    'Symptom checker tool',
    'Appointment scheduling with real-time availability',
    'Insurance verification and coverage check',
    'Co-pay and deductible calculator',
    'Prescription refill requests',
    'Medical history questionnaire',
    'Allergy and medication tracking',
    'Immunization records',
    'Vital signs tracking (blood pressure, glucose, weight)',
    'Family member accounts under one login',
    'Doctor ratings and reviews',
    'Specialist referral system',
    'Second opinion consultations',
    'Mental health services',
    'Urgent care vs scheduled care options',
    'Multi-device support (phone, tablet, desktop)',
    'Offline mode for medical records',
    'Emergency contact information',
    'Advanced directives and living will storage',
    'Medical ID card storage',
    'Appointment reminders via SMS/email/push',
    'Post-visit survey',
    'Health goal setting and tracking',
    'Integration with wearables (Apple Health, Fitbit)',
    'Medication reminder notifications'
  ],
  
  adminRequirements: [
    'Doctor credentialing and verification', 'License verification',
    'Patient management', 'Appointment oversight', 'Billing and claims management',
    'Insurance partner management', 'HIPAA compliance monitoring',
    'Audit log reviews', 'Platform usage analytics', 'Revenue reports',
    'Doctor performance metrics', 'Patient satisfaction scores',
    'Telemedicine quality monitoring', 'Prescription analytics',
    'Lab integration management', 'Pharmacy network management'
  ],
  
  legalRequirements: [
    'HIPAA Privacy Rule Compliance', 'HIPAA Security Rule Compliance',
    'Terms of Service', 'Privacy Policy', 'Notice of Privacy Practices',
    'Patient Rights & Responsibilities', 'Informed Consent for Treatment',
    'Telehealth Consent Form', 'Release of Information Authorization',
    'Doctor-Patient Agreement', 'Cookie Policy', 'Accessibility Statement',
    'State Medical Board Compliance', 'Prescription Monitoring Program Compliance'
  ],
  
  paymentRequirements: {
    methods: ['Credit Card', 'Debit Card', 'HSA/FSA Cards', 'Insurance Claims',
              'PayPal', 'Bank Transfer', 'Payment Plans'],
    features: ['Insurance claim submission', 'Co-pay collection', 'Deductible tracking',
               'Out-of-pocket max tracking', 'Itemized billing', 'Superbill generation',
               'Payment plans for large bills', 'Refund processing',
               'EOB (Explanation of Benefits) display', 'Pre-authorization tracking']
  },
  
  notificationRequirements: [
    'Appointment confirmation', 'Appointment reminder (24h before)', 'Appointment reminder (1h before)',
    'Doctor running late notification', 'Prescription ready at pharmacy', 'Lab results available',
    'New message from doctor', 'Prescription refill approved/denied', 'Referral sent',
    'Follow-up appointment needed', 'Immunization due', 'Annual check-up reminder',
    'Insurance verification complete', 'Bill ready for payment', 'Payment processed',
    'Pre-visit form incomplete', 'Telehealth link ready', 'Visit summary available'
  ],
  
  databaseSchema: {
    tables: ['patients', 'doctors', 'appointments', 'medical_records', 'prescriptions',
             'lab_results', 'diagnoses', 'medications', 'allergies', 'immunizations',
             'vitals', 'visit_notes', 'insurance_info', 'payments', 'claims',
             'messages', 'documents', 'consent_forms', 'audit_logs', 'family_members']
  }
};
