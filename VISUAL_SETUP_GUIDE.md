# 📸 Visual Setup Guide - Screenshots & Steps

## 🎯 Your Mission: Connect Supabase to Your Project

**Time Required:** 10-15 minutes
**Difficulty:** Easy
**Prerequisites:** ✅ All done! Just need a Supabase account

---

## 📋 What You'll Do

```
Step 1: Create Supabase Project (5 min)
   ↓
Step 2: Copy 4 Credentials (2 min)
   ↓
Step 3: Run Setup Script (5 min)
   ↓
Step 4: Test Your App (3 min)
   ↓
🎉 DONE!
```

---

## 🚀 STEP 1: Create Supabase Project

### 1.1 Open Supabase
```
🌐 Go to: https://supabase.com
```

### 1.2 Sign In
```
If you have account:
  → Click "Sign In" (top right)
  → Use GitHub or Email

If you're new:
  → Click "Start your project"
  → Sign up with GitHub (recommended) or Email
```

### 1.3 Create Project
```
After signing in, you'll see your dashboard:

1. Click the green "New Project" button
   (or "+ New project" if you have existing projects)

2. Fill in the form:
   ┌─────────────────────────────────────┐
   │ Organization: [Your Org]            │
   │ Name: interprelab                   │
   │ Database Password: [Strong Password]│
   │ Region: US East (N. Virginia)       │
   │ Pricing Plan: Free                  │
   └─────────────────────────────────────┘

3. Click "Create new project"

4. ⏳ Wait 2-3 minutes (grab a coffee!)
```

**⚠️ IMPORTANT:** Save your database password somewhere safe!

---

## 📝 STEP 2: Copy Your Credentials

### 2.1 Navigate to API Settings
```
Once your project is ready:

Left Sidebar → ⚙️ Settings → API
```

### 2.2 Copy These 4 Values

#### Value #1: Project URL
```
Location: Top of the page, "Project URL" section
Example: https://abcdefghijklmnop.supabase.co

📋 Copy this entire URL
```

#### Value #2: Project Reference ID
```
Location: Settings → General → "Reference ID"
Example: abcdefghijklmnop

📋 Copy just the ID (the part before .supabase.co)
```

#### Value #3: Anon Key (Public)
```
Location: "Project API keys" section → "anon public"
Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9...

📋 Copy the entire key (it's long!)
```

#### Value #4: Service Role Key (Secret)
```
Location: "Project API keys" section → "service_role"
Click "Reveal" to see it
Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0...

📋 Copy the entire key (it's long!)
⚠️ Keep this SECRET - don't share it!
```

**💡 TIP:** Keep a notepad open and paste all 4 values there temporarily

---

## ⚡ STEP 3: Run Setup

### Option A: Automated (Recommended)

```powershell
# 1. Open PowerShell in your project folder
# 2. Run the setup script:
.\setup-supabase.ps1

# 3. When prompted, paste your credentials:
#    - Project Reference ID
#    - Project URL
#    - Anon Key
#    - Service Role Key

# 4. Wait for completion (~5 minutes)
```

The script will:
- ✅ Update your .env file
- ✅ Login to Supabase
- ✅ Link your project
- ✅ Create all database tables
- ✅ Set up Google Cloud API key
- ✅ Deploy all 4 Edge Functions

### Option B: Manual

If the script doesn't work, follow `QUICK_SETUP_COMMANDS.md`

---

## ✅ STEP 4: Verify Everything Works

### 4.1 Check Supabase Dashboard

Go back to your Supabase dashboard:

```
1. Table Editor (left sidebar)
   → You should see ~20 tables:
   ✓ users
   ✓ profiles
   ✓ interpreters
   ✓ calls
   ✓ earnings
   ✓ learning_paths
   ✓ lessons
   ✓ flashcards
   ✓ quizzes
   ✓ ... and more!

2. Edge Functions (left sidebar)
   → You should see 4 functions:
   ✓ generate-study-content
   ✓ process-assessment
   ✓ generate-analytics
   ✓ calculate-earnings
```

### 4.2 Test Your App

```bash
# Start the development server
npm run dev

# Open browser to: http://localhost:5173
```

**Test these features:**

1. **Sign Up**
   ```
   → Go to Sign In page
   → Click "Sign Up"
   → Enter email and password
   → Should create account successfully
   ```

2. **Sign In**
   ```
   → Enter your credentials
   → Should log in successfully
   → Should see your dashboard
   ```

3. **Navigate Pages**
   ```
   ✓ InterpreTrack - Call tracking
   ✓ InterpreStudy - Learning platform
   ✓ InterpreCoach - Analytics
   ```

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ No errors in terminal
✅ Can sign up/sign in
✅ See tables in Supabase dashboard
✅ See functions in Supabase dashboard
✅ App loads without console errors

---

## 🆘 Troubleshooting

### "npx supabase login" doesn't work
```bash
# Try with debug flag:
npx supabase login --debug

# Or manually get access token:
# 1. Go to: https://supabase.com/dashboard/account/tokens
# 2. Create new token
# 3. Run: npx supabase login --token YOUR_TOKEN
```

### "Failed to link project"
```bash
# Make sure you're logged in first:
npx supabase login

# Then try linking with debug:
npx supabase link --project-ref YOUR_REF --debug
```

### "Database push failed"
```bash
# Check for migration errors:
npx supabase db push --debug

# If still fails, check migration files for syntax errors
```

### "Can't sign up in app"
```bash
# Check your .env file has correct values:
# - VITE_SUPABASE_URL should start with https://
# - VITE_SUPABASE_ANON_KEY should be the long JWT token

# Restart your dev server:
# Press Ctrl+C in terminal
# Run: npm run dev
```

### "Functions not working"
```bash
# Check if they're deployed:
npx supabase functions list

# Redeploy if needed:
npx supabase functions deploy generate-study-content
```

---

## 📚 Additional Resources

- **Quick Commands**: `QUICK_SETUP_COMMANDS.md`
- **Detailed Guide**: `SUPABASE_REMOTE_SETUP_GUIDE.md`
- **Checklist**: `SETUP_COMPLETE_CHECKLIST.md`
- **Supabase Docs**: https://supabase.com/docs
- **CLI Reference**: https://supabase.com/docs/guides/cli

---

## 💡 Pro Tips

1. **Save your credentials** - Keep them in a password manager
2. **Check the dashboard** - Supabase dashboard is your friend
3. **Read error messages** - They usually tell you exactly what's wrong
4. **Use --debug flag** - Adds more details to error messages
5. **One step at a time** - Don't rush, follow the steps in order

---

## 🎯 Next Steps After Setup

Once everything is working:

1. **Explore the features**
   - Create a call record in InterpreTrack
   - Generate study content in InterpreStudy
   - View analytics in InterpreCoach

2. **Customize your app**
   - Update branding
   - Modify colors
   - Add your content

3. **Deploy to production**
   - When ready, deploy to Vercel/Netlify
   - Update environment variables
   - Test in production

---

**Ready? Let's do this! 🚀**

Start with: `.\setup-supabase.ps1`
