import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { AI_MODEL } from "../_shared/constants.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Medical terminology database
const MEDICAL_TERMS_DB: Record<string, { definition: string; translation?: string; category: string }> = {
  'hypertension': { 
    definition: 'High blood pressure', 
    translation: 'Presión arterial alta', 
    category: 'cardiovascular' 
  },
  'diabetes': { 
    definition: 'Metabolic disorder characterized by high blood sugar', 
    translation: 'Diabetes', 
    category: 'endocrine' 
  },
  'myocardial infarction': { 
    definition: 'Heart attack - blockage of blood flow to the heart muscle', 
    translation: 'Infarto de miocardio', 
    category: 'cardiovascular' 
  },
  'pneumonia': { 
    definition: 'Infection that inflames air sacs in lungs', 
    translation: 'Neumonía', 
    category: 'respiratory' 
  },
  'fracture': { 
    definition: 'Broken bone', 
    translation: 'Fractura', 
    category: 'orthopedic' 
  },
  'abdominal': { 
    definition: 'Relating to the abdomen/belly area', 
    translation: 'Abdominal', 
    category: 'anatomy' 
  },
  'acute': { 
    definition: 'Sudden onset, severe', 
    translation: 'Agudo', 
    category: 'general' 
  },
  'chronic': { 
    definition: 'Long-lasting, persistent', 
    translation: 'Crónico', 
    category: 'general' 
  },
  'dosage': { 
    definition: 'Amount of medication to be taken', 
    translation: 'Dosis', 
    category: 'medication' 
  },
  'adverse': { 
    definition: 'Harmful, unfavorable', 
    translation: 'Adverso', 
    category: 'general' 
  },
  'benign': { 
    definition: 'Not cancerous, non-threatening', 
    translation: 'Benigno', 
    category: 'oncology' 
  },
  'malignant': { 
    definition: 'Cancerous, life-threatening', 
    translation: 'Maligno', 
    category: 'oncology' 
  },
  'inflammation': { 
    definition: 'Swelling, redness, pain as immune response', 
    translation: 'Inflamación', 
    category: 'general' 
  },
  'hemorrhage': { 
    definition: 'Excessive bleeding', 
    translation: 'Hemorragia', 
    category: 'emergency' 
  }
};

// Detect medical terms in de-identified text
function detectMedicalTerms(text: string) {
  const detected: Array<{ term: string; definition: string; translation?: string; category: string }> = [];
  const lowerText = text.toLowerCase();
  
  Object.entries(MEDICAL_TERMS_DB).forEach(([term, info]) => {
    if (lowerText.includes(term.toLowerCase())) {
      detected.push({
        term: term,
        definition: info.definition,
        translation: info.translation,
        category: info.category
      });
    }
  });
  
  return detected;
}

// Generate contextual highlights using AI
async function generateHighlights(text: string, medications: string[], conversions: any[]) {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    console.log('LOVABLE_API_KEY not set, returning basic highlights');
    return generateBasicHighlights(text, medications, conversions);
  }

  try {
    const systemPrompt = `You are a medical interpretation assistant. Analyze de-identified medical text and provide:
1. Key clinical highlights (symptoms, diagnoses, procedures)
2. Important numerical values (vital signs, lab results)
3. Critical action items (medications, follow-ups)

Respond in JSON format: { "highlights": [{ "icon": "emoji", "text": "highlight text" }] }

Important: The text is already de-identified. Do not reference any PHI.`;

    const response = await fetch(LOVABLE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this de-identified medical text:\n\n${text}\n\nMedications mentioned: ${medications.join(', ')}\nUnit conversions needed: ${JSON.stringify(conversions)}` }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      console.error('AI API error:', response.status);
      return generateBasicHighlights(text, medications, conversions);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (content) {
      try {
        const parsed = JSON.parse(content);
        return parsed.highlights || generateBasicHighlights(text, medications, conversions);
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
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, medications = [], conversions = [] } = await req.json();
    
    console.log('Processing de-identified text:', text.substring(0, 100));
    
    if (!text) {
      throw new Error('Request must include a "text" field with de-identified medical text to process');
    }

    // Process de-identified text only
    const medicalTerms = detectMedicalTerms(text);
    const highlights = await generateHighlights(text, medications, conversions);

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
