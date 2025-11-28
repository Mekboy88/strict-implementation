/**
 * Message Content Parser
 * Extracts explanations and code blocks from AI responses
 */

export interface ParsedMessage {
  explanation: string;
  codeBlocks: Array<{
    filename: string;
    path: string;
    language: string;
    content: string;
  }>;
}

export function parseMessageContent(content: string): ParsedMessage {
  // Extract text before first code block as explanation
  const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;
  const firstCodeBlockIndex = content.search(codeBlockRegex);
  
  let explanation = firstCodeBlockIndex > 0 
    ? content.substring(0, firstCodeBlockIndex).trim()
    : content.includes('```') ? '' : content;
  
  // Extract code blocks with file info
  const codeBlocks: ParsedMessage['codeBlocks'] = [];
  let match;
  
  // Reset regex
  codeBlockRegex.lastIndex = 0;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const language = match[1] || 'plaintext';
    const code = match[2];
    
    // Try to detect filename from code or surrounding text
    const filenameMatch = content.substring(Math.max(0, match.index - 100), match.index)
      .match(/(?:create|update|file:?\s*)[`"]?([^\s`"]+\.\w+)[`"]?/i);
    
    codeBlocks.push({
      filename: filenameMatch ? filenameMatch[1] : `file.${language}`,
      path: filenameMatch ? filenameMatch[1] : `file.${language}`,
      language,
      content: code
    });
  }
  
  return { explanation, codeBlocks };
}

export function detectBuildPhase(content: string): 'idle' | 'reasoning' | 'analyzing' | 'generating' | 'applying' | 'complete' {
  const lowerContent = content.toLowerCase();
  
  // Check for completion indicators
  if (lowerContent.includes('done') || lowerContent.includes('complete') || lowerContent.includes('finished')) {
    return 'complete';
  }
  
  // Check for applying phase
  if (lowerContent.includes('applied') || lowerContent.includes('updated') || lowerContent.includes('deployed') || lowerContent.includes('saving')) {
    return 'applying';
  }
  
  // Check for generating phase (has code blocks)
  if (content.includes('```') || lowerContent.includes('creating') || lowerContent.includes('generating') || lowerContent.includes('writing')) {
    return 'generating';
  }
  
  // Check for analyzing phase
  if (lowerContent.includes('analyzing') || lowerContent.includes('looking at') || lowerContent.includes('checking') || lowerContent.includes('examining')) {
    return 'analyzing';
  }
  
  // Check for reasoning phase
  if (lowerContent.includes('thinking') || lowerContent.includes('planning') || lowerContent.includes('considering') || lowerContent.includes('let me')) {
    return 'reasoning';
  }
  
  return 'idle';
}

export function extractFilesBeingCreated(content: string): Array<{ name: string; status: 'pending' | 'processing' | 'done' }> {
  const files: Array<{ name: string; status: 'pending' | 'processing' | 'done' }> = [];
  const lowerContent = content.toLowerCase();
  const isDone = lowerContent.includes('done') || lowerContent.includes('complete');
  
  // Extract files from code blocks
  const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Try multiple patterns to find filename
    const contextBefore = content.substring(Math.max(0, match.index - 150), match.index);
    
    // Pattern 1: file:, create, update patterns
    let filenameMatch = contextBefore.match(/(?:file:?\s*|creating?\s+|updating?\s+|writing?\s+)[`"]?([^\s`"]+\.\w+)[`"]?/i);
    
    // Pattern 2: Just a filename with path before code block
    if (!filenameMatch) {
      filenameMatch = contextBefore.match(/([a-zA-Z0-9_\-/]+\.[a-zA-Z0-9]+)[`"]?\s*$/);
    }
    
    if (filenameMatch) {
      const filename = filenameMatch[1];
      // Check if already added
      if (!files.find(f => f.name === filename)) {
        files.push({
          name: filename,
          status: isDone ? 'done' : 'processing'
        });
      }
    }
  }
  
  return files;
}

export function generateFollowUpSuggestions(builtFiles: string[], userRequest: string): string[] {
  const suggestions: string[] = [];
  
  // Based on what was built, suggest next steps
  if (builtFiles.some(f => f.toLowerCase().includes('login'))) {
    suggestions.push('Add a registration page');
    suggestions.push('Add password reset functionality');
  }
  
  if (builtFiles.some(f => f.toLowerCase().includes('page') || f.toLowerCase().includes('index'))) {
    suggestions.push('Add a navigation menu');
    suggestions.push('Make it mobile responsive');
  }
  
  if (builtFiles.some(f => f.toLowerCase().includes('component'))) {
    suggestions.push('Add animations and transitions');
    suggestions.push('Improve the color scheme');
  }
  
  // Always include generic helpful suggestions
  if (suggestions.length < 3) {
    suggestions.push('Add loading states');
    suggestions.push('Improve accessibility');
  }
  
  return suggestions.slice(0, 4);
}
