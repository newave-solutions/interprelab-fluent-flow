# Database Migration: study_modules Table

## Overview

This migration creates the `study_modules` table needed for the InterpreStudy learning platform.

## Migration File

`supabase/migrations/20251220000000_create_study_modules.sql`

## What It Creates

### Table: `study_modules`

Stores structured learning modules for medical interpreter training.

**Columns:**

- `id` - UUID primary key
- `module_id` - Unique text identifier (e.g., "male-reproductive")
- `title` - Module title
- `description` - Module description
- `category` - Category grouping (e.g., "reproductive-systems")
- `icon` - Icon identifier
- `order_index` - Display order
- `content` - JSONB for structured slide/quiz content
- `is_active` - Boolean flag for active modules
- `created_at` - Timestamp

### Indexes

- `idx_study_modules_category` - Fast category filtering
- `idx_study_modules_order` - Fast order sorting
- `idx_study_modules_active` - Partial index for active modules

### Row Level Security (RLS)

- Public users can read active modules
- Authenticated users can read all modules

### Sample Data

Inserts 3 Reproductive Systems modules:

1. Male Reproductive System
2. Female Reproductive System
3. Obstetrics & Neonatal

## How to Apply

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of the migration file
4. Paste and run in the SQL Editor

### Option 2: Supabase CLI

```bash
# Navigate to project directory
cd C:\Users\LSA\Coding-projects\interprelab-fluent-flow\interprelab-fluent-flow

# Push migration to Supabase
supabase db push
```

### Option 3: Manual SQL Execution

```bash
# Connect to your Supabase database and run:
psql -h db.opmafykbhjinqebgflnl.supabase.co -U postgres -d postgres -f supabase/migrations/20251220000000_create_study_modules.sql
```

## Verification

After running the migration, verify it worked:

```sql
-- Check if table exists
SELECT * FROM public.study_modules;

-- Should return 3 rows (Male, Female, Obstetrics modules)
SELECT COUNT(*) FROM public.study_modules;

-- Check table structure
\d public.study_modules
```

## Rollback (If Needed)

If you need to rollback this migration:

```sql
DROP TABLE IF EXISTS public.study_modules CASCADE;
```

## Testing

After migration, navigate to InterpreStudy page - the error should be resolved!

## Notes

- This migration is **idempotent** - safe to run multiple times
- Uses `CREATE TABLE IF NOT EXISTS` and `ON CONFLICT` clauses
- Automatically creates sample modules for testing
- RLS policies ensure proper access control

## Related Files

- Component: `src/components/interprestudy/modules/InteractiveModulePlayer.tsx`
- Types: `src/integrations/supabase/types.ts` (lines 242-280)
