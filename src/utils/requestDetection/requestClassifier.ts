/**
 * Request Classification Utility
 * 
 * Intelligently classifies user messages into three modes:
 * - CHAT: Conversational questions and explanations
 * - BUILD: Creating new pages, components, layouts, apps
 * - MODIFY: Updating existing files and code
 * 
 * @module utils/requestDetection/requestClassifier
 */

/**
 * Request mode classification
 */
export type RequestMode = 'chat' | 'build' | 'modify' | 'navigate';

/**
 * Classifies user message into the appropriate mode
 * 
 * @param {string} message - The user's input message
 * @returns {RequestMode} The detected mode
 * 
 * @example
 * ```typescript
 * classifyRequest("create a login page");  // 'build'
 * classifyRequest("why is my code broken?"); // 'chat'
 * classifyRequest("fix the header color"); // 'modify'
 * classifyRequest("go to login page"); // 'navigate'
 * ```
 */
export const classifyRequest = (message: string): RequestMode => {
  const lower = message.toLowerCase().trim();

  // PRIORITY 1: NAVIGATE MODE - Switching between pages
  if (isNavigateRequest(lower)) {
    return 'navigate';
  }

  // PRIORITY 2: CHAT MODE - Questions and conversational phrases
  // These MUST stay in chat mode regardless of other keywords
  if (isChatRequest(lower)) {
    return 'chat';
  }

  // PRIORITY 3: MODIFY MODE - Updating existing code/files
  if (isModifyRequest(lower)) {
    return 'modify';
  }

  // PRIORITY 4: BUILD MODE - Creating new files/pages/components
  if (isBuildRequest(lower)) {
    return 'build';
  }

  // DEFAULT: Treat as chat if nothing else matches
  return 'chat';
};

/**
 * Detects if message is a navigation request
 * 
 * @param {string} lower - Lowercase message
 * @returns {boolean} True if navigate request
 */
const isNavigateRequest = (lower: string): boolean => {
  const navigatePhrases = [
    'go to',
    'show me',
    'open the',
    'view the',
    'navigate to',
    'switch to',
    'load the',
    'display the',
  ];

  // Must contain navigation phrase + "page"
  return navigatePhrases.some(phrase => 
    lower.includes(phrase) && lower.includes('page')
  );
};

/**
 * Detects if message is a conversational chat request
 * 
 * @param {string} lower - Lowercase message
 * @returns {boolean} True if chat request
 */
const isChatRequest = (lower: string): boolean => {
  // Questions and explanatory phrases
  const chatIndicators = [
    'why ',
    'how ',
    'what ',
    'explain ',
    'help ',
    'show me ',
    'tell me ',
    'can you ',
    'could you ',
    'would you ',
    'do you ',
    'does ',
    'is ',
    'are ',
    'should ',
  ];

  // Check for question indicators
  if (lower.endsWith('?')) return true;
  if (chatIndicators.some(indicator => lower.startsWith(indicator))) return true;

  // Emotional/personal messages
  const personalPhrases = [
    'thank',
    'thanks',
    'appreciate',
    'awesome',
    'great',
    'perfect',
    'nice',
    'cool',
    'hello',
    'hi ',
    'hey ',
  ];

  if (personalPhrases.some(phrase => lower.includes(phrase))) return true;

  return false;
};

/**
 * Detects if message is a modify/update request
 * 
 * @param {string} lower - Lowercase message
 * @returns {boolean} True if modify request
 */
const isModifyRequest = (lower: string): boolean => {
  const modifyPhrases = [
    'fix this page',
    'fix the page',
    'change the color',
    'change color',
    'update the layout',
    'update layout',
    'add a button',
    'add button',
    'modify the',
    'modify this',
    'improve this',
    'improve the',
    'edit this',
    'edit the',
    'fix this',
    'fix the',
    'update this',
    'update the',
    'change this',
    'change the',
    'adjust this',
    'adjust the',
    'refactor this',
    'refactor the',
    'remove this',
    'remove the',
    'delete this',
    'delete the',
  ];

  return modifyPhrases.some(phrase => lower.includes(phrase));
};

/**
 * Detects if message is a build/create request
 * 
 * @param {string} lower - Lowercase message
 * @returns {boolean} True if build request
 */
const isBuildRequest = (lower: string): boolean => {
  // Comprehensive build phrases covering all common request patterns
  const buildPhrases = [
    // Core actions
    'build',
    'create',
    'make',
    'generate',
    'produce',
    'design',
    'construct',

    // Page triggers
    'build a page',
    'build page',
    'create a page',
    'create page',
    'make a page',
    'make page',
    'new page',
    'page with',
    'page for',

    // Specific pages
    'landing page',
    'home page',
    'homepage',
    'start page',
    'feed page',
    'news page',
    'profile page',
    'dashboard page',
    'admin page',
    'settings page',
    'about page',
    'contact page',
    'login page',
    'register page',
    'registration page',
    'sign up page',
    'sign-in page',
    'auth page',
    'form page',
    'reset password page',

    // Screens (mobile terminology)
    'screen for',
    'build screen',
    'create screen',
    'new screen',

    // Components
    'component for',
    'create component',
    'build component',
    'new component',
    'make component',
    'ui component',
    'form component',
    'button component',
    'card component',

    // Layouts
    'new layout',
    'create layout',
    'build layout',
    'layout for',
    'header layout',
    'footer layout',
    'sidebar layout',

    // Modules / features
    'module for',
    'build module',
    'feature for',
    'build feature',
    'create feature',

    // Sections
    'section for',
    'create section',
    'build section',
    'hero section',
    'footer section',
    'pricing section',

    // Apps / templates
    'build full app',
    'create app',
    'full html',
    'full website',
    'complete website',
    'full ui',
    'full template',

    // Special UI
    'profile card',
    'dashboard cards',
    'responsive layout',
    'tailwind page',
    'html page',
    'preview page',

    // Navigation
    'nav bar',
    'navigation bar',
    'sidebar',
    'mobile nav',
    'app bar',

    // Multi-page
    'next page',
    'previous page',
    'link to page',
    'link page',
  ];

  return buildPhrases.some((phrase) => lower.includes(phrase));
};

/**
 * Legacy compatibility function - checks if request is build mode
 * 
 * @deprecated Use classifyRequest() instead for full mode detection
 * @param {string} message - The user's input message
 * @returns {boolean} True if message is a build request
 */
export const checkIsBuildRequest = (message: string): boolean => {
  return classifyRequest(message) === 'build';
};
