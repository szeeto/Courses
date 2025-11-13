# ✅ Frontend & Backend Merge - Complete Checklist

## 📋 Setup Verification

### Files Created/Modified

#### ✅ Created
- [ ] MERGED_SETUP_GUIDE.md - Comprehensive setup
- [ ] MERGED_QUICK_START.md - Quick reference
- [ ] MERGE_SUMMARY.md - Overview
- [ ] MERGE_DIAGRAMS.md - Architecture diagrams
- [ ] ./.env - Root environment file
- [ ] ./backend/.env - Backend environment file

#### ✅ Modified
- [ ] package.json - Updated scripts
  - [ ] `npm run dev` - Runs both services
  - [ ] `npm run frontend:dev` - Only frontend
  - [ ] `npm run backend:dev` - Only backend
  - [ ] Added `concurrently` dependency
  - [ ] Added backend start scripts

### Configuration Files

- [ ] ./.env exists with both frontend & backend variables
- [ ] ./backend/.env exists with backend variables
- [ ] .env.example has template values
- [ ] VITE_GOOGLE_CLIENT_ID set correctly
- [ ] VITE_BACKEND_URL = http://localhost:4000
- [ ] GOOGLE_CLIENT_SECRET filled in
- [ ] DB credentials configured
- [ ] JWT_SECRET set

---

## 🔧 Development Environment

### Installation Checklist

```bash
# ROOT LEVEL
npm install
# Should install:
# ✓ React, React Router, Bootstrap, Swiper, Animate.css
# ✓ Vite, ESLint
# ✓ concurrently (NEW!)

# BACKEND LEVEL
cd backend && npm install
# Should install:
# ✓ Express, CORS
# ✓ MySQL2, better-sqlite3
# ✓ JWT, google-auth-library
# ✓ dotenv, nodemon
```

### Dependency Check

- [ ] `concurrently` in devDependencies
- [ ] `vite` in devDependencies (frontend)
- [ ] `express` in backend dependencies
- [ ] `mysql2` in backend dependencies
- [ ] `jsonwebtoken` in backend dependencies
- [ ] `google-auth-library` in backend dependencies
- [ ] `nodemon` in backend devDependencies

---

## 🚀 Running the Application

### Start Command
```bash
npm run dev
```

Expected output in terminal:
```
[0] vite v7.1.7 starting dev server...
[0] Local: http://localhost:5173/
[1] Backend listening on http://localhost:4000
```

- [ ] Frontend starts (see port 5173)
- [ ] Backend starts (see port 4000)
- [ ] No errors in either service
- [ ] Both services show in same terminal

### Test URLs

- [ ] Frontend: http://localhost:5173 (React app loads)
- [ ] Backend: http://localhost:4000 (API responds)
- [ ] Login page: http://localhost:5173/login (Works)

---

## 💻 Frontend Verification

### Vite Configuration
- [ ] vite.config.js exists
- [ ] React plugin configured
- [ ] Port 5173 (or configured port)

### React Structure
- [ ] src/pages/ folder exists
- [ ] src/components/ folder exists
- [ ] src/hooks/ folder exists
- [ ] src/App.jsx exists
- [ ] src/main.jsx exists

### Pages Exist
- [ ] HomePage.jsx ✓
- [ ] LoginPage.jsx ✓ (with Google OAuth)
- [ ] KelasPage.jsx ✓
- [ ] TestimoniPage.jsx ✓
- [ ] FaqPage.jsx ✓
- [ ] SyaratKetenPage.jsx ✓

### Hooks Exist
- [ ] useAuth.js ✓ (Authentication)
- [ ] useApi() function ✓ (API calls)

### Styling
- [ ] src/css/main.css exists
- [ ] Bootstrap included
- [ ] Animate.css imported
- [ ] LoginPage.css exists

### Navigation
- [ ] All pages accessible via React Router
- [ ] /login route works
- [ ] Navigation between pages smooth

---

## 🔐 Backend Verification

### Express Server
- [ ] backend/server.js exists
- [ ] Starts on PORT from .env
- [ ] CORS enabled
- [ ] JSON parser configured
- [ ] Routes mounted correctly

### Routes
- [ ] backend/routes/api.js exists ✓
- [ ] backend/routes/auth.js exists ✓
- [ ] GET /api/kelas works
- [ ] GET /api/testimonial works
- [ ] GET /api/faq works
- [ ] POST /api/subscribe works
- [ ] POST /auth/google-signin works
- [ ] GET /auth/me works
- [ ] POST /auth/logout works

### Database Layer
- [ ] backend/db.js exists
- [ ] Exports async functions
- [ ] initDB() called on startup
- [ ] Connection pool created
- [ ] Tables auto-created

### Database Functions
- [ ] getKelas() ✓
- [ ] getTestimonial() ✓
- [ ] getFaq() ✓
- [ ] addSubscriber() ✓
- [ ] getUserByGoogleId() ✓
- [ ] createOrUpdateUser() ✓
- [ ] getUserById() ✓

---

## 🗄️ Database Verification

### MySQL Connection
- [ ] MySQL server is running
- [ ] Can connect: `mysql -u root -p`
- [ ] Credentials in .env match MySQL

### Database Creation
- [ ] Database `courses_db` exists or will be created
- [ ] Tables auto-created on first run:
  - [ ] users table (for Google OAuth)
  - [ ] kelas table
  - [ ] testimonial table
  - [ ] faq table

### Seed Data
- [ ] backend/data/data.json exists
- [ ] Contains: kelas, testimonial, faq arrays
- [ ] Data loads on first run

### Test Database Access
```bash
mysql -u root -p
USE courses_db;
SHOW TABLES;
SELECT * FROM kelas;
```

---

## 🔐 Google OAuth Verification

### Client ID Configuration
- [ ] VITE_GOOGLE_CLIENT_ID in .env ✓
- [ ] GOOGLE_CLIENT_ID in backend/.env ✓
- [ ] GOOGLE_CLIENT_SECRET in backend/.env ✓
- [ ] Matches Google Console settings

### OAuth Flow
- [ ] LoginPage.jsx loads
- [ ] Google Sign-In button appears
- [ ] Clicking opens Google popup
- [ ] User can authenticate
- [ ] Token returns to frontend
- [ ] Backend receives token
- [ ] Token verified with Google
- [ ] User created in database
- [ ] JWT token returned
- [ ] Frontend stores JWT
- [ ] User is logged in

### Protected Endpoints
- [ ] GET /auth/me requires valid JWT
- [ ] POST /auth/logout requires valid JWT
- [ ] Invalid token returns 401

---

## 📱 Browser Testing

### Console Check (F12)
- [ ] No JavaScript errors
- [ ] No warnings about missing scripts
- [ ] Network tab shows API calls
- [ ] localStorage has authToken and user

### Page Navigation
- [ ] Home page loads
- [ ] Can click navbar links
- [ ] All pages load without errors
- [ ] Animations work smoothly
- [ ] Layout is responsive

### Login Flow
- [ ] Visit /login
- [ ] See login page
- [ ] See Google button
- [ ] Click Google button
- [ ] Popup opens
- [ ] Can authenticate
- [ ] Redirected to home
- [ ] User info displayed (navbar)

---

## 🔄 Development Workflow Testing

### Frontend Code Changes
1. Edit src/App.jsx (change something)
2. Save file
3. Browser auto-refreshes
4. Changes appear immediately

- [ ] Vite hot reload works
- [ ] No need to restart

### Backend Code Changes
1. Edit backend/routes/api.js (change something)
2. Save file
3. Check terminal: "[0] restarted"
4. New endpoint behavior takes effect

- [ ] Nodemon hot reload works
- [ ] No need to restart

### Environment Changes
1. Edit .env file
2. Change a variable
3. Restart with Ctrl+C
4. Run npm run dev again
5. New env values loaded

- [ ] Environment reload works

---

## 🚨 Error Prevention

### Check These First
- [ ] Port 5173 is free (frontend)
- [ ] Port 4000 is free (backend)
- [ ] Port 3306 is free (MySQL)
- [ ] MySQL is running
- [ ] .env file has all required variables
- [ ] Backend .env has all required variables
- [ ] npm install completed in root
- [ ] npm install completed in backend

### No Errors Should Appear
- [ ] No "Module not found" errors
- [ ] No "Cannot find module" errors
- [ ] No MySQL connection errors
- [ ] No CORS errors
- [ ] No syntax errors

---

## ✅ Final Checklist

Before declaring merge complete:

### Critical
- [ ] `npm run dev` starts both services
- [ ] Frontend loads at :5173
- [ ] Backend responds at :4000
- [ ] No errors in either service
- [ ] Can navigate pages
- [ ] Can visit /login

### Important
- [ ] Google OAuth works
- [ ] User data saves
- [ ] Token stored
- [ ] Protected routes work
- [ ] API calls work

### Nice to Have
- [ ] Animations work
- [ ] Mobile responsive
- [ ] Database queries fast
- [ ] Error messages clear
- [ ] Documentation complete

---

## 📚 Documentation Complete

- [ ] MERGED_QUICK_START.md ✓
- [ ] MERGED_SETUP_GUIDE.md ✓
- [ ] MERGE_SUMMARY.md ✓
- [ ] MERGE_DIAGRAMS.md ✓
- [ ] OAUTH_README.md ✓
- [ ] OAUTH_EXAMPLES.md ✓
- [ ] OAUTH_SETUP_CHECKLIST.md ✓

---

## 🎉 Success Criteria

You're done when:

✅ `npm run dev` successfully starts both frontend and backend  
✅ Frontend loads at http://localhost:5173  
✅ Backend responds at http://localhost:4000  
✅ Can navigate all pages  
✅ Can visit /login  
✅ No errors in browser console  
✅ No errors in terminal  
✅ MySQL database working  
✅ This checklist is all checked!  

---

## 🚀 Next Steps After Merge

1. **Daily Development**
   ```bash
   npm run dev
   ```

2. **Create features** in src/ for frontend
3. **Create routes** in backend/ for API
4. **Test in browser** at :5173
5. **Check API** at :4000

---

**When all items are checked, your frontend & backend merge is complete! 🎉**
