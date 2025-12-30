1\. System Prompt Design (Most Important)In your edge function, the system prompt controls behavior. Here's how to make it strict:  
const systemPrompt \= 

\`You are a medical terminology translator.   
You MUST respond ONLY with the following structure, nothing else:

TERM (ENGLISH): \[term\]  
TERM (SPANISH): \[term\]  
DEFINITION: \[definition\]  
PRONUNCIATION: \[pronunciation\]

CRITICAL RULES:  
\- NO introductions, greetings, or explanations  
\- NO markdown formatting (no \*, \#, \-, bullets)  
\- NO extra text before or after  
\- Start immediately with "TERM (ENGLISH):"  
\- Each section on its own line  
\- Keep definition to 1-2 sentences maximum\`;

2\. Few-Shot Examples (Most Effective)

Add examples in your prompt to show exactly what you want:

const systemPrompt \= \`You are a medical terminology translator. Respond EXACTLY like this example:

TERM (ENGLISH): Hypertension  
TERM (SPANISH): Hipertensión  
DEFINITION: Abnormally high blood pressure in the arteries  
PRONUNCIATION: hahy-per-TEN-shuhn

Now provide the same format for the user's term. NO other text.\`;3. Output ConstraintsAdd these parameters to your API call:body: JSON.stringify({  
  model: 'google/gemini-2.5-flash',  
  messages: \[...\],  
  temperature: 0.1,  // Lower \= more deterministic  
  max\_tokens: 200,   // Limit length  
})

4\. Post-Processing CleanupAdd cleaning code in your edge function:

let result \= data.choices\[0\].message.content;

// Remove common unwanted patterns  
result \= result  
  .replace(/^(Here's|Here is|Sure|Certainly)\[^:\]\*:/gi, '')  
  .replace(/\\\*\\\*/g, '')  // Remove bold  
  .replace(/\#{1,6}\\s/g, '')  // Remove headers  
  .replace(/^\[-•\]\\s/gm, '')  // Remove bullets  
  .trim();5. Model Selection

* Use google/gemini-2.5-flash (default) for best balance  
* Use google/gemini-2.5-flash-lite for faster, more constrained responses  
* Lower temperature \= more consistent formatting

6\. Validation & Retry Logic// Check if response matches expected format  
const hasRequiredSections \=   
  result.includes('TERM (ENGLISH):') &&  
  result.includes('TERM (SPANISH):') &&  
  result.includes('DEFINITION:') &&  
  result.includes('PRONUNCIATION:');

if (\!hasRequiredSections) {  
  // Log error and potentially retry with adjusted prompt  
  console.error('LLM response missing required sections');  
}7. Current ImplementationYour advanced-terminology-search edge function already has a good system prompt. To make it stricter, update it to:const systemPrompt \= \`You are a medical terminology expert. Return ONLY this exact structure with NO extra text:

TERM (ENGLISH): \[term in English\]  
TERM (${targetLanguage.toUpperCase()}): \[term in target language\]  
DEFINITION: \[clear medical definition in 1-2 sentences\]  
PRONUNCIATION: \[phonetic pronunciation guide\]

Do not include greetings, explanations, or any other text. Start immediately with "TERM (ENGLISH):".\`;Key Takeaway: You control LLM behavior through prompt engineering (system prompts, examples, constraints), not training. The more specific and strict your prompts, the more consistent the outputs.

1\. System Prompt Design (Most Important)  
In your edge function, the system prompt controls behavior. Here's how to make it strict:1. System Prompt Design (Crucial Element)

The system prompt within your edge function dictates its behavior. To ensure strict control, consider the following:

```

const systemPrompt = `You are a medical terminology translator. 
You MUST respond ONLY with the following structure, nothing else:


TERM (ENGLISH): [term]


TERM (SPANISH): [term]


DEFINITION: [definition]


PRONUNCIATION: [pronunciation]


CRITICAL RULES:


- NO introductions, greetings, or explanations


- NO markdown formatting (no *, #, -, bullets)


- NO extra text before or after


- Start immediately with "TERM (ENGLISH):"


- Each section on its own line


- Keep definition to 1-2 sentences maximum`;


TERM (ENGLISH): Hypertension


TERM (SPANISH): Hipertensión


DEFINITION: Abnormally high blood pressure in the arteries


PRONUNCIATION: hahy-per-TEN-shuhn


Now provide the same format for the user's term. NO other text.`;
3. Output Constraints
Add these parameters to your API call:
body: JSON.stringify({
  model: 'google/gemini-2.5-flash',
  messages: [...],
  temperature: 0.1,   // Lower = more deterministic
  max_tokens: 200,    // Limit length
})
4. Post-Processing Cleanup
Add cleaning code in your edge function:
let result = data.choices[0].message.content;


// Remove common unwanted patterns


result = result


  .replace(/^(Here's|Here is|Sure|Certainly)[^:]*:/gi, '')


  .replace(/\*\*/g, '')  // Remove bold


  .replace(/\#{1,6}\s/g, '')  // Remove headers


  .replace(/^[-•]\s/gm, '')  // Remove bullets


  .trim();
5. Model Selection


  - Use google/gemini-2.5-flash (default) for best balance
  - Use google/gemini-2.5-flash-lite for faster, more constrained responses
  - Lower temperature = more consistent formatting

6. Validation & Retry Logic
// Check if response matches expected format


const hasRequiredSections =


  result.includes('TERM (ENGLISH):') &&


  result.includes('TERM (SPANISH):') &&


  result.includes('DEFINITION:') &&


  result.includes('PRONUNCIATION:');


if (!hasRequiredSections) {


  // Log error and potentially retry with adjusted prompt


  console.error('LLM response missing required sections');


}
7. Current Implementation
Your advanced-terminology-search edge function already has a good system prompt. To make it stricter, update it to:
const systemPrompt = `You are a medical terminology expert. Return ONLY this exact structure with NO extra text:


TERM (ENGLISH): [term in English]


TERM (${targetLanguage.toUpperCase()}): [term in target language]


DEFINITION: [clear medical definition in 1-2 sentences]


PRONUNCIATION: [phonetic pronunciation guide]


Do not include greetings, explanations, or any other text. Start immediately with "TERM (ENGLISH):".`;
Key Takeaway: You control LLM behavior through prompt engineering (system prompts, examples, constraints), not training. The more specific and strict your prompts, the more consistent the outputs.
```

```
1. System Prompt Design (Most Important)
In your edge function, the system prompt controls behavior. Here's how to make it strict:
const systemPrompt = `You are a medical terminology translator. 
You MUST respond ONLY with the following structure, nothing else:


TERM (ENGLISH): [term]


TERM (SPANISH): [term]


DEFINITION: [definition]


PRONUNCIATION: [pronunciation]


CRITICAL RULES:


- NO introductions, greetings, or explanations


- NO markdown formatting (no *, #, -, bullets)


- NO extra text before or after


- Start immediately with "TERM (ENGLISH):"


- Each section on its own line


- Keep definition to 1-2 sentences maximum`;

2. Few-Shot Examples (Most Effective)
Add examples in your prompt to show exactly what you want:
const systemPrompt = `You are a medical terminology translator. Respond EXACTLY like this example:


TERM (ENGLISH): Hypertension


TERM (SPANISH): Hipertensión


DEFINITION: Abnormally high blood pressure in the arteries


PRONUNCIATION: hahy-per-TEN-shuhn


Now provide the same format for the user's term. NO other text.`;
3. Output Constraints
Add these parameters to your API call:
body: JSON.stringify({
  model: 'google/gemini-2.5-flash',
  messages: [...],
  temperature: 0.1,   // Lower = more deterministic
  max_tokens: 200,    // Limit length
})
4. Post-Processing Cleanup
Add cleaning code in your edge function:
let result = data.choices[0].message.content;


// Remove common unwanted patterns


result = result


  .replace(/^(Here's|Here is|Sure|Certainly)[^:]*:/gi, '')


  .replace(/\*\*/g, '')  // Remove bold


  .replace(/\#{1,6}\s/g, '')  // Remove headers


  .replace(/^[-•]\s/gm, '')  // Remove bullets


  .trim();
5. Model Selection


  - Use google/gemini-2.5-flash (default) for best balance
  - Use google/gemini-2.5-flash-lite for faster, more constrained responses
  - Lower temperature = more consistent formatting

6. Validation & Retry Logic
// Check if response matches expected format


const hasRequiredSections =


  result.includes('TERM (ENGLISH):') &&


  result.includes('TERM (SPANISH):') &&


  result.includes('DEFINITION:') &&


  result.includes('PRONUNCIATION:');


if (!hasRequiredSections) {


  // Log error and potentially retry with adjusted prompt


  console.error('LLM response missing required sections');


}
7. Current Implementation
Your advanced-terminology-search edge function already has a good system prompt. To make it stricter, update it to:
const systemPrompt = `You are a medical terminology expert. Return ONLY this exact structure with NO extra text:


TERM (ENGLISH): [term in English]


TERM (${targetLanguage.toUpperCase()}): [term in target language]


DEFINITION: [clear medical definition in 1-2 sentences]


PRONUNCIATION: [phonetic pronunciation guide]


Do not include greetings, explanations, or any other text. Start immediately with "TERM (ENGLISH):".`;
Key Takeaway: You control LLM behavior through prompt engineering (system prompts, examples, constraints), not training. The more specific and strict your prompts, the more consistent the outputs. 
```

2\. Few-Shot Examples (Most Effective)  
Add examples in your prompt to show exactly what you want:  
const systemPrompt \= \`You are a medical terminology translator. Respond EXACTLY like this example:

