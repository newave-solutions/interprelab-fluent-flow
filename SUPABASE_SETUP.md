# Supabase Setup Guide for InterpreLab

This guide will help you set up Supabase for the InterpreLab project with complete database schema, edge functions, and authentication.

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier available)
- Supabase CLI installed (recommended)

## Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

## Step 2: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `interprelab-production` (or your preferred name)
   - Database Password: Generate a strong password (save this!)
   - Region: Choose closest to your users

## Step 3: Get Your Project Credentials

1. Go to your project dashboard
2. Click on "Settings" → "API"
3. Copy the following values:
   - Project URL
   - Project Reference ID
   - Anon (public) key
   - Service role key (keep this secret!)

## Step 4: Set Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

## Step 5: Initialize and Link Supabase

1. Initialize Supabase in your project:
   ```bash
   supabase init
   ```

2. Link to your remote project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Pull the current schema (if any):
   ```bash
   supabase db pull
   ```

## Step 6: Run Database Migrations

### Option A: Using Supabase CLI (Recommended)

1. Push the migration to create all tables:
   ```bash
   supabase db push
   ```

2. Run the additional setup script:
   ```bash
   supabase db reset
   ```

### Option B: Manual Setup via Dashboard

1. Go to your Supabase dashboard
2. Click on "SQL Editor"
3. Copy and paste the contents of `supabase/migrations/20241028000001_initial_schema.sql`
4. Click "Run" to execute the migration
5. Then copy and paste the contents of `supabase/setup.sql`
6. Click "Run" to execute the additional setup

## Step 7: Deploy Edge Functions

Deploy all edge functions to your Supabase project:

```bash
# Deploy calculate earnings function
supabase functions deploy calculate-earnings

# Deploy analytics function
supabase functions deploy generate-analytics

# Deploy assessment processing function
supabase functions deploy process-assessment
```

## Step 8: Configure Authentication

1. In your Supabase dashboard, go to "Authentication" → "Settings"
2. Configure the following:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add your production domain when ready
   - **Enable email confirmations**: Optional (recommended for production)
   - **Enable phone confirmations**: Optional

3. Configure email templates (optional):
   - Go to "Authentication" → "Email Templates"
   - Customize signup, reset password, and other email templates

## Step 9: Set Up Row Level Security Policies

The migration automatically sets up RLS policies, but verify they're working:

1. Go to "Authentication" → "Policies"
2. Verify that all tables have appropriate policies
3. Test with a test user account

## Step 10: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the InterpreTrack page
3. Try signing up for a new account
4. Test the call tracking functionality
5. Check that data is being saved in Supabase

## Database Schema Overview

The setup creates the following tables:

### Core Tables
- **profiles**: User profile information (extends auth.users)
- **user_roles**: Role-based access control
- **user_settings**: User preferences, pay rates, currencies
- **call_logs**: Complete call tracking with earnings calculation

### Feature Tables
- **assessment_results**: InterpreBot assessment storage
- **glossary_terms**: Personal and public terminology database
- **study_sessions**: Learning progress tracking
- **coaching_sessions**: InterpreCoach session data
- **user_achievements**: Gamification and progress tracking

### Views and Functions
- **user_stats**: Aggregated user statistics view
- **public_glossary**: Public terminology access
- **get_user_dashboard_stats()**: Comprehensive user analytics
- **search_glossary_terms()**: Advanced term search with ranking

## Edge Functions

### 1. Calculate Earnings (`calculate-earnings`)
- Automatically calculates call earnings based on user settings
- Handles different pay rate types (per hour/per minute)
- Updates call logs with accurate earnings

### 2. Generate Analytics (`generate-analytics`)
- Comprehensive analytics generation
- Supports different time periods (day, week, month, year)
- Provides trend analysis and insights

### 3. Process Assessment (`process-assessment`)
- Handles InterpreBot assessment submissions
- Calculates scores and provides detailed feedback
- Awards achievements based on performance

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- **User-specific data access** - users can only see their own data
- **Public glossary access** for shared terminology
- **Secure authentication** with JWT tokens
- **Protected API endpoints** with proper authorization

## Production Deployment

When deploying to production:

1. **Update environment variables** with production Supabase credentials
2. **Update authentication settings**:
   - Set production site URL
   - Add production redirect URLs
   - Enable email confirmations
3. **Set up monitoring**:
   - Enable Supabase monitoring
   - Set up log alerts
   - Monitor database performance
4. **Backup strategy**:
   - Enable automated backups
   - Test restore procedures
5. **Performance optimization**:
   - Monitor query performance
   - Add additional indexes if needed
   - Consider upgrading Supabase plan for higher usage

## Troubleshooting

### Common Issues

1. **Environment variables not loading**:
   - Ensure `.env` file is in the root directory
   - Restart development server after adding variables
   - Check that variable names match exactly

2. **Database connection errors**:
   - Verify Supabase URL and keys are correct
   - Check if your Supabase project is active
   - Ensure you're using the correct project reference

3. **RLS policy errors**:
   - Make sure users are authenticated before accessing data
   - Check that RLS policies are properly set up
   - Verify user IDs match between auth.users and your tables

4. **Migration errors**:
   - Ensure you have the correct permissions
   - Try running migrations one at a time
   - Check for syntax errors in SQL files

5. **Edge function deployment issues**:
   - Ensure Supabase CLI is properly authenticated
   - Check function syntax and imports
   - Verify CORS settings for frontend access

### Performance Issues

1. **Slow queries**:
   - Check query execution plans in Supabase dashboard
   - Add indexes for frequently queried columns
   - Consider using materialized views for complex analytics

2. **High database usage**:
   - Monitor active connections
   - Optimize queries to reduce database load
   - Consider connection pooling for high-traffic applications

## Support and Resources

- **Supabase Documentation**: [https://supabase.com/docs](https://supabase.com/docs)
- **Supabase Community**: [https://github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- **InterpreLab Issues**: Check the project repository for specific integration issues

## Development Workflow

1. **Local Development**:
   ```bash
   # Start local Supabase (optional)
   supabase start

   # Make schema changes
   supabase db diff -f new_migration_name

   # Test changes locally
   supabase db reset

   # Push to remote when ready
   supabase db push
   ```

2. **Adding New Features**:
   - Create migration files for schema changes
   - Update TypeScript types
   - Add corresponding service methods
   - Test with real data
   - Deploy edge functions if needed

3. **Monitoring**:
   - Check Supabase dashboard regularly
   - Monitor API usage and performance
   - Review logs for errors or issues
   - Update security policies as needed

This setup provides a robust, scalable backend for the InterpreLab platform with all the features needed for professional interpretation tracking and management.
