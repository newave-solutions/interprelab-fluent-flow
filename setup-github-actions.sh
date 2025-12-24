#!/bin/bash

# Setup script for GitHub Actions auto-deployment
# Run this script to create the necessary Google Cloud service account

set -e

PROJECT_ID="interprelab-fluent-flow"
SERVICE_ACCOUNT_NAME="github-actions"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo "🚀 Setting up GitHub Actions auto-deployment for InterpreLab"
echo "============================================================"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK not found. Please install it first."
    exit 1
fi

# Check if authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 > /dev/null; then
    echo "🔐 Please authenticate with Google Cloud first:"
    gcloud auth login
fi

# Set project
echo "🎯 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Create service account
echo "👤 Creating service account..."
if gcloud iam service-accounts describe $SERVICE_ACCOUNT_EMAIL &> /dev/null; then
    echo "✅ Service account already exists"
else
    gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
        --description="Service account for GitHub Actions auto-deployment" \
        --display-name="GitHub Actions"
    echo "✅ Service account created"
fi

# Grant roles
echo "🔑 Granting necessary permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/run.admin" \
    --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/storage.admin" \
    --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/iam.serviceAccountUser" \
    --quiet

echo "✅ Permissions granted"

# Create service account key
echo "🔐 Creating service account key..."
KEY_FILE="github-actions-key.json"

if [ -f "$KEY_FILE" ]; then
    echo "⚠️  Key file already exists. Removing old key..."
    rm "$KEY_FILE"
fi

gcloud iam service-accounts keys create $KEY_FILE \
    --iam-account=$SERVICE_ACCOUNT_EMAIL

echo "✅ Service account key created: $KEY_FILE"

# Display instructions
echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Copy the content of $KEY_FILE:"
echo "   cat $KEY_FILE"
echo ""
echo "2. Go to your GitHub repository settings:"
echo "   https://github.com/YOUR_USERNAME/interprelab-fluent-flow/settings/secrets/actions"
echo ""
echo "3. Add these secrets:"
echo "   - GCP_SA_KEY: (paste the entire content of $KEY_FILE)"
echo "   - VITE_SUPABASE_URL: (Your Supabase URL, e.g., from Supabase Dashboard > Settings > API)"
echo "   - VITE_SUPABASE_ANON_KEY: (Your Supabase Anon Key, from Supabase Dashboard > Settings > API)"
echo ""
echo "4. Commit and push the workflow file:"
echo "   git add .github/workflows/deploy.yml"
echo "   git commit -m 'Add auto-deployment workflow'"
echo "   git push origin main"
echo ""
echo "🚀 After that, every commit to main will automatically deploy to app.interprelab.com!"

# Security reminder
echo ""
echo "🔒 SECURITY REMINDER:"
echo "   - Keep $KEY_FILE secure and don't commit it to git"
echo "   - The key is only needed for the GitHub secret setup"
echo "   - You can delete $KEY_FILE after copying it to GitHub secrets"
