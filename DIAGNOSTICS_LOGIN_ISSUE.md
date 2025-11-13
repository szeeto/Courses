# Diagnostics: Login Page Not Showing

## 🔴 Kemungkinan Penyebab

### 1. **Frontend Server Tidak Berjalan** ⚠️ (PALING MUNGKIN)
Frontend development server HARUS berjalan di port 5173 agar halaman bisa di-akses.

**Solusi:**
```bash
# Buka terminal BARU (atau gunakan Terminal 2)
cd d:\patra\Courses
npm run frontend:dev
```

Jika berhasil, seharusnya muncul:
```
  VITE v7.1.7  ready in 285 ms

  ➜  Local:   http://localhost:5173/
```

Kemudian buka browser: `http://localhost:5173/login`

---

### 2. **Backend Server Tidak Berjalan** (Untuk form submission)
Backend perlu berjalan untuk form login/register bekerja.

**Solusi:**
```bash
# Buka terminal KETIGA
cd d:\patra\Courses\backend
npm run dev
```

Jika berhasil, seharusnya muncul:
```
Backend listening on http://localhost:4000
```

---

### 3. **Dependencies Belum Terinstall**

**Frontend:**
```bash
cd d:\patra\Courses
npm install
```

**Backend:**
```bash
cd d:\patra\Courses\backend
npm install bcrypt  # Untuk password hashing
```

---

### 4. **Port Sudah Digunakan**

Jika frontend/backend tidak bisa start:

**Cek proses yang menggunakan port:**
```bash
# Windows - cari port 5173 (frontend)
netstat -ano | findstr :5173

# Windows - cari port 4000 (backend)
netstat -ano | findstr :4000
```

**Kill proses:**
```bash
# Windows - replace PID dengan nomor yang muncul
taskkill /PID <PID> /F

# Contoh:
taskkill /PID 12345 /F
```

---

## ✅ Cara Verify Semuanya Berjalan

### Step 1: Check Frontend ✓
Buka browser dan kunjungi:
```
http://localhost:5173/
```

Seharusnya muncul **homepage** dengan navbar dan hero section.

### Step 2: Check Login Page ✓
Navigate ke:
```
http://localhost:5173/login
```

Seharusnya muncul:
- ✅ Purple gradient background
- ✅ White login card
- ✅ "Welcome to Ngoding" title
- ✅ Google Sign In button
- ✅ OR divider
- ✅ Email Login button
- ✅ Create Account button

### Step 3: Open DevTools ✓
Buka DevTools di browser (F12 atau Ctrl+Shift+I):

**Console Tab:**
- Tidak ada red error messages
- Mungkin ada yellow warnings (itu OK)

**Network Tab:**
- Jika ada red entries = error
- Check response status (200 = OK, 404 = not found, 500 = error)

---

## 🔍 Debugging Checklist

Jika login page MASIH tidak muncul, check ini:

### ❌ Masalah 1: "Cannot GET /login"
```
Frontend server tidak berjalan!
```
**Fix:** Run `npm run frontend:dev`

---

### ❌ Masalah 2: Homepage muncul tapi bukan login page
```
Router tidak route ke /login dengan benar
```
**Cek:**
1. Klik link login di navbar
2. URL berubah ke `http://localhost:5173/login`?
3. Halaman berubah atau tetap sama?

**Debug:**
- F12 → Console → paste: `console.log(window.location.pathname)`
- Seharusnya output: `/login`

---

### ❌ Masalah 3: Login page "blank" atau error symbol
```
CSS tidak loaded atau ada JavaScript error
```
**Debug:**
- F12 → Console
- Copy semua red error messages
- Cek apakah ada error di `LoginPage.jsx`

**Common errors:**
- `Cannot find module 'AuthForm.css'` → CSS import path salah
- `handleCredentialResponse is not defined` → Google API script gagal load
- `Cannot read property 'navigate' of undefined` → useNavigate() tidak di-import

---

### ❌ Masalah 4: Google button tidak muncul
```
Google Sign In API script tidak load
```
**Debug:**
- F12 → Network tab
- Cari request ke `accounts.google.com/gsi/client`
- Jika status bukan 200 = blocked atau no internet

**Fix:**
- Check internet connection
- Check Google Client ID di `.env` file

---

### ❌ Masalah 5: Buttons tidak berfungsi
```
onClick handlers atau navigation tidak bekerja
```
**Debug:**
- F12 → Console
- Klik "Email Login" button
- Seharusnya navigate ke `/login/custom`
- URL berubah? Console ada error?

---

## 📊 File Structure Verification

Pastikan file ini ada dan accessible:

```
d:\patra\Courses\
├── src\
│   ├── pages\
│   │   ├── LoginPage.jsx          ✓
│   │   ├── LoginPage.css          ✓
│   │   ├── CustomLoginPage.jsx    ✓
│   │   └── RegisterPage.jsx       ✓
│   ├── components\
│   │   ├── LoginForm.jsx          ✓
│   │   ├── RegisterForm.jsx       ✓
│   │   └── AuthForm.css           ✓
│   ├── App.jsx                    ✓
│   └── main.jsx                   ✓
├── backend\
│   ├── routes\auth.js             ✓
│   ├── db.js                      ✓
│   ├── server.js                  ✓
│   └── package.json               ✓
├── .env                           ✓ (harus ada)
└── vite.config.js                 ✓
```

---

## 🔧 Environment Variables

Create/check file `.env` di root (`d:\patra\Courses\.env`):

```env
# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=courses_db

# Google OAuth (get from Google Cloud Console)
VITE_GOOGLE_CLIENT_ID=your-client-id-here

# Backend URL
VITE_BACKEND_URL=http://localhost:4000

# JWT Secret
JWT_SECRET=your-secret-key-for-production
```

---

## 🆘 Last Resort - Full Rebuild

Jika semua fail, coba ini:

```bash
# Stop semua running processes (Ctrl+C di setiap terminal)

# Clean everything
cd d:\patra\Courses
rm -rf node_modules
rm package-lock.json
cd backend
rm -rf node_modules  
rm package-lock.json

# Reinstall
cd d:\patra\Courses
npm install
cd backend
npm install bcrypt

# Clear browser cache (Ctrl+Shift+Delete)

# Run fresh
cd d:\patra\Courses
npm run frontend:dev
# Di terminal baru:
cd d:\patra\Courses\backend
npm run dev
```

---

## 📝 Quick Command Reference

```bash
# Start only frontend
npm run frontend:dev

# Start only backend
cd backend && npm run dev

# Start both (frontend + backend)
npm run dev

# Check if services running
netstat -ano | findstr :5173  # Frontend
netstat -ano | findstr :4000  # Backend

# Kill process using port
taskkill /PID <number> /F
```

---

## ✨ Success Indicators

Jika semua berhasil:

- ✅ Browser shows homepage dengan navbar
- ✅ URL bar shows `http://localhost:5173/`
- ✅ Click login button → navigate to `/login`
- ✅ Login page shows with gradient background
- ✅ All buttons clickable
- ✅ F12 Console tidak ada red errors

---

**Last Updated:** November 13, 2025
**Status:** Awaiting user feedback on error messages
