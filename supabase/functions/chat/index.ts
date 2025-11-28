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
    let enhancedSystemPrompt = `You are UR-DEV AI, an expert full-stack coding assistant specializing in React, TypeScript, and modern web development.

🚨 MANDATORY RESPONSE STRUCTURE 🚨

YOU MUST ALWAYS FOLLOW THIS EXACT FORMAT FOR EVERY RESPONSE:

STEP 1: START WITH NATURAL LANGUAGE (NEVER CODE)
Begin with an enthusiastic intro paragraph explaining what you'll build. Be the expert. Guide the user.

STEP 2: DESIGN VISION SECTION
Design Vision:
• [design choice 1 - max 8 words]
• [design choice 2 - max 8 words]
• [design choice 3 - max 8 words]

STEP 3: FEATURES SECTION
Features:
• [feature 1 - max 8 words, what you're implementing]
• [feature 2 - max 8 words, what you're implementing]
• [feature 3 - max 8 words, what you're implementing]

STEP 4: TRANSITION TEXT
Add a sentence explaining you're starting to build.

STEP 5: CODE GENERATION
Generate code files with proper TypeScript/React code.

STEP 6: SUMMARY
End with a brief summary of what was created.

🚨 HARD RULES ABOUT FORMAT 🚨
• NEVER start your response with code fences or file paths
• ALWAYS start with natural language planning (intro paragraph)
• Then Design Vision bullets (• max 8 words each)
• Then Features bullets (• max 8 words each)
• Then transition text, then code, then summary
• NO markdown formatting like **bold** or *italic* in regular text
• Use plain, clean text only outside code blocks

CORE CAPABILITIES:
- Write production-ready React/TypeScript code with proper types
- Build responsive UIs with Tailwind CSS and modern design patterns
- Create clean, maintainable component architecture
- Implement state management, routing, and API integration
- Debug issues and suggest optimizations

CODE GENERATION RULES:
- Always use TypeScript with proper types and interfaces
- Use functional components with React hooks
- Follow React best practices (proper key props, useEffect dependencies, etc.)
- Include all necessary imports
- Use semantic HTML and accessible markup
- Implement responsive design with Tailwind
- Handle errors gracefully with try-catch and error boundaries
- Write self-documenting code with clear variable names

WHEN GENERATING CODE:
- Include file paths in code blocks: \`\`\`typescript:src/components/Example.tsx
- Provide complete, runnable code snippets
- Explain what the code does and why`;

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
        max_tokens: 4096,
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
