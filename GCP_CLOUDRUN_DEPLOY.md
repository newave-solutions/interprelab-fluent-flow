# Deploying InterpreLab to Google Cloud Run

This guide will walk you through containerizing your React application and deploying it to Google Cloud Run.

## Prerequisites

-   **Docker:** Ensure Docker is installed and running on your local machine.
-   **Google Cloud SDK (`gcloud` CLI):** Ensure `gcloud` is installed and configured for your project (`interprelab-fluent-flow`).
    -   You can verify your configuration with `gcloud config list`.
    -   If not configured, run `gcloud init`.

## Step 1: Create a Dockerfile

Create a file named `Dockerfile` in the root of your project (the same directory as `package.json`) with the following content:

```dockerfile
# Stage 1: Build the React application
FROM node:20-alpine as builder

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the build output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration (optional, but good practice)
# If you have a custom nginx.conf, place it in your project root
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Explanation of the Dockerfile:**

-   **Stage 1 (builder):**
    -   Uses a Node.js Alpine image to keep the final image small.
    -   Sets the working directory to `/app`.
    -   Copies `package.json` and `bun.lockb` to install dependencies.
    -   Runs `bun install --frozen-lockfile` to install project dependencies.
    -   Copies the rest of your application code.
    -   Runs `bun run build` to create the optimized production build of your React app.

-   **Stage 2 (nginx):**
    -   Uses a lightweight Nginx Alpine image.
    -   Copies the static files generated in the `builder` stage (`/app/dist`) to the Nginx web server directory (`/usr/share/nginx/html`).
    -   Exposes port 80, which Nginx listens on by default.
    -   Starts Nginx in the foreground.

## Step 2: Build and Push the Docker Image

Open your terminal in the project root directory and run the following commands:

1.  **Configure Docker to use Google Cloud's credential helper:**

    ```bash
    gcloud auth configure-docker
    ```

2.  **Build the Docker image:**

    ```bash
    docker build -t gcr.io/interprelab-fluent-flow/interprelab-fluent-flow-image:latest .
    ```

    -   `gcr.io`: Specifies Google Container Registry.
    -   `interprelab-fluent-flow`: Your Google Cloud Project ID.
    -   `interprelab-fluent-flow-image`: The name of your Docker image.
    -   `latest`: The tag for your image (you can use version numbers instead of `latest`).
    -   `.`: Indicates that the Dockerfile is in the current directory.

3.  **Push the Docker image to Google Container Registry:**

    ```bash
    docker push gcr.io/interprelab-fluent-flow/interprelab-fluent-flow-image:latest
    ```

## Step 3: Deploy to Cloud Run

Now that your Docker image is in Google Container Registry, you can deploy it to Cloud Run:

```bash
gcloud run deploy interprelab-fluent-flow-image \
  --image gcr.io/interprelab-fluent-flow/interprelab-fluent-flow-image:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --project interprelab-fluent-flow
```

**Explanation of the `gcloud run deploy` command:**

-   `interprelab-fluent-flow-image`: The name of the Cloud Run service.
-   `--image`: Specifies the Docker image to deploy.
-   `--platform managed`: Uses the fully managed Cloud Run environment.
-   `--region us-central1`: Specifies the GCP region to deploy to. You can choose a region closer to your users.
-   `--allow-unauthenticated`: Allows public access to your service. If you need authentication, you would omit this flag.
-   `--project interprelab-fluent-flow`: Specifies your Google Cloud Project ID.

After running this command, `gcloud` will provide you with the URL of your deployed service. You can access your application through this URL.

## Step 4: (Optional) Connect to a Custom Domain

If you want to use a custom domain (e.g., `interprelab.com`) with your Cloud Run service, you can follow these steps:

1.  **Add a custom domain mapping:**

    ```bash
    gcloud run domains add interprelab.com \
      --service interprelab-fluent-flow-image \
      --platform managed \
      --region us-central1 \
      --project interprelab-fluent-flow
    ```

2.  **Update DNS records:** `gcloud` will provide you with the necessary DNS records (A and TXT records) that you need to add to your domain registrar (e.g., GoDaddy, Namecheap). Follow their instructions to update your DNS settings.

    It might take some time for DNS changes to propagate.
