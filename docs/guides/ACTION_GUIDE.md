# InterpreLab - Complete Action Guide

**Last Updated**: October 29, 2025
**Status**: Production Ready ✅
**Version**: 2.0.0

---

## 📋 Table of Contents

1. [Quick Start (5 minutes)](#quick-start)
2. [Development Setup (30 minutes)](#development-setup)
3. [Supabase Deployment (15 minutes)](#supabase-deployment)
4. [Google Cloud Setup (20 minutes)](#google-cloud-setup)
5. [Chrome Extension Setup (10 minutes)](#chrome-extension-setup)
6. [Video Content Creation (varies)](#video-content-creation)
7. [Testing & Validation (15 minutes)](#testing--validation)
8. [Production Deployment (30 minutes)](#production-deployment)
9. [Monitoring & Maintenance (ongoing)](#monitoring--maintenance)

---

## 🚀 Quick Start

**Goal**: Get the application running locally in 5 minutes

### Prerequisites
- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# Navigate to http://localhost:5173
```

**✅ Success**: You should see the InterpreLab homepage

---

## 💻 Development Setup

**Goal**: Set up complete development environment

### 1. Install Required Tools

#### Node.js & npm
```bash
# Check if installed
node --version  # Should be 18+
npm --version

# If not installed, download from nodejs.org
```

#### Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Verify installation
supabase --version
```

#### Google Cloud CLI (Optional for AI features)
```bash
# Download from: https://cloud.google.com/sdk/docs/install
# Or use installer for your OS

# Verify installation
gcloud --version
```

### 2. Clone & Install

```bash
# Clone repository (if not already done)
git clone <your-repo-url>
cd interprelab-eco-landing-page

# Install dependencies
npm install

# Copy environment file
copy .env.example .env
```

### 3. Configure Environment Variables

Edit `.env` file:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://iokgkrnbawhizmuejluz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlva2drcm5iYXdoaXptdWVqbHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2Mjg5ODcsImV4cCI6MjA3NzIwNDk4N30.GTIKRwPUu44PA209OFLj1WaEEGgKwbBaO0iTc7P-UtY

# Google Cloud (for AI features)
VITE_GOOGLE_CLOUD_PROJECT_ID=interprelab-eco-landing-page
```

### 4. Install VS Code Extensions (Recommended)

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Install:
   - **Deno** (for Supabase functions)
   - **ESLint**
   - **Prettier**
   - **Tailwind CSS IntelliSense**

### 5. Start Development

```bash
# Start dev server
npm run dev

# In another terminal, start Supabase locally (optional)
supabase start
```

**✅ Success**: Application running at http://localhost:5173

---

## 🗄️ Supabase Deployment

**Goal**: Deploy database and Edge Functions to Supabase

### 1. Login to Supabase

```bash
# Login (opens browser)
supabase login

# Link to your project
supabase link --project-ref iokgkrnbawhizmuejluz
```

### 2. Apply Database Migrations

```bash
# Push all migrations to remote database
supabase db push

# Verify migrations
supabase migration list
```

**Expected Output**:
```
✓ 20241028000001_initial_schema.sql
✓ 20241028000002_interprestudy_schema.sql
✓ 20251002162447_3df7a49c-da01-4f29-9417-36cff580e6ef.sql
✓ 20251002162539_49b8b89a-900b-437a-8fad-5008d192c86d.sql
✓ 20251003152906_6458ce7b-99be-4741-951d-428ca431a522.sql
✓ 20251023190613_bc08033c-6420-4198-9343-d77323ab570c.sql
✓ 20251027170018_14a9fb6e-de2b-4c5f-aee7-1fd26166b6d8.sql
✓ 20251029031228_3bb8df16-07d4-4ade-89c5-cffe8a537d3c.sql
```

### 3. Set Environment Secrets

```bash
# Set Google Cloud credentials (get from Google Cloud Console)
supabase secrets set GOOGLE_CLOUD_API_KEY=your-api-key-here
supabase secrets set GOOGLE_CLOUD_PROJECT_ID=interprelab-eco-landing-page

# Verify secrets are set
supabase secrets list
```

### 4. Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy process-interprecoach
supabase functions deploy process-assessment
supabase functions deploy generate-analytics
supabase functions deploy calculate-earnings
supabase functions deploy generate-study-content

# Verify deployment
supabase functions list
```

**Expected Output**:
```
✓ process-interprecoach (deployed)
✓ process-assessment (deployed)
✓ generate-analytics (deployed)
✓ calculate-earnings (deployed)
✓ generate-study-content (deployed)
```

### 5. Test Edge Functions

```bash
# Test process-interprecoach function
curl -i --location --request POST \
  'https://iokgkrnbawhizmuejluz.supabase.co/functions/v1/process-interprecoach' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlva2drcm5iYXdoaXptdWVqbHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2Mjg5ODcsImV4cCI6MjA3NzIwNDk4N30.GTIKRwPUu44PA209OFLj1WaEEGgKwbBaO0iTc7P-UtY' \
  --header 'Content-Type: application/json' \
  --data '{"text":"Patient has hypertension","medications":[],"conversions":[]}'
```

**✅ Success**: Should return JSON with medical terms detected

---

## ☁️ Google Cloud Setup

**Goal**: Enable Google Medical AI for HIPAA-compliant interpretation

### 1. Set Active Project

```bash
# Set project
gcloud config set project interprelab-eco-landing-page

# Verify
gcloud config get-value project
```

### 2. Enable Required APIs

```bash
# Enable Vertex AI (for Medical AI)
gcloud services enable aiplatform.googleapis.com

# Enable Healthcare API (for HIPAA compliance)
gcloud services enable healthcare.googleapis.com

# Enable Cloud Logging
gcloud services enable logging.googleapis.com

# Verify enabled services
gcloud services list --enabled
```

### 3. Create Service Account

```bash
# Create service account
gcloud iam service-accounts create interprecoach-ai \
    --display-name="InterpreCoach AI Service Account" \
    --description="Service account for HIPAA-compliant medical AI"

# Grant Vertex AI permissions
gcloud projects add-iam-policy-binding interprelab-eco-landing-page \
    --member="serviceAccount:interprecoach-ai@interprelab-eco-landing-page.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

# Create and download key
gcloud iam service-accounts keys create key.json \
    --iam-account=interprecoach-ai@interprelab-eco-landing-page.iam.gserviceaccount.com

# IMPORTANT: Store key.json securely, never commit to git
```

### 4. Create API Key

```bash
# Create API key
gcloud alpha services api-keys create \
    --display-name="InterpreCoach API Key" \
    --project=interprelab-eco-landing-page

# List keys to get the key string
gcloud alpha services api-keys list --project=interprelab-eco-landing-page

# Copy the key value and add to Supabase secrets
supabase secrets set GOOGLE_CLOUD_API_KEY=<your-key-here>
```

### 5. HIPAA Compliance Setup

#### Sign Business Associate Agreement (BAA)

1. Contact Google Cloud Sales: https://cloud.google.com/contact
2. Request HIPAA BAA
3. Complete compliance documentation
4. Wait for approval (typically 1-2 weeks)

#### Enable Audit Logging

```bash
# Create storage bucket for audit logs
gsutil mb -p interprelab-eco-landing-page gs://interprelab-audit-logs

# Create audit log sink
gcloud logging sinks create hipaa-audit-logs \
    storage.googleapis.com/interprelab-audit-logs \
    --log-filter='protoPayload.serviceName="aiplatform.googleapis.com"' \
    --project=interprelab-eco-landing-page

# Verify sink created
gcloud logging sinks list
```

**✅ Success**: Google Cloud configured for HIPAA-compliant AI

---

## 🔌 Chrome Extension Setup

**Goal**: Install and configure the InterpreCoach Chrome Extension

### 1. Verify Configuration

Check `public/chrome-extension/config.json`:
```json
{
  "supabaseUrl": "https://iokgkrnbawhizmuejluz.supabase.co",
  "supabaseAnonKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "googleCloudProject": "interprelab-eco-landing-page",
  "googleMedicalAIEnabled": true
}
```

**✅ Already configured with your credentials!**

### 2. Load Extension in Chrome

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `public/chrome-extension` directory
6. Extension icon should appear in toolbar

### 3. Test Extension

1. Click the InterpreCoach extension icon
2. Click "Activate on Current Page"
3. The overlay should appear
4. Click "Start Session"
5. Speak: "Patient has hypertension and takes lisinopril 10mg daily"
6. Verify:
   - ✅ Transcript appears
   - ✅ Medical terms detected (hypertension)
   - ✅ Medications identified (lisinopril)
   - ✅ AI insights generated

### 4. Test PHI De-identification

1. Speak: "Patient John Smith, DOB 01/15/1980, MRN 12345"
2. Verify all PHI is redacted:
   - ✅ `[NAMES_REDACTED]`
   - ✅ `[DATES_REDACTED]`
   - ✅ `[MRN_REDACTED]`

**✅ Success**: Extension working with HIPAA compliance

---

## 🎥 Video Content Creation

**Goal**: Create professional demo videos for the hero section

### Video Requirements

- **Format**: MP4 (H.264 codec)
- **Resolution**: 1920x1080 (Full HD)
- **Aspect Ratio**: 16:9
- **Frame Rate**: 30fps
- **Bitrate**: 5-10 Mbps
- **Duration**: 15-30 seconds
- **File Size**: < 10MB per video

### Videos Needed

#### 1. LEP Statistics Video (`lep-statistics.mp4`)
**Theme**: Limited English Proficiency Statistics
- Show animated statistics about LEP patients
- Display growth charts of interpretation needs
- Highlight healthcare communication challenges
- Color scheme: Blue/teal tones

#### 2. Interpreter Stress Video (`interpreter-stress.mp4`)
**Theme**: Challenges Faced by Medical Interpreters
- Show interpreter in action (stock footage)
- Display stress indicators
- Highlight need for AI assistance
- Color scheme: Warm tones transitioning to cool

#### 3. Terminology Gap Video (`terminology-gap.mp4`)
**Theme**: Medical Terminology Complexity
- Animated medical terms floating/transforming
- Show translation challenges
- Display InterpreLab's AI solution
- Color scheme: Purple/gradient tones

### Creation Options

#### Option 1: Stock Footage (Fastest)
1. Visit **Pexels Videos** (https://www.pexels.com/videos/)
2. Search for relevant medical/healthcare footage
3. Download free videos
4. Edit with free tools:
   - **DaVinci Resolve** (professional, free)
   - **OpenShot** (simple, open-source)
   - **Shotcut** (cross-platform)

#### Option 2: AI Video Generation
1. **Runway ML** - AI video generation
2. **Synthesia** - AI avatar videos
3. **Pictory** - Text-to-video conversion

#### Option 3: Commission Professional Videos
1. **Fiverr** - $50-200 per video
2. **Upwork** - $100-500 per video
3. **99designs** - Design contests

### Video Optimization

```bash
# Convert to optimized MP4
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart output.mp4

# Resize to 1080p
ffmpeg -i input.mp4 -vf scale=1920:1080 -c:v libx264 -crf 23 output.mp4

# Compress file size
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow output.mp4
```

### Adding Videos to Project

1. Place MP4 files in `public/videos/`:
   - `lep-statistics.mp4`
   - `interpreter-stress.mp4`
   - `terminology-gap.mp4`

2. Videos will automatically load in Hero component

**✅ Success**: Professional demo videos ready

---

## ✅ Testing & Validation

**Goal**: Verify all features work correctly

### 1. Frontend Testing

```bash
# Run development server
npm run dev

# Test pages:
# - Home page: http://localhost:5173
# - InterpreBot: http://localhost:5173/interprebot
# - InterpreStudy: http://localhost:5173/interprestudy
# - InterpreTrack: http://localhost:5173/interpretrack
# - InterpreCoach: http://localhost:5173/interprecoach
```

**Checklist**:
- [ ] All pages load without errors
- [ ] Navigation works
- [ ] Logo displays correctly
- [ ] Video section shows (if videos added)
- [ ] Forms submit successfully
- [ ] Responsive design works on mobile

### 2. Supabase Testing

```bash
# Test database connection
supabase db status

# View function logs
supabase functions logs process-interprecoach --tail

# Test each function
curl -X POST https://iokgkrnbawhizmuejluz.supabase.co/functions/v1/process-interprecoach \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"test"}'
```

**Checklist**:
- [ ] Database accessible
- [ ] All 5 functions deployed
- [ ] Functions return valid responses
- [ ] No errors in logs

### 3. Chrome Extension Testing

**Checklist**:
- [ ] Extension loads in Chrome
- [ ] Overlay appears on activation
- [ ] Speech recognition works
- [ ] Medical terms detected
- [ ] Medications identified
- [ ] PHI de-identification works
- [ ] AI insights generated
- [ ] Session data clears on end

### 4. Performance Testing

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Check bundle size
npm run build -- --report
```

**Targets**:
- [ ] Page load < 3 seconds
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Bundle size < 500KB (gzipped)

**✅ Success**: All tests passing

---

## 🚀 Production Deployment

**Goal**: Deploy application to production

### 1. Build for Production

```bash
# Create production build
npm run build

# Test production build locally
npm run preview
```

### 2. Deploy to Hosting

#### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts to link project
```

#### Option B: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Follow prompts
```

#### Option C: Custom Server

```bash
# Copy dist folder to server
scp -r dist/* user@server:/var/www/interprelab

# Configure nginx/apache to serve static files
```

### 3. Configure Domain

1. Add custom domain in hosting provider
2. Update DNS records:
   ```
   A Record: @ -> hosting-ip
   CNAME: www -> hosting-domain
   ```
3. Enable HTTPS (automatic with Vercel/Netlify)

### 4. Update Environment Variables

In hosting provider dashboard, set:
```
VITE_SUPABASE_URL=https://iokgkrnbawhizmuejluz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GOOGLE_CLOUD_PROJECT_ID=interprelab-eco-landing-page
```

### 5. Chrome Extension Publication

1. Create developer account ($5 one-time fee)
2. Prepare store listing:
   - Name: InterpreCoach
   - Description: HIPAA-compliant medical interpretation assistant
   - Category: Productivity
   - Screenshots: 1280x800 or 640x400
3. Create ZIP file:
   ```bash
   cd public/chrome-extension
   zip -r interprecoach-extension.zip *
   ```
4. Upload to Chrome Web Store
5. Submit for review (1-3 days)

**✅ Success**: Application live in production!

---

## 📊 Monitoring & Maintenance

**Goal**: Keep application running smoothly

### Daily Tasks

```bash
# Check error rates
supabase functions logs --tail

# Monitor database performance
supabase db status

# Check API usage
gcloud logging read "resource.type=aiplatform.googleapis.com" --limit=50
```

### Weekly Tasks

- Review performance metrics
- Check security logs
- Update documentation
- Respond to user feedback

### Monthly Tasks

- Security audit
- Performance optimization
- Update dependencies:
  ```bash
  npm update
  npm audit fix
  ```
- Review and optimize costs

### Quarterly Tasks

- HIPAA compliance review
- Major version updates
- Architecture review
- User training updates

### Monitoring Tools

#### Supabase Dashboard
- Database usage
- Function invocations
- Error rates
- Response times

#### Google Cloud Console
- AI API usage
- Costs
- Audit logs
- Performance metrics

#### Application Monitoring
```bash
# Install monitoring (optional)
npm install @sentry/react @sentry/vite-plugin

# Configure in vite.config.ts
```

**✅ Success**: Monitoring in place

---

## 📞 Support & Resources

### Documentation
- **Chrome Extension**: `public/chrome-extension/README.md`
- **Supabase Functions**: `supabase/functions/README.md`
- **Video Guide**: `public/videos/README.md`
- **Deployment**: `DEPLOYMENT_GUIDE.md`

### Contact
- **Technical Support**: support@interprelab.com
- **Security Issues**: security@interprelab.com
- **HIPAA Compliance**: compliance@interprelab.com

### External Resources
- [Supabase Docs](https://supabase.com/docs)
- [Google Cloud Healthcare](https://cloud.google.com/healthcare-api)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [HIPAA Guidelines](https://www.hhs.gov/hipaa)

---

## 🎯 Success Checklist

Use this checklist to track your progress:

### Setup Phase
- [ ] Development environment configured
- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] VS Code extensions installed

### Database Phase
- [ ] Supabase account created
- [ ] Database migrations applied
- [ ] Edge Functions deployed
- [ ] Secrets configured

### Google Cloud Phase
- [ ] Project created
- [ ] APIs enabled
- [ ] Service account created
- [ ] API key generated
- [ ] BAA signed (for HIPAA)

### Extension Phase
- [ ] Extension loaded in Chrome
- [ ] Configuration verified
- [ ] Speech recognition tested
- [ ] PHI de-identification verified

### Content Phase
- [ ] Video 1 created (LEP Statistics)
- [ ] Video 2 created (Interpreter Stress)
- [ ] Video 3 created (Terminology Gap)
- [ ] Videos optimized and added

### Testing Phase
- [ ] Frontend tested
- [ ] Backend tested
- [ ] Extension tested
- [ ] Performance verified

### Deployment Phase
- [ ] Production build created
- [ ] Application deployed
- [ ] Domain configured
- [ ] HTTPS enabled
- [ ] Extension published

### Monitoring Phase
- [ ] Monitoring tools configured
- [ ] Alerts set up
- [ ] Documentation updated
- [ ] Team trained

---

**🎉 Congratulations!** You've successfully deployed InterpreLab!

**Next Steps**: Monitor performance, gather user feedback, and iterate on features.

**Questions?** Refer to the documentation or contact support.

---

*Last Updated: October 29, 2025*
*Version: 2.0.0*
*Status: Production Ready ✅*
