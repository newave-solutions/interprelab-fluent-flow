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

// Check if user wants caching and check existing decks
async function checkUserDecks(userId: string, cardType: string, specialty: string) {
  const { data, error } = await supabase
    .from('flashcard_decks')
    .select('*')
    .eq('user_id', userId)
    .eq('card_type', cardType)
    .eq('specialty', specialty)
    .limit(1)
    .maybeSingle()

  if (error || !data) return null

  // Increment usage
  await supabase.rpc('increment_flashcard_usage', { deck_id: data.id }).catch(console.error)

  return data.cards
}

// Save flashcard deck
async function saveDeck(userId: string, title: string, cardType: string, specialty: string, cards: any, isPublic: boolean) {
  try {
    await supabase.from('flashcard_decks').insert({
      user_id: userId,
      title,
      card_type: cardType,
      specialty,
      cards,
      is_public: isPublic
    })
  } catch (error) {
    console.error('Failed to save flashcard deck:', error)
  }
}

// Log AI content
async function logAIContent(userId: string, inputData: any, outputData: any, processingTime: number) {
  try {
    await supabase.from('ai_content_log').insert({
      function_name: 'generate-flashcards',
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
    const flashcardSchema = z.object({
      cardType: z.enum(['root-words', 'term-translation', 'term-definition', 'custom']),
      specialty: z.string().min(1).max(100),
      count: z.number().min(5).max(20).default(10),
      saveToLibrary: z.boolean().default(true)
    });

    const rawData = await req.json();
    const validationResult = flashcardSchema.safeParse(rawData);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { cardType, specialty, count, saveToLibrary } = validationResult.data;

    // Check existing decks
    if (saveToLibrary) {
      const existingCards = await checkUserDecks(userId, cardType, specialty)
      if (existingCards) {
        return new Response(JSON.stringify({ cards: existingCards, fromCache: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const cardTypeInstructions = {
      'root-words': 'Create flashcards teaching medical root words (e.g., "cardi-" = heart). Front: root, Back: meaning + example term.',
      'term-translation': 'Create term translation flashcards. Front: English medical term, Back: Spanish translation + pronunciation.',
      'term-definition': 'Create definition flashcards. Front: Medical term, Back: Clear definition in simple language.',
      'custom': 'Create specialty-specific flashcards with clinical scenarios or key concepts.'
    }

    const systemPrompt = `You are a medical interpreter educator creating flashcards for ${specialty} specialty.

Card type: ${cardType}
Instructions: ${cardTypeInstructions[cardType]}

CRITICAL RULES:
- Return ONLY valid JSON array
- Create exactly ${count} unique flashcards
- NO markdown formatting
- Keep content concise (front: max 50 chars, back: max 200 chars)
- Ensure accuracy of medical information

Example output:
[
  {"front": "Hypertension", "back": "Hipertensión (ee-per-ten-SYON) - High blood pressure"},
  {"front": "Diabetes", "back": "Diabetes (dee-ah-BEH-tes) - Blood sugar disorder"}
]`;

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
          { role: "user", content: `Generate ${count} ${cardType} flashcards for ${specialty}.` }
        ],
        temperature: 0.4,
        max_tokens: 1200,
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

      const jsonMatch = cleanedContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const flashcards = JSON.parse(jsonMatch[0]);

        if (Array.isArray(flashcards) && flashcards.length > 0) {
          // Save to library if requested
          if (saveToLibrary) {
            const title = `${specialty} - ${cardType} (${flashcards.length} cards)`
            await saveDeck(userId, title, cardType, specialty, flashcards, false) // Private by default for free users
          }

          // Log AI content
          await logAIContent(userId, { cardType, specialty, count }, { count: flashcards.length }, processingTime)

          return new Response(JSON.stringify({ cards: flashcards, fromCache: false }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      await logAIContent(userId, { cardType, specialty }, { error: 'Parse failed' }, processingTime)
    }

    // Fallback
    const fallback = [
      { front: `${specialty} term 1`, back: "Unable to generate - please try again" },
      { front: `${specialty} term 2`, back: "Unable to generate - please try again" }
    ]

    return new Response(JSON.stringify({ cards: fallback, fromCache: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-flashcards error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});