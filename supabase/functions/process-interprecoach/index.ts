import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verifyAuthQuick } from "../_shared/auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

// Fetch medical terms from database
async function fetchMedicalTerms() {
  const { data, error } = await supabase
    .from('medical_terms')
    .select('term, definition, translation_spanish, category')
    .eq('is_verified', true)

  if (error || !data) {
    console.error('Failed to fetch medical terms:', error)
    return []
  }

  return data
}

// Detect medical terms in de-identified text
async function detectMedicalTerms(text: string) {
  const terms = await fetchMedicalTerms()
  const detected: Array<{ term: string; definition: string; translation?: string; category: string }> = []
  const lowerText = text.toLowerCase()

  terms.forEach(termData => {
    if (lowerText.includes(termData.term.toLowerCase())) {
      detected.push({
        term: termData.term,
        definition: termData.definition,
        translation: termData.translation_spanish,
        category: termData.category
      })

      // Increment usage count
      supabase.rpc('increment_medical_term_usage', {
        term_id: termData.id
      }).catch(console.error)
    }
  })

  return detected
}

// Log AI content
async function logAIContent(userId: string, inputData: any, outputData: any, processingTime: number) {
  try {
    await supabase.from('ai_content_log').insert({
      function_name: 'process-interprecoach',
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

// Generate contextual highlights using AI
async function generateHighlights(text: string, medications: string[], conversions: any[]) {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    console.log('LOVABLE_API_KEY not set, returning basic highlights');
    return generateBasicHighlights(text, medications, conversions);
  }

  try {
    const systemPrompt = `You are a medical interpretation assistant. Analyze de-identified medical text and provide key insights.

CRITICAL RULES:
- Return ONLY valid JSON
- NO markdown formatting
- Focus on clinical highlights
- Keep descriptions concise

Example output:
{
  "highlights": [
    {"icon": "💊", "text": "2 new medications prescribed"},
    {"icon": "❤️", "text": "Blood pressure: 140/90 mmHg"},
    {"icon": "📋", "text": "Follow-up in 2 weeks"}
  ]
}`;

    const startTime = Date.now()

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze: ${text}\n\nMedications: ${medications.join(', ')}` }
        ],
        temperature: 0.2,
        max_tokens: 300
      }),
    });

    if (!response.ok) {
      console.error('AI API error:', response.status);
      return generateBasicHighlights(text, medications, conversions);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const processingTime = Date.now() - startTime

    if (content) {
      try {
        const cleanedContent = content
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return parsed.highlights || generateBasicHighlights(text, medications, conversions);
        }
      } catch {
        return generateBasicHighlights(text, medications, conversions);
      }
    }

    return generateBasicHighlights(text, medications, conversions);
  } catch (error) {
    console.error('Error generating highlights:', error);
    return generateBasicHighlights(text, medications, conversions);
  }
}

function generateBasicHighlights(text: string, medications: string[], conversions: any[]) {
  const highlights = [];

  if (medications.length > 0) {
    highlights.push({
      icon: '💊',
      text: `${medications.length} medication(s) mentioned`
    });
  }

  if (conversions.length > 0) {
    highlights.push({
      icon: '📊',
      text: `${conversions.length} unit conversion(s) detected`
    });
  }

  // Detect vital signs patterns
  if (text.match(/\d+\/\d+/)) {
    highlights.push({
      icon: '❤️',
      text: 'Blood pressure measurement detected'
    });
  }

  if (text.match(/\d+\s*(bpm|beats)/i)) {
    highlights.push({
      icon: '💓',
      text: 'Heart rate measurement detected'
    });
  }

  return highlights;
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
    const { text, medications = [], conversions = [] } = await req.json();

    console.log('Processing de-identified text:', text.substring(0, 100));

    if (!text) {
      throw new Error('No text provided');
    }

    const startTime = Date.now()

    // Process de-identified text with database lookup
    const medicalTerms = await detectMedicalTerms(text);
    const highlights = await generateHighlights(text, medications, conversions);

    const processingTime = Date.now() - startTime

    // Log AI content (for highlights generation)
    await logAIContent(userId,
      { textLength: text.length, medicationCount: medications.length },
      { termsFound: medicalTerms.length, highlightsGenerated: highlights.length },
      processingTime
    )

    return new Response(
      JSON.stringify({
        medicalTerms,
        highlights,
        processed: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Processing error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
