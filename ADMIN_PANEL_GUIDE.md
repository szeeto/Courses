# Admin Panel Setup Guide

## 🎛️ Admin Panel Features

Your Courses application now includes a comprehensive admin panel for managing:
- 📚 **Courses** - Create, edit, delete courses
- ⭐ **Testimonials** - Manage user testimonials
- ❓ **FAQs** - Create and manage frequently asked questions
- 👥 **Users** - View all registered users
- 📧 **Subscribers** - Manage email subscribers
- 📊 **Dashboard** - View statistics

---

## 🚀 Accessing the Admin Panel

### URL
```
http://localhost:5173/admin
```

### Requirements
1. You must be **logged in** with Google OAuth
2. Your email must be in the **admin emails list**

---

## 🔐 Setting Up Admin Access

### Step 1: Add Your Email as Admin

Edit the admin middleware in `backend/routes/admin.js`:

```javascript
// Around line 12-13:
const ADMIN_EMAILS = ['your-email@gmail.com', 'admin@example.com']
```

Replace `your-email@gmail.com` with your actual email address that you use to sign in with Google OAuth.

**Example:**
```javascript
const ADMIN_EMAILS = ['john@gmail.com', 'jane@gmail.com']
```

### Step 2: Restart Backend

After updating the admin emails, restart the backend:

```bash
npm run dev
```

### Step 3: Log In with Admin Account

1. Go to `http://localhost:5173/login`
2. Click "Sign In with Google"
3. Sign in with an email that matches your `ADMIN_EMAILS` list
4. Navigate to `http://localhost:5173/admin`
5. You should see the admin dashboard! 🎉

---

## 📋 Admin Features

### Dashboard Tab
- **View Statistics**: See total counts for:
  - Courses
  - Testimonials
  - FAQs
  - Users
  - Subscribers

### Courses Tab
- **View all courses** from the database
- **Create course** (coming soon)
- **Edit course** details (coming soon)
- **Delete course** from the system

**API Endpoint**: `GET/POST/PUT/DELETE /admin/kelas`

### Testimonials Tab
- **View all testimonials**
- **Create testimonial** (coming soon)
- **Edit testimonial** (coming soon)
- **Delete testimonial** from the system

**API Endpoint**: `GET/POST/PUT/DELETE /admin/testimonial`

### FAQs Tab
- **View all FAQs**
- **Create FAQ** (coming soon)
- **Edit FAQ** (coming soon)
- **Delete FAQ** from the system

**API Endpoint**: `GET/POST/PUT/DELETE /admin/faq`

### Users Tab
- **View all registered users**
- **See user details**: ID, email, name, join date
- User management (coming soon)

**API Endpoint**: `GET /admin/users`

### Subscribers Tab
- **View all email subscribers**
- **See subscription date**
- **Remove subscriber** from list

**API Endpoint**: `GET /admin/subscribers`, `DELETE /admin/subscribers/:id`

---

## 🔗 API Endpoints

All admin endpoints require authentication (`Authorization: Bearer {token}`).

### Authentication Required (Admin Only)

```
POST   /admin/kelas              - Create course
PUT    /admin/kelas/:id          - Update course
DELETE /admin/kelas/:id          - Delete course

POST   /admin/testimonial        - Create testimonial
PUT    /admin/testimonial/:id    - Update testimonial
DELETE /admin/testimonial/:id    - Delete testimonial

POST   /admin/faq                - Create FAQ
PUT    /admin/faq/:id            - Update FAQ
DELETE /admin/faq/:id            - Delete FAQ

GET    /admin/users              - Get all users
GET    /admin/users/:id          - Get specific user

GET    /admin/subscribers        - Get all subscribers
DELETE /admin/subscribers/:id    - Delete subscriber

GET    /admin/stats              - Get dashboard statistics
```

### Public Endpoints (No Auth Required)

```
GET    /admin/kelas              - Get all courses
GET    /admin/testimonial        - Get all testimonials
GET    /admin/faq                - Get all FAQs
```

---

## 📝 Example API Usage

### Get Dashboard Statistics

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:4000/admin/stats
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "courses": 5,
    "testimonials": 8,
    "faqs": 12,
    "users": 23,
    "subscribers": 45
  }
}
```

### Delete a Course

```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:4000/admin/kelas/1
```

### Create a New Course

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"React Basics","image":"url","price":"$49"}' \
  http://localhost:4000/admin/kelas
```

---

## 🎯 Coming Soon Features

- ✏️ **Inline Editing** - Edit courses, testimonials, FAQs directly in table
- ➕ **Create Forms** - Dedicated forms for creating new items
- 📤 **Bulk Upload** - Import data from CSV/Excel
- 📊 **Advanced Analytics** - More detailed statistics
- 🔐 **Role-Based Access** - Multiple admin roles (editor, viewer, etc.)
- 📧 **Email Management** - Send bulk emails to subscribers
- 🎨 **Theme Customization** - Change admin panel appearance

---

## 🆘 Troubleshooting

### "Admin access required" Error
- ❌ Your email is **not** in the `ADMIN_EMAILS` list
- ✅ Add your email to `backend/routes/admin.js`
- ✅ Restart the backend with `npm run dev`

### "You must be logged in" Error
- ❌ You're not logged in with Google OAuth
- ✅ Go to `http://localhost:5173/login`
- ✅ Sign in with Google first
- ✅ Then navigate to `/admin`

### Buttons Not Working
- ❌ Edit/Create features are not yet fully implemented
- ✅ Delete functionality is available and working
- ✅ View functionality is fully working

### Database Connection Error
- ❌ MySQL server is not running
- ✅ Start MySQL on your machine
- ✅ Verify credentials in `.env`

---

## 🔒 Security Notes

1. **Admin Access**: Only emails in `ADMIN_EMAILS` can access admin panel
2. **JWT Token**: Must have valid JWT token from Google OAuth
3. **HTTPS**: Use HTTPS in production
4. **Environment Variables**: Keep `.env` file secure and don't commit to Git
5. **Admin Emails**: Move to database or environment variables in production

---

## 📚 Files Created/Modified

### New Files
- `backend/routes/admin.js` - Admin API endpoints
- `src/pages/AdminPage.jsx` - Admin dashboard component
- `src/pages/AdminPage.css` - Admin panel styling

### Modified Files
- `backend/server.js` - Added admin router
- `src/App.jsx` - Added admin route
- `backend/db.js` - Exported pool for admin queries

---

## 🎓 Next Steps

1. **Set your admin email** in `backend/routes/admin.js`
2. **Restart backend** with `npm run dev`
3. **Log in** with your Google account
4. **Visit** `http://localhost:5173/admin`
5. **Explore** the admin panel features!

---

**Your admin panel is ready! 🚀**

Start managing your courses, testimonials, and users from the admin dashboard.
