# Quick Start: Login Page & Form Testing

## 🚀 Permasalahan yang Diperbaiki

✅ **Fixed:**
- Hapus Bootstrap dependencies yang tidak ada
- Tambah custom spinner animation
- Perbaiki navigation links antar halaman login
- Install bcrypt dependency untuk password hashing
- Pastikan database field password sudah ada

## 📋 Setup & Testing

### 1. **Install Dependencies**

```bash
# Backend
cd backend
npm install

# Frontend
cd ..
npm install
```

### 2. **Setup Environment Variables**

Create `.env` file di root folder:
```env
# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=courses_db

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Backend URL (untuk development)
VITE_BACKEND_URL=http://localhost:4000

# JWT
JWT_SECRET=your-secret-key-change-in-production
```

### 3. **Jalankan Backend**

```bash
cd backend
npm run dev
# Seharusnya output: "Backend listening on http://localhost:4000"
```

### 4. **Jalankan Frontend**

```bash
# Di folder root
npm run dev
# Seharusnya output: "Local: http://localhost:5173"
```

### 5. **Test Login Flow**

#### Test A: Visit Login Page
1. Buka http://localhost:5173/login
2. Seharusnya melihat:
   - ✅ Google Sign In button
   - ✅ OR divider
   - ✅ Email Login button
   - ✅ Create Account button

#### Test B: Email Registration
1. Click "Create Account"
2. Buka http://localhost:5173/register
3. Isi form:
   - Nama: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
   - Confirm: "password123"
4. Click "Daftar"
5. Seharusnya redirect ke home page

#### Test C: Email Login
1. Kembali ke http://localhost:5173/login
2. Click "Email Login"
3. Isi email dan password yang sudah didaftar
4. Click "Masuk"
5. Seharusnya redirect ke home page

#### Test D: Google Login
1. Kembali ke http://localhost:5173/login
2. Click Google Sign In button
3. Lakukan Google authentication
4. Seharusnya redirect ke home page

## 🔍 Debugging

### Check Error di Browser
1. Buka DevTools (F12)
2. Lihat tab "Console" untuk error messages
3. Lihat tab "Network" untuk request status

### Common Issues

**Issue: "Backend is not responding"**
- Pastikan backend sudah jalan di port 4000
- Check `.env` file - pastikan VITE_BACKEND_URL benar

**Issue: "Database connection error"**
- Pastikan MySQL berjalan
- Check credentials di `.env` file
- Pastikan database `courses_db` sudah dibuat

**Issue: "Cannot read property navigate"**
- Pastikan `react-router-dom` sudah installed
- Check import di component file

**Issue: "Cannot POST /auth/register"**
- Pastikan backend routing sudah benar
- Check backend console untuk error messages

## 📁 File Structure

```
src/
├── pages/
│   ├── LoginPage.jsx       (Main login page with all methods)
│   ├── LoginPage.css       (Styling dengan custom spinner)
│   ├── CustomLoginPage.jsx (Email login wrapper)
│   └── RegisterPage.jsx    (Registration wrapper)
├── components/
│   ├── LoginForm.jsx       (Email login form)
│   ├── RegisterForm.jsx    (Registration form)
│   └── AuthForm.css        (Shared styling)

backend/
├── routes/
│   ├── auth.js             (Register, login, Google OAuth)
├── db.js                   (Database & password field)
└── server.js               (Express setup dengan CORS)
```

## ✨ Features

✅ Google OAuth Login
✅ Email/Password Registration
✅ Email/Password Login
✅ Password hashing dengan bcrypt
✅ JWT token (30 days expiry)
✅ localStorage + cookie storage
✅ Responsive design
✅ Error handling & validation
✅ Custom animations

## 🎯 Next Steps

1. ✅ Finish testing locally
2. ⏳ Deploy ke Vercel
3. ⏳ Configure Google OAuth untuk Vercel domain
4. ⏳ Update database credentials untuk production

---

**Status:** Login sistem fully functional ✅
**Last Updated:** November 13, 2025
