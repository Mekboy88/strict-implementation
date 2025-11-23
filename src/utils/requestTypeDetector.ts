export type RequestType = 
  | 'page'
  | 'component'
  | 'layout'
  | 'style'
  | 'feature'
  | 'state'
  | 'api'
  | 'config'
  | 'bugfix'
  | 'ui-improvement'
  | 'modify'
  | 'module';

export interface DetectedRequest {
  type: RequestType;
  entityName?: string;
  description: string;
  confidence: number;
}

export const detectRequestType = (userMessage: string): DetectedRequest => {
  const message = userMessage.toLowerCase();
  
  // Page detection
  if (
    message.includes('create a page') ||
    message.includes('new page') ||
    message.includes('add page') ||
    message.includes('build a page') ||
    message.match(/page (for|called|named)/)
  ) {
    const name = extractEntityName(message, ['page']);
    return {
      type: 'page',
      entityName: name,
      description: `Create new page: ${name || 'unnamed'}`,
      confidence: 0.9
    };
  }
  
  // Component detection
  if (
    message.includes('create a component') ||
    message.includes('new component') ||
    message.includes('add component') ||
    message.includes('sidebar') ||
    message.includes('navbar') ||
    message.includes('button') ||
    message.includes('card') ||
    message.includes('modal')
  ) {
    const name = extractEntityName(message, ['component', 'sidebar', 'navbar', 'button', 'card', 'modal']);
    return {
      type: 'component',
      entityName: name,
      description: `Create new component: ${name || 'unnamed'}`,
      confidence: 0.85
    };
  }
  
  // Layout detection
  if (
    message.includes('layout') ||
    message.includes('dashboard layout') ||
    message.includes('main layout')
  ) {
    const name = extractEntityName(message, ['layout']);
    return {
      type: 'layout',
      entityName: name,
      description: `Create layout: ${name || 'unnamed'}`,
      confidence: 0.85
    };
  }
  
  // Feature detection (complex, multi-file)
  if (
    message.includes('authentication') ||
    message.includes('auth system') ||
    message.includes('login system') ||
    message.includes('user management') ||
    message.includes('dashboard with') ||
    message.includes('full feature')
  ) {
    return {
      type: 'feature',
      entityName: 'authentication',
      description: 'Build complete feature with services, hooks, and context',
      confidence: 0.8
    };
  }
  
  // State/Store detection
  if (
    message.includes('state') ||
    message.includes('store') ||
    message.includes('context') ||
    message.includes('zustand') ||
    message.includes('redux')
  ) {
    return {
      type: 'state',
      description: 'Create state management',
      confidence: 0.75
    };
  }
  
  // API/Service detection
  if (
    message.includes('api') ||
    message.includes('service') ||
    message.includes('fetch') ||
    message.includes('backend')
  ) {
    return {
      type: 'api',
      description: 'Create API/service layer',
      confidence: 0.8
    };
  }
  
  // Style detection
  if (
    message.includes('style') ||
    message.includes('css') ||
    message.includes('make it look')
  ) {
    return {
      type: 'style',
      description: 'Update styles',
      confidence: 0.7
    };
  }
  
  // Bug fix detection
  if (
    message.includes('fix') ||
    message.includes('bug') ||
    message.includes('error') ||
    message.includes('not working')
  ) {
    return {
      type: 'bugfix',
      description: 'Fix existing code',
      confidence: 0.85
    };
  }
  
  // UI improvement
  if (
    message.includes('improve') ||
    message.includes('better') ||
    message.includes('enhance') ||
    message.includes('make the') ||
    message.includes('change the')
  ) {
    return {
      type: 'ui-improvement',
      description: 'Improve existing UI',
      confidence: 0.75
    };
  }
  
  // Module detection (large feature)
  if (
    message.includes('build a') ||
    message.includes('create an entire') ||
    message.includes('full system')
  ) {
    return {
      type: 'module',
      description: 'Build complete module',
      confidence: 0.7
    };
  }
  
  // Default: modification
  return {
    type: 'modify',
    description: 'Modify existing code',
    confidence: 0.5
  };
};

const extractEntityName = (message: string, keywords: string[]): string | undefined => {
  for (const keyword of keywords) {
    const patterns = [
      new RegExp(`${keyword}\\s+called\\s+([a-z0-9]+)`, 'i'),
      new RegExp(`${keyword}\\s+named\\s+([a-z0-9]+)`, 'i'),
      new RegExp(`${keyword}\\s+for\\s+([a-z0-9]+)`, 'i'),
      new RegExp(`([a-z0-9]+)\\s+${keyword}`, 'i'),
      new RegExp(`create\\s+(?:a\\s+)?([a-z0-9]+)\\s+${keyword}`, 'i'),
    ];
    
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
  }
  
  return undefined;
};
