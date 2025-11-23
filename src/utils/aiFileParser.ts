export interface FileOperation {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  path: string;
  content?: string;
  language?: string;
}

export const parseAIResponse = (response: string): FileOperation[] => {
  const operations: FileOperation[] = [];
  let match;
  
  // PRIMARY PATTERN: CREATE_FILE with following code block (most reliable)
  const createWithContentPattern = /CREATE_FILE:\s*([^\n]+)\s*\n+```(\w+)?\s*\n([\s\S]*?)```/gi;
  
  while ((match = createWithContentPattern.exec(response)) !== null) {
    const path = match[1].trim();
    const language = (match[2] || '').trim();
    const content = match[3].trim();
    
    if (content) { // Only add if content exists
      operations.push({
        type: 'CREATE',
        path,
        content,
        language: language || inferLanguageFromPath(path),
      });
    }
  }
  
  // PRIMARY PATTERN: UPDATE_FILE with following code block
  const updateWithContentPattern = /UPDATE_FILE:\s*([^\n]+)\s*\n+```(\w+)?\s*\n([\s\S]*?)```/gi;
  
  while ((match = updateWithContentPattern.exec(response)) !== null) {
    const path = match[1].trim();
    const language = (match[2] || '').trim();
    const content = match[3].trim();
    
    if (content) {
      operations.push({
        type: 'UPDATE',
        path,
        content,
        language: language || inferLanguageFromPath(path),
      });
    }
  }
  
  // FALLBACK: CREATE_FILE path-only (if no code block follows)
  const createFilePattern = /CREATE_FILE:\s*([^\n]+)(?!\n+```)/gi;
  
  while ((match = createFilePattern.exec(response)) !== null) {
    operations.push({
      type: 'CREATE',
      path: match[1].trim(),
    });
  }
  
  // FALLBACK: UPDATE_FILE path-only (if no code block follows)
  const updateFilePattern = /UPDATE_FILE:\s*([^\n]+)(?!\n+```)/gi;
  
  while ((match = updateFilePattern.exec(response)) !== null) {
    operations.push({
      type: 'UPDATE',
      path: match[1].trim(),
    });
  }
  
  // Pattern 3: DELETE_FILE: path/to/file.tsx
  const deleteFilePattern = /DELETE_FILE:\s*([^\n]+)/gi;
  
  while ((match = deleteFilePattern.exec(response)) !== null) {
    operations.push({
      type: 'DELETE',
      path: match[1].trim(),
    });
  }
  
  // Pattern 4: Code blocks with file paths
  // ```tsx:src/components/Button.tsx
  const codeBlockPattern = /```(\w+):([^\n]+)\n([\s\S]*?)```/gi;
  
  while ((match = codeBlockPattern.exec(response)) !== null) {
    const language = match[1];
    const path = match[2].trim();
    const content = match[3].trim();
    
    operations.push({
      type: 'CREATE',
      path,
      content,
      language,
    });
  }
  
  // Pattern 5: Standard code blocks (try to infer file from context)
  const standardCodeBlockPattern = /```(\w+)\n([\s\S]*?)```/gi;
  
  while ((match = standardCodeBlockPattern.exec(response)) !== null) {
    const language = match[1];
    const content = match[2].trim();
    
    // Try to extract filename from content or comments
    const filenameMatch = content.match(/\/\/\s*@file:\s*([^\n]+)/i) ||
                          content.match(/\/\*\*?\s*@file:\s*([^\n]+)\s*\*\//i);
    
    if (filenameMatch) {
      operations.push({
        type: 'CREATE',
        path: filenameMatch[1].trim(),
        content,
        language,
      });
    }
  }
  
  return operations;
};

export const extractFilesBeingModified = (response: string): string[] => {
  const files = new Set<string>();
  
  // Extract from explicit commands
  const commandPattern = /(CREATE_FILE|UPDATE_FILE|DELETE_FILE):\s*([^\n]+)/gi;
  let match;
  
  while ((match = commandPattern.exec(response)) !== null) {
    files.add(match[2].trim());
  }
  
  // Extract from code blocks with paths
  const codeBlockPattern = /```\w+:([^\n]+)/gi;
  
  while ((match = codeBlockPattern.exec(response)) !== null) {
    files.add(match[1].trim());
  }
  
  return Array.from(files);
};

export const getFileExtension = (path: string): string => {
  const parts = path.split('.');
  return parts.length > 1 ? parts.pop()! : '';
};

export const inferLanguageFromPath = (path: string): string => {
  const ext = getFileExtension(path);
  
  const languageMap: Record<string, string> = {
    'tsx': 'typescript',
    'ts': 'typescript',
    'jsx': 'javascript',
    'js': 'javascript',
    'css': 'css',
    'json': 'json',
    'html': 'html',
    'md': 'markdown',
    'py': 'python',
    'go': 'go',
    'rs': 'rust',
  };
  
  return languageMap[ext] || 'plaintext';
};
