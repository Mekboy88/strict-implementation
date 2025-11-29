/**
 * Chat streaming service for real-time AI responses
 * Includes automatic AI image generation for app builds
 */

import { processImageRequests, hasImageRequests } from '@/services/ai/imageGenerationService';

const SUPABASE_URL = "https://kzymqlmtysrvnrpcneno.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6eW1xbG10eXNydm5ycGNuZW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTE1ODIsImV4cCI6MjA3ODk2NzU4Mn0.PqMj3ZUPt8sc0HRkK69aeEuN1pS8JnSIvzQcr1QhIlg";
const CHAT_URL = `${SUPABASE_URL}/functions/v1/chat`;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatContext {
  currentFile?: {
    path: string;
    content?: string;
  };
  projectFiles?: Array<{ path: string; type: string }>;
  activePlatform?: 'web' | 'mobile';
  selectedText?: string;
}

interface StreamChatOptions {
  messages: ChatMessage[];
  systemPrompt?: string;
  context?: ChatContext;
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError?: (error: Error) => void;
  onImageGenerating?: (prompt: string) => void;
}

/**
 * Stream chat responses from the AI service
 */
export async function streamChat({
  messages,
  systemPrompt,
  context,
  onDelta,
  onDone,
  onError,
  onImageGenerating,
}: StreamChatOptions): Promise<void> {
  let accumulatedContent = '';
  
  try {
    const response = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ messages, systemPrompt, context }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process line by line
      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        // Handle CRLF
        if (line.endsWith('\r')) {
          line = line.slice(0, -1);
        }

        // Skip empty lines and comments
        if (line.startsWith(':') || line.trim() === '') continue;
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            accumulatedContent += content;
            onDelta(content); // Send raw content with markdown preserved
          }
        } catch {
          // Incomplete JSON, put back in buffer
          buffer = line + '\n' + buffer;
          break;
        }
      }
    }

    // Process remaining buffer
    if (buffer.trim()) {
      for (let raw of buffer.split('\n')) {
        if (!raw) continue;
        if (raw.endsWith('\r')) raw = raw.slice(0, -1);
        if (raw.startsWith(':') || raw.trim() === '') continue;
        if (!raw.startsWith('data: ')) continue;
        
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === '[DONE]') continue;
        
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            accumulatedContent += content;
            onDelta(content); // Send raw content with markdown preserved
          }
        } catch {
          // Ignore parse errors in final flush
        }
      }
    }

    // Process any image generation requests after streaming completes
    if (hasImageRequests(accumulatedContent)) {
      console.log('Detected image generation requests, processing...');
      try {
        await processImageRequests(accumulatedContent, onImageGenerating);
      } catch (error) {
        console.error('Failed to process image requests:', error);
        // Continue even if image generation fails
      }
    }

    onDone();
  } catch (error) {
    console.error('Chat stream error:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}

/**
 * Send a single message and get a non-streaming response
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<string> {
  let fullResponse = '';

  await streamChat({
    messages,
    systemPrompt,
    onDelta: (delta) => {
      fullResponse += delta;
    },
    onDone: () => {},
  });

  return fullResponse;
}
