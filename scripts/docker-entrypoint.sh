#!/bin/sh
set -e

# Default to the production URL if not set
DEFAULT_URL="https://opmafykbhjinqebgflnl.supabase.co"
TARGET_URL="${VITE_SUPABASE_URL:-$DEFAULT_URL}"

# Derive WSS URL (replace https:// with wss://)
TARGET_WSS=$(echo "$TARGET_URL" | sed 's/^https:/wss:/')

echo "Configuring Nginx CSP with Supabase URL: $TARGET_URL"

# Replace placeholders in nginx.conf
# We use a temp file to avoid issues
sed -e "s|__SUPABASE_URL__|$TARGET_URL|g" \
    -e "s|__SUPABASE_WSS_URL__|$TARGET_WSS|g" \
    /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Execute the CMD
exec "$@"
