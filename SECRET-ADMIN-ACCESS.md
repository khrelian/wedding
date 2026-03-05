# Secret Admin Access 🔒

The login and registration links have been removed from the public welcome page to keep the admin area private.

## 🔐 Access Routes

### Login (Secret Route)
**URL:** `http://localhost/login`

Direct access only - no visible links on the home page.

### Register (Secret Route)
**URL:** `http://localhost/register`

Direct access only - for creating new admin accounts.

### Dashboard (After Login)
**URL:** `http://localhost/dashboard`

Accessible after successful authentication.

### RSVP Management (After Login)
**URL:** `http://localhost/rsvp`

Accessible after successful authentication.

## 🌐 Production URLs

When deployed to production, replace `localhost` with your domain:

```
https://yourweddingsite.com/login
https://yourweddingsite.com/register
https://yourweddingsite.com/dashboard
https://yourweddingsite.com/rsvp
```

## 🔒 Security Notes

1. **No Public Links**: The home page has no visible login/register buttons
2. **Direct URL Access**: Only accessible by typing the URL directly
3. **Route Protection**: Dashboard and RSVP routes are protected by authentication middleware
4. **Password Protection**: Standard Laravel authentication security

## 📝 Sharing Access

To share admin access with others:

1. **Option A**: Share the login URL directly
   ```
   http://localhost/login
   ```

2. **Option B**: Create an account for them
   - Visit `http://localhost/register`
   - Create their account
   - Share credentials via secure method (not email!)

## 🎯 Routes Overview

```
Public Routes:
├── / (Welcome page) - No auth required
│
Secret Admin Routes (Direct URL only):
├── /login - Authentication page
├── /register - User registration
│
Protected Routes (Auth required):
├── /dashboard - Admin dashboard
├── /rsvp - RSVP management
├── /profile - User profile settings
└── /profile/edit - Edit profile
```

## 🔑 Default Credentials

After first registration, you'll need to create an admin account:

1. Visit: `http://localhost/register`
2. Fill in your details
3. Create strong password
4. Login at: `http://localhost/login`

## 🛡️ Additional Security (Optional)

### Option 1: Custom Login Path

Change the login route in `routes/auth.php` to something less obvious:

```php
// Instead of /login, use /admin-portal or /secret-entrance
Route::get('/admin-portal', /* ... */)->name('login');
```

### Option 2: IP Whitelist

Add middleware to restrict login page to specific IPs (in production):

```php
Route::middleware(['ip.whitelist'])->group(function () {
    Route::get('/login', /* ... */);
});
```

### Option 3: Password-Protected Login Page

Add an extra layer - password protection before showing the login form.

## 📱 Accessing on Mobile

Simply type the URL in your mobile browser:
```
http://localhost/login
```

Or save as a bookmark for quick access.

## 🔗 Useful Bookmarks

Save these bookmarks for easy access:

1. **Admin Login**: `http://localhost/login`
2. **Dashboard**: `http://localhost/dashboard`
3. **RSVP Management**: `http://localhost/rsvp`

## ⚠️ Important Reminders

1. **Don't share login URL publicly** - Only with trusted administrators
2. **Use strong passwords** - Especially for production
3. **Enable 2FA** (optional) - For additional security in production
4. **Monitor login attempts** - Check Laravel logs for suspicious activity
5. **Regular backups** - Backup your database regularly

## 🚀 Quick Access (Bookmarklet)

Create a bookmarklet for instant access:

```javascript
javascript:(function(){window.location.href='http://localhost/login';})();
```

Save this as a bookmark in your browser for one-click access.

---

**Your admin area is now private and accessible only via direct URL!** 🔐✨
