# 🎬 ScreenBoxbd - Live TV & Movie Streaming Platform

ScreenBoxbd is a high-performance streaming platform built with **Next.js 15 (Frontend)** and **Laravel 11 with Filament v3 (Backend API & Admin Panel)**, powered by **PostgreSQL 16** and **Cloudflare Tunnel**.

## 🚀 Key Features
- **Live TV (BDIX / IPTV):** Smooth HLS / M3U8 video streaming with Artplayer.js and category filtering.
- **Movies & Series (VOD):** TMDB 1-click import, multi-server stream switching (HLS / MP4 / Embed), trailer playback, and cast information.
- **Custom Headless Architecture:** Completely decoupled frontend and backend.
- **Modern Admin Panel:** Filament v3 dashboard for channel management, categories, banner ads, and system settings.
- **Cloudflare Zero Trust Tunnel:** Secure public exposure with SSL without requiring public static IP or open firewall ports.

---

## 🛠️ Tech Stack
- **Frontend:** Next.js 15, React 19, Tailwind CSS, Lucide Icons, Artplayer.js, Hls.js
- **Backend:** Laravel 11, Filament v3, PHP 8.3
- **Database:** PostgreSQL 16
- **Reverse Proxy:** Nginx
- **Process Manager:** PM2

---

## 💻 Local Development Setup

### 1. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000
```
- Admin Panel: `http://localhost:8000/admin`
- Default Admin: `admin@streamtv.test`
- Default Password: `Password123#`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev -- -p 3000
```
- Frontend UI: `http://localhost:3000`

---

## 🌐 Production Deployment
The production deployment runs 24/7 on Ubuntu 24.04 with PM2 managing the Next.js frontend (Port 3005), Nginx serving Laravel 11 via PHP-FPM socket, PostgreSQL 16 as the primary database, and Cloudflare Tunnel routing traffic for `screenboxbd.online`.
