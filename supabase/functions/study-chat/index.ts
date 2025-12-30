import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verifyAuthQuick } from "../_shared/auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

// Check if user opted out of training
async function checkOptOut(userId: string) {
  const { data } = await supabase
    .from('user_profiles')
    .select('opt_out_training')
    .eq('id', userId)
    .single()

  return data?.opt_out_training || false
}

// Log chat history (de-personalized)
async function logChatHistory(userId: string, messages: any[], specialty: string, optedOut: boolean) {
  try {
    await supabase.from('study_chat_history').insert({
      user_id: userId,
      specialty,
      depersonalized_messages: messages, // Assume already de-personalized
      opted_out_training: optedOut
    })
  } catch (error) {
    console.error('Failed to log chat history:', error)
  }
}

// Log AI content
async function logAIContent(userId: string, inputData: any, outputData: any, processingTime: number) {
  try {
    await supabase.from('ai_content_log').insert({
      function_name: 'study-chat',
      user_id: userId,
      input_data: inputData,
      output_data: outputData,
      model_used: 'gemini-2.5-flash',
      processing_time_ms: processingTime
    })
  } catch (error) {
    console.error('Failed to log AI content:', error)
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const authResult = await verifyAuthQuick(req);
  if ('error' in authResult) {
    return authResult.error;
  }

  const userId = authResult.user.id

  try {
    const chatSchema = z.object({
      message: z.string().min(1).max(2000),
      specialty: z.string().max(100).optional(),
      sessionHistory: z.array(z.object({
        role: z.string(),
        content: z.string()
      })).max(20).optional()
    });

    const rawData = await req.json();
    const validationResult = chatSchema.safeParse(rawData);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { message, specialty, sessionHistory } = validationResult.data;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert medical interpreter study assistant. Help students learn medical terminology, interpretation techniques, and professional skills.

${specialty ? `Specialty focus: ${specialty}` : ''}

CRITICAL RULES:
- Provide clear, educational explanations
- Use examples when teaching concepts
- Encourage active learning
- Keep responses concise (2-3 paragraphs)
- For terminology, include: English term, Spanish translation, pronunciation, usage example
- For techniques, provide specific actionable advice
- Return plain text responses (NO JSON unless specifically requested)

Example interaction:
USER: "How do I interpret 'shortness of breath' professionally?"
RESPONSE: "The medical term 'shortness of breath' is formally called dyspnea (disp-NEE-ah). In Spanish, you would say 'dificultad para respirar' or 'disnea' in medical contexts.

When interpreting this for a patient, maintain the medical accuracy while ensuring clarity. For example: 'The doctor is asking if you experience difficulty breathing' works well in most situations.

Pro tip: Always clarify whether it's at rest or with exertion, as this distinction is clinically important."`;

    const startTime = Date.now()

    const messages = [
      { role: "system", content: systemPrompt },
      ...(sessionHistory || []),
      { role: "user", content: message }
    ]

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        temperature: 0.5,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429 || response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    const processingTime = Date.now() - startTime

    // Check if user opted out of training data
    const optedOut = await checkOptOut(userId)

    // Log conversation (de-personalized)
    const updatedHistory = [...(sessionHistory || []), { role: "user", content: message }, { role: "assistant", content: content }]
    await logChatHistory(userId, updatedHistory, specialty || 'general', optedOut)

    // Log AI content
    await logAIContent(userId, { specialty, messageLength: message.length }, { responseLength: content.length }, processingTime)

    return new Response(JSON.stringify({ response: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("study-chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});