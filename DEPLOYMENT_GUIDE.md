# Deployment Guide - InterpreLab

## Project Credentials

### Supabase
- **Project**: interprelab-supabase-kiro-db
- **Project URL**: https://iokgkrnbawhizmuejluz.supabase.co
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlva2drcm5iYXdoaXptdWVqbHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2Mjg5ODcsImV4cCI6MjA3NzIwNDk4N30.GTIKRwPUu44PA209OFLj1WaEEGgKwbBaO0iTc7P-UtY`

### Google Cloud
- **Project Name**: interprelab-eco-landing-page
- **Project ID**: interprelab-eco-landing-page

## Quick Deployment Steps

### 1. Deploy Supabase Edge Functions

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref iokgkrnbawhizmuejluz

# Set environment variables
supabase secrets set GOOGLE_CLOUD_API_KEY=your-google-api-key
supabase secrets set GOOGLE_CLOUD_PROJECT_ID=interprelab-eco-landing-page

# Deploy all functions
supabase functions deploy process-interprecoach
supabase functions deploy process-assessment
supabase functions deploy generate-analytics
supabase functions deploy calculate-earnings
supabase functions deploy generate-study-content
```

### 2. Update Frontend Environment Variables

Create/update `.env` file:
```env
VITE_SUPABASE_URL=https://iokgkrnbawhizmuejluz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlva2drcm5iYXdoaXptdWVqbHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2Mjg5ODcsImV4cCI6MjA3NzIwNDk4N30.GTIKRwPUu44PA209OFLj1WaEEGgKwbBaO0iTc7P-UtY
VITE_GOOGLE_CLOUD_PROJECT_ID=interprelab-eco-landing-page
```

### 3. Chrome Extension Configuration

The extension is already configured with your credentials in:
`public/chrome-extension/config.json`

### 4. Run Database Migrations

```bash
# Apply all migrations
supabase db push

# Or apply specific migrations
supabase migration up
```

### 5. Test Deployment

```bash
# Test Edge Functions
curl -i --location --request POST \
  'https://iokgkrnbawhizmuejluz.supabase.co/functions/v1/process-interprecoach' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlva2drcm5iYXdoaXptdWVqbHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2Mjg5ODcsImV4cCI6MjA3NzIwNDk4N30.GTIKRwPUu44PA209OFLj1WaEEGgKwbBaO0iTc7P-UtY' \
  --header 'Content-Type: application/json' \
  --data '{"text":"Patient has hypertension","medications":[],"conversions":[]}'
```

## Google Cloud Setup

### Enable Required APIs

```bash
# Set project
gcloud config set project interprelab-eco-landing-page

# Enable APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable healthcare.googleapis.com
gcloud services enable logging.googleapis.com
```

### Create Service Account

```bash
# Create service account
gcloud iam service-accounts create interprecoach-ai \
    --display-name="InterpreCoach AI Service Account"

# Grant permissions
gcloud projects add-iam-policy-binding interprelab-eco-landing-page \
    --member="serviceAccount:interprecoach-ai@interprelab-eco-landing-page.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

# Create key
gcloud iam service-accounts keys create key.json \
    --iam-account=interprecoach-ai@interprelab-eco-landing-page.iam.gserviceaccount.com
```

### Get API Key

```bash
# Create API key
gcloud alpha services api-keys create \
    --display-name="InterpreCoach API Key" \
    --project=interprelab-eco-landing-page

# List keys to get the key string
gcloud alpha services api-keys list --project=interprelab-eco-landing-page
```

## HIPAA Compliance Setup

### 1. Sign BAA with Google Cloud
- Contact Google Cloud sales
- Request HIPAA BAA
- Complete compliance documentation

### 2. Enable Audit Logging

```bash
# Create audit log sink
gcloud logging sinks create hipaa-audit-logs \
    storage.googleapis.com/interprelab-audit-logs \
    --log-filter='protoPayload.serviceName="aiplatform.googleapis.com"' \
    --project=interprelab-eco-landing-page
```

### 3. Configure VPC Service Controls (Optional but Recommended)

```bash
# Create access policy
gcloud access-context-manager policies create \
    --title="InterpreLab HIPAA Policy" \
    --organization=YOUR_ORG_ID
```

## Monitoring & Logging

### View Function Logs

```bash
# View logs for specific function
supabase functions logs process-interprecoach --tail

# View all function logs
supabase functions logs --tail
```

### Google Cloud Logging

```bash
# View AI API logs
gcloud logging read "resource.type=aiplatform.googleapis.com" \
    --project=interprelab-eco-landing-page \
    --limit=50
```

## Troubleshooting

### Function Deployment Issues

```bash
# Check function status
supabase functions list

# View detailed logs
supabase functions logs function-name --tail

# Redeploy specific function
supabase functions deploy function-name --no-verify-jwt
```

### Database Connection Issues

```bash
# Check database status
supabase db status

# Reset database (WARNING: deletes all data)
supabase db reset

# Apply migrations
supabase migration up
```

### Chrome Extension Issues

1. Check `config.json` has correct credentials
2. Reload extension in Chrome
3. Check browser console for errors
4. Verify CORS is enabled on Supabase

## Security Checklist

- [ ] Supabase RLS policies enabled
- [ ] API keys stored in environment variables (not in code)
- [ ] HTTPS enforced on all endpoints
- [ ] CORS configured properly
- [ ] Google Cloud BAA signed
- [ ] Audit logging enabled
- [ ] PHI de-identification tested
- [ ] Regular security audits scheduled

## Performance Optimization

### Database Indexes

```sql
-- Add indexes for common queries
CREATE INDEX idx_call_logs_user_time ON call_logs(user_id, start_time);
CREATE INDEX idx_assessment_results_user ON assessment_results(user_id);
CREATE INDEX idx_learning_paths_user ON learning_paths(user_id);
```

### Edge Function Optimization

- Functions already optimized with caching
- Queue system prevents overload
- Debouncing reduces API calls
- Local processing for instant feedback

## Backup & Recovery

### Database Backups

```bash
# Manual backup
supabase db dump > backup.sql

# Restore from backup
supabase db reset
psql -h db.iokgkrnbawhizmuejluz.supabase.co -U postgres < backup.sql
```

### Automated Backups

Supabase Pro plan includes:
- Daily automated backups
- Point-in-time recovery
- 7-day retention

## Cost Monitoring

### Supabase Costs
- **Free Tier**: 500MB database, 2GB bandwidth
- **Pro Tier**: $25/month - Recommended for production
- **Team Tier**: $599/month - For larger teams

### Google Cloud Costs
- **Vertex AI**: ~$0.001 per request
- **Storage**: ~$0.02 per GB/month
- **Logging**: ~$0.50 per GB

### Estimated Monthly Costs
- Supabase Pro: $25
- Google Cloud: $100-200 (with AI)
- CDN (optional): $20
- **Total**: ~$145-245/month

## Support Contacts

- **Technical Support**: support@interprelab.com
- **Security Issues**: security@interprelab.com
- **HIPAA Compliance**: compliance@interprelab.com

---

**Last Updated**: October 29, 2025
**Version**: 2.0.0
**Status**: Production Ready ✅
