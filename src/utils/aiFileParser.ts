export const parseAIResponse = (response: string) => {
  return {
    files: [],
    explanation: response
  };
};

export const extractFilesBeingModified = (response: string) => {
  return [];
};

export const inferLanguageFromPath = (path: string) => {
  const ext = path.split('.').pop();
  const languageMap: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'css': 'css',
    'html': 'html',
    'json': 'json',
  };
  return languageMap[ext || ''] || 'plaintext';
};
