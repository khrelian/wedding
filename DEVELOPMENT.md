# Wedding Website - Development Guide

## 🚀 Getting Started

### First Time Setup

```bash
# Make sure you're in the project directory
cd /Users/ianjaybronola/Projects/wedding

# Everything is already installed! Just start the server:
composer dev
```

Visit **http://localhost:8000** in your browser.

## 📱 What You'll See

### Home Page (/)
- Beautiful wedding landing page with animated hearts
- "We're Getting Married!" headline
- Save the Date section
- Our Story section
- Event Details section
- Quick action buttons

### RSVP Page (/rsvp)
- Full RSVP form (requires login)
- Guest count
- Dietary restrictions
- Song requests
- Special messages

### Dashboard (/dashboard)
- User dashboard after login

### Profile (/profile)
- User profile management

## 🎨 Customization Guide

### 1. Update Your Information

Edit `config/wedding.php`:

```php
'couple' => [
    'partner1' => [
        'name' => 'Your Name',
    ],
    'partner2' => [
        'name' => "Partner's Name",
    ],
],
```

### 2. Edit the Welcome Page

Open `resources/js/Pages/Welcome.vue` and update:

```vue
<h1 class="text-6xl md:text-8xl font-serif text-gray-800 mb-6">
    We're Getting Married!
</h1>

<div class="text-2xl md:text-4xl text-gray-600 mb-8 font-light">
    <p class="mb-2">Your Name &amp; Partner's Name</p>
</div>
```

Change to your actual names:

```vue
<div class="text-2xl md:text-4xl text-gray-600 mb-8 font-light">
    <p class="mb-2">John &amp; Jane</p>
</div>
```

### 3. Add Your Wedding Date

In `Welcome.vue`, find:

```vue
<p class="text-3xl font-semibold text-gray-800">Coming Soon</p>
```

Replace with:

```vue
<p class="text-3xl font-semibold text-gray-800">June 15, 2026</p>
```

### 4. Update Venue Location

Find:

```vue
<p class="text-gray-600 mt-2">Venue Location</p>
```

Replace with:

```vue
<p class="text-gray-600 mt-2">Beautiful Garden, City Name</p>
```

## 🛠️ Development Commands

### Start Everything (Recommended)

```bash
composer dev
```

This runs:
- Laravel server (http://localhost:8000)
- Vite dev server (hot reload)
- Queue worker
- Application logs

### Or Run Services Separately

```bash
# Terminal 1 - Backend
php artisan serve

# Terminal 2 - Frontend (with hot reload)
npm run dev
```

### Build for Production

```bash
npm run build
```

### Other Useful Commands

```bash
# Clear all caches
php artisan optimize:clear

# View all routes
php artisan route:list

# Format PHP code
./vendor/bin/pint

# Run tests
composer test
```

## 📂 Key Files to Edit

### Wedding Configuration
```
config/wedding.php
```
- Couple names
- Wedding date
- Venue info
- RSVP settings
- Contact info

### Home Page
```
resources/js/Pages/Welcome.vue
```
- Main landing page
- Story section
- Event details

### RSVP Page
```
resources/js/Pages/RSVP.vue
```
- RSVP form
- Guest information
- Special requests

### Routes
```
routes/web.php
```
- Add new pages
- Configure URLs

### Styles
```
resources/css/app.css
tailwind.config.js
```
- Custom styles
- Theme colors

## 🎨 Adding a New Page

### Step 1: Create Vue Component

Create `resources/js/Pages/PhotoGallery.vue`:

```vue
<script setup>
import { Head } from '@inertiajs/vue3';
</script>

<template>
    <Head title="Photo Gallery" />
    
    <div class="min-h-screen bg-white py-20 px-6">
        <h1 class="text-4xl font-serif text-center mb-12">
            Our Photos
        </h1>
        <!-- Your gallery content -->
    </div>
</template>
```

### Step 2: Add Route

In `routes/web.php`:

```php
Route::get('/gallery', function () {
    return Inertia::render('PhotoGallery');
})->name('gallery');
```

### Step 3: Add Navigation Link

In your layout or component:

```vue
<Link :href="route('gallery')">Photo Gallery</Link>
```

## 📸 Adding Photos

1. Create folder:
```bash
mkdir -p public/images
```

2. Add your photos to `public/images/`

3. Use in Vue components:
```vue
<img src="/images/engagement.jpg" alt="Engagement Photo" />
```

## 🎯 RSVP Backend (Next Step)

To make RSVP actually save data:

### 1. Create Migration
```bash
php artisan make:migration create_rsvps_table
```

### 2. Define Schema
In the migration file:
```php
Schema::create('rsvps', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->enum('attendance', ['yes', 'no']);
    $table->integer('guest_count')->default(1);
    $table->text('dietary_restrictions')->nullable();
    $table->string('song_request')->nullable();
    $table->text('special_message')->nullable();
    $table->timestamps();
});
```

### 3. Run Migration
```bash
php artisan migrate
```

### 4. Create Model
```bash
php artisan make:model Rsvp
```

### 5. Create Controller
```bash
php artisan make:controller RsvpController
```

### 6. Add Route
```php
Route::post('/rsvp', [RsvpController::class, 'store'])->name('rsvp.store');
```

## 🎨 Customizing Colors

### In Tailwind (most common approach)

Change colors in your Vue components:

```vue
<!-- From pink-500 to blue-500 -->
<button class="bg-blue-500 text-white hover:bg-blue-600">
    Button
</button>
```

### Common Color Classes
- `bg-pink-500` - Pink background
- `bg-purple-500` - Purple background
- `bg-blue-500` - Blue background
- `text-gray-800` - Dark gray text
- `border-gray-300` - Light gray border

## 📧 Email Configuration

For password resets and notifications, update `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_ADDRESS="noreply@yourwedding.com"
MAIL_FROM_NAME="Our Wedding"
```

## 🐛 Troubleshooting

### Changes not showing?
```bash
# Clear cache
php artisan optimize:clear

# Hard refresh browser
# Mac: Cmd + Shift + R
# Windows: Ctrl + Shift + R
```

### npm install fails?
```bash
npm install --legacy-peer-deps
```

### Port already in use?
```bash
# Use different port
php artisan serve --port=8001
```

### Database errors?
```bash
php artisan migrate:fresh
```

### Vite not connecting?
Make sure `npm run dev` is running in a separate terminal.

## 📱 Testing on Mobile

1. Find your computer's IP address:
```bash
# Mac/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

2. Update `.env`:
```env
APP_URL=http://YOUR_IP:8000
```

3. Visit on phone: `http://YOUR_IP:8000`

## 🚀 Ready to Deploy?

### Pre-deployment Checklist

- [ ] Update `.env` for production
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Run `npm run build`
- [ ] Test all forms
- [ ] Configure email
- [ ] Set up SSL
- [ ] Test on mobile
- [ ] Backup database

### Deployment Commands

```bash
git pull origin main
composer install --no-dev --optimize-autoloader
npm install --legacy-peer-deps
npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🎉 Quick Wins

Easy features to add first:

1. **Countdown Timer**
   - Use JavaScript `Date` object
   - Calculate days until wedding

2. **Google Maps**
   - Embed iframe in venue section
   - Get embed code from Google Maps

3. **Social Media Icons**
   - Add links to Instagram/Facebook
   - Use your wedding hashtag

4. **Guest Messages**
   - Create a guestbook page
   - Store messages in database

## 📚 Learn More

- **Laravel Docs**: https://laravel.com/docs
- **Vue.js Docs**: https://vuejs.org/
- **Inertia.js Docs**: https://inertiajs.com/
- **Tailwind CSS**: https://tailwindcss.com/

## 💡 Tips

1. **Make frequent commits**
   ```bash
   git add .
   git commit -m "Added wedding date"
   ```

2. **Test on real devices** - Not just desktop

3. **Ask guests for feedback** - Friends can test

4. **Keep it simple** - Start with basics, add features later

5. **Have fun!** - This is for YOUR special day

---

## Need Help?

Check these files:
- `README.md` - Full documentation
- `QUICKSTART.md` - Quick reference
- `SETUP-COMPLETE.md` - Setup overview

**Good luck and congratulations! 🎊💑**
