/**
 * Chat streaming service for real-time AI responses
 */

const CHAT_URL = `https://kzymqlmtysrvnrpcneno.supabase.co/functions/v1/chat`;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface StreamChatOptions {
  messages: ChatMessage[];
  systemPrompt?: string;
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError?: (error: Error) => void;
}

/**
 * Stream chat responses from the AI service
 */
export async function streamChat({
  messages,
  systemPrompt,
  onDelta,
  onDone,
  onError,
}: StreamChatOptions): Promise<void> {
  try {
    const response = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, systemPrompt }),
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
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            onDelta(content);
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
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          // Ignore parse errors in final flush
        }
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
