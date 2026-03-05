# Wedding Website Deployment Guide 🚀

Multiple deployment options for your Laravel wedding website, from easiest to most complex.

## 🏆 RECOMMENDED: Railway.app (FREE & Easy)

### Why Railway?
- ✅ $5/month free credit (forever)
- ✅ Includes MySQL database
- ✅ One-click deployment from GitHub
- ✅ Automatic HTTPS
- ✅ No credit card required
- ✅ Perfect for temporary events like weddings

### Estimated Monthly Cost: **$0** (within free tier)

---

## Option 1: Railway.app Deployment

### Step 1: Prepare Your Code

1. **Initialize Git** (if not already done):
```bash
cd /Users/ianjaybronola/Projects/wedding
git init
git add .
git commit -m "Initial commit - Wedding website"
```

2. **Create GitHub Repository**:
- Go to github.com
- Create new repository: `wedding-website`
- Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/wedding-website.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Railway

1. **Sign up**: Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `wedding-website` repository

3. **Add MySQL Database**:
   - Click "+ New"
   - Select "Database" → "MySQL"
   - Railway automatically connects it to your app

4. **Set Environment Variables**:
   Click on your Laravel service → "Variables" → Add:
   ```
   APP_NAME="Wedding Website"
   APP_ENV=production
   APP_KEY=base64:YOUR_KEY_HERE (run: php artisan key:generate --show)
   APP_DEBUG=false
   APP_URL=https://YOUR-APP.railway.app
   
   DB_CONNECTION=mysql
   DB_HOST=${{MySQL.MYSQL_HOST}}
   DB_PORT=${{MySQL.MYSQL_PORT}}
   DB_DATABASE=${{MySQL.MYSQL_DATABASE}}
   DB_USERNAME=${{MySQL.MYSQL_USER}}
   DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
   
   SESSION_DRIVER=database
   QUEUE_CONNECTION=database
   ```

5. **Deploy**:
   - Railway automatically builds and deploys
   - Wait 2-5 minutes
   - Your site will be live!

6. **Run Migrations**:
   - Open Railway dashboard
   - Go to your Laravel service
   - Click "Settings" → "Service" → "Deploy logs"
   - Or use Railway CLI:
   ```bash
   railway run php artisan migrate --force
   railway run php artisan db:seed
   ```

### Step 3: Set Custom Domain (Optional)

1. **In Railway**:
   - Go to your service
   - Click "Settings" → "Networking"
   - Click "Generate Domain"
   - Or add your custom domain

2. **Your wedding site is now live!** 🎉

---

## Option 2: Render.com Deployment

### Step 1: Prepare Code (Same as Railway)

### Step 2: Deploy to Render

1. **Sign up**: [render.com](https://render.com)

2. **Create PostgreSQL Database**:
   - Click "New +" → "PostgreSQL"
   - Choose "Free" tier
   - Copy the database URL

3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Build Command**: `composer install && php artisan migrate --force`
     - **Start Command**: `php artisan serve --host=0.0.0.0 --port=$PORT`

4. **Set Environment Variables**:
   ```
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://YOUR-APP.onrender.com
   DATABASE_URL=your_postgres_url_from_step2
   ```

5. **Deploy**: Render builds and deploys automatically

---

## Option 3: AWS Free Tier Deployment

### ⚠️ Warning: Complex Setup, Free for 12 months only

### Step 1: Create AWS Account
- Sign up at [aws.amazon.com](https://aws.amazon.com)
- Requires credit card (won't charge on free tier)

### Step 2: Launch EC2 Instance

1. **Go to EC2 Dashboard**
2. **Launch Instance**:
   - AMI: Ubuntu 22.04 LTS
   - Instance type: **t2.micro** (free tier)
   - Create key pair (save .pem file)
   - Security group: Allow SSH (22), HTTP (80), HTTPS (443)

### Step 3: Create RDS MySQL Database

1. **Go to RDS Dashboard**
2. **Create Database**:
   - Engine: MySQL 8.0
   - Template: **Free tier**
   - DB instance: **db.t2.micro**
   - Storage: 20 GB
   - Set master password
   - Public access: Yes
   - Security group: Allow port 3306

### Step 4: Connect to EC2 and Install Software

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.2 php8.2-cli php8.2-fpm php8.2-mysql php8.2-xml php8.2-curl php8.2-mbstring php8.2-zip php8.2-gd

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Nginx
sudo apt install -y nginx

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Step 5: Deploy Your Application

```bash
# Clone your repository
cd /var/www
sudo git clone https://github.com/YOUR_USERNAME/wedding-website.git
cd wedding-website

# Install dependencies
sudo composer install --no-dev --optimize-autoloader
sudo npm install
sudo npm run build

# Set permissions
sudo chown -R www-data:www-data /var/www/wedding-website
sudo chmod -R 755 /var/www/wedding-website/storage

# Configure .env
sudo cp .env.example .env
sudo nano .env
# Add your RDS database credentials

# Generate key
sudo php artisan key:generate

# Run migrations
sudo php artisan migrate --force
sudo php artisan db:seed
```

### Step 6: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/wedding
```

Add:
```nginx
server {
    listen 80;
    server_name your-ec2-ip;
    root /var/www/wedding-website/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/wedding /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Set Up SSL (Free with Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Monthly Cost After Free Tier Ends (12 months):
- EC2 t2.micro: ~$8/month
- RDS db.t2.micro: ~$15/month
- Data transfer: ~$2-5/month
- **Total: $25-28/month**

---

## Option 4: AWS Lightsail (Simplest AWS Option)

### Cost: **$3.50/month** (Not free, but cheapest AWS option)

### Step 1: Create Lightsail Instance

1. Go to [lightsail.aws.amazon.com](https://lightsail.aws.amazon.com)
2. Click "Create instance"
3. Choose:
   - Platform: Linux/Unix
   - Blueprint: **LAMP (PHP 8)**
   - Plan: **$3.50/month**

### Step 2: Deploy Application

1. **SSH into instance** (browser-based terminal)

2. **Remove default Apache setup**:
```bash
cd /opt/bitnami/apache/htdocs
sudo rm -rf *
```

3. **Clone and setup**:
```bash
git clone https://github.com/YOUR_USERNAME/wedding-website.git .
composer install --no-dev
npm install && npm run build
cp .env.example .env
php artisan key:generate
php artisan migrate --force
```

4. **Configure database** (MySQL included in LAMP stack)

5. **Done!** Access via Lightsail IP

---

## 💰 Cost Comparison Summary

| Option | Monthly Cost | Setup Time | Difficulty | Best For |
|--------|--------------|------------|------------|----------|
| **Railway** | **$0** | 15 min | ⭐ Easy | **Recommended!** |
| **Render** | **$0** | 20 min | ⭐⭐ Medium | Alternative |
| **Fly.io** | **$0** | 30 min | ⭐⭐⭐ Complex | Tech users |
| **AWS Free Tier** | **$0** (12mo) then $25+ | 2-3 hours | ⭐⭐⭐⭐ Very Hard | Learning AWS |
| **AWS Lightsail** | **$3.50** | 45 min | ⭐⭐ Medium | Simple AWS |

---

## 🎯 My Recommendation

### For Your Wedding Website:

**Use Railway.app** because:
1. ✅ Completely FREE for your traffic level
2. ✅ 15-minute setup (vs 2-3 hours for AWS)
3. ✅ Automatic deployments from GitHub
4. ✅ Includes MySQL database
5. ✅ After July 17, 2026 - just delete it!

### When to Use AWS:
- ❌ NOT for a temporary wedding website
- ✅ If you're learning AWS for work
- ✅ If you need more than free tier resources
- ✅ For production apps with high traffic

---

## 🚀 Quick Start: Railway Deployment

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Wedding website"
git remote add origin https://github.com/YOUR_USERNAME/wedding-website.git
git push -u origin main

# 2. Go to railway.app
# 3. Sign up with GitHub
# 4. Click "Deploy from GitHub"
# 5. Select your repository
# 6. Add MySQL database
# 7. Set environment variables (see above)
# 8. Deploy!

# Done! Your site is live in 15 minutes! 🎉
```

---

## 📞 Need Help?

If you choose Railway or Render and need help with deployment, I can:
1. Create the deployment configuration files
2. Set up GitHub Actions for auto-deployment
3. Help configure environment variables
4. Set up custom domain

Just let me know which platform you'd like to use! 🚀
