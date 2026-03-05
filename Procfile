web: bash -c "php artisan migrate --force && echo 'Migrations done' && php artisan db:seed --force --class=DatabaseSeeder && echo 'Seeding done' && php artisan serve --host=0.0.0.0 --port=$PORT"
