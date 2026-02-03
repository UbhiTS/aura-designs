# Aura Designs - Google Cloud Deployment Script
# 
# This script reads configuration from your .env file automatically.
# You can also override values with environment variables:
#   $env:GCP_PROJECT_ID = "your-project-id"
#   $env:DB_PASSWORD = "your_secure_password"
#   $env:NEXTAUTH_SECRET = "your_32_char_secret"
#   $env:GOOGLE_CLIENT_ID = "your_google_client_id"
#   $env:GOOGLE_CLIENT_SECRET = "your_google_client_secret"
#   $env:ADMIN_EMAILS = "admin1@gmail.com,admin2@gmail.com"

# Function to load .env file into PowerShell environment
function Load-EnvFile {
    $envFile = Join-Path $PSScriptRoot ".env"
    if (Test-Path $envFile) {
        Write-Host "Loading configuration from .env file..." -ForegroundColor Gray
        Get-Content $envFile | ForEach-Object {
            # Match lines like: KEY=value or KEY="value" (skip comments and empty lines)
            if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
                $key = $matches[1]
                $value = $matches[2].Trim()
                # Remove surrounding quotes
                if ($value -match '^"(.*)"$' -or $value -match "^'(.*)'$") {
                    $value = $matches[1]
                }
                # Always set from .env file (overwrite any cached values)
                [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
                Write-Host "  Loaded: $key" -ForegroundColor DarkGray
            }
        }
    } else {
        Write-Host "WARNING: .env file not found at $envFile" -ForegroundColor Yellow
    }
}

# Load .env file first
Load-EnvFile

# Now read variables using direct environment access
$PROJECT_ID = [System.Environment]::GetEnvironmentVariable("GCP_PROJECT_ID", "Process")
$NEXTAUTH_SECRET = [System.Environment]::GetEnvironmentVariable("NEXTAUTH_SECRET", "Process")
$GOOGLE_CLIENT_ID = [System.Environment]::GetEnvironmentVariable("GOOGLE_CLIENT_ID", "Process")
$GOOGLE_CLIENT_SECRET = [System.Environment]::GetEnvironmentVariable("GOOGLE_CLIENT_SECRET", "Process")
$ADMIN_EMAILS = [System.Environment]::GetEnvironmentVariable("ADMIN_EMAILS", "Process")
$DB_PASSWORD = [System.Environment]::GetEnvironmentVariable("DB_PASSWORD", "Process")

# Configuration
if (-not $PROJECT_ID) { 
    Write-Host "ERROR: GCP_PROJECT_ID is not set" -ForegroundColor Red
    Write-Host "Set it in .env file or with: `$env:GCP_PROJECT_ID = 'your-gcp-project-id'" -ForegroundColor Yellow
    exit 1
}
$REGION = if ($env:GCP_REGION) { $env:GCP_REGION } else { "us-central1" }
$SERVICE_NAME = "aura-designs"
$DB_INSTANCE = "aura-designs-db"
$DB_NAME = "aura_designs"

# Validate all required environment variables
$missingVars = @()
if (-not $DB_PASSWORD) { $missingVars += "DB_PASSWORD" }
if (-not $NEXTAUTH_SECRET) { $missingVars += "NEXTAUTH_SECRET" }
if (-not $GOOGLE_CLIENT_ID) { $missingVars += "GOOGLE_CLIENT_ID" }
if (-not $GOOGLE_CLIENT_SECRET) { $missingVars += "GOOGLE_CLIENT_SECRET" }
if (-not $ADMIN_EMAILS) { $missingVars += "ADMIN_EMAILS" }

if ($missingVars.Count -gt 0) {
    Write-Host "ERROR: Missing required environment variables:" -ForegroundColor Red
    $missingVars | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    Write-Host ""
    Write-Host "Set them in your .env file or as environment variables before running this script." -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "Deploying Aura Designs to Google Cloud..." -ForegroundColor Cyan
Write-Host "  Project: $PROJECT_ID" -ForegroundColor Gray
Write-Host "  Region: $REGION" -ForegroundColor Gray
Write-Host "  Admin Emails: $ADMIN_EMAILS" -ForegroundColor Gray
Write-Host "  NEXTAUTH_SECRET: $(if($NEXTAUTH_SECRET){'[SET]'}else{'[MISSING]'})" -ForegroundColor Gray
Write-Host ""

# Step 1: Set project
Write-Host "Setting project..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID 2>$null

# Add production environment tag to suppress warning
Write-Host "Setting environment tag..." -ForegroundColor Yellow
gcloud resource-manager tags bindings create --tag-value=production --parent="//cloudresourcemanager.googleapis.com/projects/$PROJECT_ID" --location=global 2>$null

# Step 2: Enable APIs
Write-Host "Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable secretmanager.googleapis.com

# Step 3: Check if Cloud SQL instance exists
Write-Host "Checking database..." -ForegroundColor Yellow
$dbCheck = & gcloud sql instances list --filter="name=$DB_INSTANCE" --format='value[no-heading](name)' 2>&1

if ($dbCheck -notlike "*$DB_INSTANCE*") {
    Write-Host "Creating Cloud SQL instance (this takes ~5 minutes)..." -ForegroundColor Yellow
    gcloud sql instances create $DB_INSTANCE --database-version=POSTGRES_14 --tier=db-f1-micro --region=$REGION --root-password="$DB_PASSWORD"
    
    Write-Host "Creating database..." -ForegroundColor Yellow
    gcloud sql databases create $DB_NAME --instance=$DB_INSTANCE
} else {
    Write-Host "Database instance already exists." -ForegroundColor Green
}

# Step 4: Build and deploy to Cloud Run
Write-Host "Building and deploying to Cloud Run..." -ForegroundColor Yellow
Write-Host "This may take a few minutes on first deploy..." -ForegroundColor Gray

# URL-encode special characters in password for DATABASE_URL
# Note: Only encode if the password doesn't already contain URL-encoded chars (%)
if ($DB_PASSWORD -notmatch '%[0-9A-Fa-f]{2}') {
    $encodedPassword = [System.Uri]::EscapeDataString($DB_PASSWORD)
} else {
    # Password might already be URL-encoded or contain literal %, use as-is
    $encodedPassword = $DB_PASSWORD
}
$SOCKET_PATH = "/cloudsql/${PROJECT_ID}:${REGION}:${DB_INSTANCE}"
$DATABASE_URL = "postgresql://postgres:${encodedPassword}@localhost/${DB_NAME}?host=${SOCKET_PATH}"

Write-Host "  DATABASE_URL password encoded: $($encodedPassword.Substring(0, [Math]::Min(5, $encodedPassword.Length)))..." -ForegroundColor DarkGray

# Check if service already exists to get the actual URL
$existingUrl = & gcloud run services describe $SERVICE_NAME --region=$REGION --format='value[no-heading](status.url)' 2>$null
if ($existingUrl) {
    $CLOUD_RUN_URL = $existingUrl
    Write-Host "Using existing service URL: $CLOUD_RUN_URL" -ForegroundColor Gray
} else {
    # Placeholder - will update after first deploy
    $CLOUD_RUN_URL = "https://${SERVICE_NAME}-placeholder.run.app"
    Write-Host "New deployment - will update NEXTAUTH_URL after deploy" -ForegroundColor Gray
}

# Deploy command - use env-vars-file to handle special characters properly
# Create a temporary env file for gcloud
$tempEnvFile = Join-Path $PSScriptRoot ".env.gcloud.yaml"
@"
NODE_ENV: production
NEXTAUTH_URL: "$CLOUD_RUN_URL"
NEXTAUTH_SECRET: "$NEXTAUTH_SECRET"
GOOGLE_CLIENT_ID: "$GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET: "$GOOGLE_CLIENT_SECRET"
ADMIN_EMAILS: "$ADMIN_EMAILS"
DATABASE_URL: "$DATABASE_URL"
"@ | Out-File -FilePath $tempEnvFile -Encoding utf8

Write-Host "Environment variables to be set:" -ForegroundColor Gray
Write-Host "  NEXTAUTH_URL: $CLOUD_RUN_URL" -ForegroundColor DarkGray
Write-Host "  NEXTAUTH_SECRET: [SET]" -ForegroundColor DarkGray
Write-Host "  GOOGLE_CLIENT_ID: [SET]" -ForegroundColor DarkGray
Write-Host "  GOOGLE_CLIENT_SECRET: [SET]" -ForegroundColor DarkGray
Write-Host "  ADMIN_EMAILS: $ADMIN_EMAILS" -ForegroundColor DarkGray

$deployArgs = @(
    "run", "deploy", $SERVICE_NAME,
    "--source", ".",
    "--region", $REGION,
    "--allow-unauthenticated",
    "--env-vars-file", $tempEnvFile,
    "--add-cloudsql-instances", "${PROJECT_ID}:${REGION}:${DB_INSTANCE}",
    "--memory", "1Gi",
    "--cpu", "1",
    "--min-instances", "0",
    "--max-instances", "3"
)

& gcloud @deployArgs

# Cleanup temp file
if (Test-Path $tempEnvFile) {
    Remove-Item $tempEnvFile -Force
}

# Step 5: Get the actual URL and update NEXTAUTH_URL if needed
Write-Host "Getting service URL..." -ForegroundColor Yellow
$SERVICE_URL = & gcloud run services describe $SERVICE_NAME --region=$REGION --format='value[no-heading](status.url)'

# Update NEXTAUTH_URL with the correct URL if it was a placeholder or different
if ($SERVICE_URL -and ($SERVICE_URL -ne $CLOUD_RUN_URL)) {
    Write-Host "Updating NEXTAUTH_URL to actual service URL..." -ForegroundColor Yellow
    gcloud run services update $SERVICE_NAME --region=$REGION --update-env-vars="NEXTAUTH_URL=$SERVICE_URL"
}

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Your website: $SERVICE_URL" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "IMPORTANT: Update Google OAuth settings!" -ForegroundColor Yellow
Write-Host "1. Go to: https://console.cloud.google.com/apis/credentials" -ForegroundColor White
Write-Host "2. Edit your OAuth 2.0 Client ID" -ForegroundColor White
Write-Host "3. Add this Authorized redirect URI:" -ForegroundColor White
Write-Host "   $SERVICE_URL/api/auth/callback/google" -ForegroundColor Cyan

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run database migrations: npx prisma migrate deploy" -ForegroundColor White
Write-Host "2. Seed the database with sample data" -ForegroundColor White
