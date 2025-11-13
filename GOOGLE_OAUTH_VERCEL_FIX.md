# 🔧 Google OAuth 2.0 Fix for Vercel Deployment

## Problem
```
You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy.
If you're the app developer, register the JavaScript origin in the Google Cloud Console.
```

This error occurs because your Vercel domain is not registered in Google Cloud Console.

---

## Solution: Step-by-Step Guide

### Step 1: Get Your Vercel Domain
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project "Courses"
3. Copy your production domain (e.g., `courses-xxx.vercel.app`)

### Step 2: Access Google Cloud Console
1. Go to https://console.cloud.google.com
2. Select your project
3. Go to **APIs & Services** → **Credentials**

### Step 3: Update OAuth 2.0 Client ID

**Find your OAuth 2.0 Client:**
- Look for the Web application client ID
- Click on it to edit

**Add Authorized JavaScript Origins:**
1. Click **Edit OAuth client**
2. Go to **Authorized JavaScript origins**
3. Add these entries:
   ```
   http://localhost:3000
   http://localhost:5173
   https://your-vercel-domain.vercel.app
   ```

**Add Authorized Redirect URIs:**
1. Go to **Authorized redirect URIs**
2. Add:
   ```
   http://localhost:3000/login
   http://localhost:5173/login
   https://your-vercel-domain.vercel.app/login
   ```

3. Click **SAVE**

### Step 4: Update Environment Variables in Vercel

1. Go to your Vercel project settings
2. Go to **Settings** → **Environment Variables**
3. Update the variables:

```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_BACKEND_URL=https://your-backend-url.com
```

**Or if using same domain:**
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_BACKEND_URL=https://your-vercel-domain.vercel.app/api
```

### Step 5: Redeploy to Vercel
1. Go to **Deployments** in Vercel
2. Click the **...** menu on the latest deployment
3. Select **Redeploy**
4. Wait for the deployment to complete

---

## Complete Environment Setup

### Local Development (.env)
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_BACKEND_URL=http://localhost:4000
```

### Production (Vercel Environment Variables)
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_BACKEND_URL=https://your-backend-url.com
```

---

## Google Cloud Console Configuration

### For Development
- **JavaScript Origins:**
  - http://localhost:3000
  - http://localhost:5173
  - http://127.0.0.1:5173

- **Redirect URIs:**
  - http://localhost:3000/login
  - http://localhost:5173/login
  - http://127.0.0.1:5173/login

### For Production
- **JavaScript Origins:**
  - https://courses-xxx.vercel.app
  - https://your-custom-domain.com (if you have one)

- **Redirect URIs:**
  - https://courses-xxx.vercel.app/login
  - https://your-custom-domain.com/login (if you have one)

---

## Backend Configuration

### Backend Environment Variables (.env)
```env
PORT=4000
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

### CORS Configuration in Backend
Update `backend/server.js`:

```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://courses-xxx.vercel.app',
  'https://your-custom-domain.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

## Verification Checklist

- [ ] Google Cloud Console has all 3 JavaScript origins registered
- [ ] Google Cloud Console has all 3 Redirect URIs registered
- [ ] Vercel environment variables are set correctly
- [ ] Backend CORS configuration allows Vercel domain
- [ ] Backend environment variables include Vercel domain
- [ ] Vercel deployment is redeployed after changing env vars
- [ ] Testing on Vercel domain works without errors

---

## Testing the Fix

### 1. Test Locally First
```bash
cd frontend
npm run dev
# Visit http://localhost:5173/login
# Try signing in with Google
```

### 2. Test on Vercel
1. Push changes to GitHub
2. Vercel auto-deploys
3. Visit your Vercel domain
4. Try signing in with Google

### 3. Check Browser Console
- Open DevTools (F12)
- Go to **Console** tab
- Look for any OAuth errors
- Check if login token is saved to localStorage

---

## Common Issues & Solutions

### Issue 1: "Redirect URL mismatch"
**Fix:** Make sure the redirect URI exactly matches in Google Console
- Check for trailing slashes
- Check for http vs https
- Check for www subdomain

### Issue 2: "Client ID not found"
**Fix:** 
1. Check Vercel environment variables are set
2. Vercel deployment was redeployed after changing env vars
3. Check that VITE_GOOGLE_CLIENT_ID is prefixed with VITE_

### Issue 3: "CORS error when sending token to backend"
**Fix:**
1. Update backend CORS configuration
2. Add Vercel domain to allowed origins
3. Redeploy backend

### Issue 4: "Token validation failed on backend"
**Fix:**
1. Check GOOGLE_CLIENT_ID matches in both frontend and backend
2. Verify token is being sent correctly
3. Check backend logs for detailed error

---

## Quick Reference: Find Your Client ID

1. Google Cloud Console → APIs & Services → Credentials
2. Look for "Web application" type client
3. Click to expand
4. Copy the **Client ID** (long string)
5. Paste into Vercel environment variable

---

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` file with real credentials
- Use `.env.example` for template
- Set environment variables in Vercel UI, not in code
- Keep client ID and secret secure
- Rotate credentials if compromised

---

## Need Help?

**Google OAuth Documentation:**
- https://developers.google.com/identity/gsi/web

**Vercel Environment Variables:**
- https://vercel.com/docs/projects/environment-variables

**Google Cloud Console:**
- https://console.cloud.google.com

---

## Additional Resources

### Backend Deployment (Optional)
If backend is also on Vercel or another platform:
1. Deploy backend separately
2. Set VITE_BACKEND_URL to backend domain
3. Update backend CORS for frontend domain

### Custom Domain
If using custom domain instead of vercel.app:
1. Add custom domain to Vercel project
2. Register custom domain in Google Console
3. Update environment variables

---

## Summary

✅ **To fix the OAuth error:**
1. Add Vercel domain to Google Cloud Console
2. Set environment variables in Vercel
3. Redeploy to Vercel
4. Test sign-in on production domain

That's it! Your Google OAuth should now work on Vercel. 🎉
