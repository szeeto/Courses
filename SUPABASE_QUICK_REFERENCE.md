# 🔐 Supabase Login - Quick Reference

## 📦 Installation
```bash
npm install  # Frontend dependencies including @supabase/supabase-js
cd backend && npm install && cd ..
```

## ⚙️ Configuration
Pastikan `.env` memiliki:
```env
VITE_SUPABASE_URL=https://xuzqgxffbnpiezlkxmsv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc... (your anon key)
```

## 🚀 Start Development
```bash
npm run dev  # Starts both frontend & backend
```

## 🌐 Access Points
- **User Registration**: http://localhost:5173/register
- **User Login**: http://localhost:5173/login/user
- **Admin Login**: http://localhost:5173/admin

## 🔑 Using Supabase Auth in Components

### Login Example
```javascript
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'

function MyComponent() {
  const { signIn, signInWithGoogle, loading, error } = useSupabaseAuth()
  
  const handleLogin = async (email, password) => {
    const result = await signIn(email, password)
    if (result.success) {
      // User logged in
    } else {
      console.error(result.error)
    }
  }
}
```

### Register Example
```javascript
const { signUp, loading } = useSupabaseAuth()

const handleRegister = async (email, password, name) => {
  const result = await signUp(email, password, { full_name: name })
  if (result.success) {
    // Registration successful, email verification sent
  }
}
```

### Logout Example
```javascript
const { signOut } = useSupabaseAuth()

const handleLogout = async () => {
  await signOut()
  // User logged out, redirect to login
}
```

## ✅ What's Changed

| Component | Old | New |
|-----------|-----|-----|
| Auth Backend | Custom JWT | Supabase Auth |
| Registration | API endpoint | Supabase signUp |
| Login | API endpoint | Supabase signIn |
| Google OAuth | Google Identity | Supabase OAuth |
| Session | Custom token | Supabase session |

## ⚠️ Important Setup Steps

1. **Install Dependencies** (DONE)
   ```bash
   npm install
   ```

2. **Configure Supabase** (MANUAL)
   - Go to https://app.supabase.com
   - Project: xuzqgxffbnpiezlkxmsv
   - Settings → Authentication → Providers
   - Enable Google OAuth with your credentials
   - Add redirect URLs

3. **Test**
   ```bash
   npm run dev
   # Visit http://localhost:5173/register to test
   ```

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid API key" | Check VITE_SUPABASE_ANON_KEY in .env, restart dev server |
| Google button not showing | Configure Google OAuth in Supabase dashboard |
| Registration not working | Check email provider settings in Supabase |
| Session not persisting | Check browser localStorage is enabled |

## 📖 Full Documentation
- Detailed setup: `SUPABASE_AUTH_SETUP.md`
- Changes summary: `SUPABASE_LOGIN_CHANGES.md`
- Completion checklist: `MIGRATION_CHECKLIST.md`

## 🎯 Files Modified
```
✨ NEW:  src/hooks/useSupabaseAuth.js
✏️ UPD:  src/hooks/useAuth.js
✏️ UPD:  src/pages/UserLoginPage.jsx
✏️ UPD:  src/pages/AdminLoginPage.jsx
✏️ UPD:  src/pages/RegisterPage.jsx
✏️ UPD:  .env
✏️ UPD:  package.json
```

---
**Status**: ✅ Implementation Complete - Ready to Configure & Test
