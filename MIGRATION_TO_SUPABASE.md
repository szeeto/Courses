# Migrasi Server ke Supabase Edge Functions

Panduan lengkap untuk memindahkan backend Express.js ke Supabase Edge Functions.

## 📋 Overview

Server Express.js yang berjalan di `http://localhost:4000` telah dimigrasikan ke Supabase Edge Functions. Edge Functions adalah serverless functions yang berjalan di Supabase.

## 🔄 Perubahan Utama

### 1. Backend Structure
- **Sebelum**: Express.js server dengan routes di `/backend`
- **Sesudah**: Supabase Edge Functions di `/supabase/functions`

### 2. API Endpoints
- **Sebelum**: `http://localhost:4000/api/auth/register`
- **Sesudah**: `https://xuzqgxffbnpiezlkxmsv.supabase.co/functions/v1/auth-register`

### 3. Authentication
- Tetap menggunakan JWT tokens
- Password hashing menggunakan SHA-256 (sebelumnya bcrypt)
- Database operations langsung ke Supabase

## 🚀 Deployment Steps

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Login ke Supabase
```bash
supabase login
```

### 3. Link Project
```bash
npm run supabase:link
```

### 4. Deploy Functions
```bash
npm run deploy:supabase
```

Atau manual:
```bash
cd supabase
bash deploy.sh
```

## 🔧 Environment Variables

Pastikan environment variables berikut sudah di-set di Supabase Dashboard:

```
SUPABASE_URL=https://xuzqgxffbnpiezlkxmsv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

## 📁 File Structure Baru

```
supabase/
├── functions/
│   ├── _shared/
│   │   └── cors.ts
│   ├── auth/
│   │   ├── register.ts
│   │   ├── login.ts
│   │   └── profile.ts
│   ├── api/
│   │   └── courses.ts
│   └── admin/
│       └── users.ts
├── config.toml
├── README.md
└── deploy.sh
```

## 🔗 API Mapping

| Express Route | Edge Function | Method |
|---------------|---------------|--------|
| `/api/auth/register` | `auth-register` | POST |
| `/api/auth/login` | `auth-login` | POST |
| `/api/auth/profile` | `auth-profile` | GET |
| `/api/courses` | `api-courses` | GET |
| `/api/admin/users` | `admin-users` | GET |

## 🧪 Testing

### Local Testing
```bash
npm run supabase:start
npm run dev
```

### Production Testing
Setelah deploy, test di browser atau menggunakan curl:

```bash
# Register
curl -X POST https://xuzqgxffbnpiezlkxmsv.supabase.co/functions/v1/auth-register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST https://xuzqgxffbnpiezlkxmsv.supabase.co/functions/v1/auth-login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## ⚠️ Important Notes

1. **Password Hashing**: Edge Functions menggunakan SHA-256, bukan bcrypt. Password yang sudah ada perlu di-hash ulang.

2. **Database Schema**: Pastikan tabel `users` dan `courses` sudah ada di Supabase database.

3. **CORS**: Semua functions sudah include CORS headers untuk frontend.

4. **JWT Secret**: Pastikan JWT_SECRET sama dengan yang digunakan di backend lama.

## 🗑️ Cleanup (Opsional)

Setelah migrasi berhasil, Anda bisa menghapus folder `/backend` jika tidak diperlukan lagi:

```bash
rm -rf backend/
```

## 🔍 Troubleshooting

### Function tidak bisa diakses
- Pastikan function sudah di-deploy
- Check Supabase dashboard untuk error logs
- Verify environment variables

### Authentication gagal
- Pastikan JWT_SECRET sama
- Check token expiration (24 jam)
- Verify user ada di database

### CORS errors
- CORS headers sudah di-include di semua functions
- Pastikan frontend URL di-allow di Supabase settings

## 📞 Support

Jika ada masalah, check:
1. Supabase function logs di dashboard
2. Browser developer tools untuk network errors
3. Console logs di terminal