# Laravel Sail Setup Complete! 🐳

Your wedding website now uses **Laravel Sail** - a Docker-based development environment!

## What Changed?

### Before (Traditional Setup)
```bash
# You needed to install locally:
- PHP 8.2+
- Composer
- MySQL/SQLite
- Node.js
- All PHP extensions
```

### Now (With Sail)
```bash
# You only need:
- Docker Desktop ✅

# Everything else runs in containers!
```

## ✅ What's Installed

Your Sail setup includes:

| Service | Version | Port | Description |
|---------|---------|------|-------------|
| **Laravel** | 12.x | 80 | PHP 8.5 + Laravel application |
| **MySQL** | 8.4 | 3306 | Database server |
| **Node.js** | 24.x | - | For npm/Vite |
| **Composer** | Latest | - | PHP package manager |
| **Vite** | 7.x | 5173 | Frontend dev server |

## 🚀 Quick Start

### 1. Start Everything

```bash
./vendor/bin/sail up -d
```

### 2. Start Frontend Dev Server

```bash
./vendor/bin/sail npm run dev
```

### 3. Visit Your Site

**http://localhost** - Your wedding website!

## 📋 Important Files Created/Modified

```
wedding/
├── compose.yaml          ⭐ NEW - Docker Compose configuration
├── .env                  ✏️  UPDATED - MySQL credentials for Sail
├── SAIL.md              ⭐ NEW - Complete Sail documentation
├── README.md            ✏️  UPDATED - Sail instructions added
├── QUICKSTART.md        ✏️  UPDATED - Sail quick start
└── vendor/laravel/sail/ ⭐ NEW - Sail package installed
```

## 🎯 Common Commands

### Container Management

```bash
# Start containers
./vendor/bin/sail up -d

# Stop containers
./vendor/bin/sail down

# Restart containers
./vendor/bin/sail restart

# View logs
./vendor/bin/sail logs -f
```

### Development

```bash
# Run migrations
./vendor/bin/sail artisan migrate

# Frontend dev server
./vendor/bin/sail npm run dev

# Build for production
./vendor/bin/sail npm run build

# Run tests
./vendor/bin/sail test

# Access container shell
./vendor/bin/sail shell
```

## 💡 Pro Tip: Create an Alias

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
alias sail='./vendor/bin/sail'
```

Then reload:

```bash
source ~/.zshrc
```

Now use short commands:

```bash
sail up -d
sail artisan migrate
sail npm run dev
sail down
```

## 🗄️ Database Info

### From Your Application
Already configured in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=mysql           # Docker container name
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=sail
DB_PASSWORD=password
```

### From Your Computer
Use these credentials in TablePlus, Sequel Ace, etc.:

```
Host: 127.0.0.1 (or localhost)
Port: 3306
Database: laravel
Username: sail
Password: password
```

## 📖 Documentation

We've created comprehensive documentation for you:

1. **SAIL.md** - Complete Sail guide
   - All commands explained
   - Troubleshooting
   - Tips and tricks

2. **README.md** - Updated with Sail instructions
   - Installation steps
   - Development workflow

3. **QUICKSTART.md** - Updated quick start
   - Fast getting started with Sail

## ⚙️ Configuration

### Change Ports

If port 80 is already in use, edit `.env`:

```env
APP_PORT=8000  # Change from 80 to 8000
```

Then restart:

```bash
./vendor/bin/sail down
./vendor/bin/sail up -d
```

### Add More Services

Want Redis, Memcached, or other services?

```bash
./vendor/bin/sail artisan sail:install

# Select additional services
# Then republish:
./vendor/bin/sail down
./vendor/bin/sail up -d
```

## 🔄 Migration from SQLite to MySQL

Your database configuration was automatically updated:

**Before:**
```env
DB_CONNECTION=sqlite
```

**Now:**
```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=sail
DB_PASSWORD=password
```

### Run Migrations

```bash
./vendor/bin/sail artisan migrate
```

This will create all the authentication tables in MySQL.

## 🎨 Frontend Development

Everything works the same, just prefix with `sail`:

```bash
# Instead of:
npm run dev

# Use:
./vendor/bin/sail npm run dev

# Or with alias:
sail npm run dev
```

## 🧪 Testing

```bash
# Run tests in container
./vendor/bin/sail test

# Run specific test
./vendor/bin/sail test --filter=ExampleTest

# With coverage
./vendor/bin/sail test --coverage
```

## 🐛 Troubleshooting

### Docker Desktop Not Running

**Error**: `Cannot connect to the Docker daemon`

**Fix**: Start Docker Desktop application

### Port Already in Use

**Error**: `Bind for 0.0.0.0:80 failed: port is already allocated`

**Fix**: Change APP_PORT in `.env` to 8000 or another free port

### Permission Issues

**Error**: `Permission denied`

**Fix**:
```bash
./vendor/bin/sail down
./vendor/bin/sail build --no-cache
./vendor/bin/sail up -d
```

### Database Connection Failed

**Error**: `SQLSTATE[HY000] [2002] Connection refused`

**Fix**: Make sure `DB_HOST=mysql` in `.env` and restart Sail

## 📊 System Resources

Sail containers use minimal resources:

- **CPU**: ~5-10% idle, ~20-30% during builds
- **Memory**: ~500MB-1GB
- **Disk**: ~2-3GB for images

You can monitor with:

```bash
docker stats
```

## 🎓 Learning Resources

- **[SAIL.md](SAIL.md)** - Your comprehensive Sail guide
- [Official Laravel Sail Docs](https://laravel.com/docs/sail)
- [Docker Documentation](https://docs.docker.com/)

## ✅ Verify Your Setup

Run these commands to verify everything works:

```bash
# 1. Check containers are running
docker ps

# Should show:
# - wedding-laravel.test-1
# - wedding-mysql-1

# 2. Test Laravel
./vendor/bin/sail artisan --version

# Should show: Laravel Framework 12.x

# 3. Test database
./vendor/bin/sail artisan migrate:status

# Should show migration tables

# 4. Test Node.js
./vendor/bin/sail node --version

# Should show: v24.x

# 5. Visit the site
# Open http://localhost in your browser
```

All checks should pass! ✅

## 🌟 Benefits of Using Sail

1. **Consistent Environment**
   - Same setup for all developers
   - No "works on my machine" issues

2. **Easy Onboarding**
   - New developers just need Docker
   - No complex local setup

3. **Isolated**
   - Doesn't interfere with other projects
   - Clean uninstall (just delete containers)

4. **Production-like**
   - Uses similar stack to production servers
   - Better testing environment

5. **Multiple Projects**
   - Run multiple Laravel projects simultaneously
   - Each on different ports

## 🚀 Next Steps

1. **Start Development**
   ```bash
   ./vendor/bin/sail up -d
   ./vendor/bin/sail npm run dev
   ```

2. **Customize Your Wedding Site**
   - Edit `config/wedding.php`
   - Update `resources/js/Pages/Welcome.vue`
   - Add your photos

3. **Build Features**
   - Create RSVP backend
   - Add photo gallery
   - Build guest list management

4. **Read Documentation**
   - Check out `SAIL.md` for detailed commands
   - Review `README.md` for project overview

---

## 🎉 You're All Set!

Your wedding website is now running on **Laravel Sail**!

**To start developing:**

```bash
./vendor/bin/sail up -d
./vendor/bin/sail npm run dev
```

**Then visit:** http://localhost

**Need help?** Check `SAIL.md` for comprehensive documentation.

---

**Congratulations on your upcoming wedding! 💍💕**

*Docker setup completed on: March 6, 2026*  
*Laravel Sail: Ready to go! 🐳*
