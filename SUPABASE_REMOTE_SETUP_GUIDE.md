# Supabase Remote Setup Guide

## Prerequisites
- Google Cloud API Key: ✅ Already configured
- Supabase CLI: ✅ Installed locally (use `npx supabase`)

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in the details:
   - **Name**: interprelab (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development

## Step 2: Get Your Supabase Credentials

Once your project is created:

1. Go to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

3. Update your `.env` file with these values:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

## Step 3: Link Your Local Project to Remote

Run this command in your project directory:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

To find your project ref:
- Go to Project Settings → General
- Look for "Reference ID" (it's a short string like `abcdefghijkl`)

## Step 4: Push Your Database Schema

After linking, push your migrations:

```bash
npx supabase db push
```

This will create all your tables:
- users, profiles, interpreters
- calls, call_recordings
- earnings, analytics
- study_sessions, study_content, assessments
- And more!

## Step 5: Set Up Google Cloud API Key in Supabase

You need to add your Google Cloud API key as a Supabase secret so your Edge Functions can use it:

```bash
npx supabase secrets set GOOGLE_CLOUD_API_KEY=AIzaSyDw4TmUaofJEFi23Sw2MK40tVNARvitqeo
```

## Step 6: Deploy Your Edge Functions

Deploy each function individually:

```bash
# Deploy the study content generator
npx supabase functions deploy generate-study-content

# Deploy the assessment processor
npx supabase functions deploy process-assessment

# Deploy the analytics generator
npx supabase functions deploy generate-analytics

# Deploy the earnings calculator
npx supabase functions deploy calculate-earnings
```

## Step 7: Verify Everything Works

1. Check your Supabase Dashboard:
   - Go to **Table Editor** - you should see all your tables
   - Go to **Edge Functions** - you should see your 4 deployed functions

2. Test your connection in your app:
   ```bash
   npm run dev
   ```

## Troubleshooting

### If `npx supabase link` fails:
- Make sure you're logged in: `npx supabase login`
- Check your project ref is correct
- Ensure you have internet connection

### If database push fails:
- Check if migrations have syntax errors
- Try running with `--debug` flag: `npx supabase db push --debug`

### If function deployment fails:
- Check function code for errors
- Ensure Deno runtime is compatible
- Verify import paths are correct

## Next Steps

After setup is complete:

1. ✅ Test authentication (sign up/sign in)
2. ✅ Test InterpreTrack (call tracking)
3. ✅ Test InterpreStudy (AI-generated content)
4. ✅ Test InterpreCoach (analytics)

## Quick Reference Commands

```bash
# Login to Supabase
npx supabase login

# Link to remote project
npx supabase link --project-ref YOUR_REF

# Push database changes
npx supabase db push

# Deploy a function
npx supabase functions deploy FUNCTION_NAME

# Set a secret
npx supabase secrets set KEY=VALUE

# List secrets
npx supabase secrets list

# Check project status
npx supabase projects list
```

## Important Notes

- **Never commit** your `.env` file to git
- **Keep your service_role key secret** - it has admin access
- **Use anon key** in your frontend code
- **Use service_role key** only in secure backend/Edge Functions
- **Google Cloud API key** should only be used in Edge Functions, not exposed to frontend
