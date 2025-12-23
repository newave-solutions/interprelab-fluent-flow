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
    const lookupSchema = z.object({
      term: z.string().min(1).max(200),
      targetLanguage: z.string().default('Spanish'),
      context: z.string().max(500).optional()
    });

    const rawData = await req.json();
    const validationResult = lookupSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.errors }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { term, targetLanguage, context } = validationResult.data;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a specialized medical terminology expert for interpreters. Provide accurate, detailed terminology information for medical interpreters working between English and ${targetLanguage}.

For each term, provide:
1. The term in English
2. The precise medical translation in ${targetLanguage}
3. Phonetic pronunciation guide (IPA format)
4. A clear, concise definition suitable for medical contexts
5. Common usage context in medical settings
6. Any important notes about regional variations or common misinterpretations

Format your response as a valid JSON object with this structure:
{
  "english": "term in English",
  "translation": "translation in target language",
  "pronunciation": "IPA pronunciation",
  "definition": "medical definition",
  "context": "how it's used in medical settings",
  "notes": "any important considerations",
  "relatedTerms": ["related term 1", "related term 2"]
}`;

    const userPrompt = context 
      ? `Look up the medical term "${term}" in the context of: ${context}`
      : `Look up the medical term "${term}"`;

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
    
    // Try to parse the JSON from the response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const termData = JSON.parse(jsonMatch[0]);
        return new Response(JSON.stringify(termData), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch {
      // If JSON parsing fails, return structured response from raw content
    }

    return new Response(JSON.stringify({ 
      english: term,
      translation: content,
      pronunciation: "",
      definition: content,
      notes: "Response could not be fully structured"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("terminology-lookup error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
