# Quick Setup Commands

## 🚀 Fast Track Setup (Copy & Paste)

### 1. Login to Supabase
```bash
npx supabase login
```

### 2. Link Your Project
```bash
# Replace YOUR_PROJECT_REF with your actual project reference ID
npx supabase link --project-ref YOUR_PROJECT_REF
```

### 3. Push Database Schema
```bash
npx supabase db push
```

### 4. Set Google Cloud API Key Secret
```bash
npx supabase secrets set GOOGLE_CLOUD_API_KEY=AIzaSyDw4TmUaofJEFi23Sw2MK40tVNARvitqeo
```

### 5. Deploy All Edge Functions
```bash
npx supabase functions deploy generate-study-content
npx supabase functions deploy process-assessment
npx supabase functions deploy generate-analytics
npx supabase functions deploy calculate-earnings
```

## ✅ Verification

### Check if everything is set up:
```bash
# List your projects
npx supabase projects list

# Check secrets (won't show values, just keys)
npx supabase secrets list

# Check function status
npx supabase functions list
```

## 📝 Update .env File

After creating your Supabase project, update `.env`:

```env
# Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## 🎯 What Each Command Does

- **login**: Authenticates your CLI with Supabase
- **link**: Connects your local project to remote Supabase project
- **db push**: Uploads your database migrations (creates tables)
- **secrets set**: Stores sensitive keys securely in Supabase
- **functions deploy**: Uploads your Edge Functions to Supabase

## 💡 Pro Tips

1. Run commands in order - each depends on the previous one
2. Keep your terminal open to see any error messages
3. If a command fails, read the error message carefully
4. Use `--debug` flag for more details: `npx supabase db push --debug`
