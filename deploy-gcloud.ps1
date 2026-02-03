# Aura Designs - Google Cloud Deployment Script
# 
# Before running, set these environment variables:
#   $env:GCP_PROJECT_ID = "your-project-id"
#   $env:DB_PASSWORD = "your_secure_password"
#   $env:NEXTAUTH_SECRET = "your_32_char_secret"
#   $env:GOOGLE_CLIENT_ID = "your_google_client_id"
#   $env:GOOGLE_CLIENT_SECRET = "your_google_client_secret"
#   $env:ADMIN_EMAILS = "admin1@gmail.com,admin2@gmail.com"

# Configuration - override via environment variables
$PROJECT_ID = if ($env:GCP_PROJECT_ID) { $env:GCP_PROJECT_ID } else { 
    Write-Host "ERROR: GCP_PROJECT_ID environment variable is not set" -ForegroundColor Red
    Write-Host "Set it with: `$env:GCP_PROJECT_ID = 'your-gcp-project-id'" -ForegroundColor Yellow
    exit 1
}
$REGION = if ($env:GCP_REGION) { $env:GCP_REGION } else { "us-central1" }
$SERVICE_NAME = "aura-designs"
$DB_INSTANCE = "aura-designs-db"
$DB_NAME = "aura_designs"

Write-Host "Deploying Aura Designs to Google Cloud..." -ForegroundColor Cyan

# Step 1: Set project
Write-Host "Setting project..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

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
    # Ensure DB_PASSWORD environment variable is set
    if (-not $env:DB_PASSWORD) {
        Write-Host "ERROR: DB_PASSWORD environment variable is not set" -ForegroundColor Red
        Write-Host "Set it with: `$env:DB_PASSWORD = 'your_secure_password'" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "Creating Cloud SQL instance (this takes ~5 minutes)..." -ForegroundColor Yellow
    gcloud sql instances create $DB_INSTANCE --database-version=POSTGRES_14 --tier=db-f1-micro --region=$REGION --root-password="$($env:DB_PASSWORD)"
    
    Write-Host "Creating database..." -ForegroundColor Yellow
    gcloud sql databases create $DB_NAME --instance=$DB_INSTANCE
} else {
    Write-Host "Database instance already exists." -ForegroundColor Green
}

# Step 4: Build and deploy to Cloud Run
Write-Host "Building and deploying to Cloud Run..." -ForegroundColor Yellow
Write-Host "This may take a few minutes on first deploy..." -ForegroundColor Gray

# Get password from environment variable
if (-not $env:DB_PASSWORD) {
    Write-Host "ERROR: DB_PASSWORD environment variable is not set" -ForegroundColor Red
    Write-Host "Set it with: `$env:DB_PASSWORD = 'your_secure_password'" -ForegroundColor Yellow
    exit 1
}
$DB_PASSWORD = $env:DB_PASSWORD
$SOCKET_PATH = "/cloudsql/${PROJECT_ID}:${REGION}:${DB_INSTANCE}"
$DATABASE_URL = "postgresql://postgres:${DB_PASSWORD}@localhost/${DB_NAME}?host=${SOCKET_PATH}"

# Cloud Run URL (will be updated after deploy)
$CLOUD_RUN_URL = "https://${SERVICE_NAME}-${PROJECT_ID}.${REGION}.run.app"

# Deploy command
$deployArgs = @(
    "run", "deploy", $SERVICE_NAME,
    "--source", ".",
    "--region", $REGION,
    "--allow-unauthenticated",
    "--set-env-vars", "NODE_ENV=production",
    "--set-env-vars", "NEXTAUTH_URL=$CLOUD_RUN_URL",
    "--set-env-vars", "NEXTAUTH_SECRET=$($env:NEXTAUTH_SECRET)",
    "--set-env-vars", "GOOGLE_CLIENT_ID=$($env:GOOGLE_CLIENT_ID)",
    "--set-env-vars", "GOOGLE_CLIENT_SECRET=$($env:GOOGLE_CLIENT_SECRET)",
    "--set-env-vars", "ADMIN_EMAILS=$($env:ADMIN_EMAILS)",
    "--set-env-vars", "DATABASE_URL=$DATABASE_URL",
    "--add-cloudsql-instances", "${PROJECT_ID}:${REGION}:${DB_INSTANCE}",
    "--memory", "1Gi",
    "--cpu", "1",
    "--min-instances", "0",
    "--max-instances", "3"
)

& gcloud @deployArgs

# Step 5: Get the actual URL
Write-Host "Getting service URL..." -ForegroundColor Yellow
$SERVICE_URL = & gcloud run services describe $SERVICE_NAME --region=$REGION --format='value[no-heading](status.url)'

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
