#!/bin/bash
set -e  # Exit on error

echo "🚀 Starting deployment..."
echo "PORT is set to: ${PORT}"

# Run database migrations
echo "📦 Running migrations..."
php artisan migrate --force || echo "⚠️ Migration failed but continuing..."

# Create admin user if not exists
echo "🌱 Seeding database..."
php artisan db:seed --force --class=DatabaseSeeder || echo "⚠️ Seeding failed (might already exist)"

echo "✅ Setup complete! Starting server on port ${PORT}..."
# Start the Laravel server
exec php artisan serve --host=0.0.0.0 --port=${PORT}
