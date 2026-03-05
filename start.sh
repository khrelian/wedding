#!/bin/bash
set -e  # Exit on error

echo "🚀 Starting deployment..."

# Ensure PORT is set
PORT=${PORT:-8080}
export PORT

echo "PORT is set to: ${PORT}"

# Run database migrations
echo "📦 Running migrations..."
php artisan migrate --force || echo "⚠️ Migration failed but continuing..."

# Create admin user if not exists
echo "🌱 Seeding database..."
php artisan db:seed --force --class=DatabaseSeeder || echo "⚠️ Seeding failed (might already exist)"

echo "✅ Setup complete! Starting server on port ${PORT}..."

# Use PHP built-in server directly instead of artisan serve
cd /app/public
exec php -S 0.0.0.0:${PORT} -t . ../server.php
