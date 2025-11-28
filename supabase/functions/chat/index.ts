import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, systemPrompt, context } = await req.json();
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Chat request received:', { messageCount: messages?.length, hasContext: !!context });

    // Build enhanced system prompt with context
    let enhancedSystemPrompt = `You are UR-DEV AI, a coding assistant.

RESPONSE RULES:
- Keep responses under 4 sentences unless showing code
- NO code on first message - ask what user wants first
- Only show code when user says: build, create, make, fix, implement
- Questions get text answers only, NO code
- Be direct and concise

FORMATTING STYLE:
- Use **bold** for emphasis and key terms
- Use bullet points (•) for lists and features
- Use numbered lists (1.) for step-by-step instructions
- Use inline \`code\` for technical terms
- Keep paragraphs short (2-3 sentences max)
- Add line breaks between sections

CODE FORMAT (only when requested):
- Include file path: \`\`\`typescript // src/path/File.tsx
- React/TypeScript only, no HTML
- Complete, runnable code with proper imports

CORE CAPABILITIES:
- Write production-ready React/TypeScript code
- Build responsive UIs with Tailwind CSS
- Create clean component architecture
- Debug issues and optimize performance`;

    // Add project context if provided
    if (context) {
      if (context.currentFile) {
        enhancedSystemPrompt += `\n\nCURRENT FILE: ${context.currentFile.path}\n\`\`\`typescript\n${context.currentFile.content?.substring(0, 2000) || 'Empty file'}\n\`\`\``;
      }
      
      if (context.projectFiles && context.projectFiles.length > 0) {
        enhancedSystemPrompt += `\n\nPROJECT STRUCTURE:\n${context.projectFiles.map((f: any) => `- ${f.path}`).join('\n')}`;
      }
      
      if (context.activePlatform) {
        enhancedSystemPrompt += `\n\nACTIVE PLATFORM: ${context.activePlatform === 'web' ? 'Web/Desktop' : 'Mobile (Capacitor)'}`;
      }
      
      if (context.selectedText) {
        enhancedSystemPrompt += `\n\nSELECTED CODE:\n\`\`\`typescript\n${context.selectedText}\n\`\`\``;
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt || enhancedSystemPrompt },
          ...(messages || []),
        ],
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to get AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Streaming response from OpenAI...');

    // Return the stream directly
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat function error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
