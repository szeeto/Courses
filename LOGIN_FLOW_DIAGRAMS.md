# Login Flow Diagram

## 📊 Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    NGODING APPLICATION                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                          HOME PAGE (/)                            │
│                    ┌─────────────────────────┐                  │
│                    │   Click "Login" Button   │                  │
│                    └────────────┬─────────────┘                  │
│                                 │                                │
│                                 ▼                                │
│            ┌────────────────────────────────────┐               │
│            │   LOGIN SELECTION PAGE (/login)    │               │
│            │  ┌──────────────────────────────┐ │               │
│            │  │ Welcome to Ngoding            │ │               │
│            │  │ Choose how you want to login: │ │               │
│            │  │                               │ │               │
│            │  │ ┌─────────────┐ ┌──────────┐ │ │               │
│            │  │ │  👤 User    │ │ 🔐 Admin │ │ │               │
│            │  │ │   Login     │ │  Login   │ │ │               │
│            │  │ └──────┬──────┘ └────┬─────┘ │ │               │
│            │  └────────┼─────────────┼───────┘ │               │
│            └───────────┼─────────────┼─────────┘               │
│                        │             │                          │
│         ┌──────────────┘             └──────────────┐           │
│         │                                           │           │
│         ▼                                           ▼           │
│    ┌─────────────────┐                   ┌──────────────────┐  │
│    │ USER LOGIN PAGE │                   │ ADMIN LOGIN PAGE │  │
│    │ (/login/user)   │                   │ (/login/admin)   │  │
│    │                 │                   │                  │  │
│    │ Google OAuth    │                   │ Google OAuth     │  │
│    │ Sign-In         │                   │ Sign-In          │  │
│    │                 │                   │                  │  │
│    │ No validation   │                   │ Validate Email:  │  │
│    │ needed          │                   │                  │  │
│    │                 │                   │ Is email in      │  │
│    └────────┬────────┘                   │ ADMIN_EMAILS?    │  │
│             │                             └──────┬──────────┘  │
│             │                                    │              │
│             │                            ┌───────┴────────┐   │
│             │                            │                │   │
│             │                    YES ────▼──  NO ────┐   │   │
│             │                            │           │   │   │
│             ▼                            ▼           ▼   ▼   │
│    ┌────────────────┐          ┌──────────────┐  │Error│     │
│    │ Save Token to: │          │ Redirect to: │  │Message  │     │
│    │                │          │              │  │         │     │
│    │ localStorage   │          │ /admin       │  │"Access  │     │
│    │ cookies        │          │              │  │denied.  │     │
│    │ (30-day exp)   │          │ (Admin Panel)│  │You are  │     │
│    │                │          └──────────────┘  │not auth"│     │
│    └────────┬────────┘                           │         │     │
│             │                                    └─────────┘     │
│             ▼                                           │        │
│    ┌──────────────┐                                    │        │
│    │ Redirect to: │                          User can │        │
│    │              │                          retry    │        │
│    │ / (HOME)     │                                    │        │
│    │              │                                    │        │
│    │ (Home Page)  │                                    │        │
│    └──────────────┘                                    │        │
│                                                       │        │
└───────────────────────────────────────────────────────────────┘
```

---

## 🔄 Detailed Login Flows

### User Login Flow
```
START
  │
  └─► Navigate to /login/user
      │
      ├─► Display Google Sign-In button
      │
      └─► User clicks sign-in
          │
          ├─► Google OAuth popup
          │
          ├─► User authenticates
          │
          ├─► Receive credential token
          │
          ├─► Send to backend: POST /auth/google-signin
          │
          ├─► Backend verifies & creates JWT
          │
          ├─► Response: { token, user }
          │
          ├─► Save token to localStorage
          │
          ├─► Save token to cookies (30-day)
          │
          ├─► Save user info to localStorage
          │
          ├─► Save user info to cookies
          │
          └─► Redirect to / (HOME PAGE)
              │
              └─► END (User logged in, can see home content)
```

### Admin Login Flow - Authorized
```
START
  │
  └─► Navigate to /login/admin
      │
      ├─► Display "🔐 Admin Login" + warning
      │
      ├─► Display Google Sign-In button
      │
      └─► User clicks sign-in
          │
          ├─► Google OAuth popup
          │
          ├─► User authenticates with admin email
          │
          ├─► Receive credential token
          │
          ├─► Send to backend: POST /auth/google-signin
          │
          ├─► Backend verifies & creates JWT
          │
          ├─► Response: { token, user } with email
          │
          ├─► Frontend checks: email in ADMIN_EMAILS?
          │
          └─► YES ─► Save tokens (localStorage + cookies)
              │
              └─► Redirect to /admin
                  │
                  └─► END (Admin logged in, can see admin panel)
```

### Admin Login Flow - Unauthorized
```
START
  │
  └─► Navigate to /login/admin
      │
      ├─► Display "🔐 Admin Login" + warning
      │
      ├─► Display Google Sign-In button
      │
      └─► User clicks sign-in
          │
          ├─► Google OAuth popup
          │
          ├─► User authenticates with non-admin email
          │
          ├─► Receive credential token
          │
          ├─► Send to backend: POST /auth/google-signin
          │
          ├─► Backend verifies & creates JWT
          │
          ├─► Response: { token, user } with email
          │
          ├─► Frontend checks: email in ADMIN_EMAILS?
          │
          └─► NO ─► Clear loading state
              │
              ├─► Set error message
              │
              ├─► Display: "Access denied. You are not 
              │   authorized as an admin."
              │
              ├─► DO NOT redirect
              │
              ├─► DO NOT save tokens
              │
              └─► END (User stuck on login page, must retry)
```

---

## 🗄️ Data Storage After Login

### User Login
```
localStorage:
├── authToken: "eyJhbGciOiJIUzI1NiIs..." (JWT token)
└── user: { id: 1, name: "John", email: "john@example.com", ... }

Cookies (30-day expiry):
├── authToken: "eyJhbGciOiJIUzI1NiIs..."
├── userInfo: { id: 1, name: "John", ... }
└── userEmail: "john@example.com"

User Profile:
├── name: "John"
├── email: "john@example.com"
├── isAdmin: false

Navigation:
├── Navbar shows: "👤 John" + Settings + Logout
└── Can access: /, /kelas, /testimoni, /faq, /settings
```

### Admin Login
```
localStorage:
├── authToken: "eyJhbGciOiJIUzI1NiIs..." (JWT token)
└── user: { id: 5, name: "Patra", email: "patrasawali93@gmail.com", ... }

Cookies (30-day expiry):
├── authToken: "eyJhbGciOiJIUzI1NiIs..."
├── userInfo: { id: 5, name: "Patra", ... }
└── userEmail: "patrasawali93@gmail.com"

User Profile:
├── name: "Patra Sawali"
├── email: "patrasawali93@gmail.com"
├── isAdmin: true

Navigation:
├── Navbar shows: "👤 Patra Sawali" + Admin Panel + Settings + Logout
└── Can access: /, /admin, /settings, /kelas, /testimoni, /faq
```

---

## 🔑 Key Decision Points

```
┌─────────────────────────────────────────────┐
│ User arrives at application                 │
└────────────────┬────────────────────────────┘
                 │
           Is user logged in?
              /        \
            YES         NO
            /             \
           /               \
    ┌─────────┐        ┌────────────────┐
    │ Direct  │        │ Show "Login"   │
    │ to      │        │ button in nav  │
    │ home/   │        └────┬───────────┘
    │ admin   │             │
    │ (based  │        User clicks Login
    │ on role)│             │
    │         │        Navigate to /login
    └─────────┘             │
                       ┌────▼────┐
                       │Selection │
                       │ Page     │
                       └──┬───┬──┘
                          │   │
                      User/Admin
                        /     \
                       /       \
                   /login    /login
                   /user     /admin
                     │         │
        [User OAuth]  │         │  [User OAuth]
             │        │         │        │
        ┌────▼────┐   │         │   ┌────▼────┐
        │Save     │   │         │   │Validate │
        │tokens   │   │         │   │email    │
        └────┬────┘   │         │   └──┬──┬───┘
             │        │         │      │  │
             │     ┌──▼──┐      │    PASS FAIL
             │     │ /   │      │      │    │
             │     └─────┘      │   ┌──▼────▼──┐
             │                  │   │  /admin  │ Error
             │                  │   │  or      │ msg
             │                  │   │  Error   │
             │                  │   └─────────┘
             └──────────────────┘
```

---

## 🔐 Security Layers

```
Layer 1: Frontend Selection
┌─────────────────────────────────┐
│ User sees two options:          │
│ - User Login                    │
│ - Admin Login                   │
└─────────────────────────────────┘

Layer 2: Frontend Validation (User Experience)
┌─────────────────────────────────┐
│ AdminLoginPage validates email: │
│ if (email in ADMIN_EMAILS)      │
│   redirect to /admin            │
│ else                            │
│   show error message            │
└─────────────────────────────────┘

Layer 3: Backend Validation (Security)
┌─────────────────────────────────┐
│ Backend verifies:               │
│ - JWT token signature           │
│ - Token expiry                  │
│ - User exists in database       │
│ - (Optional) Admin flag in DB   │
└─────────────────────────────────┘

Layer 4: Protected Routes
┌─────────────────────────────────┐
│ Protected endpoints check:      │
│ - Valid token in request        │
│ - User has access to resource   │
│ - Role permissions              │
└─────────────────────────────────┘
```

---

## 📈 User Journey Map

```
                    ANONYMOUS USER
                         │
                ┌────────┴────────┐
                │                 │
              Visit        Click "Login"
              site                │
                │           Navigate /login
                │                 │
         View home      ┌────────┴─────────┐
         public         │Selection Page     │
         content      Choose Login Type
                        /              \
                   User /              \ Admin
                   Login               Login
                    │                   │
              OAuth →│                  │← OAuth
              Sign In                   
                │                   Email
                │                 Validation
             Save ←─┐         ┌─→  ✓ Pass
            token  │         │     │
             │   Redirect   Redirect
             │     to / (home)    to /admin
             │      │              │
        LOGGED IN    │         ADMIN LOGGED IN
        (User)       │           (Admin)
             │       │              │
          Can:       │           Can:
          ┌────────┐ │         ┌──────────┐
          │- View  │ │         │- View    │
          │  courses│           │  courses │
          │- View  │ │         │- Manage  │
          │  FAQs  │            │  courses │
          │- View  │ │         │- Manage  │
          │  tests │            │  FAQs    │
          │- Edit  │ │         │- Manage  │
          │  profile│           │  testimonial│
          │- Logout│ │         │- View    │
          └────────┘ │         │  users   │
                     │         │- Logout  │
                     │         └──────────┘
```

---

## ✅ Login Status Check Flows

### On Page Load
```
App.jsx mounts
    │
    ├─► Check localStorage for authToken
    │
    ├─► Token exists?
    │   │
    │   ├─ YES: Check if current route requires auth
    │   │       │
    │   │       └─ Protected route? 
    │   │           └─ YES: Allow access
    │   │           └─ NO: Show as normal
    │   │
    │   └─ NO: User is not logged in
    │         └─ Public routes: Show as normal
    │         └─ Protected routes: Redirect to /login
    │
    └─► Render appropriate page
```

### On Login Routes
```
LoginPage (/login)
    │
    └─► User not logged in?
        └─ YES: Show selection page
            (choose user or admin login)

UserLoginPage (/login/user)
    │
    └─► User already logged in?
        └─ NO: Show login form
        └─ YES: Redirect to /
                (already logged in)

AdminLoginPage (/login/admin)
    │
    └─► User already logged in AND is admin?
        └─ NO: Show login form
        └─ YES: Redirect to /admin
                (already logged in)
```

---

This diagram shows the complete architecture of the separated user and admin login system with all validation layers and user flows.
