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

### Deploy to Vercel

1. Push your code to GitHub
2. Connect GitHub to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

**Important:** Follow the OAuth guide in `GOOGLE_OAUTH_VERCEL_FIX.md`

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

### OAuth Error on Vercel
See `GOOGLE_OAUTH_VERCEL_FIX.md` for complete troubleshooting guide.

### Login not working
1. Check Google Client ID in `.env`
2. Verify JavaScript origins in Google Cloud Console
3. Check browser console for errors (F12)
4. Verify backend is running (if applicable)

### Backend connection issues
1. Check `VITE_BACKEND_URL` in `.env`
2. Verify backend is running on correct port
3. Check CORS configuration in backend

---

## 📚 Documentation

- `GOOGLE_OAUTH_VERCEL_FIX.md` - OAuth setup and troubleshooting for production
- `.env.example` - Environment variables template
- `backend/README.md` - Backend documentation

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
