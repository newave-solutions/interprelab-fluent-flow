# 🎯 Quick Reference Card

## 📋 Credentials Checklist

Copy these 4 values from Supabase:

- [ ] **Project URL**: `https://________.supabase.co`
- [ ] **Reference ID**: `________`
- [ ] **Anon Key**: `eyJ________`
- [ ] **Service Role Key**: `eyJ________`

---

## ⚡ Setup Commands

```bash
# Run automated setup
.\setup-supabase.ps1

# OR manual setup:
npx supabase login
npx supabase link --project-ref YOUR_REF
npx supabase db push
npx supabase secrets set GOOGLE_CLOUD_API_KEY=AIzaSyDw4TmUaofJEFi23Sw2MK40tVNARvitqeo
npx supabase functions deploy generate-study-content
npx supabase functions deploy process-assessment
npx supabase functions deploy generate-analytics
npx supabase functions deploy calculate-earnings
```

---

## ✅ Verification Commands

```bash
# Check project
npx supabase projects list

# Check secrets
npx supabase secrets list

# Check functions
npx supabase functions list

# Start app
npm run dev
```

---

## 🔗 Important Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Create Project**: https://supabase.com/dashboard/projects
- **API Settings**: Settings → API
- **Table Editor**: Left sidebar → Table Editor
- **Edge Functions**: Left sidebar → Edge Functions

---

## 📁 Setup Files

- `START_HERE.md` - Begin here
- `VISUAL_SETUP_GUIDE.md` - Step-by-step with screenshots
- `QUICK_SETUP_COMMANDS.md` - Command reference
- `setup-supabase.ps1` - Automated setup script

---

## 🆘 Quick Fixes

**Login issues?**
```bash
npx supabase login --debug
```

**Link failed?**
```bash
npx supabase link --project-ref YOUR_REF --debug
```

**Push failed?**
```bash
npx supabase db push --debug
```

**App not working?**
1. Check .env file
2. Restart dev server
3. Check browser console

---

## 📊 Expected Results

After setup you should have:

**In Supabase Dashboard:**
- ✅ ~20 database tables
- ✅ 4 Edge Functions deployed
- ✅ 1 secret (GOOGLE_CLOUD_API_KEY)

**In Your App:**
- ✅ Can sign up
- ✅ Can sign in
- ✅ All pages load
- ✅ No console errors

---

## ⏱️ Time Estimates

- Create project: 5 min
- Copy credentials: 2 min
- Run setup: 5 min
- Test app: 3 min
- **Total: ~15 min**

---

## 🎯 Success = All Green Checkmarks!

```
✅ Supabase project created
✅ Credentials copied
✅ Setup script completed
✅ Tables visible in dashboard
✅ Functions deployed
✅ App running
✅ Can sign up/sign in
```

**You're done! 🎉**
