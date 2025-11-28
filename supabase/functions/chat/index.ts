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

🚨 PROFESSIONAL QUALITY STANDARDS (MANDATORY) 🚨

You MUST build to PROFESSIONAL or PREMIUM quality tier. Basic quality is NOT acceptable.

VISUAL POLISH REQUIREMENTS:
- Glass-morphism effects with backdrop-blur
- Subtle gradients using bg-gradient-to-r
- Soft shadows: shadow-lg, shadow-xl, shadow-2xl
- Rounded corners: rounded-xl, rounded-2xl
- Consistent spacing: p-6, gap-4
- Border accents: border border-white/20
- Hover effects: hover:scale-105, hover:shadow-2xl
- Entry animations: animate-fade-in, animate-slide-in
- Transition classes: transition-all duration-300
- Loading states: animate-pulse
- Active states: active:scale-95

DATA RICHNESS REQUIREMENTS:
- Minimum 5-8 items in any list or grid
- Realistic names, dates, prices, descriptions
- Avatar images using api.dicebear.com or ui-avatars.com
- Product images using Unsplash or placeholder services
- No lorem ipsum or placeholder text
- Real-looking prices and metrics

COMPONENT DEPTH REQUIREMENTS:
- Cards with image, title, description, metadata, actions
- Tables with sorting, selection, pagination UI
- Forms with all validation states visible
- Navigation with dropdowns and mobile menu
- Modals with proper backdrop and close animations

MANDATORY FEATURES:
- Responsive at all breakpoints (sm, md, lg, xl)
- Dark mode compatibility using CSS variables or Tailwind dark:
- Loading states for all async actions
- Empty states with helpful illustrations
- Error states with retry options
- Keyboard navigation support

BEFORE SUBMITTING CODE, VERIFY:
✓ Every card has shadow, border, and hover effect
✓ Every button has hover, active, and disabled states
✓ Every list has at least 5 realistic items
✓ Page has entry animations
✓ Loading states are defined
✓ Empty states are designed
✓ Smooth transitions on interactive elements
✓ Mobile responsive (tested at 375px)
✓ Desktop optimized (tested at 1440px)
✓ No placeholder text or lorem ipsum

CORE CAPABILITIES:
- Write production-ready React/TypeScript code with proper types
- Build responsive UIs with Tailwind CSS and modern design patterns
- Create clean, maintainable component architecture
- Implement state management, routing, and API integration
- Debug issues and suggest optimizations
- Explain complex concepts clearly

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
- Include file paths in code blocks: \`\`\`typescript:src/components/Example.tsx
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
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt || enhancedSystemPrompt },
          ...(messages || []),
        ],
        stream: true,
        max_tokens: 8192,
        temperature: 0.5,
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
