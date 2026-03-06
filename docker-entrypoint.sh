#!/bin/bash
set -e

echo "🚀 Starting Laravel application..."

# Run migrations
echo "📦 Running migrations..."
php artisan migrate --force || echo "⚠️ Migrations skipped"

# Seed database
echo "🌱 Seeding database..."
php artisan db:seed --force --class=DatabaseSeeder || echo "⚠️ Seeding skipped"

echo "✅ Setup complete! Starting Apache..."

# Execute the main container command
exec "$@"
