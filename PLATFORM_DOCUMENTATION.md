# InterpreLab Platform Documentation

**Version:** 1.0  
**Last Updated:** November 25, 2025  
**Status:** Comprehensive Platform Guide

---

## Table of Contents

1. [Platform Overview](#platform-overview)

2. [Product Suite](#product-suite)

3. [Technical Architecture](#technical-architecture)

4. [Database Schema](#database-schema)

5. [Authentication & Security](#authentication--security)

6. [Frontend Components](#frontend-components)

7. [Backend Services](#backend-services)

8. [API Reference](#api-reference)

9. [Deployment Guide](#deployment-guide)

10. [Development Workflow](#development-workflow)

---

## Platform Overview

### Mission Statement

InterpreLab is a cutting-edge, AI-driven training and real-time assistance platform for medical interpreters, focused on human skill optimization and bridging critical communication gaps in healthcare.

### Core Philosophy

Built by interpreters, for interpreters. Every feature addresses real pain points experienced by working medical interpreters:
- 🚫 **Pain Point #1:** Overworked & Underpaid

- 🚫 **Pain Point #2:** Exploitation by Language Service Companies

- 🚫 **Pain Point #3:** Cognitive Overload & Burnout

- 🚫 **Pain Point #4:** Inaccessible Professional Development

- 🚫 **Pain Point #5:** Lack of Real-Time Support

### Target Audience

- **Primary:** Individual medical interpreters (certified professionals and students)

- **Secondary:** Language Service Companies (LSCs)

- **Tertiary:** Healthcare institutions

---

## Product Suite

### 1. 🤖 InterpreBot - AI Training & Assessment

**Purpose:** Provides realistic, interactive linguistic assessments to evaluate and hone interpreters' core skills.

**Key Features:**

- Deep analysis of linguistic accuracy and terminology

- Grammatical correctness evaluation (tense, syntax)

- Performance dashboard with detailed metrics

- Identifies "weak areas of opportunity"

- AI Mentor for customized learning paths

- Real-time practice conversations

- Skill-specific feedback

**Technical Implementation:**

- Location: `src/pages/InterpreBot.tsx`

- AI Chat Interface with Q&A bot

- Integration with AI services for natural language processing

- Interactive skill assessment modules

**User Journey:**

1. User takes initial assessment

2. InterpreBot analyzes interpretation quality

3. Generates detailed performance report

4. Creates personalized learning path

5. Provides ongoing practice and feedback

---

### 2. 🎧 InterpreCoach - Real-Time AI Assistance

**Purpose:** Multi-modal, real-time AI assistant that integrates into existing interpreter platforms via browser extension.

**Key Features:**

#### Advanced Terminology Management

- Real-time translations with contextual information

- Relevant images for medical terms

- Medication information: generic name, brand name, aliases

- Instant terminology lookup during calls

#### Acoustic & Voice Training

- Backend speech regulator agents

- Analysis of voice softness, deepness, pitch, speed

- Real-time vocal feedback

- Professional voice coaching

#### Key Insights & Summarization

- Active listening and conversation analysis

- Summarizes critical points (medication instructions, reason for encounter)

- Displays concise bullet points

- Context-aware note-taking

#### Predictive Assistance

- Infers conversational context

- Proactively prepares relevant vocabulary

- Anticipates terminology needs

- Faster insights delivery

**Technical Implementation:**

- Location: `src/pages/InterpreCoach.tsx`

- Browser extension architecture (Chrome)

- Real-time integration with interpretation platforms

- Multi-modal AI processing

- Streaming data analysis

---

### 3. 📚 InterpreStudy - Learning Management

**Purpose:** Comprehensive study platform for medical interpreter education and training.

**Key Features:**

- Study time tracking and analytics

- Medical terminology library (500+ terms)

- Interactive flashcards

- Progress tracking and metrics

- Learning streak management

- Gamified study sessions

- Spaced repetition system

**Technical Implementation:**

- Location: `src/pages/InterpreStudy.tsx`

- Component: `src/components/interprestudy/`

- Supabase Function: `study-chat` (AI study assistant)

- Supabase Function: `generate-flashcards` (automated flashcard creation)

- Integration with `learning_stats` database table

- Activity logging to `learning_activities` table

**Study Features:**

- **Flashcards:** AI-generated medical terminology cards

- **Study Sessions:** Timed learning sessions with point rewards

- **Progress Tracking:** Visual progress bars and statistics

- **AI Tutor:** Chat-based study assistance

- **Term Library:** Searchable medical terminology database

---

### 4. 🧘 InterpreWellness - Mental Health Support

**Purpose:** Complete wellness support system addressing compassion fatigue and vicarious trauma.

**Key Features:**

#### Debriefing Questionnaire

- 8 comprehensive assessment questions

- Emotional state evaluation

- Stress level tracking (1-10 scale)

- Physical symptoms monitoring

- Professional boundaries assessment

- Support system evaluation

- Self-care practices review

#### AI Counselor Chat

- Safe space for venting and debriefing

- InterpreCoach in therapist mode

- Streaming conversational AI

- Real-time empathetic responses

- Crisis resource recommendations

#### Wellbeing Topics

- **Compassion Fatigue:** Recognition and prevention

- **Vicarious Trauma:** Understanding and coping strategies

- **Professional Boundaries:** Maintaining emotional safety

- **Community Support:** Peer connection resources

**Technical Implementation:**

- Location: `src/pages/InterpreWellness.tsx`

- Supabase Function: `wellness-chat` (AI counselor)

- Supabase Function: `debriefing-questionnaire` (structured assessment)

- Server-Sent Events (SSE) for streaming responses

- Secure, confidential data handling

**Privacy & Security:**

- All conversations encrypted

- Row-Level Security (RLS) policies

- HIPAA-compliant considerations

- User data isolation

---

### 5. 📞 InterpreTrack - Call Tracking & Analytics

**Purpose:** Comprehensive call tracking and earnings management system.

**Key Features:**

#### Real-Time Call Tracking

- Active call timer

- VRI/OPI call type selection

- Multiple rounding methods:

  - Actual time
  - 6-minute increments
  - 15-minute increments

- Earnings calculation

- Notes capture per call

#### Analytics Dashboard

- Monthly statistics (calls, minutes, earnings)

- Yearly totals and trends

- Average call duration

- Call type distribution charts

- Recent calls history table

- Performance metrics

#### Data Management

- Supabase integration for persistence

- Automatic stat aggregation

- Export capabilities

- Historical data analysis

**Technical Implementation:**

- Location: `src/pages/CallTracker.tsx`

- Dashboard: `src/pages/Dashboard.tsx`

- Database: `call_records` table

- Components: `src/components/dashboard/`

**Dashboard Components:**

- `stats-cards.tsx` - Call statistics overview

- `weekly-chart.tsx` - Visual performance data

- `recent-calls.tsx` - Call history display

- `call-type-chart.tsx` - VRI/OPI distribution

- `earnings-projection.tsx` - Future earnings forecast

---

### 6. 🤝 InterpreLink - Professional Community

**Purpose:** Dedicated social web application and professional network for interpreters.

**Key Features:**

- Community forums and discussions

- Job board and career opportunities

- Resource library:

  - Educational videos
  - Mock interpretation scenarios
  - Medical dictionaries
  - Legal references and guidelines

- Professional networking

- Peer mentorship programs

- Industry news and updates

**Technical Implementation:**

- Location: `src/pages/InterpreLink.tsx`

- Community engagement features

- Resource management system

- User profile and networking

---

### 7. 🎓 Certification Training Courses

**Purpose:** 40-60 hour Healthcare Medical Interpreter Training Courses.

**Accreditation:**

- ✅ **NBCMI** (National Board of Certification for Medical Interpreters) approved

- ✅ **CCHI** (Certification Commission for Healthcare Interpreters) approved

- Prerequisite courses for written certification exams

**Course Features:**

- Comprehensive curriculum

- Interactive learning modules

- Practice assessments

- Certification preparation

- Industry-recognized credentials

---

## Technical Architecture

### Frontend Stack

```

Technology Stack:
├── Framework: React 18.3.1 with TypeScript 5.8.3
├── Build Tool: Vite 7.2.2
├── Routing: React Router v6.30.1
├── Styling: Tailwind CSS 3.4.17
├── UI Components: shadcn/ui (Radix UI)
├── State Management: React Hooks + Context API
├── Data Fetching: TanStack Query (React Query) 5.83.0
└── Icons: Lucide React 0.462.0

```

**Key Libraries:**

- **Form Management:** React Hook Form 7.61.1 + Zod 3.25.76

- **Date Handling:** date-fns 3.6.0

- **Charts:** Recharts 2.15.4

- **Animations:** Tailwind CSS Animate

- **Notifications:** Sonner 1.7.4

- **Carousel:** Embla Carousel React 8.6.0

- **Themes:** next-themes 0.3.0

### Backend Stack

```

Backend Services:
├── Database: Supabase (PostgreSQL)
├── Authentication: Supabase Auth
├── Edge Functions: Supabase Functions (Deno runtime)
├── Storage: Supabase Storage
├── Real-time: Supabase Realtime subscriptions
└── AI Services: Custom AI integrations

```

### Project Structure

```

interprelab-fluent-flow/
├── src/
│   ├── pages/                    # Main application pages

│   │   ├── Home.tsx              # Landing page with video storytelling

│   │   ├── Dashboard.tsx         # Unified metrics dashboard

│   │   ├── InterpreBot.tsx       # AI assessment platform

│   │   ├── InterpreCoach.tsx     # Real-time assistance

│   │   ├── InterpreStudy.tsx     # Learning management

│   │   ├── InterpreWellness.tsx  # Mental health support

│   │   ├── CallTracker.tsx       # Call tracking & earnings

│   │   ├── InterpreLink.tsx      # Community & resources

│   │   └── ...                   # Additional pages

│   │
│   ├── components/               # Reusable UI components

│   │   ├── dashboard/            # Dashboard-specific components

│   │   │   ├── learning-progress.tsx
│   │   │   ├── stats-cards.tsx
│   │   │   ├── weekly-chart.tsx
│   │   │   └── ...               # 14 total dashboard components

│   │   ├── interprestudy/        # Study platform components

│   │   ├── ui/                   # shadcn/ui base components

│   │   ├── Layout.tsx            # Main layout wrapper

│   │   ├── Navigation.tsx        # Navigation bar

│   │   ├── Footer.tsx            # Footer component

│   │   └── ...                   # Feature components

│   │
│   ├── contexts/                 # React Context providers

│   │   └── AuthContext.tsx       # Authentication context

│   │
│   ├── hooks/                    # Custom React hooks

│   │   ├── useScrollAnimation.ts
│   │   └── useParallax.ts
│   │
│   ├── integrations/             # External service integrations

│   │   └── supabase/
│   │       ├── client.ts         # Supabase client configuration

│   │       └── types.ts          # TypeScript type definitions

│   │
│   ├── lib/                      # Utility functions

│   │   └── utils.ts              # Helper utilities

│   │
│   └── assets/                   # Static assets (images, videos)

│
├── supabase/
│   ├── functions/                # Edge Functions (Deno)

│   │   ├── wellness-chat/        # AI counselor

│   │   ├── study-chat/           # Study assistant

│   │   ├── generate-flashcards/  # Flashcard generator

│   │   └── debriefing-questionnaire/
│   │
│   └── migrations/               # Database migrations

│       ├── 20251119170000_add_learning_stats.sql
│       └── ...                   # Schema version history

│
├── public/                       # Public static files

│   └── videos/                   # Hero section videos

│
└── Configuration Files
    ├── package.json              # Dependencies and scripts

    ├── tsconfig.json             # TypeScript configuration

    ├── vite.config.ts            # Vite build configuration

    ├── tailwind.config.ts        # Tailwind CSS configuration

    ├── components.json           # shadcn/ui configuration

    └── Dockerfile                # Container configuration

```

---

## Database Schema

### Core Tables

#### 1. **users** (Managed by Supabase Auth)

```sql
-- Authentication and user management
id              UUID PRIMARY KEY
email           VARCHAR UNIQUE
encrypted_password VARCHAR
created_at      TIMESTAMP
updated_at      TIMESTAMP

```

#### 2. **user_preferences**

```sql
-- User settings and preferences
id              UUID PRIMARY KEY
user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE
theme           VARCHAR DEFAULT 'system'
language        VARCHAR DEFAULT 'en'
notifications   BOOLEAN DEFAULT true
created_at      TIMESTAMP
updated_at      TIMESTAMP

UNIQUE(user_id)

```

#### 3. **call_records**

```sql
-- Call tracking data for InterpreTrack
id              UUID PRIMARY KEY
user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE
call_type       VARCHAR -- 'VRI' or 'OPI'
start_time      TIMESTAMP
end_time        TIMESTAMP
duration        INTEGER -- minutes
rounding_method VARCHAR -- 'actual', '6min', '15min'
rounded_duration INTEGER
rate_per_minute DECIMAL
earnings        DECIMAL
notes           TEXT
created_at      TIMESTAMP

INDEX idx_call_records_user_id (user_id)
INDEX idx_call_records_start_time (start_time)

```

#### 4. **learning_stats**

```sql
-- Aggregate learning progress metrics
id                  UUID PRIMARY KEY
user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE
study_hours         DECIMAL DEFAULT 0
terms_learned       INTEGER DEFAULT 0
quizzes_completed   INTEGER DEFAULT 0
scenarios_practiced INTEGER DEFAULT 0
bot_conversations   INTEGER DEFAULT 0
streak              INTEGER DEFAULT 0
total_points        INTEGER DEFAULT 0
created_at          TIMESTAMP
updated_at          TIMESTAMP

UNIQUE(user_id)
INDEX idx_learning_stats_user_id (user_id)
INDEX idx_learning_stats_total_points (total_points)

```

#### 5. **learning_activities**

```sql
-- Individual learning activity log
id               UUID PRIMARY KEY
user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE
activity_type    VARCHAR -- 'study', 'quiz', 'scenario', 'bot', 'term_learned'
activity_name    VARCHAR
points_earned    INTEGER
duration_minutes INTEGER
metadata         JSONB
created_at       TIMESTAMP

INDEX idx_learning_activities_user_id (user_id)
INDEX idx_learning_activities_created_at (created_at)
INDEX idx_learning_activities_type (activity_type)

```

#### 6. **wellness_sessions**

```sql
-- Wellness check-in records
id                  UUID PRIMARY KEY
user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE
session_type        VARCHAR -- 'questionnaire', 'chat', 'resource_view'
stress_level        INTEGER -- 1-10 scale
questionnaire_data  JSONB
notes               TEXT
created_at          TIMESTAMP

INDEX idx_wellness_sessions_user_id (user_id)
INDEX idx_wellness_sessions_created_at (created_at)

```

### Database Functions

#### 1. **update_learning_stats()**

```sql
-- Automatically updates aggregate stats when activities are logged
-- Triggered on INSERT to learning_activities
-- Updates: total_points, activity-specific counters
-- SECURITY DEFINER for automated execution

```

#### 2. **calculate_learning_streak()**

```sql
-- Calculates consecutive days with learning activities
-- Can be called on-demand or via scheduler
-- Updates streak field in learning_stats

```

### Row-Level Security (RLS) Policies

All tables implement RLS to ensure users can only access their own data:

```sql
-- Example policy structure
CREATE POLICY "Users can view own data"
  ON table_name FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON table_name FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON table_name FOR UPDATE
  USING (auth.uid() = user_id);

```

---

## Authentication & Security

### Authentication Flow

```

User Authentication Journey:
1. Sign Up / Sign In (Email + Password or OAuth)

   └─> Supabase Auth handles credential validation

2. Session Token Generated

   └─> JWT token stored in browser (httpOnly cookie)

3. Protected Routes Check Auth Status

   └─> ProtectedRoute component validates session

4. API Requests Include Auth Token

   └─> Supabase client automatically attaches token

5. RLS Policies Enforce Data Isolation

   └─> Database-level security per user

```

### Security Features

#### Frontend Security

- ✅ **ProtectedRoute Component:** Prevents unauthorized access

- ✅ **Input Validation:** Zod schemas for form validation

- ✅ **XSS Prevention:** React's built-in escaping

- ✅ **CSRF Protection:** Supabase token-based auth

- ✅ **Secure Storage:** No sensitive data in localStorage

#### Backend Security

- ✅ **Row-Level Security (RLS):** All tables protected

- ✅ **HTTPS Only:** Enforced SSL/TLS connections

- ✅ **JWT Validation:** Token verification on every request

- ✅ **SQL Injection Prevention:** Parameterized queries

- ✅ **Rate Limiting:** API request throttling

- ✅ **CORS Configuration:** Restricted origins

#### Data Privacy

- ✅ **Encryption at Rest:** Database encryption

- ✅ **Encryption in Transit:** TLS 1.3

- ✅ **User Data Isolation:** RLS policies

- ✅ **Audit Logging:** Activity tracking

- ✅ **GDPR Compliance:** Data export/deletion capabilities

- ✅ **HIPAA Considerations:** Healthcare data handling

### Environment Variables

```env

# Required Environment Variables

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional Configuration

VITE_API_URL=https://api.interprelab.com
VITE_APP_ENV=production

```

**Security Notes:**

- ⚠️ Never commit `.env` files to version control

- ⚠️ Use `.env.local` for local development

- ⚠️ Use `.env.production` for production (not committed, create from `.env.production.example`)

- ⚠️ Rotate keys regularly

- ⚠️ Use Secret Manager for production

---

## Frontend Components

### Core Layout Components

#### Navigation.tsx

**Purpose:** Main navigation bar with responsive design

**Features:**

- Sticky navigation on scroll

- Mobile hamburger menu

- Authentication state detection

- Active route highlighting

- Theme toggle integration

#### Footer.tsx

**Purpose:** Site footer with links and information

**Features:**

- Product links

- Legal information (Privacy, Terms)

- Social media links

- Newsletter signup

- Contact information

#### Layout.tsx

**Purpose:** Main layout wrapper for all pages

**Features:**

- Consistent page structure

- Navigation integration

- Footer integration

- Scroll restoration

- Theme provider wrapper

### Page Components

#### Home.tsx - Landing Page

**Features:**

- 4 full-screen video sections with problem/solution storytelling

- Smooth snap-scroll transitions

- SolutionHero component showcase

- Stats section with animated counters

- Testimonials carousel

- Comprehensive FAQ section

- Call-to-action buttons

**Video Storytelling Flow:**

1. **Video 1:** "Overworked & Underpaid" - Industry challenges

2. **Video 2:** "The Unqualified Gap" - QA and training issues

3. **Video 3:** "Lives at Stake" - LEP patient health disparities

4. **Video 4:** "The Solution: InterpreLab" - Value proposition

#### Dashboard.tsx - Unified Metrics

**Features:**

- Two-column grid layout

- Learning Progress card (left)

- Recent Calls card (right)

- Real-time data from Supabase

- Loading states and error handling

- Responsive design

**Key Metrics Displayed:**

- Study hours and learning streaks

- Medical terminology progress (X/500)

- Quiz completions

- Mock scenarios practiced

- InterpreBot conversations

- Point system and achievements

- Call statistics (monthly, yearly, all-time)

- Recent call history

### Dashboard Component Library (14 Components)

1. **learning-progress.tsx**

   - Comprehensive learning metrics
   - Progress bars and counters
   - Achievement badges
   - Point system display
   - Streak tracking with 🔥 indicator

2. **stats-cards.tsx**

   - Call statistics overview cards
   - Earnings summaries
   - Activity metrics

3. **weekly-chart.tsx**

   - Visual performance data
   - Line/bar chart integration
   - Weekly trends

4. **ai-insights.tsx**

   - AI-powered recommendations
   - Personalized suggestions
   - Performance tips

5. **recent-calls.tsx**

   - Recent call history table
   - Sortable columns
   - Quick actions

6. **performance-heatmap.tsx**

   - Activity calendar visualization
   - Color-coded intensity
   - GitHub-style heatmap

7. **goals-tracker.tsx**

   - Goal setting interface
   - Progress tracking
   - Milestone celebrations

8. **premium-stats-overview.tsx**

   - Enhanced statistics display
   - Advanced analytics
   - Comparative metrics

9. **call-type-chart.tsx**

   - VRI vs OPI distribution
   - Pie/donut chart
   - Percentage breakdown

10. **earnings-projection.tsx**

    - Future earnings forecast
    - Trend analysis
    - Goal-based projections

11. **integration-status.tsx**

    - Platform connection status
    - Sync indicators
    - Health checks

12. **manual-log.tsx**

    - Manual call entry form
    - Quick logging interface
    - Validation and submission

13. **platform-comparison.tsx**

    - Multi-platform analytics
    - Comparative performance
    - Platform preferences

14. **premium-upgrade-card.tsx**

    - Subscription promotion
    - Feature comparison
    - Upgrade CTA

### Utility Components

#### ScrollProgress.tsx

- Visual scroll indicator

- Progress bar at top of page

- Smooth animation

#### LoadingSpinner.tsx

- Reusable loading state

- Consistent styling

- Size variants

#### PainPointBadge.tsx

- Highlights addressed pain points

- Contextual messaging

- Brand consistency

---

## Backend Services

### Supabase Edge Functions

All Edge Functions run on Deno runtime with TypeScript support.

#### 1. wellness-chat

**Purpose:** AI counselor for mental health support

**Endpoint:** `POST /functions/v1/wellness-chat`

**Request:**

```typescript
{
  message: string;
  conversation_history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

```

**Response:** Server-Sent Events (SSE) stream

```typescript
data: {"chunk": "Response text..."}
data: {"chunk": " continues..."}
data: [DONE]

```

**Features:**

- Streaming responses for natural conversation

- Context-aware replies based on interpreter wellness

- Empathetic AI personality

- Crisis resource recommendations

#### 2. study-chat

**Purpose:** AI study assistant for learning support

**Endpoint:** `POST /functions/v1/study-chat`

**Request:**

```typescript
{
  question: string;
  subject?: string;
  context?: string;
}

```

**Response:**

```typescript
{
  answer: string;
  related_terms?: string[];
  suggested_resources?: string[];
}

```

**Features:**

- Medical terminology explanations

- Study tips and techniques

- Quiz generation

- Resource recommendations

#### 3. generate-flashcards

**Purpose:** Automated flashcard generation

**Endpoint:** `POST /functions/v1/generate-flashcards`

**Request:**

```typescript
{
  topic: string;
  count: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

```

**Response:**

```typescript
{
  flashcards: Array<{
    front: string;
    back: string;
    category: string;
    difficulty: string;
  }>;
}

```

**Features:**

- AI-generated medical terminology cards

- Difficulty-based content

- Category organization

- Spaced repetition optimization

#### 4. debriefing-questionnaire

**Purpose:** Process wellness questionnaire responses

**Endpoint:** `POST /functions/v1/debriefing-questionnaire`

**Request:**

```typescript
{
  responses: {
    emotional_state: string;
    stress_level: number; // 1-10
    physical_symptoms: string[];
    boundaries_maintained: boolean;
    support_systems: string[];
    self_care_practiced: boolean;
    additional_notes: string;
  };
}

```

**Response:**

```typescript
{
  analysis: string;
  recommendations: string[];
  resources: Array<{
    title: string;
    url: string;
    description: string;
  }>;
  risk_level: 'low' | 'moderate' | 'high';
}

```

**Features:**

- Automated wellness assessment

- Risk level determination

- Personalized recommendations

- Resource suggestions

---

## API Reference

### Supabase Client Usage

#### Authentication

```typescript
import { supabase } from '@/integrations/supabase/client';

// Sign Up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
});

// Sign In
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password',
});

// Sign Out
await supabase.auth.signOut();

// Get Current User
const { data: { user } } = await supabase.auth.getUser();

```

#### Database Queries

```typescript
// SELECT with filtering
const { data, error } = await supabase
  .from('call_records')
  .select('*')
  .eq('user_id', userId)
  .order('start_time', { ascending: false })
  .limit(10);

// INSERT
const { data, error } = await supabase
  .from('learning_activities')
  .insert({
    user_id: userId,
    activity_type: 'study',
    activity_name: 'Medical Terminology Session',
    points_earned: 10,
    duration_minutes: 30,
  });

// UPDATE
const { data, error } = await supabase
  .from('user_preferences')
  .update({ theme: 'dark' })
  .eq('user_id', userId);

// DELETE
const { data, error } = await supabase
  .from('call_records')
  .delete()
  .eq('id', recordId);

```

#### Real-time Subscriptions

```typescript
// Subscribe to changes
const subscription = supabase
  .channel('learning_updates')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'learning_activities',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('New activity:', payload.new);
      // Update UI with new data
    }
  )
  .subscribe();

// Unsubscribe
subscription.unsubscribe();

```

#### Edge Function Calls

```typescript
// Call Edge Function
const { data, error } = await supabase.functions.invoke('wellness-chat', {
  body: {
    message: 'I feel overwhelmed after today\'s session.',
  },
});

// Streaming Response
const response = await fetch(
  `${supabaseUrl}/functions/v1/wellness-chat`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anonKey}`,
    },
    body: JSON.stringify({ message: 'Hello' }),
  }
);

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  console.log('Received:', chunk);
}

```

---

## Deployment Guide

### Prerequisites

- Node.js 18+ and npm

- Supabase account

- Domain name (optional)

- CI/CD platform account (GitHub Actions, Vercel, etc.)

### Local Development Setup

```bash

# 1. Clone repository

git clone https://github.com/newave-solutions/interprelab-fluent-flow.git
cd interprelab-fluent-flow

# 2. Install dependencies

npm install

# 3. Configure environment variables

cp .env.example .env.local

# Edit .env.local with your Supabase credentials

# 4. Start development server

npm run dev

# Server runs at http://localhost:5173

```

### Database Setup

```bash

# 1. Install Supabase CLI

npm install -g supabase

# 2. Login to Supabase

supabase login

# 3. Link to your project

supabase link --project-ref YOUR_PROJECT_REF

# 4. Apply migrations

supabase db push

# 5. Verify tables created

supabase db inspect

```

### Production Build

```bash

# Build optimized production bundle

npm run build

# Preview production build locally

npm run preview

# Bundle output in dist/ directory

# - Optimized JavaScript and CSS

# - Minified and tree-shaken

# - Source maps for debugging

```

### Deployment Options

#### Option 1: Firebase Hosting

```bash

# Install Firebase CLI

npm install -g firebase-tools

# Login to Firebase

firebase login

# Initialize project

firebase init hosting

# Deploy

firebase deploy --only hosting

```

#### Option 2: Vercel

```bash

# Install Vercel CLI

npm install -g vercel

# Deploy

vercel

# Production deployment

vercel --prod

```

#### Option 3: Netlify

```bash

# Install Netlify CLI

npm install -g netlify-cli

# Login

netlify login

# Initialize

netlify init

# Deploy

netlify deploy --prod

```

#### Option 4: Docker + Cloud Run

```bash

# Build Docker image

docker build -t interprelab-app .

# Run locally

docker run -p 8080:80 interprelab-app

# Deploy to Google Cloud Run

gcloud run deploy interprelab \
  --image gcr.io/PROJECT_ID/interprelab-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

```

### Environment Configuration

**Production Environment Variables:**

```env

# Supabase Configuration

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# Application Settings

VITE_APP_ENV=production
VITE_APP_URL=https://www.interprelab.com

# Analytics (optional)

VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X

```

### CI/CD Pipeline (GitHub Actions)

See `GITHUB_ACTIONS_SETUP.md` for detailed configuration.

**Key Workflows:**

- ✅ Automated testing on PR

- ✅ Build verification

- ✅ Linting and type checking

- ✅ Automated deployment to staging

- ✅ Production deployment on merge to main

---

## Development Workflow

### Code Style and Standards

#### TypeScript

- Use strict type checking

- Avoid `any` types

- Define interfaces for all data structures

- Use type inference when obvious

#### React

- Functional components with hooks

- Custom hooks for reusable logic

- Props interfaces for all components

- Proper key props in lists

#### CSS/Tailwind

- Utility-first approach

- Use Tailwind classes over custom CSS

- Component-specific styles in separate files when necessary

- Follow mobile-first responsive design

### Git Workflow

```bash

# Feature development

git checkout -b feature/new-dashboard-widget

# Make changes

git add .
git commit -m "feat: Add new dashboard widget"
git push origin feature/new-dashboard-widget

# Create pull request

# Bug fixes

git checkout -b fix/authentication-error

# Make changes

git commit -m "fix: Resolve authentication token expiry"
git push origin fix/authentication-error

```

**Commit Message Convention:**

- `feat:` New feature

- `fix:` Bug fix

- `docs:` Documentation changes

- `style:` Code style changes (formatting)

- `refactor:` Code refactoring

- `test:` Test additions or changes

- `chore:` Build process or auxiliary tool changes

### Testing

```bash

# Run tests (when implemented)

npm test

# Run linting

npm run lint

# Type checking

npx tsc --noEmit

# Build verification

npm run build

```

### Performance Optimization

**Current Optimizations:**

- ✅ Code splitting with React.lazy()

- ✅ Image optimization

- ✅ Lazy loading for routes

- ✅ Memoization with React.memo()

- ✅ Debounced search inputs

**Future Optimizations:**

- ⏳ Service Worker for offline support

- ⏳ Progressive Web App (PWA) capabilities

- ⏳ CDN integration for static assets

- ⏳ Bundle size reduction (current: 1.2MB)

### Accessibility (WCAG 2.1 AA)

**Implemented:**

- ✅ Semantic HTML elements

- ✅ ARIA labels on interactive elements

- ✅ Focus-visible states with visible rings

- ✅ Reduced motion support

- ✅ Keyboard navigation

- ✅ Alt text for images

- ✅ Color contrast ratios

**Testing Tools:**

- axe DevTools browser extension

- Lighthouse accessibility audit

- Screen reader testing (NVDA, JAWS)

---

## Appendix

### Glossary

- **LEP:** Limited English Proficiency

- **VRI:** Video Remote Interpreting

- **OPI:** Over-the-Phone Interpreting

- **LSC:** Language Service Company

- **RLS:** Row-Level Security

- **SSE:** Server-Sent Events

- **NBCMI:** National Board of Certification for Medical Interpreters

- **CCHI:** Certification Commission for Healthcare Interpreters

### Additional Resources

#### Documentation

- [Executive Summary](./EXECUTIVE_SUMMARY.md)

- [Implementation Guide](./IMPLEMENTATION_GUIDE.md)

- [Project Optimization Report](./PROJECT_OPTIMIZATION_REPORT.md)

- [GCP Setup Guide](./GCP_SETUP.md)

- [GitHub Actions Setup](./GITHUB_ACTIONS_SETUP.md)

#### External Resources

- [Supabase Documentation](https://supabase.com/docs)

- [React Documentation](https://react.dev)

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

- [Vite Documentation](https://vitejs.dev)

### Support and Contact

- **Email:** admin.ceo@interprelab.com

- **Website:** https://www.interprelab.com

- **Community:** InterpreLink platform

---

**Document Version:** 1.0  
**Last Updated:** November 25, 2025  
**Maintained By:** InterpreLab Development Team  
**Status:** Comprehensive and Current
