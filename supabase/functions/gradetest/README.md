# InterpreTest Assessment Backend

## Overview

This Edge Function provides AI-powered grading for all InterpreTest assessment modules using the Gemini API.

## Architecture

```
gradetest/
├── index.ts                  # Main entry point & routing
├── grammar-generator.ts      # Dynamic question generation
└── utils/
    └── gemini.ts            # Shared Gemini API utilities
```

## API Endpoints

### Base URL

```
https://[your-project-ref].supabase.co/functions/v1/gradetest
```

### Request Format

```json
{
  "action": "<action-name>",
  "payload": { /* action-specific data */ }
}
```

### Available Actions

#### 1. `grade-voice`

Analyzes voice interpretation quality

**Payload:**

```json
{
  "transcript": "User's spoken interpretation",
  "targetScript": "Expected script",
  "duration": 45
}
```

**Response:**

```json
{
  "clarity": 85,
  "pacing": 90,
  "completeness": 88,
  "overallScore": 88,
  "feedback": "Clear enunciation..."
}
```

#### 2. `grade-syntax`

Evaluates English grammar proficiency

**Payload:**

```json
{
  "userAnswer": "A",
  "questionData": {
    "sentence": "The patient have pain.",
    "correctId": "A"
  }
}
```

**Response:**

```json
{
  "isCorrect": true,
  "score": 100,
  "feedback": "Correct! When talking about one person..."
}
```

#### 3. `grade-vocab`

Scores medical terminology matching

**Payload:**

```json
{
  "matches": { "1": 1, "2": 2, "3": 3, "4": 4 },
  "correctPairs": [ /* array of pairs */ ]
}
```

**Response:**

```json
{
  "score": 100,
  "correct": 4,
  "total": 4,
  "feedback": "Excellent medical terminology knowledge!"
}
```

#### 4. `grade-cultural`

Assesses cultural adaptation skills

**Payload:**

```json
{
  "userInterpretation": "Doctor, me siento muy agotado...",
  "sourcePhrase": "Doctor, I feel totally wiped out..."
}
```

**Response:**

```json
{
  "score": 92,
  "culturalAccuracy": 90,
  "toneAdaptation": 94,
  "feedback": "Excellent adaptation..."
}
```

#### 5. `grade-ethics`

Evaluates ethical decision-making

**Payload:**

```json
{
  "chosenOption": {
    "id": "A",
    "score": 100,
    "feedback": "Correct approach to HIPAA compliance..."
  },
  "scenario": "Ethics scenario text..."
}
```

**Response:**

```json
{
  "score": 100,
  "feedback": "Correct approach...",
  "ethicalAlignment": "Strong"
}
```

#### 6. `grade-typing`

Analyzes typing test performance

**Payload:**

```json
{
  "text": "Email content written by user...",
  "duration": 120,
  "errorCount": 3
}
```

**Response:**

```json
{
  "wpm": 45,
  "accuracy": 94,
  "grammarScore": 88,
  "coherenceScore": 92,
  "professionalismScore": 90,
  "overallQuality": 90,
  "compositeScore": 70,
  "feedback": "Well-structured email..."
}
```

#### 7. `generate-report`

Creates comprehensive AI assessment report

**Payload:**

```json
{
  "scores": {
    "voice": 88,
    "syntax": 92,
    "vocab": 100,
    "cultural": 85,
    "ethics": 95,
    "typing": 78
  }
}
```

**Response:**

```json
{
  "summary": "Overall strong performance...",
  "topStrength": "Medical vocabulary mastery...",
  "focusArea": "Improve typing speed...",
  "nextSteps": [
    "Practice typing drills...",
    "Review cultural adaptation scenarios..."
  ],
  "compositeScore": 90
}
```

## Deployment

### Prerequisites

1. Supabase CLI installed: `npm install -g supabase`
2. API key set in environment variables

### Deploy Function

```bash
# Navigate to project root
cd /path/to/interprelab-fluent-flow

# Deploy the function
supabase functions deploy gradetest

# Set environment variables
supabase secrets set INTERPRETEST_API_KEY=your-api-key-here
supabase secrets set GEMINI_API_KEY=your-fallback-key-here
```

### Test Function

```bash
# Test locally
supabase functions serve gradetest

# Test with curl
curl -X POST http://localhost:54321/functions/v1/gradetest \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "grade-voice",
    "payload": {
      "transcript": "Test transcript",
      "targetScript": "Expected script",
      "duration": 30
    }
  }'
```

## Database Integration

The function expects these tables (created by migration `20251222000000_create_interpretest_assessment.sql`):

- `assessment_sessions` - Overall session tracking
- `assessment_scores` - Individual module scores
- `typing_test_results` - Detailed typing metrics
- `assessment_audio` - Voice recording metadata

## Error Handling

All endpoints return errors in this format:

```json
{
  "error": "Description of what went wrong"
}
```

Common errors:

- Missing API key: `"Failed to grade [module]"`
- Invalid JSON response from AI: `"Invalid response format"`
- Invalid action: `"Invalid action"`

## Grammar Question Generator

Use the `grammar-generator.ts` module to create dynamic questions:

```typescript
import { generateGrammarQuestion } from './grammar-generator.ts'

const question = await generateGrammarQuestion('intermediate')
// Returns question following CEFR standards without technical grammar terminology
```

## Best Practices

1. **Timeout Handling**: Gemini API calls may take 2-5 seconds
2. **Error Recovery**: Always check for `error` property in responses
3. **Rate Limiting**: Implement client-side debouncing for repeated submissions
4. **Caching**: Cache generated questions to reduce API calls

## Security

- API keys are stored in Supabase secrets (not in code)
- CORS headers allow frontend access
- RLS policies protect user data
- No sensitive data logged

## Monitoring

Check function logs:

```bash
supabase functions logs gradetest
```

## Future Enhancements

- [ ] Add speech-to-text integration for actual voice analysis
- [ ] Implement adaptive difficulty based on performance
- [ ] Add multi-language support (currently English/Spanish)
- [ ] Cache frequently generated questions
- [ ] Add webhook notifications for completed assessments
