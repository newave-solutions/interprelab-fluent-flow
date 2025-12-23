# Supabase CLI Installation Script for Windows
# This script downloads and installs the Supabase CLI

$installDir = "$env:USERPROFILE\.supabase"
$zipPath = "$env:TEMP\supabase.zip"
$downloadUrl = "https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.zip"

Write-Host "Downloading Supabase CLI..." -ForegroundColor Green
Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath

Write-Host "Extracting files..." -ForegroundColor Yellow
if (Test-Path $installDir) {
    Remove-Item -Path $installDir -Recurse -Force
}
Expand-Archive -Path $zipPath -DestinationPath $installDir -Force

Write-Host "Cleaning up..." -ForegroundColor Cyan
Remove-Item $zipPath

Write-Host "Adding to PATH..." -ForegroundColor Magenta
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$installDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$installDir", "User")
    $env:Path += ";$installDir"
}

Write-Host "`nInstallation complete!" -ForegroundColor Green
Write-Host "Please restart your terminal or run: " -ForegroundColor Yellow
Write-Host "`$env:Path += ';$installDir'" -ForegroundColor Cyan
Write-Host "`nThen verify with: supabase --version" -ForegroundColor Yellow
