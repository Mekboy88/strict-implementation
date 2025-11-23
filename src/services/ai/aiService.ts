import { supabase } from "@/integrations/supabase/client";

/**
 * Context information passed to AI service for enhanced responses
 * @interface AIRequestContext
 */
export interface AIRequestContext {
  /** Mode of AI interaction - chat for conversation, build for code generation */
  mode?: 'chat' | 'build';
  /** Recent conversation history for context-aware responses */
  conversationHistory?: Array<{ role: string; content: string }>;
  /** List of existing project files for system awareness */
  projectFiles?: string[];
  /** Currently active file in editor */
  currentFile?: string;
  /** Type of request being processed (page, component, etc.) */
  requestType?: string;
  /** Description of scaffolding plan */
  scaffoldPlan?: string;
  /** Files being created in current operation */
  createdFiles?: string[];
  /** Existing files in project */
  existingFiles?: string[];
  /** System prompt for AI behavior and identity */
  systemPrompt?: string;
}

/**
 * Response structure from AI service
 * @interface AIResponse
 */
export interface AIResponse {
  /** Primary response text */
  response?: string;
  /** Alternative output field */
  output?: string;
  /** Nested message structure */
  message?: { content?: string };
  /** Error flag indicating service failure */
  error?: boolean;
  /** Timeout flag indicating request exceeded time limit */
  timeout?: boolean;
  /** Offline flag indicating service unreachable */
  offline?: boolean;
}

/**
 * Calls the Supabase AI edge function with given prompt and context
 * 
 * @param {string} prompt - The user's prompt or request
 * @param {AIRequestContext} [context] - Optional context for enhanced AI responses
 * @returns {Promise<AIResponse>} AI service response
 * @throws {Error} If Supabase function invocation fails
 * 
 * @example
 * ```typescript
 * const response = await callAIService("Create a login page", {
 *   mode: 'build',
 *   projectFiles: ['src/App.tsx', 'src/index.tsx']
 * });
 * ```
 */
export const callAIService = async (
  prompt: string,
  context?: AIRequestContext
): Promise<AIResponse> => {
  console.log('📡 AI Service: Invoking edge function...', {
    promptLength: prompt.length,
    mode: context?.mode,
    hasSystemPrompt: !!context?.systemPrompt
  });

  const { data, error } = await supabase.functions.invoke('ai', {
    body: {
      prompt,
      context: context || {},
      systemPrompt: context?.systemPrompt,
    },
  });

  console.log('📡 AI Service: Edge function responded', {
    hasData: !!data,
    hasError: !!error,
    errorMessage: error?.message,
    dataKeys: data ? Object.keys(data) : []
  });

  // Instead of throwing, return structured error for frontend to handle
  if (error) {
    console.error('📡 AI Service: Error from edge function:', error);
    return {
      error: true,
      response: `I encountered an error connecting to the AI service: ${error.message || 'Unknown error'}. Please check your network connection and try again.`
    };
  }

  // Validate data structure
  if (!data || typeof data !== 'object') {
    console.error('📡 AI Service: Invalid data structure received:', data);
    return {
      error: true,
      response: 'I received an invalid response from the AI service. Please try again.'
    };
  }

  return data as AIResponse;
};

/**
 * Extracts the primary text response from AI response data
 * Checks multiple possible response fields in priority order
 * 
 * @param {AIResponse} data - The AI response object
 * @returns {string} Extracted response text or empty string
 * 
 * @example
 * ```typescript
 * const text = extractAIResponseText(aiResponse);
 * console.log(text); // "Here's your login page..."
 * ```
 */
export const extractAIResponseText = (data: AIResponse): string => {
  return data?.response || data?.output || data?.message?.content || '';
};
