// InterpreTest Grading Engine - Main Entry Point
// Handles all AI-powered assessment grading via Lovable AI Gateway

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Lovable AI Gateway helper
async function callLovableAI(prompt: string): Promise<string | null> {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
        console.error('LOVABLE_API_KEY not configured');
        return null;
    }

    try {
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${LOVABLE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'google/gemini-2.5-flash',
                messages: [
                    { role: 'system', content: 'You are an expert medical interpreter evaluator. Return ONLY valid JSON without markdown formatting.' },
                    { role: 'user', content: prompt }
                ],
                stream: false,
            }),
        });

        if (!response.ok) {
            console.error('Lovable AI Error:', response.status, await response.text());
            return null;
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || null;
    } catch (error) {
        console.error('Lovable AI Exception:', error);
        return null;
    }
}

function extractJSON(text: string | null): Record<string, unknown> | null {
    if (!text) return null;

    try {
        // Try to find JSON block in markdown code fence
        const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
            return JSON.parse(codeBlockMatch[1]);
        }

        // Try to find raw JSON object
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        // Try parsing the whole text
        return JSON.parse(text);
    } catch (e) {
        console.error('JSON Parse Error:', e);
        console.error('Text was:', text?.substring(0, 200));
        return null;
    }
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

    const result = await callLovableAI(prompt);
    if (!result) return { error: 'Failed to grade voice' };

    return extractJSON(result) || { error: 'Invalid response format' };
}

// 2. Grade Syntax/Grammar Module
async function gradeSyntax(payload: { userAnswer: string; questionData: { sentence: string; correctId: string } }) {
    const prompt = `
You are an English language proficiency expert. A bilingual medical interpreter answered a grammar question.

QUESTION:
Sentence with error: "${payload.questionData.sentence}"
Correct answer ID: ${payload.questionData.correctId}

USER'S ANSWER: ${payload.userAnswer}

Evaluate if their selection is correct. If wrong, provide clear feedback WITHOUT USING GRAMMAR TERMINOLOGY.

Return ONLY valid JSON:
{
  "isCorrect": <boolean>,
  "score": <100 if correct, 60 if incorrect>,
  "feedback": "<2-3 sentences explaining why, using simple language>"
}
`

    const result = await callLovableAI(prompt);
    if (!result) return { error: 'Failed to grade syntax' };

    return extractJSON(result) || { error: 'Invalid response format' };
}

// 3. Grade Vocabulary Matching
async function gradeVocab(payload: { matches: Record<string, number>; correctPairs: { id: number }[] }) {
    let correct = 0;
    const total = payload.correctPairs.length;

    Object.entries(payload.matches).forEach(([enId, esId]) => {
        if (parseInt(enId) === esId) correct++;
    });

    const score = Math.round((correct / total) * 100);

    return {
        score,
        correct,
        total,
        feedback: score >= 75
            ? "Excellent medical terminology knowledge!"
            : "Review medical terms with flashcards for improvement."
    };
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

    const result = await callLovableAI(prompt);
    if (!result) return { error: 'Failed to grade cultural adaptation' };

    return extractJSON(result) || { error: 'Invalid response format' };
}

// 5. Grade Ethics Scenario
async function gradeEthics(payload: { chosenOption: { score: number; feedback: string } }) {
    return {
        score: payload.chosenOption.score,
        feedback: payload.chosenOption.feedback,
        ethicalAlignment: payload.chosenOption.score >= 70 ? "Strong" : "Needs Review"
    };
}

// 6. Grade Typing Test
async function gradeTyping(payload: { text: string; duration: number; errorCount: number }) {
    const wordCount = payload.text.trim().split(/\s+/).length;
    const wpm = Math.round((wordCount / payload.duration) * 60);
    const accuracy = Math.max(0, 100 - (payload.errorCount * 2));

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

    const result = await callLovableAI(prompt);
    const aiScores = extractJSON(result) || {};

    return {
        wpm,
        accuracy,
        ...aiScores,
        compositeScore: Math.round((wpm / 2) + (accuracy / 2))
    };
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

    const result = await callLovableAI(prompt);
    if (!result) return { error: 'Failed to generate report' };

    return extractJSON(result) || { error: 'Invalid response format' };
}

// 8. Generate Grammar Question
async function generateGrammarQuestion(payload: { difficulty: 'basic' | 'intermediate' | 'advanced' }) {
    const difficultyGuidelines: Record<string, string> = {
        basic: "Simple present/past tense errors, basic subject-verb agreement, common word order mistakes",
        intermediate: "Present perfect, conditional forms, preposition errors, article usage",
        advanced: "Subjunctive mood, complex tenses, nuanced word choice, subtle agreement errors"
    };

    const prompt = `
You are an expert English proficiency test designer following CEFR and ACTFL standards.

Generate ONE multiple-choice grammar question for medical interpreters.

REQUIREMENTS:
1. **Difficulty Level**: ${payload.difficulty.toUpperCase()} - ${difficultyGuidelines[payload.difficulty]}
2. **Context**: Use medical/healthcare scenarios (doctor visits, patient conversations, medical reports)
3. **No Grammar Terminology**: Do NOT mention "subject-verb agreement", "tense", "conditional", etc. in the options
4. **Practical Focus**: Test what "sounds right" vs "sounds wrong" in professional English
5. **Realistic Errors**: Common mistakes made by fluent bilinguals

Format:
- One sentence with a grammatical error
- 4 multiple choice options (A, B, C, D)
- Each option suggests a way to fix the sentence
- Use plain language like "Change X to Y" or "The problem is with the word..."

Return ONLY valid JSON:
{
  "sentence": "<sentence with error>",
  "options": [
    { "id": "A", "text": "<simple explanation of fix without grammar terms>" },
    { "id": "B", "text": "<simple explanation of fix without grammar terms>" },
    { "id": "C", "text": "<simple explanation of fix without grammar terms>" },
    { "id": "D", "text": "<simple explanation of fix without grammar terms>" }
  ],
  "correctId": "<A, B, C, or D>",
  "explanation": "<1-2 sentences explaining why in simple terms>"
}
`;

    const result = await callLovableAI(prompt);
    if (!result) return { error: 'Failed to generate grammar question' };

    return extractJSON(result) || { error: 'Invalid response format' };
}

// === MAIN HANDLER ===

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // Authentication check
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized - Authentication required' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        );

        const token = authHeader.replace('Bearer ', '');
        const { data: claimsData, error: authError } = await supabaseClient.auth.getClaims(token);

        if (authError || !claimsData?.claims) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized - Invalid token' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const userId = claimsData.claims.sub;
        console.log(`Authenticated user: ${userId}`);

        const { action, payload } = await req.json();
        console.log(`Processing action: ${action}`);

        let result: Record<string, unknown> | { error: string };
        switch (action) {
            case 'grade-voice':
                result = await gradeVoice(payload);
                break;
            case 'grade-syntax':
                result = await gradeSyntax(payload);
                break;
            case 'grade-vocab':
                result = await gradeVocab(payload);
                break;
            case 'grade-cultural':
                result = await gradeCultural(payload);
                break;
            case 'grade-ethics':
                result = await gradeEthics(payload);
                break;
            case 'grade-typing':
                result = await gradeTyping(payload);
                break;
            case 'generate-report':
                result = await generateReport(payload);
                break;
            case 'generate-grammar':
                result = await generateGrammarQuestion(payload);
                break;
            default:
                return new Response(
                    JSON.stringify({ error: 'Invalid action' }),
                    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
        }

        return new Response(
            JSON.stringify(result),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error in gradetest function:', error);
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
