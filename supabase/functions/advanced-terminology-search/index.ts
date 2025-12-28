import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { verifyAuthQuick } from "../_shared/auth.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    // Verify authentication
    const authResult = await verifyAuthQuick(req);
    if ('error' in authResult) {
        return authResult.error;
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
                max_tokens: 200,   // Limit length
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
        let result = data.choices?.[0]?.message?.content || "";

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

        // Return structured JSON response
        return new Response(JSON.stringify({
            success: true,
            data: {
                english: parsedData.english || term,
                translation: parsedData.translation || '',
                pronunciation: parsedData.pronunciation || '',
                definition: parsedData.definition || '',
                targetLanguage,
                rawResponse: result
            }
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
