import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const quizSchema = z.object({
      specialty: z.string().min(1).max(100),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
      questionCount: z.number().min(1).max(10).default(1)
    });

    const rawData = await req.json();
    const validationResult = quizSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.errors }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { specialty, difficulty } = validationResult.data;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const difficultyGuidance = {
      beginner: "Use common medical terms, simple vocabulary, and straightforward scenarios.",
      intermediate: "Include specialized terminology, moderate complexity, and clinical context.",
      advanced: "Use complex medical terminology, rare conditions, and challenging interpretation scenarios."
    };

    const systemPrompt = `You are an expert medical interpreter trainer creating quiz questions for interpreters specializing in ${specialty}.

Create one multiple-choice question that tests medical terminology and interpretation knowledge at the ${difficulty} level.

${difficultyGuidance[difficulty]}

You MUST return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "question": "The quiz question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Detailed explanation of why the correct answer is right and why others are wrong"
}

Focus on:
- Accurate medical terminology in English and Spanish
- Common interpretation challenges
- Real-world clinical scenarios
- Cultural considerations in medical interpreting
- Proper register and tone`;

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
          { role: "user", content: `Generate a ${difficulty} level quiz question about ${specialty} medical terminology and interpretation.` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429 || response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse the JSON from the response
    try {
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const quizData = JSON.parse(jsonMatch[0]);
        
        // Validate the quiz structure
        if (quizData.question && Array.isArray(quizData.options) && typeof quizData.correctIndex === 'number') {
          return new Response(JSON.stringify(quizData), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
    }

    // Fallback quiz question
    return new Response(JSON.stringify({
      question: `What is the correct Spanish translation for a common ${specialty} term?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: 0,
      explanation: "Unable to generate AI question. Please try again."
    }), {
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
