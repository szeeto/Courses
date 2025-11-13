# Courses Backend

Simple Express backend to serve sample data for the Courses app.

Install:

```bash
cd backend
npm install
```

Run:

```bash
npm start
# or for development with auto-reload
npm run dev
```

API endpoints:
- GET /api/kelas
- GET /api/testimoni
- GET /api/faq
- POST /api/subscribe  -> JSON { email: "you@example.com" }

This is a minimal local backend for development and testing. For production, use a database and persist subscribers.
