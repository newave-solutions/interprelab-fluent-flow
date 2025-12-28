import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verifyAuthQuick } from "../_shared/auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

// Check database for existing term
async function checkDatabaseForTerm(term: string, targetLanguage: string) {
  const languageColumn = targetLanguage.toLowerCase() === 'spanish' ? 'translation_spanish' :
    targetLanguage.toLowerCase() === 'chinese' ? 'translation_chinese' : null

  if (!languageColumn) return null

  const { data, error } = await supabase
    .from('medical_terms')
    .select('*')
    .ilike('term', term)
    .limit(1)
    .single()

  if (error || !data) return null

  // Increment usage count
  await supabase.rpc('increment_medical_term_usage', { term_id: data.id }).catch(console.error)

  return {
    english: data.term,
    translation: data[languageColumn],
    pronunciation: data.phonetic_pronunciation,
    definition: data.definition,
    context: `Category: ${data.category}`,
    notes: data.aliases?.join(', ') || '',
    relatedTerms: [],
    fromDatabase: true
  }
}

// Log terminology lookup
async function logLookup(userId: string, term: string, aiSuggestion: string | null, languagePair: string) {
  try {
    await supabase.from('terminology_lookups').insert({
      user_id: userId,
      term,
      ai_suggestion: aiSuggestion,
      language_pair: languagePair
    })
  } catch (error) {
    console.error('Failed to log lookup:', error)
  }
}

// Log AI content
async function logAIContent(userId: string, inputData: any, outputData: any, processingTime: number) {
  try {
    await supabase.from('ai_content_log').insert({
      function_name: 'terminology-lookup',
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

  // Verify authentication
  const authResult = await verifyAuthQuick(req);
  if ('error' in authResult) {
    return authResult.error;
  }

  const userId = authResult.user.id

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

    // Check database first
    const dbResult = await checkDatabaseForTerm(term, targetLanguage)

    if (dbResult) {
      // Log the lookup
      await logLookup(userId, term, null, `en-${targetLanguage.toLowerCase().substring(0, 2)}`)

      return new Response(
        JSON.stringify(dbResult),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If not in database, use AI
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
}

CRITICAL RULES:
- Return ONLY valid JSON
- NO markdown code blocks
- NO extra text before or after JSON
- Keep definition under 100 words`;

    const userPrompt = context
      ? `Define the medical term "${term}" in the context of: ${context}`
      : `Define the medical term "${term}"`;

    const startTime = Date.now()

    // Make API call with strict output constraints
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
        temperature: 0.1,  // Lower = more deterministic
        max_tokens: 500,   // Limit length for JSON response
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Post-processing cleanup
    content = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^\*\*.*?\*\*:?\s*/gm, '')
      .replace(/^[-*]\s+/gm, '')
      .replace(/^(Here's|Here is|Response:?)\s*/i, '')
      .trim();

    const processingTime = Date.now() - startTime

    // Try to parse the cleaned content
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(content);
      parsedResponse.fromDatabase = false

      // Log the lookup and AI content
      await logLookup(userId, term, JSON.stringify(parsedResponse), `en-${targetLanguage.toLowerCase().substring(0, 2)}`)
      await logAIContent(userId, { term, targetLanguage, context }, parsedResponse, processingTime)

    } catch (parseError) {
      console.error("Failed to parse JSON:", content);

      // Fallback response
      parsedResponse = {
        english: term,
        translation: "Unable to parse response",
        pronunciation: "",
        definition: content.substring(0, 200),
        context: "",
        notes: "AI response could not be parsed properly",
        relatedTerms: [],
        fromDatabase: false
      };

      await logAIContent(userId, { term, targetLanguage, context }, { error: 'Parse failed', raw: content }, processingTime)
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("terminology-lookup error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
