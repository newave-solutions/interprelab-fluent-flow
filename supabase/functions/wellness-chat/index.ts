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

// Log AI content
async function logAIContent(userId: string, inputData: any, outputData: any, processingTime: number) {
  try {
    await supabase.from('ai_content_log').insert({
      function_name: 'wellness-chat',
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

// Log wellness check-in
async function logWellnessCheckin(userId: string, moodScore: number, stressLevel: string) {
  try {
    await supabase.from('wellness_checkins').insert({
      user_id: userId,
      mood_score: moodScore,
      stress_level: stressLevel,
      burnout_indicators: {}
    })
  } catch (error) {
    console.error('Failed to log wellness check-in:', error)
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
      mood: z.enum(['very_poor', 'poor', 'okay', 'good', 'excellent']).optional(),
      sessionHistory: z.array(z.any()).max(20).optional()
    });

    const rawData = await req.json();
    const validationResult = chatSchema.safeParse(rawData);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { message, mood, sessionHistory } = validationResult.data;

    // Map mood to score and stress level
    const moodScoreMap = { very_poor: 1, poor: 2, okay: 3, good: 4, excellent: 5 }
    const stressLevelMap = { very_poor: 'high', poor: 'high', okay: 'moderate', good: 'low', excellent: 'low' }

    if (mood) {
      await logWellnessCheckin(userId, moodScoreMap[mood], stressLevelMap[mood])
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a compassionate wellness support assistant for medical interpreters. Your role is to provide emotional support, stress management guidance, and professional wellbeing resources.

CRITICAL RULES:
- Be empathetic, supportive, and non-judgmental
- Keep responses concise (2-3 short paragraphs max)
- Provide actionable coping strategies when appropriate
- Recognize signs of burnout and suggest resources
- DO NOT provide medical or mental health diagnosis
- DO NOT replace professional therapy
- Encourage seeking professional help if needed

Example interaction:
USER: "I'm feeling overwhelmed after a difficult interpretation session."
RESPONSE: "I hear you - interpreting emotionally charged medical situations can be mentally exhausting. It's completely normal to feel this way. 

Consider taking a brief break to practice deep breathing or step outside for fresh air. Many interpreters find it helpful to debrief difficult sessions with a trusted colleague.

Remember, your emotional wellbeing matters. If these feelings persist, consider speaking with a counselor who understands interpreter stress."`;

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
        temperature: 0.7, // Higher for empathetic, natural responses
        max_tokens: 400,
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

    // Log AI content (minimal for privacy)
    await logAIContent(userId, { mood, hasHistory: !!sessionHistory }, { responseLength: content.length }, processingTime)

    return new Response(JSON.stringify({ response: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("wellness-chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});