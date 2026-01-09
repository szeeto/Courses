# Supabase Authentication Setup Guide

## Implementasi Login Supabase

Sistem login telah dimigrasi ke menggunakan Supabase Authentication. Berikut adalah penjelasan perubahan:

## 📁 File yang Diubah

### Frontend Components

1. **`src/hooks/useSupabaseAuth.js`** (Baru)
   - Hook utama untuk menangani autentikasi Supabase
   - Fungsi: `signUp()`, `signIn()`, `signInWithGoogle()`, `signOut()`, `resetPassword()`
   - Mengelola session dan user state otomatis

2. **`src/hooks/useAuth.js`** (Updated)
   - Tetap kompatibel dengan kode lama
   - Sekarang menggunakan `useSupabaseAuth` di balik layar
   - Migrasi gradual dari custom auth ke Supabase

3. **`src/pages/UserLoginPage.jsx`** (Updated)
   - Menggunakan `useSupabaseAuth` hook
   - Login dengan email/password via Supabase
   - Google Sign-In via Supabase OAuth
   - Menghapus dependency ke Google Identity Services Library

4. **`src/pages/AdminLoginPage.jsx`** (Updated)
   - Login Google via Supabase untuk admin
   - Email checking untuk validasi admin
   - Simpan user info ke localStorage & cookies

5. **`src/pages/RegisterPage.jsx`** (Updated)
   - Registrasi via Supabase Auth
   - Email verification flow
   - Redirect ke login setelah registrasi sukses

## ⚙️ Konfigurasi Environment Variables

Tambahkan ke `.env` file di root project:

```env
# Supabase Frontend Config (untuk React)
VITE_SUPABASE_URL=https://xuzqgxffbnpiezlkxmsv.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Backend juga perlu config Supabase
SUPABASE_URL=https://xuzqgxffbnpiezlkxmsv.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

## 🔑 Mendapatkan API Keys dari Supabase

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Go to **Settings → API**
4. Copy:
   - **URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_ANON_KEY` (jangan gunakan service_role key untuk frontend!)

## 🔐 Fitur Autentikasi

### Email/Password Auth
```javascript
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'

function MyComponent() {
  const { signIn, signUp, signOut } = useSupabaseAuth()
  
  // Sign Up
  const result = await signUp('user@example.com', 'password123', { 
    full_name: 'John Doe' 
  })
  
  // Sign In
  const result = await signIn('user@example.com', 'password123')
  
  // Sign Out
  await signOut()
}
```

### Google OAuth
```javascript
const { signInWithGoogle } = useSupabaseAuth()

async function handleGoogleLogin() {
  const result = await signInWithGoogle()
  if (result.success) {
    // User logged in
  }
}
```

### Password Reset
```javascript
const { resetPassword } = useSupabaseAuth()

async function handleForgotPassword(email) {
  const result = await resetPassword(email)
  // User akan menerima email reset password
}
```

## 🔄 User Session Management

User session otomatis disimpan dan direstore:
- Session disimpan di browser memory
- Dapat diakses via `useSupabaseAuth()` hook
- Automatic logout jika token expired

## 📱 User Data Storage

Data user disimpan di:
1. **Supabase Auth** - Kredensial & session
2. **localStorage** - Untuk offline access
3. **Cookies** - Untuk server-side validation (optional)

## 🛣️ Auth Flow Diagram

### User Registration
```
Form Input → signUp() → Supabase Auth → Email Verification → Redirect to Login
```

### User Login (Email/Password)
```
Form Input → signIn() → Supabase Auth → Session Created → Redirect to Home
```

### Admin Login (Google OAuth)
```
Google Button → signInWithGoogle() → Supabase OAuth → Email Check → Admin Dashboard
```

## ⚠️ Important Notes

1. **Jangan expose SERVICE_ROLE key** di frontend - hanya gunakan ANON_KEY
2. **Email verification** harus dikonfigurasi di Supabase Settings
3. **Google OAuth** perlu dikonfigurasi di Supabase → Authentication → Providers
4. **Redirect URL** untuk OAuth harus ditambahkan di Supabase settings

## 🔗 Useful Links

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase React Guide](https://supabase.com/docs/guides/auth/auth-react)
- [Supabase Dashboard](https://app.supabase.com)

## 🐛 Troubleshooting

### Error: "Invalid API key"
- Pastikan VITE_SUPABASE_ANON_KEY di `.env` sudah benar
- Check di Supabase Settings → API untuk copy key yang tepat
- Restart dev server setelah update `.env`

### Google Login tidak muncul
- Supabase OAuth untuk Google belum dikonfigurasi
- Go to Supabase → Authentication → Providers → Google
- Setup Google OAuth credentials di Google Console

### Email verification tidak terkirim
- Check Supabase → Authentication → Email Templates
- Pastikan "Confirm email" toggle aktif
- Cek SMTP settings atau gunakan Supabase default email

### Session tidak persist
- Pastikan browser allow localStorage
- Check browser dev tools → Application → localStorage
- Clear cache dan reload page

## 📊 Database Schema (Dikelola Supabase)

Tabel `users` sudah otomatis dibuat Supabase dengan fields:
- `id` - UUID (primary key)
- `email` - Email address (unique)
- `password` - Hashed (managed by Supabase)
- `user_metadata` - JSON (nama, profil, dll)
- `created_at` - Timestamp
- `updated_at` - Timestamp

Custom data bisa disimpan di `user_metadata` field.
