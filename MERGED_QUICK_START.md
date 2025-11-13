# ⚡ Quick Start - Frontend & Backend Merged

## 🚀 5-Second Summary

You now have a **merged monorepo** where frontend and backend run together!

```bash
npm install          # Install everything
npm run dev          # Run frontend + backend (at the same time!)
```

Visit:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000

---

## 📋 Setup Checklist (2 minutes)

### ✅ Step 1: Install Dependencies
```bash
npm install
```

### ✅ Step 2: Configure Environment
Edit `.env` in the root folder:

```env
VITE_GOOGLE_CLIENT_ID=85663400629-ufai3edlu5ms359orrjkaqb7hj04kevq.apps.googleusercontent.com
VITE_BACKEND_URL=http://localhost:4000
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx  (add your secret)
```

Also edit `backend/.env`:
```env
GOOGLE_CLIENT_ID=85663400629-ufai3edlu5ms359orrjkaqb7hj04kevq.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx  (add your secret)
```

### ✅ Step 3: Start Both
```bash
npm run dev
```

### ✅ Done! 🎉
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

---

## 📖 Available Commands

```bash
npm run dev             # Run both (frontend + backend)
npm run frontend:dev    # Only frontend
npm run backend:dev     # Only backend
npm run build           # Build frontend for production
npm start               # Production mode (both)
npm run lint            # Check code quality
```

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module 'concurrently'" | Run `npm install concurrently` |
| Backend not starting | Check MySQL is running, check `.env` |
| Frontend not loading | Check port 5173 is free |
| Login doesn't work | Check Google Client ID in `.env` |

---

## 📁 Where Things Are

```
Courses/
├── src/                    ← Frontend code (React)
├── backend/                ← Backend code (Express)
├── .env                    ← Configuration (BOTH frontend & backend)
├── package.json            ← Root scripts (run both)
└── MERGED_SETUP_GUIDE.md   ← Full setup guide
```

---

## ✨ What Changed?

**Before:** Run frontend and backend separately in different terminals

**Now:** One command runs both!
```bash
npm run dev
```

---

## 📞 Need More Help?

Read: `MERGED_SETUP_GUIDE.md` (comprehensive guide)

---

**Happy coding! 🚀**
