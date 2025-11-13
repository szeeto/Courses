# Backend Crash Troubleshooting Guide

## 🔴 Error: `[nodemon] app crashed - waiting for file changes before starting...`

This error means the backend failed to start. Follow these steps in order:

---

## **Step 1: Check if MySQL is Running** (Most Common Issue)

### Windows:
```bash
# Check if MySQL service is running
sc query MySQL80

# If not running, start it:
net start MySQL80
```

### macOS:
```bash
brew services list | grep mysql
brew services start mysql
```

### Linux:
```bash
sudo systemctl status mysql
sudo systemctl start mysql
```

### Verify MySQL Connection:
```bash
mysql -h 127.0.0.1 -u root -p
# Press Enter if no password
# Type: SHOW DATABASES;
# Type: EXIT;
```

---

## **Step 2: Check if Port 4000 is Available**

```bash
# Windows (PowerShell):
netstat -ano | findstr :4000

# If something is using port 4000, kill it:
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :4000
kill -9 <PID>
```

---

## **Step 3: Verify Environment Variables**

Check that `.env` has all required variables:

```bash
# Check the .env file exists:
cat .env

# Should have:
GOOGLE_CLIENT_ID=85663400629-...
GOOGLE_CLIENT_SECRET=GOCSPX-...
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=courses_db
PORT=4000
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

---

## **Step 4: Check Backend Dependencies**

```bash
cd backend
npm install
npm list | grep -E "express|mysql2|google-auth"
```

All should be installed. If not:
```bash
npm install express cors mysql2 jsonwebtoken google-auth-library dotenv
```

---

## **Step 5: Clear Node Modules & Reinstall**

If still crashing:

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

## **Step 6: Run with Verbose Logging**

Start backend directly (not via npm run dev) to see full error:

```bash
cd backend
node server.js
```

This will show the **exact error message** that's causing the crash.

---

## **Step 7: Test Database Connection**

Create a test file `test-db.js` in the backend folder:

```javascript
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'courses_db'
})

try {
  const conn = await pool.getConnection()
  console.log('✅ Database connection successful!')
  await conn.release()
  process.exit(0)
} catch (err) {
  console.error('❌ Database connection failed:', err.message)
  process.exit(1)
}
```

Run it:
```bash
node test-db.js
```

---

## **Common Solutions**

| Error | Solution |
|-------|----------|
| MySQL connection refused | Start MySQL service |
| EADDRINUSE: port 4000 in use | Kill process on port 4000 |
| ENOENT: cannot find module | Run `npm install` in backend |
| undefined GOOGLE_CLIENT_ID | Check `.env` file exists |
| access denied for user root | Update MySQL password in `.env` |

---

## **If Still Not Working**

Copy and run the **full error message** and I'll help debug immediately.

The error should appear when you run:
```bash
cd backend
node server.js
```

**Share that error output with me!**
