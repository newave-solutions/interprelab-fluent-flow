# Quick Start Guide - Deploy to interprelab.com

## 🚀 Deploy in 5 Minutes

### Prerequisites
- Google Cloud account with project `interprelab-eco-landing-page`
- GitHub repository connected
- gcloud CLI installed (optional)

### Step 1: One-Time Setup (5 minutes)

```bash
# Set project
gcloud config set project interprelab-eco-landing-page

# Enable APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com

# Grant permissions
PROJECT_NUMBER=$(gcloud projects describe interprelab-eco-landing-page --format="value(projectNumber)")
gcloud projects add-iam-policy-binding interprelab-eco-landing-page \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"
gcloud projects add-iam-policy-binding interprelab-eco-landing-page \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

### Step 2: Create Cloud Build Trigger

**Option A: Console (Easiest)**
1. Go to https://console.cloud.google.com/cloud-build/triggers
2. Click "Connect Repository" → GitHub → Select your repo
3. Create trigger:
   - Name: `deploy-to-cloud-run`
   - Branch: `^main$`
   - Configuration: `/cloudbuild.yaml`

**Option B: CLI**
```bash
gcloud beta builds triggers create github \
  --repo-name=interprelab-eco-landing-page \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

### Step 3: Deploy

```bash
# Commit and push
git add .
git commit -m "feat: deploy InterpreLab platform"
git push origin main
```

That's it! Cloud Build will automatically:
1. Build Docker image
2. Push to Container Registry
3. Deploy to Cloud Run

### Step 4: Monitor

```bash
# Watch build
gcloud builds list --limit=5

# Get service URL
gcloud run services describe interprelab-eco-landing-page \
  --region=us-central1 \
  --format="value(status.url)"
```

### Step 5: Configure Domain (Optional)

1. Go to Cloud Run console
2. Select service → "Manage Custom Domains"
3. Add `interprelab.com`
4. Update DNS records at your registrar

## ✅ Verification

Visit your service URL and check:
- [ ] Homepage loads
- [ ] Navigation works
- [ ] InterpreLink accessible at `/interprelink`
- [ ] InterpreStudy accessible at `/interprestudy`
- [ ] All features working

## 🎉 Done!

Your platform is now live with:
- ✅ InterpreBot
- ✅ InterpreCoach
- ✅ InterpreStudy (with flashcards, AI chat, scenarios)
- ✅ InterpreLink (social platform)
- ✅ InterpreTrack
- ✅ Automated deployments

## 📚 More Info

- Full deployment guide: `GOOGLE_CLOUD_DEPLOYMENT.md`
- Deployment checklist: `DEPLOYMENT_CHECKLIST.md`
- Project status: `PROJECT_STATUS.md`
- Implementation details: `IMPLEMENTATION_COMPLETE.md`

## 🆘 Troubleshooting

**Build fails?**
```bash
gcloud builds log BUILD_ID --stream
```

**Service won't start?**
```bash
gcloud run services logs read interprelab-eco-landing-page --region=us-central1
```

**Need help?**
Check `GOOGLE_CLOUD_DEPLOYMENT.md` for detailed troubleshooting.
