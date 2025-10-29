// Generate Flashcards Edge Function
// Uses Google Gemini AI to generate medical terminology flashcards

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FlashcardRequest {
  topic: string
  category: string
  count?: number
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  sourceLanguage?: string
  targetLanguage?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const {
      topic,
      category,
      count = 20,
      difficulty = 'intermediate',
      sourceLanguage = 'en',
      targetLanguage = 'es'
    } = await req.json() as FlashcardRequest

    if (!topic || !category) {
      throw new Error('Topic and category are required')
    }

    const googleApiKey = Deno.env.get('GOOGLE_API_KEY')
    if (!googleApiKey) {
      throw new Error('GOOGLE_API_KEY not configured')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const prompt = `You are a medical terminology expert creating flashcards for interpreter training.

Topic: ${topic}
Category: ${category}
Difficulty: ${difficulty}
Source Language: ${sourceLanguage}
Target Language: ${targetLanguage}
Number of cards: ${count}

Generate ${count} flashcards with medical terminology related to "${topic}".

For each flashcard provide:
1. Front: Term in ${sourceLanguage}
2. Back: Translation in ${targetLanguage}
3. Pronunciation: IPA pronunciation guide
4. Example: Usage in a medical context
5. Notes: Important information for interpreters

Format as JSON array:
{
  "flashcards": [
    {
      "frontText": "term in source language",
      "backText": "translation in target language",
      "pronunciationGuide": "IPA pronunciation",
      "exampleSentence": "usage example",
      "category": "${category}",
      "subcategory": "specific subcategory",
      "difficultyLevel": "${difficulty}",
      "tags": ["tag1", "tag2"]
    }
  ]
}`

    // Call Gemini API
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
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
        }),
      }
    )

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`)
    }

    const geminiData = await geminiResponse.json()
    const responseText = geminiData.candidates[0].content.parts[0].text

    // Parse JSON response
    let result
    try {
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\{[\s\S]*\}/)
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText
      result = JSON.parse(jsonText)
    } catch (e) {
      throw new Error('Failed to parse AI response')
    }

    if (!result.flashcards || !Array.isArray(result.flashcards)) {
      throw new Error('Invalid flashcard format from AI')
    }

    // Log the request
    await supabaseClient
      .from('ai_content_requests')
      .insert({
        user_id: user.id,
        request_type: 'flashcards',
        prompt: prompt,
        parameters: { topic, category, count, difficulty, sourceLanguage, targetLanguage },
        response_data: result,
        status: 'completed',
        model_used: 'gemini-pro',
      })

    // Insert flashcards into database
    const flashcardsToInsert = result.flashcards.map((card: any) => ({
      user_id: user.id,
      front_text: card.frontText,
      back_text: card.backText,
      front_language: sourceLanguage,
      back_language: targetLanguage,
      category: card.category || category,
      subcategory: card.subcategory,
      difficulty_level: card.difficultyLevel || difficulty,
      pronunciation_guide: card.pronunciationGuide,
      example_sentence: card.exampleSentence,
      tags: card.tags || [],
      ai_generated: true,
    }))

    const { data: insertedCards, error: insertError } = await supabaseClient
      .from('flashcards')
      .insert(flashcardsToInsert)
      .select()

    if (insertError) {
      throw new Error(`Failed to save flashcards: ${insertError.message}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          flashcards: insertedCards,
          count: insertedCards.length,
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
