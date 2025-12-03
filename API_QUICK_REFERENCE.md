# API Quick Reference

Quick reference guide for InterpreHub API endpoints.

## Base URL

```
https://0ec90b57d6e95fcbda19832f.supabase.co
```

## Authentication

All requests require:

```http
Authorization: Bearer <SUPABASE_ANON_KEY>
Content-Type: application/json
```

---

## Edge Functions

### Wellness Chat
**POST** `/functions/v1/wellness-chat`

```json
{
  "messages": [
    { "role": "user", "content": "Your message" }
  ]
}
```

**Response:** Streaming (text/event-stream)

---

### Study Chat
**POST** `/functions/v1/study-chat`

```json
{
  "messages": [
    { "role": "user", "content": "Your question" }
  ],
  "specialty": "cardiology"
}
```

**Specialties:** `cardiology`, `oncology`, `genetics`, `orthopedic`, `respiratory`, `general medical`

**Response:** Streaming (text/event-stream)

---

### Process InterpreCoach
**POST** `/functions/v1/process-interprecoach`

```json
{
  "text": "Medical text to analyze",
  "medications": ["med1"],
  "conversions": [{ "value": 500, "unit": "mg" }]
}
```

**Response:**
```json
{
  "medicalTerms": [...],
  "highlights": [...],
  "processed": true
}
```

---

### Generate Interpreter Feedback
**POST** `/functions/v1/generate-interpreter-feedback`

```json
{
  "sessionData": {
    "duration": 1800,
    "interactionCount": 25,
    "terminologyCount": 15,
    "clarifications": 3,
    "paceIssues": 2,
    "omissions": 1
  }
}
```

**Response:**
```json
{
  "feedback": "<html feedback>"
}
```

---

### Generate Flashcards
**POST** `/functions/v1/generate-flashcards`

```json
{
  "cardType": "term-translation",
  "specialty": "cardiology",
  "count": 10
}
```

**Card Types:** `root-words`, `term-translation`, `term-definition`, `custom`

**Response:**
```json
{
  "flashcards": [
    {
      "front": "term",
      "back": "translation",
      "pronunciation": "phonetic",
      "example": "usage"
    }
  ]
}
```

---

### Debriefing Questionnaire
**POST** `/functions/v1/debriefing-questionnaire`

```json
{
  "responses": "Your debriefing text (10-10000 chars)"
}
```

**Response:**
```json
{
  "analysis": "Compassionate analysis and recommendations"
}
```

---

## Database Services

### Call Logs

```typescript
// Create
await CallLogService.createCallLog({
  user_id: 'uuid',
  start_time: '2025-12-01T10:00:00Z',
  call_type: 'medical',
  earnings: 45.00
});

// Get all
await CallLogService.getCallLogs('user-uuid');

// Update
await CallLogService.updateCallLog('log-uuid', { earnings: 50.00 });

// Delete
await CallLogService.deleteCallLog('log-uuid');
```

---

### User Settings

```typescript
// Get
await UserSettingsService.getUserSettings('user-uuid');

// Update
await UserSettingsService.updateUserSettings('user-uuid', {
  theme: 'dark',
  notifications_enabled: true
});
```

---

### Contacts

```typescript
// Create
await ContactsService.createContact({
  name: 'John Doe',
  email: 'john@example.com',
  inquiry_type: 'partnership',
  message: 'Message text'
});

// Get all
await ContactsService.getContacts();
```

---

### Waitlist

```typescript
// Add
await WaitlistService.addToWaitlist({
  email: 'user@example.com',
  name: 'Jane Smith',
  language_pair: 'English-Spanish'
});
```

---

### Profiles

```typescript
// Get
await ProfilesService.getProfile('user-uuid');

// Update
await ProfilesService.updateProfile('user-uuid', {
  first_name: 'John',
  last_name: 'Doe'
});
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 402 | Payment Required |
| 429 | Rate Limited |
| 500 | Server Error |

---

## Rate Limits

- Edge Functions: Subject to AI gateway limits
- Database: 100 req/sec per user
- Auth: 4 failed attempts per hour per IP

---

## cURL Examples

### Wellness Chat
```bash
curl -X POST https://0ec90b57d6e95fcbda19832f.supabase.co/functions/v1/wellness-chat \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

### Generate Flashcards
```bash
curl -X POST https://0ec90b57d6e95fcbda19832f.supabase.co/functions/v1/generate-flashcards \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"cardType":"term-translation","specialty":"cardiology","count":5}'
```

---

## TypeScript Client Example

```typescript
import { supabase } from '@/integrations/supabase/client';

// Edge Function Call
const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wellness-chat`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Hello' }]
    })
  }
);

// Database Query
const { data, error } = await supabase
  .from('call_logs')
  .select('*')
  .eq('user_id', userId);
```

---

## Error Handling

```typescript
try {
  const response = await fetch(endpoint, options);

  if (!response.ok) {
    const error = await response.json();

    if (response.status === 429) {
      // Rate limited - wait and retry
    } else if (response.status === 402) {
      // Payment required
    } else {
      // Handle other errors
    }
  }
} catch (error) {
  // Network error
}
```

---

## Common Patterns

### Streaming Response Handler
```typescript
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader!.read();
  if (done) break;

  const chunk = decoder.decode(value);
  // Process chunk
}
```

### Retry with Backoff
```typescript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
```

---

## Links

- [Full Documentation](./API_DOCUMENTATION.md)
- [Setup Guide](./API_DOCUMENTATION_SETUP.md)
- [OpenAPI Spec](./openapi.yaml)
- [Postman Collection](./postman_collection.json)
