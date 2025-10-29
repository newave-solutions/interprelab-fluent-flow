// Ethics Consultation Edge Function
// Uses Google Gemini AI to provide ethics guidance and generate quizzes

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EthicsRequest {
  query: string
  type: 'question' | 'quiz' | 'scenario'
  standard?: 'IMIA' | 'CCHI' | 'NBCMI' | 'NCIHC' | 'CLAS'
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, type, standard = 'IMIA', difficulty = 'intermediate' } = await req.json() as EthicsRequest

    if (!query) {
      throw new Error('Query is required')
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

    let prompt = ''

    if (type === 'question') {
      prompt = `You are an expert in medical interpretation ethics and standards, specifically ${standard}.

User question: "${query}"

Provide a comprehensive answer that:
1. Directly addresses the question
2. References relevant ${standard} standards and guidelines
3. Provides practical examples
4. Explains the reasoning behind ethical principles
5. Offers actionable guidance for interpreters

Format your response as JSON:
{
  "answer": "detailed answer",
  "standards": ["relevant standard codes"],
  "examples": ["practical examples"],
  "keyPoints": ["main takeaways"],
  "additionalResources": ["suggested readings"]
}`
    } else if (type === 'quiz') {
      prompt = `You are creating an ethics quiz for medical interpreters based on ${standard} standards.

Topic: "${query}"
Difficulty: ${difficulty}

Generate 5 multiple-choice questions that test knowledge of:
- Ethical principles
- Professional standards
- Real-world scenarios
- Best practices

Format as JSON:
{
  "questions": [
    {
      "question": "question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "why this is correct",
      "standard": "relevant standard code"
    }
  ]
}`
    } else if (type === 'scenario') {
      prompt = `You are creating an ethical scenario for medical interpreter training based on ${standard}.

Scenario topic: "${query}"
Difficulty: ${difficulty}

Create a realistic scenario that:
1. Presents an ethical dilemma
2. Requires application of ${standard} standards
3. Has multiple possible approaches
4. Includes discussion points

Format as JSON:
{
  "scenario": "detailed scenario description",
  "dilemma": "the ethical challenge",
  "options": ["possible action 1", "possible action 2", "possible action 3"],
  "analysis": "analysis of each option",
  "bestPractice": "recommended approach",
  "standards": ["relevant standards"]
}`
    }

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
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
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

    // Parse JSON response
    let result
    try {
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\{[\s\S]*\}/)
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText
      result = JSON.parse(jsonText)
    } catch (e) {
      result = {
        answer: responseText,
        type: type,
      }
    }

    // Log to database
    await supabaseClient
      .from('ai_content_requests')
      .insert({
        user_id: user.id,
        request_type: type === 'quiz' ? 'quiz' : 'explanation',
        prompt: prompt,
        parameters: { query, type, standard, difficulty },
        response_data: result,
        status: 'completed',
        model_used: 'gemini-pro',
      })

    // If it's a quiz, optionally save to quizzes table
    if (type === 'quiz' && result.questions) {
      await supabaseClient
        .from('quizzes')
        .insert({
          user_id: user.id,
          title: `Ethics Quiz: ${query}`,
          description: `Generated quiz on ${standard} standards`,
          quiz_type: 'multiple_choice',
          questions: result.questions,
          passing_score: 70,
          ai_generated: true,
        })
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
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
