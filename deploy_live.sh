#!/bin/bash
set -e

echo "========================================================"
echo "🚀 ScreenBoxBD Live Server Production Deployment"
echo "========================================================"
echo ""

# 1. Pull latest code from GitHub
echo "📥 1/4. Pulling latest commits from GitHub origin/main..."
git pull origin main

# 2. Backend database migration & cache clearing
echo ""
echo "🐘 2/4. Running PostgreSQL database migrations & clearing cache..."
cd backend
php artisan migrate --force
php artisan optimize:clear
php artisan config:cache
php artisan route:cache

# 3. Build optimized Next.js frontend
echo ""
echo "⚡ 3/4. Rebuilding Next.js 15 production bundle..."
cd ../frontend
npm install
npm run build

# 4. Restart production service
echo ""
echo "🔄 4/4. Reloading PM2 frontend service..."
if command -v pm2 &> /dev/null; then
    pm2 reload all || pm2 restart all
    echo "PM2 reload completed."
else
    echo "Notice: PM2 command not found, restart your frontend service manually if needed."
fi

echo ""
echo "========================================================"
echo "✅ Live deployment completed successfully!"
echo "   Site: https://screenboxbd.online"
echo "========================================================"
