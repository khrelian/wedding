# Quick Start Guide

Welcome to your wedding website! This guide will help you get started quickly.

## Prerequisites

**You need Docker Desktop installed and running:**

- Mac: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
- Windows: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
- Linux: [Install Docker Engine](https://docs.docker.com/engine/install/)

## First Steps

### 1. Start Laravel Sail (Docker)

```bash
# Make sure Docker Desktop is running, then:
./vendor/bin/sail up -d
```

This starts:
- Laravel application (http://localhost)
- MySQL database
- All required services

**First time?** Docker will pull images (takes a few minutes).

### 2. Start Vite Dev Server

```bash
./vendor/bin/sail npm run dev
```

Visit **http://localhost** to see your site!

> 💡 **Pro Tip**: Create an alias to make commands shorter:
> 
> Add to `~/.zshrc` or `~/.bashrc`:
> ```bash
> alias sail='./vendor/bin/sail'
> ```
> 
> Then reload: `source ~/.zshrc`
> 
> Now use: `sail up -d` instead of `./vendor/bin/sail up -d`

## First Steps

### 1. Start the Development Server

```bash
composer dev
```

This single command will start:
- Laravel server at http://localhost:8000
- Vite dev server with hot reload
- Queue worker
- Application logs

Visit http://localhost:8000 to see your site!

### 3. Customize Your Wedding Information

Edit the wedding configuration file:

```bash
config/wedding.php
```

Update:
- Your names
- Wedding date and time
- Venue information
- RSVP deadline
- Contact information

### 4. Update the Welcome Page

Edit your home page:

```bash
resources/js/Pages/Welcome.vue
```

Replace placeholders with:
- Your actual names
- Wedding date
- Venue location
- Your love story
- Photos (coming soon)

### 5. Configure the RSVP Page

The RSVP page is at:

```bash
resources/js/Pages/RSVP.vue
```

Customize:
- Form fields
- Meal options
- Guest limit
- Special requirements

### 6. Set Up Database (Optional)

If you want to save RSVPs to a database:

```bash
# Create a migration
php artisan make:migration create_rsvps_table

# Create a model
php artisan make:model Rsvp

# Create a controller
php artisan make:controller RsvpController
```

## Project Structure Quick Reference

```
wedding/
├── resources/js/
│   ├── Pages/           # Your Vue pages
│   │   ├── Welcome.vue  # Home page
│   │   ├── RSVP.vue    # RSVP form
│   │   └── Dashboard.vue
│   ├── Components/      # Reusable Vue components
│   └── Layouts/         # Page layouts
├── routes/web.php       # Define your routes here
├── config/wedding.php   # Wedding configuration
└── .env                 # Environment variables
```

## Adding New Pages

### 1. Create a Vue Component

Create a new file in `resources/js/Pages/`:

```vue
<!-- resources/js/Pages/OurStory.vue -->
<script setup>
import { Head } from '@inertiajs/vue3';
</script>

<template>
    <Head title="Our Story" />
    
    <div class="min-h-screen bg-white">
        <h1>Our Story</h1>
        <!-- Your content here -->
    </div>
</template>
```

### 2. Add a Route

In `routes/web.php`:

```php
Route::get('/our-story', function () {
    return Inertia::render('OurStory');
})->name('story');
```

### 3. Add Navigation Link

In your layout or navigation component:

```vue
<Link :href="route('story')">Our Story</Link>
```

## Common Customizations

### Change Colors

Edit `config/wedding.php`:

```php
'theme' => [
    'primary_color' => '#your-color',
    'secondary_color' => '#your-color',
],
```

Then update Tailwind classes in your Vue files.

### Add Photos

1. Place images in `public/images/`
2. Reference in Vue templates:

```vue
<img src="/images/your-photo.jpg" alt="Description" />
```

### Update Navigation

Edit the authenticated layout:

```bash
resources/js/Layouts/AuthenticatedLayout.vue
```

## Useful Commands

```bash
# Start development (recommended)
composer dev

# Or manually:
php artisan serve          # Start Laravel server
npm run dev               # Start Vite dev server

# Build for production
npm run build
php artisan config:cache
php artisan route:cache

# Database
php artisan migrate       # Run migrations
php artisan migrate:fresh # Reset database

# Code quality
./vendor/bin/pint        # Format PHP code

# Cache clearing
php artisan optimize:clear

# View routes
php artisan route:list
```

## Adding Features

### Photo Gallery

1. Install a Vue image gallery package:
```bash
npm install vue-easy-lightbox
```

2. Create `resources/js/Pages/Gallery.vue`
3. Add route in `routes/web.php`

### Contact Form

1. Create controller:
```bash
php artisan make:controller ContactController
```

2. Create mail class:
```bash
php artisan make:mail ContactFormMail
```

3. Add form in Vue and connect to controller

### Countdown Timer

Already available in Vue! Use a package like `vue3-flip-countdown` or create your own.

## Need Help?

### Documentation
- Laravel: https://laravel.com/docs
- Vue.js: https://vuejs.org/
- Inertia.js: https://inertiajs.com/
- Tailwind CSS: https://tailwindcss.com/

### Common Issues

**"npm install fails"**
```bash
npm install --legacy-peer-deps
```

**"Vite not connecting"**
- Make sure `npm run dev` is running
- Check if port 5173 is available

**"Changes not showing"**
- Hard refresh browser (Cmd/Ctrl + Shift + R)
- Clear cache: `php artisan optimize:clear`

**"Database errors"**
- Check `.env` file database settings
- Run `php artisan migrate`

## Next Steps

1. ✅ Customize `config/wedding.php`
2. ✅ Update `resources/js/Pages/Welcome.vue` with your details
3. ✅ Add your photos to `public/images/`
4. ✅ Test the RSVP form
5. ✅ Set up email for notifications
6. ✅ Add more pages (Photo Gallery, Accommodations, etc.)
7. ✅ Test on mobile devices
8. ✅ Deploy to production

## Deployment Checklist

Before going live:

- [ ] Update `.env` for production
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Configure email settings
- [ ] Set up SSL certificate
- [ ] Run `npm run build`
- [ ] Test all forms
- [ ] Test on multiple devices
- [ ] Set up backups

---

**Congratulations and best wishes for your wedding! 💑**
