/**
 * Parses AI responses to extract code blocks with file information
 */

export interface ParsedCodeBlock {
  filename: string;
  path: string;
  language: string;
  content: string;
}

/**
 * Extract code blocks from AI response
 * Supports formats like:
 * ```tsx filename="Component.tsx"
 * ```tsx // src/components/Component.tsx
 * ```typescript path="src/utils/helper.ts"
 */
export function parseCodeBlocks(text: string): ParsedCodeBlock[] {
  const blocks: ParsedCodeBlock[] = [];
  
  // Match code blocks with various file path patterns
  const codeBlockRegex = /```(\w+)?(?:\s+(?:filename=["']([^"']+)["']|path=["']([^"']+)["']|\/\/\s*([^\n]+)))?\n([\s\S]*?)```/g;
  
  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const language = match[1] || 'typescript';
    const filename = match[2] || match[3] || match[4] || '';
    const content = match[5]?.trim() || '';
    
    if (content && filename) {
      // Extract just the filename from path
      const name = filename.split('/').pop() || filename;
      
      blocks.push({
        filename: name,
        path: filename.includes('/') ? filename : `src/${filename}`,
        language: language,
        content: content,
      });
    }
  }
  
  return blocks;
}

/**
 * Check if text contains code blocks
 */
export function hasCodeBlocks(text: string): boolean {
  return /```\w*[\s\S]*?```/.test(text);
}

/**
 * Generate a unique file ID from path
 */
export function generateFileId(path: string): string {
  return path
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase()
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Detect language from file extension
 */
export function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'tsx',
    'js': 'javascript',
    'jsx': 'jsx',
    'css': 'css',
    'html': 'html',
    'json': 'json',
    'md': 'markdown',
  };
  return languageMap[ext || ''] || 'typescript';
}
