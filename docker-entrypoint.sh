#!/bin/bash
set -e

echo "🚀 Starting Laravel application with Apache..."

# UNSET PORT variable to prevent Laravel artisan serve issues
unset PORT
export PORT=""

# Wait for database to be ready
sleep 5

# Run migrations (PORT is now unset, won't cause issues)
echo "📦 Running migrations..."
cd /var/www/html
php artisan migrate --force 2>&1 || echo "⚠️ Migrations failed or already run"

# Seed database  
echo "🌱 Seeding database..."
php artisan db:seed --force --class=DatabaseSeeder 2>&1 || echo "⚠️ Seeding failed or already done"

echo "✅ Database setup complete!"
echo "🌐 Starting Apache web server on port 80..."

# Start Apache in foreground (Apache uses port 80 by default)
exec apache2-foreground
