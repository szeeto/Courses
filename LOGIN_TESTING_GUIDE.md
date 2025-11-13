# Testing Guide - Separate User & Admin Login

## Quick Reference

### Routes
- **`http://localhost:5173/login`** → Selection page (choose user or admin)
- **`http://localhost:5173/login/user`** → Regular user login
- **`http://localhost:5173/login/admin`** → Admin-only login

### Admin Email
```
patrasawali93@gmail.com
```

---

## Test Scenarios

### Scenario 1: Regular User Login ✓
**Test Steps:**
1. Navigate to `http://localhost:5173/login`
2. Click "User Login" button
3. Click Google Sign-In button
4. Choose any Google account (or test account)
5. **Expected:** Redirected to home page `/`

**Verify:**
- [ ] Token in localStorage
- [ ] Token in cookies
- [ ] User name appears in navbar
- [ ] Settings button visible
- [ ] Admin Panel button NOT visible (unless Patra Sawali)
- [ ] Can access `/kelas`, `/testimoni`, `/faq`

---

### Scenario 2: Admin Login (Authorized) ✓
**Test Steps:**
1. Navigate to `http://localhost:5173/login/admin`
2. Click Google Sign-In button
3. Sign in with **`patrasawali93@gmail.com`**
4. **Expected:** Redirected to admin dashboard `/admin`

**Verify:**
- [ ] Token in localStorage
- [ ] Token in cookies
- [ ] Redirected to `/admin`
- [ ] Admin panel loads with all CRUD tables
- [ ] Can manage courses, testimonials, FAQs
- [ ] Can view users and subscribers

---

### Scenario 3: Admin Login (Unauthorized) ✗
**Test Steps:**
1. Navigate to `http://localhost:5173/login/admin`
2. Click Google Sign-In button
3. Sign in with **different Google account** (not patrasawali93@gmail.com)
4. **Expected:** Error message appears, no redirect

**Verify:**
- [ ] Error message shows: "Access denied. You are not authorized as an admin."
- [ ] NOT redirected to `/admin`
- [ ] Can click back to try again or navigate elsewhere

---

### Scenario 4: Login Selection Page
**Test Steps:**
1. Navigate to `http://localhost:5173/login`
2. **Expected:** Two buttons displayed (User Login, Admin Login)

**Verify:**
- [ ] "User Login" button links to `/login/user`
- [ ] "Admin Login" button links to `/login/admin`
- [ ] Both buttons have icons (👤 and 🔐)
- [ ] Responsive on mobile

---

### Scenario 5: Already Logged In User
**Test Steps:**
1. Login as regular user (navigate to `/login/user` and complete login)
2. Navigate back to `http://localhost:5173/login` or `/login/user`
3. **Expected:** Auto-redirect to dashboard

**Verify:**
- [ ] Regular user redirects to `/` (home)
- [ ] Admin redirects to `/admin`
- [ ] No re-login required

---

### Scenario 6: Token Persistence
**Test Steps:**
1. Login as user
2. Close browser/tab
3. Reopen to `http://localhost:5173/`
4. **Expected:** Still logged in, no re-login needed

**Verify:**
- [ ] User name still shows in navbar
- [ ] Token persists in localStorage
- [ ] Token persists in cookies

---

### Scenario 7: Logout
**Test Steps:**
1. Login as user
2. Click "Logout" button in navbar
3. **Expected:** Redirected to home, logged out

**Verify:**
- [ ] Redirected to `/`
- [ ] Login button appears in navbar
- [ ] localStorage cleared
- [ ] cookies cleared
- [ ] User info cleared

---

### Scenario 8: User Settings Access
**Test Steps:**
1. Login as regular user
2. Click "Settings" button in navbar
3. **Expected:** User settings page loads

**Verify:**
- [ ] Profile information displays
- [ ] Can edit profile
- [ ] Can delete account
- [ ] Can see session info

---

### Scenario 9: Admin Panel Access
**Test Steps:**

**As Admin:**
1. Login via `/login/admin` with authorized email
2. Click "Admin Panel" in navbar
3. **Expected:** Admin dashboard loads

**Verify:**
- [ ] CRUD tables visible
- [ ] Can create/read/update/delete courses
- [ ] Can manage testimonials
- [ ] Can manage FAQs
- [ ] Can view users and subscribers

---

**As Regular User:**
1. Login via `/login/user`
2. Try navigating to `http://localhost:5173/admin`
3. **Expected:** Access denied or error handling

**Verify:**
- [ ] Cannot see admin data
- [ ] Appropriate error shown (if implemented)

---

### Scenario 10: Navbar Behavior
**Test Steps:**
1. **Not logged in:** Only "Login" button visible
2. Login as user: "Settings", "Logout" buttons visible
3. Admin login: All buttons visible + "Admin Panel" if authorized

**Verify:**
- [ ] Navbar updates dynamically
- [ ] User name displays correctly
- [ ] All buttons functional

---

## Test Account Requirements

### For Regular User Testing
- Any Google account works (use test account if available)

### For Admin Testing
- **Required:** `patrasawali93@gmail.com` (or add new admin email)
- Other accounts should show access denied message

---

## Browser Developer Tools Checks

### localStorage
```javascript
// After login, check:
localStorage.getItem('authToken')        // Should have JWT
localStorage.getItem('user')             // Should have user JSON
```

### Cookies
```javascript
// Check cookies:
document.cookie                           // Should show authToken=..., userInfo=..., userEmail=...
```

### Network
1. Open Network tab in DevTools
2. Login and watch for:
   - `POST /auth/google-signin` → 200 OK
   - Response should contain `token` and `user` object

---

## Troubleshooting

### Issue: Google Sign-In button not showing
**Solution:**
- Check VITE_GOOGLE_CLIENT_ID in `.env`
- Verify Google API script loaded in Network tab
- Check browser console for errors

### Issue: Login successful but not redirecting
**Solution:**
- Check localStorage for authToken
- Open browser console, look for redirect logs
- Verify backend response has `token` and `user`

### Issue: Admin login shows "access denied" when shouldn't
**Solution:**
- Verify email in Google account matches ADMIN_EMAILS
- Check ADMIN_EMAILS array in `AdminLoginPage.jsx`
- Note: Email comparison is case-sensitive

### Issue: Token not persisting across page reload
**Solution:**
- Check cookies enabled in browser
- Verify localStorage working
- Check if cookies expiry is set correctly

---

## Performance Checks

- [ ] Page load time < 2 seconds
- [ ] Google Sign-In loads quickly
- [ ] Redirect happens instantly after login
- [ ] No console errors (only warnings acceptable)
- [ ] No memory leaks on repeated logins

---

## Security Checks

- [ ] Token expires after 30 days
- [ ] Tokens are JWT (verify at jwt.io)
- [ ] Admin email validation working
- [ ] Backend also validates token
- [ ] Logout clears all storage
- [ ] No sensitive data in localStorage/cookies (except token)

---

## Sign-off Checklist

- [ ] All 10 scenarios pass
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Cookies working
- [ ] localStorage persisting
- [ ] Redirects working correctly
- [ ] Admin validation working
- [ ] Navbar updating correctly
- [ ] Logout working
- [ ] Ready for production

---

**Last Updated:** Today
**Status:** Ready for Testing ✅
