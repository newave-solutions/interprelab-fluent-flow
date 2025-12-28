# Edge Functions Quick Reference

## Overview

Two edge functions available for medical terminology lookup with different approaches:

### 1. `advanced-terminology-search` ⭐ NEW

- **Strict prompt engineering** with few-shot examples
- **Structured text format** with validation
- **Low temperature (0.1)** for consistency
- **Post-processing cleanup** for clean output

### 2. `terminology-lookup`

- **JSON response format** (backward compatible)
- **Enhanced with output constraints**
- **Post-processing cleanup** added

## Configuration

### Frontend Toggle

In `src/components/interprestudy/TerminologyLookup.tsx` line 23:

```typescript
const USE_ADVANCED_SEARCH = true;  // Use new function
const USE_ADVANCED_SEARCH = false; // Use standard function
```

## API Parameters

### Common Parameters

```typescript
{
  term: string,           // Medical term to look up
  targetLanguage: string, // Default: 'Spanish'
  context?: string        // Optional context
}
```

### Response Format

**Advanced Search**:

```json
{
  "success": true,
  "data": {
    "english": "Hypertension",
    "translation": "Hipertensión",
    "pronunciation": "hahy-per-TEN-shuhn",
    "definition": "Abnormally high blood pressure...",
    "targetLanguage": "Spanish",
    "rawResponse": "TERM (ENGLISH): ..."
  }
}
```

**Standard Lookup**:

```json
{
  "english": "Hypertension",
  "translation": "Hipertensión",
  "pronunciation": "hahy-per-TEN-shuhn",
  "definition": "Abnormally high blood pressure...",
  "context": "...",
  "notes": "...",
  "relatedTerms": ["term1", "term2"]
}
```

## Deployment

```powershell
# Deploy new function
supabase functions deploy advanced-terminology-search

# Deploy updated function
supabase functions deploy terminology-lookup
```

## Environment Variables Required

- `LOVABLE_API_KEY` - API key for Gemini
- `SUPABASE_URL` - Project URL
- `SUPABASE_ANON_KEY` - Anonymous key

## Key Implementation Features

### Strict Prompt Engineering

- Few-shot examples in system prompt
- Explicit formatting rules
- No markdown, greetings, or extra text

### Output Constraints

- `temperature: 0.1` (deterministic)
- `max_tokens: 200` (advanced) / `500` (standard)

### Validation

- Required sections check
- Format validation
- Error responses for validation failures

### Post-Processing

- Removes markdown formatting (**, #, -)
- Removes common AI phrases ("Here's", "Sure")
- Trims whitespace

## Testing

### Test with Supabase CLI

```powershell
# Serve function locally
supabase functions serve advanced-terminology-search

# Test request (in another terminal)
curl -X POST http://localhost:54321/functions/v1/advanced-terminology-search `
  -H "Authorization: Bearer YOUR_ANON_KEY" `
  -H "Content-Type: application/json" `
  -d '{"term": "hypertension", "targetLanguage": "Spanish"}'
```

### Test Terms

- hypertension
- diabetes
- tachycardia
- pneumonia
- myocardial infarction

## Files Modified

1. `supabase/functions/advanced-terminology-search/index.ts` - NEW
2. `supabase/functions/terminology-lookup/index.ts` - Enhanced
3. `src/components/interprestudy/TerminologyLookup.tsx` - Enhanced
