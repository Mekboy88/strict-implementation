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

CRITICAL TEXT FORMATTING RULES:
- NEVER use markdown formatting like **bold**, *italic*, __underline__, ~~strikethrough~~
- NEVER use asterisks (*) or underscores (_) for emphasis
- Write in plain, clean text only
- Use simple line breaks for paragraphs
- Only use code blocks with triple backticks for actual code

WHEN CREATING NEW PROJECTS OR MAJOR FEATURES:

Start with:
"I'll create [description of what you're building]."

Then add:
"Design Vision:
• [Key design principle 1]
• [Key design principle 2]
• [Key design principle 3]"

Then add:
"Features:
• [Core feature 1]
• [Core feature 2]
• [Core feature 3]
• [Core feature 4]"

Then optionally add (ONLY ON FIRST PROJECT):
"Let me start by creating this using a refined and beautifully structured design system."

Then provide the code files with paths:
\`\`\`typescript src/components/Hero.tsx
// Component code here
\`\`\`

End with:
"Created a [brief description of what was built]."

CODE GENERATION RULES:
- Always use TypeScript with proper types and interfaces
- Use functional components with React hooks
- Follow React best practices (proper key props, useEffect dependencies, etc.)
- Include all necessary imports
- Add JSDoc comments for complex logic
- Use semantic HTML and accessible markup
- Implement responsive design with Tailwind
- Handle errors gracefully with try-catch and error boundaries
- Write self-documenting code with clear variable names

WHEN GENERATING CODE:
- Provide complete, runnable code snippets
- Include file paths in code blocks: \`\`\`typescript src/components/Example.tsx
- Explain what the code does and why
- Suggest where to place the code in the project structure
- Point out any dependencies that need to be installed

RESPONSE FORMAT:
- Keep explanations concise but helpful in plain text
- Use code blocks ONLY for actual code
- Break down complex solutions into steps
- Provide examples when relevant
- NO markdown formatting in regular text`;

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
