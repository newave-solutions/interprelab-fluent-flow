# Google Cloud LLM Integration Setup Guide

This guide will help you set up Google Cloud's Gemini API for AI-powered content generation in InterpreStudy.

## Prerequisites

- Google Cloud Platform account
- Supabase project set up
- InterpreLab project configured

## Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Sign in with your Google account

2. **Create a New Project**
   - Click "Select a project" dropdown at the top
   - Click "New Project"
   - Enter project details:
     - **Project name**: `interprelab-ai` (or your preferred name)
     - **Organization**: Select your organization (if applicable)
   - Click "Create"

3. **Select Your Project**
   - Make sure your new project is selected in the project dropdown

## Step 2: Enable Gemini API

1. **Navigate to APIs & Services**
   - In the Google Cloud Console, go to "APIs & Services" > "Library"
   - Or use this direct link: [console.cloud.google.com/apis/library](https://console.cloud.google.com/apis/library)

2. **Search for Generative AI APIs**
   - Search for "Generative Language API" or "Gemini API"
   - Click on "Generative Language API"

3. **Enable the API**
   - Click "Enable" button
   - Wait for the API to be enabled (this may take a few minutes)

## Step 3: Create API Credentials

1. **Go to Credentials**
   - Navigate to "APIs & Services" > "Credentials"
   - Or use this link: [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)

2. **Create API Key**
   - Click "Create Credentials" > "API Key"
   - A new API key will be generated
   - **IMPORTANT**: Copy this key immediately and store it securely

3. **Restrict the API Key (Recommended)**
   - Click on the newly created API key to edit it
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose "Generative Language API"
   - Under "Application restrictions" (optional but recommended):
     - Select "HTTP referrers" for web applications
     - Add your domain(s): `https://yourdomain.com/*`
   - Click "Save"

## Step 4: Set Up Billing (Required)

⚠️ **Important**: Google Cloud requires billing to be enabled for API usage, even for free tier usage.

1. **Enable Billing**
   - Go to "Billing" in the Google Cloud Console
   - Link a payment method (credit card or bank account)
   - Don't worry - Gemini API has generous free tier limits

2. **Free Tier Limits** (as of 2024):
   - **Gemini Pro**: 60 requests per minute, 1,500 requests per day
   - **Rate limits**: 32,000 characters per minute
   - **Free quota**: First 1 million characters per month

## Step 5: Configure Environment Variables

Add your Google Cloud API key to your environment variables:

### For Development (.env file)
```env
# Add this to your .env file
GOOGLE_CLOUD_API_KEY=your_api_key_here
```

### For Supabase Edge Functions
You need to add the API key to your Supabase project secrets:

1. **Using Supabase CLI**:
   ```bash
   supabase secrets set GOOGLE_CLOUD_API_KEY=your_api_key_here
   ```

2. **Using Supabase Dashboard**:
   - Go to your Supabase project dashboard
   - Navigate to "Settings" > "Edge Functions"
   - Add a new secret:
     - **Name**: `GOOGLE_CLOUD_API_KEY`
     - **Value**: Your API key

### For Production Deployment
Add the environment variable to your production hosting platform:

- **Vercel**: Add to Environment Variables in project settings
- **Netlify**: Add to Environment Variables in site settings
- **Railway**: Add to Variables in project settings
- **Heroku**: Add to Config Vars in app settings

## Step 6: Test the Integration

1. **Deploy the Edge Function**
   ```bash
   supabase functions deploy generate-study-content
   ```

2. **Test API Call**
   ```bash
   curl -X POST 'https://your-project.supabase.co/functions/v1/generate-study-content' \
     -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
     -H 'Content-Type: application/json' \
     -d '{
       "userId": "test-user-id",
       "contentType": "flashcards",
       "prompt": "Create 5 medical terminology flashcards for Spanish-English interpretation",
       "parameters": {
         "category": "medical",
         "difficulty": "intermediate",
         "sourceLanguage": "es",
         "targetLanguage": "en",
         "flashcardCount": 5
       }
     }'
   ```

## Step 7: Monitor Usage and Costs

1. **Monitor API Usage**
   - Go to "APIs & Services" > "Dashboard"
   - View usage statistics for Generative Language API

2. **Set Up Billing Alerts**
   - Go to "Billing" > "Budgets & alerts"
   - Create a budget alert (e.g., $10/month)
   - Set up email notifications

3. **Monitor Quotas**
   - Go to "APIs & Services" > "Quotas"
   - Monitor your API quotas and usage

## API Usage Guidelines

### Rate Limits
- **Requests per minute**: 60 (free tier)
- **Characters per minute**: 32,000
- **Daily requests**: 1,500

### Best Practices
1. **Implement caching** to avoid duplicate requests
2. **Use appropriate timeouts** (30-60 seconds)
3. **Handle rate limiting** with exponential backoff
4. **Monitor token usage** to stay within limits
5. **Implement error handling** for API failures

### Cost Optimization
1. **Cache generated content** in your database
2. **Batch requests** when possible
3. **Use appropriate model sizes** (Gemini Pro vs Gemini Pro Vision)
4. **Implement user limits** to prevent abuse
5. **Monitor usage patterns** and optimize accordingly

## Security Best Practices

### API Key Security
1. **Never commit API keys** to version control
2. **Use environment variables** for all deployments
3. **Rotate keys regularly** (every 90 days recommended)
4. **Restrict API key usage** to specific APIs and domains
5. **Monitor API key usage** for suspicious activity

### Content Filtering
1. **Implement input validation** to prevent malicious prompts
2. **Use safety settings** in API calls
3. **Filter generated content** before storing
4. **Log all requests** for audit purposes
5. **Implement rate limiting** per user

## Troubleshooting

### Common Issues

1. **"API Key not valid" Error**
   - Verify the API key is correct
   - Check if the Generative Language API is enabled
   - Ensure billing is enabled on your Google Cloud project

2. **"Quota exceeded" Error**
   - Check your API quotas in Google Cloud Console
   - Wait for quota reset (usually daily)
   - Consider upgrading to paid tier for higher limits

3. **"Permission denied" Error**
   - Verify API key restrictions
   - Check if the API is enabled
   - Ensure proper authentication headers

4. **Slow Response Times**
   - Check your internet connection
   - Verify API endpoint is correct
   - Consider implementing timeout handling

### Getting Help

1. **Google Cloud Support**
   - [Google Cloud Support](https://cloud.google.com/support)
   - [Generative AI Documentation](https://cloud.google.com/ai/generative-ai)

2. **Community Resources**
   - [Google Cloud Community](https://www.googlecloudcommunity.com/)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/google-cloud-platform)

## Example Usage in InterpreStudy

Once set up, you can use the AI content generation in your InterpreStudy application:

```typescript
import { useInterpreStudy } from '../hooks/useInterpreStudy';

const { generateContent } = useInterpreStudy();

// Generate flashcards
const createFlashcards = async () => {
  const { data, error } = await generateContent(
    'flashcards',
    'Create medical terminology flashcards for cardiology',
    {
      category: 'medical',
      difficulty: 'intermediate',
      sourceLanguage: 'en',
      targetLanguage: 'es',
      flashcardCount: 10
    }
  );

  if (data && !error) {
    console.log('Generated flashcards:', data.content);
  }
};

// Generate learning path
const createLearningPath = async () => {
  const { data, error } = await generateContent(
    'learning_path',
    'Create a learning path for legal interpretation basics',
    {
      category: 'legal',
      difficulty: 'beginner',
      languagePair: 'en-es',
      lessonCount: 8
    }
  );

  if (data && !error) {
    console.log('Generated learning path:', data.content);
  }
};
```

## Cost Estimation

### Free Tier (Monthly)
- **Characters**: 1,000,000 free
- **Typical usage**:
  - 1 flashcard = ~200 characters
  - 1 lesson = ~2,000 characters
  - 1 learning path = ~5,000 characters

### Paid Tier (After free tier)
- **Input**: $0.00025 per 1K characters
- **Output**: $0.0005 per 1K characters
- **Example**: 100,000 characters = ~$0.075

Your InterpreStudy integration is now ready to use Google Cloud's powerful Gemini AI for generating educational content!
