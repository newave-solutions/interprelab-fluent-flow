# Deploy Migrations via Supabase Dashboard

## Why Use Dashboard Instead of CLI

The Supabase CLI is having SSL connection issues that are difficult to resolve. The dashboard is:
- ✅ Faster (no SSL configuration needed)
- ✅ More reliable (direct HTTPS connection)
- ✅ Easier (just copy/paste SQL)
- ✅ Same result (migrations get applied)

## Step-by-Step Deployment

### Step 1: Open SQL Editor

Go to: https://supabase.com/dashboard/project/iokgkrnbawhizmuejluz/sql

### Step 2: Deploy Base Schema (if not already deployed)

1. Click **"New Query"** button
2. Open file: `supabase/migrations/20241028000001_initial_schema.sql`
3. Copy **ALL** contents (Ctrl+A, Ctrl+C)
4. Paste into SQL Editor (Ctrl+V)
5. Click **"Run"** button (or press Ctrl+Enter)
6. Wait for "Success" message

**What this does:**
- Creates base tables (profiles, call_logs, etc.)
- Sets up RLS policies
- Creates base functions

### Step 3: Deploy Contacts/Waitlist Tables

1. Click **"New Query"** button
2. Open file: `supabase/migrations/20241029000003_contacts_waitlist.sql`
3. Copy **ALL** contents
4. Paste and Click **"Run"**
5. Wait for "Success" message

**What this does:**
- Creates contacts and waitlist tables
- Required for the security fix migration

### Step 4: Deploy Function Security Fix

1. Click **"New Query"** button
2. Open file: `supabase/migrations/20241030000001_fix_function_search_path.sql`
3. Copy **ALL** contents
4. Paste and Click **"Run"**
5. Wait for "Success" message

**What this does:**
- Fixes 13 functions with mutable search_path
- Prevents SQL injection attacks
- Recreates all triggers

### Step 5: Deploy QA Feedback Schema

1. Click **"New Query"** button
2. Open file: `supabase/migrations/20241030000002_qa_feedback_schema.sql`
3. Copy **ALL** contents
4. Paste and Click **"Run"**
5. Wait for "Success" message

**What this does:**
- Creates 6 new tables for QA Feedback system
- Creates 2 functions
- Sets up RLS policies
- Pre-populates standards references

### Step 6: Fix Multiple Policies Warning

1. Click **"New Query"** button
2. Open file: `supabase/migrations/20241030000003_fix_multiple_policies.sql`
3. Copy **ALL** contents
4. Paste and Click **"Run"**
5. Wait for "Success" message

**What this does:**
- Fixes "Multiple Permissive Policies" warnings
- Combines duplicate SELECT policies into single policies
- Improves security and performance

### Step 7: Verify Deployment

Run this query in the SQL Editor:

```sql
-- Check if new tables exist
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
  )
ORDER BY table_name;
```

**Expected result:** Should return 6 rows (all the new tables)

### Step 8: Check Performance Advisor

Go to: https://supabase.com/dashboard/project/iokgkrnbawhizmuejluz/advisors/performance

**Expected result:**
- ✅ No "Multiple Permissive Policies" warnings
- ✅ No "role mutable search_path" security issues

## Troubleshooting

### Issue: "relation already exists" error

This means the table is already in your database. Skip that migration and continue with the next one.

### Issue: "relation does not exist" error

You're running migrations out of order. Go back and run the earlier migrations first:
1. 20241028000001 (base schema)
2. 20241029000003 (contacts/waitlist)
3. Then continue with 20241030* migrations

### Issue: "function already exists" error

The migration uses `DROP FUNCTION IF EXISTS` so this shouldn't happen. If it does:

**Solution:** Manually drop the function first:
```sql
DROP FUNCTION IF EXISTS public.function_name CASCADE;
```

Then run the migration again.

## Summary

**Dashboard URL:** https://supabase.com/dashboard/project/iokgkrnbawhizmuejluz/sql

**Files to Deploy (in order):**
1. `supabase/migrations/20241028000001_initial_schema.sql` (if not deployed)
2. `supabase/migrations/20241029000003_contacts_waitlist.sql` (if not deployed)
3. `supabase/migrations/20241030000001_fix_function_search_path.sql`
4. `supabase/migrations/20241030000002_qa_feedback_schema.sql`
5. `supabase/migrations/20241030000003_fix_multiple_policies.sql`

**Time Required:** ~5 minutes

**Result:** All security fixes, QA Feedback system, and performance warnings resolved! 🚀

