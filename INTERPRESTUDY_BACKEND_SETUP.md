# InterpreStudy Backend Setup Guide

This guide covers the complete setup of the InterpreStudy backend with AI-powered content generation using Google Cloud's Gemini API.

## 🎯 **What's Included**

### Database Schema
- **Learning Paths**: Structured learning journeys with AI generation
- **Lessons**: Individual learning units with multimedia content
- **Lesson Progress**: User progress tracking with completion analytics
- **Flashcards**: Spaced repetition system with SM-2 algorithm
- **Flashcard Reviews**: Review history and scheduling
- **Quizzes**: Assessments with multiple question types
- **Quiz Attempts**: Performance tracking and feedback
- **Study Streaks**: Gamification with streak tracking
- **AI Content Requests**: LLM generation request logging

### Edge Functions
- **`generate-study-content`**: AI-powered content generation using Google Gemini
- **Content Types**: Learning paths, lessons, flashcards, quizzes, explanations

### Services & Hooks
- **Complete service layer** for all InterpreStudy features
- **React hooks** for easy frontend integration
- **Specialized hooks** for flashcard reviews and study sessions

## 📋 **Prerequisites**

1. **Supabase project** set up and configured
2. **Google Cloud Platform** account with billing enabled
3. **InterpreLab project** with basic Supabase integration

## 🚀 **Setup Steps**

### Step 1: Run Database Migrations

1. **Apply the InterpreStudy schema**:
   ```bash
   supabase db push
   ```

2. **Verify tables were created**:
   ```bash
   supabase db diff
   ```

   You should see these new tables:
   - `learning_paths`
   - `lessons`
   - `lesson_progress`
   - `flashcards`
   - `flashcard_reviews`
   - `ai_content_requests`
   - `quizzes`
   - `quiz_attempts`
   - `study_streaks`

### Step 2: Set Up Google Cloud Gemini API

Follow the detailed guide in `GOOGLE_CLOUD_LLM_SETUP.md`:

1. **Create Google Cloud project**
2. **Enable Generative Language API**
3. **Create API credentials**
4. **Set up billing**
5. **Configure environment variables**

### Step 3: Deploy Edge Functions

1. **Deploy the content generation function**:
   ```bash
   supabase functions deploy generate-study-content
   ```

2. **Set the Google Cloud API key secret**:
   ```bash
   supabase secrets set GOOGLE_CLOUD_API_KEY=your_api_key_here
   ```

3. **Test the function**:
   ```bash
   curl -X POST 'https://your-project.supabase.co/functions/v1/generate-study-content' \
     -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
     -H 'Content-Type: application/json' \
     -d '{
       "userId": "test-user-id",
       "contentType": "flashcards",
       "prompt": "Create medical terminology flashcards",
       "parameters": {
         "category": "medical",
         "difficulty": "intermediate",
         "flashcardCount": 5
       }
     }'
   ```

### Step 4: Update TypeScript Types

1. **Generate updated types**:
   ```bash
   npm run supabase:types
   ```

2. **Verify types include new tables**:
   Check that `integrations/supabase/types.ts` includes all InterpreStudy tables.

### Step 5: Test the Integration

1. **Import the services in your component**:
   ```typescript
   import { useInterpreStudy } from '../hooks/useInterpreStudy';

   const { generateContent, getLearningPaths } = useInterpreStudy();
   ```

2. **Test content generation**:
   ```typescript
   const testGeneration = async () => {
     const { data, error } = await generateContent(
       'flashcards',
       'Create 5 legal terminology flashcards for court interpretation',
       {
         category: 'legal',
         difficulty: 'intermediate',
         sourceLanguage: 'en',
         targetLanguage: 'es',
         flashcardCount: 5
       }
     );

     console.log('Generated content:', data);
   };
   ```

## 🎨 **Features Overview**

### 1. AI-Powered Learning Paths
```typescript
// Generate a complete learning path
const { data } = await generateContent(
  'learning_path',
  'Create a comprehensive medical interpretation course',
  {
    category: 'medical',
    difficulty: 'intermediate',
    languagePair: 'en-es',
    lessonCount: 12
  }
);
```

### 2. Intelligent Flashcard System
```typescript
// Spaced repetition flashcard reviews
const { currentCard, submitReview } = useFlashcardReview();

// Review with quality rating (0-5)
await submitReview(4); // Good recall
```

### 3. Adaptive Quizzes
```typescript
// Generate contextual quizzes
const { data } = await generateContent(
  'quiz',
  'Create a quiz on medical emergency terminology',
  {
    category: 'medical',
    difficulty: 'advanced',
    questionCount: 15,
    quizType: 'mixed'
  }
);
```

### 4. Progress Tracking
```typescript
// Update lesson progress
await updateLessonProgress(lessonId, pathId, {
  status: 'completed',
  progressPercentage: 100,
  timeSpentSeconds: 1800,
  score: 85
});
```

### 5. Study Streaks & Gamification
```typescript
// Get user's study streak
const { data: streak } = await getStudyStreak();
console.log(`Current streak: ${streak.current_streak} days`);
```

## 🔧 **Configuration Options**

### Content Generation Parameters

#### Learning Paths
```typescript
{
  category: 'medical' | 'legal' | 'business' | 'technical' | 'general',
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert',
  languagePair: 'en-es' | 'fr-en' | 'de-en' | etc.,
  lessonCount: number,
  estimatedDuration: number // minutes
}
```

#### Flashcards
```typescript
{
  category: string,
  difficulty: string,
  sourceLanguage: string,
  targetLanguage: string,
  flashcardCount: number,
  topic: string,
  specialization: string
}
```

#### Quizzes
```typescript
{
  category: string,
  difficulty: string,
  questionCount: number,
  quizType: 'multiple_choice' | 'fill_blank' | 'matching' | 'mixed',
  timeLimit: number, // minutes
  passingScore: number // percentage
}
```

## 📊 **Database Schema Details**

### Learning Paths
- **Hierarchical structure** with lessons and progress tracking
- **AI generation metadata** for prompt tracking
- **Public/private sharing** capabilities
- **Category and difficulty filtering**

### Spaced Repetition System
- **SM-2 algorithm implementation** for optimal review scheduling
- **Quality ratings** (0-5) for review effectiveness
- **Adaptive intervals** based on performance
- **Review history** and analytics

### Progress Analytics
- **Completion tracking** at lesson and path levels
- **Time spent** monitoring
- **Performance scoring** with detailed feedback
- **Study streak** calculation and maintenance

## 🔒 **Security & Privacy**

### Row Level Security (RLS)
- **User isolation**: Users can only access their own content
- **Public content**: Shared learning materials with proper permissions
- **AI request logging**: Secure tracking of generation requests

### API Security
- **Rate limiting** on AI generation requests
- **Input validation** and sanitization
- **Error handling** with proper logging
- **Token usage monitoring**

## 📈 **Performance Optimization**

### Caching Strategy
1. **Generated content caching** in database
2. **Flashcard review scheduling** optimization
3. **Progress calculation** caching
4. **AI response** storage for reuse

### Database Optimization
1. **Proper indexing** on frequently queried columns
2. **Efficient queries** with minimal joins
3. **Pagination** for large datasets
4. **Background processing** for heavy operations

## 🧪 **Testing**

### Unit Tests
```bash
# Test services
npm test src/integrations/supabase/interprestudy-services.test.ts

# Test hooks
npm test src/hooks/useInterpreStudy.test.ts
```

### Integration Tests
```bash
# Test edge functions
supabase functions serve
curl -X POST 'http://localhost:54321/functions/v1/generate-study-content' \
  -H 'Content-Type: application/json' \
  -d '{"userId":"test","contentType":"flashcards","prompt":"test"}'
```

## 🚀 **Production Deployment**

### Environment Variables
```env
# Production environment
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
GOOGLE_CLOUD_API_KEY=your_production_api_key
```

### Monitoring
1. **API usage monitoring** in Google Cloud Console
2. **Database performance** in Supabase dashboard
3. **Error tracking** with proper logging
4. **User analytics** and usage patterns

### Scaling Considerations
1. **API rate limits** and quota management
2. **Database connection pooling**
3. **Content generation queuing** for high load
4. **CDN integration** for multimedia content

## 🎯 **Next Steps**

1. **Integrate with InterpreStudy frontend**
2. **Add multimedia content support** (audio, images)
3. **Implement advanced analytics** and reporting
4. **Add collaborative features** (shared learning paths)
5. **Mobile app integration** with offline support

## 📚 **Additional Resources**

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Supabase Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [SM-2 Spaced Repetition Algorithm](https://en.wikipedia.org/wiki/SuperMemo#SM-2_algorithm)
- [React Query for Data Fetching](https://tanstack.com/query/latest)

Your InterpreStudy backend is now ready with AI-powered content generation and comprehensive learning management capabilities! 🎉
