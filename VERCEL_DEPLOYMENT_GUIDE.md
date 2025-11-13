# 🚀 Complete Vercel Deployment Guide

## Overview
This guide will help you deploy both frontend and backend to Vercel with working Google OAuth login.

---

## Option 1: Frontend + Backend on Same Vercel Domain (Recommended)

### Best for: Simple deployment with single domain

#### Step 1: Prepare Backend for Serverless
The backend is already configured with `vercel.json` in the backend folder.

#### Step 2: Create Monorepo Structure
Your current structure works as-is!
```
Courses/
├── src/              # Frontend
├── backend/          # Backend API
├── vercel.json       # Frontend config
└── backend/vercel.json # Backend config
```

#### Step 3: Deploy to Vercel

**Push to GitHub:**
```bash
git add -A
git commit -m "Ready for Vercel deployment"
git push origin main
```

**In Vercel Dashboard:**
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **Framework Preset:** React
4. **Root Directory:** . (root)
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist`
7. **Install Command:** `npm install`

**Add Environment Variables in Vercel:**
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_BACKEND_URL=          # Leave empty - backend on same domain
```

#### Step 4: Configure Google OAuth

**In Google Cloud Console:**
1. Go to Credentials → Edit OAuth 2.0 Client
2. Add **Authorized JavaScript origins:**
   ```
   https://your-domain.vercel.app
   ```
3. Add **Authorized redirect URIs:**
   ```
   https://your-domain.vercel.app/login
   https://your-domain.vercel.app/auth/google-signin
   ```

#### Step 5: Deploy Backend to Vercel

**Option A: Deploy as separate service**
1. In Vercel, go to Add New → Project
2. Select the same repository
3. **Root Directory:** `backend`
4. **Build Command:** Leave empty (or `npm install`)
5. **Output Directory:** Leave empty
6. **Environment Variables:**
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   JWT_SECRET=your_jwt_secret_change_this
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   NODE_ENV=production
   DB_HOST=your_database_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   ```

**Option B: Deploy as same app (advanced)**
See "Both on Same Domain" section below.

---

## Option 2: Frontend Only (Backend Elsewhere)

Use this if backend is on a different platform (Railway, Render, etc.)

### Step 1: Deploy Frontend to Vercel
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_BACKEND_URL=https://your-backend-url.com
```

### Step 2: Configure Google OAuth
Add both frontend and backend domains:
```
Authorized JavaScript origins:
- https://your-frontend.vercel.app

Authorized redirect URIs:
- https://your-frontend.vercel.app/login
- https://your-backend-url.com/auth/google-signin
```

---

## Step-by-Step Deployment Process

### 1. Prepare Your Project

```bash
# Update .env files
cp .env.example .env
cp backend/.env.example backend/.env

# Edit .env
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_BACKEND_URL=          # Leave empty for same domain

# Edit backend/.env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
JWT_SECRET=your_jwt_secret_change_this
FRONTEND_URL=https://your-domain.vercel.app
DB_HOST=your_db_host
```

### 2. Verify Locally

```bash
# Test frontend
npm run dev

# In another terminal, test backend
cd backend
npm start

# Visit http://localhost:5173 and test login
```

### 3. Push to GitHub

```bash
git add .env.example backend/.env.example
git commit -m "Update env configs for Vercel"
git push origin main
```

### 4. Create Vercel Project

**For Frontend:**
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Settings:
   - Framework: React
   - Root: . (root)
   - Build: `npm run build`
   - Output: `dist`
5. Add Environment Variables (don't commit .env file!)
6. Deploy

**For Backend (if separate):**
1. Click "Add New" → "Project" 
2. Same repository
3. Settings:
   - Root: `backend`
   - Build: Leave empty
   - Output: Leave empty
4. Add Environment Variables
5. Deploy

### 5. Configure Google OAuth

**In Google Cloud Console:**
1. APIs & Services → Credentials
2. Edit Web Application Client
3. Add your Vercel domain(s) to:
   - Authorized JavaScript origins
   - Authorized redirect URIs

### 6. Test Deployment

1. Visit your Vercel domain
2. Click Login
3. Should redirect to Google OAuth
4. After login, should redirect back to home

---

## Troubleshooting

### "CORS error on frontend"
- Check `VITE_BACKEND_URL` environment variable
- Verify backend CORS settings include frontend domain
- Check browser console for exact error

### "OAuth origin not allowed"
- Verify domain is in Google Cloud Console
- Check for typos (http vs https, www, trailing slash)
- Wait a few minutes for changes to propagate

### "Login successful but redirect fails"
- Check backend logs in Vercel
- Verify JWT_SECRET is set in backend
- Check localStorage for auth token

### "Database connection error"
- Verify DB credentials in backend .env
- Check database is accessible from Vercel (IP whitelist)
- Check connection string format

### "Backend not responding"
- Check backend Vercel deployment status
- Verify backend environment variables
- Check backend logs for errors

---

## Environment Variables Reference

### Frontend (.env in root)
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_BACKEND_URL=http://localhost:4000    # For local dev
                                           # Leave empty for same domain on Vercel
```

### Backend (.env in backend/)
```env
# Database
DB_HOST=your_database_host
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name

# Server
PORT=3001
NODE_ENV=production

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret_minimum_32_chars

# Frontend (for CORS)
FRONTEND_URL=https://your-vercel-domain.app
```

---

## Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] Vercel project created for frontend
- [ ] Vercel project created for backend (if separate)
- [ ] Environment variables set in Vercel dashboard
- [ ] Google OAuth client ID configured
- [ ] Authorized origins added in Google Cloud Console
- [ ] Authorized redirect URIs added in Google Cloud Console
- [ ] Database accessible from Vercel
- [ ] Frontend deployment successful
- [ ] Backend deployment successful
- [ ] Login works on production domain
- [ ] User data saves to database

---

## Production Best Practices

1. **Security:**
   - Use strong JWT_SECRET (min 32 chars)
   - Enable database user permissions
   - Use HTTPS (automatic on Vercel)
   - Rotate secrets regularly

2. **Performance:**
   - Monitor Vercel dashboard
   - Check database query performance
   - Enable caching headers
   - Use CDN for static assets

3. **Monitoring:**
   - Set up error tracking
   - Monitor API response times
   - Check logs regularly
   - Set up alerts

4. **Database:**
   - Regular backups
   - Monitor connection pool
   - Index frequently queried columns
   - Clean up old sessions regularly

---

## Quick Links

- Vercel Dashboard: https://vercel.com/dashboard
- Google Cloud Console: https://console.cloud.google.com
- Vercel Docs: https://vercel.com/docs
- OAuth Troubleshooting: See GOOGLE_OAUTH_VERCEL_FIX.md

---

## Need Help?

1. Check Vercel logs: Dashboard → Deployment → Logs
2. Check browser console: F12 → Console tab
3. Check backend logs: Vercel dashboard → Backend project → Logs
4. Search GOOGLE_OAUTH_VERCEL_FIX.md for common issues

---

**Ready to deploy? Let's go! 🚀**
