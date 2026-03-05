# Admin Login Credentials 🔐

Your wedding website admin account has been created and is ready to use!

## 📧 Login Credentials

**Email:** `admin@wedding.com`  
**Password:** `password`

## 🔒 How to Login

### Step 1: Access the Secret Login Page
Visit: **http://localhost/login**

(Remember, there are no login buttons on the home page - it's a secret route!)

### Step 2: Enter Your Credentials
```
Email: admin@wedding.com
Password: password
```

### Step 3: Access Your Dashboard
After login, you'll be redirected to:
- **Dashboard:** http://localhost/dashboard
- **RSVP Management:** http://localhost/rsvp
- **Profile Settings:** http://localhost/profile

## 👤 User Details

```
Name: Ian Jay Broñola
Email: admin@wedding.com
Password: password
Role: Administrator
```

## 🔐 Security Recommendations

### For Development
The current password (`password`) is fine for local development.

### Before Production
**IMPORTANT:** Change your password before deploying to production!

1. **After logging in**, go to: http://localhost/profile
2. Click "Update Password"
3. Set a strong password with:
   - At least 8 characters
   - Mix of uppercase and lowercase
   - Numbers and special characters
   - Example: `Wedding2026@IanKaren!`

## 🚀 Quick Access

**Development URLs:**
```
Home Page:     http://localhost
Secret Login:  http://localhost/login
Dashboard:     http://localhost/dashboard (after login)
RSVP:          http://localhost/rsvp (after login)
Profile:       http://localhost/profile (after login)
```

**Production URLs (when deployed):**
```
Home Page:     https://yourweddingsite.com
Secret Login:  https://yourweddingsite.com/login
Dashboard:     https://yourweddingsite.com/dashboard
```

## 👥 Creating Additional Users

If you want Karen Kate or others to have access:

### Option 1: Via Registration Page
1. Visit: http://localhost/register
2. Fill in their details
3. They can then login

### Option 2: Via Database Seeder
Edit `database/seeders/DatabaseSeeder.php` and add:

```php
User::factory()->create([
    'name' => 'Karen Kate Seronay',
    'email' => 'karen@wedding.com',
    'password' => bcrypt('password'),
]);
```

Then run:
```bash
./vendor/bin/sail artisan db:seed
```

## 🔄 Resetting the Database

If you need to start fresh:

```bash
# Reset database and re-seed
./vendor/bin/sail artisan migrate:fresh --seed
```

This will:
1. Drop all tables
2. Run all migrations
3. Create the admin user again

## 🛡️ Account Security Features

Your Laravel Breeze setup includes:
- ✅ Secure password hashing (bcrypt)
- ✅ Email verification (optional)
- ✅ Password reset functionality
- ✅ Session management
- ✅ CSRF protection
- ✅ Remember me functionality

## 📝 What You Can Do After Login

### Dashboard
- View overview of your wedding website
- Quick links to manage content

### RSVP Management
- View and manage guest RSVPs (when implemented)
- Track attendance
- Manage dietary requirements

### Profile Settings
- Update your name
- Change your email
- Update your password
- Delete your account (if needed)

## 🚨 Troubleshooting

### "Invalid credentials" error
- Make sure you're using `admin@wedding.com` (not admin@example.com)
- Password is case-sensitive: `password` (all lowercase)
- Clear your browser cache if you previously tried other credentials

### Can't access login page
- Make sure your server is running: `./vendor/bin/sail up -d`
- Visit the full URL: http://localhost/login
- Check that port 80 is accessible

### Forgot password?
If you forget your password, you can:
1. Use the "Forgot Password" link on the login page (requires email setup)
2. Or reset the database: `./vendor/bin/sail artisan migrate:fresh --seed`

## 📧 Email Configuration (Optional)

To enable password reset emails, update `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_ADDRESS="noreply@ianandkaren.com"
MAIL_FROM_NAME="Ian & Karen's Wedding"
```

---

## ✅ Quick Test

1. **Visit:** http://localhost/login
2. **Email:** admin@wedding.com
3. **Password:** password
4. **Click:** Log In
5. **Success!** You should see the dashboard

---

**Your admin account is ready! You can now login and manage your wedding website!** 🎉

*User created: March 6, 2026*  
*Login URL: http://localhost/login*  
*Default password: password*
