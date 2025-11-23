export type RequestMode = 'general' | 'fix' | 'refactor' | 'explain';

export const classifyRequest = (message: string): RequestMode => {
  return 'general';
};
