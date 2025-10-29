# Google Cloud Run Deployment Guide

## Overview
This guide will help you set up continuous deployment from this GitHub repository to Google Cloud Run for interprelab.com.

## Prerequisites
- Google Cloud Project: `interprelab-eco-landing-page`
- Domain: `interprelab.com`
- GitHub repository with this code
- Google Cloud SDK installed locally (optional, for manual deployments)

## Step 1: Enable Required APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## Step 2: Set Up Cloud Build Trigger

### Option A: Using Google Cloud Console (Recommended)

1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Click "Connect Repository"
3. Select "GitHub" and authenticate
4. Choose your repository: `interprelab-eco-landing-page`
5. Create a trigger with these settings:
   - **Name**: `deploy-to-cloud-run`
   - **Event**: Push to a branch
   - **Branch**: `^main$` (or your production branch)
   - **Configuration**: Cloud Build configuration file (yaml or json)
   - **Location**: `/cloudbuild.yaml`
   - **Service account**: Use default or create a custom one

### Option B: Using gcloud CLI

```bash
# Set your project
gcloud config set project interprelab-eco-landing-page

# Create the trigger
gcloud beta builds triggers create github \
  --repo-name=interprelab-eco-landing-page \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml \
  --description="Deploy to Cloud Run on push to main"
```

## Step 3: Grant Permissions to Cloud Build

```bash
# Get your project number
PROJECT_NUMBER=$(gcloud projects describe interprelab-eco-landing-page --format="value(projectNumber)")

# Grant Cloud Run Admin role
gcloud projects add-iam-policy-binding interprelab-eco-landing-page \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

# Grant Service Account User role
gcloud projects add-iam-policy-binding interprelab-eco-landing-page \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

## Step 4: Configure Environment Variables (Optional)

If you need to add environment variables to your Cloud Run service:

```bash
gcloud run services update interprelab-eco-landing-page \
  --region=us-central1 \
  --set-env-vars="VITE_SUPABASE_URL=your-url,VITE_SUPABASE_ANON_KEY=your-key"
```

Or add them in the `cloudbuild.yaml` file under the deploy step.

## Step 5: Set Up Custom Domain

1. Go to [Cloud Run](https://console.cloud.google.com/run)
2. Click on your service: `interprelab-eco-landing-page`
3. Go to "Manage Custom Domains"
4. Click "Add Mapping"
5. Select your service
6. Enter domain: `interprelab.com` and `www.interprelab.com`
7. Follow the DNS configuration instructions
8. Add the provided DNS records to your domain registrar

### DNS Records Example
```
Type: A
Name: @
Value: [IP provided by Google]

Type: AAAA
Name: @
Value: [IPv6 provided by Google]

Type: CNAME
Name: www
Value: ghs.googlehosted.com
```

## Step 6: Test the Deployment

### Manual Trigger (First Time)
```bash
# Trigger a build manually
gcloud builds submit --config=cloudbuild.yaml

# Or push to your main branch
git add .
git commit -m "Initial deployment setup"
git push origin main
```

### Check Build Status
```bash
# List recent builds
gcloud builds list --limit=5

# View logs for a specific build
gcloud builds log BUILD_ID
```

### Check Service Status
```bash
# Get service details
gcloud run services describe interprelab-eco-landing-page --region=us-central1

# Get service URL
gcloud run services describe interprelab-eco-landing-page \
  --region=us-central1 \
  --format="value(status.url)"
```

## Step 7: Monitor and Manage

### View Logs
```bash
# View Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=interprelab-eco-landing-page" \
  --limit=50 \
  --format=json
```

### Update Service Configuration
```bash
# Update memory
gcloud run services update interprelab-eco-landing-page \
  --region=us-central1 \
  --memory=1Gi

# Update CPU
gcloud run services update interprelab-eco-landing-page \
  --region=us-central1 \
  --cpu=2

# Update max instances
gcloud run services update interprelab-eco-landing-page \
  --region=us-central1 \
  --max-instances=20
```

## Continuous Deployment Workflow

Once set up, the deployment workflow is automatic:

1. **Developer pushes code** to `main` branch
2. **Cloud Build trigger** detects the push
3. **Build process** starts:
   - Builds Docker image
   - Pushes to Container Registry
   - Deploys to Cloud Run
4. **New version** goes live automatically
5. **Old version** is kept for rollback

## Rollback Procedure

If you need to rollback to a previous version:

```bash
# List revisions
gcloud run revisions list --service=interprelab-eco-landing-page --region=us-central1

# Rollback to a specific revision
gcloud run services update-traffic interprelab-eco-landing-page \
  --region=us-central1 \
  --to-revisions=REVISION_NAME=100
```

## Cost Optimization

Current configuration:
- **Memory**: 512Mi (adjust based on needs)
- **CPU**: 1 (sufficient for most traffic)
- **Min instances**: 0 (scales to zero when idle)
- **Max instances**: 10 (prevents runaway costs)

### Estimated Costs
- **Free tier**: 2 million requests/month
- **After free tier**: ~$0.40 per million requests
- **Idle time**: Free (scales to zero)

## Troubleshooting

### Build Fails
```bash
# Check build logs
gcloud builds log BUILD_ID --stream

# Common issues:
# - Missing dependencies in package.json
# - Build errors in TypeScript
# - Environment variables not set
```

### Service Won't Start
```bash
# Check service logs
gcloud run services logs read interprelab-eco-landing-page --region=us-central1

# Common issues:
# - Port mismatch (must be 8080)
# - nginx configuration errors
# - Missing files in dist/
```

### Domain Not Working
- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check SSL certificate status in Cloud Run console

## Security Best Practices

1. **Never commit secrets** to the repository
2. **Use Secret Manager** for sensitive data:
   ```bash
   gcloud secrets create SUPABASE_KEY --data-file=-
   ```
3. **Enable Cloud Armor** for DDoS protection
4. **Set up Cloud CDN** for better performance
5. **Use IAM** for access control

## Performance Optimization

1. **Enable CDN**:
   ```bash
   gcloud compute backend-services update BACKEND_SERVICE \
     --enable-cdn
   ```

2. **Configure caching** in nginx.conf (already done)

3. **Monitor performance**:
   - Use Cloud Monitoring
   - Set up alerts for high latency
   - Monitor error rates

## Support

For issues:
1. Check [Cloud Run documentation](https://cloud.google.com/run/docs)
2. View [Cloud Build logs](https://console.cloud.google.com/cloud-build/builds)
3. Contact Google Cloud Support

## Quick Reference Commands

```bash
# Deploy manually
gcloud builds submit --config=cloudbuild.yaml

# View service
gcloud run services describe interprelab-eco-landing-page --region=us-central1

# View logs
gcloud run services logs read interprelab-eco-landing-page --region=us-central1 --limit=50

# Update service
gcloud run services update interprelab-eco-landing-page --region=us-central1 [OPTIONS]

# Delete service (careful!)
gcloud run services delete interprelab-eco-landing-page --region=us-central1
```
