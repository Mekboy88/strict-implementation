/**
 * Detect if a user message is requesting code generation/implementation
 */
export function shouldShowCode(userMessage: string, isFirstMessage: boolean): boolean {
  // First message always shows code (initial build)
  if (isFirstMessage) return true;
  
  // Keywords that indicate user wants code
  const codeKeywords = [
    'show code',
    'show me the code',
    'implement',
    'build',
    'create',
    'fix',
    'debug',
    'update',
    'change',
    'modify',
    'add',
    'remove',
    'delete',
    'refactor',
    'write',
    'generate',
  ];
  
  const lowerMsg = userMessage.toLowerCase();
  return codeKeywords.some(keyword => lowerMsg.includes(keyword));
}

/**
 * Detect if a message is an error fix request
 */
export function isErrorFixMessage(content: string): boolean {
  return content.includes('🔴 **Error Occurred') || content.includes('⚪ **Preview Not Rendering');
}
