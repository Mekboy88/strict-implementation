import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, message, projectContext } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch project details if projectId provided
    let projectInfo = projectContext || {};
    
    if (projectId) {
      // Get project
      const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (project) {
        projectInfo.project = project;
      }

      // Get recent files
      const { data: files } = await supabase
        .from('project_files')
        .select('file_path, file_type, updated_at')
        .eq('project_id', projectId)
        .order('updated_at', { ascending: false })
        .limit(20);
      
      if (files) {
        projectInfo.recentFiles = files;
      }

      // Get recent deployments
      const { data: deployments } = await supabase
        .from('project_deployments')
        .select('status, deployment_url, created_at, build_log')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (deployments) {
        projectInfo.recentDeployments = deployments;
      }

      // Get platform errors for this project
      const { data: errors } = await supabase
        .from('platform_errors')
        .select('error_message, error_code, stack_trace, created_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (errors) {
        projectInfo.recentErrors = errors;
      }
    }

    const systemPrompt = `You are an expert AI assistant helping administrators diagnose and troubleshoot project issues on the UR-DEV platform.

Your capabilities:
- Analyze project structure and files
- Identify common issues and errors
- Suggest fixes and improvements
- Help with deployment problems
- Guide admins through debugging steps

Project Context:
${JSON.stringify(projectInfo, null, 2)}

Guidelines:
- Be concise and actionable
- Provide step-by-step solutions when applicable
- Reference specific files or errors when available
- Suggest preventive measures
- If you need more information, ask specific questions`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Log the AI interaction
    await supabase.from('llm_logs').insert({
      prompt: message,
      response: aiResponse,
      metadata: { projectId, type: 'diagnose' }
    });

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-diagnose function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
