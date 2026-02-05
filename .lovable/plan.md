
# InterpreStudy Redesign & Landing Page UX Overhaul

## Executive Summary
This plan addresses multiple interconnected issues to create a unified, professional experience across InterpreStudy and the landing page. The goal is to simplify navigation, fix broken/duplicate features, integrate ElevenLabs voice synthesis, improve flashcard customization, and create a polished UX.

---

## Part 1: InterpreStudy Complete Redesign

### 1.1 Simplify Navigation Structure

**Current Problem:** 10 tabs are confusing, duplicates exist (Sim + Scripts = same thing), Modules is empty, user doesn't know where to start.

**Solution:** Consolidate from 10 tabs down to 5 clear sections:

| Current Tab | Action |
|-------------|--------|
| Modules | REMOVE - Empty, confusing |
| Training | KEEP as default landing tab |
| Sim (ConversationMode) | KEEP - Rename to "Voice Sim" |
| Cards (SmartFlashcards) | KEEP - Enhance with customization |
| Quiz (AiQuiz) | KEEP |
| Body (BodyMapper) | KEEP |
| Scripts (ScenarioGenerator) | MERGE into Voice Sim as text-only mode |
| Terms (TerminologyLookup) | KEEP |
| AI Chat | MERGE into Voice Sim as AI tutor |
| Settings | MOVE to gear icon in header |

**New Tab Structure:**
1. **Training** (default) - CoreDynamicsTraining modules
2. **Voice Sim** - Combined simulator with voice + text modes
3. **Flashcards** - Enhanced with custom card creation
4. **Quiz** - AI-powered quizzes
5. **Terminology** - Term lookup + Body Mapper combined

### 1.2 Add Dashboard with Progress Tracking

**New Dashboard Panel (always visible on InterpreStudy page):**
- XP earned
- Current streak
- Modules completed (progress bars)
- Badges earned
- Recent activity
- Personalized "Continue Learning" button

**Implementation:**
- Create new `StudyDashboard.tsx` component
- Display as a sidebar on desktop, collapsible on mobile
- Pull data from `study_progress` table in Supabase

### 1.3 Voice Simulator - ElevenLabs Integration

**Current Problem:** Simulator uses browser TTS (robotic), no actual AI voices.

**Solution:** Two-step AI generation process:

1. **Step 1 - Generate Scenario Text (Already Working)**
   - AI generates doctor/patient dialogue with difficulty levels
   - Uses `generate-scenario` or `interactive-module-ai` edge function

2. **Step 2 - Voice Synthesis with ElevenLabs (NEW)**
   - Create new edge function `elevenlabs-tts`
   - Generate audio for doctor (English voice) and patient (Spanish voice)
   - Stream audio back to client for playback

**New Edge Function: `supabase/functions/elevenlabs-tts/index.ts`**
- Accepts text + voice settings
- Calls ElevenLabs API
- Returns audio blob
- Uses voices: "George" (doctor), "Laura" (patient - can use Spanish)

**Client Implementation:**
- Replace `speakText()` browser TTS with fetch to elevenlabs-tts
- Add voice selection dropdown (optional)
- Add audio player controls

**Fallback:** Keep browser TTS as fallback if ElevenLabs fails or for unauthenticated users.

### 1.4 Flashcard Enhancements

**Current Problems:**
- Cards only show medical roots (no variety)
- Flipped cards have poor contrast (white on light background)
- No custom card creation

**Fixes:**

**A. Fix Contrast Issues:**
Update `SmartFlashcards.tsx`:
- Front card: Light background with dark text
- Back card: Dark background (slate-900) with white text - ALREADY GOOD
- Issue is the front needs better contrast and the back needs to ensure text remains visible

**B. Add Card Type Selection:**
- Vocabulary Roots (current)
- Term + Translation pairs
- Term + Definition pairs
- Custom user cards

**C. Custom Card Builder:**
- Add "Create Custom Card" button
- Form: Front text, Back text, Category, Tags
- Save to localStorage + Supabase `user_flashcards` table
- Allow import/export of card decks

### 1.5 Fix Backend API Calls

**Currently Working:**
- `terminology-lookup` - Uses Lovable AI
- `generate-quiz` - Uses Lovable AI
- `generate-scenario` - Uses Lovable AI
- `interactive-module-ai` - Uses Lovable AI

**Needs Secret:** ElevenLabs API Key for voice synthesis

**Action:** Prompt user to add `ELEVENLABS_API_KEY` secret for voice features.

---

## Part 2: Landing Page UX Overhaul

### 2.1 Fix Hero Section Layout

**Current Problems:**
- Content not centered (one side left, other right)
- 3D card stack spreads too wide horizontally
- Pushes zoom out, looks awkward

**Solution:**

**A. Center the Layout:**
Update `Hero.tsx`:
- Change grid from `lg:grid-cols-2` to centered single column OR
- Fix the CardStack to be vertically stacked instead of horizontally rotated

**B. Replace CardStack3D with Stacked Cards:**
Create new `CardStackStacked.tsx`:
- Cards stack vertically on top of each other
- Top card visible, others peek from behind
- Auto-rotate through cards
- Smaller footprint, cleaner look
- Similar to Apple's card stack UI pattern

**Current CardStack3D behavior:**
```
Card 1  →  Card 2  →  Card 3  (horizontal spread with 3D rotation)
```

**New CardStackStacked behavior:**
```
  [Card 3 - barely visible]
  [Card 2 - slightly visible]
  [Card 1 - fully visible]
```

### 2.2 Remove Repeated/Redundant Sections

**Current Page Structure Analysis:**
1. Hero
2. ValueProposition - "Where Ambition Meets Excellence"
3. ProblemSolution - "Transform Every Aspect"
4. HowItWorks - "How It Works"
5. DarkSection - "Built by Interpreters, For Interpreters"
6. InterpreCoachShowcase - Video mockup
7. SolutionsShowcase - "Embrace the Change" + Bot images + All solutions
8. StatsSection - Stats
9. Testimonials

**Issues:**
- "Embrace the Change" tagline + bot image appears in SolutionsShowcase
- Similar messaging repeated in ValueProposition, ProblemSolution, and SolutionsShowcase
- Too text-heavy, not enough visuals

**Consolidation Plan:**
1. **KEEP:** Hero, HowItWorks, SolutionsShowcase, Testimonials, StatsSection
2. **MERGE:** ValueProposition + ProblemSolution into one section
3. **REMOVE:** DarkSection (mission is already in About page)
4. **ENHANCE:** InterpreCoachShowcase with actual video/animation OR remove if no video

**New Page Structure:**
1. Hero (with stacked cards)
2. ValueProposition (merged - 3 benefit cards only)
3. HowItWorks (3 steps)
4. SolutionsShowcase (all tools with bot image)
5. StatsSection
6. Testimonials
7. Footer CTA

### 2.3 Add More Visual Content

**Current Issue:** Heavy text, few images

**Solutions:**
- Add icons/illustrations to each section
- Add subtle animations (already have some with framer-motion)
- Add mockup images for each tool
- Consider adding Lottie animations for key interactions

### 2.4 Consolidate Repeated Messaging

**Repeated Elements to Consolidate:**
- "Built by Interpreters, For Interpreters" - appears in DarkSection AND Hero AND ValueProposition
- "Embrace the Change" - appears in SolutionsShowcase header
- Bot group image - only show once

**Action:** Remove DarkSection entirely, keep mission messaging only in Hero subtitle.

---

## Part 3: Technical Implementation Details

### 3.1 Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/elevenlabs-tts/index.ts` | ElevenLabs TTS edge function |
| `src/components/interprestudy/StudyDashboard.tsx` | Progress dashboard sidebar |
| `src/components/interprestudy/CustomCardBuilder.tsx` | Custom flashcard creation form |
| `src/components/CardStackStacked.tsx` | New vertically stacked card component |
| `src/components/interprestudy/VoiceSimulator.tsx` | Combined voice simulator (merges ConversationMode + ScenarioGenerator) |

### 3.2 Files to Modify

| File | Changes |
|------|---------|
| `src/pages/InterpreStudy.tsx` | Simplify tabs, add dashboard, change default tab to Training |
| `src/components/interprestudy/modules/SmartFlashcards.tsx` | Fix contrast, add card type selector, integrate custom cards |
| `src/components/Hero.tsx` | Center layout, replace CardStack3D |
| `src/pages/Index.tsx` | Remove DarkSection, merge ValueProposition + ProblemSolution |
| `src/components/ValueProposition.tsx` | Simplify to just 3 benefit cards |
| `src/components/CardStack3D.tsx` | Replace with stacked version OR delete |
| `src/components/interprestudy/flashcard-animations.css` | Fix contrast for flipped state |

### 3.3 Files to Delete/Deprecate

| File | Reason |
|------|--------|
| `src/components/DarkSection.tsx` | Redundant, merge content elsewhere |
| `src/components/interprestudy/modules/ScenarioGenerator.tsx` | Merge into VoiceSimulator |

### 3.4 Database Changes

Create new table for custom flashcards:
```sql
CREATE TABLE user_flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  category TEXT DEFAULT 'custom',
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_flashcards ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own cards
CREATE POLICY "Users can manage own flashcards" ON user_flashcards
  FOR ALL USING (auth.uid() = user_id);
```

### 3.5 Required Secret

**ElevenLabs API Key:**
- The `ELEVENLABS_API_KEY` secret must be added for voice synthesis features
- Without it, fall back to browser TTS

---

## Part 4: Implementation Order

### Phase 1: InterpreStudy Core Fixes
1. Simplify tab structure (remove/merge tabs)
2. Fix flashcard contrast issues
3. Add study dashboard sidebar
4. Make Training the default tab

### Phase 2: Flashcard Enhancements
1. Add card type selector
2. Create CustomCardBuilder component
3. Create user_flashcards database table
4. Integrate custom cards with spaced repetition

### Phase 3: Voice Simulator
1. Merge ScenarioGenerator + ConversationMode
2. Create elevenlabs-tts edge function
3. Add ElevenLabs integration (requires API key)
4. Implement audio playback controls

### Phase 4: Landing Page Cleanup
1. Create CardStackStacked component
2. Replace CardStack3D in Hero
3. Center Hero layout
4. Remove DarkSection
5. Merge ValueProposition + ProblemSolution
6. Remove duplicate messaging

### Phase 5: Polish
1. Add visual enhancements
2. Test all flows
3. Ensure mobile responsiveness
4. Performance optimization

---

## Summary of Key Changes

| Area | Current State | After Changes |
|------|---------------|---------------|
| InterpreStudy Tabs | 10 confusing tabs | 5 clear sections |
| Default Tab | Modules (empty) | Training |
| Voice Sim | Browser TTS only | ElevenLabs AI voices |
| Flashcards | Fixed root words only | Multiple types + custom |
| Card Contrast | Poor on flip | Fixed with dark/light themes |
| Progress | Hidden/missing | Visible dashboard |
| Hero Cards | Wide 3D spread | Clean vertical stack |
| Landing Sections | 9 sections, repetitive | 6 sections, focused |
| Duplicate Content | Mission in 3+ places | Mission in Hero only |
