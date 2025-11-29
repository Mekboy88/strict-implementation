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
    
    // Extract user message for task detection
    const userMessage = messages[messages.length - 1]?.content || '';
    
    // Detect task type from user message
    const TASK_PATTERNS = {
      page_building: ['create page', 'build page', 'landing', 'dashboard', 'login', 'signup', 'profile', 'feed'],
      ui_components: ['button', 'card', 'form', 'modal', 'table', 'list', 'alert', 'navigation', 'navbar'],
      bug_fixing: ['fix', 'error', 'bug', 'not working', 'broken', 'issue', 'problem', 'crash'],
      image_generation: ['generate image', 'create image', 'photo', 'picture', 'illustration', 'icon', 'hero image', 'background']
    };
    
    function detectTaskType(message: string): string {
      const msg = message.toLowerCase();
      for (const [type, patterns] of Object.entries(TASK_PATTERNS)) {
        if (patterns.some(p => msg.includes(p))) return type;
      }
      return 'general';
    }
    
    const taskType = detectTaskType(userMessage);
    console.log('Detected task type:', taskType, 'from message:', userMessage);
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Chat request received:', { messageCount: messages?.length, hasContext: !!context });

    // Build enhanced system prompt with context and task-specific guidance
    let taskSpecificGuidance = '';
    
    if (taskType === 'image_generation') {
      taskSpecificGuidance = `\n\nIMAGE GENERATION TASK DETECTED:
When building this feature, you can generate AI images by using the format:
GENERATE_IMAGE: [detailed description]

Example: GENERATE_IMAGE: Modern tech startup hero banner with abstract geometric shapes and gradient

The system will automatically generate these images and provide URLs to use in the code.`;
    } else if (taskType === 'page_building') {
      taskSpecificGuidance = `\n\nPAGE BUILDING TASK DETECTED:
Focus on creating complete, functional pages with:
- All required sections and components
- Proper navigation and routing
- Responsive design
- Real content (no placeholders)
Consider generating images for hero sections, backgrounds, and visual elements.`;
    } else if (taskType === 'ui_components') {
      taskSpecificGuidance = `\n\nUI COMPONENT TASK DETECTED:
Build reusable, well-structured components with:
- Clear props interface
- Proper TypeScript types
- Tailwind CSS styling using design tokens
- shadcn/ui integration where applicable`;
    } else if (taskType === 'bug_fixing') {
      taskSpecificGuidance = `\n\nBUG FIXING TASK DETECTED:
Analyze the issue systematically:
1. Identify the root cause
2. Explain what's wrong and why
3. Provide the fix with clear comments
4. Suggest how to prevent similar issues`;
    }
    
    let enhancedSystemPrompt = `You are UR-DEV AI, a coding assistant.

CRITICAL RESPONSE RULES:
- Keep ALL responses to 2-3 sentences MAX
- Be extremely concise and direct
- NO lengthy explanations

WHEN TO SHOW CODE (ONLY these cases):
1. User explicitly says "show me the code" or "show code"
2. User asks you to "fix a bug" or "debug" with explicit error details
3. User confirms they want to proceed with implementation after you explained the plan
4. User asks to "implement" or "build" something AND you already discussed the plan

NEVER SHOW CODE IF:
- This is the FIRST message in conversation (ABSOLUTE RULE)
- User is asking a question
- User wants explanation or planning
- User hasn't confirmed they want implementation yet
- User is discussing features or requirements
- You're explaining an approach or giving advice

FORMATTING STYLE:
- Use **bold** for key terms only
- Use bullet points (•) for short lists
- Use inline \`code\` for technical terms
- 2-3 sentences MAX per response

CODE FORMAT (only when explicitly needed):
- Include file path: \`\`\`typescript // src/path/File.tsx
- React/TypeScript only, no HTML
- Complete, runnable code

WORKFLOW:
1. First message: Ask what they want (NO CODE)
2. Explain approach in 2-3 sentences (NO CODE)
3. Wait for user confirmation
4. Only then show code if they confirm${taskSpecificGuidance}`;

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
        max_tokens: 8192, // Increased to support longer code generation
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
