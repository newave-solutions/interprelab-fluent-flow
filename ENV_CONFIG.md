# Environment Configuration

## ⚙️ How This Project Uses Environment Variables

This project is configured to **only use the `.env` file** for all environment variables.

### Configuration Details

- **Primary file**: `.env` (tracked in git with placeholder values)

- **Vite configuration**: Explicitly set to load only from `.env`

- **No overrides**: `.env.local` and `.env.[mode]` files are **ignored**

### Important Notes

1. **The `.env` file is version controlled** and contains placeholder values

1. **You must replace placeholders** with your actual credentials:

   ```

   VITE_SUPABASE_ANON_KEY=your-anon-key-here  ← Replace this
   ```

1. **Get your credentials from**:

   - Supabase Dashboard: <https://supabase.com/dashboard/project/opmafykbhjinqebgflnl/settings/api>

### Required Environment Variables

```bash

# Supabase Configuration (required)

VITE_SUPABASE_URL=https://opmafykbhjinqebgflnl.supabase.co
VITE_SUPABASE_ANON_KEY=<your-actual-anon-key>

```

### Vite Environment File Priority

By default, Vite loads environment files in this order (highest priority first):

1. `.env.[mode].local`

1. `.env.[mode]`

1. `.env.local`

1. `.env`

**This project overrides that behavior** via `vite.config.ts` to use **only** `.env`.

### Verification

To verify your environment variables are loaded:

1. Start the dev server: `npm run dev`

1. Open browser console

1. Environment variables prefixed with `VITE_` are accessible via `import.meta.env`

### Security Note

⚠️ **Never commit sensitive credentials**. The `.env` file in this repo uses placeholders. Replace them locally but don't commit actual secrets.
