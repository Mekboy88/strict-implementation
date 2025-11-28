/**
 * Blueprint Injector
 * Auto-detects build type and injects relevant blueprint features
 */

import { 
  saasBlueprint,
  ecommerceBlueprint,
  socialBlueprint,
  restaurantBlueprint,
  hotelBlueprint,
  realEstateBlueprint,
  healthcareBlueprint,
  fitnessBlueprint,
  educationBlueprint,
  pageLibrary,
  moduleLibrary
} from '@/blueprints';

interface BlueprintMatch {
  blueprint: any;
  confidence: number;
  features: string[];
}

/**
 * Detects the most relevant blueprint based on user request
 */
export function detectBlueprint(request: string): BlueprintMatch | null {
  const requestLower = request.toLowerCase();
  
  const blueprints = [
    { 
      blueprint: saasBlueprint, 
      keywords: ['saas', 'subscription', 'api', 'dashboard', 'analytics', 'billing', 'team', 'workspace'],
      name: 'SaaS'
    },
    { 
      blueprint: ecommerceBlueprint, 
      keywords: ['shop', 'store', 'product', 'cart', 'checkout', 'payment', 'ecommerce', 'e-commerce'],
      name: 'E-commerce'
    },
    { 
      blueprint: socialBlueprint, 
      keywords: ['social', 'feed', 'post', 'follow', 'like', 'comment', 'profile', 'friend', 'message'],
      name: 'Social'
    },
    { 
      blueprint: restaurantBlueprint, 
      keywords: ['restaurant', 'menu', 'food', 'order', 'delivery', 'reservation', 'table'],
      name: 'Restaurant'
    },
    { 
      blueprint: hotelBlueprint, 
      keywords: ['hotel', 'booking', 'room', 'reservation', 'check-in', 'accommodation'],
      name: 'Hotel'
    },
    { 
      blueprint: realEstateBlueprint, 
      keywords: ['property', 'real estate', 'listing', 'apartment', 'house', 'rental'],
      name: 'Real Estate'
    },
    { 
      blueprint: healthcareBlueprint, 
      keywords: ['health', 'medical', 'doctor', 'appointment', 'patient', 'clinic', 'hospital'],
      name: 'Healthcare'
    },
    { 
      blueprint: fitnessBlueprint, 
      keywords: ['fitness', 'workout', 'exercise', 'gym', 'training', 'health'],
      name: 'Fitness'
    },
    { 
      blueprint: educationBlueprint, 
      keywords: ['education', 'course', 'learning', 'student', 'teacher', 'lesson', 'class'],
      name: 'Education'
    }
  ];
  
  let bestMatch: BlueprintMatch | null = null;
  let highestScore = 0;
  
  for (const { blueprint, keywords, name } of blueprints) {
    const matches = keywords.filter(keyword => requestLower.includes(keyword));
    const score = matches.length;
    
    if (score > highestScore) {
      highestScore = score;
      
      // Extract relevant features from blueprint
      const features: string[] = [];
      
      if (blueprint.requiredPages) {
        features.push(`Pages: ${blueprint.requiredPages.join(', ')}`);
      }
      
      if (blueprint.requiredModules) {
        features.push(`Modules: ${blueprint.requiredModules.join(', ')}`);
      }
      
      if (blueprint.industrySpecificFeatures) {
        features.push(`Features: ${blueprint.industrySpecificFeatures.join(', ')}`);
      }
      
      bestMatch = {
        blueprint,
        confidence: score / keywords.length,
        features
      };
    }
  }
  
  return bestMatch && highestScore > 0 ? bestMatch : null;
}

/**
 * Detects relevant page type from page library
 */
export function detectPageType(request: string): string[] {
  const requestLower = request.toLowerCase();
  const matchedPages: string[] = [];
  
  const pageCategories = pageLibrary as any;
  
  for (const category in pageCategories) {
    const pages = pageCategories[category];
    
    for (const pageName in pages) {
      const page = pages[pageName];
      const pageKeywords = [
        pageName.toLowerCase(),
        category.toLowerCase(),
        ...(page?.description?.toLowerCase().split(' ') || [])
      ];
      
      if (pageKeywords.some(keyword => requestLower.includes(keyword))) {
        matchedPages.push(`${category}/${pageName}: ${page?.description || ''}`);
      }
    }
  }
  
  return matchedPages;
}

/**
 * Detects relevant modules from module library
 */
export function detectModules(request: string): string[] {
  const requestLower = request.toLowerCase();
  const matchedModules: string[] = [];
  
  const moduleCategories = moduleLibrary as any;
  
  for (const category in moduleCategories) {
    const modules = moduleCategories[category];
    
    for (const moduleName in modules) {
      const module = modules[moduleName];
      const moduleKeywords = [
        moduleName.toLowerCase(),
        category.toLowerCase(),
        ...(module?.description?.toLowerCase().split(' ') || [])
      ];
      
      if (moduleKeywords.some(keyword => requestLower.includes(keyword))) {
        matchedModules.push(`${moduleName}: ${module?.description || ''}`);
      }
    }
  }
  
  return matchedModules;
}

/**
 * Generates blueprint context to inject into AI prompt
 */
export function generateBlueprintContext(request: string): string {
  const blueprint = detectBlueprint(request);
  const pageTypes = detectPageType(request);
  const modules = detectModules(request);
  
  if (!blueprint && pageTypes.length === 0 && modules.length === 0) {
    return '';
  }
  
  let context = '\n\n🎯 DETECTED BUILD CONTEXT:\n\n';
  
  if (blueprint) {
    context += `Industry: ${blueprint.blueprint.name || 'Unknown'}\n`;
    context += `Confidence: ${Math.round(blueprint.confidence * 100)}%\n\n`;
    context += `Relevant Features:\n${blueprint.features.map(f => `  • ${f}`).join('\n')}\n\n`;
  }
  
  if (pageTypes.length > 0) {
    context += `Relevant Page Types:\n${pageTypes.map(p => `  • ${p}`).join('\n')}\n\n`;
  }
  
  if (modules.length > 0) {
    context += `Suggested Modules:\n${modules.slice(0, 5).map(m => `  • ${m}`).join('\n')}\n\n`;
  }
  
  context += 'Use these blueprints and patterns to build a comprehensive, feature-rich implementation.\n';
  
  return context;
}
