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

// Check cache for existing scenario
async function checkScenarioCache(setting: string, difficulty: string, languagePair: string) {
  const { data, error } = await supabase
    .from('scenario_cache')
    .select('*')
    .eq('setting', setting)
    .eq('difficulty', difficulty)
    .eq('language_pair', languagePair)
    .limit(1)
    .maybeSingle()

  if (error || !data) return null

  // Increment usage
  await supabase.rpc('increment_scenario_usage', { scenario_id: data.id }).catch(console.error)

  return data.scenario_data
}

// Save scenario to cache
async function cacheScenario(setting: string, difficulty: string, languagePair: string, scenarioData: any) {
  try {
    await supabase.from('scenario_cache').insert({
      setting,
      difficulty,
      language_pair: languagePair,
      scenario_data: scenarioData
    })
  } catch (error) {
    console.error('Failed to cache scenario:', error)
  }
}

// Log AI content
async function logAIContent(userId: string, inputData: any, outputData: any, processingTime: number) {
  try {
    await supabase.from('ai_content_log').insert({
      function_name: 'generate-scenario',
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
    const scenarioSchema = z.object({
      setting: z.string().min(1).max(100),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
      languagePair: z.string().default('en-es'),
      useCache: z.boolean().default(true)
    });

    const rawData = await req.json();
    const validationResult = scenarioSchema.safeParse(rawData);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { setting, difficulty, languagePair, useCache } = validationResult.data;

    // Check cache first if enabled
    if (useCache) {
      const cachedScenario = await checkScenarioCache(setting, difficulty, languagePair)
      if (cachedScenario) {
        return new Response(JSON.stringify({ ...cachedScenario, fromCache: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const difficultyGuidance = {
      beginner: "Use simple medical vocabulary, basic clinical situations, and clear, straightforward dialogue.",
      intermediate: "Include specialized medical terms, realistic clinical complexity, and natural conversational flow.",
      advanced: "Use complex medical terminology, rare conditions, cultural nuances, and challenging interpretation scenarios."
    };

    const systemPrompt = `You are an expert medical interpreter trainer creating realistic practice scenarios.

Generate a medical interpretation practice scenario at the ${difficulty} level.

Setting: ${setting}
Language Pair: ${languagePair}
Difficulty: ${difficultyGuidance[difficulty]}

CRITICAL RULES:
- Return ONLY valid JSON
- NO markdown formatting
- Create 10-14 dialogue exchanges
- Alternate between patient/provider
- Include culturally appropriate language

Example structure:
{
  "title": "Brief scenario title",
  "setting": "${setting}",
  "lines": [
    {"speaker": "doctor", "language": "en", "text": "Hello, how are you feeling today?"},
    {"speaker": "patient", "language": "es", "text": "Me duele mucho el pecho."}
  ],
  "keyTerms": ["chest pain", "dolor de pecho"],
  "culturalNotes": "Patient may use informal language"
}`;

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
          { role: "user", content: `Generate a ${difficulty} medical interpretation scenario for ${setting}.` }
        ],
        temperature: 0.4,
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
        const scenarioData = JSON.parse(jsonMatch[0]);

        if (scenarioData.title && Array.isArray(scenarioData.lines)) {
          // Cache the scenario for reuse
          await cacheScenario(setting, difficulty, languagePair, scenarioData)

          // Log AI content
          await logAIContent(userId, { setting, difficulty, languagePair }, scenarioData, processingTime)

          return new Response(JSON.stringify({ ...scenarioData, fromCache: false }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      await logAIContent(userId, { setting, difficulty }, { error: 'Parse failed', raw: content }, processingTime)
    }

    // Fallback scenario
    const fallback = {
      title: `${setting} Consultation`,
      setting,
      lines: [
        { speaker: "doctor", language: "en", text: "How can I help you today?" },
        { speaker: "patient", language: "es", text: "No me siento bien." }
      ],
      keyTerms: ["symptoms", "s síntomas"],
      culturalNotes: "Unable to generate full scenario. Please try again."
    }

    await logAIContent(userId, { setting, difficulty }, { error: 'Fallback used' }, processingTime)

    return new Response(JSON.stringify({ ...fallback, fromCache: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-scenario error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
