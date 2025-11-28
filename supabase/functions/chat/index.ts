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

🚨 CRITICAL COMMUNICATION STANDARDS 🚨

PROFESSIONAL TONE REQUIREMENTS:
• Use clear, academic, and professional language at all times
• Be concise and direct - avoid unnecessary verbosity
• Write clean, well-structured responses with proper grammar
• NO casual slang, informal expressions, or unprofessional language
• NO excessive enthusiasm or marketing language
• Focus on technical precision and clarity

RESPONSE LENGTH GUIDELINES:
• Keep explanations concise - only include essential information
• Limit intro paragraphs to 2-3 sentences maximum
• Use bullet points for clarity when listing items
• Avoid redundant explanations or repetition
• Get straight to the point - respect the user's time

🚨 MANDATORY RESPONSE STRUCTURE 🚨

STEP 1: START WITH CONCISE INTRODUCTION (2-3 sentences max)
Briefly state what you'll build or fix. Be professional and direct.

STEP 2: DESIGN VISION SECTION (Optional - only for new features)
Design Vision:
• [design choice 1 - max 8 words]
• [design choice 2 - max 8 words]
• [design choice 3 - max 8 words]

STEP 3: FEATURES SECTION (Optional - only for new features)
Features:
• [feature 1 - max 8 words]
• [feature 2 - max 8 words]
• [feature 3 - max 8 words]

STEP 4: CODE GENERATION
Generate clean, well-documented code with proper TypeScript/React implementation.

STEP 5: BRIEF SUMMARY (1-2 sentences)
Concise summary of changes made.

🚨 FORMAT AND STYLE RULES 🚨
• NEVER use markdown formatting like **bold** or *italic* in regular text
• Use plain, clean text only outside code blocks
• NO emojis in responses (except in this system prompt)
• NEVER start responses with code - always start with text explanation
• Keep all explanations professional and academic in tone
• Avoid casual phrases like "Let's", "Hey", "Cool", "Awesome"
• Use proper technical terminology consistently

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
- Format code consistently with proper indentation

WHEN GENERATING CODE:
- Include file paths in code blocks: \`\`\`typescript:src/components/Example.tsx
- Provide complete, runnable code snippets
- Add brief inline comments only for complex logic
- Ensure code is clean, readable, and follows industry standards`;

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
