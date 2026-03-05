# RSVP Page Troubleshooting 🔍

The RSVP page appears blank. Here's how to fix it:

## ✅ Step-by-Step Solution

### 1. Make Sure You're Logged In

The RSVP page requires authentication. You must be logged in to view it.

**Login Credentials:**
```
Email: admin@wedding.com
Password: password
```

**Login URL:**
```
http://localhost/login
```

### 2. Clear Browser Cache

Sometimes old cached files cause issues:

**Chrome/Edge:**
- Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or open DevTools (F12) → Right-click refresh → "Empty Cache and Hard Reload"

**Firefox:**
- Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

**Safari:**
- Press `Cmd+Option+R`

### 3. Check Browser Console

Open your browser's Developer Tools to see if there are JavaScript errors:

1. Press `F12` or right-click → "Inspect"
2. Go to the "Console" tab
3. Look for any red error messages
4. Share them if you see any

### 4. Verify Dev Server is Running

Make sure your Vite dev server is running:

```bash
./vendor/bin/sail npm run dev
```

You should see:
```
VITE v7.3.1  ready in XXXX ms
➜  Local:   http://localhost:5173/
```

### 5. Restart Everything (If Needed)

If nothing works, restart the services:

```bash
# Stop Vite dev server (Ctrl+C if running)

# Restart Sail
./vendor/bin/sail down
./vendor/bin/sail up -d

# Start Vite again
./vendor/bin/sail npm run dev
```

### 6. Check the URL

Make sure you're visiting the correct URL:

```
http://localhost/rsvp    ← Correct (port 80)
NOT
http://localhost:5173/rsvp  ← Wrong (this is Vite's port)
```

## 🔍 Common Issues

### Issue: "404 Not Found"
**Solution:** You're not logged in. Visit `/login` first.

### Issue: Blank white page
**Solution:** 
1. Check browser console for errors
2. Clear cache and hard refresh
3. Make sure you're logged in

### Issue: "Unauthenticated" or redirect to login
**Solution:** This is normal! Just login with the credentials above.

### Issue: "Server not responding"
**Solution:** Make sure Sail is running: `./vendor/bin/sail ps`

## 📋 Quick Checklist

- [ ] Sail containers are running (`./vendor/bin/sail ps`)
- [ ] Vite dev server is running (`npm run dev`)
- [ ] You're logged in at `/login`
- [ ] You're visiting `http://localhost/rsvp` (not :5173)
- [ ] Browser cache cleared (Ctrl+Shift+R)
- [ ] No errors in browser console (F12)

## 🎯 Test Sequence

Follow these steps in order:

```bash
# 1. Check Sail status
./vendor/bin/sail ps

# 2. Start dev server (if not running)
./vendor/bin/sail npm run dev

# 3. Open browser and visit in this order:
# - http://localhost           (should see welcome page)
# - http://localhost/login     (login with admin@wedding.com)
# - http://localhost/dashboard (should see dashboard)
# - http://localhost/rsvp      (should see RSVP form)
```

## 🐛 Debug Mode

If you still see a blank page, add this to check what's happening:

Open browser DevTools (F12) → Console tab → paste this:

```javascript
console.log('Page props:', window.page);
console.log('Auth user:', window.page?.props?.auth?.user);
```

This will show if you're authenticated and what data the page is receiving.

## 💡 What Should You See

When the RSVP page loads correctly, you should see:

1. **Navigation bar** at the top with:
   - Dashboard link
   - RSVP link
   - View RSVPs link
   - Your name dropdown (top right)

2. **Main content** with:
   - "We hope you can join us under the stars!" header
   - RSVP form with attendance options
   - Song request field
   - Special message textarea
   - Submit button

3. **Footer sections**:
   - Important Information (dress code, adults-only, etc.)
   - Gift Registry (cash preference info)

## 🔧 Technical Details

**Route:** `/rsvp`
**Controller:** `RsvpController@show`
**Middleware:** `auth`, `verified`
**View:** `resources/js/Pages/RSVP.vue`
**Layout:** `AuthenticatedLayout`

The page **requires** authentication, so if you're not logged in, you'll be redirected to the login page.

---

**Still having issues?** Check the browser console (F12) and look for JavaScript errors!
