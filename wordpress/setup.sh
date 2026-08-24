#!/bin/bash
set -e

# Wait for database to be ready
until wp db query "SELECT 1" --allow-root >/dev/null 2>&1; do
  echo "Waiting for database..."
  sleep 3
done

if [ "${WORDPRESS_ADMIN_PASSWORD:-changeme}" = "changeme" ]; then
  echo "WARNING: WORDPRESS_ADMIN_PASSWORD is the default 'changeme'. Change it before exposing this instance."
fi

# Check if WordPress is already installed
if ! wp core is-installed --allow-root 2>/dev/null; then
  echo "Installing WordPress..."

  wp core install \
    --url="${WORDPRESS_URL:-http://localhost}" \
    --title="${WORDPRESS_TITLE:-My WordPress Site}" \
    --admin_user="${WORDPRESS_ADMIN_USER:-admin}" \
    --admin_password="${WORDPRESS_ADMIN_PASSWORD:-changeme}" \
    --admin_email="${WORDPRESS_ADMIN_EMAIL:-admin@example.com}" \
    --skip-email \
    --allow-root

  echo "WordPress installed successfully!"

  # Remove default plugins (keep only next-revalidate)
  echo "Removing default plugins..."
  wp plugin delete akismet --allow-root 2>/dev/null || true
  wp plugin delete hello --allow-root 2>/dev/null || true
fi

# Activate the revalidation plugin if not already active
if ! wp plugin is-active next-revalidate --allow-root 2>/dev/null; then
  echo "Activating Next.js Revalidation plugin..."
  wp plugin activate next-revalidate --allow-root
fi

# Activate the headless theme (always run, safe if already active)
# Note: Theme directory name must match the actual directory in wp-content/themes
echo "Activating Next.js Headless theme..."
wp theme activate theme --allow-root || wp theme activate nextjs-headless --allow-root || true

# Configure the revalidation plugin (must match Next.js WORDPRESS_WEBHOOK_SECRET)
if [ -n "$NEXTJS_URL" ] && [ -n "$WORDPRESS_WEBHOOK_SECRET" ]; then
  echo "Configuring Next.js Revalidation plugin..."
  wp option update next_revalidation_settings "{\"next_url\":\"${NEXTJS_URL}\",\"webhook_secret\":\"${WORDPRESS_WEBHOOK_SECRET}\",\"revalidation_cooldown\":2}" --format=json --allow-root
  echo "Plugin configured with Next.js URL: $NEXTJS_URL"
fi

echo "WordPress setup complete!"
