# Deploying to GCP Cloud Run

1. Build the project:
   ```
   npm run build
   ```
2. Build Docker image:
   ```
   docker build -t gcr.io/[PROJECT_ID]/interprelab-eco-landing-page .
   ```
3. Push to Google Container Registry:
   ```
   docker push gcr.io/[PROJECT_ID]/interprelab-eco-landing-page
   ```
4. Deploy to Cloud Run:
   ```
   gcloud run deploy interprelab-eco-landing-page --image gcr.io/[PROJECT_ID]/interprelab-eco-landing-page --platform managed
   ```