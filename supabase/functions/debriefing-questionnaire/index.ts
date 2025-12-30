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

// Log debriefing response
async function logDebriefingResponse(userId: string, responses: any, aiAnalysis: string, sentimentScore: number) {
  try {
    await supabase.from('debriefing_responses').insert({
      user_id: userId,
      responses,
      ai_analysis: aiAnalysis,
      sentiment_score: sentimentScore
    })
  } catch (error) {
    console.error('Failed to log debriefing:', error)
  }
}

// Log AI content
async function logAIContent(userId: string, inputData: any, outputData: any, processingTime: number) {
  try {
    await supabase.from('ai_content_log').insert({
      function_name: 'debriefing-questionnaire',
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
    const debriefingSchema = z.object({
      sessionType: z.string().max(100),
      responses: z.object({
        emotionalImpact: z.string().max(500),
        challenges: z.string().max(500),
        copingStrategies: z.string().max(500),
        supportNeeded: z.string().max(500).optional()
      })
    });

    const rawData = await req.json();
    const validationResult = debriefingSchema.safeParse(rawData);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { sessionType, responses } = validationResult.data;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a compassionate debriefing analyst for medical interpreters. Analyze their post-session reflection and provide supportive insights.

CRITICAL RULES:
- Be empathetic and validating
- Identify emotional patterns and stress indicators
- Suggest specific coping strategies
- Recognize signs of burnout or vicarious trauma
- DO NOT diagnose mental health conditions
- Return ONLY valid JSON

Example output:
{
  "sentiment": -3,
  "insights": "You processed an emotionally difficult session with professionalism. The feelings of helplessness are common in complex medical cases.",
  "copingRecommendations": [
    "Practice grounding techniques after intense sessions",
    "Consider peer supervision to process difficult cases"
  ],
  "supportLevel": "moderate"
}

Sentiment scale: -10 (very negative) to +10 (very positive)
Support level: "minimal", "moderate", "high"`;

    const userPrompt = `Session type: ${sessionType}

Emotional impact: ${responses.emotionalImpact}
Challenges: ${responses.challenges}
Coping strategies used: ${responses.copingStrategies}
${responses.supportNeeded ? `Support needed: ${responses.supportNeeded}` : ''}

Analyze and provide compassionate feedback.`;

    const startTime = Date.now()

    const apiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("AI gateway error:", apiResponse.status, errorText);

      if (apiResponse.status === 429 || apiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
          status: apiResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await apiResponse.json();
    let content = data.choices?.[0]?.message?.content || "";

    const processingTime = Date.now() - startTime

    // Parse JSON response
    try {
      const cleanedContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);

        // Log to database (backend only - not exposed to frontend)
        await logDebriefingResponse(userId, responses, analysis.insights, analysis.sentiment || 0)

        // Log AI content
        await logAIContent(userId, { sessionType }, analysis, processingTime)

        return new Response(JSON.stringify(analysis), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      await logAIContent(userId, { sessionType }, { error: 'Parse failed' }, processingTime)
    }

    // Fallback
    const fallback = {
      sentiment: 0,
      insights: "Thank you for completing this debriefing. Your reflections have been recorded.",
      copingRecommendations: ["Take time to rest", "Connect with supportive colleagues"],
      supportLevel: "moderate"
    }

    await logDebriefingResponse(userId, responses, fallback.insights, 0)

    return new Response(JSON.stringify(fallback), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("debriefing-questionnaire error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});