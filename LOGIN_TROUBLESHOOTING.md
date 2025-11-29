# Login Troubleshooting Guide

## 🔍 Step-by-Step Diagnostics

### Step 1: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd \Courses\backend
npm run dev
```
Wait for: `Backend listening on http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
cd \Courses
npm run frontend:dev
```
Wait for: `Local: http://localhost:5173`

---

### Step 2: Check Backend Health

Open new browser tab and visit:
```
http://localhost:4000/
```

Should see:
```json
{
  "status": "ok",
  "message": "Courses backend is running"
}
```

If **NOT** showing = **Backend server problem**

---

### Step 3: Check Frontend Loads

Open browser:
```
http://localhost:5173/
```

Should see **homepage with navbar**

If **NOT** loading = **Frontend server problem**

---

### Step 4: Check Login Page

Navigate to:
```
http://localhost:5173/login
```

Should see:
- White card with purple gradient
- "Welcome to Ngoding" title
- Google Sign In button
- OR divider
- Email Login button
- Create Account button

If **NOT** showing = **Routing or CSS problem**

---

## 🐛 Common Problems & Solutions

### Problem 1: "Cannot connect to backend"

**Symptoms:**
- "Login gagal" error appears
- Browser console shows network error
- POST /auth/login returns 500 or timeout

**Debug:**
```javascript
// F12 → Console → paste:
fetch('http://localhost:4000/').then(r => r.json()).then(console.log)
```

Should show backend response. If error:
- Backend not running?
- Wrong port?
- Firewall blocking?

**Solution:**
1. Verify backend terminal showing "listening on http://localhost:4000"
2. Check Windows Firewall not blocking port 4000
3. Kill process on port 4000: `taskkill /PID <PID> /F`

---

### Problem 2: "CORS error"

**Symptoms:**
- Network tab shows request is blocked
- Error: "Access to XMLHttpRequest blocked by CORS"

**Debug:**
- Check Network tab in DevTools
- Look for OPTIONS request
- Check response headers

**Solution:**
- Backend CORS already configured
- Try full refresh: `Ctrl+Shift+Delete` → Clear cache
- Restart frontend: `Ctrl+C` then `npm run frontend:dev`

---

### Problem 3: "Database connection error"

**Symptoms:**
- Backend console shows: "Error: connect ECONNREFUSED"
- All auth endpoints fail with 500 error

**Debug:**
- Check if MySQL running
- Windows: `netstat -ano | findstr :3306`

**Solution:**
1. Start MySQL service:
   - Windows: Services → Search "MySQL" → Start
   - Or: Open XAMPP/phpMyAdmin control panel
2. Verify database exists: `courses_db`
3. Restart backend after MySQL starts

---

### Problem 4: "Email already registered"

**Symptoms:**
- Register form shows: "Email already registered"
- But email is new

**Debug:**
- Check database has the email
- MySQL: `SELECT * FROM users WHERE email = 'test@example.com';`

**Solution:**
- Create new database from scratch
- Or use different email for testing

---

### Problem 5: "Invalid email or password"

**Symptoms:**
- Login fails even with correct credentials
- Register worked, but login doesn't work

**Debug:**
- Check password was hashed correctly
- Verify email in database

**Solution:**
1. Register new account fresh
2. Check MySQL for user record
3. Verify bcrypt hashing worked

---

### Problem 6: "Google Sign In button not showing"

**Symptoms:**
- Google button spot is blank/empty
- Browser console shows Google API error

**Debug:**
- F12 → Console → check for errors
- Network tab → search "gsi/client"
- Check if blocked by browser/firewall

**Solution:**
1. Check `.env` has `VITE_GOOGLE_CLIENT_ID`
2. Check Client ID is valid (from Google Cloud)
3. Add authorized redirect URI in Google Console

---

### Problem 7: "Redirect loop" or "Page keeps reloading"

**Symptoms:**
- Login page redirects to home
- Home page redirects back to login
- Infinite loop

**Debug:**
- F12 → Application → Cookies/LocalStorage
- Check if `authToken` exists
- Check token validity

**Solution:**
1. Clear all cookies/localStorage:
   ```javascript
   localStorage.clear()
   document.cookie.split(";").forEach(c => {
     document.cookie = c.split("=")[0] + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
   })
   ```
2. Refresh page
3. Try login again

---

### Problem 8: "User data not saved"

**Symptoms:**
- Login successful (redirects to home)
- But user data missing
- Navbar shows "not logged in"

**Debug:**
- F12 → Application → Storage → check localStorage
- Should see: `authToken` and `user` (JSON)

**Solution:**
1. Check response from `/auth/login`:
   ```javascript
   // Network tab → Response
   // Should show: { token: "...", user: { id, email, name } }
   ```
2. Verify frontend saving correctly:
   ```javascript
   // F12 → Console
   const data = await fetch('http://localhost:4000/auth/login', {...})
   console.log(await data.json())
   ```

---

## 📋 Full Diagnostic Command

Run this in browser console to get all diagnostics:

```javascript
(async () => {
  console.log('=== LOGIN DIAGNOSTICS ===')
  
  // Check 1: Backend connectivity
  try {
    const res = await fetch('http://localhost:4000/')
    const data = await res.json()
    console.log('✅ Backend:', data)
  } catch(e) {
    console.log('❌ Backend error:', e.message)
  }
  
  // Check 2: Auth status
  try {
    const res = await fetch('http://localhost:4000/auth/status')
    const data = await res.json()
    console.log('✅ Auth status:', data)
  } catch(e) {
    console.log('❌ Auth error:', e.message)
  }
  
  // Check 3: LocalStorage
  const token = localStorage.getItem('authToken')
  const user = localStorage.getItem('user')
  console.log('📦 LocalStorage:', { token: !!token, user: !!user })
  
  // Check 4: Cookies
  console.log('🍪 Cookies:', document.cookie)
  
  console.log('=== END DIAGNOSTICS ===')
})()
```

---

## 🆘 If Still Stuck

1. **Share exact error message** from browser console
2. **Share backend terminal output** (paste last 20 lines)
3. **Share MySQL connection status** (is it running?)
4. **Check `.env` file exists** with all required variables
5. **Verify bcrypt installed**: `npm list bcrypt` in backend folder

---

## ✅ Success Checklist

After fixes, verify:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Homepage loads at `http://localhost:5173/`
- [ ] Login page loads at `http://localhost:5173/login`
- [ ] All auth buttons visible (Google, Email, Register)
- [ ] Register form validates input
- [ ] Register creates user in database
- [ ] Login with email works
- [ ] Login stores token in localStorage
- [ ] Google login works
- [ ] After login, user redirects to home
- [ ] No console errors

---

**Last Updated:** November 13, 2025
