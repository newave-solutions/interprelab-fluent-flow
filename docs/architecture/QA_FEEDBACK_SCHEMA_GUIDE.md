# QA Feedback System - Database Schema Guide

## Overview

Complete database schema for the InterpreCoach QA Feedback system. This enables post-session quality assurance analysis with LLM-generated feedback based on medical interpreting standards (NBCMI, CCHI, IMIA, NCIHC).

---

## Tables Created (6 Total)

### 1. `interpreter_profiles`
**Purpose:** Store interpreter information and aggregate performance metrics

**Key Fields:**
- `user_id` - Links to auth.users (one-to-one)
- `full_name`, `email` - Basic info
- `interpreter_id` - External ID (certification number)
- `certification_level` - certified, registered, in_training, none
- `certifying_organizations` - Array: ['NBCMI', 'CCHI', 'IMIA']
- `languages` - Array: ['en-es', 'en-fr']
- `specializations` - Array: ['medical', 'legal', 'mental_health']
- `total_sessions` - Count of completed sessions
- `overall_performance_score` - Average score across all sessions
- `premium_status` - Boolean for premium features access
- `premium_expires_at` - Premium subscription expiration

**Usage:**
```typescript
// Create interpreter profile
const { data, error } = await supabase
  .from('interpreter_profiles')
  .insert({
    user_id: user.id,
    full_name: 'John Doe',
    email: 'john@example.com',
    languages: ['en-es'],
    certification_level: 'certified',
    certifying_organizations: ['NBCMI', 'CCHI']
  });
```

### 2. `interpreter_sessions`
**Purpose:** Track individual interpretation sessions

**Key Fields:**
- `interpreter_id` - FK to interpreter_profiles
- `session_start`, `session_end` - Timestamps
- `duration_minutes` - Calculated duration
- `session_type` - consecutive, simultaneous, sight_translation, etc.
- `language_pair` - e.g., 'en-es'
- `setting` - hospital, clinic, mental_health, legal, etc.
- `complexity_level` - routine, moderate, complex, critical
- `transcript_url` - S3 URL to transcript
- `audio_url` - S3 URL to audio recording
- `metadata` - JSONB for additional data

**Usage:**
```typescript
// Create session
const { data, error } = await supabase
  .from('interpreter_sessions')
  .insert({
    interpreter_id: profileId,
    session_start: new Date().toISOString(),
    session_type: 'consecutive',
    language_pair: 'en-es',
    setting: 'hospital',
    complexity_level: 'moderate'
  });

// End session
await supabase
  .from('interpreter_sessions')
  .update({
    session_end: new Date().toISOString(),
    duration_minutes: 45
  })
  .eq('id', sessionId);
```

### 3. `qa_feedback`
**Purpose:** Store LLM-generated quality assurance feedback

**Key Fields:**
- `session_id` - FK to interpreter_sessions (unique - one feedback per session)
- `interpreter_id` - FK to interpreter_profiles
- `overall_score` - 0-100 score
- `feedback_data` - JSONB with structured feedback:
  ```json
  {
    "strengths": [
      {
        "title": "Excellent Accuracy",
        "description": "Maintained high accuracy throughout...",
        "standardReference": {
          "organization": "NBCMI",
          "standard_code": "NBCMI-1.1"
        }
      }
    ],
    "improvements": [
      {
        "title": "Professional Boundaries",
        "description": "Consider maintaining clearer boundaries...",
        "coachingSteps": [
          "Review NBCMI standard 4.1",
          "Practice boundary-setting scenarios"
        ],
        "standardReference": {
          "organization": "NBCMI",
          "standard_code": "NBCMI-4.1"
        }
      }
    ],
    "categories": {
      "accuracy": 95,
      "ethics": 90,
      "professionalism": 88,
      "terminology": 92,
      "cultural_competence": 87
    },
    "encouragement": "Excellent work! Your accuracy is outstanding...",
    "keyInsights": [
      "Strong medical terminology knowledge",
      "Consistent ethical practice"
    ]
  }
  ```
- `llm_model_used` - e.g., 'gpt-4', 'gemini-pro'
- `llm_prompt_version` - Track prompt versions
- `tokens_used` - For cost tracking
- `processing_time_ms` - Performance monitoring
- `reviewed_by_human` - Boolean for human QA review
- `human_reviewer_id` - FK to auth.users

**Usage:**
```typescript
// Generate feedback (typically done server-side)
const { data, error } = await supabase
  .from('qa_feedback')
  .insert({
    session_id: sessionId,
    interpreter_id: interpreterId,
    overall_score: 88.5,
    feedback_data: {
      strengths: [...],
      improvements: [...],
      categories: {...},
      encouragement: "..."
    },
    llm_model_used: 'gpt-4',
    llm_prompt_version: 'v2.1',
    tokens_used: 2500
  });

// Retrieve feedback
const { data, error } = await supabase
  .from('qa_feedback')
  .select(`
    *,
    interpreter_sessions(*),
    interpreter_profiles(*)
  `)
  .eq('session_id', sessionId)
  .single();
```

### 4. `interprelab_recommendations`
**Purpose:** Track recommended InterpreLab modules for improvement

**Key Fields:**
- `feedback_id` - FK to qa_feedback
- `interpreter_id` - FK to interpreter_profiles
- `recommended_lab` - Lab name (e.g., 'Medical Terminology Mastery')
- `area_of_opportunity` - What needs improvement
- `priority` - high, medium, low
- `rationale` - Why this lab is recommended
- `completed` - Boolean
- `completed_at` - Timestamp
- `progress_percentage` - 0-100

**Usage:**
```typescript
// Get recommendations for interpreter
const { data, error } = await supabase
  .from('interprelab_recommendations')
  .select('*')
  .eq('interpreter_id', interpreterId)
  .eq('completed', false)
  .order('priority', { ascending: false });

// Mark lab as completed
await supabase
  .from('interprelab_recommendations')
  .update({
    completed: true,
    completed_at: new Date().toISOString(),
    progress_percentage: 100
  })
  .eq('id', recommendationId);
```

### 5. `performance_trends`
**Purpose:** Track performance metrics over time for analytics

**Key Fields:**
- `interpreter_id` - FK to interpreter_profiles
- `date` - Date of aggregation
- `sessions_count` - Number of sessions that day
- `avg_overall_score` - Average score
- `avg_accuracy_score`, `avg_ethics_score`, etc. - Category averages
- `total_minutes` - Total session time

**Unique constraint:** (interpreter_id, date)

**Usage:**
```typescript
// Get performance trend for last 30 days
const { data, error } = await supabase
  .from('performance_trends')
  .select('*')
  .eq('interpreter_id', interpreterId)
  .gte('date', thirtyDaysAgo)
  .order('date', { ascending: true });
```

### 6. `standards_references`
**Purpose:** Reference table for interpreting standards

**Key Fields:**
- `organization` - NBCMI, CCHI, IMIA, NCIHC
- `standard_code` - e.g., 'NBCMI-1.1'
- `standard_title` - e.g., 'Accuracy'
- `standard_description` - Full description
- `category` - accuracy, ethics, professionalism, etc.
- `reference_url` - Link to official documentation

**Pre-populated with 14 standards**

**Usage:**
```typescript
// Get all standards
const { data, error } = await supabase
  .from('standards_references')
  .select('*')
  .order('organization', { ascending: true });

// Get standards by category
const { data, error } = await supabase
  .from('standards_references')
  .select('*')
  .eq('category', 'ethics');
```

---

## Functions Created (2 Total)

### 1. `update_interpreter_stats_after_feedback()`
**Type:** Trigger function
**Purpose:** Automatically update interpreter stats when feedback is created

**What it does:**
1. Increments `total_sessions` in interpreter_profiles
2. Recalculates `overall_performance_score` (average of all feedback)
3. Updates or inserts daily performance trend

**Triggered:** After INSERT on qa_feedback

### 2. `get_interpreter_performance_summary(target_interpreter_id uuid)`
**Type:** Callable function
**Purpose:** Get comprehensive performance summary

**Returns:**
- `total_sessions` - Count of sessions
- `total_minutes` - Total session time
- `overall_score` - Average score
- `recent_trend` - 'improving', 'declining', or 'stable'
- `top_strength` - Most recent strength
- `top_improvement_area` - Most recent improvement area
- `recommended_labs_count` - Uncompleted recommendations

**Security:** Users can only query their own stats (admins can query any)

**Usage:**
```typescript
const { data, error } = await supabase
  .rpc('get_interpreter_performance_summary', {
    target_interpreter_id: interpreterId
  });
```

---

## Security (RLS Policies)

### interpreter_profiles
- ✅ Users can view/update their own profile
- ✅ Users can insert their own profile
- ✅ Admins can view all profiles

### interpreter_sessions
- ✅ Interpreters can view/create/update their own sessions
- ✅ Admins can view all sessions

### qa_feedback
- ✅ Interpreters can view their own feedback
- ✅ System can insert feedback (for LLM generation)
- ✅ Admins can view/update all feedback

### interprelab_recommendations
- ✅ Interpreters can view/update their own recommendations
- ✅ System can insert recommendations

### performance_trends
- ✅ Interpreters can view their own trends
- ✅ System can manage all trends

### standards_references
- ✅ Anyone can view standards (public reference data)
- ✅ Admins can manage standards

---

## Indexes for Performance

All tables have optimized indexes:
- `interpreter_profiles`: user_id, email
- `interpreter_sessions`: interpreter_id + session_start, dates
- `qa_feedback`: session_id, interpreter_id + feedback_generated_at
- `interprelab_recommendations`: feedback_id, interpreter_id + priority
- `performance_trends`: interpreter_id + date
- `standards_references`: organization + standard_code

---

## Integration with Extension

### QA Feedback Flow

1. **Session Start:**
```typescript
// Create session when interpreter starts
const { data: session } = await supabase
  .from('interpreter_sessions')
  .insert({
    interpreter_id: profileId,
    session_start: new Date().toISOString(),
    session_type: 'consecutive',
    language_pair: 'en-es'
  })
  .select()
  .single();
```

2. **Session End:**
```typescript
// Update session when interpreter ends
await supabase
  .from('interpreter_sessions')
  .update({
    session_end: new Date().toISOString(),
    duration_minutes: calculateDuration(),
    transcript_url: uploadedTranscriptUrl
  })
  .eq('id', sessionId);
```

3. **Generate Feedback (Server-side):**
```typescript
// Call LLM API with transcript
const feedbackData = await generateFeedbackWithLLM(transcript);

// Store feedback
const { data: feedback } = await supabase
  .from('qa_feedback')
  .insert({
    session_id: sessionId,
    interpreter_id: interpreterId,
    overall_score: feedbackData.overall_score,
    feedback_data: feedbackData,
    llm_model_used: 'gpt-4',
    tokens_used: 2500
  })
  .select()
  .single();

// Generate recommendations
const recommendations = generateRecommendations(feedbackData);
await supabase
  .from('interprelab_recommendations')
  .insert(recommendations);
```

4. **Display Feedback (Extension):**
```typescript
// Load feedback in qa-feedback.html
const { data: feedback } = await supabase
  .from('qa_feedback')
  .select(`
    *,
    interpreter_sessions(*),
    interpreter_profiles(*)
  `)
  .eq('session_id', sessionId)
  .single();

// Load recommendations
const { data: recommendations } = await supabase
  .from('interprelab_recommendations')
  .select('*')
  .eq('feedback_id', feedback.id)
  .order('priority', { ascending: false });
```

---

## Sample Data Structure

### Example Feedback Data JSONB:
```json
{
  "strengths": [
    {
      "title": "Excellent Accuracy",
      "description": "You maintained high accuracy throughout the session, conveying all medical information precisely without omissions or additions.",
      "standardReference": {
        "organization": "NBCMI",
        "standard_code": "NBCMI-1.1",
        "standard_title": "Accuracy"
      }
    },
    {
      "title": "Strong Ethical Practice",
      "description": "You consistently maintained confidentiality and demonstrated impartiality throughout the encounter.",
      "standardReference": {
        "organization": "CCHI",
        "standard_code": "CCHI-Ethics-2",
        "standard_title": "Confidentiality"
      }
    }
  ],
  "improvements": [
    {
      "title": "Medical Terminology Precision",
      "description": "Consider reviewing cardiovascular terminology. There were a few instances where more precise medical terms could have been used.",
      "coachingSteps": [
        "Review cardiovascular system terminology in InterpreLab",
        "Practice with medical terminology flashcards",
        "Complete the 'Medical Terminology Mastery' module"
      ],
      "standardReference": {
        "organization": "NBCMI",
        "standard_code": "NBCMI-1.1",
        "standard_title": "Accuracy"
      }
    },
    {
      "title": "Professional Boundaries",
      "description": "In one instance, you provided additional explanation beyond interpretation. Remember to maintain the interpreter role.",
      "coachingSteps": [
        "Review NBCMI Standard 4.1 on Professional Boundaries",
        "Practice boundary-setting scenarios",
        "Complete the 'Ethics and Standards' module"
      ],
      "standardReference": {
        "organization": "NBCMI",
        "standard_code": "NBCMI-4.1",
        "standard_title": "Professional Boundaries"
      }
    }
  ],
  "categories": {
    "accuracy": 92,
    "ethics": 95,
    "professionalism": 88,
    "terminology": 85,
    "cultural_competence": 90
  },
  "encouragement": "Excellent work overall! Your commitment to accuracy and ethical practice is evident. With focused attention on medical terminology and professional boundaries, you're on track to achieve mastery-level performance. Keep up the great work!",
  "keyInsights": [
    "Strong foundation in ethical interpreting",
    "Excellent accuracy in general medical contexts",
    "Opportunity to deepen cardiovascular terminology knowledge",
    "Minor adjustments needed in maintaining interpreter role boundaries"
  ]
}
```

---

## Deployment

### Step 1: Deploy Migration
```bash
supabase db push

# Or manually
psql -f supabase/migrations/20241030000002_qa_feedback_schema.sql
```

### Step 2: Verify Tables
```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'interpreter_profiles',
    'interpreter_sessions',
    'qa_feedback',
    'interprelab_recommendations',
    'performance_trends',
    'standards_references'
  );
```

### Step 3: Verify RLS Policies
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename LIKE 'interpreter%'
  OR tablename IN ('qa_feedback', 'performance_trends', 'standards_references');
```

### Step 4: Test Functions
```sql
-- Test performance summary function
SELECT * FROM get_interpreter_performance_summary('your-interpreter-id');
```

---

## Next Steps

### 1. LLM Integration
Create server-side function to generate feedback:
- Use OpenAI GPT-4 or Google Gemini
- Implement specialized prompt for QA analysis
- Parse LLM response into feedback_data structure

### 2. Extension Integration
Update `qa-feedback-service.js`:
- Connect to Supabase tables
- Implement feedback generation flow
- Handle premium status checks

### 3. Premium Features
- Implement subscription management
- Add premium_status checks
- Create upgrade flow

### 4. Analytics Dashboard
- Build performance trends visualization
- Show improvement over time
- Display recommendation completion rates

---

## Cost Estimates

### Database Storage
- ~1KB per session
- ~5KB per feedback (with JSONB)
- ~500 bytes per recommendation
- **1000 sessions = ~6MB**

### LLM Costs (GPT-4)
- ~2000-3000 tokens per feedback
- ~$0.06-0.09 per feedback
- **1000 feedbacks = ~$60-90**

### Supabase Costs
- Free tier: 500MB database, 2GB bandwidth
- Pro tier ($25/mo): 8GB database, 50GB bandwidth
- **Recommended: Pro tier for production**

---

## Summary

**Migration File:** `supabase/migrations/20241030000002_qa_feedback_schema.sql`

**Tables:** 6 (interpreter_profiles, interpreter_sessions, qa_feedback, interprelab_recommendations, performance_trends, standards_references)

**Functions:** 2 (update_interpreter_stats_after_feedback, get_interpreter_performance_summary)

**RLS Policies:** 20+ (comprehensive security)

**Indexes:** 10+ (optimized performance)

**Status:** ✅ Ready to deploy

**Next:** Deploy migration and integrate with LLM API

---

**Complete database schema for QA Feedback system is ready!** 🎉
