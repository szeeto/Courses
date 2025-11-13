# Google OAuth Authentication Setup Guide

This guide will help you set up Google OAuth authentication for your Courses application.

## Prerequisites

- Google Cloud Console account
- Node.js 16+ installed
- MySQL database running

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (if you don't have one)
3. Enable the "Google+ API"
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth Client ID"
6. Choose "Web application"
7. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `http://localhost:3000` (alternative)
   - Your production domain
8. Add authorized redirect URIs:
   - `http://localhost:5173/` (for development)
   - Your production domain with `/` path
9. Copy your **Client ID** and **Client Secret**

## Fixing the "You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy" error

If you see "You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy" during sign-in, the most common cause is that your app is unverified or the OAuth consent screen is not configured for testing. Follow these steps to unblock development quickly:

1. Open Google Cloud Console → APIs & Services → OAuth consent screen.
2. Set the **Publishing status** to **Testing** (not Production). This allows test users to sign in without full verification.
3. Under **Test users**, add the Google account(s) you will use to sign in (your developer account email). This is required while the app is in Testing.
4. Make sure the following fields are filled (minimum required for Testing):
  - App name
  - Support email (your email)
  - Developer contact email
5. Under **Credentials** → choose your OAuth 2.0 Client ID, then set **Authorized JavaScript origins** to:
  - `http://localhost:5173`
6. (Optional but recommended) Add a reachable Privacy Policy URL and Terms of Service URL. You can use the simple files in the repo (`/public/privacy.html`, `/public/terms.html`) while testing or host equivalent pages.
7. Save changes. Wait a minute, then try signing in again with a Test User account.

If you require sensitive or restricted scopes beyond `openid`, `profile`, and `email`, you'll need to prepare verification materials (privacy policy, home page, screencast) and submit the app for verification. For development/testing, remove any extra scopes if possible.


## Step 2: Backend Setup

### Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `express` - Web framework
- `cors` - Cross-origin requests
- `mysql2` - MySQL database
- `jsonwebtoken` - JWT tokens
- `google-auth-library` - Google OAuth verification
- `dotenv` - Environment variables

### Configure Backend Environment

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=courses_db

# Server Configuration
PORT=4000

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_from_google_console
GOOGLE_CLIENT_SECRET=your_client_secret_from_google_console
JWT_SECRET=your_secure_secret_key_here_change_in_production

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Start Backend Server

```bash
npm run dev      # Development with nodemon
# or
npm start        # Production
```

The server will initialize the MySQL database automatically on first run.

## Step 3: Frontend Setup

### Configure Frontend Environment

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_CLIENT_ID=your_client_id_from_google_console
VITE_BACKEND_URL=http://localhost:4000
```

### Start Frontend Development Server

```bash
npm run dev
```

Visit `http://localhost:5173/login` to see the login page.

## Step 4: How It Works

### Authentication Flow

1. **User clicks "Sign In with Google"** on `/login` page
2. **Google Sign-In popup** opens
3. **User authenticates** with their Google account
4. **Frontend receives ID token** from Google
5. **Frontend sends token to backend** (`/auth/google-signin`)
6. **Backend verifies token** with Google's servers
7. **Backend creates/updates user** in MySQL database
8. **Backend returns JWT token** to frontend
9. **Frontend stores JWT** in localStorage
10. **Frontend redirects** to home page
11. **User is authenticated** for subsequent API calls

### API Endpoints

#### POST `/auth/google-signin`
Sign in with Google token

**Request:**
```json
{
  "token": "google_id_token_from_frontend"
}
```

**Response:**
```json
{
  "ok": true,
  "token": "jwt_token_for_future_requests",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://..."
  }
}
```

#### GET `/auth/me`
Get current authenticated user

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "ok": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://..."
  }
}
```

#### POST `/auth/logout`
Logout (token invalidated on client side)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "ok": true,
  "message": "Logged out successfully"
}
```

## Step 5: Using Authentication in Your Application

### Check if User is Logged In

```javascript
const user = JSON.parse(localStorage.getItem('user') || 'null')
if (user) {
  // User is logged in
}
```

### Get Auth Token for API Calls

```javascript
const token = localStorage.getItem('authToken')
fetch('/api/protected-endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### Logout

```javascript
localStorage.removeItem('authToken')
localStorage.removeItem('user')
window.location.href = '/'
```

## Step 6: Update NavbarComponents (Optional)

Add a "Login" button or "Profile" menu in your navbar to link to `/login`.

```jsx
<Link to="/login" className="btn btn-primary">
  Sign In with Google
</Link>
```

## Database Schema

The authentication system creates a `users` table:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  google_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  picture TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Production Deployment

### For Backend (e.g., Heroku, DigitalOcean, AWS)

1. Set environment variables on your hosting platform:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `JWT_SECRET` (use a strong random string)
   - MySQL connection variables
   - `PORT` (usually 4000 or 5000)

2. Deploy the `backend/` folder to your hosting

### For Frontend (e.g., Vercel, Netlify)

1. Create `.env.production` file:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_production_client_id
   VITE_BACKEND_URL=https://your-api-domain.com
   ```

2. Update Google Console with production domain URLs

3. Deploy using your preferred platform

## Troubleshooting

### "Invalid token" Error
- Ensure `GOOGLE_CLIENT_ID` matches in Google Console and `.env`
- Check that the token hasn't expired (Google tokens expire after 1 hour)
- Verify backend can reach Google's servers

### "Failed to create/update user" Error
- Check MySQL connection (verify credentials in `.env`)
- Ensure `users` table was created (check database)
- Check database user has INSERT/UPDATE permissions

### CORS Error
- Verify `frontend:frontend` URL is in Google OAuth authorized origins
- Check `CORS` middleware is enabled in backend (`cors` package)

### "User not found" on `/auth/me`
- Token may have expired (user needs to sign in again)
- User record may have been deleted from database
- Check `users` table has the record

## Security Notes

1. **JWT_SECRET**: Use a strong random string in production (minimum 32 characters)
2. **HTTPS**: Always use HTTPS in production
3. **Token Storage**: Consider using httpOnly cookies instead of localStorage for production
4. **Refresh Tokens**: For production, implement refresh token mechanism
5. **Rate Limiting**: Add rate limiting to `/auth/google-signin` to prevent abuse
6. **CORS**: Restrict CORS to your frontend domain in production

## Next Steps

- Add "Login" button to Navbar
- Implement protected pages (require authentication)
- Add user profile page
- Implement refresh tokens
- Add social links to other providers (GitHub, Facebook, etc.)
