# Railway.app Deployment Guide - Step by Step 🚀

Follow these steps to deploy your wedding website to Railway.app (FREE!)

## ✅ Prerequisites Completed

I've already created these files for you:
- ✅ `Procfile` - Tells Railway how to start your app
- ✅ `nixpacks.toml` - Build configuration
- ✅ `railway-deploy.sh` - Deployment script

## 📋 Step-by-Step Deployment

### Step 1: Commit Your Code to Git

Open your terminal and run these commands:

```bash
cd /Users/ianjaybronola/Projects/wedding

# Add all files to git
git add .

# Commit with a message
git commit -m "Initial commit - Wedding website ready for deployment"
```

### Step 2: Create GitHub Repository

1. **Go to GitHub.com** and login (create account if needed)

2. **Create new repository**:
   - Click the "+" icon (top right) → "New repository"
   - Repository name: `wedding-website`
   - Description: "Ian Jay & Karen Kate's Wedding Website"
   - Visibility: **Private** (recommended for wedding sites)
   - **DO NOT** check "Initialize with README" (we already have code)
   - Click "Create repository"

3. **Push your code to GitHub**:

   Copy the commands from GitHub (they'll look like this):
   
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/wedding-website.git
   git branch -M main
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your GitHub username and run the commands.

### Step 3: Sign Up for Railway

1. **Go to** [railway.app](https://railway.app)

2. **Click "Login"** (top right)

3. **Sign up with GitHub**:
   - Click "Login with GitHub"
   - Authorize Railway to access your GitHub
   - ✅ No credit card needed!

### Step 4: Create New Project on Railway

1. **Click "New Project"** (or "Create a New Project")

2. **Select "Deploy from GitHub repo"**

3. **Choose your repository**:
   - Find `wedding-website` in the list
   - Click on it

4. **Railway will start deploying** - Wait, it will fail first (normal!)

### Step 5: Add MySQL Database

1. **In your project**, click **"+ New"** button

2. **Select "Database"** → **"Add MySQL"**

3. **Railway creates the database** automatically

4. **Database is now linked** to your app! ✅

### Step 6: Configure Environment Variables

1. **Click on your Laravel service** (the one that's not MySQL)

2. **Go to "Variables" tab**

3. **Click "RAW Editor"** (easier to paste everything at once)

4. **Copy and paste this** (I'll help you fill in APP_KEY next):

```env
APP_NAME="Wedding Website"
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:REPLACE_THIS_IN_NEXT_STEP
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}

LOG_CHANNEL=stack
LOG_LEVEL=info

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
SESSION_DRIVER=database
SESSION_LIFETIME=120

VITE_APP_NAME="${APP_NAME}"
```

5. **Click "Save Changes"**

### Step 7: Generate APP_KEY

We need to generate a secure key for your app.

**Option A: Using Your Local Environment (Easiest)**

Run this command in your terminal:

```bash
php artisan key:generate --show
```

Copy the output (should look like: `base64:LONG_RANDOM_STRING`)

**Option B: Online Generator**

Go to: https://generate-random.org/laravel-key-generator
Copy the generated key

**Then:**
1. Go back to Railway
2. Click on your Laravel service → Variables
3. Find `APP_KEY`
4. Paste the generated key
5. Save

### Step 8: Generate Public URL

1. **Click on your Laravel service**

2. **Go to "Settings" tab**

3. **Scroll down to "Networking"**

4. **Click "Generate Domain"**

5. **Railway creates a public URL** like: `your-app-production.up.railway.app`

6. **Copy this URL** - this is your wedding website!

### Step 9: Run Database Migrations

After the app deploys successfully:

**Option A: Using Railway Dashboard**

1. Click on your Laravel service
2. Go to "Deployments" tab
3. Click on the latest deployment
4. Click "View Logs"
5. Look for migration messages

**Option B: Using Railway CLI (Advanced)**

Install Railway CLI:
```bash
npm install -g @railway/cli
```

Login and run migrations:
```bash
railway login
railway link
railway run php artisan migrate --force
railway run php artisan db:seed
```

### Step 10: Test Your Website! 🎉

1. **Open your Railway-generated URL** in a browser

2. **You should see your beautiful wedding website!**

3. **Test the admin login**:
   - Go to: `https://your-url.railway.app/login`
   - Email: `admin@wedding.com`
   - Password: `password`

4. **Try adding an invitee** and generating a QR code!

---

## 🎯 Quick Checklist

- [ ] Step 1: Commit code to Git ✅
- [ ] Step 2: Push to GitHub ✅
- [ ] Step 3: Sign up for Railway ✅
- [ ] Step 4: Deploy from GitHub ✅
- [ ] Step 5: Add MySQL database ✅
- [ ] Step 6: Set environment variables ✅
- [ ] Step 7: Generate APP_KEY ✅
- [ ] Step 8: Generate public URL ✅
- [ ] Step 9: Run migrations ✅
- [ ] Step 10: Test website ✅

---

## 🔧 Troubleshooting

### Issue: "500 Server Error"

**Solution:**
1. Check Railway logs: Service → Deployments → View Logs
2. Make sure APP_KEY is set correctly
3. Make sure database variables are set (they should auto-fill with ${{MySQL.*}})

### Issue: "Database connection error"

**Solution:**
1. Make sure MySQL service is running
2. Check that DB_HOST uses `${{MySQL.MYSQLHOST}}` (with double curly braces)
3. Redeploy after fixing variables

### Issue: "Migrations didn't run"

**Solution:**
1. Use Railway CLI:
   ```bash
   railway run php artisan migrate --force
   railway run php artisan db:seed
   ```

### Issue: "Assets not loading (CSS/JS)"

**Solution:**
1. Check that `npm run build` ran during deployment
2. Look at build logs in Railway
3. Redeploy if needed

### Issue: "Can't login"

**Solution:**
1. Run seeder to create admin user:
   ```bash
   railway run php artisan db:seed
   ```
2. Or create user manually via Railway CLI:
   ```bash
   railway run php artisan tinker
   # Then in tinker:
   User::create(['name' => 'Ian Jay', 'email' => 'admin@wedding.com', 'password' => bcrypt('password')])
   ```

---

## 🔄 Updating Your Site After Deployment

When you make changes:

1. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "Your change description"
   git push
   ```

2. **Railway automatically redeploys!** ✅

That's it! Railway watches your GitHub repo and auto-deploys on every push.

---

## 💰 Cost Monitoring

Railway gives you $5 credit per month (FREE).

**Your usage will be around $0.50-$2/month** (well within free tier):
- App: ~$0.30/month
- MySQL: ~$0.20/month
- Total: Under $1/month = FREE! ✅

**Check usage**:
1. Go to Railway dashboard
2. Click "Usage" (top right)
3. See your current month's usage

---

## 🎁 After Your Wedding

Once your wedding is over (after July 17, 2026):

**Option 1: Keep it as a memory** (still free within $5 credit)

**Option 2: Delete to free up resources**:
1. Go to Railway project
2. Click "Settings"
3. Scroll down → "Danger Zone"
4. Click "Delete Project"
5. Confirm

---

## 🆘 Need Help?

If you get stuck at any step:

1. **Check Railway logs** - Most errors are explained there
2. **Railway Discord** - Very helpful community
3. **Railway Docs** - https://docs.railway.app

---

## 🎉 That's It!

Your wedding website is now live and accessible from anywhere!

**Share your URL** with guests and they can scan QR codes to RSVP! 💍✨

---

## 📋 Quick Commands Reference

```bash
# Initial setup
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/wedding-website.git
git push -u origin main

# Generate APP_KEY locally
php artisan key:generate --show

# Update site (after initial deployment)
git add .
git commit -m "Update message"
git push

# Railway CLI commands (if needed)
railway login
railway link
railway run php artisan migrate --force
railway run php artisan db:seed
railway run php artisan tinker
```

**Your wedding website URL will be something like:**
`https://wedding-website-production.up.railway.app`

🎊 Congratulations! Your site is live! 🎊
