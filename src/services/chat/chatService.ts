export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export const createUserMessage = (content: string): ChatMessage => ({
  id: Date.now().toString(),
  role: 'user',
  content,
  timestamp: new Date(),
});

export const createAssistantMessage = (content: string): ChatMessage => ({
  id: Date.now().toString(),
  role: 'assistant',
  content,
  timestamp: new Date(),
});

export const getWelcomeMessage = (): ChatMessage => ({
  id: 'welcome',
  role: 'assistant',
  content: 'Welcome to UR-DEV! How can I help you build today?',
  timestamp: new Date(),
});

export const sanitizeForChat = (text: string) => {
  return text.trim();
};
