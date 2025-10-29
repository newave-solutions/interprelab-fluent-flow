# Supabase Setup Script for Windows PowerShell
# Run this script after creating your Supabase project

Write-Host "🚀 InterpreLab Supabase Setup Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file first." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ .env file found" -ForegroundColor Green
Write-Host ""

# Prompt for Supabase credentials
Write-Host "📝 Please enter your Supabase credentials:" -ForegroundColor Yellow
Write-Host "(Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api)" -ForegroundColor Gray
Write-Host ""

$projectRef = Read-Host "Enter your Supabase Project Reference ID"
$projectUrl = Read-Host "Enter your Supabase Project URL (e.g., https://xxxxx.supabase.co)"
$anonKey = Read-Host "Enter your Supabase Anon Key"
$serviceRoleKey = Read-Host "Enter your Supabase Service Role Key (will be hidden)" -AsSecureString

# Convert secure string to plain text
$serviceRoleKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($serviceRoleKey)
)

Write-Host ""
Write-Host "📝 Updating .env file..." -ForegroundColor Yellow

# Read current .env content
$envContent = Get-Content ".env" -Raw

# Update or add Supabase variables
if ($envContent -match "VITE_SUPABASE_URL=") {
    $envContent = $envContent -replace "VITE_SUPABASE_URL=.*", "VITE_SUPABASE_URL=$projectUrl"
} else {
    $envContent += "`nVITE_SUPABASE_URL=$projectUrl"
}

if ($envContent -match "VITE_SUPABASE_ANON_KEY=") {
    $envContent = $envContent -replace "VITE_SUPABASE_ANON_KEY=.*", "VITE_SUPABASE_ANON_KEY=$anonKey"
} else {
    $envContent += "`nVITE_SUPABASE_ANON_KEY=$anonKey"
}

if ($envContent -match "SUPABASE_SERVICE_ROLE_KEY=") {
    $envContent = $envContent -replace "SUPABASE_SERVICE_ROLE_KEY=.*", "SUPABASE_SERVICE_ROLE_KEY=$serviceRoleKeyPlain"
} else {
    $envContent += "`nSUPABASE_SERVICE_ROLE_KEY=$serviceRoleKeyPlain"
}

# Save updated .env
Set-Content ".env" $envContent

Write-Host "✅ .env file updated" -ForegroundColor Green
Write-Host ""

# Login to Supabase
Write-Host "🔐 Logging in to Supabase..." -ForegroundColor Yellow
npx supabase login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Login failed. Please try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Logged in successfully" -ForegroundColor Green
Write-Host ""

# Link project
Write-Host "🔗 Linking to Supabase project..." -ForegroundColor Yellow
npx supabase link --project-ref $projectRef

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to link project. Please check your project ref." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project linked successfully" -ForegroundColor Green
Write-Host ""

# Push database schema
Write-Host "📊 Pushing database schema..." -ForegroundColor Yellow
npx supabase db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push database schema." -ForegroundColor Red
    Write-Host "Try running: npx supabase db push --debug" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Database schema pushed successfully" -ForegroundColor Green
Write-Host ""

# Set Google Cloud API key
Write-Host "🔑 Setting Google Cloud API key..." -ForegroundColor Yellow
$googleApiKey = (Get-Content ".env" | Select-String "GOOGLE_API_KEY").ToString().Split("=")[1].Trim('"')

if ($googleApiKey) {
    npx supabase secrets set GOOGLE_CLOUD_API_KEY=$googleApiKey
    Write-Host "✅ Google Cloud API key set" -ForegroundColor Green
} else {
    Write-Host "⚠️  Google API key not found in .env" -ForegroundColor Yellow
}

Write-Host ""

# Deploy Edge Functions
Write-Host "🚀 Deploying Edge Functions..." -ForegroundColor Yellow
Write-Host ""

$functions = @(
    "generate-study-content",
    "process-assessment",
    "generate-analytics",
    "calculate-earnings"
)

foreach ($func in $functions) {
    Write-Host "  Deploying $func..." -ForegroundColor Cyan
    npx supabase functions deploy $func

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ $func deployed" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  $func deployment failed" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Verification:" -ForegroundColor Yellow
Write-Host "  Run these commands to verify:" -ForegroundColor Gray
Write-Host "  - npx supabase projects list" -ForegroundColor Gray
Write-Host "  - npx supabase secrets list" -ForegroundColor Gray
Write-Host "  - npx supabase functions list" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Start your app:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
