# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 1. "supabase command not found"

**Problem:** Terminal doesn't recognize `supabase` command

**Solution:**
```bash
# Always use npx:
npx supabase [command]

# NOT just:
supabase [command]
```

---

### 2. "Failed to login"

**Problem:** `npx supabase login` doesn't work

**Solutions:**
```bash
# Try with debug:
npx supabase login --debug

# Or get token manually:
# 1. Go to: https://supabase.com/dashboard/account/tokens
# 2. Create new token
# 3. Run:
npx supabase login --token YOUR_TOKEN
```

---

### 3. "Failed to link project"

**Problem:** Can't link to Supabase project

**Solutions:**
```bash
# Make sure you're logged in first:
npx supabase login

# Check your project ref is correct (no spaces, no https://)
npx supabase link --project-ref abcdefgh --debug

# List your projects to verify:
npx supabase projects list
```

---

### 4. "Database push failed"

**Problem:** Migrations won't apply

**Solutions:**
```bash
# Check for syntax errors:
npx supabase db push --debug

# If migrations have errors, check the SQL files in:
# supabase/migrations/
```


---

### 5. "Function deployment failed"

**Problem:** Edge Functions won't deploy

**Solutions:**
```bash
# Deploy one at a time:
npx supabase functions deploy generate-study-content --debug

# Check function code for errors
# Check import paths are correct
# Ensure Deno syntax is valid
```

---

### 6. "Can't sign up in app"

**Problem:** Sign up button doesn't work

**Solutions:**
1. Check `.env` file has correct values:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

2. Restart dev server:
   ```bash
   # Press Ctrl+C
   npm run dev
   ```

3. Check browser console for errors (F12)

4. Verify in Supabase dashboard:
   - Settings → API → Confirm URL and keys match

---

### 7. "CORS errors in browser"

**Problem:** API calls blocked by CORS

**Solution:**
- Edge Functions already have CORS configured
- Check if functions are deployed: `npx supabase functions list`
- Redeploy if needed

---

### 8. "Google API key not working"

**Problem:** AI features don't work

**Solutions:**
```bash
# Check if secret is set:
npx supabase secrets list

# Set it again:
npx supabase secrets set GOOGLE_CLOUD_API_KEY=YOUR_KEY

# Verify in Google Cloud Console:
# - API key is valid
# - Gemini API is enabled
```

---

### 9. ".env changes not reflected"

**Problem:** Updated .env but app still uses old values

**Solution:**
```bash
# Restart dev server:
# Press Ctrl+C in terminal
npm run dev

# Clear browser cache (Ctrl+Shift+R)
```

---

### 10. "Docker Desktop required"

**Problem:** Error about Docker Desktop

**Solution:**
- You don't need Docker for remote setup
- Skip `supabase start` command
- Use remote Supabase project instead
- Follow the remote setup guide

---

## 🆘 Still Having Issues?

### Check These:

1. **Internet connection** - Required for all operations
2. **Supabase status** - Check https://status.supabase.com
3. **Node.js version** - Should be 18+ (`node --version`)
4. **npm version** - Should be 9+ (`npm --version`)

### Get More Info:

```bash
# Add --debug to any command:
npx supabase [command] --debug

# Check logs in Supabase dashboard:
# Edge Functions → Select function → Logs
```

### Resources:

- **Supabase Docs**: https://supabase.com/docs
- **CLI Docs**: https://supabase.com/docs/guides/cli
- **Community**: https://github.com/supabase/supabase/discussions
- **Discord**: https://discord.supabase.com

---

## 📝 Reporting Issues

If you need to report an issue, include:

1. Command you ran
2. Full error message
3. Output of `npx supabase --version`
4. Output of `node --version`
5. Operating system (Windows/Mac/Linux)

---

**Most issues are solved by:**
1. Using `npx supabase` instead of `supabase`
2. Restarting the dev server
3. Checking .env file values
4. Using --debug flag

Good luck! 🚀
