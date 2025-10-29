# 🚀 InterpreLab Supabase Setup

## Quick Start (Choose One Method)

### Method 1: Automated Setup (Recommended) ⚡

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your credentials from Project Settings → API
3. Run the setup script:

```powershell
.\setup-supabase.ps1
```

The script will:
- Update your .env file
- Login to Supabase
- Link your project
- Push database schema
- Set up secrets
- Deploy all Edge Functions

### Method 2: Manual Setup 📝

Follow the step-by-step guide in `QUICK_SETUP_COMMANDS.md`

## What You Need

Before starting, have these ready:

1. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
2. **Google Cloud API Key** - ✅ Already configured in your .env
3. **Project Credentials** from Supabase Dashboard:
   - Project Reference ID
   - Project URL
   - Anon Key
   - Service Role Key

## Files Created

- ✅ `SETUP_COMPLETE_CHECKLIST.md` - Complete checklist with all steps
- ✅ `SUPABASE_REMOTE_SETUP_GUIDE.md` - Detailed setup guide
- ✅ `QUICK_SETUP_COMMANDS.md` - Quick command reference
- ✅ `setup-supabase.ps1` - Automated setup script
- ✅ `.env` - Environment variables (update with your credentials)

## Important Notes

### Security 🔒
- Never commit `.env` to git
- Keep your service_role key secret
- Use anon key in frontend only
- Google Cloud API key should only be in Edge Functions

### Using npx
Since Supabase CLI is installed locally, always use:
```bash
npx supabase [command]
```

### No Docker Required
You don't need Docker Desktop for remote Supabase setup. Skip any `supabase start` commands.

## Troubleshooting

### "Command not found: supabase"
Use `npx supabase` instead of just `supabase`

### "Docker Desktop required"
You're trying to run local development. For remote setup, skip `supabase start`

### "Failed to link project"
- Ensure you're logged in: `npx supabase login`
- Check your project ref is correct
- Try with `--debug` flag

### "Function deployment failed"
- Check function code for errors
- Ensure all imports are correct
- Deploy functions one at a time

## Next Steps After Setup

1. Test authentication:
   ```bash
   npm run dev
   ```
   Then try signing up/in

2. Test InterpreTrack:
   - Create a call record
   - Upload a recording
   - Check earnings calculation

3. Test InterpreStudy:
   - Generate study content
   - Create flashcards
   - Take a quiz

4. Test InterpreCoach:
   - View analytics
   - Check progress tracking
   - Review performance metrics

## Support

- **Supabase Docs**: https://supabase.com/docs
- **CLI Reference**: https://supabase.com/docs/guides/cli
- **Gemini API**: https://ai.google.dev/docs

## Estimated Setup Time

- Automated: ~10 minutes
- Manual: ~20 minutes

Good luck! 🎉
