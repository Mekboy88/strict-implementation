import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userRequest } = await req.json();
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!userRequest || userRequest.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Please enter a request to create a plan' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Make plan request:', userRequest);

    const systemPrompt = `You are UR-DEV AI, an expert project planner for web development. 
Your job is to break down user requests into clear, actionable tasks.

Rules:
- Create 3-7 tasks that are specific and actionable
- Order tasks logically (what needs to be done first)
- Each task should be completable in a single coding session
- Focus on practical implementation steps
- Use clear, concise language`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Break down this request into actionable development tasks:\n\n"${userRequest}"` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_task_plan",
              description: "Create a structured plan with actionable tasks",
              parameters: {
                type: "object",
                properties: {
                  tasks: {
                    type: "array",
                    description: "List of actionable tasks to complete the request",
                    items: {
                      type: "object",
                      properties: {
                        title: { 
                          type: "string",
                          description: "Short, actionable task title (max 60 chars)"
                        },
                        description: {
                          type: "string",
                          description: "Brief description of what needs to be done"
                        }
                      },
                      required: ["title"],
                      additionalProperties: false
                    }
                  },
                  summary: {
                    type: "string",
                    description: "Brief summary of the overall plan"
                  }
                },
                required: ["tasks"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_task_plan" } },
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
        JSON.stringify({ error: 'Failed to generate plan' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('OpenAI response:', JSON.stringify(data, null, 2));

    // Extract the tool call response
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'create_task_plan') {
      console.error('No valid tool call in response');
      return new Response(
        JSON.stringify({ error: 'Failed to parse plan from AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const plan = JSON.parse(toolCall.function.arguments);
    console.log('Generated plan:', plan);

    return new Response(JSON.stringify(plan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Make plan function error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
