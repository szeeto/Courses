# Supabase Edge Functions

This directory contains Supabase Edge Functions that replace the Express.js backend server.

## Functions

### Auth Functions
- `auth/register.ts` - User registration
- `auth/login.ts` - User login
- `auth/profile.ts` - Get user profile

### API Functions
- `api/courses.ts` - Get all courses

### Admin Functions
- `admin/users.ts` - Get all users (admin only)

## Deployment

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref xuzqgxffbnpiezlkxmsv
```

4. Deploy functions:
```bash
supabase functions deploy auth-register
supabase functions deploy auth-login
supabase functions deploy auth-profile
supabase functions deploy api-courses
supabase functions deploy admin-users
```

## Environment Variables

Make sure to set these environment variables in your Supabase project:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon key
- `JWT_SECRET` - Secret key for JWT tokens

## Testing

You can test the functions locally:

```bash
supabase start
supabase functions serve
```

Then call them at: `http://localhost:54321/functions/v1/function-name`