# Multi-stage build for optimized production image
# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production image
FROM nginx:alpine AS production

# Install necessary packages
RUN apk add --no-cache curl

# Copy custom nginx configuration to template
COPY nginx.conf /etc/nginx/nginx.conf.template
# Copy entrypoint script
COPY scripts/docker-entrypoint.sh /entrypoint.sh

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create directories with proper permissions
# We also need to ensure nginx.conf is writable by the nginx user for the entrypoint script
RUN mkdir -p /var/cache/nginx /var/log/nginx /tmp && \
    touch /etc/nginx/nginx.conf && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /tmp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.template && \
    chmod -R 755 /var/cache/nginx /var/log/nginx /tmp && \
    chmod +x /entrypoint.sh

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Start nginx via entrypoint
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
