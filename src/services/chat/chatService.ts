/**
 * Chat Service
 * 
 * Provides utilities for managing chat messages, formatting content,
 * and creating message objects with consistent structure.
 * 
 * @module services/chat/chatService
 */

/**
 * Represents a single chat message in the conversation
 * @interface ChatMessage
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string;
  /** Role of the message sender - user or AI assistant */
  role: 'user' | 'assistant';
  /** Text content of the message */
  content: string;
  /** Timestamp when message was created */
  timestamp: Date;
  /** Optional code snippet associated with message */
  fixedCode?: string;
  /** Time taken to generate response (in seconds, for AI messages) */
  generationTime?: number;
}

/**
 * Removes all code blocks from content for clean chat display
 * Strips triple-backtick fenced code blocks to prevent code duplication
 * 
 * @param {string} content - Raw content that may contain code blocks
 * @returns {string} Sanitized content without code blocks
 * 
 * @example
 * ```typescript
 * const raw = "Here's the code:\n```js\nconsole.log('hi');\n```\nUse it!";
 * const clean = sanitizeForChat(raw);
 * // Returns: "Here's the code:\n\nUse it!"
 * ```
 */
export const sanitizeForChat = (content: string): string => {
  return content.replace(/```[\s\S]*?```/g, '').trim();
};

/**
 * Creates a user message object with timestamp
 * 
 * @param {string} content - The user's message content
 * @returns {ChatMessage} Formatted user message object
 * 
 * @example
 * ```typescript
 * const userMsg = createUserMessage("Build a login page");
 * ```
 */
export const createUserMessage = (content: string): ChatMessage => ({
  id: Date.now().toString(),
  role: 'user',
  content,
  timestamp: new Date(),
});

/**
 * Creates an assistant message object with optional generation time
 * 
 * @param {string} content - The AI assistant's response content
 * @param {number} [generationTime] - Time taken to generate response (seconds)
 * @returns {ChatMessage} Formatted assistant message object
 * 
 * @example
 * ```typescript
 * const assistantMsg = createAssistantMessage(
 *   "I've created the login page",
 *   2.3
 * );
 * ```
 */
export const createAssistantMessage = (
  content: string,
  generationTime?: number
): ChatMessage => ({
  id: Date.now().toString(),
  role: 'assistant',
  content,
  timestamp: new Date(),
  generationTime,
});

/**
 * Returns the initial welcome message shown when chat starts
 * 
 * @returns {ChatMessage} Welcome message from AI assistant
 * 
 * @example
 * ```typescript
 * const welcome = getWelcomeMessage();
 * setMessages([welcome]);
 * ```
 */
export const getWelcomeMessage = (): ChatMessage => ({
  id: 'welcome',
  role: 'assistant',
  content: `Hey! 👋 I'm here to help you build whatever you're thinking about.

What do you want to create today? Just tell me in your own words, and I'll take care of the rest.`,
  timestamp: new Date(),
});
