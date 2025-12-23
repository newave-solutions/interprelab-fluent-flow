// English Grammar Question Generator
// Based on CEFR and ACTFL proficiency testing standards
// Focuses on practical English mastery without technical grammar terminology

import { callGemini, extractJSON } from '../utils/gemini.ts'

/**
 * Generates a grammar question at specified difficulty level
 * Uses real-world medical contexts and avoids technical grammar terms
 */
export async function generateGrammarQuestion(difficulty: 'basic' | 'intermediate' | 'advanced') {
    const difficultyGuidelines = {
        basic: "Simple present/past tense errors, basic subject-verb agreement, common word order mistakes",
        intermediate: "Present perfect, conditional forms, preposition errors, article usage",
        advanced: "Subjunctive mood, complex tenses, nuanced word choice, subtle agreement errors"
    }

    const prompt = `
You are an expert English proficiency test designer following CEFR and ACTFL standards.

Generate ONE multiple-choice grammar question for medical interpreters.

REQUIREMENTS:
1. **Difficulty Level**: ${difficulty.toUpperCase()} - ${difficultyGuidelines[difficulty]}
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

EXAMPLE (for reference, create something different):
{
  "sentence": "The patient have been waiting since 8 AM.",
  "options": [
    { "id": "A", "text": "Change 'have' to 'has' - one patient needs 'has'" },
    { "id": "B", "text": "Change 'since' to 'for' - use 'for' with time amounts" },
    { "id": "C", "text": "Remove 'been' - it's not needed here" },
    { "id": "D", "text": "The sentence is correct as written" }
  ],
  "correctId": "A",
  "explanation": "When talking about one person or thing, we say 'has' not 'have'. Multiple patients would be 'have been waiting'."
}
`

    const result = await callGemini(prompt)
    if (!result) return null

    return extractJSON(result)
}

/**
 * Generates a typing test prompt based on medical interpreter scenarios
 */
export function generateTypingPrompt(scenario: 'email' | 'report' | 'note'): string {
    const prompts = {
        email: `You are a medical interpreter. Write a professional email (100-150 words) to a Language Service Company (LSC) coordinator.

Scenario: You need to request a schedule change for next week because you have a certification exam on Wednesday. Be professional and polite.

Begin typing when ready. Time starts now.`,

        report: `You are documenting a complex interpretation session. Write a brief incident report (100-150 words).

Scenario: During a video interpretation, the provider spoke very quickly and used complex medical terms. The patient seemed confused. Explain what happened and what you did to help.

Begin typing when ready. Time starts now.`,

        note: `You are sending a message to a colleague interpreter. Write a professional note (100-150 words).

Scenario: You encountered a rare medical term "cholangiocarcinoma" during a session. Share what you learned and ask if they have experience with oncology terminology.

Begin typing when ready. Time starts now.`
    }

    return prompts[scenario]
}

/**
 * Validates typing test difficulty parameters
 */
export function calculateTypingMetrics(text: string, duration: number, targetWPM: number = 40) {
    const words = text.trim().split(/\s+/)
    const wordCount = words.length
    const wpm = (wordCount / duration) * 60

    // Calculate difficulty score based on sentence complexity
    const avgWordLength = text.replace(/\s/g, '').length / wordCount
    const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim()).length
    const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1)

    return {
        wordCount,
        wpm: Math.round(wpm),
        avgWordLength: Math.round(avgWordLength * 10) / 10,
        avgWordsPerSentence: Math.round(avgWordsPerSentence),
        meetsTarget: wpm >= targetWPM,
        proficiencyLevel: wpm >= 60 ? 'Advanced' : wpm >= 40 ? 'Intermediate' : 'Basic'
    }
}
