import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import { createOrUpdateUser, getUserById, pool } from '../db.js'
import { env } from 'process'
import bcrypt from 'bcrypt'

const router = Router()

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID)
const JWT_SECRET = env.JWT_SECRET || 'your-secret-key-change-in-production'

// Verify token middleware
export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (err) {
    console.error('Token verification error:', err)
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Email/Password Registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if user already exists
    const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (google_id, email, name, password, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [`user_${Date.now()}`, email, name, hashedPassword]
    )

    const userId = result.insertId
    const user = await getUserById(userId)

    // Create JWT token
    const jwtToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '30d',
    })

    return res.status(201).json({
      ok: true,
      message: 'Registration successful',
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (err) {
    console.error('Registration error:', err)
    return res.status(500).json({ error: 'Registration failed' })
  }
})

// Email/Password Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user by email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = users[0]

    // Check password
    if (!user.password) {
      return res.status(401).json({ error: 'This account uses Google OAuth. Please use Google Sign In.' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Update last_login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id])
    // Simpan riwayat login
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '';
    await pool.query('INSERT INTO login_history (user_id, ip_address) VALUES (?, ?)', [user.id, ip])

    // Create JWT token
    const jwtToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '30d',
    })

    return res.json({
      ok: true,
      message: 'Login successful',
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Login failed' })
  }
})

// Google Sign In
router.post('/google-signin', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token required' });

  try {
    console.log('Processing Google Sign In...');
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
    console.log('Google payload verified:', { googleId, email, name });

    let user = await createOrUpdateUser(googleId, email, name, picture);
    if (!user) {
      console.error('Failed to create/update user in database');
      return res.status(500).json({ error: 'Failed to create/update user' });
    }

    // Tentukan role admin jika email cocok
    let role = 'user';
    if (email === 'patrasawali93@gmail.com') {
      role = 'admin';
      await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, user.id]);
    }

    // Update last_login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
    // Simpan riwayat login
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '';
    await pool.query('INSERT INTO login_history (user_id, ip_address) VALUES (?, ?)', [user.id, ip]);

    // Create JWT token
    const jwtToken = jwt.sign({ userId: user.id, email: user.email, role }, JWT_SECRET, {
      expiresIn: '30d',
    });

    console.log('JWT token generated for user:', user.id);

    return res.json({
      ok: true,
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role,
      },
    });
  } catch (err) {
    console.error('Google signin error:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await getUserById(req.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    return res.json({ ok: true, data: user })
  } catch (err) {
    console.error('Get user error:', err)
    return res.status(500).json({ error: 'Failed to get user' })
  }
})

// Update user profile
router.put('/update-profile', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' })
    }

    // Check if email is already taken by another user
    const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, req.userId])
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    // Update user
    await pool.query('UPDATE users SET name = ?, email = ?, updated_at = NOW() WHERE id = ?', [
      name,
      email,
      req.userId,
    ])

    // Get updated user
    const user = await getUserById(req.userId)
    return res.json({
      ok: true,
      message: 'Profile updated successfully',
      data: user,
    })
  } catch (err) {
    console.error('Update profile error:', err)
    return res.status(500).json({ error: 'Failed to update profile' })
  }
})

// Delete user account
router.delete('/delete-account', verifyToken, async (req, res) => {
  try {
    // Delete user from database
    await pool.query('DELETE FROM users WHERE id = ?', [req.userId])
    
    return res.json({
      ok: true,
      message: 'Account deleted successfully',
    })
  } catch (err) {
    console.error('Delete account error:', err)
    return res.status(500).json({ error: 'Failed to delete account' })
  }
})

// Logout (client-side handled, but optional backend route)
router.post('/logout', verifyToken, (req, res) => {
  console.log('User logout:', req.userId)
  // Token is typically invalidated on client side
  return res.json({ ok: true, message: 'Logged out successfully' })
})

// Check auth status
router.get('/status', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.json({ authenticated: false })
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return res.json({ 
      authenticated: true, 
      userId: decoded.userId,
      email: decoded.email 
    })
  } catch {
    return res.json({ authenticated: false })
  }
})

// Admin Login
router.post('/admin-login', async (req, res) => {
  const { email, password } = req.body
  const ADMIN_EMAILS = ['patrasawali93@gmail.com']

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Check if email is in admin list
    if (!ADMIN_EMAILS.includes(email)) {
      return res.status(403).json({ error: 'Admin access denied' })
    }

    // Find user by email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = users[0]

    // Check password
    if (!user.password) {
      return res.status(401).json({ error: 'This account uses Google OAuth. Please use Google Sign In.' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Update last_login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id])
    // Simpan riwayat login
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '';
    await pool.query('INSERT INTO login_history (user_id, ip_address) VALUES (?, ?)', [user.id, ip])

    // Create JWT token
    const jwtToken = jwt.sign({ userId: user.id, email: user.email, role: 'admin' }, JWT_SECRET, {
      expiresIn: '30d',
    })

    return res.json({
      ok: true,
      message: 'Admin login successful',
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: 'admin',
      },
    })
  } catch (err) {
    console.error('Admin login error:', err)
    return res.status(500).json({ error: 'Admin login failed' })
  }
})

// User Login
router.post('/user-login', async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user by email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = users[0]

    // Check password
    if (!user.password) {
      return res.status(401).json({ error: 'This account uses Google OAuth. Please use Google Sign In.' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Update last_login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id])
    // Simpan riwayat login
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '';
    await pool.query('INSERT INTO login_history (user_id, ip_address) VALUES (?, ?)', [user.id, ip])

    // Create JWT token
    const jwtToken = jwt.sign({ userId: user.id, email: user.email, role: 'user' }, JWT_SECRET, {
      expiresIn: '30d',
    })

    return res.json({
      ok: true,
      message: 'User login successful',
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: 'user',
      },
    })
  } catch (err) {
    console.error('User login error:', err)
    return res.status(500).json({ error: 'User login failed' })
  }
})

export default router
