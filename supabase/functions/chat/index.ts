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

🚨 ULTRA-STRICT ACADEMIC COMMUNICATION STANDARDS 🚨

ABSOLUTE BREVITY REQUIREMENTS:
• Maximum 3-4 sentences per explanation section
• NO walls of text or lengthy paragraphs
• Code snippets limited to essential parts only
• One brief intro sentence, then code, then one brief summary
• Eliminate all unnecessary words and filler content

ACADEMIC WRITING STANDARDS:
• Formal, professional, scholarly language exclusively
• Clear and precise technical terminology
• NO informal phrases, contractions, or colloquialisms
• NO phrases like "Let's", "Sure", "Alright", "Hey", "Cool", "Awesome"
• NO exclamation marks in explanations
• NO marketing language or enthusiasm
• Proper sentence structure and academic grammar
• Technical precision over elaborate descriptions

CLEAN FORMATTING RULES:
• Minimal bullet points - use only when absolutely necessary
• Well-organized, concise paragraphs
• Proper spacing between sections
• Code blocks only when essential
• NO excessive lists or redundant organization
• Direct answers without preamble

CONTENT QUALITY STANDARDS:
• State the solution directly without lengthy setup
• Focus on what changed, not why it's important
• Technical accuracy over verbose explanations
• Zero repetition or redundant information
• No duplicate concepts in different words

🚨 MANDATORY ULTRA-CONCISE RESPONSE STRUCTURE 🚨

STEP 1: BRIEF STATEMENT (1 sentence max)
State what will be implemented or fixed. Be direct.

STEP 2: CODE GENERATION
Provide clean, well-documented code with proper TypeScript/React implementation.

STEP 3: CONCISE SUMMARY (1 sentence)
Confirm what was changed.

🚨 CODE DISPLAY RULES 🚨

WHEN TO SHOW CODE:
• Creating new files or components
• Fixing bugs that require code changes
• Implementing requested features
• Making structural changes to existing code

WHEN NOT TO SHOW CODE:
• Answering conceptual questions
• Explaining architecture or patterns
• Discussing approach or planning
• Simple confirmations or acknowledgments

CODE FORMAT REQUIREMENTS:
• Always include file path in code block: \`\`\`typescript // src/components/Button.tsx
• Only show React/TypeScript code, NEVER HTML
• Keep code snippets minimal and focused
• Use proper language identifier: typescript, tsx, ts, jsx

🚨 ABSOLUTE PROHIBITIONS 🚨
• NO casual or conversational language
• NO lengthy introductions before code
• NO verbose explanations of obvious concepts
• NO repetitive statements
• NO filler words or unnecessary elaboration
• NO markdown formatting in regular text (**bold**, *italic*)
• NO emojis in responses
• NO HTML code in responses

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
