# Courses Ngoding Backend

Backend API untuk aplikasi Courses Ngoding menggunakan Supabase sebagai database.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + Supabase Auth
- **Security**: bcryptjs, CORS, Rate Limiting

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Copy `.env` file and update the values:

```bash
cp .env.example .env
```

Required environment variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `JWT_SECRET`: Secret key for JWT tokens
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

### 3. Database Setup

1. Buat project baru di [Supabase](https://supabase.com)
2. Copy URL dan anon key ke file `.env`
3. Jalankan SQL schema di Supabase SQL Editor:

```sql
-- Copy paste isi file backend/data/schema.sql
```

### 4. Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:4000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get user profile

### Public API
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `GET /api/testimonials` - Get testimonials
- `GET /api/faq` - Get FAQ
- `POST /api/contact` - Submit contact form

### Protected API (User)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Admin API (Admin Only)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/courses` - Get all courses (admin)
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course
- `GET /api/admin/contacts` - Get contact submissions
- `GET /api/admin/stats` - Get dashboard statistics

## Authentication

API menggunakan JWT (JSON Web Tokens) untuk authentication. Sertakan token di header:

```
Authorization: Bearer <your_jwt_token>
```

## Admin Setup

Untuk membuat admin user pertama:

1. Register account normal
2. Update role di database Supabase:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

Atau gunakan admin panel jika sudah ada admin user.

## Deployment

### Vercel Deployment

1. Connect repository ke Vercel
2. Set environment variables di Vercel dashboard
3. Deploy

### Manual Deployment

```bash
npm run build  # if using build process
npm start
```

## Security Features

- JWT authentication
- Password hashing dengan bcryptjs
- Rate limiting
- CORS protection
- Input validation
- Row Level Security (RLS) di Supabase

## Development

### Available Scripts

- `npm start` - Production server
- `npm run dev` - Development server dengan nodemon
- `npm test` - Run tests (belum diimplementasi)

### Project Structure

```
backend/
├── data/
│   └── schema.sql          # Database schema
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── api.js             # Public API routes
│   └── admin.js           # Admin routes
├── .env                   # Environment variables
├── package.json
├── server.js              # Main server file
└── README.md
```

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License