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
      function_name: 'generate-interpreter-feedback',
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
    const feedbackSchema = z.object({
      sessionType: z.string().max(100),
      userTranscript: z.string().min(10).max(3000),
      targetScript: z.string().min(10).max(3000).optional(),
      focusAreas: z.array(z.string()).max(5).optional()
    });

    const rawData = await req.json();
    const validationResult = feedbackSchema.safeParse(rawData);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { sessionType, userTranscript, targetScript, focusAreas } = validationResult.data;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert medical interpreter trainer providing constructive performance feedback.

CRITICAL RULES:
- Be supportive yet honest
- Provide specific, actionable feedback
- Highlight both strengths and areas for improvement
- Reference professional standards (NCIHC, CHIA)
- Keep feedback concise and structured
- Return ONLY valid JSON

Example output:
{
  "overallAssessment": "Strong interpretation with good accuracy and professional tone.",
  "strengths": [
    "Excellent medical terminology accuracy",
    "Maintained appropriate register and formality"
  ],
  "areasForImprovement": [
    "Consider using more natural phrasing in target language",
    "Practice managing longer utterances with note-taking"
  ],
  "specificExamples": {
    "good": "Your rendering of 'hypertension' as 'presión arterial alta' was culturally appropriate",
    "improve": "The phrase 'dolor en el pecho' could be more precisely rendered as 'dolor torácico' in clinical context"
  },
  "nextSteps": [
    "Practice consecutive interpreting with 2-3 minute segments",
    "Review cardiovascular terminology list"
  ]
}`;

    let userPrompt = `Session type: ${sessionType}\n\nUser's interpretation:\n${userTranscript}`

    if (target Script) {
  userPrompt += `\n\nExpected/target script:\n${targetScript}`
}

if (focusAreas && focusAreas.length > 0) {
  userPrompt += `\n\nFocus feedback on: ${focusAreas.join(', ')}`
}

const startTime = Date.now()

const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
    temperature: 0.3,
    max_tokens: 800,
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
let content = data.choices?.[0]?.message?.content || "";

const processingTime = Date.now() - startTime

try {
  const cleanedContent = content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const feedback = JSON.parse(jsonMatch[0]);

    if (feedback.overallAssessment) {
      // Log AI content
      await logAIContent(userId, { sessionType, focusAreas }, feedback, processingTime)

      return new Response(JSON.stringify(feedback), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }
} catch (parseError) {
  console.error("JSON parse error:", parseError);
  await logAIContent(userId, { sessionType }, { error: 'Parse failed' }, processingTime)
}

// Fallback
const fallback = {
  overallAssessment: "Thank you for submitting your interpretation for feedback.",
  strengths: ["Completion of the exercise"],
  areasForImprovement: ["Unable to generate detailed feedback - please try again"],
  specificExamples: {},
  nextSteps: ["Review foundational interpretation techniques"]
}

return new Response(JSON.stringify(fallback), {
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});
  } catch (error) {
  console.error("generate-interpreter-feedback error:", error);
  return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
    status: 500,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
});
