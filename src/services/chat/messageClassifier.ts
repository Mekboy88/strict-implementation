import { MessageType, BuildMetadata } from '@/types/chat';

/**
 * Detects the message type based on content and context
 */
export function detectMessageType(
  content: string,
  isFirstMessage: boolean,
  hasCodeBlocks: boolean
): MessageType {
  // Check if it's a build message
  if (hasCodeBlocks && content.includes('```')) {
    // First project creation
    if (isFirstMessage || content.toLowerCase().includes('let me start by creating')) {
      return 'first-build';
    }
    // Subsequent builds/updates
    return 'build';
  }

  // Error messages
  if (content.toLowerCase().includes('error') || content.toLowerCase().includes('failed')) {
    return 'error';
  }

  // Regular chat
  return 'chat';
}

/**
 * Extracts file information from code blocks
 */
export function extractFileMetadata(content: string): BuildMetadata['files'] {
  const files: BuildMetadata['files'] = [];
  const codeBlockRegex = /```[\w]*\s*(?:\/\/\s*(.+?)\s*)?\n([\s\S]*?)```/g;
  
  let match;
  let index = 0;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const filename = match[1]?.trim();
    
    if (filename) {
      files.push({
        path: filename,
        status: 'pending',
        startTime: Date.now() + (index * 500) // Stagger start times
      });
      index++;
    }
  }
  
  return files;
}

/**
 * Extracts project name from content
 */
export function extractProjectName(content: string): string | undefined {
  const projectNameMatch = content.match(/creating\s+(?:a\s+)?["']?([^"'\n]+?)["']?[.\s]/i);
  return projectNameMatch?.[1]?.trim();
}

/**
 * Extracts design vision section
 */
export function extractDesignVision(content: string): string | undefined {
  const visionMatch = content.match(/##\s*Design Vision\s*\n([\s\S]*?)(?=\n##|$)/i);
  return visionMatch?.[1]?.trim();
}

/**
 * Extracts features list
 */
export function extractFeatures(content: string): string[] | undefined {
  const featuresMatch = content.match(/##\s*Features\s*\n([\s\S]*?)(?=\n##|$)/i);
  if (!featuresMatch) return undefined;
  
  const featuresList = featuresMatch[1]
    .split('\n')
    .map(line => line.replace(/^[-*]\s*/, '').trim())
    .filter(line => line.length > 0);
  
  return featuresList.length > 0 ? featuresList : undefined;
}

/**
 * Generates dynamic intro text based on message type
 */
export function generateIntroText(
  messageType: MessageType,
  projectName?: string,
  action?: string
): string {
  switch (messageType) {
    case 'first-build':
      return projectName 
        ? `Let me start by creating ${projectName}...`
        : 'Let me start by creating this for you...';
    
    case 'build':
      return action 
        ? `I'll ${action}...`
        : 'I\'ll update this for you...';
    
    case 'chat':
    case 'error':
    default:
      return '';
  }
}

/**
 * Determines if the content indicates a building action
 */
export function detectBuildAction(content: string): string | undefined {
  const actionPatterns = [
    /I['']\s*ll\s+(update|modify|change|add|create|refactor)\s+(?:the\s+)?(.+?)(?:\.|,|\n)/i,
    /(?:updating|modifying|changing|adding|creating|refactoring)\s+(?:the\s+)?(.+?)(?:\.|,|\n)/i
  ];
  
  for (const pattern of actionPatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1] ? `${match[1]} ${match[2] || ''}`.trim() : match[1];
    }
  }
  
  return undefined;
}
