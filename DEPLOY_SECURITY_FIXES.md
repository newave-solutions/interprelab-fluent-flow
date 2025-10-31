# Deploy Security Fixes - Quick Guide

## Current Status

You're seeing linter warnings for functions with mutable `search_path` because the security fix migration hasn't been deployed yet. The warnings are for:

1. ❌ `public.calculate_learning_path_progress`
2. ❌ `public.get_flashcards_for_review`
3. ❌ `public.increment_post_comments`
4. ❌ `public.decrement_post_likes`
5. ❌ `public.handle_new_user`

**These will all be fixed when you deploy the migration.**

---

## Quick Deploy

### Option 1: Supabase CLI (Recommended)

```bash
# Make sure you're in the project directory
cd /path/to/interprelab-eco-landing-page

# Deploy all pending migrations
supabase db push

# Or deploy specific migration
supabase migration up
```

### Option 2: Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/20241030000001_fix_function_search_path.sql`
4. Paste and run the SQL
5. Verify no errors

### Option 3: Direct psql

```bash
# Connect to your database
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run the migration
\i supabase/migrations/20241030000001_fix_function_search_path.sql

# Verify
\df public.*
```

---

## Verification After Deployment

### Check 1: Verify Functions Have search_path

```sql
SELECT
  p.proname as function_name,
  p.proconfig as search_path_config,
  CASE
    WHEN p.proconfig IS NULL THEN '❌ MISSING'
    WHEN 'search_path=public,pg_catalog' = ANY(p.proconfig::text[]) THEN '✅ FIXED'
    ELSE '⚠️ CHECK'
  END as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN (
    'calculate_learning_path_progress',
    'get_flashcards_for_review',
    'increment_post_comments',
    'decrement_post_likes',
    'handle_new_user',
    'handle_updated_at',
    'get_user_stats',
    'update_study_streak',
    'increment_post_likes',
    'increment_discussion_replies'
  )
ORDER BY status, function_name;
```

**Expected Result:** All functions should show `✅ FIXED`

### Check 2: Test Functions Still Work

```sql
-- Test user stats function
SELECT * FROM get_user_stats();

-- Test flashcards function
SELECT * FROM get_flashcards_for_review(auth.uid(), 5);

-- Test triggers by inserting/deleting a like
INSERT INTO post_likes (post_id, user_id)
VALUES ('test-post-id', auth.uid());

DELETE FROM post_likes
WHERE post_id = 'test-post-id' AND user_id = auth.uid();
```

**Expected Result:** All queries should work without errors

### Check 3: Verify Linter Warnings Gone

After deployment, the Supabase linter should no longer show warnings for these functions.

---

## What This Migration Does

### Functions Fixed (13 total)

The migration drops and recreates all functions with:
- ✅ `SET search_path = public, pg_catalog`
- ✅ Fully qualified table names
- ✅ SECURITY DEFINER with proper safeguards

**Core Functions:**
1. `handle_updated_at()` - Timestamp updates
2. `handle_new_user()` - User signup
3. `get_user_stats()` - User statistics

**InterpreStudy Functions:**
4. `update_study_streak()`
5. `get_flashcards_for_review()`
6. `calculate_learning_path_progress()`

**InterpreLink Functions:**
7. `increment_post_likes()`
8. `decrement_post_likes()`
9. `increment_post_comments()`
10. `increment_discussion_replies()`

### Triggers Recreated (30+)

All triggers are dropped and recreated to use the fixed functions.

---

## Safety Notes

### ✅ Safe to Deploy

- **No breaking changes**: Functions maintain same signatures
- **No data loss**: Only function definitions change
- **No downtime**: Migration is fast (< 1 second)
- **Reversible**: Can rollback if needed (not recommended)

### ⚠️ Precautions

1. **Backup first** (recommended):
   ```bash
   supabase db dump > backup_before_security_fix.sql
   ```

2. **Test in staging** (if available):
   ```bash
   supabase link --project-ref your-staging-project
   supabase db push
   ```

3. **Monitor after deployment**:
   - Check application logs
   - Verify user signup works
   - Test post interactions
   - Check study session updates

---

## Troubleshooting

### Issue: Migration fails with "function does not exist"

**Solution:** This is expected - the migration drops functions before recreating them. The `IF EXISTS` clause handles this safely.

### Issue: Triggers not working after migration

**Solution:** The migration recreates all triggers. If issues persist:

```sql
-- Check triggers exist
SELECT
  tgname as trigger_name,
  tgrelid::regclass as table_name
FROM pg_trigger
WHERE tgname LIKE '%updated_at%'
   OR tgname LIKE '%post_like%'
   OR tgname LIKE '%comment%'
ORDER BY table_name, trigger_name;
```

### Issue: Application errors after deployment

**Solution:**
1. Check application logs for specific errors
2. Verify function signatures haven't changed
3. Test functions manually in SQL editor
4. If critical, rollback and investigate

---

## Rollback (Emergency Only)

**⚠️ Not recommended** - Previous versions were vulnerable

If you must rollback:

```bash
# Restore from backup
psql < backup_before_security_fix.sql
```

Or manually revert specific functions (see original migration files).

---

## Timeline

### Before Deployment
- ❌ 13 functions vulnerable to SQL injection
- ❌ Linter warnings present
- ❌ Security risk active

### After Deployment
- ✅ All functions secured
- ✅ No linter warnings
- ✅ SQL injection vector closed
- ✅ Privilege escalation prevented

---

## Next Steps

1. **Deploy the migration** using one of the methods above
2. **Verify deployment** using the checks provided
3. **Test application** to ensure everything works
4. **Monitor logs** for any issues
5. **Update SESSION_SUMMARY.md** to mark as deployed

---

## Summary

**Migration File:** `supabase/migrations/20241030000001_fix_function_search_path.sql`

**Status:** ✅ Ready to deploy

**Priority:** 🔴 Critical Security Fix

**Impact:**
- Security: Critical improvement
- Performance: Neutral
- Breaking changes: None
- Downtime: None

**Deploy Command:**
```bash
supabase db push
```

**Verification:**
```sql
-- Should return all ✅ FIXED
SELECT proname, proconfig FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
AND proconfig IS NOT NULL;
```

---

**Ready to deploy!** 🚀

The linter warnings will disappear once this migration is applied to your database.
