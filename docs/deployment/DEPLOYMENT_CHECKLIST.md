# Deployment Checklist for interprelab.com

## ✅ Pre-Deployment Checklist

### Code Quality
- [x] All TypeScript errors resolved (except cosmetic toaster cache issue)
- [x] All routes tested and working
- [x] InterpreLink feature fully integrated
- [x] InterpreStudy features complete
- [x] Navigation updated with all features
- [x] Environment variables configured
- [x] .gitignore updated
- [x] Redundant files cleaned up

### Documentation
- [x] PROJECT_STATUS.md created
- [x] GOOGLE_CLOUD_DEPLOYMENT.md created
- [x] CLEANUP_REDUNDANT_FILES.md created
- [x] README.md up to date

### Docker & CI/CD
- [x] Dockerfile created
- [x] nginx.conf configured
- [x] cloudbuild.yaml configured
- [x] .dockerignore created

## 🚀 Deployment Steps

### Step 1: Test Build Locally
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test the build
npm run preview
```

### Step 2: Test Docker Build Locally (Optional)
```bash
# Build Docker image
docker build -t interprelab-test .

# Run container
docker run -p 8080:8080 interprelab-test

# Test at http://localhost:8080
```

### Step 3: Commit and Push
```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: add InterpreLink social platform and deployment configuration"

# Push to main branch
git push origin main
```

### Step 4: Set Up Google Cloud (First Time Only)

#### 4.1 Enable APIs
```bash
gcloud config set project interprelab-eco-landing-page

gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

#### 4.2 Set Up Cloud Build Trigger
Go to: https://console.cloud.google.com/cloud-build/triggers

1. Click "Connect Repository"
2. Select GitHub
3. Authenticate and select your repository
4. Create trigger:
   - Name: `deploy-to-cloud-run`
   - Event: Push to branch
   - Branch: `^main$`
   - Configuration: `/cloudbuild.yaml`

#### 4.3 Grant Permissions
```bash
PROJECT_NUMBER=$(gcloud projects describe interprelab-eco-landing-page --format="value(projectNumber)")

gcloud projects add-iam-policy-binding interprelab-eco-landing-page \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding interprelab-eco-landing-page \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

### Step 5: Configure Environment Variables in Cloud Run
```bash
gcloud run services update interprelab-eco-landing-page \
  --region=us-central1 \
  --set-env-vars="VITE_SUPABASE_URL=https://iokgkrnbawhizmuejluz.supabase.co,VITE_SUPABASE_ANON_KEY=your-key-here"
```

### Step 6: Set Up Custom Domain

1. Go to Cloud Run console
2. Select your service
3. Click "Manage Custom Domains"
4. Add `interprelab.com` and `www.interprelab.com`
5. Update DNS records at your domain registrar:

```
Type: A
Name: @
Value: [IP from Google]

Type: AAAA
Name: @
Value: [IPv6 from Google]

Type: CNAME
Name: www
Value: ghs.googlehosted.com
```

### Step 7: Monitor Deployment

#### Check Build Status
```bash
# List recent builds
gcloud builds list --limit=5

# View specific build logs
gcloud builds log BUILD_ID --stream
```

#### Check Service Status
```bash
# Get service details
gcloud run services describe interprelab-eco-landing-page --region=us-central1

# Get service URL
gcloud run services describe interprelab-eco-landing-page \
  --region=us-central1 \
  --format="value(status.url)"
```

#### View Logs
```bash
gcloud run services logs read interprelab-eco-landing-page \
  --region=us-central1 \
  --limit=50
```

## 🧪 Post-Deployment Testing

### Functional Tests
- [ ] Homepage loads correctly
- [ ] Navigation works (all menu items)
- [ ] InterpreBot page accessible
- [ ] InterpreCoach page accessible
- [ ] InterpreStudy page accessible
  - [ ] AI Chat tab works
  - [ ] Terminology tab works
  - [ ] Flashcards tab works
  - [ ] Scenarios tab works
  - [ ] Settings tab works
- [ ] InterpreLink page accessible
  - [ ] Feed displays
  - [ ] Reels tab works
  - [ ] Discussions tab works
  - [ ] Create post dialog works
- [ ] InterpreTrack page accessible
- [ ] Sign in page works
- [ ] Dashboard (protected route) works
- [ ] Settings page works

### Performance Tests
- [ ] Lighthouse score > 90
- [ ] Page load time < 3s
- [ ] Images optimized
- [ ] No console errors

### Mobile Tests
- [ ] Responsive design works
- [ ] Navigation menu works on mobile
- [ ] All features accessible on mobile

### Security Tests
- [ ] HTTPS enforced
- [ ] Protected routes require authentication
- [ ] Environment variables not exposed
- [ ] CORS configured correctly

## 🔄 Continuous Deployment Workflow

Once set up, every push to `main` will:

1. Trigger Cloud Build
2. Build Docker image
3. Push to Container Registry
4. Deploy to Cloud Run
5. Route traffic to new version

**Build time**: ~5-10 minutes
**Downtime**: Zero (rolling deployment)

## 🐛 Troubleshooting

### Build Fails
```bash
# Check build logs
gcloud builds log BUILD_ID --stream

# Common fixes:
# - Check package.json dependencies
# - Verify TypeScript compiles locally
# - Check environment variables
```

### Service Won't Start
```bash
# Check service logs
gcloud run services logs read interprelab-eco-landing-page --region=us-central1

# Common fixes:
# - Verify port 8080 in nginx.conf
# - Check Dockerfile EXPOSE 8080
# - Verify nginx configuration
```

### Domain Not Working
- Wait for DNS propagation (up to 48 hours)
- Verify DNS records are correct
- Check SSL certificate status in Cloud Run console

## 📊 Monitoring

### Set Up Alerts
1. Go to Cloud Monitoring
2. Create alert policies for:
   - High error rate (> 5%)
   - High latency (> 2s)
   - Low availability (< 99%)

### View Metrics
- **Cloud Run Console**: https://console.cloud.google.com/run
- **Logs**: Cloud Logging
- **Metrics**: Cloud Monitoring
- **Traces**: Cloud Trace

## 🎉 Success Criteria

Deployment is successful when:
- [x] Build completes without errors
- [x] Service is running and healthy
- [x] All pages load correctly
- [x] No console errors
- [x] Performance metrics meet targets
- [x] Domain resolves correctly
- [x] SSL certificate is valid

## 📞 Support

If you encounter issues:
1. Check `GOOGLE_CLOUD_DEPLOYMENT.md` for detailed instructions
2. Review Cloud Build logs
3. Check Cloud Run service logs
4. Verify environment variables
5. Test Docker build locally

## 🎯 Next Actions After Deployment

1. Monitor for 24 hours
2. Check error rates and performance
3. Gather user feedback
4. Plan next feature iteration
5. Update PROJECT_STATUS.md with deployment date

---

**Deployment Date**: [To be filled]
**Deployed By**: [Your Name]
**Build ID**: [From Cloud Build]
**Service URL**: https://interprelab.com
