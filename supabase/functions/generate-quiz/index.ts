import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verifyAuthQuick } from "../_shared/auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

// Fetch quiz framework
async function fetchFramework(frameworkName?: string) {
  const query = supabase
    .from('quiz_frameworks')
    .select('*')
    .eq('is_active', true)

  if (frameworkName) {
    query.eq('framework_name', frameworkName)
  }

  const { data, error } = await query.limit(1).single()

  if (error || !data) {
    console.error('Failed to fetch framework:', error)
    return null
  }

  return data
}

// Log AI content
async function logAIContent(userId: string, inputData: any, outputData: any, processingTime: number) {
  try {
    await supabase.from('ai_content_log').insert({
      function_name: 'generate-quiz',
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
    const quizSchema = z.object({
      specialty: z.string().min(1).max(100),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
      frameworkName: z.string().optional()
    });

    const rawData = await req.json();
    const validationResult = quizSchema.safeParse(rawData);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { specialty, difficulty, frameworkName } = validationResult.data;

    // Fetch framework to constrain generation
    const framework = await fetchFramework(frameworkName)

    if (!framework) {
      return new Response(JSON.stringify({ error: 'Quiz framework not found' }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const difficultyGuidance = {
      beginner: "Use common medical terms, simple vocabulary, and straightforward scenarios.",
      intermediate: "Include specialized terminology, moderate complexity, and clinical context.",
      advanced: "Use complex medical terminology, rare conditions, and challenging interpretation scenarios."
    };

    const systemPrompt = `You are an expert medical interpreter trainer. Generate quiz questions following this framework:

${JSON.stringify(framework.structure, null, 2)}

Create one multiple-choice question at the ${difficulty} level for ${specialty}.

${difficultyGuidance[difficulty]}

CRITICAL RULES:
- Return ONLY valid JSON
- NO markdown formatting
- NO extra text
- Match the framework structure exactly

Example output:
{
  "question": "What is the correct Spanish translation of 'hypertension'?",
  "options": ["Hipertensión", "Diabetes", "Presión baja", "Anemia"],
  "correctIndex": 0,
  "explanation": "Hipertensión is the correct medical term for high blood pressure in Spanish."
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
          { role: "user", content: `Generate a ${difficulty} level quiz question about ${specialty} medical terminology.` }
        ],
        temperature: 0.3, // Slightly higher for variety
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";

    const processingTime = Date.now() - startTime

    // Parse the JSON from the response
    try {
      const cleanedContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const quizData = JSON.parse(jsonMatch[0]);

        // Validate the quiz structure
        if (quizData.question && Array.isArray(quizData.options) && typeof quizData.correctIndex === 'number') {
          // Log successful generation
          await logAIContent(userId, { specialty, difficulty, frameworkName }, quizData, processingTime)

          return new Response(JSON.stringify(quizData), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      await logAIContent(userId, { specialty, difficulty }, { error: 'Parse failed', raw: content }, processingTime)
    }

    // Fallback quiz question from framework
    const fallbackQuestion = {
      question: `What is an important ${specialty} medical term that interpreters should know?`,
      options: ["Term A", "Term B", "Term C", "Term D"],
      correctIndex: 0,
      explanation: "Unable to generate AI question. Please try again.",
      framework: framework.framework_name
    }

    await logAIContent(userId, { specialty, difficulty }, { error: 'Fallback used' }, processingTime)

    return new Response(JSON.stringify(fallbackQuestion), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-quiz error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
