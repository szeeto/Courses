# Testing Login After Fix

## 🔧 The Fix

**Problem:** Form only shows for 0.5 seconds then redirects to home
**Cause:** Existing auth token from previous test/login
**Solution:** Added redirect checks to all login pages

---

## 🧹 Step 1: Clear Old Data

### Browser - Clear Storage:

1. Press **F12** (DevTools)
2. Go to **Application** tab
3. Left sidebar → **Storage**
4. Clear all:
   - LocalStorage → Clear All
   - Cookies → Select all → Delete
5. Refresh page (Ctrl+R)

### Or Use Console Command:

```javascript
// Paste in browser console (F12 → Console)
localStorage.clear()
document.cookie.split(";").forEach(c => {
  const name = c.split("=")[0].trim()
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
})
location.reload()
```

---

## ✅ Step 2: Test All Login Flows

### Test 1: Email Registration

1. Go to: `http://localhost:5173/login`
2. Click **"Create Account"**
3. Form should stay on screen (NOT redirect!)
4. Fill form:
   - Nama: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm: password123
5. Click **"Daftar"**
6. Should redirect to home
7. Check navbar shows user info

### Test 2: Email Login (New Account)

1. Logout (clear storage again)
2. Go to: `http://localhost:5173/login`
3. Click **"Email Login"**
4. Form should stay on screen (NOT redirect!)
5. Fill form:
   - Email: test@example.com
   - Password: password123
6. Click **"Masuk"**
7. Should redirect to home
8. Check navbar shows user info

### Test 3: Register Again (Different Email)

1. Logout (clear storage)
2. Go to: `http://localhost:5173/login`
3. Click **"Create Account"**
4. Form should stay visible!
5. Fill:
   - Nama: Another User
   - Email: another@example.com
   - Password: pass1234
   - Confirm: pass1234
6. Click "Daftar"
7. Should redirect to home

### Test 4: Google Login

1. Logout (clear storage)
2. Go to: `http://localhost:5173/login`
3. Click **Google Sign In** button
4. Should open Google login popup
5. Complete Google authentication
6. Should redirect to home

---

## ✨ What Should Happen (After Fix)

| Scenario | Before Fix | After Fix |
|----------|-----------|----------|
| Visit `/login` with NO token | ✅ Show form | ✅ Show form |
| Visit `/login` WITH token | ✅ Redirect | ✅ Redirect |
| Visit `/login/custom` NO token | ❌ Show form BUT redirect in 0.5s | ✅ Show form |
| Visit `/login/custom` WITH token | ❌ Redirect immediately | ✅ Redirect |
| Visit `/register` NO token | ❌ Show form BUT redirect in 0.5s | ✅ Show form |
| Visit `/register` WITH token | ❌ Redirect immediately | ✅ Redirect |

---

## 🔍 Verification Checklist

After testing, verify:

- [ ] `/login` page loads and shows all buttons
- [ ] Can click "Email Login" and form appears
- [ ] Can click "Create Account" and form appears
- [ ] `/login/custom` form does NOT redirect quickly
- [ ] `/register` form does NOT redirect quickly
- [ ] Email registration works
- [ ] Email login works
- [ ] Google login works (if configured)
- [ ] After successful login, redirects to home
- [ ] Navbar shows user info after login
- [ ] Can logout and forms appear again

---

## 🆘 If Still Having Issues

Check browser console (F12 → Console):

```javascript
// Should output your token if logged in
localStorage.getItem('authToken')

// Should output user data if logged in
JSON.parse(localStorage.getItem('user'))

// Should output false if not logged in
!!localStorage.getItem('authToken')
```

---

## 📝 Key Changes Made

**CustomLoginPage.jsx:**
- Added `useNavigate` hook
- Added `getCookie` import
- Added `useEffect` to check auth token
- Redirect to `/` if already logged in

**RegisterPage.jsx:**
- Same changes as CustomLoginPage
- Now checks auth before showing register form

---

**Status:** Fix deployed and ready for testing ✅
