# Deploy Tables to Supabase Dashboard

Your tables aren't showing up because the migrations haven't been applied to your remote Supabase project yet.

## Quick Deploy Method (Recommended)

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard/project/iokgkrnbawhizmuejluz
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Run Migrations in Order

Copy and paste each migration file content into the SQL editor and run them **in this exact order**:

#### Migration 1: Initial Schema
File: `supabase/migrations/20241028000001_initial_schema.sql`
- Creates core tables: profiles, user_roles, user_settings, call_logs, assessment_results, glossary_terms, study_sessions, coaching_sessions, user_achievements
- Sets up RLS policies and triggers

#### Migration 2: InterpreStudy Schema
File: `supabase/migrations/20241028000002_interprestudy_schema.sql`
- Creates learning tables: learning_paths, lessons, lesson_progress, flashcards, flashcard_reviews, quizzes, quiz_attempts, study_streaks
- Adds AI content tracking

#### Migration 3: InterpreLink Schema
File: `supabase/migrations/20241029000001_interprelink_schema.sql`
- Creates social features: posts, post_likes, post_comments, connections, reels, discussions, discussion_replies, job_postings, user_goals

#### Migration 4: Storage Setup
File: `supabase/migrations/20241029000002_storage_setup.sql`
- Creates storage buckets and policies

### Step 3: Verify Tables Created
After running all migrations, go to "Table Editor" in the left sidebar. You should see all these tables:

**Core Tables:**
- profiles
- user_roles
- user_settings
- call_logs
- assessment_results
- glossary_terms
- study_sessions
- coaching_sessions
- user_achievements

**InterpreStudy Tables:**
- learning_paths
- lessons
- lesson_progress
- flashcards
- flashcard_reviews
- ai_content_requests
- quizzes
- quiz_attempts
- study_streaks

**InterpreLink Tables:**
- posts
- post_likes
- post_comments
- connections
- reels
- discussions
- discussion_replies
- job_postings
- user_goals

**Storage Buckets:**
- user-uploads
- study-materials
- flashcard-media
- call-recordings

## Alternative: Using Supabase CLI

If you prefer using the CLI:

```powershell
# Link to your project (you'll need your database password)
npx supabase link --project-ref iokgkrnbawhizmuejluz

# Push all migrations
npx supabase db push
```

## Troubleshooting

### "Function already exists" error
If you see errors about existing functions, it means some migrations were partially applied. You can either:
1. Drop the existing objects first
2. Modify the migration to use `CREATE OR REPLACE` instead of `CREATE`

### "Permission denied" error
Make sure you're logged in with the correct Supabase account that owns the project.

### Tables still not showing
1. Refresh the Supabase dashboard
2. Check the "Logs" section for any errors
3. Verify you're looking at the correct project (iokgkrnbawhizmuejluz)

## Next Steps After Deployment

1. **Test the connection** - Try signing up a new user to verify the profile creation trigger works
2. **Verify RLS policies** - Test that users can only access their own data
3. **Check storage buckets** - Go to Storage section and verify the 4 buckets were created
4. **Generate types** - Run `npm run supabase:types` to update TypeScript types

## Need Help?

If you encounter issues:
1. Check the Supabase logs in the dashboard
2. Verify your database password is correct
3. Make sure you have the necessary permissions on the project
