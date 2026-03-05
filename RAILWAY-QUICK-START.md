# 🔑 Your Railway Deployment Credentials

## App Key (IMPORTANT!)

**Copy this for Railway environment variables:**

```
APP_KEY=base64:oV//bzswl9Q05W0NaRC1grYCZIpjNwMHC8w/K4oFS/4=
```

## Login Credentials

After deployment, login with:

```
Email: admin@wedding.com
Password: password
```

⚠️ **Change the password after first login!**

## Railway Environment Variables Template

Copy this entire block when setting up Railway variables:

```env
APP_NAME="Wedding Website"
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:oV//bzswl9Q05W0NaRC1grYCZIpjNwMHC8w/K4oFS/4=
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

## Quick Start Commands

```bash
# 1. Commit your code
git add .
git commit -m "Ready for deployment"

# 2. Create GitHub repo and push
# (Follow steps in RAILWAY-DEPLOYMENT-STEPS.md)

# 3. Deploy on Railway
# - Sign up at railway.app
# - Deploy from GitHub
# - Add MySQL database
# - Paste environment variables above
# - Generate domain
# - Done!
```

## 🎯 Next Steps

1. ✅ Read `RAILWAY-DEPLOYMENT-STEPS.md` for detailed guide
2. ✅ Have your GitHub account ready
3. ✅ Have the APP_KEY above copied
4. ✅ Follow the 10 steps in the guide

## 🌐 After Deployment

Your website URL will be something like:
```
https://wedding-website-production.up.railway.app
```

Login page:
```
https://YOUR-URL.railway.app/login
```

## 📞 Need Help?

Refer to:
- `RAILWAY-DEPLOYMENT-STEPS.md` - Complete step-by-step guide
- Railway docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

---

**Everything is ready! Follow the steps in RAILWAY-DEPLOYMENT-STEPS.md to deploy! 🚀**
