# 🚀 Courses Application - Merged Setup Guide

## Project Structure

Your project is now organized as a **monorepo** with frontend and backend in one repository:

```
Courses/
├── src/                    ← Frontend (React)
├── public/                 ← Frontend assets
├── backend/                ← Backend (Express)
│   ├── routes/
│   ├── db.js
│   ├── server.js
│   └── package.json
├── package.json            ← Root (run both frontend & backend)
├── .env                    ← Shared environment variables
├── vite.config.js
└── index.html
```

---

## ✅ Installation Steps

### 1. Install Root Dependencies
```bash
npm install
```

This installs both frontend and `concurrently` package (allows running frontend & backend together).

### 2. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

Or:
```bash
npm run install:backend
```

### 3. Configure Environment Variables

Edit `.env` file in the root directory:

```env
# FRONTEND
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_BACKEND_URL=http://localhost:4000

# BACKEND
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=courses_db
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_random_secret_key
FRONTEND_URL=http://localhost:5173
```

Also update `backend/.env` with the same backend configuration:

```env
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=courses_db
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_random_secret_key
FRONTEND_URL=http://localhost:5173
```

---

## 🎯 Running the Application

### Development Mode (Both Frontend & Backend)
```bash
npm run dev
```

This command runs:
- **Frontend**: React app on http://localhost:5173
- **Backend**: Express server on http://localhost:4000

Both run in parallel using `concurrently`.

### Running Only Frontend
```bash
npm run frontend:dev
# or
npm run dev:frontend
```

Frontend will be on: http://localhost:5173

### Running Only Backend
```bash
npm run backend:dev
# or
npm run dev:backend
```

Backend will be on: http://localhost:4000

### Production Build & Start

Build frontend:
```bash
npm run build
```

Start both in production:
```bash
npm start
```

This runs:
- **Frontend**: Vite preview mode
- **Backend**: Node.js server

---

## 📊 Available Scripts

### Root Level (npm run ...)

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Run frontend & backend together (recommended!) |
| `npm run frontend:dev` | Run only frontend |
| `npm run backend:dev` | Run only backend |
| `npm run build` | Build frontend for production |
| `npm run build:backend` | Info message (Node.js doesn't need build) |
| `npm run lint` | Lint frontend code |
| `npm run preview` | Preview production build locally |
| `npm start` | Production mode (both frontend & backend) |

### Backend Level (cd backend && npm run ...)

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Run backend with nodemon (auto-reload) |
| `npm start` | Run backend in production mode |

---

## 🔗 Communication Between Frontend & Backend

### Frontend → Backend

The frontend is configured to communicate with backend at: `http://localhost:4000`

This is set in the `.env` file:
```env
VITE_BACKEND_URL=http://localhost:4000
```

And used in components via:
```javascript
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
fetch(`${backendUrl}/api/endpoint`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### Backend → Frontend (CORS)

The backend has CORS enabled to accept requests from the frontend:
```javascript
app.use(cors())  // in server.js
```

---

## 🚨 Important Notes

### Database Connection
1. **Ensure MySQL is running** before starting the application
2. Database and tables are **auto-created** on first run
3. Check `.env` for correct database credentials

### Google OAuth
1. **Client ID and Secret** are already set in `.env`
2. Make sure they match your Google Console credentials
3. Test login at http://localhost:5173/login

### Port Conflicts
- **Frontend**: Port 5173 (change in `vite.config.js` if needed)
- **Backend**: Port 4000 (change in `.env` if needed)
- **MySQL**: Port 3306 (default)

---

## 🔍 Testing the Setup

### 1. Start the Application
```bash
npm run dev
```

You should see:
```
Frontend:  http://localhost:5173
Backend:   http://localhost:4000
```

### 2. Test Frontend
Visit: http://localhost:5173
- Should see the homepage
- All pages should work

### 3. Test Backend API
```bash
curl http://localhost:4000/
# Should return: { status: 'ok', message: 'Courses backend is running' }
```

### 4. Test Login
Visit: http://localhost:5173/login
- Should see login page
- Google Sign-In button should work

### 5. Test Database
```bash
mysql -u root -p
> USE courses_db;
> SELECT * FROM users;
```

---

## 📁 File Organization

### Frontend Files (src/)
```
src/
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx         ← Google OAuth login
│   ├── KelasPage.jsx
│   ├── TestimoniPage.jsx
│   ├── FaqPage.jsx
│   └── SyaratKetenPage.jsx
├── components/
│   ├── NavbarComponents.jsx
│   ├── FooterComponents.jsx
│   └── FaqComponents.jsx
├── hooks/
│   └── useAuth.js            ← Authentication hook
├── css/
│   └── main.css
├── data/
│   └── index.js
├── App.jsx
├── main.jsx
└── assets/
```

### Backend Files (backend/)
```
backend/
├── routes/
│   ├── api.js               ← API endpoints
│   └── auth.js              ← Authentication routes
├── data/
│   └── data.json            ← Seed data
├── db.js                    ← Database layer
├── server.js                ← Express server
├── package.json
├── .env                     ← Backend configuration
└── README.md
```

---

## 🔄 Development Workflow

### Making Changes

1. **Frontend changes** (src/ folder)
   - Changes auto-reload in browser
   - No need to restart

2. **Backend changes** (backend/ folder)
   - Changes auto-reload with nodemon
   - No need to restart manually
   - API endpoints update immediately

3. **Environment changes** (.env)
   - Restart both frontend and backend
   - Run `npm run dev` again

### Debugging

**Frontend:** Open browser DevTools (F12)
```javascript
// Check if logged in
const user = JSON.parse(localStorage.getItem('user') || 'null')
const token = localStorage.getItem('authToken')
```

**Backend:** Check terminal output
```
Backend listening on http://localhost:4000
```

**Database:** Use MySQL client
```bash
mysql -u root -p
USE courses_db;
SHOW TABLES;
```

---

## 🚀 Deployment

### Build Frontend
```bash
npm run build
```

Creates `dist/` folder with optimized build.

### Deploy Frontend
- Upload `dist/` to Vercel, Netlify, etc.
- Update `VITE_BACKEND_URL` to production backend

### Deploy Backend
- Deploy `backend/` folder to Heroku, DigitalOcean, AWS, etc.
- Set environment variables on hosting platform
- Update `FRONTEND_URL` for CORS

---

## 📚 Documentation

All OAuth documentation is in the root:
- `OAUTH_README.md` - Overview
- `GOOGLE_OAUTH_SETUP.md` - Detailed setup
- `OAUTH_EXAMPLES.md` - Code examples
- `OAUTH_QUICK_REFERENCE.md` - Quick lookup

---

## ✅ Checklist

Before deploying to production:

- [ ] `.env` files created with real credentials
- [ ] MySQL running and accessible
- [ ] `npm install` completed in root and backend
- [ ] `npm run dev` starts both frontend & backend
- [ ] Frontend loads at http://localhost:5173
- [ ] Backend responds at http://localhost:4000
- [ ] Can sign in with Google
- [ ] User data saves to database
- [ ] API calls include authentication tokens
- [ ] No console errors in browser
- [ ] No errors in backend terminal

---

## 📞 Troubleshooting

### "Cannot find module 'concurrently'"
```bash
npm install concurrently
```

### "Backend is not responding"
1. Check if backend is running: `npm run backend:dev`
2. Check `.env` for correct PORT
3. Check MySQL is running
4. Check terminal for error messages

### "Frontend won't load"
1. Check if frontend is running: `npm run frontend:dev`
2. Check http://localhost:5173
3. Check browser console (F12) for errors
4. Check if port 5173 is free

### "Login doesn't work"
1. Check Google Client ID in `.env`
2. Check browser console for errors
3. Check backend logs for errors
4. Verify MySQL is running and users table exists

### "Database connection error"
1. Verify MySQL is running: `mysql -u root`
2. Check `.env` has correct credentials
3. Try creating database manually: `CREATE DATABASE courses_db;`

---

## 🎉 You're Ready!

Your merged application is set up and ready to go!

**Next Step:** Run `npm run dev` and start developing! 🚀
