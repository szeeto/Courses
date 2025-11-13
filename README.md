# 🎓 Ngoding - Online Learning Platform

A modern, responsive React + Vite application with Google OAuth authentication, user management, and admin dashboard.

## ✨ Features

- 🔐 **Google OAuth 2.0 Authentication** - Secure login with Google accounts
- 👤 **User Management** - User profiles, settings, and account management
- 🎯 **Admin Dashboard** - Comprehensive admin panel for content and user management
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- 🚀 **Vite + React** - Fast development and build process

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Google OAuth credentials

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/szeeto/Courses.git
cd Courses
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Update `.env` with your values:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_BACKEND_URL=http://localhost:4000
```

4. **Setup backend (optional)**
```bash
cd backend
npm install
cp .env.example .env
```

Update `backend/.env`:
```env
PORT=4000
GOOGLE_CLIENT_ID=your_google_client_id
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=courses_db
```

### Development

**Frontend only (with API calls to backend):**
```bash
npm run dev
```

**With backend:**
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend
npm start
```

Visit http://localhost:5173

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 📦 Project Structure

```
Courses/
├── src/
│   ├── components/          # Reusable React components
│   ├── pages/              # Page components
│   ├── css/                # Global styles
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── backend/                # Node.js Express backend
├── public/                 # Static assets
└── package.json
```

---

## 🔐 Google OAuth Setup

### Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 Web Application credentials
5. Add authorized origins:
   - http://localhost:5173
   - http://localhost:3000
   - https://your-domain.vercel.app (for production)
6. Copy the Client ID to `.env`

### For Production (Vercel)

See `GOOGLE_OAUTH_VERCEL_FIX.md` for complete setup guide.

---

## 🌐 Deployment

### Quick Deploy to Vercel (Recommended)

**Step 1: Push to GitHub** (you already have this)
```bash
git push origin main
```

**Step 2: Create Vercel Project**
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Framework: Select **React**
4. Click **Deploy**

**Step 3: Add Environment Variables**
In Vercel dashboard, go to Settings → Environment Variables:
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_BACKEND_URL=          (leave empty for same domain)
```

**Step 4: Configure Google OAuth**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your OAuth client
3. Add **Authorized JavaScript origins:**
   ```
   https://your-vercel-domain.vercel.app
   ```
4. Add **Authorized redirect URIs:**
   ```
   https://your-vercel-domain.vercel.app/login
   ```

**Step 5: Redeploy**
- Go to Vercel Deployments
- Click the latest deployment and select "Redeploy"
- Wait for deployment to complete
- Visit your domain and test login!

### Deploy Backend (Optional)

If you have a backend API, deploy it separately:

**Option A: Deploy to Vercel**
1. In Vercel, click "Add New" → "Project"
2. Select same repository
3. Root Directory: `backend`
4. Add backend environment variables

**Option B: Deploy to Other Platforms**
- Railway, Render, Heroku, etc.
- Update `VITE_BACKEND_URL` in frontend

**Backend Environment Variables:**
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_secure_jwt_secret_32_chars_minimum
FRONTEND_URL=https://your-vercel-domain.vercel.app
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

---

## 📖 Complete Deployment Guide

For detailed step-by-step deployment instructions, see **`VERCEL_DEPLOYMENT_GUIDE.md`**

Topics covered:
- Frontend + Backend on same domain
- Frontend and Backend on separate domains
- Environment variable setup
- Google OAuth configuration
- Troubleshooting
- Production best practices

---

## 🔗 Routes

### Frontend Routes
- `/` - Home page
- `/login` - Login page
- `/kelas` - Classes page
- `/testimoni` - Testimonials
- `/faq` - FAQ
- `/syaratketen` - Terms & Conditions
- `/settings` - User settings (protected)
- `/admin` - Admin dashboard (admin only)

### Backend API Routes
- `POST /auth/google-signin` - Google OAuth login
- `GET/POST /admin/*` - Admin endpoints

---

## 🛠️ Technologies Used

- **Frontend:** React 18, Vite, React Router, Bootstrap
- **Backend:** Node.js, Express.js
- **Authentication:** Google OAuth 2.0
- **Database:** MySQL
- **Styling:** CSS3 with animations
- **Deployment:** Vercel, GitHub

---

## 📝 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## 🐛 Troubleshooting

### Login not working on Vercel
1. Check that Google OAuth domain is registered
2. Verify `VITE_GOOGLE_CLIENT_ID` is set in Vercel
3. Check browser console for errors (F12 → Console)
4. See `GOOGLE_OAUTH_VERCEL_FIX.md` for detailed solutions

### "Origin not allowed" Error
- Add your Vercel domain to Google Cloud Console
- Check for typos (http vs https, www prefix, trailing slash)
- Wait 5 minutes for Google to update

### Backend connection error
1. Check `VITE_BACKEND_URL` in Vercel environment variables
2. Verify backend is deployed and running
3. Check CORS configuration (see `VERCEL_DEPLOYMENT_GUIDE.md`)
4. Check browser Network tab for failed requests

### Login successful but redirect fails
1. Check backend logs in Vercel
2. Verify database credentials
3. Check JWT_SECRET is set in backend
4. See backend deployment guide

### Database connection issues (Backend)
1. Verify database credentials are correct
2. Check if database is accessible from Vercel IP
3. Add Vercel IP to database whitelist
4. Test connection string locally first

---

## 📚 Documentation

- **`VERCEL_DEPLOYMENT_GUIDE.md`** - Complete step-by-step deployment guide (START HERE!)
- **`GOOGLE_OAUTH_VERCEL_FIX.md`** - OAuth setup and troubleshooting
- **`.env.example`** - Environment variables template
- **`backend/README.md`** - Backend documentation

---

## 👥 Contributors

- Patra Sawali

---

## 📄 License

MIT License - feel free to use this project for your own purposes!

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. See `GOOGLE_OAUTH_VERCEL_FIX.md` for OAuth issues
3. Open an issue on GitHub

---

**Happy Learning! 🎉**
