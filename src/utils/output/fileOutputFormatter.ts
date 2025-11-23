/**
 * File Output Formatter
 * 
 * Ensures AI-generated file operations follow strict formatting rules
 * and validates output structure for consistency and quality.
 * 
 * @module utils/output/fileOutputFormatter
 */

/**
 * Validates that file content is real, functional code (not demo/placeholder)
 * 
 * @param {string} content - File content to validate
 * @param {string} filePath - Path of the file being validated
 * @returns {boolean} True if content appears to be real code
 */
export const isRealCode = (content: string, filePath: string): boolean => {
  const lower = content.toLowerCase();

  // CRITICAL: Red flags for demo/placeholder content
  const demoIndicators = [
    'lorem ipsum',
    'placeholder',
    'example content',
    'demo text',
    'sample data',
    'todo: implement',
    'todo implement',
    'coming soon',
    '...more content...',
    'insert content here',
    'add content here',
    'your content here',
    'dummy data',
    'mock data',
    'fake content',
    'test content',
    'example text',
    'sample content',
    'placeholder text',
  ];

  // Check for any demo indicators
  const hasDemoContent = demoIndicators.some(indicator => lower.includes(indicator));
  if (hasDemoContent) {
    console.error(`❌ BLOCKED: Demo content detected in ${filePath}`);
    return false;
  }

  // Check for excessive placeholder patterns
  const placeholderPatterns = [
    /\.\.\./g, // Ellipsis pattern
    /xxx+/gi,
    /placeholder/gi,
    /demo/gi,
  ];

  let placeholderCount = 0;
  placeholderPatterns.forEach(pattern => {
    const matches = lower.match(pattern);
    if (matches) placeholderCount += matches.length;
  });

  if (placeholderCount > 2) {
    console.error(`❌ BLOCKED: Too many placeholder patterns in ${filePath} (${placeholderCount} found)`);
    return false;
  }

  // Minimum content length check (real code should have substance)
  if (content.trim().length < 100) {
    console.warn(`⚠️ WARNING: Content too short in ${filePath} (${content.trim().length} chars)`);
    return false;
  }

  // Check for actual HTML structure or React components
  const hasRealStructure = 
    content.includes('<div') ||
    content.includes('<button') ||
    content.includes('<form') ||
    content.includes('className') ||
    content.includes('const ') ||
    content.includes('function ') ||
    content.includes('export ');

  if (!hasRealStructure) {
    console.error(`❌ BLOCKED: No real code structure found in ${filePath}`);
    return false;
  }

  return true;
};

/**
 * Formats file operation output in standardized CREATE_FILE format
 * 
 * @param {string} filePath - Path where file will be created
 * @param {string} content - File content (must be complete, no placeholders)
 * @param {string} language - Programming language/file type
 * @returns {string} Formatted output string
 * 
 * @example
 * ```typescript
 * const output = formatFileOutput(
 *   'public/preview.html',
 *   htmlContent,
 *   'html'
 * );
 * // Returns: "CREATE_FILE: public/preview.html\n```html\n...content...\n```"
 * ```
 */
export const formatFileOutput = (
  filePath: string,
  content: string,
  language: string
): string => {
  // Validate content before formatting
  if (!isRealCode(content, filePath)) {
    throw new Error(`Invalid content for ${filePath}: contains demo/placeholder text`);
  }

  return `CREATE_FILE: ${filePath}\n\`\`\`${language}\n${content}\n\`\`\``;
};

/**
 * Strips demo/placeholder content from AI responses
 * 
 * @param {string} response - Full AI response text
 * @returns {string} Cleaned response with demo content removed
 */
export const stripDemoContent = (response: string): string => {
  const replacements = [
    /lorem ipsum/gi,
    /placeholder text?/gi,
    /demo (text|content|data|page)/gi,
    /sample (data|content|text)/gi,
    /dummy (data|content|text)/gi,
    /mock (data|content|api)/gi,
    /fake (data|content|text)/gi,
    /test (data|content|text)/gi,
    /coming soon/gi,
    /todo:?\s*implement/gi,
    /\.\.\.(more|content|text)/gi,
  ];

  let cleaned = response;
  for (const pattern of replacements) {
    cleaned = cleaned.replace(pattern, '');
  }

  // Collapse multiple blank lines created by removals
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned;
};

/**
 * Validates complete AI response for proper file operation formatting
 * Demo/placeholder content is now auto-removed, not blocked
 * 
 * @param {string} response - Full AI response text
 * @returns {object} Validation result with errors if any
 */
export const validateAIResponse = (response: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for CREATE_FILE format
  const hasCreateFile = response.includes('CREATE_FILE:');
  if (!hasCreateFile && response.length > 100) {
    errors.push('Missing CREATE_FILE: directive - all code must use CREATE_FILE format');
  }

  // Check for code blocks
  const hasCodeBlocks = response.includes('```');
  if (!hasCodeBlocks && response.length > 100) {
    errors.push('Missing code block (```) formatting');
  }

  // Check for demo content (warnings only, not blockers)
  const strictDemoPatterns = [
    { pattern: /lorem ipsum/gi, name: 'Lorem Ipsum text' },
    { pattern: /placeholder/gi, name: 'Placeholder text' },
    { pattern: /demo (text|content|data|page)/gi, name: 'Demo content' },
    { pattern: /coming soon/gi, name: 'Coming soon text' },
    { pattern: /todo:?\s*implement/gi, name: 'TODO comments' },
    { pattern: /sample (data|content|text)/gi, name: 'Sample content' },
    { pattern: /dummy (data|content|text)/gi, name: 'Dummy content' },
    { pattern: /mock (data|content|api)/gi, name: 'Mock content' },
    { pattern: /fake (data|content|text)/gi, name: 'Fake content' },
    { pattern: /test (data|content|text)/gi, name: 'Test content' },
    { pattern: /\.\.\.(more|content|text)/gi, name: 'Ellipsis placeholders' },
  ];

  strictDemoPatterns.forEach(({ pattern, name }) => {
    const matches = response.match(pattern);
    if (matches && matches.length > 0) {
      warnings.push(`Demo content detected: ${name} (${matches.length} occurrence${matches.length > 1 ? 's' : ''}) - will be auto-removed`);
    }
  });

  // Check for incomplete code patterns (warnings only)
  const incompletePatterns = [
    { pattern: /\/\/\s*add\s+(your|content|code)/gi, name: 'Add your content comments' },
    { pattern: /\/\/\s*insert\s+(code|content)/gi, name: 'Insert content comments' },
    { pattern: /\/\/\s*implement\s+this/gi, name: 'Implement this comments' },
  ];

  incompletePatterns.forEach(({ pattern, name }) => {
    if (pattern.test(response)) {
      warnings.push(`Incomplete code: ${name}`);
    }
  });

  // Ensure has real UI elements if HTML/React code
  if (response.includes('html') || response.includes('tsx')) {
    const hasRealUI = 
      response.includes('<button') ||
      response.includes('<div') ||
      response.includes('<form') ||
      response.includes('<nav') ||
      response.includes('<header');

    if (!hasRealUI) {
      errors.push('Missing real UI elements - code must include actual HTML/JSX structure');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};
