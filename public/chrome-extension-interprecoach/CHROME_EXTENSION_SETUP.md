# Chrome Extension Setup Guide

## Overview
This guide will help you set up the InterpreCoach Chrome Extension with Google Medical AI integration.

## Prerequisites
- Chrome browser (latest version)
- Supabase account and project
- Google Cloud Platform account (for Medical AI)
- Node.js and npm (for development)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Note your project URL and anon key

### 1.2 Deploy Edge Functions
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the process-interprecoach function
supabase functions deploy process-interprecoach
```

### 1.3 Set Environment Variables
```bash
# Set Google Cloud credentials
supabase secrets set GOOGLE_CLOUD_API_KEY=your-api-key
supabase secrets set GOOGLE_CLOUD_PROJECT_ID=your-project-id
```

## Step 2: Google Cloud Setup

### 2.1 Enable Required APIs
1. Go to Google Cloud Console
2. Enable these APIs:
   - Vertex AI API
   - Cloud Healthcare API (for HIPAA compliance)
   - Cloud Logging API

### 2.2 Create Service Account
```bash
# Create service account
gcloud iam service-accounts create interprecoach-ai \
    --display-name="InterpreCoach AI Service Account"

# Grant Vertex AI permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:interprecoach-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

# Create and download key
gcloud iam service-accounts keys create key.json \
    --iam-account=interprecoach-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 2.3 HIPAA Compliance
1. Sign Business Associate Agreement (BAA) with Google Cloud
2. Enable audit logging:
   ```bash
   gcloud logging sinks create hipaa-audit-logs \
       storage.googleapis.com/your-audit-bucket \
       --log-filter='protoPayload.serviceName="aiplatform.googleapis.com"'
   ```
3. Configure data residency (if required)
4. Enable VPC Service Controls (recommended)

## Step 3: Chrome Extension Configuration

### 3.1 Configure Extension
1. Navigate to `public/chrome-extension/`
2. Create `config.json` from template:
   ```json
   {
     "supabaseUrl": "https://your-project.supabase.co",
     "supabaseAnonKey": "your-anon-key-here",
     "googleCloudProject": "your-project-id",
     "googleMedicalAIEnabled": true
   }
   ```

### 3.2 Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `public/chrome-extension` directory
5. Extension should appear in toolbar

## Step 4: Testing

### 4.1 Basic Test
1. Click extension icon
2. Click "Activate on Current Page"
3. Click "Start Session"
4. Speak: "Patient has hypertension and takes lisinopril 10mg daily"
5. Verify:
   - Transcript appears
   - Medical terms detected (hypertension)
   - Medications identified (lisinopril)
   - AI insights generated

### 4.2 HIPAA Compliance Test
1. Speak: "Patient John Smith, DOB 01/15/1980, MRN 12345"
2. Verify all PHI is redacted:
   - `[NAMES_REDACTED]`
   - `[DATES_REDACTED]`
   - `[MRN_REDACTED]`

### 4.3 Performance Test
1. Monitor Chrome DevTools Console
2. Check API response times (should be < 2s)
3. Verify cache is working (repeated terms load instantly)
4. Check memory usage (should stay < 50MB)

## Step 5: Production Deployment

### 5.1 Prepare for Production
1. Update version in `manifest.json`
2. Remove debug logging
3. Test thoroughly on multiple sites
4. Create privacy policy
5. Prepare screenshots and promotional materials

### 5.2 Chrome Web Store Submission
1. Create developer account ($5 one-time fee)
2. Prepare store listing:
   - Name: InterpreCoach
   - Description: HIPAA-compliant medical interpretation assistant
   - Category: Productivity
   - Screenshots: 1280x800 or 640x400
   - Promotional images: 440x280
3. Upload ZIP file
4. Submit for review (typically 1-3 days)

### 5.3 Post-Launch
1. Monitor user feedback
2. Track error reports
3. Update regularly
4. Maintain HIPAA compliance documentation

## Troubleshooting

### Extension Not Loading
- Check manifest.json syntax
- Verify all files are present
- Check Chrome console for errors
- Try reloading extension

### API Errors
- Verify Supabase credentials
- Check Edge Function logs
- Ensure Google Cloud APIs are enabled
- Verify service account permissions

### Speech Recognition Issues
- Ensure HTTPS connection
- Check microphone permissions
- Try different browser
- Update Chrome to latest version

### Performance Issues
- Clear extension cache
- Reduce queue size in config
- Check network connectivity
- Monitor Chrome Task Manager

## Security Checklist

- [ ] All PHI patterns are redacted
- [ ] No persistent data storage
- [ ] HTTPS-only connections
- [ ] Google Cloud BAA signed
- [ ] Audit logging enabled
- [ ] Regular security audits scheduled
- [ ] Incident response plan documented
- [ ] User training materials prepared

## Monitoring

### Key Metrics to Track
1. **Usage Metrics**
   - Active users
   - Sessions per day
   - Average session duration

2. **Performance Metrics**
   - API response times
   - Cache hit rate
   - Error rates

3. **Compliance Metrics**
   - PHI redaction success rate
   - Audit log completeness
   - Security incidents

### Logging
```javascript
// Enable detailed logging (development only)
localStorage.setItem('interprecoach_debug', 'true');

// View logs
chrome.storage.local.get(['logs'], (result) => {
  console.log(result.logs);
});
```

## Support

### Documentation
- Extension README: `public/chrome-extension/README.md`
- Video Guide: `public/videos/README.md`
- API Documentation: Supabase dashboard

### Contact
- Technical Support: support@interprelab.com
- Security Issues: security@interprelab.com
- HIPAA Compliance: compliance@interprelab.com

## Updates

### Version History
- **v2.0.0** - Google Medical AI integration, optimized performance
- **v1.0.0** - Initial release with basic features

### Planned Features
- Multi-language support
- Offline mode
- Custom terminology databases
- EHR integration
- Team collaboration

## Legal

### Compliance
- HIPAA compliant when properly configured
- Requires BAA with Google Cloud
- Regular security audits required
- User consent required for data processing

### Privacy
- No PHI stored persistently
- All data de-identified before transmission
- Session data cleared on exit
- Audit logs maintained for compliance

### Terms of Use
Users must:
- Have proper authorization to access medical information
- Follow organizational policies
- Report security incidents immediately
- Complete required training

## Resources

### Documentation
- [Google Cloud Healthcare API](https://cloud.google.com/healthcare-api)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Chrome Extension Development](https://developer.chrome.com/docs/extensions/)

### Training
- HIPAA Compliance Training
- Extension Usage Guide
- Security Best Practices
- Incident Response Procedures

---

**Last Updated**: October 29, 2025
**Version**: 2.0.0
**Maintained By**: InterpreLab Development Team
