# Wedding Website

A modern wedding website built with Laravel 12 and Vue.js 3, using Inertia.js for seamless integration.

## Tech Stack

- **Backend:** Laravel 12.x (PHP 8.2+)
- **Frontend:** Vue.js 3.4
- **Bridge:** Inertia.js 2.0 (for SPA-like experience without API)
- **Styling:** Tailwind CSS 3.x with Tailwind Forms
- **Build Tool:** Vite 7.x
- **Authentication:** Laravel Breeze with Vue
- **Database:** SQLite (default, easily switchable to MySQL/PostgreSQL)
- **API Authentication:** Laravel Sanctum

## Features Included

✅ User authentication (Login, Register, Password Reset)  
✅ User profile management  
✅ Responsive dashboard  
✅ Pre-built Vue components (Buttons, Inputs, Modals, Dropdowns)  
✅ Guest and Authenticated layouts  
✅ Ziggy for Laravel routes in JavaScript  
✅ Hot Module Replacement (HMR) for development  
✅ Production-ready build configuration  

## Prerequisites

- **Docker Desktop** (includes everything you need!)
  - Mac: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Windows: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Linux: [Install Docker Engine](https://docs.docker.com/engine/install/)

**That's it!** Laravel Sail provides PHP, MySQL, Node.js, and all dependencies in Docker containers.

## Installation

### Using Laravel Sail (Recommended - Docker-based)

**Prerequisites**: Docker Desktop must be installed and running.

```bash
# Clone the repository
git clone <your-repo-url>
cd wedding

# Start Docker containers
./vendor/bin/sail up -d

# Install JavaScript dependencies
./vendor/bin/sail npm install

# Run database migrations
./vendor/bin/sail artisan migrate

# Build frontend assets
./vendor/bin/sail npm run build
```

Your site will be available at **http://localhost**

> 📖 **See [SAIL.md](SAIL.md) for detailed Sail documentation**

### Traditional Setup (Without Docker)

If you prefer not to use Docker:

### Fresh Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd wedding

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install --legacy-peer-deps

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create SQLite database
touch database/database.sqlite

# Run migrations
php artisan migrate

# Build frontend assets
npm run build
```

### Quick Setup (Using Composer Script)

```bash
composer setup
```

## Development

### Start Development with Sail (Recommended)

```bash
# Start all services in background
./vendor/bin/sail up -d

# Start Vite dev server
./vendor/bin/sail npm run dev
```

Visit **http://localhost** to see your wedding site!

> 💡 **Tip**: Create an alias `alias sail='./vendor/bin/sail'` to use `sail` instead of `./vendor/bin/sail`

**Useful Sail Commands:**

```bash
# View logs
./vendor/bin/sail logs -f

# Run artisan commands
./vendor/bin/sail artisan migrate

# Access container shell
./vendor/bin/sail shell

# Stop containers
./vendor/bin/sail down
```

### Traditional Development (Without Docker)

### Start Development Server

The easiest way to run the development environment:

```bash
composer dev
```

This will concurrently run:
- PHP development server (http://localhost:8000)
- Queue worker
- Application logs (Laravel Pail)
- Vite dev server with HMR

### Manual Development Setup

If you prefer to run services individually:

```bash
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - Vite dev server
npm run dev

# Optional: Terminal 3 - Queue worker
php artisan queue:work

# Optional: Terminal 4 - View logs
php artisan pail
```

The application will be available at `http://localhost:8000`

## Building for Production

```bash
# Build frontend assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Project Structure

```
wedding/
├── app/                    # Laravel application code
│   ├── Http/
│   │   └── Controllers/   # Backend controllers
│   └── Models/            # Eloquent models
├── resources/
│   ├── js/               # Vue.js application
│   │   ├── Components/   # Reusable Vue components
│   │   ├── Layouts/      # Page layouts
│   │   ├── Pages/        # Inertia.js pages
│   │   └── app.js        # Main JavaScript entry
│   ├── css/              # Stylesheets
│   └── views/            # Blade templates (minimal, main is app.blade.php)
├── routes/
│   ├── web.php           # Web routes
│   └── api.php           # API routes
├── database/
│   ├── migrations/       # Database migrations
│   └── seeders/         # Database seeders
├── public/               # Public assets
├── tests/                # PHPUnit tests
└── config/              # Configuration files
```

## Vue.js Components

The following Vue components are pre-built and ready to use:

- `ApplicationLogo.vue` - Logo component
- `Checkbox.vue` - Styled checkbox
- `DangerButton.vue` - Red action button
- `Dropdown.vue` - Dropdown menu
- `InputError.vue` - Form error display
- `InputLabel.vue` - Form labels
- `Modal.vue` - Modal dialog
- `NavLink.vue` - Navigation links
- `PrimaryButton.vue` - Primary action button
- `ResponsiveNavLink.vue` - Mobile navigation link
- `SecondaryButton.vue` - Secondary action button
- `TextInput.vue` - Text input field

## Pages Available

- `/` - Welcome page
- `/dashboard` - User dashboard (authenticated)
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset request
- `/profile` - User profile management

## Database Configuration

### Using Sail (Default - MySQL in Docker)

No configuration needed! Sail uses MySQL 8.4 in Docker. Settings in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=sail
DB_PASSWORD=password
```

**Access from your computer** (TablePlus, Sequel Ace, etc.):
```
Host: 127.0.0.1
Port: 3306
Database: laravel
Username: sail
Password: password
```

### Using SQLite (Default)

No additional configuration needed. The database file is at `database/database.sqlite`.

### Switching to MySQL

Update your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=wedding
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Then run:

```bash
php artisan migrate:fresh
```

## Testing

```bash
# Run all tests
composer test

# Or directly with PHPUnit
php artisan test
```

## Code Quality

```bash
# Format code with Laravel Pint
./vendor/bin/pint
```

## Customization Ideas for Wedding Website

Here are some features you might want to add:

1. **RSVP System** - Guest list management
2. **Event Timeline** - Schedule of wedding events
3. **Photo Gallery** - Wedding photos and engagement pictures
4. **Story Section** - How you met, proposal story
5. **Registry Links** - Link to gift registries
6. **Venue Information** - Maps and directions
7. **Accommodation** - Hotel recommendations
8. **Guest Messages** - Message board for guests
9. **Countdown Timer** - Days until the wedding
10. **Admin Panel** - Manage RSVPs and guest messages

## Deployment

### Environment Variables

Make sure to set these in production:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourwedding.com

# Set a strong key
APP_KEY=base64:...

# Configure your production database
DB_CONNECTION=mysql
DB_HOST=...
DB_PORT=3306
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...

# Configure mail for password resets
MAIL_MAILER=smtp
MAIL_HOST=...
MAIL_PORT=...
MAIL_USERNAME=...
MAIL_PASSWORD=...
```

### Deployment Steps

```bash
# On your server
git pull origin main
composer install --no-dev --optimize-autoloader
npm install --legacy-peer-deps
npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Useful Commands

```bash
# Create a new controller
php artisan make:controller WeddingController

# Create a new model with migration
php artisan make:model Guest -m

# Create a new Vue page (manual - create in resources/js/Pages/)
# Example: resources/js/Pages/RSVP.vue

# Clear all caches
php artisan optimize:clear

# Generate IDE helper for better autocomplete
composer require --dev barryvdh/laravel-ide-helper
php artisan ide-helper:generate
```

## Troubleshooting

### Vite not loading in development

```bash
npm run dev
# Make sure Vite is running and check http://localhost:5173
```

### npm install fails with peer dependency errors

```bash
npm install --legacy-peer-deps
```

### Permission errors on storage

```bash
chmod -R 775 storage bootstrap/cache
```

## Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Vue.js 3 Documentation](https://vuejs.org/)
- [Inertia.js Documentation](https://inertiajs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## License

MIT License

---

**Congratulations on your wedding! 🎉💍**
