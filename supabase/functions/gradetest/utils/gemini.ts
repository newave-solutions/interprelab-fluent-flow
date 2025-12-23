// Shared utility functions for Gemini API calls

export async function callGemini(prompt: string): Promise<string | null> {
    const apiKey = Deno.env.get('INTERPRETEST_API_KEY') || Deno.env.get('GEMINI_API_KEY')

    if (!apiKey) {
        console.error('No Gemini API key found in environment variables')
        return null
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    }
                })
            }
        )

        if (!response.ok) {
            console.error('Gemini API Error:', response.status, response.statusText)
            return null
        }

        const data = await response.json()
        return data.candidates?.[0]?.content?.parts?.[0]?.text || null
    } catch (error) {
        console.error('Gemini API Exception:', error)
        return null
    }
}

export function extractJSON(text: string): any {
    if (!text) return null

    try {
        // Try to find JSON block in markdown code fence
        const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
        if (codeBlockMatch) {
            return JSON.parse(codeBlockMatch[1])
        }

        // Try to find raw JSON object
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }

        // Try parsing the whole text
        return JSON.parse(text)
    } catch (e) {
        console.error('JSON Parse Error:', e)
        console.error('Text was:', text?.substring(0, 200))
        return null
    }
}
