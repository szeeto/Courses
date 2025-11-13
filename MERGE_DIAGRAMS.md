# 📊 Frontend & Backend Merge - Visual Diagrams

## System Architecture (After Merge)

```
┌─────────────────────────────────────────────────────────────────┐
│                    COURSES APPLICATION                          │
│                    (Monorepo Structure)                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐    ┌──────────────────────────────┐
│    FRONTEND (React + Vite)   │    │  BACKEND (Express + Node.js) │
│                              │    │                              │
│  Port: 5173                  │    │  Port: 4000                  │
│  Command: npm run dev:fe     │    │  Command: npm run dev:be     │
│                              │    │                              │
│  ├── src/                    │    │  ├── routes/                 │
│  │   ├── pages/             │    │  │   ├── api.js             │
│  │   │   ├── HomePage       │    │  │   └── auth.js            │
│  │   │   ├── LoginPage      │    │  ├── db.js                  │
│  │   │   └── ...            │    │  ├── server.js              │
│  │   ├── components/        │    │  ├── package.json           │
│  │   ├── hooks/             │    │  └── .env                   │
│  │   │   └── useAuth.js     │    │                              │
│  │   └── App.jsx            │    │                              │
│  ├── public/                │    │  MySQL Database              │
│  ├── index.html             │    │  • users                     │
│  ├── package.json           │    │  • kelas                     │
│  └── .env                   │    │  • testimonial               │
│                              │    │  • faq                       │
└──────────────────────────────┘    └──────────────────────────────┘
         │                                      │
         │        HTTP / JSON                   │
         │        (REST API)                    │
         └──────────────────────────────────────┘

                    ┌───────────────────┐
                    │  npm run dev      │
                    │  (Runs both!)     │
                    └───────────────────┘
```

---

## Command Flow - Single Command

```
npm run dev
    │
    ├─→ concurrently
    │   ├─→ npm run frontend:dev
    │   │   └─→ vite (Starts React @ :5173)
    │   │
    │   └─→ npm run backend:dev
    │       └─→ cd backend && npm run dev
    │           └─→ nodemon server.js (Starts Express @ :4000)
    │
    └─→ Both run simultaneously
        Both auto-reload on code changes
        Both show output in single terminal
```

---

## Request Flow - Frontend to Backend

```
User Types URL
    ↓
Browser Requests
    ↓
Vite (Frontend Server :5173)
    ├─ Serves HTML
    ├─ Serves React app
    ├─ Auto-reloads on src/ changes
    │
    └─→ Frontend App Loads
        │
        ├─→ useAuth() Hook
        │   └─ Manages authentication
        │      └─ Stores token in localStorage
        │
        └─→ API Call Needed
            ├─ GET /api/kelas
            ├─ POST /api/subscribe
            ├─ GET /auth/me
            └─ ...
                │
                ├─→ HTTP Request to :4000
                │   ├─ Header: Authorization: Bearer {token}
                │   ├─ Body: JSON data (if POST/PUT)
                │   └─ CORS allowed (backend configured)
                │
                └─→ Express Server (Backend :4000)
                    │
                    ├─→ CORS Middleware
                    │   └─ Check request origin
                    │
                    ├─→ Express Route Handler
                    │   ├─ Parse request
                    │   └─ Validate token (if protected)
                    │
                    ├─→ Database Query
                    │   ├─ Execute SQL
                    │   └─ Get results
                    │
                    └─→ JSON Response
                        ├─ Status code (200, 401, 500, etc)
                        ├─ Data or error message
                        └─ CORS headers
                            │
                            └─→ Back to Frontend
                                ├─ useApi() processes response
                                ├─ State updates
                                └─ Re-render component
                                    └─ User sees updated data!
```

---

## Development Workflow

```
START: npm run dev
│
├─ TERMINAL OUTPUT:
│  ├─ [0] Frontend: Local: http://localhost:5173
│  ├─ [0] Frontend: ready in xxx ms
│  ├─ [1] Backend: listening on http://localhost:4000
│  └─ [1] Database: connected
│
├─ EDIT CODE
│
├─ FRONTEND CHANGES (src/)
│  └─ Auto-reloaded by Vite
│     └─ Browser refreshes
│        └─ See changes immediately!
│
├─ BACKEND CHANGES (backend/)
│  └─ Auto-reloaded by nodemon
│     └─ API endpoints update
│        └─ Frontend can test immediately!
│
└─ ENVIRONMENT CHANGES (.env)
   └─ Need to restart npm run dev
      └─ New settings take effect
         └─ Test again
```

---

## File Structure Comparison

### Before Merge (Separate)

```
Courses/
├── frontend/          ← In one place
│   ├── src/
│   ├── package.json
│   └── .env
│
├── backend/           ← In another place
│   ├── routes/
│   ├── package.json
│   └── .env
│
❌ Need to run 2 commands in 2 terminals
❌ Hard to manage environment variables
❌ Confusing for team
```

### After Merge (Monorepo)

```
Courses/
├── src/               ← Frontend here
├── backend/           ← Backend here
│   ├── routes/
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── package.json       ← Controls both!
├── .env               ← Shared config
└── .env.example       ← Template

✅ Single npm run dev
✅ Unified .env management
✅ Easier for team
✅ Deploy as single project
```

---

## Environment Variable Flow

```
.env (Root)
│
├─→ FRONTEND VARIABLES
│   ├─ VITE_GOOGLE_CLIENT_ID
│   └─ VITE_BACKEND_URL
│      └─ Read by Vite during build
│         └─ Used in React components via import.meta.env
│
├─→ BACKEND VARIABLES
│   ├─ Via env.PORT
│   ├─ Via env.DB_HOST, DB_USER, etc.
│   ├─ Via env.GOOGLE_CLIENT_ID
│   ├─ Via env.JWT_SECRET
│   └─ Via env.FRONTEND_URL
│      └─ Read by Node.js via process.env
│         └─ Used in Express routes and db.js
│
└─ backend/.env (Duplicate for backend when run separately)
   └─ Same values as root .env
      └─ Ensures consistency
```

---

## API Endpoint Architecture

```
Browser Request
│
└─→ http://localhost:4000/auth/google-signin
    │
    ├─→ Express Server Receives
    │   ├─ CORS Middleware (allow cross-origin)
    │   ├─ JSON Parser (parse request body)
    │   └─ Route Handler
    │       │
    │       ├─→ Extract token from request
    │       │
    │       ├─→ Verify with Google
    │       │   └─ Using google-auth-library
    │       │
    │       ├─→ Create/Update User in MySQL
    │       │   ├─ Query: getUserByGoogleId()
    │       │   └─ Insert/Update: createOrUpdateUser()
    │       │
    │       ├─→ Generate JWT Token
    │       │   └─ Using jsonwebtoken
    │       │
    │       └─→ Return Response
    │           └─ JSON: { token, user, ok }
    │
    └─→ Browser Receives
        ├─ Save token to localStorage
        ├─ Save user to localStorage
        └─ Redirect to home page
            └─ User is authenticated! ✓
```

---

## Database Connection

```
Express Server (backend/server.js)
│
├─→ Import db.js
│   │
│   ├─→ initDB() called on startup
│   │   ├─ Create connection to MySQL
│   │   ├─ Create database if not exists
│   │   ├─ Create tables if not exists
│   │   │   ├─ users table
│   │   │   ├─ kelas table
│   │   │   ├─ testimonial table
│   │   │   └─ faq table
│   │   └─ Load seed data from data.json
│   │
│   └─→ Pool created for multiple connections
│       └─ pool.query(sql, params)
│           └─ Execute SQL
│               └─ Return results
│
├─→ Routes use db functions
│   ├─ getKelas()
│   ├─ getTestimonial()
│   ├─ getFaq()
│   ├─ createOrUpdateUser()
│   └─ getUserById()
│
└─→ MySQL Server (localhost:3306)
    └─ Database: courses_db
       ├─ users table (Google OAuth)
       ├─ kelas table (Courses)
       ├─ testimonial table
       └─ faq table
```

---

## Authentication Flow (Merged View)

```
USER INTERACTION
│
1. User visits http://localhost:5173/login
   │
   └─→ FRONTEND (React @ :5173)
       └─ LoginPage.jsx loads
           └─ Displays Google Sign-In button
               │
2. User clicks "Sign In"
   │
   └─→ GOOGLE SERVERS
       ├─ Authentication popup opens
       ├─ User enters credentials
       └─ Returns ID token
           │
3. Frontend receives token
   │
   └─→ FRONTEND
       └─ handleCredentialResponse()
           ├─ Extract token
           └─ POST to /auth/google-signin
               │
4. Token sent to backend
   │
   └─→ BACKEND (Express @ :4000)
       └─ /auth/google-signin route
           ├─ Verify token with Google
           │  └─ Using google-auth-library
           │
           ├─ Token valid → Continue
           │  └─ Token invalid → Return 401
           │
           ├─ Extract user data from token
           │  ├─ google_id
           │  ├─ email
           │  ├─ name
           │  └─ picture
           │
           ├─ Create/Update user in MySQL
           │  └─ INSERT or UPDATE users table
           │
           ├─ Generate JWT token
           │  └─ Using jsonwebtoken
           │     └─ Expires in 30 days
           │
           └─ Return response to frontend
               ├─ JWT token
               ├─ User data
               └─ Status: ok
                   │
5. Frontend receives response
   │
   └─→ FRONTEND
       ├─ Store JWT in localStorage
       ├─ Store user data in localStorage
       └─ Redirect to home page
           │
6. User is authenticated!
   │
   └─→ Can now:
       ├─ Access protected pages
       ├─ Make authenticated API calls
       │  └─ Authorization header: Bearer {token}
       ├─ See user profile
       └─ Logout when done
```

---

## Deployment Architecture

```
DEVELOPMENT (Your Machine)
├─ npm run dev
├─ Frontend: http://localhost:5173
├─ Backend: http://localhost:4000
└─ Database: localhost:3306

PRODUCTION (Cloud Servers)
├─ Frontend Server (Vercel/Netlify)
│  ├─ Built files in dist/
│  ├─ Served from https://yourdomain.com
│  ├─ Calls backend API
│  └─ Uses VITE_BACKEND_URL=https://api.yourdomain.com
│
├─ Backend Server (Heroku/AWS/DigitalOcean)
│  ├─ Node.js running
│  ├─ Serves API on https://api.yourdomain.com
│  ├─ CORS configured for frontend domain
│  └─ Uses production environment variables
│
└─ Database Server (Amazon RDS/DigitalOcean)
   ├─ MySQL managed service
   ├─ Regular backups
   └─ Secure connection (SSL)
```

---

These diagrams show how frontend and backend work together in the merged setup!
