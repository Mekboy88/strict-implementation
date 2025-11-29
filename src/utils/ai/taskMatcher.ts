import { UI_COMPONENTS_TASKS } from '@/config/aiTaskCategories/uiComponents';
import { PAGE_BUILDING_TASKS } from '@/config/aiTaskCategories/pageBuilding';
import { CODE_EDITING_TASKS } from '@/config/aiTaskCategories/codeEditing';
import { BUG_FIXING_TASKS } from '@/config/aiTaskCategories/bugFixing';

export interface TaskMatch {
  category: string;
  type: string;
  confidence: number;
  instructions: string;
  examples: string[];
}

export function matchTaskToPattern(userMessage: string): TaskMatch | null {
  const msg = userMessage.toLowerCase();

  // Bug fixing patterns
  if (msg.includes('error') || msg.includes('fix') || msg.includes('bug') || msg.includes('not working') || msg.includes('broken')) {
    return matchBugFixing(msg);
  }

  // Code editing patterns
  if (msg.includes('change') || msg.includes('update') || msg.includes('modify') || msg.includes('edit') || msg.includes('remove')) {
    return {
      category: 'editing',
      type: 'code_modification',
      confidence: 0.8,
      instructions: CODE_EDITING_TASKS.instructions,
      examples: CODE_EDITING_TASKS.examples
    };
  }

  // UI component patterns
  const uiMatch = matchUIComponent(msg);
  if (uiMatch) return uiMatch;

  // Page building patterns
  const pageMatch = matchPageBuilding(msg);
  if (pageMatch) return pageMatch;

  return null;
}

function matchBugFixing(msg: string): TaskMatch | null {
  const errors = BUG_FIXING_TASKS.commonErrors;

  if (msg.includes('blank') || msg.includes('white screen') || msg.includes('nothing showing')) {
    return {
      category: 'bug_fixing',
      type: 'blank_screen',
      confidence: 0.9,
      instructions: errors['blank screen'].solutions,
      examples: errors['blank screen'].causes
    };
  }

  if (msg.includes('element type') || msg.includes('invalid') || msg.includes('not a valid react component')) {
    return {
      category: 'bug_fixing',
      type: 'invalid_element',
      confidence: 0.9,
      instructions: errors['element type is invalid'].solutions,
      examples: errors['element type is invalid'].causes
    };
  }

  if (msg.includes('undefined') || msg.includes('cannot read property') || msg.includes('null')) {
    return {
      category: 'bug_fixing',
      type: 'undefined_error',
      confidence: 0.85,
      instructions: errors['cannot read property of undefined'].solutions,
      examples: errors['cannot read property of undefined'].causes
    };
  }

  if (msg.includes('button') && (msg.includes('not working') || msg.includes('not clicking'))) {
    return {
      category: 'bug_fixing',
      type: 'button_issue',
      confidence: 0.9,
      instructions: errors['button not working'].solutions,
      examples: errors['button not working'].causes
    };
  }

  if (msg.includes('style') || msg.includes('css') || msg.includes('not applying') || msg.includes('not showing')) {
    return {
      category: 'bug_fixing',
      type: 'styling_issue',
      confidence: 0.85,
      instructions: errors['styles not applying'].solutions,
      examples: errors['styles not applying'].causes
    };
  }

  if (msg.includes('form') && (msg.includes('not submit') || msg.includes('not working'))) {
    return {
      category: 'bug_fixing',
      type: 'form_issue',
      confidence: 0.9,
      instructions: errors['form not submitting'].solutions,
      examples: errors['form not submitting'].causes
    };
  }

  if (msg.includes('state') && (msg.includes('not updating') || msg.includes('not changing'))) {
    return {
      category: 'bug_fixing',
      type: 'state_issue',
      confidence: 0.85,
      instructions: errors['state not updating'].solutions,
      examples: errors['state not updating'].causes
    };
  }

  if (msg.includes('infinite loop') || msg.includes('too many renders') || msg.includes('maximum update depth')) {
    return {
      category: 'bug_fixing',
      type: 'infinite_loop',
      confidence: 0.9,
      instructions: errors['infinite loop'].solutions,
      examples: errors['infinite loop'].causes
    };
  }

  return {
    category: 'bug_fixing',
    type: 'general',
    confidence: 0.7,
    instructions: BUG_FIXING_TASKS.debuggingSteps,
    examples: []
  };
}

function matchUIComponent(msg: string): TaskMatch | null {
  // Check buttons
  if (msg.includes('button') && (msg.includes('create') || msg.includes('add') || msg.includes('make'))) {
    return {
      category: 'ui_components',
      type: 'button',
      confidence: 0.9,
      instructions: UI_COMPONENTS_TASKS.buttons.instructions,
      examples: UI_COMPONENTS_TASKS.buttons.examples
    };
  }

  // Check cards
  if (msg.includes('card') && (msg.includes('create') || msg.includes('add') || msg.includes('make'))) {
    return {
      category: 'ui_components',
      type: 'card',
      confidence: 0.9,
      instructions: UI_COMPONENTS_TASKS.cards.instructions,
      examples: UI_COMPONENTS_TASKS.cards.examples
    };
  }

  // Check forms
  if (msg.includes('form') && (msg.includes('create') || msg.includes('add') || msg.includes('make'))) {
    return {
      category: 'ui_components',
      type: 'form',
      confidence: 0.9,
      instructions: UI_COMPONENTS_TASKS.forms.instructions,
      examples: UI_COMPONENTS_TASKS.forms.examples
    };
  }

  // Check modals
  if ((msg.includes('modal') || msg.includes('dialog') || msg.includes('popup')) && 
      (msg.includes('create') || msg.includes('add') || msg.includes('make'))) {
    return {
      category: 'ui_components',
      type: 'modal',
      confidence: 0.9,
      instructions: UI_COMPONENTS_TASKS.modals.instructions,
      examples: UI_COMPONENTS_TASKS.modals.examples
    };
  }

  // Check navigation
  if ((msg.includes('navbar') || msg.includes('navigation') || msg.includes('menu') || msg.includes('sidebar')) &&
      (msg.includes('create') || msg.includes('add') || msg.includes('make'))) {
    return {
      category: 'ui_components',
      type: 'navigation',
      confidence: 0.9,
      instructions: UI_COMPONENTS_TASKS.navigation.instructions,
      examples: UI_COMPONENTS_TASKS.navigation.examples
    };
  }

  // Check tables
  if (msg.includes('table') && (msg.includes('create') || msg.includes('add') || msg.includes('make'))) {
    return {
      category: 'ui_components',
      type: 'table',
      confidence: 0.9,
      instructions: UI_COMPONENTS_TASKS.tables.instructions,
      examples: UI_COMPONENTS_TASKS.tables.examples
    };
  }

  // Check lists
  if (msg.includes('list') && (msg.includes('create') || msg.includes('add') || msg.includes('make'))) {
    return {
      category: 'ui_components',
      type: 'list',
      confidence: 0.9,
      instructions: UI_COMPONENTS_TASKS.lists.instructions,
      examples: UI_COMPONENTS_TASKS.lists.examples
    };
  }

  // Check alerts
  if ((msg.includes('alert') || msg.includes('toast') || msg.includes('notification')) &&
      (msg.includes('create') || msg.includes('add') || msg.includes('make'))) {
    return {
      category: 'ui_components',
      type: 'alert',
      confidence: 0.9,
      instructions: UI_COMPONENTS_TASKS.alerts.instructions,
      examples: UI_COMPONENTS_TASKS.alerts.examples
    };
  }

  // Check progress
  if ((msg.includes('progress') || msg.includes('loading') || msg.includes('spinner') || msg.includes('skeleton')) &&
      (msg.includes('create') || msg.includes('add') || msg.includes('make'))) {
    return {
      category: 'ui_components',
      type: 'progress',
      confidence: 0.9,
      instructions: UI_COMPONENTS_TASKS.progress.instructions,
      examples: UI_COMPONENTS_TASKS.progress.examples
    };
  }

  return null;
}

function matchPageBuilding(msg: string): TaskMatch | null {
  // Check landing page
  if ((msg.includes('landing') || msg.includes('home page') || msg.includes('hero')) &&
      (msg.includes('create') || msg.includes('build') || msg.includes('make'))) {
    return {
      category: 'page_building',
      type: 'landing',
      confidence: 0.9,
      instructions: PAGE_BUILDING_TASKS.landing.instructions,
      examples: PAGE_BUILDING_TASKS.landing.examples
    };
  }

  // Check auth pages
  if ((msg.includes('login') || msg.includes('sign in') || msg.includes('auth') || msg.includes('register') || msg.includes('sign up')) &&
      (msg.includes('create') || msg.includes('build') || msg.includes('make') || msg.includes('page'))) {
    return {
      category: 'page_building',
      type: 'auth',
      confidence: 0.9,
      instructions: PAGE_BUILDING_TASKS.auth.instructions,
      examples: PAGE_BUILDING_TASKS.auth.examples
    };
  }

  // Check dashboard
  if (msg.includes('dashboard') && (msg.includes('create') || msg.includes('build') || msg.includes('make'))) {
    return {
      category: 'page_building',
      type: 'dashboard',
      confidence: 0.9,
      instructions: PAGE_BUILDING_TASKS.dashboard.instructions,
      examples: PAGE_BUILDING_TASKS.dashboard.examples
    };
  }

  // Check profile
  if (msg.includes('profile') && (msg.includes('create') || msg.includes('build') || msg.includes('make') || msg.includes('page'))) {
    return {
      category: 'page_building',
      type: 'profile',
      confidence: 0.9,
      instructions: PAGE_BUILDING_TASKS.profile.instructions,
      examples: PAGE_BUILDING_TASKS.profile.examples
    };
  }

  // Check e-commerce
  if ((msg.includes('product') || msg.includes('shop') || msg.includes('cart') || msg.includes('checkout')) &&
      (msg.includes('create') || msg.includes('build') || msg.includes('make') || msg.includes('page'))) {
    return {
      category: 'page_building',
      type: 'ecommerce',
      confidence: 0.9,
      instructions: PAGE_BUILDING_TASKS.ecommerce.instructions,
      examples: PAGE_BUILDING_TASKS.ecommerce.examples
    };
  }

  return null;
}

export function getTaskSpecificGuidance(taskMatch: TaskMatch | null): string {
  if (!taskMatch) return '';

  return `
## TASK-SPECIFIC GUIDANCE

Category: ${taskMatch.category}
Type: ${taskMatch.type}
Confidence: ${(taskMatch.confidence * 100).toFixed(0)}%

### Instructions:
${taskMatch.instructions}

### Examples:
${taskMatch.examples.map((ex, i) => `${i + 1}. ${ex}`).join('\n')}

### CRITICAL REMINDERS FOR THIS TASK:
- Show FULL file paths in comments
- Use REAL file paths from the project
- Follow the design system (use semantic tokens)
- Add proper error handling
- Include loading states where applicable
- Use TypeScript types
- Follow existing code patterns
`;
}
