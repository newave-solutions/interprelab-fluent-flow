// InterpreTest Grading Engine - Enhanced with Database Integration
// Handles all AI-powered assessment grading via Gemini API with rubric-based scoring

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verifyAuthQuick } from '../_shared/auth.ts'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Supabase client for database queries
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

// === HELPER FUNCTIONS ===

// Fetch grading rubric from database
async function fetchRubric(moduleType: string) {
    const { data, error } = await supabase
        .from('grading_rubrics')
        .select('*')
        .eq('module_type', moduleType)
        .eq('is_active', true)
        .order('version', { ascending: false })
        .limit(1)
        .single()

    if (error || !data) {
        console.error(`Failed to fetch rubric for ${moduleType}:`, error)
        return null
    }

    return data
}

// Log AI content for monitoring
async function logAIContent(functionName: string, userId: string, inputData: any, outputData: any, modelUsed: string, processingTime: number) {
    try {
        await supabase.from('ai_content_log').insert({
            function_name: functionName,
            user_id: userId,
            input_data: inputData,
            output_data: outputData,
            model_used: modelUsed,
            processing_time_ms: processingTime
        })
    } catch (error) {
        console.error('Failed to log AI content:', error)
    }
}

// Call Gemini API with strict output constraints
async function callGemini(systemPrompt: string, userPrompt: string, temperature = 0.1, maxTokens = 500) {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')

    if (!LOVABLE_API_KEY) {
        throw new Error('LOVABLE_API_KEY not configured')
    }

    const startTime = Date.now()

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature,
            max_tokens: maxTokens,
        }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        console.error('Gemini API error:', response.status, errorText)

        if (response.status === 429) {
            throw new Error('Rate limit exceeded, please try again later')
        }
        if (response.status === 402) {
            throw new Error('Payment required, please add funds')
        }
        throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
        throw new Error('No content in AI response')
    }

    const processingTime = Date.now() - startTime

    return { content, processingTime }
}

// Extract and clean JSON from response
function extractJSON(text: string) {
    try {
        // Remove markdown code blocks
        let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '')

        // Remove common prefixes
        cleaned = cleaned.replace(/^(Here's|Here is|The|Response:?)\s*/i, '')

        // Try to parse
        return JSON.parse(cleaned.trim())
    } catch (error) {
        console.error('JSON parse error:', error)
        return null
    }
}

// === GRADING MODULES (Enhanced with Rubrics) ===

// 1. Grade Voice Module
async function gradeVoice(payload: { transcript: string; targetScript: string; duration: number }, userId: string) {
    // Fetch rubric
    const rubric = await fetchRubric('voice')

    if (!rubric) {
        return { error: 'Grading rubric not available' }
    }

    const systemPrompt = `You are an expert medical interpreter assessment evaluator. Use this rubric to grade:

${JSON.stringify(rubric.rubric_data, null, 2)}

CRITICAL RULES:
- Return ONLY valid JSON
- No markdown formatting
- No extra text before or after
- Scores must be 0-100 integers
- Provide specific, actionable feedback

Example output:
{
  "pronunciation": 85,
  "fluency": 90,
  "accuracy": 95,
  "voice_quality": 88,
  "overallScore": 90,
  "feedback": "Excellent accuracy with clear pronunciation. Minor pacing improvements would enhance delivery."
}`

    const userPrompt = `Grade this voice interpretation:

TARGET SCRIPT: "${payload.targetScript}"
USER TRANSCRIPT: "${payload.transcript}"
DURATION: ${payload.duration} seconds

Evaluate based on the rubric criteria and return the JSON format shown in the example.`

    try {
        const { content, processingTime } = await callGemini(systemPrompt, userPrompt, 0.1, 500)
        const result = extractJSON(content)

        if (!result || typeof result.overallScore !== 'number') {
            return { error: 'Invalid response format from AI' }
        }

        // Log AI content
        await logAIContent('gradetest-voice', userId, payload, result, 'gemini-2.5-flash', processingTime)

        return result
    } catch (error) {
        console.error('gradeVoice error:', error)
        return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

// 2. Grade Syntax/Grammar Module
async function gradeSyntax(payload: { userAnswer: string; questionData: any }, userId: string) {
    const rubric = await fetchRubric('syntax')

    if (!rubric) {
        return { error: 'Grading rubric not available' }
    }

    const systemPrompt = `You are an expert language evaluator for medical interpreters. Use this rubric:

${JSON.stringify(rubric.rubric_data, null, 2)}

Evaluate grammar/syntax understanding WITHOUT using complex terminology.

Example output:
{
  "isCorrect": true,
  "score": 100,
  "feedback": "Correct! This sentence flows naturally and maintains professional tone."
}`

    const userPrompt = `Question: "${payload.questionData.sentence}"
Correct answer ID: ${payload.questionData.correctId}
User's answer: ${payload.userAnswer}

Is the user correct? Provide simple, clear feedback.`

    try {
        const { content, processingTime } = await callGemini(systemPrompt, userPrompt, 0.1, 300)
        const result = extractJSON(content)

        if (!result) {
            return { error: 'Invalid response format from AI' }
        }

        await logAIContent('gradetest-syntax', userId, payload, result, 'gemini-2.5-flash', processingTime)

        return result
    } catch (error) {
        console.error('gradeSyntax error:', error)
        return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

// 3. Grade Vocabulary Matching (No AI needed)
async function gradeVocab(payload: { matches: Record<string, number>; correctPairs: any[] }, userId: string) {
    let correct = 0
    const total = payload.correctPairs.length

    Object.entries(payload.matches).forEach(([enId, esId]) => {
        if (parseInt(enId) === parseInt(esId as any)) correct++
    })

    const score = Math.round((correct / total) * 100)

    const result = {
        score,
        correct,
        total,
        feedback: score >= 75
            ? "Excellent medical terminology knowledge!"
            : "Review medical terms with flashcards for improvement."
    }

    // Log for analytics
    await logAIContent('gradetest-vocab', userId, payload, result, 'rule-based', 0)

    return result
}

// 4. Grade Cultural Adaptation
async function gradeCultural(payload: { userInterpretation: string; sourcePhrase: string }, userId: string) {
    const rubric = await fetchRubric('cultural')

    if (!rubric) {
        return { error: 'Grading rubric not available' }
    }

    const systemPrompt = `You are a cultural adaptation expert for medical interpretation. Use this rubric:

${JSON.stringify(rubric.rubric_data, null, 2)}

Evaluate cultural and linguistic appropriateness.

Example output:
{
  "cultural_awareness": 90,
  "appropriate_adaptation": 85,
  "sensitivity": 95,
  "clarity": 88,
  "score": 90,
  "feedback": "Excellent cultural mediation. The adaptation maintains meaning while being culturally appropriate."
}`

    const userPrompt = `Evaluate this cultural adaptation:

SOURCE (English): "${payload.sourcePhrase}"
USER INTERPRETATION (Spanish): "${payload.userInterpretation}"

Rate based on the rubric criteria.`

    try {
        const { content, processingTime } = await callGemini(systemPrompt, userPrompt, 0.1, 400)
        const result = extractJSON(content)

        if (!result || typeof result.score !== 'number') {
            return { error: 'Invalid response format from AI' }
        }

        await logAIContent('gradetest-cultural', userId, payload, result, 'gemini-2.5-flash', processingTime)

        return result
    } catch (error) {
        console.error('gradeCultural error:', error)
        return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

// 5. Grade Ethics Scenario (Pre-scored)
async function gradeEthics(payload: { chosenOption: any; scenario: string }, userId: string) {
    const result = {
        score: payload.chosenOption.score,
        feedback: payload.chosenOption.feedback,
        ethicalAlignment: payload.chosenOption.score >= 70 ? "Strong" : "Needs Review"
    }

    await logAIContent('gradetest-ethics', userId, payload, result, 'pre-scored', 0)

    return result
}

// 6. Grade Typing Test
async function gradeTyping(payload: { text: string; duration: number; errorCount: number }, userId: string) {
    const wordCount = payload.text.trim().split(/\s+/).length
    const wpm = Math.round((wordCount / payload.duration) * 60)
    const accuracy = Math.max(0, 100 - (payload.errorCount * 2))

    const rubric = await fetchRubric('typing')

    if (!rubric) {
        return { error: 'Grading rubric not available' }
    }

    const systemPrompt = `You are an evaluator for written communication in medical settings. Use this rubric:

${JSON.stringify(rubric.rubric_data, null, 2)}

Evaluate grammar, coherence, and professionalism.

Example output:
{
  "grammarScore": 90,
  "coherenceScore": 85,
  "professionalismScore": 95,
  "overallQuality": 90,
  "feedback": "Well-structured professional email with clear communication and appropriate tone."
}`

    const userPrompt = `Evaluate this email:

"${payload.text}"

Rate the writing quality.`

    try {
        const { content, processingTime } = await callGemini(systemPrompt, userPrompt, 0.1, 400)
        const aiScores = extractJSON(content) || {}

        const result = {
            wpm,
            accuracy,
            ...aiScores,
            compositeScore: Math.round((wpm / 2) + (accuracy / 2))
        }

        await logAIContent('gradetest-typing', userId, payload, result, 'gemini-2.5-flash', processingTime)

        return result
    } catch (error) {
        console.error('gradeTyping error:', error)
        return { wpm, accuracy, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

// 7. Generate Final Report
async function generateReport(payload: { scores: Record<string, number> }, userId: string) {
    const systemPrompt = `You are a supportive medical interpreter training assessor.

Write an encouraging, specific assessment report.

Return ONLY valid JSON in this exact format:
{
  "summary": "2 concise sentences about overall performance",
  "topStrength": "1 sentence highlighting best area",
  "focusArea": "1 sentence identifying main improvement area",
  "nextSteps": ["specific action 1", "specific action 2"],
  "compositeScore": average_score_number
}

NO markdown, NO extra text.`

    const scoresText = Object.entries(payload.scores)
        .map(([module, score]) => `${module}: ${score}/100`)
        .join('\n')

    const userPrompt = `Generate report for these scores:

${scoresText}

Return the JSON format specified in the system prompt.`

    try {
        const { content, processingTime } = await callGemini(systemPrompt, userPrompt, 0.2, 600)
        const result = extractJSON(content)

        if (!result) {
            return { error: 'Invalid response format from AI' }
        }

        await logAIContent('gradetest-report', userId, payload, result, 'gemini-2.5-flash', processingTime)

        return result
    } catch (error) {
        console.error('generateReport error:', error)
        return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
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

    const userId = authResult.user.id

    try {
        const { action, payload } = await req.json()

        let result
        switch (action) {
            case 'grade-voice':
                result = await gradeVoice(payload, userId)
                break
            case 'grade-syntax':
                result = await gradeSyntax(payload, userId)
                break
            case 'grade-vocab':
                result = await gradeVocab(payload, userId)
                break
            case 'grade-cultural':
                result = await gradeCultural(payload, userId)
                break
            case 'grade-ethics':
                result = await gradeEthics(payload, userId)
                break
            case 'grade-typing':
                result = await gradeTyping(payload, userId)
                break
            case 'generate-report':
                result = await generateReport(payload, userId)
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
            JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
