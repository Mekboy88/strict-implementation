/**
 * Utility to filter code blocks from streaming AI responses
 * Provides Lovable-style clean chat experience
 */

export interface FilteredContent {
  text: string;
  hasCodeBlocks: boolean;
  detectedFiles: string[];
}

/**
 * Filters code blocks from content, returning only explanatory text
 */
export function filterCodeBlocks(content: string): FilteredContent {
  const detectedFiles: string[] = [];
  
  // Match code blocks with optional file path headers
  const codeBlockRegex = /```[\w]*\n?(?:\/\/\s*(.+?)\n)?([\s\S]*?)```/g;
  
  let hasCodeBlocks = false;
  let match;
  
  // Extract file paths from code blocks
  while ((match = codeBlockRegex.exec(content)) !== null) {
    hasCodeBlocks = true;
    const filePath = match[1];
    if (filePath && filePath.trim()) {
      detectedFiles.push(filePath.trim());
    }
  }
  
  // Remove all code blocks
  const text = content.replace(codeBlockRegex, '').trim();
  
  return {
    text,
    hasCodeBlocks,
    detectedFiles,
  };
}

/**
 * Extracts file paths from code block headers
 */
export function extractFilePathsFromContent(content: string): string[] {
  const filePaths: string[] = [];
  const regex = /```[\w]*\n?\/\/\s*(.+?)(?:\n|```)/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    const path = match[1].trim();
    if (path && !filePaths.includes(path)) {
      filePaths.push(path);
    }
  }
  
  return filePaths;
}
