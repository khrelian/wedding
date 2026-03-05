# Laravel Sail Setup - Docker-based Backend

Your wedding website now uses **Laravel Sail** - a Docker-based development environment that provides a complete backend setup without requiring local PHP, MySQL, or other dependencies.

## What is Laravel Sail?

Laravel Sail is a light-weight command-line interface for interacting with Laravel's default Docker development environment. It provides:

- **PHP 8.5** in a Docker container
- **MySQL 8.4** database server
- **Node.js** and npm for frontend builds
- **Redis, Memcached** (if needed)
- Everything pre-configured and ready to use!

## Prerequisites

You only need **Docker Desktop** installed:

### Install Docker Desktop

**Mac:**
```bash
# Download from: https://www.docker.com/products/docker-desktop
# Or install via Homebrew:
brew install --cask docker
```

**Windows:**
```bash
# Download from: https://www.docker.com/products/docker-desktop
```

**Linux:**
```bash
# Follow instructions at: https://docs.docker.com/engine/install/
```

After installing, **start Docker Desktop** before using Sail.

## 🚀 Getting Started with Sail

### 1. Start the Docker Containers

```bash
./vendor/bin/sail up
```

Or run in the background (detached mode):

```bash
./vendor/bin/sail up -d
```

This will start:
- Laravel application (http://localhost)
- MySQL database
- Vite dev server (http://localhost:5173)

**First Time**: Docker will pull images (this takes a few minutes).

### 2. Visit Your Wedding Website

Open your browser to:
- **http://localhost** - Your wedding website
- **http://localhost:5173** - Vite dev server (hot reload)

### 3. Stop the Containers

```bash
./vendor/bin/sail down
```

## 📦 What's Included

Your Sail setup includes:

```yaml
Services:
  - laravel.test (PHP 8.5 + Laravel)
  - mysql (MySQL 8.4 database)

Ports:
  - 80: Laravel application
  - 5173: Vite dev server
  - 3306: MySQL database

Volumes:
  - Project synced to /var/www/html
  - MySQL data persisted
```

## 🛠️ Common Sail Commands

### Application Commands

```bash
# Start containers
./vendor/bin/sail up

# Start in background
./vendor/bin/sail up -d

# Stop containers
./vendor/bin/sail down

# Restart containers
./vendor/bin/sail restart

# View logs
./vendor/bin/sail logs

# Follow logs in real-time
./vendor/bin/sail logs -f
```

### Laravel Artisan Commands

```bash
# Run migrations
./vendor/bin/sail artisan migrate

# Create a controller
./vendor/bin/sail artisan make:controller WeddingController

# Clear cache
./vendor/bin/sail artisan cache:clear

# Run tinker (interactive console)
./vendor/bin/sail artisan tinker

# View all artisan commands
./vendor/bin/sail artisan list
```

### Composer Commands

```bash
# Install PHP dependencies
./vendor/bin/sail composer install

# Add a new package
./vendor/bin/sail composer require vendor/package

# Update dependencies
./vendor/bin/sail composer update
```

### NPM Commands

```bash
# Install Node dependencies
./vendor/bin/sail npm install

# Run Vite dev server
./vendor/bin/sail npm run dev

# Build for production
./vendor/bin/sail npm run build
```

### Database Commands

```bash
# Run migrations
./vendor/bin/sail artisan migrate

# Rollback migrations
./vendor/bin/sail artisan migrate:rollback

# Reset and re-run all migrations
./vendor/bin/sail artisan migrate:fresh

# Seed the database
./vendor/bin/sail artisan db:seed
```

### Testing

```bash
# Run PHPUnit tests
./vendor/bin/sail test

# Run specific test
./vendor/bin/sail test --filter=ExampleTest
```

### Shell Access

```bash
# Access Laravel container shell
./vendor/bin/sail shell

# Access MySQL command line
./vendor/bin/sail mysql

# Access root shell
./vendor/bin/sail root-shell
```

## 💡 Create a Shortcut Alias

Instead of typing `./vendor/bin/sail` every time, create an alias:

### Bash/Zsh (Mac/Linux)

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
alias sail='./vendor/bin/sail'
```

Then reload:

```bash
source ~/.zshrc  # or source ~/.bashrc
```

Now you can just use:

```bash
sail up
sail artisan migrate
sail npm run dev
```

### Windows PowerShell

Add to your PowerShell profile:

```powershell
function sail { ./vendor/bin/sail @args }
```

## 🔧 Configuration

### Environment Variables

Sail-specific variables in `.env`:

```env
# Database Configuration (automatically set)
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=sail
DB_PASSWORD=password

# Sail ports (optional)
APP_PORT=80
VITE_PORT=5173
FORWARD_DB_PORT=3306
```

### Change Ports

If port 80 is already in use, update `.env`:

```env
APP_PORT=8000
```

Then restart Sail:

```bash
./vendor/bin/sail down
./vendor/bin/sail up -d
```

### Database Access

**From Your Application**: Use `DB_HOST=mysql` (container name)

**From Your Computer** (e.g., TablePlus, Sequel Ace):
```
Host: 127.0.0.1 or localhost
Port: 3306
Database: laravel
Username: sail
Password: password
```

## 📁 Project Structure

Your project is mounted at `/var/www/html` inside the container:

```
/var/www/html
├── app/
├── resources/
├── public/
└── ... (your Laravel project)
```

Any changes you make on your computer are instantly reflected in the container!

## 🔄 Development Workflow

### Typical Day-to-Day

1. **Morning** - Start Sail:
   ```bash
   sail up -d
   ```

2. **Development** - Your normal workflow:
   - Edit files in your IDE
   - Visit http://localhost to see changes
   - Run `sail artisan` commands as needed

3. **Frontend Development**:
   ```bash
   sail npm run dev
   ```
   (Vite will hot-reload your changes)

4. **Evening** - Stop Sail (optional):
   ```bash
   sail down
   ```

### Full Development Command

Start everything at once:

```bash
./vendor/bin/sail up -d && ./vendor/bin/sail npm run dev
```

## 🐛 Troubleshooting

### Docker Not Running

**Error**: `Cannot connect to the Docker daemon`

**Solution**: Start Docker Desktop

### Port Already in Use

**Error**: `Port 80 is already allocated`

**Solution**: Change the port in `.env`:

```env
APP_PORT=8080
```

### MySQL Connection Issues

**Error**: `SQLSTATE[HY000] [2002] Connection refused`

**Solution**: 
1. Make sure DB_HOST=mysql in `.env`
2. Restart Sail:
   ```bash
   sail down
   sail up -d
   ```

### Permission Issues

**Error**: `Permission denied`

**Solution**: 
```bash
sail down
sail build --no-cache
sail up -d
```

### Clear Everything and Start Fresh

```bash
# Stop and remove all containers
sail down -v

# Remove Docker volumes
docker volume rm wedding_sail-mysql

# Start fresh
sail up -d
sail artisan migrate
```

### View Logs

```bash
# All logs
sail logs

# Just Laravel app logs
sail logs laravel.test

# Follow logs live
sail logs -f
```

## 🚀 Production Deployment

**Important**: Sail is for development only. For production, use:

- Traditional VPS (DigitalOcean, Linode, etc.)
- Laravel Forge
- Laravel Vapor (serverless)
- Platform.sh
- Heroku

Sail containers are not optimized for production use.

## 📚 Additional Resources

- [Laravel Sail Documentation](https://laravel.com/docs/sail)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🎯 Quick Reference Card

```bash
# Start
sail up -d

# Stop
sail down

# Restart
sail restart

# Run migrations
sail artisan migrate

# Frontend dev
sail npm run dev

# Build frontend
sail npm run build

# Run tests
sail test

# Shell access
sail shell

# MySQL access
sail mysql

# View logs
sail logs -f

# Artisan commands
sail artisan [command]

# Composer commands
sail composer [command]

# NPM commands
sail npm [command]
```

## ✅ Verify Your Setup

Run this checklist after starting Sail:

```bash
# 1. Check containers are running
docker ps

# 2. Check Laravel is accessible
curl http://localhost

# 3. Check database connection
sail artisan migrate:status

# 4. Check Node.js is available
sail node --version

# 5. Check Composer is available
sail composer --version
```

All commands should work without errors!

---

## 🆚 Sail vs Traditional Setup

### Before (Traditional):
```bash
# Required on your machine:
- Install PHP 8.2+
- Install MySQL
- Install Composer
- Install Node.js
- Configure everything manually
```

### Now (With Sail):
```bash
# Only required:
- Docker Desktop

# Everything else is in containers!
sail up
```

---

**You're all set! 🎉**

Start developing with:

```bash
./vendor/bin/sail up -d
./vendor/bin/sail npm run dev
```

Then visit **http://localhost**

Happy coding and congratulations on your wedding! 💍
