/**
 * Product Blueprint Engine - Main Export
 * 
 * Central hub for accessing all business blueprints, page library, and module library.
 */

// Industry Blueprints
export { hotelBlueprint } from './industries/hotel';
export { restaurantBlueprint } from './industries/restaurant';
export { ecommerceBlueprint } from './industries/ecommerce';
export { socialBlueprint } from './industries/social';
export { educationBlueprint } from './industries/education';
export { saasBlueprint } from './industries/saas';
export { fitnessBlueprint } from './industries/fitness';
export { realEstateBlueprint } from './industries/realEstate';
export { healthcareBlueprint } from './industries/healthcare';

// Page Library
export { 
  pageLibrary, 
  getPagesByCategory, 
  getAllPageNames, 
  searchPages 
} from './pages/pageLibrary';

// Module Library
export { 
  moduleLibrary, 
  getModulesByCategory as getModulesByCategoryExport, 
  getAllModuleNames, 
  searchModules 
} from './modules/moduleLibrary';

/**
 * All available industry blueprints
 */
export const allIndustryBlueprints = {
  hotel: () => import('./industries/hotel').then(m => m.hotelBlueprint),
  restaurant: () => import('./industries/restaurant').then(m => m.restaurantBlueprint),
  ecommerce: () => import('./industries/ecommerce').then(m => m.ecommerceBlueprint),
  social: () => import('./industries/social').then(m => m.socialBlueprint),
  education: () => import('./industries/education').then(m => m.educationBlueprint),
  saas: () => import('./industries/saas').then(m => m.saasBlueprint),
  fitness: () => import('./industries/fitness').then(m => m.fitnessBlueprint),
  realEstate: () => import('./industries/realEstate').then(m => m.realEstateBlueprint),
  healthcare: () => import('./industries/healthcare').then(m => m.healthcareBlueprint),
};

/**
 * Get blueprint by business type keyword
 */
export const getBlueprintByKeyword = async (keyword: string) => {
  const lowerKeyword = keyword.toLowerCase();
  
  // Hotel & Hospitality
  if (lowerKeyword.includes('hotel') || lowerKeyword.includes('resort') || 
      lowerKeyword.includes('accommodation') || lowerKeyword.includes('booking')) {
    return await allIndustryBlueprints.hotel();
  }
  
  // Restaurant & Food
  if (lowerKeyword.includes('restaurant') || lowerKeyword.includes('food') ||
      lowerKeyword.includes('delivery') || lowerKeyword.includes('menu')) {
    return await allIndustryBlueprints.restaurant();
  }
  
  // E-commerce
  if (lowerKeyword.includes('shop') || lowerKeyword.includes('store') ||
      lowerKeyword.includes('ecommerce') || lowerKeyword.includes('marketplace')) {
    return await allIndustryBlueprints.ecommerce();
  }
  
  // Social Media
  if (lowerKeyword.includes('social') || lowerKeyword.includes('feed') ||
      lowerKeyword.includes('chat') || lowerKeyword.includes('messaging')) {
    return await allIndustryBlueprints.social();
  }
  
  // Education
  if (lowerKeyword.includes('education') || lowerKeyword.includes('learning') ||
      lowerKeyword.includes('course') || lowerKeyword.includes('tutor')) {
    return await allIndustryBlueprints.education();
  }
  
  // SaaS
  if (lowerKeyword.includes('saas') || lowerKeyword.includes('software') ||
      lowerKeyword.includes('platform') || lowerKeyword.includes('dashboard')) {
    return await allIndustryBlueprints.saas();
  }
  
  // Fitness
  if (lowerKeyword.includes('fitness') || lowerKeyword.includes('workout') ||
      lowerKeyword.includes('gym') || lowerKeyword.includes('health')) {
    return await allIndustryBlueprints.fitness();
  }
  
  // Real Estate
  if (lowerKeyword.includes('real estate') || lowerKeyword.includes('property') ||
      lowerKeyword.includes('house') || lowerKeyword.includes('apartment')) {
    return await allIndustryBlueprints.realEstate();
  }
  
  // Healthcare
  if (lowerKeyword.includes('health') || lowerKeyword.includes('medical') ||
      lowerKeyword.includes('doctor') || lowerKeyword.includes('telemedicine')) {
    return await allIndustryBlueprints.healthcare();
  }
  
  return null;
};
