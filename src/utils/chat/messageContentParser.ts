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

export function detectBuildPhase(content: string): 'reasoning' | 'analyzing' | 'generating' | 'applying' {
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes('analyzing') || lowerContent.includes('looking at') || lowerContent.includes('checking')) return 'analyzing';
  if (lowerContent.includes('```') || lowerContent.includes('creating') || lowerContent.includes('generating')) return 'generating';
  if (lowerContent.includes('applied') || lowerContent.includes('updated') || lowerContent.includes('deployed')) return 'applying';
  return 'reasoning';
}

export function extractFilesBeingCreated(content: string): Array<{ name: string; status: 'pending' | 'processing' | 'done' }> {
  const files: Array<{ name: string; status: 'pending' | 'processing' | 'done' }> = [];
  
  // Extract files from code blocks
  const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const filenameMatch = content.substring(Math.max(0, match.index - 100), match.index)
      .match(/(?:create|update|file:?\s*)[`"]?([^\s`"]+\.\w+)[`"]?/i);
    
    if (filenameMatch) {
      files.push({
        name: filenameMatch[1],
        status: 'processing'
      });
    }
  }
  
  return files;
}
