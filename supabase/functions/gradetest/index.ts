// InterpreTest Grading Engine - Main Entry Point
// Handles all AI-powered assessment grading via Gemini API

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { callGemini, extractJSON } from './utils/gemini.ts'
import { verifyAuthQuick } from '../_shared/auth.ts'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}



// === GRADING MODULES ===

// 1. Grade Voice Module
async function gradeVoice(payload: { transcript: string; targetScript: string; duration: number }) {
    const prompt = `
You are an expert medical interpreter evaluator. Analyze this voice interpretation:

TARGET SCRIPT (what they should say):
"${payload.targetScript}"

USER'S TRANSCRIPT (what they actually said):
"${payload.transcript}"

DURATION: ${payload.duration} seconds

Rate the user on a scale of 0-100 for each metric:
1. **Clarity**: How clear and understandable is the speech?
2. **Pacing**: Appropriate speed for medical interpretation?
3. **Completeness**: Did they cover all key information?

Return ONLY valid JSON in this format:
{
  "clarity": <number 0-100>,
  "pacing": <number 0-100>,
  "completeness": <number 0-100>,
  "overallScore": <number 0-100>,
  "feedback": "<2-3 sentence constructive feedback>"
}
`

    const result = await callGemini(prompt)
    if (!result) return { error: 'Failed to grade voice' }

    return extractJSON(result) || { error: 'Invalid response format' }
}

// 2. Grade Syntax/Grammar Module
async function gradeSyntax(payload: { userAnswer: string; questionData: any }) {
    const prompt = `
You are an English language proficiency expert. A bilingual medical interpreter (potentially US-based with limited formal English grammar training) answered a grammar question.

QUESTION:
Sentence with error: "${payload.questionData.sentence}"
Correct answer ID: ${payload.questionData.correctId}

USER'S ANSWER: ${payload.userAnswer}

Evaluate if their selection is correct. If wrong, provide clear feedback WITHOUT USING GRAMMAR TERMINOLOGY. Explain in simple terms what sounds wrong and what sounds right.

Return ONLY valid JSON:
{
  "isCorrect": <boolean>,
  "score": <100 if correct, 60 if incorrect>,
  "feedback": "<2-3 sentences explaining why, using simple language>"
}
`

    const result = await callGemini(prompt)
    if (!result) return { error: 'Failed to grade syntax' }

    return extractJSON(result) || { error: 'Invalid response format' }
}

// 3. Grade Vocabulary Matching
async function gradeVocab(payload: { matches: Record<string, number>; correctPairs: any[] }) {
    let correct = 0
    const total = payload.correctPairs.length

    Object.entries(payload.matches).forEach(([enId, esId]) => {
        if (parseInt(enId) === parseInt(esId as any)) correct++
    })

    const score = Math.round((correct / total) * 100)

    return {
        score,
        correct,
        total,
        feedback: score >= 75
            ? "Excellent medical terminology knowledge!"
            : "Review medical terms with flashcards for improvement."
    }
}

// 4. Grade Cultural Adaptation
async function gradeCultural(payload: { userInterpretation: string; sourcePhrase: string }) {
    const prompt = `
You are an expert in medical interpretation and cultural adaptation. 

SOURCE (English slang): "${payload.sourcePhrase}"
USER'S INTERPRETATION (Spanish): "${payload.userInterpretation}"

Evaluate on 0-100:
1. How well did they adapt the informal language to appropriate medical Spanish?
2. Did they maintain the meaning while adjusting tone?
3. Is it culturally appropriate for a Spanish-speaking patient?

Return ONLY valid JSON:
{
  "score": <number 0-100>,
  "culturalAccuracy": <number 0-100>,
  "toneAdaptation": <number 0-100>,
  "feedback": "<2-3 sentences highlighting strengths and areas for improvement>"
}
`

    const result = await callGemini(prompt)
    if (!result) return { error: 'Failed to grade cultural adaptation' }

    return extractJSON(result) || { error: 'Invalid response format' }
}

// 5. Grade Ethics Scenario
async function gradeEthics(payload: { chosenOption: any; scenario: string }) {
    return {
        score: payload.chosenOption.score,
        feedback: payload.chosenOption.feedback,
        ethicalAlignment: payload.chosenOption.score >= 70 ? "Strong" : "Needs Review"
    }
}

// 6. Grade Typing Test
async function gradeTyping(payload: { text: string; duration: number; errorCount: number }) {
    const wordCount = payload.text.trim().split(/\s+/).length
    const wpm = Math.round((wordCount / payload.duration) * 60)
    const accuracy = Math.max(0, 100 - (payload.errorCount * 2))

    const prompt = `
Evaluate this email written by a medical interpreter trainee:

TEXT: "${payload.text}"

Rate on 0-100:
1. **Grammar Quality**: Sentence structure, verb tenses, punctuation
2. **Coherence**: Logical flow and organization of thoughts
3. **Professional Tone**: Appropriate for medical/professional context

Return ONLY valid JSON:
{
  "grammarScore": <number 0-100>,
  "coherenceScore": <number 0-100>,
  "professionalismScore": <number 0-100>,
  "overallQuality": <number 0-100>,
  "feedback": "<2 sentences on writing quality>"
}
`

    const result = await callGemini(prompt)
    const aiScores = extractJSON(result) || {}

    return {
        wpm,
        accuracy,
        ...aiScores,
        compositeScore: Math.round((wpm / 2) + (accuracy / 2))
    }
}

// 7. Generate Final Report
async function generateReport(payload: { scores: Record<string, number> }) {
    const prompt = `
Write a concise, encouraging assessment report for a medical interpreter trainee.

SCORES:
- Voice: ${payload.scores.voice || 0}/100
- Grammar: ${payload.scores.syntax || 0}/100
- Vocabulary: ${payload.scores.vocab || 0}/100
- Cultural Adaptation: ${payload.scores.cultural || 0}/100
- Ethics: ${payload.scores.ethics || 0}/100
- Typing: ${payload.scores.typing || 0}/100

Provide:
1. **Summary** (2 sentences): Overall performance
2. **Top Strength** (1 sentence): Best area
3. **Focus Area** (1 sentence): Main area for improvement
4. **Next Steps** (2 bullet points): Specific actionable recommendations

Return ONLY valid JSON:
{
  "summary": "<string>",
  "topStrength": "<string>",
  "focusArea": "<string>",
  "nextSteps": ["<string>", "<string>"],
  "compositeScore": <overall average number>
}
`

    const result = await callGemini(prompt)
    if (!result) return { error: 'Failed to generate report' }

    return extractJSON(result) || { error: 'Invalid response format' }
}

// === MAIN HANDLER ===

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    // Verify authentication
    const authResult = await verifyAuthQuick(req);
    if ('error' in authResult) {
        return authResult.error;
    }

    try {
        const { action, payload } = await req.json()

        let result
        switch (action) {
            case 'grade-voice':
                result = await gradeVoice(payload)
                break
            case 'grade-syntax':
                result = await gradeSyntax(payload)
                break
            case 'grade-vocab':
                result = await gradeVocab(payload)
                break
            case 'grade-cultural':
                result = await gradeCultural(payload)
                break
            case 'grade-ethics':
                result = await gradeEthics(payload)
                break
            case 'grade-typing':
                result = await gradeTyping(payload)
                break
            case 'generate-report':
                result = await generateReport(payload)
                break
            default:
                return new Response(
                    JSON.stringify({ error: 'Invalid action' }),
                    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
        }

        return new Response(
            JSON.stringify(result),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Error in gradetest function:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
