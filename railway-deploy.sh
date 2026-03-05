#!/bin/bash

echo "🚀 Starting deployment..."

# Run database migrations
php artisan migrate --force

# Create admin user if not exists
php artisan db:seed --force

echo "✅ Deployment complete!"
