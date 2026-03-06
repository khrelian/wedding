#!/bin/bash
set -e

echo "🚀 Starting Laravel application with Apache..."

# Wait for database to be ready
sleep 5

# Run migrations
echo "📦 Running migrations..."
cd /var/www/html
php artisan migrate --force 2>&1 || echo "⚠️ Migrations failed or already run"

# Seed database  
echo "🌱 Seeding database..."
php artisan db:seed --force --class=DatabaseSeeder 2>&1 || echo "⚠️ Seeding failed or already done"

echo "✅ Database setup complete!"
echo "🌐 Starting Apache web server..."

# Start Apache in foreground
exec apache2-foreground
