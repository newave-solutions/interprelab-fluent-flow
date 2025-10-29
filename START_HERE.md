# 🎯 START HERE - Complete Setup in 3 Steps

## Current Status: ✅ Ready to Connect

Your project is fully prepared! You just need to:
1. Create a Supabase project
2. Get your credentials
3. Run the setup

---

## Step 1: Create Supabase Project (5 minutes)

### 1.1 Go to Supabase
Open your browser and go to: **https://supabase.com**

### 1.2 Sign In or Sign Up
- If you have an account: Click "Sign In"
- If you're new: Click "Start your project" → Sign up with GitHub or email

### 1.3 Create New Project
1. Click the **"New Project"** button
2. Fill in the form:
   ```
   Name: interprelab
   Database Password: [Choose a strong password - SAVE THIS!]
   Region: [Choose closest to you, e.g., "US East (North Virginia)"]
   Pricing Plan: Free
   ```
3. Click **"Create new project"**
4. ⏳ Wait 2-3 minutes for project to initialize

---

## Step 2: Get Your Credentials (2 minutes)

### 2.1 Go to Project Settings
Once your project is ready:
1. Click the **⚙️ Settings** icon in the left sidebar
2. Click **"API"** in the settings menu

### 2.2 Copy These Values

You'll see a page with your API credentials. Copy these 4 values:

#### ① Project URL
```
Example: https://abcdefghijklmnop.supabase.co
```
**Location:** Under "Project URL" section

#### ② Project Reference ID
```
Example: abcdefghijklmnop
```
**Location:** Go to Settings → General → "Reference ID"

#### ③ Anon/Public Key
```
Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```
**Location:** Under "Project API keys" → "anon public"

#### ④ Service Role Key
```
Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```
**Location:** Under "Project API keys" → "service_role" (click "Reveal" to see it)

⚠️ **IMPORTANT:** Keep the service_role key secret!

---

## Step 3: Run Setup (Choose One Method)

### Option A: Automated Setup (Recommended) ⚡

1. Open PowerShell in your project directory
2. Run:
   ```powershell
   .\setup-supabase.ps1
   ```
3. When prompted, paste the values you copied in Step 2
4. Wait for the script to complete (~5 minutes)

### Option B: Manual Setup 📝

1. Update your `.env` file with the credentials from Step 2:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

2. Run these commands one by one:
   ```bash
   # Login
   npx supabase login

   # Link project (replace YOUR_REF with your Reference ID)
   npx supabase link --project-ref YOUR_REF

   # Push database
   npx supabase db push

   # Set Google API key
   npx supabase secrets set GOOGLE_CLOUD_API_KEY=AIzaSyDw4TmUaofJEFi23Sw2MK40tVNARvitqeo

   # Deploy functions
   npx supabase functions deploy generate-study-content
   npx supabase functions deploy process-assessment
   npx supabase functions deploy generate-analytics
   npx supabase functions deploy calculate-earnings
   ```

---

## Step 4: Verify & Test (3 minutes)

### 4.1 Verify Setup
```bash
# Check project is linked
npx supabase projects list

# Check secrets are set
npx supabase secrets list

# Check functions are deployed
npx supabase functions list
```

### 4.2 Check Supabase Dashboard
Go to your Supabase dashboard:
1. **Table Editor** → You should see ~20 tables
2. **Edge Functions** → You should see 4 functions

### 4.3 Test Your App
```bash
npm run dev
```

Then test:
- ✅ Sign up with email/password
- ✅ Sign in
- ✅ Navigate to InterpreTrack
- ✅ Navigate to InterpreStudy
- ✅ Navigate to InterpreCoach

---

## 🎉 You're Done!

Once you see your app running and can sign up/sign in, you're all set!

### What You Now Have:

✅ **Database** - 20+ tables for all features
✅ **Authentication** - Email/password auth ready
✅ **Edge Functions** - 4 AI-powered functions deployed
✅ **Google Cloud Integration** - Gemini API connected
✅ **Frontend** - Connected to Supabase backend

### Next Steps:

1. **Customize** - Update branding, colors, content
2. **Test Features** - Try all three main features
3. **Deploy** - When ready, deploy to production

---

## Need Help?

### Common Issues:

**"npx supabase login" opens browser but nothing happens**
- Check if you're already logged in
- Try closing and reopening your terminal

**"Failed to link project"**
- Double-check your Reference ID
- Make sure you're logged in
- Try: `npx supabase link --project-ref YOUR_REF --debug`

**"Database push failed"**
- Check if migrations have errors
- Try: `npx supabase db push --debug`

**"Function deployment failed"**
- Check function code for syntax errors
- Deploy functions one at a time
- Check logs in Supabase dashboard

### Support Resources:

- 📚 **Detailed Guide**: `SUPABASE_REMOTE_SETUP_GUIDE.md`
- ⚡ **Quick Commands**: `QUICK_SETUP_COMMANDS.md`
- ✅ **Checklist**: `SETUP_COMPLETE_CHECKLIST.md`
- 🔧 **Supabase Docs**: https://supabase.com/docs

---

## Estimated Time: 10-15 minutes total

Good luck! 🚀
