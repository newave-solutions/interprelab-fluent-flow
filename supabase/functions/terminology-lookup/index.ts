// Terminology Lookup Edge Function
// Uses Google Gemini AI to provide medical terminology definitions and translations

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TerminologyRequest {
  term: string
  sourceLanguage?: string
  targetLanguage?: string
  context?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { term, sourceLanguage = 'en', targetLanguage = 'es', context } = await req.json() as TerminologyRequest

    if (!term) {
      throw new Error('Term is required')
    }

    // Get Google API key from environment
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY')
    if (!googleApiKey) {
      throw new Error('GOOGLE_API_KEY not configured')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from auth header
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    // Build prompt for Gemini
    const prompt = `You are a medical terminology expert and interpreter assistant.

Provide a comprehensive explanation for the medical term: "${term}"

${context ? `Context: ${context}` : ''}

Please provide:
1. Definition in ${sourceLanguage === 'en' ? 'English' : sourceLanguage}
2. Translation to ${targetLanguage === 'es' ? 'Spanish' : targetLanguage}
3. Pronunciation guide (IPA format)
4. Usage example in a medical context
5. Related terms or synonyms
6. Any important notes for interpreters

Format your response as JSON with these fields:
{
  "term": "original term",
  "definition": "clear definition",
  "translation": "translation in target language",
  "pronunciation": "IPA pronunciation",
  "example": "usage example",
  "relatedTerms": ["term1", "term2"],
  "interpreterNotes": "important notes"
}`

    // Call Google Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${googleApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
          },
        }),
      }
    )

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`)
    }

    const geminiData = await geminiResponse.json()
    const responseText = geminiData.candidates[0].content.parts[0].text

    // Try to parse JSON from response
    let result
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\{[\s\S]*\}/)
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText
      result = JSON.parse(jsonText)
    } catch (e) {
      // If parsing fails, return structured response from text
      result = {
        term,
        definition: responseText,
        translation: '',
        pronunciation: '',
        example: '',
        relatedTerms: [],
        interpreterNotes: ''
      }
    }

    // Log the request to ai_content_requests table
    await supabaseClient
      .from('ai_content_requests')
      .insert({
        user_id: user.id,
        request_type: 'explanation',
        prompt: prompt,
        parameters: { term, sourceLanguage, targetLanguage, context },
        response_data: result,
        status: 'completed',
        model_used: 'gemini-pro',
      })

    // Check if term should be added to glossary
    const { data: existingTerm } = await supabaseClient
      .from('glossary_terms')
      .select('id')
      .eq('user_id', user.id)
      .eq('term', term)
      .maybeSingle()

    // If term doesn't exist in user's glossary, suggest adding it
    const shouldAddToGlossary = !existingTerm

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ...result,
          shouldAddToGlossary,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
