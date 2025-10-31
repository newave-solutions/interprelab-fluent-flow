-- ============================================================================
-- DEPLOYMENT INSTRUCTIONS FOR SUPABASE TABLES
-- ============================================================================
--
-- This file provides instructions for deploying all database tables.
-- The actual SQL is in separate migration files due to size.
--
-- IMPORTANT: Run migrations in this exact order!
--
-- ============================================================================

-- STEP 1: Go to Supabase Dashboard
-- URL: https://supabase.com/dashboard/project/iokgkrnbawhizmuejluz/sql/new

-- STEP 2: Run each migration file in order by copying and pasting the content

-- ============================================================================
-- MIGRATION 1: Initial Schema (Core Tables)
-- ============================================================================
-- File: supabase/migrations/20241028000001_initial_schema.sql
--
-- This creates:
-- - profiles (user profiles)
-- - user_roles (role-based access)
-- - user_settings (user preferences)
-- - call_logs (interpretation sessions)
-- - assessment_results (InterpreBot assessments)
-- - glossary_terms (terminology database)
-- - study_sessions (learning progress)
-- - coaching_sessions (InterpreCoach data)
-- - user_achievements (gamification)
--
-- Copy the entire content of this file and run it in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- MIGRATION 2: InterpreStudy Schema
-- ============================================================================
-- File: supabase/migrations/20241028000002_interprestudy_schema.sql
--
-- This creates:
-- - learning_paths (structured learning)
-- - lessons (individual learning units)
-- - lesson_progress (user progress tracking)
-- - flashcards (spaced repetition)
-- - flashcard_reviews (review history)
-- - ai_content_requests (LLM generation tracking)
-- - quizzes (assessments)
-- - quiz_attempts (quiz performance)
-- - study_streaks (gamification)
--
-- Copy the entire content of this file and run it in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- MIGRATION 3: InterpreLink Schema (Social Platform)
-- ============================================================================
-- File: supabase/migrations/20241029000001_interprelink_schema.sql
--
-- This creates:
-- - posts (user content)
-- - post_likes (engagement)
-- - post_comments (discussions)
-- - connections (professional networking)
-- - reels (short-form video)
-- - discussions (forum topics)
-- - discussion_replies (forum responses)
-- - job_postings (career opportunities)
-- - user_goals (goal tracking)
--
-- Copy the entire content of this file and run it in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- MIGRATION 4: Storage Setup
-- ============================================================================
-- File: supabase/migrations/20241029000002_storage_setup.sql
--
-- This creates:
-- - user-uploads bucket (private, 50MB)
-- - study-materials bucket (public, 50MB)
-- - flashcard-media bucket (public, 10MB)
-- - call-recordings bucket (private, 100MB)
-- - RLS policies for all buckets
--
-- Copy the entire content of this file and run it in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- After running all migrations, run these queries to verify:

-- Check all tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected tables (30 total):
-- assessment_results, call_logs, coaching_sessions, connections,
-- discussion_replies, discussions, flashcard_reviews, flashcards,
-- glossary_terms, job_postings, learning_paths, lesson_progress,
-- lessons, post_comments, post_likes, posts, profiles, quiz_attempts,
-- quizzes, reels, study_sessions, study_streaks, user_achievements,
-- user_goals, user_roles, user_settings, ai_content_requests

-- Check storage buckets were created
SELECT id, name, public
FROM storage.buckets
ORDER BY name;

-- Expected buckets (4 total):
-- call-recordings (private)
-- flashcard-media (public)
-- study-materials (public)
-- user-uploads (private)

-- ============================================================================
-- ALTERNATIVE: Use Supabase CLI
-- ============================================================================
-- If you prefer using the command line:
--
-- 1. Install Supabase CLI (if not already installed):
--    npm install -g supabase
--
-- 2. Login to Supabase:
--    npx supabase login
--
-- 3. Link to your project:
--    npx supabase link --project-ref iokgkrnbawhizmuejluz
--
-- 4. Push all migrations:
--    npx supabase db push
--
-- This will automatically run all migration files in order.
-- ============================================================================

-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================
--
-- Issue: "relation already exists" error
-- Solution: Some tables may already exist. You can either:
--   1. Skip that specific CREATE TABLE statement
--   2. Drop the existing table first (WARNING: deletes data)
--   3. Use CREATE TABLE IF NOT EXISTS (modify migration)
--
-- Issue: "permission denied" error
-- Solution: Make sure you're using the correct Supabase project
--
-- Issue: Tables created but not visible
-- Solution: Refresh the Supabase dashboard page
--
-- Issue: RLS policies blocking access
-- Solution: Check that you're authenticated when testing
--
-- ============================================================================

-- ============================================================================
-- NEXT STEPS AFTER DEPLOYMENT
-- ============================================================================
--
-- 1. Verify all tables exist (run verification queries above)
-- 2. Test user signup to verify profile creation trigger
-- 3. Check storage buckets in Storage section
-- 4. Update TypeScript types: npm run supabase:types
-- 5. Test the application with real data
--
-- ============================================================================
