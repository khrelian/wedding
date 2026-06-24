#!/bin/bash
set -e

echo "🚀 Starting Laravel application with Apache..."

# Railway provides PORT; default to 80 if not set
PORT=${PORT:-80}
export PORT
echo "Using PORT: ${PORT}"

# Reconfigure Apache to listen on $PORT
sed -i "s/Listen 80$/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

# Wait for database to be ready
sleep 5

# Run migrations
echo "📦 Running migrations..."
cd /var/www/html
php artisan migrate --force 2>&1 || echo "⚠️ Migrations failed or already run"

# Ensure upload directories exist and are writable by Apache
echo "📁 Preparing storage..."
mkdir -p storage/app/public/guest-photos
chown -R www-data:www-data storage bootstrap/cache

# Link public/storage as www-data so Apache can follow the symlink
echo "🔗 Linking storage..."
su -s /bin/bash www-data -c "cd /var/www/html && php artisan storage:link --force" 2>&1 || echo "⚠️ Storage link failed or already exists"

# Seed database
echo "🌱 Seeding database..."
php artisan db:seed --force --class=DatabaseSeeder 2>&1 || echo "⚠️ Seeding failed or already done"

echo "✅ Database setup complete!"
echo "🌐 Starting Apache web server on port ${PORT}..."

# Ensure only mpm_prefork is loaded (avoid MPM conflict)
a2dismod mpm_event mpm_worker 2>/dev/null || true
a2enmod mpm_prefork 2>/dev/null || true

exec apache2-foreground
