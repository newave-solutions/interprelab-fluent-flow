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
        success: true,
        data: {
            english: data.term,
            translation: data[languageColumn],
            pronunciation: data.phonetic_pronunciation,
            definition: data.definition,
            targetLanguage,
            rawResponse: `TERM (ENGLISH): ${data.term}\nTERM (${targetLanguage.toUpperCase()}): ${data[languageColumn]}\nDEFINITION: ${data.definition}\nPRONUNCIATION: ${data.phonetic_pronunciation}`,
            fromDatabase: true
        }
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
            function_name: 'advanced-terminology-search',
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

        // Strict system prompt with few-shot example
        const systemPrompt = `You are a medical terminology expert. Respond EXACTLY like this example:

TERM (ENGLISH): Hypertension
TERM (SPANISH): Hipertensión
DEFINITION: Abnormally high blood pressure in the arteries, typically defined as a reading of 140/90 mmHg or higher.
PRONUNCIATION: hahy-per-TEN-shuhn

Now provide the same format for the user's term. NO other text.

CRITICAL RULES:
- NO introductions, greetings, or explanations
- NO markdown formatting (no *, #, -, bullets)
- NO extra text before or after
- Start immediately with "TERM (ENGLISH):"
- Each section on its own line
- Keep definition to 1-2 sentences maximum`;

        const userPrompt = context
            ? `Medical term: "${term}" (Context: ${context})`
            : `Medical term: "${term}"`;

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
                temperature: 0.1,
                max_tokens: 200,
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
        let result = data.choices?.[0]?.message?.content;

        if (!result) {
            throw new Error("No content in AI response");
        }

        const processingTime = Date.now() - startTime;
        await logAIContent(userId, { term, targetLanguage, context }, { rawResponse: result }, processingTime);

        // Post-processing cleanup - remove common unwanted patterns
        result = result
            .replace(/^(Here's|Here is|Sure|Certainly)[^:]*:/gi, '')
            .replace(/\*\*/g, '')  // Remove bold
            .replace(/\#{1,6}\s/g, '')  // Remove headers
            .replace(/^[-•]\s/gm, '')  // Remove bullets
            .trim();

        // Validation - check if response matches expected format
        const hasRequiredSections =
            result.includes('TERM (ENGLISH):') &&
            result.includes(`TERM (${targetLanguage.toUpperCase()}):`) &&
            result.includes('DEFINITION:') &&
            result.includes('PRONUNCIATION:');

        if (!hasRequiredSections) {
            console.error('LLM response missing required sections:', result);

            // Return a structured error response
            return new Response(JSON.stringify({
                error: 'Response format validation failed',
                details: 'The AI response did not include all required sections',
                partialResponse: result
            }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Parse the structured response into an object
        const lines = result.split('\n').filter(line => line.trim());
        const parsedData: Record<string, string> = {};

        for (const line of lines) {
            if (line.includes('TERM (ENGLISH):')) {
                parsedData.english = line.replace('TERM (ENGLISH):', '').trim();
            } else if (line.includes(`TERM (${targetLanguage.toUpperCase()}):`)) {
                parsedData.translation = line.replace(`TERM (${targetLanguage.toUpperCase()}):`, '').trim();
            } else if (line.includes('DEFINITION:')) {
                parsedData.definition = line.replace('DEFINITION:', '').trim();
            } else if (line.includes('PRONUNCIATION:')) {
                parsedData.pronunciation = line.replace('PRONUNCIATION:', '').trim();
            }
        }

        const finalParsedData = {
            english: parsedData.english || term,
            translation: parsedData.translation || '',
            definition: parsedData.definition || '',
            pronunciation: parsedData.pronunciation || '',
            targetLanguage,
            rawResponse: result
        };

        // Log the successful lookup
        await logLookup(userId, term, JSON.stringify(finalParsedData), `en-${targetLanguage.toLowerCase().substring(0, 2)}`)

        // Return structured JSON response
        return new Response(JSON.stringify({
            success: true,
            data: finalParsedData
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("advanced-terminology-search error:", error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            success: false
        }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
