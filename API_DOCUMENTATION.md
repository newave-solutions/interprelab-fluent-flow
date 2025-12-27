# InterpreHub API Documentation

**Version:** 1.0.0
**Base URL:** `https://0ec90b57d6e95fcbda19832f.supabase.co`
**Last Updated:** December 1, 2025

## Table of Contents

1. [Authentication](#authentication)
2. [Edge Functions API](#edge-functions-api)
3. [Database Services](#database-services)
4. [Error Handling](#error-handling)
5. [Rate Limits](#rate-limits)
6. [Code Examples](#code-examples)

---

## Authentication

All API requests require authentication using Supabase Auth tokens.

### Headers Required

```http
Authorization: Bearer <SUPABASE_ANON_KEY>
Content-Type: application/json
```

### Sign Up

**Endpoint:** `/auth/v1/signup`
**Method:** `POST`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "secure_password123",
  "options": {
    "data": {
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

**Response (200 OK):**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2025-12-01T00:00:00.000Z"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 3600
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid email or password format
- `422 Unprocessable Entity` - Email already registered

---

### Sign In

**Endpoint:** `/auth/v1/token?grant_type=password`
**Method:** `POST`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "secure_password123"
}
```

**Response (200 OK):**

```json
{
  "access_token": "jwt_token",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid credentials
- `401 Unauthorized` - Invalid email or password

---

### Sign Out

**Endpoint:** `/auth/v1/logout`
**Method:** `POST`

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Response (204 No Content):**

```text
(Empty body)
```

---

## Edge Functions API

All Edge Function endpoints:

- Base URL: `https://0ec90b57d6e95fcbda19832f.supabase.co/functions/v1`
- Require Authorization header
- Return CORS headers for cross-origin requests
- Support OPTIONS preflight requests

---

### 1. Wellness Chat

AI-powered counseling support for medical interpreters dealing with emotional stress and burnout.

**Endpoint:** `/functions/v1/wellness-chat`
**Method:** `POST`

**Request Body:**

```json
{
  "messages": [
    {
      "role": "user",
      "content": "I've been feeling emotionally drained after interpreting difficult medical cases."
    }
  ]
}
```

**Request Schema:**

| Field | Type | Required | Constraints | Description |
| ------- | ------ | ---------- | ------------- | ------------- |
| messages | Array | Yes | 1-50 items | Conversation history |
| messages[].role | String | Yes | "user", "assistant", "system" | Message sender role |
| messages[].content | String | Yes | 1-5000 chars | Message content |

**Response (200 OK):**

```http
Content-Type: text/event-stream

data: {"choices":[{"delta":{"content":"I hear you..."}}]}
```

**Streaming Response:**
The response uses Server-Sent Events (SSE) format. Each chunk contains partial AI response data.

**Error Responses:**

**400 Bad Request:**

```json
{
  "error": "Invalid input",
  "details": [
    {
      "path": ["messages", 0, "content"],
      "message": "String must contain at least 1 character(s)"
    }
  ]
}
```

**429 Too Many Requests:**

```json
{
  "error": "Rate limits exceeded, please try again later."
}
```

**402 Payment Required:**

```json
{
  "error": "Payment required, please add funds to your Lovable AI workspace."
}
```

**500 Internal Server Error:**

```json
{
  "error": "AI gateway error"
}
```

---

### 2. Study Chat

Educational AI assistant for medical terminology and interpretation techniques.

**Endpoint:** `/functions/v1/study-chat`
**Method:** `POST`

**Request Body:**

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Can you explain what 'myocardial infarction' means in simple terms?"
    }
  ],
  "specialty": "cardiology"
}
```

**Request Schema:**

| Field | Type | Required | Constraints | Description |
| ------- | ------ | ---------- | ------------- | ------------- |
| messages | Array | Yes | 1-50 items | Conversation history |
| messages[].role | String | Yes | "user", "assistant", "system" | Message sender role |
| messages[].content | String | Yes | 1-5000 chars | Message content |
| specialty | String | No | Max 100 chars | Medical specialty focus |

**Response (200 OK):**

```http
Content-Type: text/event-stream

data: {"choices":[{"delta":{"content":"Myocardial infarction..."}}]}
```

**Specialty Options:**

- `cardiology` - Heart and cardiovascular system
- `oncology` - Cancer treatment
- `genetics` - Genetic conditions
- `orthopedic` - Bones and joints
- `respiratory` - Lungs and breathing
- `general medical` - General medical terminology (default)

**Error Responses:**

- `400 Bad Request` - Invalid input format
- `429 Too Many Requests` - Service temporarily unavailable
- `500 Internal Server Error` - AI gateway error

---

### 3. Process InterpreCoach

Analyzes de-identified medical text and provides real-time assistance for interpreters.

**Endpoint:** `/functions/v1/process-interprecoach`
**Method:** `POST`

**Request Body:**

```json
{
  "text": "The patient presents with acute abdominal pain. Blood pressure is 140/90. Administer 500mg of medication.",
  "medications": ["medication"],
  "conversions": [
    {
      "value": 500,
      "unit": "mg"
    }
  ]
}
```

**Request Schema:**

| Field | Type | Required | Description |
| ------- | ------ | ---------- | ------------- |
| text | String | Yes | De-identified medical text to analyze |
| medications | Array\<String\> | No | List of medications mentioned |
| conversions | Array\<Object\> | No | Unit conversions needed |

**Response (200 OK):**

```json
{
  "medicalTerms": [
    {
      "term": "acute",
      "definition": "Sudden onset, severe",
      "translation": "Agudo",
      "category": "general"
    },
    {
      "term": "abdominal",
      "definition": "Relating to the abdomen/belly area",
      "translation": "Abdominal",
      "category": "anatomy"
    }
  ],
  "highlights": [
    {
      "icon": "💊",
      "text": "1 medication(s) mentioned"
    },
    {
      "icon": "📊",
      "text": "1 unit conversion(s) detected"
    },
    {
      "icon": "❤️",
      "text": "Blood pressure measurement detected"
    }
  ],
  "processed": true
}
```

**Built-in Medical Terms Database:**
The endpoint includes terminology for:

- Cardiovascular conditions
- Respiratory conditions
- Endocrine disorders
- Oncology terms
- Orthopedic terminology
- General medical terms
- Emergency medicine

**Error Responses:**

**400 Bad Request:**

```json
{
  "error": "No text provided"
}
```

**500 Internal Server Error:**

```json
{
  "error": "Processing error"
}
```

---

### 4. Generate Interpreter Feedback

Generates professional coaching feedback based on interpretation session data.

**Endpoint:** `/functions/v1/generate-interpreter-feedback`
**Method:** `POST`

**Request Body:**

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

**Request Schema:**

| Field | Type | Description |
| ------- | ------ | ------------- |
| sessionData.duration | Number | Session duration in seconds |
| sessionData.interactionCount | Number | Number of interactions |
| sessionData.terminologyCount | Number | Medical terms used |
| sessionData.clarifications | Number | Clarification requests made |
| sessionData.paceIssues | Number | Pacing problems detected |
| sessionData.omissions | Number | Potential omissions |

**Response (200 OK):**

```json
{
  "feedback": "<div class=\"feedback-section\"><h3>💪 Strengths</h3><ul><li>Demonstrated professionalism by requesting clarifications when needed</li><li>Good exposure to medical terminology during the session</li></ul></div><div class=\"feedback-section\"><h3>🎯 Areas for Improvement</h3><div class=\"improvement-item\"><h4>Pacing</h4><p><strong>Standard:</strong> NCIHC Standard 2 - Appropriate pace, tone, and volume</p><div class=\"coaching-plan\"><strong>Coaching Plan:</strong><ol><li>Practice pausing between phrases</li><li>Use breathing exercises to control pace</li><li>Record and review your interpretations for pace consistency</li></ol></div></div></div><div class=\"feedback-section encouragement\"><h3>🌟 Encouragement</h3><p>You completed a 30-minute session with 25 interactions...</p></div>"
}
```

**Response Format:**
The feedback is returned as HTML with structured sections:

- **Strengths** - Positive observations
- **Areas for Improvement** - Issues with coaching plans
- **Encouragement** - Motivational message

**Standards Referenced:**

- NCIHC (National Council on Interpreting in Health Care)
- CHIA (California Healthcare Interpreting Association)
- IMIA (International Medical Interpreters Association)
- NBCMI (National Board of Certification for Medical Interpreters)

**Error Responses:**

- `500 Internal Server Error` - Processing error

---

### 5. Generate Flashcards

AI-generated flashcards for medical interpreter training.

**Endpoint:** `/functions/v1/generate-flashcards`
**Method:** `POST`

**Request Body:**

```json
{
  "cardType": "term-translation",
  "specialty": "cardiology",
  "count": 10
}
```

**Request Schema:**

| Field | Type | Required | Constraints | Description |
| ------- | ------ | ---------- | ------------- | ------------- |
| cardType | String | Yes | Enum | Type of flashcard to generate |
| specialty | String | No | Max 50 chars | Medical specialty |
| count | Number | No | 1-50 | Number of cards (default: 10) |

**Card Types:**

- `root-words` - Medical root words with meanings
- `term-translation` - Medical terms with Spanish translations
- `term-definition` - Medical terms with definitions
- `custom` - Mixed content cards

**Response (200 OK):**

```json
{
  "flashcards": [
    {
      "front": "Myocardial Infarction",
      "back": "Infarto de miocardio",
      "pronunciation": "in-FAR-toh deh mee-oh-CAR-dee-oh",
      "example": "The patient suffered a myocardial infarction and requires immediate intervention."
    },
    {
      "front": "Hypertension",
      "back": "Hipertensión",
      "pronunciation": "ee-per-ten-see-ON",
      "example": "The patient has a history of hypertension controlled with medication."
    }
  ]
}
```

**Flashcard Structure:**

| Field | Type | Description |
| ------- | ------ | ------------- |
| front | String | Term or question |
| back | String | Translation, definition, or answer |
| pronunciation | String | Phonetic pronunciation (if applicable) |
| example | String | Usage example (optional) |

**Error Responses:**

**400 Bad Request:**

```json
{
  "error": "Invalid input",
  "details": [
    {
      "path": ["cardType"],
      "message": "Invalid enum value. Expected 'root-words' | 'term-translation' | 'term-definition' | 'custom'"
    }
  ]
}
```

**500 Internal Server Error:**

```json
{
  "error": "AI gateway error"
}
```

---

### 6. Debriefing Questionnaire

Analyzes interpreter debriefing responses and provides compassionate insights.

**Endpoint:** `/functions/v1/debriefing-questionnaire`
**Method:** `POST`

**Request Body:**

```json
{
  "responses": "Today's session was emotionally challenging. I interpreted for a terminal cancer diagnosis. I felt the patient's pain deeply and found it difficult to maintain professional distance. I'm concerned about carrying this emotional weight."
}
```

**Request Schema:**

| Field | Type | Required | Constraints | Description |
| ------- | ------ | ---------- | ------------- | ------------- |
| responses | String | Yes | 10-10000 chars | Debriefing questionnaire responses |

**Response (200 OK):**

```json
{
  "analysis": "Thank you for sharing your experience. What you're describing is a natural response to the emotionally intense nature of medical interpreting...\n\n**Validation:**\nYour feelings are completely valid. Interpreting terminal diagnoses is one of the most challenging aspects of medical interpreting...\n\n**Coping Strategies:**\n1. Practice grounding techniques immediately after difficult sessions\n2. Establish clear emotional boundaries through self-talk\n3. Use the 'professional distance' visualization technique\n\n**Self-Care Recommendations:**\n- Schedule regular check-ins with yourself\n- Engage in activities that bring you joy\n- Connect with other interpreters who understand\n\n**When to Seek Support:**\nIf you notice persistent symptoms of vicarious trauma, consider speaking with a mental health professional who understands interpreter experiences.\n\n**Encouragement:**\nYour awareness of these emotions shows professional maturity..."
}
```

**Analysis Components:**

1. **Validation** - Acknowledges feelings
2. **Pattern Identification** - Identifies vicarious trauma, compassion fatigue, or burnout
3. **Coping Strategies** - Practical techniques
4. **Self-Care Recommendations** - Wellness suggestions
5. **Professional Support Guidance** - When to seek help
6. **Encouragement** - Positive reinforcement

**Error Responses:**

**400 Bad Request:**

```json
{
  "error": "Invalid input",
  "details": [
    {
      "path": ["responses"],
      "message": "String must contain at least 10 character(s)"
    }
  ]
}
```

**429 Too Many Requests:**

```json
{
  "error": "Service temporarily unavailable"
}
```

**500 Internal Server Error:**

```json
{
  "error": "AI gateway error"
}
```

---

## Database Services

Client-side services for database operations using Supabase client library.

### Call Logs Service

Manage interpreter call records.

#### Create Call Log

**Method:** `CallLogService.createCallLog(callLog)`

**Parameters:**

```typescript
{
  user_id: string;              // Required: User UUID
  start_time: string;           // Required: ISO 8601 timestamp
  end_time?: string;            // Optional: ISO 8601 timestamp
  duration_seconds?: number;    // Optional: Call duration
  call_type?: string;           // Optional: e.g., "medical", "legal"
  platform_name?: string;       // Optional: e.g., "Zoom", "Phone"
  earnings?: number;            // Optional: Amount earned
  currency?: string;            // Optional: Default "USD"
  notes?: string;               // Optional: Additional notes
  is_imported?: boolean;        // Optional: Default false
  import_source?: string;       // Optional: Source of import
}
```

**Response:**

```typescript
{
  data: {
    id: string;
    user_id: string;
    start_time: string;
    created_at: string;
    // ... all fields
  },
  error: null
}
```

**Example:**

```typescript
import { CallLogService } from '@/integrations/supabase/services';

const result = await CallLogService.createCallLog({
  user_id: 'user-uuid',
  start_time: '2025-12-01T10:00:00Z',
  end_time: '2025-12-01T10:30:00Z',
  duration_seconds: 1800,
  call_type: 'medical',
  platform_name: 'Zoom',
  earnings: 45.00,
  currency: 'USD',
  notes: 'Cardiology consultation'
});
```

---

#### Update Call Log

**Method:** `CallLogService.updateCallLog(id, updates)`

**Parameters:**

```typescript
id: string;                  // Call log UUID
updates: Partial<CallLog>;   // Fields to update
```

**Example:**

```typescript
await CallLogService.updateCallLog('call-log-uuid', {
  end_time: '2025-12-01T10:35:00Z',
  duration_seconds: 2100,
  earnings: 52.50
});
```

---

#### Get Call Logs

**Method:** `CallLogService.getCallLogs(userId)`

**Parameters:**

```typescript
userId: string;  // User UUID
```

**Response:**

```typescript
{
  data: Array<CallLog>,
  error: null
}
```

**Example:**

```typescript
const { data: logs, error } = await CallLogService.getCallLogs('user-uuid');
```

---

#### Delete Call Log

**Method:** `CallLogService.deleteCallLog(id)`

**Parameters:**

```typescript
id: string;  // Call log UUID
```

**Example:**

```typescript
await CallLogService.deleteCallLog('call-log-uuid');
```

---

### User Settings Service

Manage user preferences and settings.

#### Get User Settings

**Method:** `UserSettingsService.getUserSettings(userId)`

**Parameters:**

```typescript
userId: string;  // User UUID
```

**Response:**

```typescript
{
  data: {
    user_id: string;
    theme?: string;
    language?: string;
    notifications_enabled?: boolean;
    // ... settings fields
  },
  error: null
}
```

---

#### Update User Settings

**Method:** `UserSettingsService.updateUserSettings(userId, settings)`

**Parameters:**

```typescript
userId: string;
settings: Partial<UserSettings>;
```

**Example:**

```typescript
await UserSettingsService.updateUserSettings('user-uuid', {
  theme: 'dark',
  notifications_enabled: true,
  language: 'es'
});
```

---

### Contacts Service

Manage contact form submissions.

#### Create Contact

**Method:** `ContactsService.createContact(contact)`

**Parameters:**

```typescript
{
  name: string;              // Required
  email: string;             // Required
  inquiry_type: string;      // Required
  message: string;           // Required
  organization?: string;     // Optional
  phone?: string;            // Optional
  user_id?: string;          // Optional
}
```

**Example:**

```typescript
await ContactsService.createContact({
  name: 'John Doe',
  email: 'john@example.com',
  inquiry_type: 'partnership',
  message: 'Interested in collaboration opportunities',
  organization: 'Healthcare Systems Inc.'
});
```

---

#### Get Contacts

**Method:** `ContactsService.getContacts(userId?)`

**Parameters:**

```typescript
userId?: string;  // Optional: Filter by user
```

---

### Waitlist Service

Manage waitlist signups.

#### Add to Waitlist

**Method:** `WaitlistService.addToWaitlist(entry)`

**Parameters:**

```typescript
{
  email: string;             // Required
  name?: string;             // Optional
  language_pair?: string;    // Optional
  specialty?: string;        // Optional
}
```

**Example:**

```typescript
await WaitlistService.addToWaitlist({
  email: 'user@example.com',
  name: 'Jane Smith',
  language_pair: 'English-Spanish',
  specialty: 'Medical'
});
```

---

### Profiles Service

Manage user profile information.

#### Get Profile

**Method:** `ProfilesService.getProfile(userId)`

---

#### Update Profile

**Method:** `ProfilesService.updateProfile(userId, updates)`

**Example:**

```typescript
await ProfilesService.updateProfile('user-uuid', {
  first_name: 'John',
  last_name: 'Doe',
  bio: 'Certified medical interpreter',
  certifications: ['NBCMI', 'CHIA']
});
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message",
  "details": [
    {
      "path": ["field", "name"],
      "message": "Validation error message"
    }
  ]
}
```

### Common HTTP Status Codes

| Code | Meaning | Description |
| ------ | --------- | ------------- |
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no content to return |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 402 | Payment Required | Payment or credits needed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Error Handling Best Practices

1. **Always check for errors:**

```typescript
const { data, error } = await CallLogService.getCallLogs(userId);
if (error) {
  console.error('Error:', error);
  // Handle error
}
```

1. **Handle authentication errors:**

```typescript
try {
  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.status === 401) {
    // Redirect to login
  }
} catch (error) {
  // Handle network errors
}
```

1. **Implement retry logic for rate limits:**

```typescript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);
    if (response.status !== 429) return response;
    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
  }
  throw new Error('Max retries exceeded');
}
```

---

## Rate Limits

### Current Limits

- **Edge Functions:** Subject to Lovable AI gateway limits
- **Database Operations:** 100 requests per second per user
- **Authentication:** 4 requests per hour per IP for failed attempts

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1638360000
```

### Handling Rate Limits

When you receive a `429 Too Many Requests` response:

1. Check the `Retry-After` header
2. Wait the specified duration
3. Retry the request
4. Implement exponential backoff

---

## Code Examples

### Complete Edge Function Call Example

```typescript
async function callWellnessChat(messages: Array<{role: string, content: string}>) {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wellness-chat`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  // Handle streaming response
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        const content = data.choices[0]?.delta?.content;
        if (content) {
          console.log(content); // Process streaming content
        }
      }
    }
  }
}
```

### Database Service Example with Error Handling

```typescript
import { CallLogService } from '@/integrations/supabase/services';
import { useAuth } from '@/contexts/AuthContext';

function useCallLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchLogs() {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await CallLogService.getCallLogs(user.id);

      if (error) throw error;

      setLogs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return { logs, loading, error, fetchLogs };
}
```

### Authentication Flow Example

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  async function handleSubmit(email: string, password: string) {
    setError('');

    const { error } = await signIn(email, password);

    if (error) {
      if (error.message.includes('Invalid')) {
        setError('Invalid email or password');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please verify your email address');
      } else {
        setError('An error occurred. Please try again.');
      }
      return;
    }

    navigate('/dashboard');
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleSubmit(
        formData.get('email') as string,
        formData.get('password') as string
      );
    }}>
      {error && <div className="error">{error}</div>}
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

### Streaming Response Handler

```typescript
async function handleStreamingResponse(
  endpoint: string,
  body: object,
  onChunk: (content: string) => void
) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          const content = data.choices?.[0]?.delta?.content || '';
          if (content) onChunk(content);
        } catch (e) {
          console.error('Failed to parse SSE data:', e);
        }
      }
    }
  }
}

// Usage
await handleStreamingResponse(
  '/functions/v1/study-chat',
  { messages: [{ role: 'user', content: 'Hello' }] },
  (content) => console.log(content)
);
```

---

## Tools for Automatic API Documentation

### Recommended Tools

#### 1. **Swagger/OpenAPI**

Generate interactive API documentation from OpenAPI specifications.

**Installation:**

```bash
npm install swagger-ui-react swagger-jsdoc
```

**Setup:**

```typescript
// swagger.config.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'InterpreHub API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://0ec90b57d6e95fcbda19832f.supabase.co',
      },
    ],
  },
  apis: ['./supabase/functions/*/index.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
```

---

#### 2. **Postman**

Create collections for testing and documentation.

**Benefits:**

- Interactive testing
- Auto-generated documentation
- Team collaboration
- Mock servers

**Export Collection:**
Download the Postman collection template for this API.

---

#### 3. **Redoc**

Beautiful API documentation from OpenAPI specs.

**Installation:**

```bash
npm install redoc
```

**Usage:**

```typescript
import { RedocStandalone } from 'redoc';

function ApiDocs() {
  return <RedocStandalone specUrl="/api-spec.json" />;
}
```

---

#### 4. **TypeDoc**

Generate documentation from TypeScript code.

**Installation:**

```bash
npm install --save-dev typedoc
```

**Configuration:**

```json
{
  "typedoc": {
    "entryPoints": ["./src"],
    "out": "docs",
    "plugin": ["typedoc-plugin-markdown"]
  }
}
```

---

#### 5. **Supabase CLI**

Generate types and documentation from database schema.

**Generate Types:**

```bash
npx supabase gen types typescript --project-id 0ec90b57d6e95fcbda19832f > src/types/database.ts
```

---

### Documentation Template Expansion

As your API grows, maintain this structure:

```text
API_DOCUMENTATION.md
├── Authentication
├── Edge Functions
│   ├── Wellness Chat
│   ├── Study Chat
│   └── [New Endpoint]
├── Database Services
│   ├── Call Logs
│   └── [New Service]
├── Error Handling
├── Rate Limits
└── Code Examples
```

**For each new endpoint, document:**

1. Purpose and use case
2. Request/response formats
3. Authentication requirements
4. Error responses
5. Code examples
6. Rate limits

---

## Changelog

### Version 1.0.0 (2025-12-01)

- Initial API documentation
- 6 Edge Functions documented
- 5 Database services documented
- Authentication flows documented
- Error handling guidelines
- Code examples provided

---

## Support

For API support:

- Email: <support@interprehub.com>
- Documentation: <https://interprehub.com/docs>
- GitHub Issues: <https://github.com/interprehub/api/issues>

---

## License

This API is proprietary to InterpreHub. All rights reserved.
